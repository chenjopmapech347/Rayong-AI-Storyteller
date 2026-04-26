// src/api.js — Firebase Serverless Version
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  browserSessionPersistence,
  setPersistence
} from "firebase/auth";
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  updateDoc, 
  deleteDoc,
  serverTimestamp,
  increment,
  onSnapshot
} from "firebase/firestore";
import { 
  createUserWithEmailAndPassword 
} from "firebase/auth";
import { auth, db } from "./firebase";

// ─── Auth ────────────────────────────────────────────────
export async function login(username, password) {
  // Note: Firebase uses email. We append a domain if the user only provides a username.
  const email = username.includes('@') ? username : `${username}@eco.com`;
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // Fetch extra user data from Firestore (role, name, team_id)
  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (!userDoc.exists()) {
    throw new Error("User record not found in Firestore. Please ensure the user is registered in the 'users' collection.");
  }
  
  const userData = { id: user.uid, ...userDoc.data() };
  localStorage.setItem('eco_user', JSON.stringify(userData));
  return userData;
}

export async function logout() {
  await signOut(auth);
  localStorage.removeItem('eco_user');
}

export const getToken = () => localStorage.getItem('eco_user'); // Dummy for compatibility

// ─── Dashboard ───────────────────────────────────────────
// ─── Real-Time Listeners ──────────────────────────────────
export function subscribeToStats(callback) {
  const teamsRef = collection(db, "teams");
  const subRef = collection(db, "submissions");
  
  // This is a simplified aggregate listener
  return onSnapshot(teamsRef, async (teamsSnap) => {
    const qSub = query(collection(db, "submissions"), where("type", "==", "gateway"));
    const subSnap = await getDocs(qSub);
    
    callback({
      totalTeams: teamsSnap.size,
      submitted: subSnap.size,
      pending: Math.max(0, teamsSnap.size - subSnap.size),
      aiPrompts: 142 // Placeholder
    });
  });
}

export function subscribeToFeed(callback) {
  const q = query(collection(db, "activity_log"), orderBy("created_at", "desc"), limit(15));
  return onSnapshot(q, (snap) => {
    const data = snap.docs.map(d => ({ 
      id: d.id, 
      ...d.data(), 
      created_at: d.data().created_at?.toDate() || new Date() 
    }));
    callback(data);
  });
}

export function subscribeToTeams(callback) {
  return onSnapshot(collection(db, "teams"), (snap) => {
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(data);
  });
}

// ─── Teams ───────────────────────────────────────────────
export async function getTeams() {
  const snap = await getDocs(collection(db, "teams"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// Fetch all submissions for a team as a single object
export async function getTeamSubmissionData(teamId) {
  const q = query(collection(db, "submissions"), where("team_id", "==", teamId));
  const snap = await getDocs(q);
  const data = {};
  snap.forEach(doc => {
    data[doc.data().type] = doc.data().content;
  });
  return data;
}

// ─── Submissions ─────────────────────────────────────────
export async function getSubmissions(teamId) {
  const q = query(collection(db, "submissions"), where("team_id", "==", teamId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function saveSubmission(body) {
  const { team_id, step, content, file_url } = body;
  const docId = `${team_id}_${step}`;
  await setDoc(doc(db, "submissions", docId), {
    ...body,
    submitted_at: serverTimestamp()
  });
  
  // Log activity
  await addDoc(collection(db, "activity_log"), {
    team_id,
    action: 'submit',
    detail: `Step ${step}`,
    created_at: serverTimestamp()
  });
}

// ─── Rubrics ───────────────────────────────────────
export async function getRubrics() {
  const snap = await getDocs(collection(db, "rubrics"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function createRubric(r) {
  return await addDoc(collection(db, "rubrics"), r);
}

export async function deleteRubric(id) {
  await deleteDoc(doc(db, "rubrics", id));
}

// ─── Admin: Users CRUD ──────────────────────────────────
export async function getUsers() {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function adminCreateUser(u) {
  // Note: For full serverless, you'd typically use Firebase Auth to create users.
  // This is a placeholder for adding the metadata record.
  const { username, ...rest } = u;
  const id = username; // Or generate one
  await setDoc(doc(db, "users", id), {
    ...rest,
    username,
    created_at: serverTimestamp()
  });
}

export async function adminDeleteUser(id) {
  await deleteDoc(doc(db, "users", id));
}

export async function adminUpdateUser(id, data) {
  await updateDoc(doc(db, "users", id), data);
}

// ─── Admin: Teams CRUD ──────────────────────────────────
export async function adminCreateTeam(t) {
  return await addDoc(collection(db, "teams"), {
    ...t,
    created_at: serverTimestamp()
  });
}

export async function adminDeleteTeam(id) {
  await deleteDoc(doc(db, "teams", id));
}

export async function adminUpdateTeam(id, data) {
  await updateDoc(doc(db, "teams", id), data);
}

// ─── Good Prompts ───────────────────────────────────────
export function subscribeToGoodPrompts(callback) {
  return onSnapshot(collection(db, "good_prompts"), (snap) => {
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(data);
  });
}

export async function saveGoodPrompt(p) {
  if (p.id) {
    return await updateDoc(doc(db, "good_prompts", p.id), p);
  }
  return await addDoc(collection(db, "good_prompts"), {
    ...p,
    created_at: serverTimestamp()
  });
}

export async function deleteGoodPrompt(id) {
  await deleteDoc(doc(db, "good_prompts", id));
}

// ─── Team Scores ────────────────────────────────────────
export async function saveTeamScores(teamId, scores, comment) {
  const user = JSON.parse(localStorage.getItem('eco_user') || '{}');
  const evaluatorId = user.id;
  const evaluatorRole = user.role;

  for (const [dim, score] of Object.entries(scores)) {
    const docId = `${teamId}_${dim}_${evaluatorId}`;
    await setDoc(doc(db, "team_scores", docId), {
      team_id: teamId,
      dimension: dim,
      score: Number(score),
      evaluator_id: evaluatorId,
      evaluator_role: evaluatorRole,
      comment: comment || '',
      scored_at: serverTimestamp()
    });
  }
}

export function subscribeToTeamScores(callback) {
  return onSnapshot(collection(db, "team_scores"), (snap) => {
    const agg = {};
    snap.docs.forEach(d => {
      const row = d.data();
      const key = `${row.team_id}-${row.dimension}`;
      if (!agg[key]) {
        agg[key] = { team_id: row.team_id, dimension: row.dimension, sum: 0, count: 0, roles: new Set(), last: row.scored_at?.toDate() };
      }
      agg[key].sum += row.score;
      agg[key].count += 1;
      agg[key].roles.add(row.evaluator_role);
      const dDate = row.scored_at?.toDate();
      if (dDate && dDate > agg[key].last) agg[key].last = dDate;
    });

    const result = Object.values(agg).map(v => ({
      team_id: v.team_id,
      dimension: v.dimension,
      avg_score: v.sum / v.count,
      n_evaluators: v.count,
      roles: Array.from(v.roles).join(','),
      last_scored_at: v.last
    }));
    callback(result);
  });
}

export async function getMyTeamScores(teamId) {
  const user = JSON.parse(localStorage.getItem('eco_user') || '{}');
  const q = query(collection(db, "team_scores"), where("evaluator_id", "==", user.id), where("team_id", "==", teamId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ─── Initial Setup (Seed) ──────────────────────────────
export async function seedFirebase() {
  console.log("🚀 Starting Firebase Setup...");
  
  const adminEmail = "admin@eco.com";
  const adminPass = "admin123";
  let user;
  
  try {
    const cred = await createUserWithEmailAndPassword(auth, adminEmail, adminPass);
    user = cred.user;
    console.log("✅ Admin Auth created");
  } catch (e) {
    if (e.code === 'auth/email-already-in-use') {
      console.log("ℹ️ Admin exists in Auth, signing in to sync Firestore...");
      // Try to sign in to get the UID to ensure the Firestore doc exists
      const cred = await signInWithEmailAndPassword(auth, adminEmail, adminPass);
      user = cred.user;
    } else {
      throw e;
    }
  }

  // Ensure Firestore User record exists (matches user.uid)
  await setDoc(doc(db, "users", user.uid), {
    username: "admin",
    name: "ผู้ดูแลระบบ",
    role: "admin",
    created_at: serverTimestamp()
  });

  // Also create other default Auth accounts if needed (optional, but good for demo)
  const otherUsers = [
    { u: 'teacher', p: 'teacher123', n: 'คุณครู วิภา ใจดี', r: 'teacher' },
    { u: 'student', p: 'student123', n: 'นาย สมชาย ใจดี', r: 'student' },
    { u: 'sage',    p: 'sage123',    n: 'ปราชญ์ สมศักดิ์', r: 'sage' }
  ];

  for (const ou of otherUsers) {
    try {
      const email = `${ou.u}@eco.com`;
      const cred = await createUserWithEmailAndPassword(auth, email, ou.p);
      await setDoc(doc(db, "users", cred.user.uid), {
        username: ou.u,
        name: ou.n,
        role: ou.r,
        created_at: serverTimestamp()
      });
      console.log(`✅ ${ou.u} created`);
    } catch (e) {
      console.log(`ℹ️ ${ou.u} setup skipped (exists)`);
    }
  }

  // 3. Create Default Teams
  const teams = ["Eco Warriors", "Green Future", "Blue Ocean", "Smart Farm"];
  for (const name of teams) {
    // Check if team exists to avoid duplicates
    const q = query(collection(db, "teams"), where("name", "==", name));
    const snap = await getDocs(q);
    if (snap.empty) {
      await addDoc(collection(db, "teams"), { name, created_at: serverTimestamp() });
    }
  }

  // 4. Create Default Rubrics
  const rubrics = [
    { name: 'วิศวกรรมคำสั่งและการกำกับดูแล AI', max: 4, levels: ['ปรับปรุง', 'พอใช้', 'ดี', 'ดีเยี่ยม'] },
    { name: 'การดึงจุดเด่นและภูมิปัญญาท้องถิ่น', max: 5, levels: ['1','2','3','4','5'] },
    { name: 'ความคิดสร้างสรรค์และนวัตกรรม', max: 5, levels: ['1','2','3','4','5'] },
    { name: 'การวางแผนและโมเดลธุรกิจ', max: 5, levels: ['1','2','3','4','5'] },
    { name: 'การสื่อสารและวิดีโอ Storytelling', max: 5, levels: ['1','2','3','4','5'] }
  ];
  for (const r of rubrics) {
    const q = query(collection(db, "rubrics"), where("name", "==", r.name));
    const snap = await getDocs(q);
    if (snap.empty) {
      await addDoc(collection(db, "rubrics"), r);
    }
  }

  console.log("🎉 Firebase Setup/Sync Complete!");
  return { ok: true };
}
