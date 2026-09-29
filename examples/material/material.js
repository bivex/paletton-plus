// Material Design 3 (Material You / M3) Paletton Showcase Colorizer
// Implements M3 algorithmic dynamic tonal palettes and color roles

(function() {
  var isDark = false;

  $(function() {
    if (parent && parent._Paletton && parent._Paletton.events) {
      parent._Paletton.events.trigger('ui/example/loaded');
    }

    $('#btn-theme-toggle').on('click', function(e) {
      e.preventDefault();
      isDark = !isDark;
      $('html, body').toggleClass('dark', isDark);
      $('#theme-icon').text(isDark ? '☀️' : '🌙');
      $('#theme-label').text(isDark ? 'Light Mode' : 'Dark Mode');
      colorize();
    });

    $('.m3-nav-pill').on('click', function() {
      $('.m3-nav-pill').removeClass('active');
      $(this).addClass('active');
    });

    $('#elevation-slider').on('input', function() {
      $('#slider-val').text($(this).val() + '%');
    });

    $('.m3-chip').on('click', function() {
      $(this).toggleClass('selected');
    });

    colorize();
  });

  window.colorize = function() {
    var pal = top && top._Paletton ? top._Paletton.palette : null;
    if (!pal) return;

    function getRgb(group, idx) {
      var col = pal.getColorCode(group, idx, 'byPalette', true, -1);
      if (!col) return { r: 100, g: 100, b: 100, hex: '#666666' };
      return {
        r: col.r,
        g: col.g,
        b: col.b,
        hex: col.getHex ? col.getHex(true) : '#' + col.toString()
      };
    }

    // Convert RGB to HSL
    function rgbToHsl(r, g, b) {
      r /= 255; g /= 255; b /= 255;
      var max = Math.max(r, g, b), min = Math.min(r, g, b);
      var h, s, l = (max + min) / 2;
      if (max === min) {
        h = s = 0;
      } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }
      return { h: h * 360, s: s, l: l };
    }

    function hslToHex(h, s, l) {
      l = Math.max(0, Math.min(1, l));
      s = Math.max(0, Math.min(1, s));
      var c = (1 - Math.abs(2 * l - 1)) * s;
      var x = c * (1 - Math.abs((h / 60) % 2 - 1));
      var m = l - c / 2;
      var r = 0, g = 0, b = 0;
      if (0 <= h && h < 60) { r = c; g = x; b = 0; }
      else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
      else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
      else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
      else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
      else if (300 <= h && h < 360) { r = c; g = 0; b = x; }
      r = Math.round((r + m) * 255);
      g = Math.round((g + m) * 255);
      b = Math.round((b + m) * 255);
      var hex = ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
      return '#' + hex;
    }

    // Generate M3 11-step Tonal Scale (10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99)
    function generateM3TonalScale(rgb) {
      var hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      var tones = [10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99];
      var scale = {};
      tones.forEach(function(t) {
        var light = t / 100;
        // Saturation adjustment: highest in middle tones, slightly muted in high and low tones
        var sat = hsl.s * (t >= 95 ? 0.4 : t <= 10 ? 0.5 : 0.85);
        scale[t] = hslToHex(hsl.h, sat, light);
      });
      return scale;
    }

    var priRgb = getRgb('pri', 0);
    var secRgb = pal.hasSecs() ? getRgb('sec1', 0) : getRgb('pri', 1);
    var terRgb = pal.hasCompl() ? getRgb('compl', 0) : (pal.hasSecs() ? getRgb('sec2', 0) : getRgb('pri', 2));

    var priScale = generateM3TonalScale(priRgb);
    var secScale = generateM3TonalScale(secRgb);
    var terScale = generateM3TonalScale(terRgb);

    // M3 Neutral Surface scale based on tinted primary
    var priHsl = rgbToHsl(priRgb.r, priRgb.g, priRgb.b);
    var surfaceLight = hslToHex(priHsl.h, 0.08, 0.98);
    var surfaceDark = hslToHex(priHsl.h, 0.08, 0.07);
    var surfaceContainerLight = hslToHex(priHsl.h, 0.08, 0.94);
    var surfaceContainerDark = hslToHex(priHsl.h, 0.08, 0.12);

    var root = document.documentElement;

    if (!isDark) {
      // Light Mode Roles
      root.style.setProperty('--md-sys-color-primary', priScale[40]);
      root.style.setProperty('--md-sys-color-on-primary', '#ffffff');
      root.style.setProperty('--md-sys-color-primary-container', priScale[90]);
      root.style.setProperty('--md-sys-color-on-primary-container', priScale[10]);

      root.style.setProperty('--md-sys-color-secondary', secScale[40]);
      root.style.setProperty('--md-sys-color-on-secondary', '#ffffff');
      root.style.setProperty('--md-sys-color-secondary-container', secScale[90]);
      root.style.setProperty('--md-sys-color-on-secondary-container', secScale[10]);

      root.style.setProperty('--md-sys-color-tertiary', terScale[40]);
      root.style.setProperty('--md-sys-color-on-tertiary', '#ffffff');
      root.style.setProperty('--md-sys-color-tertiary-container', terScale[90]);
      root.style.setProperty('--md-sys-color-on-tertiary-container', terScale[10]);

      root.style.setProperty('--md-sys-color-surface', surfaceLight);
      root.style.setProperty('--md-sys-color-on-surface', priScale[10]);
      root.style.setProperty('--md-sys-color-surface-container', surfaceContainerLight);
      root.style.setProperty('--md-sys-color-surface-container-highest', priScale[90]);
      root.style.setProperty('--md-sys-color-outline', priScale[50]);
      root.style.setProperty('--md-sys-color-outline-variant', priScale[80]);
    } else {
      // Dark Mode Roles
      root.style.setProperty('--md-sys-color-primary', priScale[80]);
      root.style.setProperty('--md-sys-color-on-primary', priScale[20]);
      root.style.setProperty('--md-sys-color-primary-container', priScale[30]);
      root.style.setProperty('--md-sys-color-on-primary-container', priScale[90]);

      root.style.setProperty('--md-sys-color-secondary', secScale[80]);
      root.style.setProperty('--md-sys-color-on-secondary', secScale[20]);
      root.style.setProperty('--md-sys-color-secondary-container', secScale[30]);
      root.style.setProperty('--md-sys-color-on-secondary-container', secScale[90]);

      root.style.setProperty('--md-sys-color-tertiary', terScale[80]);
      root.style.setProperty('--md-sys-color-on-tertiary', terScale[20]);
      root.style.setProperty('--md-sys-color-tertiary-container', terScale[30]);
      root.style.setProperty('--md-sys-color-on-tertiary-container', terScale[90]);

      root.style.setProperty('--md-sys-color-surface', surfaceDark);
      root.style.setProperty('--md-sys-color-on-surface', priScale[90]);
      root.style.setProperty('--md-sys-color-surface-container', surfaceContainerDark);
      root.style.setProperty('--md-sys-color-surface-container-highest', priScale[20]);
      root.style.setProperty('--md-sys-color-outline', priScale[60]);
      root.style.setProperty('--md-sys-color-outline-variant', priScale[30]);
    }

    // Render Tonal Strips
    function renderStrip($container, scale) {
      $container.empty();
      var tones = [10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99];
      tones.forEach(function(t) {
        var $step = $('<div class="tonal-step" data-tone="Tone ' + t + ': ' + scale[t] + '"></div>');
        $step.css('background-color', scale[t]);
        $container.append($step);
      });
    }

    renderStrip($('#pri-strip'), priScale);
    renderStrip($('#sec-strip'), secScale);
    renderStrip($('#ter-strip'), terScale);

    // Update Hex labels
    $('#pri-hex-val').text(isDark ? priScale[80] : priScale[40]);
    $('#sec-hex-val').text(isDark ? secScale[80] : secScale[40]);
    $('#ter-hex-val').text(isDark ? terScale[80] : terScale[40]);
  };
})();
