/* ============================================================
   GAMING LEARNING - APP.JS (v5 — CodeCombat RPG Logic)
   ============================================================ */

'use strict';

const XP_PER_LEVEL = 100;
const TIMER_SECONDS = 30;

const LEVELS = [
  { level: 1, title: '見習い冒険者' }, { level: 2, title: '冒険者' },
  { level: 3, title: '勇者' }, { level: 4, title: '戦士' },
  { level: 5, title: '魔法使い' }, { level: 6, title: '騎士' },
  { level: 7, title: '英雄' }, { level: 8, title: '伝説の勇者' },
  { level: 9, title: '神話の戦士' }, { level: 10, title: '伝説王' }
];

const CHARS = [
  { emoji: '🧙', name: 'ウィザード', cls: '魔法使い' },
  { emoji: '⚔️', name: 'ソードマン', cls: '剣士' },
  { emoji: '🏹', name: 'アーチャー', cls: '弓使い' },
  { emoji: '🛡️', name: 'パラディン', cls: '守護者' },
  { emoji: '🔥', name: 'ファイアー', cls: '炎使い' },
  { emoji: '⚡', name: 'ライトニング', cls: '雷使い' }
];

const ALL_BADGES = [
  { id: 'first_clear', emoji: '🌟', label: '初クリア', desc: '初めてクエストをクリア' },
  { id: 'perfect', emoji: '💯', label: 'パーフェクト', desc: '全問正解達成' },
  { id: 'speed_demon', emoji: '⚡', label: 'スピード魔', desc: '残り15秒以上で全問正解' },
  { id: 'level5', emoji: '🔥', label: 'レベル5', desc: 'レベル5に到達' },
  { id: 'level10', emoji: '👑', label: 'レベル10', desc: '最高レベルに到達' },
  { id: 'scholar', emoji: '📚', label: '学者', desc: '5クエストクリア' },
  { id: 'collector', emoji: '🏅', label: 'コレクター', desc: 'コイン100枚獲得' },
  { id: 'daily_warrior', emoji: '🗓️', label: '毎日戦士', desc: '3日連続ログイン' }
];

const MOCK_RANKING_PLAYERS = [
  { name: 'SamuraiCoder', avatar: '⚔️', xp: 840, coins: 320, accuracy: 91 },
  { name: 'PixelWizard', avatar: '🧙', xp: 780, coins: 290, accuracy: 88 },
  { name: 'NinjaLearner', avatar: '🏹', xp: 720, coins: 260, accuracy: 85 },
  { name: 'DragonSlayer', avatar: '🐉', xp: 660, coins: 230, accuracy: 82 },
  { name: 'StarForge', avatar: '⭐', xp: 600, coins: 200, accuracy: 80 },
  { name: 'MegaMaster', avatar: '🛡️', xp: 530, coins: 180, accuracy: 77 },
  { name: 'CyberKnight', avatar: '🤖', xp: 470, coins: 150, accuracy: 74 },
  { name: 'GalaxyCat', avatar: '🐱', xp: 400, coins: 120, accuracy: 70 }
];

const QUESTS = [
  {
    id: 'it_basics', icon: '🏰', title: 'IT基礎の砦',
    difficulty: 'beginner', color: '#00e5ff', reward: { xp: 40, coins: 20 },
    x: 400, y: 800, // Map positions
    questions: [
      { q: 'CPUとは何の略ですか？', choices: ['Central Processing Unit', 'Computer Power Unit', 'Core Processing Utility', 'Control Program Unit'], answer: 0, xp: 10 },
      { q: 'HTTPSの「S」は何を意味しますか？', choices: ['Speed', 'Secure', 'System', 'Standard'], answer: 1, xp: 10 },
      { q: '1byteは何bitですか？', choices: ['4bit', '6bit', '8bit', '16bit'], answer: 2, xp: 10 },
      { q: '「IP」アドレスのIPは何の略ですか？', choices: ['Internal Protocol', 'Internet Protocol', 'Input Program', 'Index Page'], answer: 1, xp: 10 },
      { q: 'OSの役割として正しいのはどれですか？', choices: ['表計算', 'ハードウェア管理', 'Webページ閲覧', '写真編集'], answer: 1, xp: 10 }
    ]
  },
  {
    id: 'english_village', icon: '🏡', title: '英単語の村',
    difficulty: 'beginner', color: '#00ff9d', reward: { xp: 40, coins: 20 },
    x: 800, y: 650,
    questions: [
      { q: '"Adventure"の意味は？', choices: ['休憩', '冒険', '物語', '夢'], answer: 1, xp: 10 },
      { q: '"Knowledge"の意味は？', choices: ['記憶', '理解', '知識', '技術'], answer: 2, xp: 10 },
      { q: '"Victory"の意味は？', choices: ['敗北', '休息', '勝利', '始まり'], answer: 2, xp: 10 },
      { q: '"Challenge"の意味は？', choices: ['挑戦', '成功', '失敗', '努力'], answer: 0, xp: 10 },
      { q: '"Brilliant"の意味は？', choices: ['暗い', '普通', '素晴らしい', '難しい'], answer: 2, xp: 10 }
    ]
  },
  {
    id: 'algo_dungeon', icon: '🕳️', title: '論理の迷宮',
    difficulty: 'intermediate', color: '#ff9800', reward: { xp: 70, coins: 35 },
    x: 1200, y: 900,
    questions: [
      { q: 'バブルソートの計算量はどれですか？', choices: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], answer: 2, xp: 15 },
      { q: 'スタック（Stack）のデータ取り出し方式は？', choices: ['FIFO', 'LIFO', 'FILO', 'LILO'], answer: 1, xp: 15 },
      { q: '二分探索の前提条件は？', choices: ['昇順or降順にソート済み', 'データが数値のみ', '重複がない', 'ランダム'], answer: 0, xp: 15 },
      { q: '[3,1,4,1,5] を昇順ソートすると？', choices: ['[1,3,1,4,5]', '[1,1,3,4,5]', '[5,4,3,1,1]', '[1,4,1,3,5]'], answer: 1, xp: 15 },
      { q: '再帰呼び出しに必須なのは？', choices: ['ループ', '基底条件', 'グローバル変数', '配列'], answer: 1, xp: 15 }
    ]
  },
  {
    id: 'network_mountain', icon: '🏔️', title: '通信の峰',
    difficulty: 'intermediate', color: '#b24bff', reward: { xp: 70, coins: 35 },
    x: 1700, y: 550,
    questions: [
      { q: 'DNSの役割は？', choices: ['ファイル圧縮', 'ドメインをIPに変換', '暗号化', 'FW設定'], answer: 1, xp: 15 },
      { q: 'TCPが保証するのは？', choices: ['高速性', 'データの順序と完全性', '無線接続', 'ブロードキャスト'], answer: 1, xp: 15 },
      { q: 'ルーターの主な役割は？', choices: ['パケット転送・経路制御', '無線増幅', '印刷共有', 'ケーブル延長'], answer: 0, xp: 15 },
      { q: 'HTTPのデフォルトポートは？', choices: ['21', '443', '80', '22'], answer: 2, xp: 15 },
      { q: 'VPNとは？', choices: ['ウイルス対策', '仮想専用回線', '動画再生', 'バックアップ'], answer: 1, xp: 15 }
    ]
  },
  {
    id: 'boss_dragon', icon: '🐉', title: '奈落の竜',
    difficulty: 'advanced', color: '#ff3366', reward: { xp: 120, coins: 60 },
    x: 2100, y: 750,
    questions: [
      { q: 'OSI第3層のプロトコルは？', choices: ['HTTP', 'TCP', 'IP', 'FTP'], answer: 2, xp: 25 },
      { q: '"Perseverance"の意味は？', choices: ['好奇', '勇気', '忍耐', '精神'], answer: 2, xp: 25 },
      { q: 'ハッシュの平均検索時間は？', choices: ['O(n)', 'O(1)', 'O(log n)', 'O(n²)'], answer: 1, xp: 25 },
      { q: 'SQLで全列抽出の記号は？', choices: ['ALL', '*', 'EVERY', 'COLUMNS'], answer: 1, xp: 25 },
      { q: 'Pythonのリストappendの計算量は？', choices: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'], answer: 2, xp: 25 }
    ]
  }
];

// ─── STATE ────────────────────────────────────────────────────
let state = {
  name: '', avatar: '🧙', charName: '', charClass: '',
  level: 1, xp: 0, coins: 0, stars: 0,
  clearedQuests: [],
  badges: [],
  totalQuestions: 0, correctAnswers: 0,
  playTime: 0, streak: 1,
  lastLogin: new Date().toDateString()
};

let mission = {
  quest: null, index: 0, correctCount: 0, totalXP: 0, totalCoins: 0,
  timerHandle: null, remainingTime: TIMER_SECONDS
};

// ─── INIT ─────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  loadState();
  if (state.name) {
    showApp();
  } else {
    showScreen('screen-landing');
  }
});

function loadState() {
  const saved = localStorage.getItem('gl_state_v5'); // New version for visual clone
  if (saved) {
    state = { ...state, ...JSON.parse(saved) };
  }
}
function saveState() {
  localStorage.setItem('gl_state_v5', JSON.stringify(state));
}

// ─── NAVIGATION ───────────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
}

function showSection(name) {
  document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  document.getElementById(`section-${name}`).classList.add('active');
  const navBtn = document.getElementById(`nav-${name}`);
  if (navBtn) navBtn.classList.add('active');

  if (name === 'quests') renderWorldMap();
  if (name === 'ranking') renderRanking('xp');
  if (name === 'progress') renderProgress();
  if (name === 'home') renderHome();
}

// ─── FLOW ─────────────────────────────────────────────────────
function startAdventure() {
  const input = document.getElementById('username-input');
  const name = input.value.trim();
  if (!name) return showToast('名前を刻んでください！');
  state.name = name;
  buildCharGrid();
  showScreen('screen-char');
}

function buildCharGrid() {
  const grid = document.getElementById('char-grid');
  grid.innerHTML = '';
  CHARS.forEach((c, i) => {
    const btn = document.createElement('div');
    btn.style.cssText = 'background:rgba(0,0,0,0.5); border:2px solid var(--border-gold); padding:10px; border-radius:8px; cursor:pointer; font-size:1.5rem; text-align:center;';
    btn.textContent = c.emoji;
    btn.onclick = () => {
      state.avatar = c.emoji;
      state.charName = c.name;
      state.charClass = c.cls;
      document.getElementById('char-hero-preview').textContent = c.emoji;
      document.getElementById('preview-name').textContent = c.name;
      document.getElementById('preview-class').textContent = `CLASS: ${c.cls}`;
    };
    grid.appendChild(btn);
  });
}

function confirmCharacter() {
  saveState();
  showApp();
}

function showApp() {
  showScreen(null);
  document.getElementById('app-wrapper').style.display = 'grid';
  updateHUD();
  showSection('quests');

  // Scroll map to middle-ish
  const vp = document.getElementById('map-viewport');
  vp.scrollLeft = 200;
  vp.scrollTop = 500;
}

// ─── WORLD MAP ────────────────────────────────────────────────
function renderWorldMap() {
  const container = document.getElementById('quest-nodes-container');
  const svg = document.getElementById('map-svg');
  container.innerHTML = '';
  svg.innerHTML = '';

  QUESTS.forEach((q, i) => {
    const cleared = state.clearedQuests.includes(q.id);
    const node = document.createElement('div');
    node.className = `map-node ${cleared ? 'cleared' : ''}`;
    node.style.left = `${q.x}px`;
    node.style.top = `${q.y}px`;
    node.innerHTML = `
            <span class="node-icon">${q.icon}</span>
            <div class="node-label">${q.title}</div>
        `;
    node.onclick = () => startMission(q);
    container.appendChild(node);

    // Lines to next node
    if (i < QUESTS.length - 1) {
      const next = QUESTS[i + 1];
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const d = `M ${q.x + 40} ${q.y + 40} Q ${(q.x + next.x) / 2} ${(q.y + next.y) / 2 + 100} ${next.x + 40} ${next.y + 40}`;
      line.setAttribute('d', d);
      line.setAttribute('class', 'map-path');
      svg.appendChild(line);
    }
  });
}

// ─── HUD / STATS ──────────────────────────────────────────────
function updateHUD() {
  document.getElementById('hud-avatar').textContent = state.avatar;
  document.getElementById('hud-name').textContent = state.name;
  document.getElementById('hud-coins').textContent = state.coins;
  document.getElementById('hud-stars').textContent = state.stars;
  document.getElementById('hud-level').textContent = `Lv. ${state.level}`;
  const xpPct = (state.xp % XP_PER_LEVEL);
  document.getElementById('xp-bar').style.width = `${xpPct}%`;
}

// ─── MISSION LOGIC ────────────────────────────────────────────
function startMission(q) {
  mission.quest = q;
  mission.index = 0;
  mission.correctCount = 0;
  mission.totalXP = 0;
  mission.totalCoins = 0;
  showSection('mission');
  loadQuestion();
}

function loadQuestion() {
  const q = mission.quest.questions[mission.index];
  document.getElementById('mission-quest-name').textContent = mission.quest.title;
  document.getElementById('mission-progress').textContent = `STAGE ${mission.index + 1}/${mission.quest.questions.length}`;
  document.getElementById('question-text').textContent = q.q;
  document.getElementById('mission-result-bar').style.display = 'none';

  const grid = document.getElementById('choices-grid');
  grid.innerHTML = '';
  q.choices.forEach((choice, i) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn'; // We need to add this to CSS if missing
    btn.style.cssText = 'background:rgba(0,0,0,0.05); border:2px solid #5e4a3e; border-bottom-width:4px; padding:15px; border-radius:5px; font-weight:bold; cursor:pointer;';
    btn.textContent = choice;
    btn.onclick = () => checkAnswer(i);
    grid.appendChild(btn);
  });

  startTimer();
}

function startTimer() {
  clearInterval(mission.timerHandle);
  mission.remainingTime = 30;
  document.getElementById('mission-timer').textContent = mission.remainingTime;
  mission.timerHandle = setInterval(() => {
    mission.remainingTime--;
    document.getElementById('mission-timer').textContent = mission.remainingTime;
    if (mission.remainingTime <= 0) {
      clearInterval(mission.timerHandle);
      checkAnswer(-1);
    }
  }, 1000);
}

function checkAnswer(idx) {
  clearInterval(mission.timerHandle);
  const q = mission.quest.questions[mission.index];
  const isCorrect = idx === q.answer;

  if (isCorrect) {
    mission.correctCount++;
    mission.totalXP += q.xp;
    state.correctAnswers++;
  }
  state.totalQuestions++;

  const bar = document.getElementById('mission-result-bar');
  bar.style.display = 'block';
  document.getElementById('result-msg').textContent = isCorrect ? '快挙！ 正解です' : '失敗… 真実は「' + q.choices[q.answer] + '」';
  document.getElementById('result-msg').style.color = isCorrect ? '#14874a' : '#c0392b';
  document.getElementById('result-xp').textContent = isCorrect ? `+${q.xp} XP` : '+0 XP';

  document.getElementById('btn-next').textContent = mission.index < mission.quest.questions.length - 1 ? '次の試練へ' : '結果を報告する';
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
  const accuracy = Math.round((mission.correctCount / mission.quest.questions.length) * 100);
  const stars = accuracy >= 100 ? 5 : accuracy >= 80 ? 4 : accuracy >= 60 ? 3 : accuracy >= 40 ? 2 : 1;

  let bonusCoins = 0;
  if (!state.clearedQuests.includes(mission.quest.id)) {
    state.clearedQuests.push(mission.quest.id);
    bonusCoins = mission.quest.reward.coins;
  }

  state.xp += mission.totalXP;
  state.coins += bonusCoins + Math.round(mission.quest.reward.coins * 0.5);
  state.stars += stars;
  state.playTime += 5; // simplified

  // Level up check
  let leveled = false;
  while (state.xp >= state.level * XP_PER_LEVEL) {
    state.level++;
    leveled = true;
  }

  saveState();
  updateHUD();

  document.getElementById('reward-xp').textContent = `+${mission.totalXP}`;
  document.getElementById('reward-coins').textContent = `+${bonusCoins + Math.round(mission.quest.reward.coins * 0.5)}`;
  document.getElementById('reward-stars').textContent = '⭐'.repeat(stars);
  document.getElementById('complete-accuracy').textContent = accuracy + '%';

  showSection('complete');
  if (leveled) triggerLevelUp();
}

function triggerLevelUp() {
  document.getElementById('levelup-new').textContent = `Lv. ${state.level}`;
  document.getElementById('levelup-overlay').style.display = 'flex';
}
function closeLevelUp() {
  document.getElementById('levelup-overlay').style.display = 'none';
}
function exitMission() {
  clearInterval(mission.timerHandle);
  showSection('quests');
}
function retryQuest() {
  startMission(mission.quest);
}

// ─── OTHER SECTIONS ───────────────────────────────────────────
function renderHome() {
  document.getElementById('welcome-msg').textContent = `冒険者 ${state.name}、日誌を確認せよ。`;
  document.getElementById('stat-cleared').textContent = state.clearedQuests.length;
  document.getElementById('stat-time').textContent = state.playTime + '分';
  document.getElementById('stat-accuracy').textContent = Math.round((state.correctAnswers / state.totalQuestions) * 100 || 0) + '%';
}

function renderRanking(type) {
  const list = document.getElementById('ranking-list');
  const me = { name: state.name, avatar: state.avatar, xp: state.xp, coins: state.coins, accuracy: 90, isMe: true };
  const all = [...MOCK_RANKING_PLAYERS, me].sort((a, b) => b[type] - a[type]);

  list.innerHTML = all.map((p, i) => `
        <div style="padding:10px; border-bottom:1px solid #ddd; display:flex; gap:10px; align-items:center; ${p.isMe ? 'background:rgba(29,185,102,0.1); font-weight:bold;' : ''}">
            <span style="width:20px;">${i + 1}</span>
            <span>${p.avatar}</span>
            <span style="flex:1;">${p.name}</span>
            <span style="font-family:var(--font-mono);">${p[type]}</span>
        </div>
    `).join('');
}

function renderProgress() {
  document.getElementById('progress-avatar').textContent = state.avatar;
  document.getElementById('progress-name').textContent = state.name;
  document.getElementById('progress-level').textContent = `LEVEL ${state.level} ${LEVELS[Math.min(state.level - 1, 9)].title}`;
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show';
  setTimeout(() => t.className = 'toast', 3000);
}
