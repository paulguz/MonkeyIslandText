/* ==========================================================================
   loader.js - ZX Spectrum tape loading animation
   Simulates loading a game from cassette tape on a Sinclair ZX Spectrum.
   Plays a full border-stripe + line-by-line screen load sequence before
   handing control to the game engine.

   Phases:
   1. Pilot tone  - thick red/blue border bars, white screen (0-3s)
   2. Header      - "Program: Monkey" text appears (3-6s)
   3. Data block  - thin yellow/blue bars (6-6.5s)
   4. Bitmap load - B/W image reveals line by line (6.5-~8.5s)
   5. Colour wash - colour attributes sweep down in 8-row bands (~8.5-~10.5s)
   6. Hold        - complete image, bars continue (10.5-13s)
   7. Ready       - border goes white, "Press any key to begin" blinks
   ========================================================================== */

(function () {
  'use strict';

  window.Loader = {};

  // ZX Spectrum palette
  var ZX = {
    black:   '#000000',
    blue:    '#0000D7',
    red:     '#D70000',
    magenta: '#D700D7',
    green:   '#00D700',
    cyan:    '#00D7D7',
    yellow:  '#D7D700',
    white:   '#D7D7D7'
  };

  var W = 256;
  var H = 192;

  // ========================================================================
  // BLOCK FONT - 5x7 monospaced uppercase for chunky title text
  // Only characters needed for "MONKEY ISLAND"
  // ========================================================================

  var FONT = {
    A: ['.###.','#...#','#...#','#####','#...#','#...#','#...#'],
    D: ['####.','#...#','#...#','#...#','#...#','#...#','####.'],
    E: ['#####','#....','#....','####.','#....','#....','#####'],
    I: ['.###.','..#..','..#..','..#..','..#..','..#..', '.###.'],
    K: ['#...#','#..#.','#.#..','##...','#.#..','#..#.','#...#'],
    L: ['#....','#....','#....','#....','#....','#....','#####'],
    M: ['#...#','##.##','#.#.#','#.#.#','#...#','#...#','#...#'],
    N: ['#...#','##..#','#.#.#','#..##','#...#','#...#','#...#'],
    O: ['.###.','#...#','#...#','#...#','#...#','#...#','.###.'],
    S: ['.###.','#...#','#....','.###.','....#','#...#','.###.'],
    Y: ['#...#','#...#','.#.#.','..#..','..#..','..#..','..#..'],
    ' ': ['.....','.....','.....','.....','.....','.....','.....']
  };

  function drawBlockText(ctx, text, y, scale, color) {
    var charW = 5, gap = 1;
    var stride = (charW + gap) * scale;
    var totalW = text.length * stride - gap * scale;
    var startX = Math.floor((W - totalW) / 2);

    ctx.fillStyle = color;
    for (var i = 0; i < text.length; i++) {
      var glyph = FONT[text[i]];
      if (!glyph) continue;
      var ox = startX + i * stride;
      for (var row = 0; row < 7; row++) {
        var line = glyph[row];
        for (var col = 0; col < 5; col++) {
          if (line[col] === '#') {
            ctx.fillRect(ox + col * scale, y + row * scale, scale, scale);
          }
        }
      }
    }
  }

  // ========================================================================
  // TITLE SCREEN ART - ZX Spectrum-style Monkey Island logo
  // ========================================================================

  function drawTitleScreen(ctx) {
    var i;

    // --- Sky background ---
    ctx.fillStyle = ZX.blue;
    ctx.fillRect(0, 0, W, H);

    // --- Stars (single pixels) ---
    ctx.fillStyle = ZX.white;
    var stars = [
      [12,5],[28,12],[52,8],[78,3],[95,18],[120,7],[148,15],[170,4],
      [195,10],[218,6],[238,14],[42,22],[108,25],[155,28],[190,20],
      [25,38],[68,42],[135,35],[210,40],[245,32],[8,55],[85,48],[175,52],
      [60,16],[142,8],[225,22],[15,50],[100,44],[165,38],[248,12],
      [35,3],[185,6],[72,28],[205,48],[18,62],[130,58],[240,55]
    ];
    for (i = 0; i < stars.length; i++) {
      ctx.fillRect(stars[i][0], stars[i][1], 1, 1);
    }

    // Bright stars (cross pattern)
    var bright = [[45,14],[160,9],[200,24],[100,4],[230,17],[75,32],[250,42]];
    for (i = 0; i < bright.length; i++) {
      ctx.fillRect(bright[i][0] - 1, bright[i][1], 3, 1);
      ctx.fillRect(bright[i][0], bright[i][1] - 1, 1, 3);
    }

    // --- Clouds ---
    ctx.fillStyle = ZX.cyan;
    ctx.fillRect(168, 14, 55, 8);
    ctx.fillRect(175, 9, 42, 5);
    ctx.fillRect(172, 22, 35, 5);
    ctx.fillRect(10, 20, 50, 7);
    ctx.fillRect(18, 14, 38, 6);
    ctx.fillRect(15, 27, 30, 4);
    ctx.fillRect(215, 38, 35, 6);
    ctx.fillRect(220, 34, 25, 4);

    // --- Water ---
    ctx.fillStyle = ZX.cyan;
    ctx.fillRect(0, 165, W, 27);
    ctx.fillStyle = ZX.blue;
    for (var wy = 169; wy < 192; wy += 5) {
      ctx.fillRect(0, wy, W, 2);
    }

    // --- Foothills left ---
    ctx.fillStyle = ZX.black;
    ctx.beginPath();
    ctx.moveTo(0, 165); ctx.lineTo(0, 142); ctx.lineTo(12, 132);
    ctx.lineTo(28, 138); ctx.lineTo(38, 130); ctx.lineTo(50, 140);
    ctx.lineTo(55, 165); ctx.closePath(); ctx.fill();

    // --- Foothills right ---
    ctx.beginPath();
    ctx.moveTo(200, 165); ctx.lineTo(210, 138); ctx.lineTo(222, 130);
    ctx.lineTo(235, 135); ctx.lineTo(248, 128); ctx.lineTo(256, 138);
    ctx.lineTo(256, 165); ctx.closePath(); ctx.fill();

    // --- Main volcano ---
    ctx.fillStyle = ZX.black;
    ctx.beginPath();
    ctx.moveTo(40, 165); ctx.lineTo(55, 140); ctx.lineTo(70, 118);
    ctx.lineTo(82, 98); ctx.lineTo(95, 76); ctx.lineTo(105, 60);
    ctx.lineTo(115, 45); ctx.lineTo(124, 34); ctx.lineTo(128, 28);
    ctx.lineTo(132, 34); ctx.lineTo(141, 45); ctx.lineTo(151, 60);
    ctx.lineTo(162, 76); ctx.lineTo(174, 96); ctx.lineTo(186, 118);
    ctx.lineTo(198, 140); ctx.lineTo(215, 165);
    ctx.closePath(); ctx.fill();

    // Mountain ridge lines
    ctx.strokeStyle = ZX.blue;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(128, 28); ctx.lineTo(120, 50); ctx.lineTo(108, 80);
    ctx.lineTo(95, 115); ctx.lineTo(85, 148); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(128, 28); ctx.lineTo(138, 55); ctx.lineTo(152, 85);
    ctx.lineTo(168, 118); ctx.lineTo(182, 148); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(115, 48); ctx.lineTo(130, 75); ctx.lineTo(148, 108);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(100, 68); ctx.lineTo(88, 95); ctx.lineTo(78, 125);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(158, 68); ctx.lineTo(170, 95); ctx.lineTo(182, 125);
    ctx.stroke();

    // --- Town buildings at mountain base ---
    ctx.fillStyle = ZX.white;
    var bldgs = [
      [85,153,5,9],[92,151,6,11],[100,154,5,8],[107,150,6,12],
      [115,153,5,9],[122,155,5,7],[129,152,6,10],[137,154,5,8],
      [144,151,6,11],[152,154,5,8],[159,152,6,10],[167,155,5,7]
    ];
    for (i = 0; i < bldgs.length; i++) {
      var b = bldgs[i];
      ctx.fillRect(b[0], b[1], b[2], b[3]);
    }

    // Window lights
    ctx.fillStyle = ZX.yellow;
    var wins = [
      [87,155],[87,158],[94,153],[94,157],[102,156],[109,153],
      [109,157],[109,160],[117,155],[117,158],[124,157],[131,154],
      [131,158],[139,156],[146,153],[146,157],[154,156],[161,154],
      [161,158],[169,157]
    ];
    for (i = 0; i < wins.length; i++) {
      ctx.fillRect(wins[i][0], wins[i][1], 2, 2);
    }

    // --- Skull and crossbones at the peak ---
    // Crossbones behind skull
    ctx.strokeStyle = ZX.white;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(113, 14); ctx.lineTo(143, 42);
    ctx.moveTo(143, 14); ctx.lineTo(113, 42);
    ctx.stroke();

    // Bone ends
    ctx.fillStyle = ZX.white;
    var boneEnds = [[113,14],[143,14],[113,42],[143,42]];
    for (i = 0; i < boneEnds.length; i++) {
      ctx.beginPath();
      ctx.arc(boneEnds[i][0], boneEnds[i][1], 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Cranium
    ctx.fillStyle = ZX.white;
    ctx.beginPath();
    ctx.arc(128, 22, 11, Math.PI, 0);
    ctx.fill();
    ctx.fillRect(117, 21, 22, 11);

    // Jaw
    ctx.fillRect(120, 32, 16, 5);
    ctx.fillRect(122, 37, 12, 3);

    // Eye sockets
    ctx.fillStyle = ZX.black;
    ctx.fillRect(121, 22, 5, 5);
    ctx.fillRect(130, 22, 5, 5);

    // Eye glow
    ctx.fillStyle = ZX.red;
    ctx.fillRect(122, 23, 2, 2);
    ctx.fillRect(131, 23, 2, 2);

    // Nose
    ctx.fillStyle = ZX.black;
    ctx.beginPath();
    ctx.moveTo(127, 28); ctx.lineTo(129, 31); ctx.lineTo(125, 31);
    ctx.closePath(); ctx.fill();

    // Teeth lines
    ctx.strokeStyle = ZX.black;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(123, 37); ctx.lineTo(123, 40);
    ctx.moveTo(126, 37); ctx.lineTo(126, 40);
    ctx.moveTo(129, 37); ctx.lineTo(129, 40);
    ctx.moveTo(132, 37); ctx.lineTo(132, 40);
    ctx.stroke();

    // --- Title text ---
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // "THE SECRET OF" with drop shadow
    ctx.font = '10px "ZX Spectrum-7", monospace';
    ctx.fillStyle = ZX.black;
    ctx.fillText('THE SECRET OF', W / 2 + 1, 51);
    ctx.fillStyle = ZX.white;
    ctx.fillText('THE SECRET OF', W / 2, 50);

    // "MONKEY" - chunky block letters with drop shadow
    drawBlockText(ctx, 'MONKEY', 62, 3, ZX.black);
    drawBlockText(ctx, 'MONKEY', 61, 3, ZX.magenta);

    // "ISLAND" - chunky block letters with drop shadow
    drawBlockText(ctx, 'ISLAND', 86, 3, ZX.black);
    drawBlockText(ctx, 'ISLAND', 85, 3, ZX.magenta);

    // "PART ONE: THE THREE TRIALS"
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '8px "ZX Spectrum-7", monospace';
    ctx.fillStyle = ZX.black;
    ctx.fillText('PART ONE: THE THREE TRIALS', W / 2 + 1, 111);
    ctx.fillStyle = ZX.yellow;
    ctx.fillText('PART ONE: THE THREE TRIALS', W / 2, 110);
  }

  // ========================================================================
  // MONOCHROME CONVERSION - simulates bitmap-only screen data
  // ========================================================================

  function createMonochrome(colorCanvas) {
    var mono = document.createElement('canvas');
    mono.width = W;
    mono.height = H;
    var mCtx = mono.getContext('2d');
    var srcData = colorCanvas.getContext('2d').getImageData(0, 0, W, H);
    var src = srcData.data;
    var dstData = mCtx.createImageData(W, H);
    var dst = dstData.data;

    for (var i = 0; i < src.length; i += 4) {
      var lum = 0.299 * src[i] + 0.587 * src[i + 1] + 0.114 * src[i + 2];
      var v = lum > 50 ? 215 : 0;
      dst[i]     = v;
      dst[i + 1] = v;
      dst[i + 2] = v;
      dst[i + 3] = 255;
    }

    mCtx.putImageData(dstData, 0, 0);
    return mono;
  }

  // ========================================================================
  // MAIN LOADING SEQUENCE
  // ========================================================================

  Loader.start = function (callback) {
    var body = document.body;
    var gameContainer = document.getElementById('game-container');
    var canvas = document.getElementById('room-canvas');
    if (!canvas) { if (callback) callback(); return; }

    var ctx = canvas.getContext('2d');
    canvas.width = W;
    canvas.height = H;
    ctx.imageSmoothingEnabled = false;

    // Hide normal game UI elements
    var uiIds = ['title-bar', 'output', 'input-line', 'status-bar'];
    uiIds.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });

    // Make canvas fill the screen during loading
    canvas.classList.add('loader-fullscreen');

    // Ensure game container is positioned for overlay hint
    var origPosition = gameContainer.style.position;
    gameContainer.style.position = 'relative';

    // Create hint overlay element
    var hint = document.createElement('div');
    hint.id = 'loader-hint';
    hint.style.display = 'none';
    gameContainer.appendChild(hint);

    // Prepare title artwork on offscreen canvases
    var offColor = document.createElement('canvas');
    offColor.width = W;
    offColor.height = H;
    var offCtx = offColor.getContext('2d');
    offCtx.imageSmoothingEnabled = false;
    drawTitleScreen(offCtx);

    var offMono = createMonochrome(offColor);
    var monoCtx = offMono.getContext('2d');
    var colorCtx2 = offColor.getContext('2d');

    // State tracking
    var pendingTimers = [];
    var pendingIntervals = [];
    var skipped = false;
    var readyForGame = false;
    var blinkInterval = null;
    var savedRegion = null;

    function schedule(fn, delay) {
      var id = setTimeout(function () {
        if (!skipped) fn();
      }, delay);
      pendingTimers.push(id);
      return id;
    }

    function clearAll() {
      pendingTimers.forEach(clearTimeout);
      pendingIntervals.forEach(clearInterval);
      pendingTimers = [];
      pendingIntervals = [];
    }

    function restoreUI() {
      uiIds.forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.style.display = '';
      });
      gameContainer.style.position = origPosition || '';
    }

    // -- Input handling: skip or start game --
    var musicStarted = false;

    function onInput(e) {
      if (e.type === 'keydown') {
        var k = e.key;
        if (k === 'Shift' || k === 'Control' || k === 'Alt' || k === 'Meta') return;
      }
      if (readyForGame) {
        // First keypress on title screen: start the music (needs user gesture)
        // Second keypress: start the game
        if (!musicStarted && window.Beeper) {
          musicStarted = true;
          try { Beeper.playTheme(); } catch (ex) { /* proceed anyway */ }
          // Update prompt to tell user to press again
          hint.textContent = 'Press any key to begin';
          return;
        }
        startGame();
      } else if (!skipped) {
        skipToReady();
      }
    }

    document.addEventListener('keydown', onInput);
    document.addEventListener('click', onInput);

    // -- Skip to ready state --
    function skipToReady() {
      skipped = true;
      clearAll();
      showReady();
      // Skip is a user gesture — start music immediately
      if (!musicStarted && window.Beeper) {
        musicStarted = true;
        try { Beeper.playTheme(); } catch (ex) { /* proceed anyway */ }
        hint.textContent = 'Press any key to begin';
      }
    }

    // -- Show the completed title screen with prompt --
    function showReady() {
      readyForGame = true;
      body.classList.remove('loader-border-rb', 'loader-border-yb');

      // Draw complete colour title screen
      ctx.drawImage(offColor, 0, 0);

      // Save region behind prompt text for blinking
      savedRegion = ctx.getImageData(0, 178, W, 14);

      // Start blinking prompt on canvas
      var blinkOn = true;
      drawPrompt(ctx);
      blinkInterval = setInterval(function () {
        blinkOn = !blinkOn;
        if (blinkOn) {
          drawPrompt(ctx);
        } else {
          ctx.putImageData(savedRegion, 0, 178);
        }
      }, 500);

      // Music starts on first user keypress (needs gesture for Web Audio)

      // Update hint overlay
      hint.textContent = 'Press any key to play';
      hint.className = 'loader-blink';
      hint.style.display = 'block';
    }

    function drawPrompt(c) {
      // Dark background bar so text is readable over the sea
      c.fillStyle = ZX.black;
      c.fillRect(0, 178, W, 14);
      c.fillStyle = ZX.white;
      c.textAlign = 'center';
      c.textBaseline = 'top';
      c.font = '8px "ZX Spectrum-7", monospace';
      c.fillText('Press any key to begin', W / 2, 180);
    }

    // -- Start the actual game --
    function startGame() {
      document.removeEventListener('keydown', onInput);
      document.removeEventListener('click', onInput);
      if (blinkInterval) clearInterval(blinkInterval);

      // Stop beeper music on game start
      if (window.Beeper) Beeper.stop();

      // Brief white flash
      body.classList.remove('loader-border-rb', 'loader-border-yb');
      canvas.classList.remove('loader-fullscreen');
      ctx.fillStyle = ZX.white;
      ctx.fillRect(0, 0, W, H);
      hint.style.display = 'none';

      setTimeout(function () {
        ctx.fillStyle = ZX.black;
        ctx.fillRect(0, 0, W, H);
        hint.remove();
        restoreUI();
        if (callback) callback();
      }, 400);
    }

    // ============================================================
    // PHASE SEQUENCE
    // ============================================================

    // Phase 1: Pilot tone - red/blue border bars, white screen
    body.classList.add('loader-border-rb');
    ctx.fillStyle = ZX.white;
    ctx.fillRect(0, 0, W, H);

    // Show skip hint after 2s
    schedule(function () {
      hint.textContent = 'Press any key to skip';
      hint.style.display = 'block';
    }, 2000);

    // Phase 2: Header at 3s
    schedule(function () {
      ctx.fillStyle = ZX.black;
      ctx.font = '8px "ZX Spectrum-7", monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText('Program: Monkey', 2, 2);
    }, 3000);

    // Phase 3: Data block at 6s - switch to yellow/blue
    schedule(function () {
      body.classList.remove('loader-border-rb');
      body.classList.add('loader-border-yb');
      ctx.fillStyle = ZX.black;
      ctx.font = '8px "ZX Spectrum-7", monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText('Bytes: 6912', 2, 14);
    }, 6000);

    // Phase 4: B/W bitmap load at 6.5s
    schedule(function () {
      hint.style.display = 'none';
      var row = 0;
      var rowsPerTick = 2;

      var monoTimer = setInterval(function () {
        if (skipped) { clearInterval(monoTimer); return; }
        if (row >= H) {
          clearInterval(monoTimer);
          schedule(startColorSweep, 300);
          return;
        }
        var band = Math.min(rowsPerTick, H - row);
        ctx.putImageData(monoCtx.getImageData(0, row, W, band), 0, row);
        row += band;
      }, 18);
      pendingIntervals.push(monoTimer);
    }, 6500);

    // Phase 5: Colour attribute sweep
    function startColorSweep() {
      var cRow = 0;
      var cellH = 8;

      var colorTimer = setInterval(function () {
        if (skipped) { clearInterval(colorTimer); return; }
        if (cRow >= H) {
          clearInterval(colorTimer);
          // Phase 6: Hold with bars for 2.5s then show ready
          schedule(function () {
            showReady();
          }, 2500);
          return;
        }
        var band = Math.min(cellH, H - cRow);
        ctx.putImageData(colorCtx2.getImageData(0, cRow, W, band), 0, cRow);
        cRow += band;
      }, 80);
      pendingIntervals.push(colorTimer);
    }
  };

})();
