const STORAGE_KEYS = {
  token: "project_dashboard_token",
  user: "project_dashboard_user",
  memberships: "project_dashboard_memberships",
  selectedTeamId: "project_dashboard_selected_team_id",
};

const readJson = (key, fallback) => {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

export const getStoredToken = () => window.localStorage.getItem(STORAGE_KEYS.token) || "";

export const getStoredUser = () => readJson(STORAGE_KEYS.user, null);

export const getStoredMemberships = () => readJson(STORAGE_KEYS.memberships, []);

export const getStoredSelectedTeamId = () =>
  window.localStorage.getItem(STORAGE_KEYS.selectedTeamId) || "";

export const getStorageKey = (key) => STORAGE_KEYS[key];

export const setStoredSelectedTeamId = (teamId) => {
  if (teamId) {
    window.localStorage.setItem(STORAGE_KEYS.selectedTeamId, teamId);
  } else {
    window.localStorage.removeItem(STORAGE_KEYS.selectedTeamId);
  }
};

export const persistSession = ({ token, user, memberships }) => {
  if (token) {
    window.localStorage.setItem(STORAGE_KEYS.token, token);
  }
  window.localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
  window.localStorage.setItem(STORAGE_KEYS.memberships, JSON.stringify(memberships || []));

  const existingTeamId = getStoredSelectedTeamId();
  const availableTeamIds = (memberships || [])
    .map((membership) => membership.team?.id)
    .filter(Boolean);

  if (!existingTeamId || !availableTeamIds.includes(existingTeamId)) {
    setStoredSelectedTeamId(availableTeamIds[0] || "");
  }
};

export const persistUser = (user) => {
  window.localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
};

export const persistMemberships = (memberships) => {
  window.localStorage.setItem(STORAGE_KEYS.memberships, JSON.stringify(memberships || []));
};

export const clearSession = () => {
  Object.values(STORAGE_KEYS).forEach((key) => window.localStorage.removeItem(key));
};
