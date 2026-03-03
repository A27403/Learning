/* ============================================================
   GAMING LEARNING - APP.JS (v7 — /play Precision Logic)
   ============================================================ */

'use strict';

const XP_PER_LEVEL = 100;
const TIMER_SECONDS = 30;

const QUESTS = [
  { id: 'node_1', title: 'Dungeon Entrance', x: 400, y: 1150, questions: [{ q: 'What is HTML?', choices: ['A language', 'A fruit', 'A car', 'A city'], answer: 0, xp: 20 }] },
  { id: 'node_2', title: 'Cellar Shadows', x: 650, y: 1000, questions: [{ q: 'What is CSS?', choices: ['Style', 'Food', 'Sport', 'Music'], answer: 0, xp: 20 }] },
  { id: 'node_3', title: 'The Boiler', x: 850, y: 820, questions: [{ q: 'What is JS?', choices: ['Logic', 'Art', 'Dance', 'Sleep'], answer: 0, xp: 20 }] },
  { id: 'node_4', title: 'Guard Post', x: 1150, y: 950, questions: [{ q: 'Variable keyword?', choices: ['let', 'get', 'set', 'run'], answer: 0, xp: 20 }] },
  { id: 'node_5', title: 'Deep Vault', x: 1500, y: 750, questions: [{ q: 'Backend for JS?', choices: ['Node.js', 'Sass', 'HTML', 'React'], answer: 0, xp: 20 }] },
  { id: 'node_6', title: 'Escape Tunnel', x: 1900, y: 900, questions: [{ q: 'Database type?', choices: ['SQL', 'JSON', 'HTML', 'CSS'], answer: 0, xp: 20 }] },
  { id: 'node_7', title: 'Master Throne', x: 2200, y: 650, questions: [{ q: 'Is this a clone?', choices: ['Yes', 'No', 'Maybe', 'Secret'], answer: 0, xp: 20 }] }
];

let state = {
  name: '', level: 1, xp: 0, coins: 0, stars: 0,
  clearedQuests: [],
  isLoggedIn: false
};

let mission = {
  active: false, quest: null, index: 0, correctCount: 0, totalXP: 0
};

// ─── INITIALIZATION ───────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  loadState();
  if (state.isLoggedIn) {
    initGame();
  } else {
    document.getElementById('name-overlay').style.display = 'flex';
  }
});

function loadState() {
  const saved = localStorage.getItem('gl_play_v7');
  if (saved) state = { ...state, ...JSON.parse(saved) };
}
function saveState() {
  localStorage.setItem('gl_play_v7', JSON.stringify(state));
}

function finishLogin() {
  const input = document.getElementById('username-input');
  const name = input.value.trim();
  if (!name) return;
  state.name = name;
  state.isLoggedIn = true;
  document.getElementById('name-overlay').style.display = 'none';
  saveState();
  initGame();
}

function initGame() {
  updateHUD();
  renderWorldMap();

  // Center map on progress
  const vp = document.getElementById('map-viewport');
  const lastIdx = state.clearedQuests.length;
  const targetQuest = QUESTS[Math.min(lastIdx, QUESTS.length - 1)];
  vp.scrollLeft = targetQuest.x - (vp.clientWidth / 2);
  vp.scrollTop = targetQuest.y - (vp.clientHeight / 2);
}

// ─── MAP RENDERING ────────────────────────────────────────────
function renderWorldMap() {
  const container = document.getElementById('quest-nodes-container');
  const svg = document.getElementById('map-svg');
  container.innerHTML = '';
  svg.innerHTML = '';

  QUESTS.forEach((q, i) => {
    const cleared = state.clearedQuests.includes(q.id);
    const active = i === state.clearedQuests.length;

    // Create Node (Hollow Circle)
    const node = document.createElement('div');
    node.className = `map-node ${cleared ? 'cleared' : ''} ${active ? 'active' : ''}`;
    node.style.left = `${q.x}px`;
    node.style.top = `${q.y}px`;
    node.onclick = () => {
      if (active || cleared) startMission(q);
    };
    container.appendChild(node);

    // Create Path
    if (i < QUESTS.length - 1) {
      const next = QUESTS[i + 1];
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const d = `M ${q.x + 10} ${q.y + 10} L ${next.x + 10} ${next.y + 10}`;
      line.setAttribute('d', d);
      line.setAttribute('class', 'map-path');
      line.setAttribute('stroke', cleared ? '#4caf50' : 'rgba(255,255,255,0.2)');
      svg.appendChild(line);
    }
  });

  // Update Banner Subtitle
  document.querySelector('.sub-banner').textContent = `${state.clearedQuests.length} / ${QUESTS.length}`;
}

// ─── MISSION LOGIC ────────────────────────────────────────────
function startMission(q) {
  mission.active = true;
  mission.quest = q;
  mission.index = 0;
  mission.correctCount = 0;
  mission.totalXP = 0;
  document.getElementById('section-mission').style.display = 'flex';
  loadQuestion();
}

function loadQuestion() {
  const q = mission.quest.questions[mission.index];
  document.getElementById('question-text').textContent = q.q;
  document.getElementById('mission-progress').textContent = `STAGE ${mission.index + 1}/${mission.quest.questions.length}`;
  document.getElementById('result-bar').style.display = 'none';

  const grid = document.getElementById('choices-grid');
  grid.innerHTML = '';
  q.choices.forEach((choice, i) => {
    const btn = document.createElement('button');
    btn.className = 'btn-choice';
    btn.textContent = choice;
    btn.onclick = () => checkAnswer(i);
    grid.appendChild(btn);
  });
}

function checkAnswer(idx) {
  const q = mission.quest.questions[mission.index];
  const win = idx === q.answer;
  if (win) {
    mission.correctCount++;
    mission.totalXP += q.xp;
  }

  document.getElementById('result-bar').style.display = 'block';
  document.getElementById('result-msg').textContent = win ? 'VICTORY!' : 'FAILED!';
  document.getElementById('result-msg').style.color = win ? '#4caf50' : '#f44336';
}

function nextQuestion() {
  if (mission.index < mission.quest.questions.length - 1) {
    mission.index++;
    loadQuestion();
  } else {
    finishMission();
  }
}

function finishMission() {
  if (mission.correctCount === mission.quest.questions.length && !state.clearedQuests.includes(mission.quest.id)) {
    state.clearedQuests.push(mission.quest.id);
    state.coins += 10;
    state.stars += 1;
  }
  state.xp += mission.totalXP;
  while (state.xp >= state.level * XP_PER_LEVEL) state.level++;

  saveState();
  updateHUD();
  renderWorldMap();
  document.getElementById('section-mission').style.display = 'none';
}

function exitMission() {
  document.getElementById('section-mission').style.display = 'none';
}

function updateHUD() {
  document.getElementById('hud-gems').textContent = state.coins;
  document.getElementById('hud-stars').textContent = state.stars;
}
