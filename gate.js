/**
 * NAPALM SUNRISE — Email Gate
 *
 * Blocks new visitors with a full-screen overlay until they enter their email.
 * Once submitted, the email is stored in localStorage ('ns_email') and the
 * gate is skipped on all subsequent visits.
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

  // --- Build the gate overlay ---
  var overlay = document.createElement('div');
  overlay.id = 'ns-email-gate';
  overlay.innerHTML =
    '<div class="ns-gate-inner">' +
      '<canvas id="ns-gate-gorthog" width="192" height="192"></canvas>' +
      '<div class="ns-gate-title">GORTHOG<br>HUNGERS</div>' +
      '<p class="ns-gate-body">Gorthog has not eaten in some time. He sustains himself on email addresses. Feed him or he will perish. This is not a drill.</p>' +
      '<form class="ns-gate-form" id="ns-gate-form" autocomplete="on">' +
        '<div class="ns-gate-input-row">' +
          '<input class="ns-gate-input" type="email" id="ns-gate-email" placeholder="your@email.com" autocomplete="email" required>' +
          '<button class="ns-gate-btn" type="submit">FEED</button>' +
        '</div>' +
        '<div class="ns-gate-error" id="ns-gate-error"></div>' +
      '</form>' +
      '<p class="ns-gate-note">One email. That is all he asks. He will not spam you. He cannot. He is an orc.</p>' +
    '</div>';

  // --- Inject styles ---
  var style = document.createElement('style');
  style.textContent =
    '#ns-email-gate{' +
      'position:fixed;top:0;left:0;width:100%;height:100%;z-index:99999;' +
      'background:#0D0D0D;' +
      'display:flex;align-items:center;justify-content:center;' +
      'font-family:"Courier Prime",monospace;' +
      'overflow:auto;' +
    '}' +
    '.ns-gate-inner{' +
      'text-align:center;padding:40px 28px;max-width:480px;width:100%;' +
    '}' +
    '#ns-gate-gorthog{' +
      'image-rendering:pixelated;image-rendering:crisp-edges;' +
      'width:192px;height:192px;margin:0 auto 28px;display:block;' +
      'border:2px solid rgba(255,255,255,0.08);' +
    '}' +
    '.ns-gate-title{' +
      'font-family:"Bebas Neue",sans-serif;font-size:72px;line-height:0.9;' +
      'letter-spacing:0.04em;color:#F3EDE0;margin-bottom:20px;' +
    '}' +
    '.ns-gate-body{' +
      'font-size:15px;line-height:1.7;color:rgba(243,237,224,0.55);' +
      'font-style:italic;margin-bottom:32px;' +
    '}' +
    '.ns-gate-form{margin-bottom:16px;}' +
    '.ns-gate-input-row{display:flex;gap:0;}' +
    '.ns-gate-input{' +
      'flex:1;background:rgba(255,255,255,0.04);' +
      'border:2px solid rgba(255,255,255,0.12);border-right:none;' +
      'color:#F3EDE0;font-family:"Courier Prime",monospace;font-size:14px;' +
      'font-style:italic;padding:12px 14px;outline:none;' +
    '}' +
    '.ns-gate-input:focus{border-color:#E8260A;}' +
    '.ns-gate-input::placeholder{color:rgba(243,237,224,0.25);}' +
    '.ns-gate-btn{' +
      'font-family:"DM Mono",monospace;font-size:12px;letter-spacing:0.18em;' +
      'text-transform:uppercase;padding:12px 28px;' +
      'background:#E8260A;color:#F3EDE0;border:2px solid #E8260A;' +
      'cursor:pointer;transition:background 0.12s;white-space:nowrap;' +
    '}' +
    '.ns-gate-btn:hover{background:#c41e06;border-color:#c41e06;}' +
    '.ns-gate-error{' +
      'font-family:"DM Mono",monospace;font-size:10px;letter-spacing:0.1em;' +
      'text-transform:uppercase;color:#E8260A;margin-top:10px;min-height:16px;' +
    '}' +
    '.ns-gate-note{' +
      'font-family:"DM Mono",monospace;font-size:9px;letter-spacing:0.06em;' +
      'color:rgba(243,237,224,0.2);line-height:1.6;' +
    '}' +
    '@media(max-width:480px){' +
      '.ns-gate-title{font-size:48px;}' +
      '#ns-gate-gorthog{width:128px;height:128px;}' +
      '.ns-gate-input-row{flex-direction:column;}' +
      '.ns-gate-input{border-right:2px solid rgba(255,255,255,0.12);border-bottom:none;}' +
      '.ns-gate-input:focus{border-color:#E8260A;}' +
      '.ns-gate-btn{width:100%;border-top:none;border:2px solid #E8260A;}' +
    '}';

  document.head.appendChild(style);
  document.body.appendChild(overlay);

  // --- Draw Gorthog pixel art on the gate canvas ---
  var gCanvas = document.getElementById('ns-gate-gorthog');
  var gCtx = gCanvas.getContext('2d');
  var S = 6;

  var GC = {
    '.': null,
    'o': '#0d0d0d',
    'g': '#3a782f',
    'G': '#4e9638',
    'L': '#64aa4b',
    's': '#2d5a24',
    'R': '#8b2010',
    'r': '#e8260a',
    'T': '#dcc864',
    't': '#c4b050',
    'e': '#4a2810',
    'E': '#3a1c08',
    'W': '#cccc44',
    'w': '#998822',
    'p': '#1a0a00',
    'B': '#2a2a2a',
    'n': '#2d4a22',
    'F': '#e8ddc0',
    'f': '#c8c0a0',
    'S': '#7a5e2a',
    'b': '#332e20',
    'X': '#ff0000'
  };

  var gSpriteOpen = [
    '................................',
    '...........oooooooooooo.........',
    '.........oogssgggggssgooo.......',
    '........ogsgggGGGGGGgggsgo......',
    '.......ogsggGGLLLLLLGGggsgo....',
    '......ogsgGGLLLLLLLLLLGgsgo....',
    '.....ogsgGLLLLLLLLLLLLLGgsgo...',
    '....ogsgGLLLLLLLLLLLLLLGgsgo...',
    '...oEesgGLLLLLLLLLLLLLLGgseEo..',
    '...oEeegGLLLLLLLLLLLLLLGgeeEo..',
    '..oEeeegGLLLLLLLLLLLLLLGgeeeEo.',
    '..oEeeeGGLBBBoooLLLooBBGGeeEo..',
    '...oesgGLBogGGGoLLoGGGoBLgseo..',
    '...oesgGLoWWwGoLLLoWWwGLLgseo..',
    '...oesgGLopppGoLLLopppGLLgseo..',
    '...oesgGLoWWwGoLLLoWWwGLLgseo..',
    '...oesgGGLooooLLLLLooooGGgseo..',
    '...oesgGGLLLLLLLLLLLLLGGgseo...',
    '...oesgGGLLSSLnnnnLSSLGGgseo...',
    '...oesgGGGLLLngggnLLLGGGgseo...',
    '..oTgggGGGLLLLLLLLLLLGGGgggTo..',
    '..oTtggGGGgLLLLLLLLLgGGGggtTo..',
    '..oTtggGGFoorrrrrrrrooFGGggtTo.',
    '...otggGGoFoRRRRRRRRoFoGGggto..',
    '...oogGGGoFFoRRRRRRoFFoGGGgoo..',
    '....osgGGGoooooooooooooGGgsoo..',
    '.....osggGGbGGLLLLGGbGGggsoo...',
    '......ossgGGbGGGGGGbGGgssooo...',
    '.......oossgGGGGGGGGgssoo......',
    '........ooosssggggsssoo........',
    '..........oooooooooooo.........',
    '................................'
  ];

  var gSpriteBlink = [
    '................................',
    '...........oooooooooooo.........',
    '.........oogssgggggssgooo.......',
    '........ogsgggGGGGGGgggsgo......',
    '.......ogsggGGLLLLLLGGggsgo....',
    '......ogsgGGLLLLLLLLLLGgsgo....',
    '.....ogsgGLLLLLLLLLLLLLGgsgo...',
    '....ogsgGLLLLLLLLLLLLLLGgsgo...',
    '...oEesgGLLLLLLLLLLLLLLGgseEo..',
    '...oEeegGLLLLLLLLLLLLLLGgeeEo..',
    '..oEeeegGLLLLLLLLLLLLLLGgeeeEo.',
    '..oEeeeGGLBBBoooLLLooBBGGeeEo..',
    '...oesgGLBogGGGoLLoGGGoBLgseo..',
    '...oesgGLooooGoLLLooooGLLgseo..',
    '...oesgGLLLLLGoLLLLLLLGLLgseo..',
    '...oesgGLooooGoLLLooooGLLgseo..',
    '...oesgGGLooooLLLLLooooGGgseo..',
    '...oesgGGLLLLLLLLLLLLLGGgseo...',
    '...oesgGGLLSSLnnnnLSSLGGgseo...',
    '...oesgGGGLLLngggnLLLGGGgseo...',
    '..oTgggGGGLLLLLLLLLLLGGGgggTo..',
    '..oTtggGGGgLLLLLLLLLgGGGggtTo..',
    '..oTtggGGFoorrrrrrrrooFGGggtTo.',
    '...otggGGoFoRRRRRRRRoFoGGggto..',
    '...oogGGGoFFoRRRRRRoFFoGGGgoo..',
    '....osgGGGoooooooooooooGGgsoo..',
    '.....osggGGbGGLLLLGGbGGggsoo...',
    '......ossgGGbGGGGGGbGGgssooo...',
    '.......oossgGGGGGGGGgssoo......',
    '........ooosssggggsssoo........',
    '..........oooooooooooo.........',
    '................................'
  ];

  // Pad sprite rows to 32 chars
  function padRow(s) {
    while (s.length < 32) s += '.';
    return s.length > 32 ? s.substring(0, 32) : s;
  }
  [gSpriteOpen, gSpriteBlink].forEach(function (sp) {
    for (var i = 0; i < sp.length; i++) sp[i] = padRow(sp[i]);
  });

  function drawSprite(ctx, sprite, colors) {
    ctx.clearRect(0, 0, 192, 192);
    for (var y = 0; y < sprite.length; y++) {
      for (var x = 0; x < sprite[y].length; x++) {
        var ch = sprite[y][x];
        if (ch === '.' || !colors[ch]) continue;
        ctx.fillStyle = colors[ch];
        ctx.fillRect(x * S, y * S, S, S);
      }
    }
  }

  // Animate Gorthog with blinking
  var blink = false;
  var blinkTimer = 0;
  var nextBlink = 120 + Math.random() * 200;

  function animateGorthog() {
    blinkTimer++;
    if (blink) {
      if (blinkTimer > 6) { blink = false; blinkTimer = 0; nextBlink = 100 + Math.random() * 250; }
    } else {
      if (blinkTimer > nextBlink) { blink = true; blinkTimer = 0; }
    }
    drawSprite(gCtx, blink ? gSpriteBlink : gSpriteOpen, GC);
    if (document.getElementById('ns-email-gate')) {
      requestAnimationFrame(animateGorthog);
    }
  }
  animateGorthog();

  // --- Form handling ---
  var form = document.getElementById('ns-gate-form');
  var emailInput = document.getElementById('ns-gate-email');
  var errorEl = document.getElementById('ns-gate-error');

  function validateEmail(v) {
    if (!v || !v.trim()) return 'GORTHOG NEED EMAIL, NOT EMPTY AIR';
    var t = v.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(t)) return 'THAT NOT REAL EMAIL. GORTHOG NOT STUPID.';
    var d = t.split('@')[1].toLowerCase();
    if (['test.com', 'example.com', 'fake.com', 'asdf.com'].indexOf(d) > -1) return 'GORTHOG KNOW FAKE EMAIL WHEN SEE ONE.';
    return null;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var err = validateEmail(emailInput.value);
    if (err) {
      errorEl.textContent = err;
      emailInput.style.borderColor = '#E8260A';
      setTimeout(function () { emailInput.style.borderColor = ''; }, 1200);
      return;
    }
    // Store email and dismiss gate
    var email = emailInput.value.trim();
    try {
      localStorage.setItem('ns_email', email);
    } catch (ex) {
      // localStorage unavailable — still let them through for this session
    }
    overlay.style.transition = 'opacity 0.4s ease';
    overlay.style.opacity = '0';
    setTimeout(function () {
      overlay.remove();
    }, 400);
  });

  emailInput.addEventListener('input', function () {
    errorEl.textContent = '';
  });

})();
