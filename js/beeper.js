/* ==========================================================================
   beeper.js - ZX Spectrum 48K Beeper Engine
   Emulates the 1-bit square wave beeper of the Sinclair ZX Spectrum using
   Web Audio API. Implements pseudo-polyphony via rapid arpeggiation —
   the technique used by Tim Follin and other legendary Spectrum composers
   to simulate multiple voices on a single-channel beeper.

   The Spectrum beeper was driven by toggling bit 4 of port 0xFE, producing
   a harsh square wave. CPU clock was 3.5MHz; typical tone range ~100Hz–10KHz.
   This engine recreates that sound using square wave oscillators with
   characteristic inter-note clicks and buzzy timbre.

   Contains the Monkey Island main theme extracted from MIDI, encoded as
   [frequency, duration_ms, gap_ms] triples for melody and bass lines.
   ========================================================================== */

(function () {
  'use strict';

  window.Beeper = {};

  // ========================================================================
  // AUDIO CONTEXT
  // ========================================================================

  var audioCtx = null;
  var isPlaying = false;
  var stopRequested = false;
  var currentTimeout = null;
  var activeOscillators = [];

  function getContext() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // ========================================================================
  // ZX SPECTRUM BEEPER SOUND
  // ========================================================================

  // Create a square wave with the harsh, buzzy Spectrum character.
  // Real Spectrum beeper was pure 1-bit — no filtering, no smoothing.
  // We use a square oscillator with a slight gain reduction to avoid clipping.
  function createBeeperOsc(ctx, freq, startTime, duration) {
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, startTime);

    // Spectrum beeper volume — harsh and present
    gain.gain.setValueAtTime(0.15, startTime);
    // Characteristic click at note start (beeper toggle artifact)
    gain.gain.setValueAtTime(0.25, startTime);
    gain.gain.linearRampToValueAtTime(0.15, startTime + 0.003);
    // Abrupt cutoff (no release — pure digital)
    gain.gain.setValueAtTime(0.15, startTime + duration - 0.001);
    gain.gain.linearRampToValueAtTime(0, startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);

    return osc;
  }

  // ========================================================================
  // PSEUDO-POLYPHONY ENGINE
  // ========================================================================

  // Rapid arpeggiation: alternate between melody and bass notes at ~50Hz
  // (every 20ms) to create the illusion of two voices on one channel.
  // This is how the best Spectrum beeper music worked — the ear perceives
  // both notes as sustaining simultaneously due to persistence of hearing.

  var ARPEGGIO_RATE = 0.018; // 18ms per arpeggio slice (~55Hz switching)

  function scheduleArpeggiatedChunk(ctx, melodyFreq, bassFreq, startTime, duration) {
    var t = startTime;
    var end = startTime + duration;
    var isMelody = true;
    var oscs = [];

    while (t < end) {
      var sliceDur = Math.min(ARPEGGIO_RATE, end - t);
      var freq = isMelody ? melodyFreq : bassFreq;

      if (freq > 0 && sliceDur > 0.002) {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.12, t);
        // Tiny click at slice boundary
        gain.gain.setValueAtTime(0, t + sliceDur - 0.0005);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + sliceDur);
        oscs.push(osc);
      }

      t += ARPEGGIO_RATE;
      isMelody = !isMelody;
    }

    return oscs;
  }

  // ========================================================================
  // THEME DATA — Monkey Island Main Theme
  // Extracted from MIDI. Format: [frequency_hz, duration_ms, gap_before_ms]
  // Melody = Track 2 "MONKEY ISLAND", Bass = Track 5 "Main Title Theme"
  // ========================================================================

  var THEME = {
    melody: [
      [659.3,238,4812],[659.3,175,100],[784,217,0],[740,196,0],[659.3,188,0],
      [587.3,208,0],[659.3,638,142],[587.3,192,386],[587.3,217,154],
      [523.3,171,0],[493.9,175,0],[587.3,208,0],[523.3,212,0],[523.3,200,133],
      [493.9,629,150],[659.3,192,396],[659.3,446,158],[784,208,63],
      [740,175,0],[659.3,196,0],[587.3,192,0],[659.3,967,158],[740,154,233],
      [784,146,21],[784,150,200],[880,388,191],[740,429,296],[784,200,87],
      [740,188,0],[659.3,154,0],[587.3,179,17],[740,196,0],[784,196,0],
      [784,196,141],[740,554,154],[659.3,429,142],[784,192,92],[740,192,0],
      [659.3,171,0],[587.3,158,0],[740,200,9],[784,154,0],[784,179,184],
      [740,504,163],[659.3,417,175],[784,212,104],[740,221,0],[659.3,208,0],
      [587.3,404,0],[659.3,192,0],[659.3,208,141],[659.3,712,138],
      [659.3,258,313],[587.3,108,88],[523.3,129,63],[493.9,104,38],
      [587.3,125,66],[523.3,117,55],[523.3,108,220],[493.9,383,246],
      [659.3,96,2000],[659.3,158,71],[1046.5,125,1380],[784,117,220],
      [784,279,225],[1046.5,171,405],[987.8,150,3],[880,125,26],
      [1046.5,154,45],[987.8,125,21],[784,117,217],[784,296,225],
      [784,108,725],[880,108,229],[587.3,129,234],[587.3,171,225],
      [880,146,350],[987.8,125,29],[880,117,41],[784,188,54],[880,171,0],
      [987.8,138,0],[784,112,208],[784,129,242],[659.3,112,217],
      [659.3,221,238],[370,108,458],[392,125,234],[440,129,212],
      [349.2,179,46],[698.5,112,0],[523.3,233,59],[1046.5,108,0],
      [440,158,67],[698.5,129,17],[880,88,42],[349.2,188,78],[523.3,196,0],
      [698.5,125,0],[440,150,46],[1046.5,112,25],[523.3,188,63],
      [880,125,0],[1396.9,88,46],[784,133,91],[493.9,171,0],
      [987.8,117,179],[392,138,0],[987.8,138,195],[392,188,0],
      [987.8,138,320],[392,188,0],[880,154,0],[370,171,0],
      [987.8,133,179],[392,146,0],[880,117,192],[370,133,0],
      [987.8,125,38],[392,171,0],[784,146,8],[329.6,150,0],[392,88,21],
      [987.8,104,0],[261.6,192,234],[523.3,112,0],[392,229,63],
      [784,108,0],[311.1,158,62],[523.3,129,22],[622.3,88,37],
      [261.6,188,83],[392,208,0],[523.3,117,0],[311.1,146,54],
      [784,112,20],[392,175,55],[622.3,129,0],[1046.5,88,54],
      [740,150,83],[440,196,0],[880,146,146],[370,146,0],
      [880,171,200],[370,229,0],[370,146,283],[880,179,0],
      [784,171,0],[329.6,208,0],[370,171,138],[880,192,0],
      [784,154,162],[329.6,158,0],[880,138,13],[370,158,0],
      [740,158,17],[293.7,192,0],[659.3,167,158],[659.3,138,179],
      [784,212,33],[740,138,0],[659.3,179,29],[587.3,158,0]
    ],

    bass: [
      [41.2,150,0],[41.2,83,192],[41.2,150,92],[73.4,67,1062],
      [73.4,138,96],[82.4,175,32],[82.4,88,167],[82.4,175,91],
      [73.4,150,675],[73.4,92,213],[73.4,133,70],[41.2,108,30],
      [41.2,188,59],[73.4,88,1357],[73.4,150,100],[65.4,171,21],
      [65.4,83,183],[65.4,150,75],[49,167,17],[49,96,174],[49,212,75],
      [55,75,997],[55,129,91],[41.2,167,34],[41.2,75,191],
      [41.2,233,104],[73.4,150,1305],[73.4,88,187],[73.4,146,75],
      [65.4,158,20],[65.4,75,201],[65.4,254,87],[49,104,642],
      [49,154,55],[49,133,191],[55,146,34],[55,88,171],[55,125,78],
      [36.7,117,38],[36.7,167,70],[98,104,1042],[98,150,71],
      [98,158,204],[77.8,171,25],[77.8,83,167],[77.8,146,83],
      [82.4,96,34],[82.4,158,58],[49,92,1083],[49,167,58],
      [49,171,167],[61.7,146,8],[61.7,88,175],[61.7,117,91],
      [82.4,92,58],[82.4,158,66],[65.4,112,1055],[65.4,154,71],
      [65.4,83,192],[65.4,504,92],[49,96,858],[49,154,71],
      [49,154,196],[55,167,33],[55,92,154],[55,129,83],
      [41.2,167,46],[41.2,83,171],[41.2,262,84],[73.4,92,917],
      [73.4,158,79],[82.4,150,25],[82.4,88,179],[82.4,192,87],
      [73.4,158,683],[73.4,92,180],[73.4,112,62],[65.4,171,63],
      [65.4,83,183],[65.4,175,96],[49,83,1708],[49,179,63],
      [61.7,358,0],[73.4,275,8],[36.7,67,1088],[36.7,158,104],
      [46.2,325,21],[55,171,4],[73.4,338,171],[82.4,83,383],
      [82.4,83,88],[82.4,208,71],[61.7,221,158],[49,221,117],
      [41.2,346,137],[41.2,83,675],[41.2,92,92],[43.7,154,87],
      [55,154,192],[65.4,200,175],[87.3,88,1538],[87.3,108,78],
      [82.4,188,63],[61.7,138,145],[49,292,217],[49,88,1437],
      [49,117,70],[65.4,179,71],[77.8,179,158],[98,271,159],
      [98,96,1429],[98,133,87],[92.5,233,25],[73.4,196,138],
      [55,258,158],[73.4,83,1451],[73.4,188,87],[82.4,146,8],
      [82.4,92,192],[82.4,171,62],[73.4,96,337],[73.4,154,92]
    ]
  };

  // ========================================================================
  // PLAYBACK ENGINE
  // ========================================================================

  // Build a timeline of events from the note data.
  // Returns [{time: seconds, freq: hz, dur: seconds}, ...]
  function buildTimeline(notes) {
    var timeline = [];
    var t = 0;
    for (var i = 0; i < notes.length; i++) {
      var freq = notes[i][0];
      var dur = notes[i][1] / 1000;
      var gap = notes[i][2] / 1000;
      t += gap;
      timeline.push({ time: t, freq: freq, dur: dur });
      t += dur;
    }
    return timeline;
  }

  // Find the bass note active at a given time
  function findBassAt(bassTimeline, time) {
    for (var i = bassTimeline.length - 1; i >= 0; i--) {
      var b = bassTimeline[i];
      if (b.time <= time && time < b.time + b.dur) {
        return b.freq;
      }
    }
    return 0;
  }

  /**
   * Play the Monkey Island theme with authentic ZX Spectrum beeper sound.
   * Uses pseudo-polyphony (rapid arpeggiation) to combine melody + bass.
   * @param {Function} [callback] - Called when playback finishes
   */
  Beeper.playTheme = function (callback) {
    if (isPlaying) return;
    isPlaying = true;
    stopRequested = false;

    var ctx = getContext();
    var melodyTL = buildTimeline(THEME.melody);
    var bassTL = buildTimeline(THEME.bass);

    var startTime = ctx.currentTime + 0.1;
    activeOscillators = [];

    // Schedule all melody notes, arpeggiated with concurrent bass
    for (var i = 0; i < melodyTL.length; i++) {
      var m = melodyTL[i];
      var bassFreq = findBassAt(bassTL, m.time);

      if (bassFreq > 0) {
        // Arpeggio: rapidly alternate melody + bass
        var oscs = scheduleArpeggiatedChunk(
          ctx, m.freq, bassFreq, startTime + m.time, m.dur
        );
        for (var j = 0; j < oscs.length; j++) {
          activeOscillators.push(oscs[j]);
        }
      } else {
        // Solo melody note
        var osc = createBeeperOsc(ctx, m.freq, startTime + m.time, m.dur);
        activeOscillators.push(osc);
      }
    }

    // Also schedule bass notes that play when no melody is active
    for (var bi = 0; bi < bassTL.length; bi++) {
      var b = bassTL[bi];
      var hasMelody = false;
      for (var mi = 0; mi < melodyTL.length; mi++) {
        var mel = melodyTL[mi];
        // Check if melody overlaps this bass note
        if (mel.time < b.time + b.dur && mel.time + mel.dur > b.time) {
          hasMelody = true;
          break;
        }
      }
      if (!hasMelody) {
        var bassOsc = createBeeperOsc(ctx, b.freq, startTime + b.time, b.dur);
        activeOscillators.push(bassOsc);
      }
    }

    // Calculate total duration
    var lastMelody = melodyTL[melodyTL.length - 1];
    var lastBass = bassTL[bassTL.length - 1];
    var totalDur = Math.max(
      lastMelody.time + lastMelody.dur,
      lastBass.time + lastBass.dur
    );

    // Callback when done
    currentTimeout = setTimeout(function () {
      isPlaying = false;
      activeOscillators = [];
      if (!stopRequested && callback) callback();
    }, (totalDur + 0.5) * 1000);
  };

  /**
   * Stop all beeper playback immediately.
   */
  Beeper.stop = function () {
    stopRequested = true;
    isPlaying = false;

    if (currentTimeout) {
      clearTimeout(currentTimeout);
      currentTimeout = null;
    }

    // Kill all scheduled oscillators
    var now = audioCtx ? audioCtx.currentTime : 0;
    for (var i = 0; i < activeOscillators.length; i++) {
      try {
        activeOscillators[i].stop(now);
      } catch (e) {
        // Already stopped
      }
    }
    activeOscillators = [];
  };

  /**
   * Check if the beeper is currently playing.
   * @returns {boolean}
   */
  Beeper.isPlaying = function () {
    return isPlaying;
  };

  /**
   * Toggle theme playback on/off.
   * @returns {boolean} New playing state
   */
  Beeper.toggle = function () {
    if (isPlaying) {
      Beeper.stop();
      return false;
    } else {
      Beeper.playTheme();
      return true;
    }
  };

})();
