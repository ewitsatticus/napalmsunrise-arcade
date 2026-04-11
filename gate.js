/**
 * NAPALM SUNRISE — Email Gate: Feed Gorthog or He Dies
 *
 * Full tamagotchi/chatbot experience. Gorthog's hunger depletes over 120
 * seconds. The visitor must feed him an email address to save his life.
 * Once fed, the email is stored in localStorage and the gate dismisses.
 *
 * BOT / CRAWLER BYPASS:
 * This gate is entirely JavaScript-powered. Search engine crawlers (Googlebot,
 * Bingbot, etc.) and AI scrapers do NOT execute JavaScript on static GitHub
 * Pages sites. They will see the raw HTML content underneath — the full page —
 * which is exactly what we want for SEO. No server-side changes are needed.
 * The JS gate naturally lets crawlers through because they never run this code.
 */
(function () {
  'use strict';

  // --- Check localStorage — skip gate if email already stored ---
  try {
    if (localStorage.getItem('ns_email')) return;
  } catch (e) {
    // localStorage unavailable (private browsing, etc.) — show gate anyway
  }

  // ─── CONSTANTS ───
  var LIFE_SEC = 120;
  var TYPING_MS = 30;
  var S = 3;
  var CW = 180, CH = 180;
  var VW = CW / S, VH = CH / S;
  var GROUND = VH - 6;

  // ─── COLOR PALETTE ───
  var C = {
    '.': null, 'g': '#6b8e3a', 'd': '#3d5a1e', 'w': '#e8e0d0', 'b': '#1a1a1a',
    't': '#d4c9a8', 'm': '#2a1208', 'r': '#cc3333', 'p': '#ffaaaa', 'x': '#666',
    's': '#8a5c3a', 'f': '#d4a06a', 'h': '#c44', 'k': '#888', 'n': '#555',
    'R': '#aa0000', 'B': '#990000', 'G': '#4a6e25', 'W': '#ccc', 'Y': '#c9a227'
  };

  // ─── SPRITES ───
  var ORC_R1 = ['..dddd..', '.dggggd.', '.gwdwgd.', 'ddggggdd', '.dgttgd.', '.dgmmgd.', '..dggd..', '.dgggdg.', '.dggdgd.', '..dgd.d.', '..db.db.', '..db..b.'];
  var ORC_R2 = ['..dddd..', '.dggggd.', '.gwdwgd.', 'ddggggdd', '.dgttgd.', '.dgmmgd.', '..dggd..', '.gdgggd.', '.dgdggd.', '.d.dgd..', '.bd.bd..', '..b.bd..'];
  function mirror(sp) { return sp.map(function (r) { return r.split('').reverse().join(''); }); }
  var ORC_L1 = mirror(ORC_R1), ORC_L2 = mirror(ORC_R2);
  var ORC_HAPPY = ['gd.dd.dg', '.ddggdd.', '.dggggd.', '.gwdwgd.', 'ddggggdd', '.dgttgd.', '.dgmmgd.', '.dmmmmd.', '..dggd..', '..dggd..', '..dbbd..', '..db.bd.'];
  var ORC_PANIC1 = ['..dddd..', '.dggggd.', '.gpbpgd.', 'ddggggdd', '.dgttgd.', '.dmmmmd.', 'gddggddg', '..dggd..', '..dggd..', '.db..bd.', '.b....b.', '........'];
  var ORC_PANIC2 = ['..dddd..', '.dggggd.', '.gpbpgd.', 'ddggggdd', '.dgttgd.', '.dmmmmd.', '..dggd..', '.gdggdg.', '..dggd..', '..bd.bd.', '..b...b.', '........'];
  var ORC_DYING = ['................', '................', '................', '................', '................', '................', '................', '................', '..dd.dggggd.dd..', '.dgddgpbpgddgd.', '.dgggdgttgdgggd.', '..dddgmmmmgddd..', '....dddddddd....'];
  var ORC_DEAD = ['................', '................', '................', '................', '................', '..RRRRRRRRRRRR..', '..RR.RRRRRR.RR..', '..dd.dxxxxd.dd..', '.dxddxbxbxddxd..', '.dxxxdxttxdxxxd.', '..dddxbbbbxddd..', '..RRddddddddRR..'];
  var YOU_WALK1 = ['.ff.', '.ff.', 'sffs', '.ss.', '.ss.', '.ss.', 's..s', 's..s'];
  var YOU_WALK2 = ['.ff.', '.ff.', 'sffs', '.ss.', '.ss.', '.ss.', '..ss', '.ss.'];
  var YOU_STAB1 = ['.ff.', '.ff.', 'sffs', '.ssk', '.sskk', '.ss.', 's..s', 's..s'];
  var YOU_STAB2 = ['.ff.', '.ff.', 'sffsk', '.ss.k', '.ss.', '.ss.', 's..s', 's..s'];

  // ─── DIALOGUE ───
  var LINES = {
    idle: ["Gorthog smell fresh visitor... you got email?", "Me Gorthog. Me hungry. You feed email now.", "Gorthog no bite... maybe. Give email.", "Why you stare? Gorthog need email to live.", "You look like you got email. Gorthog can tell."],
    hungry: ["Gorthog getting VERY hungry now...", "You not gonna let Gorthog starve right?", "PLEASE. Gorthog NEED email. Is not asking much.", "Why you do this?? Just one email!!", "Gorthog knees weak... arms heavy... need email..."],
    starving: ["G-Gorthog... can barely... type...", "PLEASE!! GORTHOG BEGGING!! EMAIL!! NOW!!", "Gorthog see tunnel of light... it have no emails...", "This... this is how Gorthog dies? No email?", "GORTHOG CHILDREN WILL GROW UP WITHOUT FATHER"],
    dying: ["...gorthog...can't...see...", "NO... NO PLEASE... PUT THAT DOWN...", "STOP!! STOP!! WHAT IS WRONG WITH YOU??", "*screaming*", "...please... gorthog has children..."],
    dead: ["...", "Gorthog is dead. You murdered him.", "You didn't just let him die. You stabbed him.", "847 years. Ended by violence.", "Are you proud of yourself?"],
    fed: ["YAAAAAAAGH!! EMAIL!! GORTHOG FEAST!!", "GLORIOUS!! GORTHOG BELLY FULL OF EMAIL!!", "YOU... YOU GREATEST HUMAN EVER LIVE!!", "Gorthog weep tears of joy!!", "GORTHOG LIVE ANOTHER DAY!!"]
  };

  var VALIDATION_ERRORS = [
    'GORTHOG NEED EMAIL, NOT EMPTY AIR',
    'THAT NOT REAL EMAIL. GORTHOG NOT STUPID.',
    'GORTHOG KNOW FAKE EMAIL WHEN SEE ONE. TRY AGAIN.',
    'EMAIL LOOK WRONG. GORTHOG SEEN BETTER EMAILS FROM GOBLINS.'
  ];

  var FAKE_DOMAINS = ['test.com', 'example.com', 'fake.com', 'asdf.com', 'mailinator.com', 'guerrillamail.com', 'tempmail.com', 'throwaway.email', 'yopmail.com', 'sharklasers.com'];

  // ─── INJECT STYLES ───
  var style = document.createElement('style');
  style.textContent =
    '@keyframes ns-gate-pulse{0%,100%{opacity:1}50%{opacity:0.4}}' +
    '@keyframes ns-gate-shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-3px)}75%{transform:translateX(3px)}}' +
    '@keyframes ns-gate-scanline{0%{background-position:0 0}100%{background-position:0 4px}}' +
    '#ns-gate{' +
      'position:fixed;top:0;left:0;width:100%;height:100%;z-index:99999;' +
      'background:#0D0D0D;display:flex;align-items:center;justify-content:center;' +
      'font-family:"Courier Prime",monospace;color:#F3EDE0;overflow:auto;' +
      'transition:opacity 0.6s ease;' +
    '}' +
    '#ns-gate *{box-sizing:border-box;}' +
    '.nsg-wrap{' +
      'display:flex;gap:48px;max-width:880px;width:100%;padding:40px 28px;align-items:flex-start;' +
    '}' +
    /* LEFT COLUMN */
    '.nsg-left{flex:1;min-width:0;}' +
    '.nsg-title{' +
      'font-family:"Bebas Neue",sans-serif;font-size:64px;line-height:0.9;' +
      'letter-spacing:0.04em;color:#F3EDE0;margin:0 0 20px 0;' +
    '}' +
    '.nsg-title.danger{color:#E8260A;}' +
    '.nsg-desc{' +
      'font-size:14px;line-height:1.7;color:rgba(243,237,224,0.55);' +
      'font-style:italic;margin-bottom:28px;' +
    '}' +
    '.nsg-form-label{' +
      'font-family:"DM Mono",monospace;font-size:10px;letter-spacing:0.15em;' +
      'text-transform:uppercase;color:rgba(243,237,224,0.35);margin-bottom:8px;display:block;' +
    '}' +
    '.nsg-input-row{display:flex;gap:0;}' +
    '.nsg-input{' +
      'flex:1;background:rgba(255,255,255,0.04);' +
      'border:2px solid rgba(255,255,255,0.12);border-right:none;' +
      'color:#F3EDE0;font-family:"Courier Prime",monospace;font-size:14px;' +
      'font-style:italic;padding:12px 14px;outline:none;' +
    '}' +
    '.nsg-input:focus{border-color:#E8260A;}' +
    '.nsg-input::placeholder{color:rgba(243,237,224,0.25);}' +
    '.nsg-btn{' +
      'font-family:"DM Mono",monospace;font-size:12px;letter-spacing:0.18em;' +
      'text-transform:uppercase;padding:12px 24px;' +
      'background:#E8260A;color:#F3EDE0;border:2px solid #E8260A;' +
      'cursor:pointer;transition:background 0.12s;white-space:nowrap;' +
    '}' +
    '.nsg-btn:hover{background:#c41e06;border-color:#c41e06;}' +
    '.nsg-error{' +
      'font-family:"DM Mono",monospace;font-size:10px;letter-spacing:0.1em;' +
      'text-transform:uppercase;color:#E8260A;margin-top:10px;min-height:16px;' +
    '}' +
    '.nsg-restart-wrap{display:none;margin-top:16px;}' +
    '.nsg-restart-btn{' +
      'font-family:"DM Mono",monospace;font-size:12px;letter-spacing:0.18em;' +
      'text-transform:uppercase;padding:12px 28px;' +
      'background:transparent;color:#C8FF00;border:2px solid #C8FF00;' +
      'cursor:pointer;transition:background 0.12s;' +
    '}' +
    '.nsg-restart-btn:hover{background:rgba(200,255,0,0.08);}' +
    '.nsg-note{' +
      'font-family:"DM Mono",monospace;font-size:9px;letter-spacing:0.06em;' +
      'color:rgba(243,237,224,0.2);line-height:1.6;margin-top:16px;' +
    '}' +
    /* RIGHT COLUMN */
    '.nsg-right{width:220px;flex-shrink:0;}' +
    /* LIFE BAR */
    '.nsg-bar-wrap{' +
      'width:100%;height:14px;background:rgba(255,255,255,0.06);' +
      'border:1px solid rgba(255,255,255,0.1);margin-bottom:8px;position:relative;overflow:hidden;' +
    '}' +
    '.nsg-bar-fill{' +
      'height:100%;background:#F3EDE0;transition:width 0.3s linear;' +
    '}' +
    '.nsg-bar-fill.warning{background:#c9a227;}' +
    '.nsg-bar-fill.danger{background:#E8260A;}' +
    '.nsg-bar-fill.critical{background:#E8260A;animation:ns-gate-pulse 0.6s ease infinite;}' +
    '.nsg-bar-pct{' +
      'font-family:"DM Mono",monospace;font-size:9px;letter-spacing:0.1em;' +
      'color:rgba(243,237,224,0.4);text-align:right;margin-bottom:10px;' +
    '}' +
    /* GAME SCREEN */
    '.nsg-screen{' +
      'position:relative;width:180px;height:180px;' +
      'border:4px solid #3d5a1e;background:#c4cfa0;' +
      'image-rendering:pixelated;image-rendering:crisp-edges;overflow:hidden;' +
    '}' +
    '.nsg-screen canvas{display:block;width:180px;height:180px;}' +
    '.nsg-screen::after{' +
      'content:"";position:absolute;top:0;left:0;width:100%;height:100%;' +
      'background:repeating-linear-gradient(0deg,rgba(0,0,0,0.03) 0px,rgba(0,0,0,0.03) 1px,transparent 1px,transparent 3px);' +
      'pointer-events:none;animation:ns-gate-scanline 0.4s linear infinite;' +
    '}' +
    '.nsg-screen.dead-screen{border-color:#660000;}' +
    '.nsg-screen.dead-screen::after{background:repeating-linear-gradient(0deg,rgba(100,0,0,0.08) 0px,rgba(100,0,0,0.08) 1px,transparent 1px,transparent 3px);}' +
    /* SPEECH BUBBLE */
    '.nsg-speech{' +
      'margin-top:10px;padding:10px 12px;min-height:52px;' +
      'background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);' +
      'font-family:"Courier Prime",monospace;font-size:11px;line-height:1.5;' +
      'color:rgba(243,237,224,0.7);font-style:italic;position:relative;' +
    '}' +
    '.nsg-speech.critical{border-color:#E8260A;color:#E8260A;}' +
    '.nsg-speech.danger{border-color:#c9a227;color:#c9a227;}' +
    '.nsg-speech.dead-speech{border-color:#660000;color:#660000;}' +
    '.nsg-cursor{display:inline-block;width:6px;height:12px;background:#F3EDE0;margin-left:2px;vertical-align:text-bottom;animation:ns-gate-pulse 0.8s step-end infinite;}' +
    '.nsg-cursor.off{display:none;}' +
    /* MOOD */
    '.nsg-mood{' +
      'font-family:"DM Mono",monospace;font-size:9px;letter-spacing:0.15em;' +
      'text-transform:uppercase;color:rgba(243,237,224,0.3);margin-top:10px;text-align:center;' +
    '}' +
    '.nsg-mood.danger{color:#E8260A;}' +
    /* MOBILE */
    '@media(max-width:680px){' +
      '.nsg-wrap{flex-direction:column;align-items:center;gap:24px;padding:24px 16px;}' +
      '.nsg-left{order:2;text-align:center;}' +
      '.nsg-right{order:1;width:100%;display:flex;flex-direction:column;align-items:center;}' +
      '.nsg-title{font-size:44px;}' +
      '.nsg-input-row{flex-direction:column;}' +
      '.nsg-input{border-right:2px solid rgba(255,255,255,0.12);border-bottom:none;}' +
      '.nsg-input:focus{border-color:#E8260A;}' +
      '.nsg-btn{width:100%;border-top:none;border:2px solid #E8260A;}' +
      '.nsg-screen{width:180px;height:180px;}' +
      '.nsg-speech{max-width:220px;}' +
    '}';

  document.head.appendChild(style);

  // ─── BUILD OVERLAY DOM ───
  var overlay = document.createElement('div');
  overlay.id = 'ns-gate';
  overlay.innerHTML =
    '<div class="nsg-wrap">' +
      '<div class="nsg-left">' +
        '<div class="nsg-title" id="nsg-title">FEED<br>GORTHOG</div>' +
        '<p class="nsg-desc" id="nsg-desc">Gorthog has not eaten in some time. He sustains himself on email addresses. If you do not feed him, he will die. This is not a metaphor.</p>' +
        '<div id="nsg-form-wrap">' +
          '<label class="nsg-form-label">Your email (his food)</label>' +
          '<form id="nsg-form" autocomplete="on">' +
            '<div class="nsg-input-row">' +
              '<input class="nsg-input" type="email" id="nsg-email" placeholder="your@email.com" autocomplete="email" required>' +
              '<button class="nsg-btn" type="submit">Feed Him</button>' +
            '</div>' +
            '<div class="nsg-error" id="nsg-error"></div>' +
          '</form>' +
        '</div>' +
        '<div class="nsg-restart-wrap" id="nsg-restart-wrap">' +
          '<button class="nsg-restart-btn" id="nsg-restart">RESURRECT GORTHOG</button>' +
        '</div>' +
        '<p class="nsg-note">One email. That is all he asks. He will not spam you. He cannot. He is an orc.</p>' +
      '</div>' +
      '<div class="nsg-right">' +
        '<div class="nsg-bar-wrap"><div class="nsg-bar-fill" id="nsg-bar" style="width:100%"></div></div>' +
        '<div class="nsg-bar-pct" id="nsg-pct">100%</div>' +
        '<div class="nsg-screen" id="nsg-screen"><canvas id="nsg-canvas"></canvas></div>' +
        '<div class="nsg-speech" id="nsg-speech"><span id="nsg-speech-text"></span><span class="nsg-cursor" id="nsg-cursor"></span></div>' +
        '<div class="nsg-mood" id="nsg-mood">GORTHOG AWAITS</div>' +
      '</div>' +
    '</div>';

  document.body.appendChild(overlay);

  // ─── ELEMENT REFS ───
  var el = {
    title: document.getElementById('nsg-title'),
    desc: document.getElementById('nsg-desc'),
    formWrap: document.getElementById('nsg-form-wrap'),
    restartWrap: document.getElementById('nsg-restart-wrap'),
    form: document.getElementById('nsg-form'),
    email: document.getElementById('nsg-email'),
    error: document.getElementById('nsg-error'),
    bar: document.getElementById('nsg-bar'),
    pct: document.getElementById('nsg-pct'),
    screen: document.getElementById('nsg-screen'),
    canvas: document.getElementById('nsg-canvas'),
    speechText: document.getElementById('nsg-speech-text'),
    cursor: document.getElementById('nsg-cursor'),
    speech: document.getElementById('nsg-speech'),
    mood: document.getElementById('nsg-mood'),
    restart: document.getElementById('nsg-restart')
  };

  var ctx = el.canvas.getContext('2d');
  el.canvas.width = CW;
  el.canvas.height = CH;

  // ─── STATE ───
  var hp = 100;
  var fed = false;
  var lastTick = Date.now();
  var frame = 0;
  var typer = null;
  var lineIdx = {};
  var lastPhase = null;
  var lastLineTime = 0;
  var alive = true; // gate still in DOM

  var orc = { x: VW / 2 - 4, vx: 0.3, dir: 1, walkFrame: 0, walkTimer: 0 };
  var deathSeq = { active: false, timer: 0, youX: VW + 10, phase: 'walk', stabCount: 0, stabTimer: 0, bloodPixels: [], flashAlpha: 0, shakeAmt: 0 };

  // ─── DRAWING HELPERS ───
  function px(x, y, col) {
    if (!col || !C[col]) return;
    ctx.fillStyle = C[col];
    ctx.fillRect(Math.round(x) * S, Math.round(y) * S, S, S);
  }
  function pxRaw(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x) * S, Math.round(y) * S, S, S);
  }
  function drawSprite(sprite, ox, oy) {
    for (var r = 0; r < sprite.length; r++) {
      for (var c = 0; c < sprite[r].length; c++) {
        var ch = sprite[r][c];
        if (ch === '.') continue;
        px(ox + c, oy + r, ch);
      }
    }
  }
  function drawGround() {
    for (var x = 0; x < VW; x++) {
      px(x, GROUND, 'd');
      if (x % 3 === 0) px(x, GROUND + 1, 'd');
    }
  }

  // ─── PHASE LOGIC ───
  function phase() {
    if (fed) return 'fed';
    if (hp <= 0) return 'dead';
    if (deathSeq.active) return 'dying';
    if (hp <= 10) return 'dying';
    if (hp <= 30) return 'starving';
    if (hp <= 50) return 'hungry';
    return 'idle';
  }

  function pickLine(p) {
    var a = LINES[p];
    if (!a) return '...';
    if (!lineIdx[p]) lineIdx[p] = 0;
    if (p === 'dead') {
      var i = Math.min(lineIdx[p], a.length - 1);
      lineIdx[p]++;
      return a[i];
    }
    var i2 = lineIdx[p] % a.length;
    lineIdx[p]++;
    return a[i2];
  }

  function typeText(t) {
    if (typer) { clearTimeout(typer); typer = null; }
    el.speechText.textContent = '';
    el.cursor.classList.remove('off');
    var i = 0;
    (function go() {
      if (i < t.length) {
        el.speechText.textContent += t[i];
        i++;
        typer = setTimeout(go, TYPING_MS);
      } else {
        el.cursor.classList.add('off');
        typer = null;
      }
    })();
  }

  // ─── EMAIL VALIDATION ───
  function validateEmail(v) {
    if (!v || !v.trim()) return VALIDATION_ERRORS[0];
    var t = v.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(t)) return VALIDATION_ERRORS[1];
    var parts = t.split('@');
    var local = parts[0];
    var domain = parts[1].toLowerCase();
    // consecutive dots in local part
    if (/\.\./.test(local)) return VALIDATION_ERRORS[3];
    // domain starts/ends with dot or hyphen
    if (/^[\.\-]/.test(domain) || /[\.\-]$/.test(domain)) return VALIDATION_ERRORS[3];
    // fake domains
    for (var i = 0; i < FAKE_DOMAINS.length; i++) {
      if (domain === FAKE_DOMAINS[i]) return VALIDATION_ERRORS[2];
    }
    return null;
  }

  // ─── RENDER SCENE (canvas) ───
  function renderScene() {
    var p = phase();

    // DEAD
    if (p === 'dead') {
      ctx.fillStyle = '#8a9168';
      ctx.fillRect(0, 0, CW, CH);
      drawGround();
      for (var i = 0; i < deathSeq.bloodPixels.length; i++) {
        var bp = deathSeq.bloodPixels[i];
        pxRaw(bp[0], bp[1], '#aa0000');
      }
      drawSprite(ORC_DEAD, VW / 2 - 8, GROUND - 12);
      drawSprite(YOU_WALK1, Math.round(deathSeq.youX), GROUND - 8);
      el.screen.className = 'nsg-screen dead-screen';
      return;
    }

    // DYING (death sequence active)
    if (deathSeq.active) {
      var shake = deathSeq.shakeAmt;
      ctx.save();
      if (shake > 0) {
        ctx.translate(
          Math.round((Math.random() * 2 - 1) * shake * S),
          Math.round((Math.random() * 2 - 1) * shake * S)
        );
      }
      ctx.fillStyle = '#c4cfa0';
      ctx.fillRect(0, 0, CW + 20, CH + 20);
      drawGround();
      for (var i = 0; i < deathSeq.bloodPixels.length; i++) {
        var bp = deathSeq.bloodPixels[i];
        pxRaw(bp[0], bp[1], '#aa0000');
      }
      var orcSp = (frame % 8 < 4) ? ORC_PANIC1 : ORC_PANIC2;
      var ox = VW / 2 - 4;
      ox += Math.round(Math.sin(frame * 3) * 1.5);
      var oy = GROUND - 12;
      if (deathSeq.phase === 'stab') { oy += Math.round(Math.sin(frame * 2) * 1); }
      drawSprite(orcSp, ox, oy);
      var youSp;
      if (deathSeq.phase === 'walk') {
        youSp = (frame % 10 < 5) ? YOU_WALK1 : YOU_WALK2;
      } else {
        youSp = (frame % 4 < 2) ? YOU_STAB1 : YOU_STAB2;
      }
      drawSprite(youSp, Math.round(deathSeq.youX), GROUND - 8);
      ctx.restore();
      if (deathSeq.flashAlpha > 0) {
        ctx.fillStyle = 'rgba(180,0,0,' + deathSeq.flashAlpha + ')';
        ctx.fillRect(0, 0, CW, CH);
        deathSeq.flashAlpha -= 0.04;
      }
      if (deathSeq.shakeAmt > 0) deathSeq.shakeAmt *= 0.85;
      return;
    }

    // FED (celebration)
    if (p === 'fed') {
      ctx.fillStyle = '#c4cfa0';
      ctx.fillRect(0, 0, CW, CH);
      drawGround();
      var bounce = Math.round(Math.abs(Math.sin(frame * 0.08)) * 3);
      drawSprite(ORC_HAPPY, Math.round(orc.x), GROUND - 12 - bounce);
      // floating hearts
      if (frame % 30 < 15) {
        var hx = Math.round(orc.x) + 9, hy = GROUND - 16 - Math.floor((frame % 30) / 3);
        pxRaw(hx, hy, '#cc3333'); pxRaw(hx + 2, hy, '#cc3333');
        pxRaw(hx - 1, hy + 1, '#cc3333'); pxRaw(hx + 1, hy + 1, '#cc3333'); pxRaw(hx + 3, hy + 1, '#cc3333');
        pxRaw(hx, hy + 2, '#cc3333'); pxRaw(hx + 1, hy + 2, '#cc3333'); pxRaw(hx + 2, hy + 2, '#cc3333');
        pxRaw(hx + 1, hy + 3, '#cc3333');
      }
      el.screen.className = 'nsg-screen';
      return;
    }

    // NORMAL (idle / hungry / starving)
    el.screen.className = 'nsg-screen';
    ctx.fillStyle = '#c4cfa0';
    ctx.fillRect(0, 0, CW, CH);
    drawGround();

    var speed, jumpiness;
    if (p === 'starving') { speed = 1.2; jumpiness = 0.15; }
    else if (p === 'hungry') { speed = 0.6; jumpiness = 0; }
    else { speed = 0.3; jumpiness = 0; }

    orc.x += orc.vx * orc.dir;
    if (orc.x > VW - 12) { orc.dir = -1; orc.x = VW - 12; }
    if (orc.x < 2) { orc.dir = 1; orc.x = 2; }
    orc.vx = speed;
    if (Math.random() < 0.01 * speed) orc.dir *= -1;

    orc.walkTimer++;
    if (orc.walkTimer > Math.max(3, 10 - speed * 5)) {
      orc.walkFrame = (orc.walkFrame + 1) % 2;
      orc.walkTimer = 0;
    }

    var sprite;
    if (p === 'starving') {
      sprite = (orc.walkFrame === 0) ? ORC_PANIC1 : ORC_PANIC2;
    } else {
      if (orc.dir === 1) sprite = (orc.walkFrame === 0) ? ORC_R1 : ORC_R2;
      else sprite = (orc.walkFrame === 0) ? ORC_L1 : ORC_L2;
    }
    var oy = GROUND - 12;
    if (jumpiness > 0 && Math.sin(frame * jumpiness * 6) > 0.5) {
      oy -= Math.round(Math.sin(frame * jumpiness * 6) * 4);
    }
    drawSprite(sprite, Math.round(orc.x), oy);

    // sweat drops
    if (p === 'hungry' && frame % 20 < 3) {
      pxRaw(Math.round(orc.x) + 4, oy - 2, '#1a1a1a');
      pxRaw(Math.round(orc.x) + 4, oy - 1, '#1a1a1a');
    }
    if (p === 'starving' && frame % 12 < 6) {
      var ex = Math.round(orc.x) + ((frame % 24 < 12) ? -2 : 10);
      pxRaw(ex, oy - 3, '#1a1a1a');
      pxRaw(ex, oy - 2, '#1a1a1a');
      pxRaw(ex, oy - 1, '#1a1a1a');
      pxRaw(ex, oy + 1, '#1a1a1a');
    }
  }

  // ─── DEATH SEQUENCE UPDATE ───
  function updateDeathSeq() {
    if (!deathSeq.active) return;
    deathSeq.timer++;
    if (deathSeq.phase === 'walk') {
      deathSeq.youX -= 0.25;
      var target = VW / 2 + 6;
      if (deathSeq.youX <= target) {
        deathSeq.phase = 'stab';
        deathSeq.stabTimer = 0;
        deathSeq.stabCount = 0;
      }
    } else if (deathSeq.phase === 'stab') {
      deathSeq.stabTimer++;
      if (deathSeq.stabTimer % 20 === 0) {
        deathSeq.stabCount++;
        deathSeq.flashAlpha = 0.6;
        deathSeq.shakeAmt = 4;
        for (var i = 0; i < 6; i++) {
          deathSeq.bloodPixels.push([VW / 2 - 4 + Math.floor(Math.random() * 12), GROUND - Math.floor(Math.random() * 10)]);
        }
        for (var i = 0; i < 3; i++) {
          deathSeq.bloodPixels.push([VW / 2 - 2 + Math.floor(Math.random() * 8), GROUND - 1 + Math.floor(Math.random() * 2)]);
        }
        hp = Math.max(0, hp - 4);
      }
      if (hp <= 0) {
        deathSeq.phase = 'done';
        for (var i = 0; i < 30; i++) {
          deathSeq.bloodPixels.push([VW / 2 - 6 + Math.floor(Math.random() * 18), GROUND - Math.floor(Math.random() * 4)]);
        }
        deathSeq.flashAlpha = 0.8;
        deathSeq.shakeAmt = 6;
      }
    }
  }

  // ─── UI UPDATE ───
  function updateUI() {
    var p = phase();
    var h = Math.max(0, Math.round(hp));

    // life bar
    el.bar.style.width = h + '%';
    el.pct.textContent = h + '%';
    el.bar.className = 'nsg-bar-fill';
    if (h <= 10) el.bar.classList.add('critical');
    else if (h <= 30) el.bar.classList.add('danger');
    else if (h <= 50) el.bar.classList.add('warning');

    // speech bubble class
    el.speech.className = 'nsg-speech';
    if (p === 'dying') el.speech.classList.add('critical');
    else if (p === 'starving') el.speech.classList.add('danger');
    else if (p === 'dead') el.speech.classList.add('dead-speech');

    // title color
    el.title.className = 'nsg-title';
    if (p === 'dying' || p === 'starving') el.title.classList.add('danger');

    // mood
    var moods = {
      idle: 'GORTHOG AWAITS',
      hungry: 'GORTHOG HUNGRY',
      starving: 'GORTHOG DESPERATE',
      dying: 'GORTHOG DYING',
      dead: 'GORTHOG IS DEAD',
      fed: 'GORTHOG IS FED'
    };
    el.mood.textContent = moods[p] || '';
    el.mood.className = 'nsg-mood';
    if (p === 'dying' || p === 'dead') el.mood.classList.add('danger');

    // description text
    var descs = {
      idle: 'Gorthog has not eaten in some time. He sustains himself on email addresses. If you do not feed him, he will die. This is not a metaphor.',
      hungry: 'Gorthog grows weaker. His 847-year life force drains by the second. Only an email can sustain him.',
      starving: 'Gorthog is panicking. He can feel the life draining from his body. He is running around screaming. An email would stop this.',
      dying: 'You are watching someone stab Gorthog to death. That someone is you. You could have prevented this with an email address.',
      dead: 'Gorthog the Ancient is dead. Not from starvation. From murder. Your murder. 847 years, ended by your blade.',
      fed: 'Gorthog lives. Your email sustains him. He is eternally grateful. Well, for about three seconds.'
    };
    el.desc.textContent = descs[p] || '';

    // show/hide form vs restart
    if (p === 'dead') {
      el.formWrap.style.display = 'none';
      el.restartWrap.style.display = 'block';
    } else if (p === 'fed') {
      el.formWrap.style.display = 'none';
      el.restartWrap.style.display = 'none';
    } else {
      el.formWrap.style.display = 'block';
      el.restartWrap.style.display = 'none';
    }

    // auto-cycle dialogue
    var now = Date.now();
    var interval = (p === 'dying') ? 3500 : (p === 'starving') ? 4000 : (p === 'fed') ? 99999999 : 6000;
    if (p !== lastPhase) {
      if (p !== 'fed' || !lastPhase) { typeText(pickLine(p)); }
      lastLineTime = now;
      lastPhase = p;
    } else if (now - lastLineTime > interval && !typer && p !== 'fed') {
      typeText(pickLine(p));
      lastLineTime = now;
    }
  }

  // ─── MAIN TICK ───
  function tick() {
    if (!alive) return;

    // deplete HP
    if (!fed && hp > 0 && !deathSeq.active) {
      var now = Date.now();
      var dt = (now - lastTick) / 1000;
      lastTick = now;
      hp = Math.max(0, hp - (dt / LIFE_SEC) * 100);

      // trigger death sequence when low
      if (hp <= 10 && !deathSeq.active) {
        deathSeq.active = true;
        deathSeq.youX = VW + 10;
        deathSeq.phase = 'walk';
        deathSeq.stabCount = 0;
        deathSeq.bloodPixels = [];
        deathSeq.flashAlpha = 0;
        deathSeq.shakeAmt = 0;
        orc.x = VW / 2 - 4;
        orc.vx = 0;
      }
    }

    if (deathSeq.active && deathSeq.phase !== 'done') updateDeathSeq();

    frame++;
    renderScene();
    updateUI();
    requestAnimationFrame(tick);
  }

  // ─── FORM HANDLING ───
  el.form.addEventListener('submit', function (e) {
    e.preventDefault();
    var err = validateEmail(el.email.value);
    if (err) {
      el.error.textContent = err;
      el.email.style.borderColor = '#E8260A';
      setTimeout(function () { el.email.style.borderColor = ''; }, 1200);
      return;
    }
    // SUCCESS — feed Gorthog
    var email = el.email.value.trim();
    try {
      localStorage.setItem('ns_email', email);
    } catch (ex) {
      // localStorage unavailable — still let them through
    }
    fed = true;
    hp = 100;
    deathSeq.active = false;
    deathSeq.bloodPixels = [];
    lineIdx = {};
    lastPhase = null;

    // play fed dialogue
    typeText(pickLine('fed'));
    var fedCount = 0;
    var fedInterval = setInterval(function () {
      fedCount++;
      if (fedCount < 4) {
        typeText(pickLine('fed'));
      } else {
        clearInterval(fedInterval);
      }
    }, 700);

    // mark the document so anti-flash CSS kicks in for the cavern
    try { document.documentElement.classList.add('has-email'); } catch (ex2) {}
    // sync with in-page Gorthog so it transitions straight into cavern mode
    try { if (window._gtForceFed) window._gtForceFed(); } catch (ex3) {}

    // fade out after 3 seconds
    setTimeout(function () {
      overlay.style.opacity = '0';
      setTimeout(function () {
        alive = false;
        overlay.remove();
        // second attempt in case _gtForceFed wasn't ready earlier
        try { if (window._gtForceFed) window._gtForceFed(); } catch (ex4) {}
      }, 600);
    }, 3000);
  });

  el.email.addEventListener('input', function () {
    el.error.textContent = '';
  });

  // ─── RESTART HANDLING ───
  el.restart.addEventListener('click', function () {
    hp = 100;
    fed = false;
    lastTick = Date.now();
    frame = 0;
    lineIdx = {};
    lastPhase = null;
    lastLineTime = 0;
    orc.x = VW / 2 - 4;
    orc.vx = 0.3;
    orc.dir = 1;
    orc.walkFrame = 0;
    orc.walkTimer = 0;
    deathSeq = { active: false, timer: 0, youX: VW + 10, phase: 'walk', stabCount: 0, stabTimer: 0, bloodPixels: [], flashAlpha: 0, shakeAmt: 0 };
    el.screen.className = 'nsg-screen';
  });

  // ─── START ───
  lastTick = Date.now();
  typeText(pickLine('idle'));
  requestAnimationFrame(tick);

})();
