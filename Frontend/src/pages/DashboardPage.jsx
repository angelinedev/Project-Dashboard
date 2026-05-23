import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import PriorityHeatmapCard from "@/components/analytics/PriorityHeatmapCard.jsx";
import AuditTrailPreview from "@/components/audit/AuditTrailPreview.jsx";
import JoinTeamModal from "@/components/dashboard/JoinTeamModal.jsx";
import KanbanPreviewCard from "@/components/dashboard/KanbanPreviewCard.jsx";
import AppShell from "@/components/layout/AppShell.jsx";
import Sidebar from "@/components/layout/Sidebar.jsx";
import TopBar from "@/components/layout/TopBar.jsx";
import api, { getApiErrorMessage } from "@/services/api.js";
import {
  clearSession,
  getStoredMemberships,
  getStoredSelectedTeamId,
  getStoredUser,
  persistSession,
  setStoredSelectedTeamId,
} from "@/utils/authStorage.js";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getStoredUser());
  const [memberships, setMemberships] = useState(() => getStoredMemberships());
  const [selectedTeamId, setSelectedTeamIdState] = useState(() => getStoredSelectedTeamId());
  const [tasks, setTasks] = useState([]);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [joinError, setJoinError] = useState("");
  const [dashboardError, setDashboardError] = useState("");
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isJoiningTeam, setIsJoiningTeam] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState("");

  const selectedTeam = useMemo(
    () =>
      memberships.find((membership) => membership.team?.id === selectedTeamId)?.team ||
      memberships[0]?.team ||
      null,
    [memberships, selectedTeamId],
  );

  const syncTeamSelection = (teamId) => {
    setSelectedTeamIdState(teamId);
    setStoredSelectedTeamId(teamId);
  };

  const handleUnauthorized = () => {
    clearSession();
    navigate("/login", { replace: true });
  };

  const fetchProfile = async () => {
    setIsLoadingProfile(true);
    setDashboardError("");

    try {
      const response = await api.get("/users/me");
      const payload = response.data.data;
      setUser(payload.user);
      setMemberships(payload.memberships);

      const currentTeamStillExists = payload.memberships.some(
        (membership) => membership.team?.id === selectedTeamId,
      );
      const fallbackTeamId = payload.memberships[0]?.team?.id || "";

      if (!selectedTeamId || !currentTeamStillExists) {
        syncTeamSelection(fallbackTeamId);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        handleUnauthorized();
        return;
      }

      setDashboardError(getApiErrorMessage(error));
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const fetchTasks = async (teamId = selectedTeamId) => {
    setIsLoadingTasks(true);
    setDashboardError("");

    try {
      const response = await api.get("/tasks", {
        params: teamId ? { teamId } : {},
      });

      setTasks(response.data.data || []);
    } catch (error) {
      if (error.response?.status === 401) {
        handleUnauthorized();
        return;
      }

      setDashboardError(getApiErrorMessage(error));
    } finally {
      setIsLoadingTasks(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (isLoadingProfile) {
      return;
    }

    fetchTasks(selectedTeamId);
  }, [selectedTeamId, isLoadingProfile]);

  const handleLogout = () => {
    clearSession();
    navigate("/login", { replace: true });
  };

  const handleJoinTeam = async (inviteCode) => {
    setJoinError("");
    setIsJoiningTeam(true);

    try {
      const response = await api.post("/auth/join-team", { inviteCode });
      const payload = response.data.data;

      persistSession(payload);
      setUser(payload.user);
      setMemberships(payload.memberships);

      const nextTeamId = payload.memberships[0]?.team?.id || "";
      syncTeamSelection(nextTeamId);
      setIsJoinModalOpen(false);
      await fetchTasks(nextTeamId);
    } catch (error) {
      if (error.response?.status === 401) {
        handleUnauthorized();
        return;
      }

      setJoinError(getApiErrorMessage(error));
    } finally {
      setIsJoiningTeam(false);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    setUpdatingTaskId(taskId);
    setDashboardError("");

    try {
      const response = await api.patch(`/tasks/${taskId}/status`, { status });
      const updatedTask = response.data.data;

      setTasks((currentTasks) =>
        currentTasks.map((task) => (task.id === taskId ? updatedTask : task)),
      );
    } catch (error) {
      if (error.response?.status === 401) {
        handleUnauthorized();
        return;
      }

      setDashboardError(getApiErrorMessage(error));
    } finally {
      setUpdatingTaskId("");
    }
  };

  return (
    <>
      <AppShell
        sidebar={
          <Sidebar
            user={user}
            memberships={memberships}
            selectedTeamId={selectedTeam?.id || ""}
            onSelectTeam={syncTeamSelection}
            onOpenJoinTeam={() => {
              setJoinError("");
              setIsJoinModalOpen(true);
            }}
          />
        }
        topBar={
          <TopBar
            selectedTeam={selectedTeam}
            taskCount={tasks.length}
            onOpenJoinTeam={() => {
              setJoinError("");
              setIsJoinModalOpen(true);
            }}
            onLogout={handleLogout}
          />
        }
      >
        <section className="grid gap-6">
          {dashboardError && (
            <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-600">
              {dashboardError}
            </div>
          )}

          {!isLoadingProfile && memberships.length === 0 && (
            <div className="rounded-[28px] border border-dashed border-slate-200 bg-white px-6 py-10 text-center shadow-panel">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">
                Team setup
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-900">
                Your account is ready. Join a team to unlock the live board.
              </h2>
              <p className="mt-3 text-slate-500">
                Use the invitation code from your team leader to connect your
                account and start receiving assignments.
              </p>
              <button
                type="button"
                onClick={() => setIsJoinModalOpen(true)}
                className="mt-6 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
              >
                Join with code
              </button>
            </div>
          )}

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(360px,0.9fr)]">
            <KanbanPreviewCard
              tasks={tasks}
              isLoading={isLoadingTasks || isLoadingProfile}
              selectedTeam={selectedTeam}
              updatingTaskId={updatingTaskId}
              onStatusChange={handleStatusChange}
            />
            <AuditTrailPreview tasks={tasks} selectedTeam={selectedTeam} />
          </div>

          <PriorityHeatmapCard tasks={tasks} />
        </section>
      </AppShell>

      <JoinTeamModal
        isOpen={isJoinModalOpen}
        isSubmitting={isJoiningTeam}
        errorMessage={joinError}
        onClose={() => setIsJoinModalOpen(false)}
        onSubmit={handleJoinTeam}
      />
    </>
  );
};

export default DashboardPage;
