// src/api-rest.js — REST API Client for Express/SQLite Backend
const API_BASE = 'https://r-eco-pilot-backend.onrender.com/api';

async function request(path, options = {}) {
  const user = JSON.parse(localStorage.getItem('eco_user') || '{}');
  const headers = {
    'Content-Type': 'application/json',
    ...(user.token ? { 'Authorization': `Bearer ${user.token}` } : {}),
    ...options.headers
  };

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || 'Request failed');
  }
  return res.json();
}

export async function login(username, password) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  });
  localStorage.setItem('eco_user', JSON.stringify(data));
  return data.user;
}

export async function logout() {
  localStorage.removeItem('eco_user');
}

export function subscribeToStats(callback) {
  // Simple polling for demo
  const interval = setInterval(async () => {
    try {
      const stats = await request('/dashboard/stats');
      callback(stats);
    } catch (e) { console.error(e); }
  }, 5000);
  return () => clearInterval(interval);
}

export function subscribeToFeed(callback) {
  const interval = setInterval(async () => {
    try {
      const feed = await request('/dashboard/feed');
      callback(feed);
    } catch (e) { console.error(e); }
  }, 5000);
  return () => clearInterval(interval);
}

export function subscribeToTeams(callback) {
  const interval = setInterval(async () => {
    try {
      const teams = await request('/teams');
      callback(teams);
    } catch (e) { console.error(e); }
  }, 5000);
  return () => clearInterval(interval);
}

export async function getUsers() {
  return request('/admin/users');
}

export async function getRubrics() {
  return request('/rubrics');
}

export async function getTeamSubmissionData(teamId) {
  const subs = await request(`/submissions/${teamId}`);
  const data = {};
  subs.forEach(s => {
    try {
      data[s.step] = JSON.parse(s.content);
    } catch {
      data[s.step] = s.content;
    }
  });
  return data;
}

export async function saveSubmission(body) {
  return request('/submissions', {
    method: 'POST',
    body: JSON.stringify(body)
  });
}

export async function adminCreateUser(u) {
  return request('/admin/users', {
    method: 'POST',
    body: JSON.stringify(u)
  });
}

export async function adminUpdateUser(id, data) {
  return request(`/admin/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function adminDeleteUser(id) {
  return request(`/admin/users/${id}`, { method: 'DELETE' });
}

export async function adminCreateTeam(t) {
  return request('/admin/teams', {
    method: 'POST',
    body: JSON.stringify(t)
  });
}

export async function adminUpdateTeam(id, data) {
  return request(`/admin/teams/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function adminDeleteTeam(id) {
  return request(`/admin/teams/${id}`, { method: 'DELETE' });
}

// Polls the good_prompts endpoint every 5s and pushes results to `callback`.
// Returns an unsubscribe function.
export function subscribeToGoodPrompts(callback) {
  let cancelled = false;
  const tick = async () => {
    try {
      const data = await request('/good-prompts');
      if (!cancelled) callback(data);
    } catch (e) {
      console.error('subscribeToGoodPrompts:', e);
    }
  };
  tick(); // fire immediately so the UI doesn't sit empty for 5s
  const interval = setInterval(tick, 5000);
  return () => { cancelled = true; clearInterval(interval); };
}

export async function saveGoodPrompt(p) {
  return request('/good-prompts', {
    method: 'POST',
    body: JSON.stringify(p)
  });
}

export async function deleteGoodPrompt(id) {
  return request(`/good-prompts/${id}`, { method: 'DELETE' });
}

// ─── Team Scores ────────────────────────────────────────
// Save all dimension scores for a team in one call.
//   scores: { 'AI Prompting': 4, 'Local Wisdom': 3, ... }
export async function saveTeamScores(teamId, scores, comment) {
  return request('/team-scores', {
    method: 'POST',
    body: JSON.stringify({ teamId, scores, comment })
  });
}

// Aggregated scores across all evaluators (avg + roles per team-dimension).
// Polls every 5s like the other live data.
export function subscribeToTeamScores(callback) {
  let cancelled = false;
  const tick = async () => {
    try {
      const data = await request('/team-scores');
      if (!cancelled) callback(data);
    } catch (e) {
      console.error('subscribeToTeamScores:', e);
    }
  };
  tick();
  const interval = setInterval(tick, 5000);
  return () => { cancelled = true; clearInterval(interval); };
}

// Returns the current evaluator's previously-saved scores for a team
// (lets the form pre-fill on revisit).
export async function getMyTeamScores(teamId) {
  return request(`/team-scores/mine/${teamId}`);
}

// No-op for the REST backend — the SQLite DB is seeded on server startup.
export async function seedFirebase() { return { ok: true }; }
