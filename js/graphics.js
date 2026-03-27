/* ==========================================================================
   graphics.js — ZX Spectrum-style vector room graphics renderer
   Draws room illustrations using filled polygons, lines, and dots on an
   HTML5 canvas. Only uses the 8 standard ZX Spectrum colors.
   ========================================================================== */

(function () {
  'use strict';

  window.Graphics = {};

  // ZX Spectrum palette (non-bright)
  var PALETTE = {
    black:   '#000000',
    blue:    '#0000D7',
    red:     '#D70000',
    magenta: '#D700D7',
    green:   '#00D700',
    cyan:    '#00D7D7',
    yellow:  '#D7D700',
    white:   '#D7D7D7'
  };

  var canvas = null;
  var ctx = null;
  var WIDTH = 256;
  var HEIGHT = 192;

  // Current drawing state
  var fillColor = PALETTE.white;
  var strokeColor = PALETTE.white;

  // ── helpers ──────────────────────────────────────────────────────────────

  function resolveColor(name) {
    if (!name) return null;
    var lower = name.toLowerCase();
    return PALETTE[lower] || name;   // accept raw hex too
  }

  // ── drawing primitives ──────────────────────────────────────────────────

  function execFill(c) {
    fillColor = resolveColor(c.color) || PALETTE.white;
  }

  function execStroke(c) {
    strokeColor = resolveColor(c.color) || PALETTE.white;
  }

  function execRect(c) {
    ctx.fillStyle = fillColor;
    ctx.fillRect(c.x, c.y, c.w, c.h);
  }

  function execLine(c) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = c.lineWidth || 1;
    ctx.beginPath();
    ctx.moveTo(c.x1, c.y1);
    ctx.lineTo(c.x2, c.y2);
    ctx.stroke();
  }

  function execPoly(c) {
    if (!c.points || c.points.length < 2) return;
    ctx.fillStyle = fillColor;
    ctx.strokeStyle = strokeColor;
    ctx.beginPath();
    ctx.moveTo(c.points[0][0], c.points[0][1]);
    for (var i = 1; i < c.points.length; i++) {
      ctx.lineTo(c.points[i][0], c.points[i][1]);
    }
    ctx.closePath();
    ctx.fill();
    if (c.outline) {
      ctx.lineWidth = c.lineWidth || 1;
      ctx.stroke();
    }
  }

  function execCircle(c) {
    ctx.fillStyle = fillColor;
    ctx.beginPath();
    ctx.arc(c.cx, c.cy, c.r, 0, Math.PI * 2);
    ctx.fill();
    if (c.outline) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = c.lineWidth || 1;
      ctx.stroke();
    }
  }

  function execArc(c) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = c.lineWidth || 1;
    ctx.beginPath();
    ctx.arc(c.cx, c.cy, c.r, c.start || 0, c.end || Math.PI * 2);
    if (c.filled) {
      ctx.fillStyle = fillColor;
      ctx.fill();
    }
    ctx.stroke();
  }

  function execDot(c) {
    ctx.fillStyle = fillColor;
    ctx.fillRect(c.x, c.y, 1, 1);
  }

  // Command dispatch table
  var COMMANDS = {
    fill:   execFill,
    stroke: execStroke,
    rect:   execRect,
    line:   execLine,
    poly:   execPoly,
    circle: execCircle,
    arc:    execArc,
    dot:    execDot
  };

  // ── public API ──────────────────────────────────────────────────────────

  Graphics.init = function (canvasId) {
    canvas = document.getElementById(canvasId);
    if (!canvas) return;
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    ctx = canvas.getContext('2d');
    // Disable anti-aliasing for crisp pixel look
    ctx.imageSmoothingEnabled = false;
    Graphics.clear();
  };

  Graphics.clear = function () {
    if (!ctx) return;
    ctx.fillStyle = PALETTE.black;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    fillColor = PALETTE.white;
    strokeColor = PALETTE.white;
  };

  Graphics.drawRoom = function (roomId) {
    if (!ctx) return;

    var room = window.GameData && window.GameData.rooms
      ? window.GameData.rooms[roomId]
      : null;

    Graphics.clear();

    if (!room || !room.graphic) return;

    var cmds = room.graphic;
    for (var i = 0; i < cmds.length; i++) {
      var c = cmds[i];
      var fn = COMMANDS[c.cmd];
      if (fn) fn(c);
    }
  };

  Graphics.PALETTE = PALETTE;

})();
