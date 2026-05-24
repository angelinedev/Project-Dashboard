import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import PriorityHeatmapCard from "@/components/analytics/PriorityHeatmapCard.jsx";
import AuditTrailPreview from "@/components/audit/AuditTrailPreview.jsx";
import JoinTeamModal from "@/components/dashboard/JoinTeamModal.jsx";
import KanbanPreviewCard from "@/components/dashboard/KanbanPreviewCard.jsx";
import LeadershipPanel from "@/components/dashboard/LeadershipPanel.jsx";
import TaskStudioPanel from "@/components/dashboard/TaskStudioPanel.jsx";
import TeamRosterCard from "@/components/dashboard/TeamRosterCard.jsx";
import TeamGrid from "@/components/dashboard/TeamGrid.jsx";
import PerformanceAnalytics from "@/components/analytics/PerformanceAnalytics.jsx";
import MemberManagementPanel from "@/components/dashboard/MemberManagementPanel.jsx";
import MyTasksPanel from "@/components/dashboard/MyTasksPanel.jsx";
import AppShell from "@/components/layout/AppShell.jsx";
import Sidebar from "@/components/layout/Sidebar.jsx";
import TopBar from "@/components/layout/TopBar.jsx";
import ProfileModal from "@/components/profile/ProfileModal.jsx";
import api, { getApiErrorMessage } from "@/services/api.js";
import {
  clearSession,
  getStoredMemberships,
  getStoredSelectedTeamId,
  getStoredUser,
  persistMemberships,
  persistUser,
  persistSession,
  setStoredSelectedTeamId,
} from "@/utils/authStorage.js";
import { dashboardSections } from "@/utils/navigation.js";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getStoredUser());
  const [memberships, setMemberships] = useState(() => getStoredMemberships());
  const [selectedTeamId, setSelectedTeamIdState] = useState(() => getStoredSelectedTeamId());
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [usersDirectory, setUsersDirectory] = useState([]);
  const [analyticsData, setAnalyticsData] = useState([]);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const [activeView, setActiveView] = useState("board");
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [joinError, setJoinError] = useState("");
  const [dashboardError, setDashboardError] = useState("");
  const [taskError, setTaskError] = useState("");
  const [leadershipError, setLeadershipError] = useState("");
  const [profileError, setProfileError] = useState("");
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isJoiningTeam, setIsJoiningTeam] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState("");
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);
  const [isUpdatingLeader, setIsUpdatingLeader] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const selectedTeam = useMemo(
    () =>
      memberships.find((membership) => membership.team?.id === selectedTeamId)?.team ||
      memberships[0]?.team ||
      null,
    [memberships, selectedTeamId],
  );

  const selectedMembership = useMemo(
    () => memberships.find((membership) => membership.team?.id === selectedTeam?.id) || null,
    [memberships, selectedTeam],
  );

  const isMegaLeader = user?.platformRole === "mega_leader";
  const isTeamLeader = user?.platformRole === "team_leader";
  const canManageSelectedTeam =
    Boolean(selectedTeam) &&
    (isMegaLeader || isTeamLeader || selectedMembership?.role === "leader");

  const visibleSections = useMemo(
    () =>
      dashboardSections.filter((section) => {
        if (section.id === "leadership") {
          return isMegaLeader;
        }

        if (section.id === "assignments") {
          return canManageSelectedTeam;
        }

        return true;
      }),
    [canManageSelectedTeam, isMegaLeader],
  );

  const syncTeamSelection = (teamId) => {
    setSelectedTeamIdState(teamId);
    setStoredSelectedTeamId(teamId);
  };

  const handleUnauthorized = () => {
    clearSession();
    navigate("/login", { replace: true });
  };

  const fetchUsersDirectory = async () => {
    try {
      const response = await api.get("/users");
      setUsersDirectory(response.data.data || []);
    } catch (error) {
      if (error.response?.status === 401) {
        handleUnauthorized();
        return;
      }

      setLeadershipError(getApiErrorMessage(error));
    }
  };

  const fetchAnalytics = async () => {
    setIsLoadingAnalytics(true);
    try {
      const response = await api.get("/teams/analytics");
      setAnalyticsData(response.data.data || []);
    } catch (error) {
      setDashboardError(getApiErrorMessage(error));
    } finally {
      setIsLoadingAnalytics(false);
    }
  };

  const fetchProfile = async () => {
    setIsLoadingProfile(true);
    setDashboardError("");

    try {
      const response = await api.get("/users/me");
      const payload = response.data.data;
      setUser(payload.user);
      setMemberships(payload.memberships);
      persistUser(payload.user);
      persistMemberships(payload.memberships);

      const currentTeamStillExists = payload.memberships.some(
        (membership) => membership.team?.id === selectedTeamId,
      );
      const fallbackTeamId = payload.memberships[0]?.team?.id || "";

      if (!selectedTeamId || !currentTeamStillExists) {
        syncTeamSelection(fallbackTeamId);
      }

      if (payload.user?.platformRole === "mega_leader") {
        await fetchUsersDirectory();
        await fetchAnalytics();
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

  const fetchMembers = async (teamId = selectedTeamId) => {
    if (!teamId) {
      setMembers([]);
      return;
    }

    setIsLoadingMembers(true);

    try {
      const response = await api.get(`/teams/${teamId}/members`);
      setMembers(response.data.data || []);
    } catch (error) {
      if (error.response?.status === 401) {
        handleUnauthorized();
        return;
      }

      setDashboardError(getApiErrorMessage(error));
    } finally {
      setIsLoadingMembers(false);
    }
  };

  const fetchTasks = async (teamId = selectedTeamId) => {
    if (!teamId) {
      setTasks([]);
      return;
    }

    setIsLoadingTasks(true);
    setDashboardError("");

    try {
      const response = await api.get("/tasks", {
        params: { teamId },
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

    if (isMegaLeader) {
      fetchAnalytics();
    }

    if (selectedTeamId) {
      fetchTasks(selectedTeamId);
      fetchMembers(selectedTeamId);
    }
  }, [selectedTeamId, isLoadingProfile, isMegaLeader]);

  useEffect(() => {
    if (visibleSections.some((section) => section.id === activeView)) {
      return;
    }

    setActiveView("board");
  }, [activeView, visibleSections]);

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

  const handleCreateTask = async (values) => {
    if (!selectedTeam?.id) {
      setTaskError("Select a team before assigning tasks.");
      return false;
    }

    setTaskError("");
    setIsCreatingTask(true);

    try {
      await api.post("/tasks", {
        teamId: selectedTeam.id,
        title: values.title,
        assignedTo: values.assignedTo || undefined,
        dueDate: values.dueDate || undefined,
        priority: values.priority,
      });

      await fetchTasks(selectedTeam.id);
      return true;
    } catch (error) {
      if (error.response?.status === 401) {
        handleUnauthorized();
        return false;
      }

      setTaskError(getApiErrorMessage(error));
      return false;
    } finally {
      setIsCreatingTask(false);
    }
  };

  const handleCreateTeam = async (values) => {
    setLeadershipError("");
    setIsCreatingTeam(true);

    try {
      const response = await api.post("/teams", values);
      const team = response.data.data;
      await fetchProfile();
      await fetchAnalytics();
      syncTeamSelection(team.id);
      setActiveView("board");
      return true;
    } catch (error) {
      if (error.response?.status === 401) {
        handleUnauthorized();
        return false;
      }

      setLeadershipError(getApiErrorMessage(error));
      return false;
    } finally {
      setIsCreatingTeam(false);
    }
  };

  const handleAssignLeader = async ({ teamId, leaderUserId }) => {
    setLeadershipError("");
    setIsUpdatingLeader(true);

    try {
      await api.patch(`/teams/${teamId}/leader`, { leaderUserId });
      await fetchProfile();
      await fetchAnalytics();

      if (teamId === selectedTeam?.id) {
        await fetchMembers(teamId);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        handleUnauthorized();
        return;
      }

      setLeadershipError(getApiErrorMessage(error));
    } finally {
      setIsUpdatingLeader(false);
    }
  };

  const handleSaveProfile = async (values) => {
    setProfileError("");
    setIsSavingProfile(true);

    try {
      const response = await api.patch("/users/me", values);
      const updatedUser = response.data.data;
      setUser(updatedUser);
      persistUser(updatedUser);
      setIsProfileModalOpen(false);
    } catch (error) {
      if (error.response?.status === 401) {
        handleUnauthorized();
        return;
      }

      setProfileError(getApiErrorMessage(error));
    } finally {
      setIsSavingProfile(false);
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

  const renderEmptyState = () => (
    <div className="rounded-[28px] border border-dashed border-slate-200 bg-white px-6 py-10 text-center shadow-panel">
      <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">
        Workspace setup
      </p>
      <h2 className="mt-3 text-2xl font-semibold text-slate-900">
        {isMegaLeader
          ? "Create a team, assign a leader, and start coordinating work."
          : "Join a team to unlock your assigned work and progress tracking."}
      </h2>
      <p className="mt-3 text-slate-500">
        {isMegaLeader
          ? "Use the leadership section to launch new teams and delegate ownership."
          : "Use your invitation code from the mega leader or team leader to connect your account."}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => (isMegaLeader ? setActiveView("leadership") : setIsJoinModalOpen(true))}
          className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
        >
          {isMegaLeader ? "Open leadership center" : "Join with code"}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <AppShell
        sidebar={
          <Sidebar
            user={user}
            activeView={activeView}
            sections={visibleSections}
            selectedTeam={selectedTeam}
            onChangeView={setActiveView}
            onOpenProfile={() => {
              setProfileError("");
              setIsProfileModalOpen(true);
            }}
            onOpenJoinTeam={() => {
              setJoinError("");
              setIsJoinModalOpen(true);
            }}
            onOpenCreateTeam={() => setActiveView("leadership")}
          />
        }
        topBar={
          <TopBar
            memberships={memberships}
            selectedTeamId={selectedTeam?.id || ""}
            selectedTeam={selectedTeam}
            taskCount={tasks.length}
            onSelectTeam={syncTeamSelection}
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

          {!isLoadingProfile && memberships.length === 0 ? (
            renderEmptyState()
          ) : (
            <>
              {activeView === "board" && (
                <>
                  {isMegaLeader ? (
                    <div className="grid gap-6">
                      <PerformanceAnalytics analyticsData={analyticsData} />
                      <TeamGrid analyticsData={analyticsData} />
                    </div>
                  ) : isTeamLeader ? (
                    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(360px,0.85fr)]">
                      <KanbanPreviewCard
                        tasks={tasks}
                        isLoading={isLoadingTasks || isLoadingProfile}
                        selectedTeam={selectedTeam}
                        updatingTaskId={updatingTaskId}
                        onStatusChange={handleStatusChange}
                      />
                      <MemberManagementPanel members={members} tasks={tasks} />
                    </div>
                  ) : (
                    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(360px,0.85fr)]">
                      <KanbanPreviewCard
                        tasks={tasks}
                        isLoading={isLoadingTasks || isLoadingProfile}
                        selectedTeam={selectedTeam}
                        updatingTaskId={updatingTaskId}
                        onStatusChange={handleStatusChange}
                      />
                      <MyTasksPanel
                        tasks={tasks}
                        userId={user?.id}
                        updatingTaskId={updatingTaskId}
                        onStatusChange={handleStatusChange}
                      />
                    </div>
                  )}
                </>
              )}

              {activeView === "assignments" && (
                <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
                  <TaskStudioPanel
                    selectedTeam={selectedTeam}
                    members={members}
                    isSubmitting={isCreatingTask}
                    errorMessage={taskError}
                    onSubmit={handleCreateTask}
                  />
                  <TeamRosterCard
                    selectedTeam={selectedTeam}
                    members={members}
                    user={user}
                    onOpenProfile={() => {
                      setProfileError("");
                      setIsProfileModalOpen(true);
                    }}
                  />
                </div>
              )}

              {activeView === "leadership" && isMegaLeader && (
                <LeadershipPanel
                  teams={memberships}
                  users={usersDirectory}
                  isCreatingTeam={isCreatingTeam}
                  isUpdatingLeader={isUpdatingLeader}
                  createError={leadershipError}
                  leadershipError={leadershipError}
                  onCreateTeam={handleCreateTeam}
                  onAssignLeader={handleAssignLeader}
                />
              )}
            </>
          )}
        </section>
      </AppShell>

      <JoinTeamModal
        isOpen={isJoinModalOpen}
        isSubmitting={isJoiningTeam}
        errorMessage={joinError}
        onClose={() => setIsJoinModalOpen(false)}
        onSubmit={handleJoinTeam}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        user={user}
        isSubmitting={isSavingProfile}
        errorMessage={profileError}
        onClose={() => setIsProfileModalOpen(false)}
        onSubmit={handleSaveProfile}
      />
    </>
  );
};

export default DashboardPage;
