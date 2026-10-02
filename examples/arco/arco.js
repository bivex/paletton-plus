// Arco Design (ByteDance) Paletton Showcase Colorizer
// Maps live Paletton color engine to ByteDance 10-tier Arco Design tokens

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
      $('#theme-label').text(isDark ? 'Light' : 'Dark');
      colorize();
    });

    $('.arco-menu-item').on('click', function() {
      $('.arco-menu-item').removeClass('is-active');
      $(this).addClass('is-active');
    });

    colorize();
  });

  function mix(color1, color2, weight) {
    var w = weight / 100;
    var r = Math.round(color1.r * (1 - w) + color2.r * w);
    var g = Math.round(color1.g * (1 - w) + color2.g * w);
    var b = Math.round(color1.b * (1 - w) + color2.b * w);
    var hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    return { r: r, g: g, b: b, hex: hex };
  }

  function getLuminance(r, g, b) {
    var a = [r, g, b].map(function(v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  function getContrast(rgb1, rgb2) {
    var l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    var l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
    var lighter = Math.max(l1, l2);
    var darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  window.colorize = function() {
    var pal = top && top._Paletton ? top._Paletton.palette : null;
    if (!pal) return;

    function getRgb(group, idx) {
      var col = pal.getColorCode(group, idx, 'byPalette', true, -1);
      if (!col) return { r: 22, g: 93, b: 255, hex: '#165dff' };
      return {
        r: col.r,
        g: col.g,
        b: col.b,
        hex: col.getHex ? col.getHex(true) : '#' + col.toString()
      };
    }

    var pri0 = getRgb('pri', 0);
    var sec1 = pal.hasSecs() ? getRgb('sec1', 0) : getRgb('pri', 1);
    var compl = pal.hasCompl() ? getRgb('compl', 0) : (pal.hasSecs() ? getRgb('sec2', 0) : getRgb('pri', 3));

    var white = { r: 255, g: 255, b: 255 };
    var black = { r: 0, g: 0, b: 0 };

    // Compute ByteDance 10-tier tonal ramp (Step 6 is base)
    var ramp = [];
    ramp[1] = mix(pri0, white, 85);
    ramp[2] = mix(pri0, white, 70);
    ramp[3] = mix(pri0, white, 52);
    ramp[4] = mix(pri0, white, 35);
    ramp[5] = mix(pri0, white, 18);
    ramp[6] = pri0; // Base Primary
    ramp[7] = mix(pri0, black, 16);
    ramp[8] = mix(pri0, black, 32);
    ramp[9] = mix(pri0, black, 50);
    ramp[10] = mix(pri0, black, 70);

    var root = document.documentElement;

    for (var i = 1; i <= 10; i++) {
      root.style.setProperty('--primary-' + i, ramp[i].hex);
    }

    if (isDark) {
      root.style.setProperty('--primary-1', 'rgba(' + pri0.r + ',' + pri0.g + ',' + pri0.b + ',0.15)');
      root.style.setProperty('--primary-2', 'rgba(' + pri0.r + ',' + pri0.g + ',' + pri0.b + ',0.25)');
    }

    // Success & Warning
    var sec1_1 = mix(sec1, white, 85);
    var wrn_1 = mix(compl, white, 85);

    root.style.setProperty('--success-6', sec1.hex);
    root.style.setProperty('--success-1', isDark ? 'rgba(' + sec1.r + ',' + sec1.g + ',' + sec1.b + ',0.15)' : sec1_1.hex);
    root.style.setProperty('--warning-6', compl.hex);
    root.style.setProperty('--warning-1', isDark ? 'rgba(' + compl.r + ',' + compl.g + ',' + compl.b + ',0.15)' : wrn_1.hex);

    // Update Ramp UI blocks
    var $rampContainer = $('#arco-ramp-container');
    $rampContainer.empty();
    for (var k = 1; k <= 10; k++) {
      var textColor = k <= 5 ? '#1d2129' : '#ffffff';
      var $block = $('<div class="arco-ramp-block" style="background-color: ' + ramp[k].hex + '; color: ' + textColor + ';">' +
        '<div>P' + k + '</div>' +
        '<div style="font-size:9px; opacity: 0.85;">' + (k === 6 ? '★' : '') + '</div>' +
        '</div>');
      $rampContainer.append($block);
    }

    // Update Stat values
    $('#stat-pri-tag').text(pri0.hex);
    $('#stat-sec-tag').text(sec1.hex);
    $('#stat-acc-tag').text(compl.hex);

    // Update Token Table
    var bgRgb = isDark ? { r: 23, g: 23, b: 26 } : { r: 255, g: 255, b: 255 };
    var tokens = [
      { token: '--primary-6', role: 'Default Brand Primary (Base)', hex: ramp[6].hex, rgb: ramp[6] },
      { token: '--primary-5', role: 'Hover state for buttons', hex: ramp[5].hex, rgb: ramp[5] },
      { token: '--primary-7', role: 'Active / Click state', hex: ramp[7].hex, rgb: ramp[7] },
      { token: '--primary-1', role: 'Light tag & background hover', hex: ramp[1].hex, rgb: ramp[1] },
      { token: '--success-6', role: 'Secondary Harmony & Verified tags', hex: sec1.hex, rgb: sec1 },
      { token: '--warning-6', role: 'Complement Accent & Warnings', hex: compl.hex, rgb: compl }
    ];

    var $tbody = $('#token-table-body');
    $tbody.empty();

    tokens.forEach(function(t) {
      var ratio = getContrast(t.rgb, bgRgb);
      var badgeClass = ratio >= 4.5 ? 'arco-tag-success' : (ratio >= 3.0 ? 'arco-tag-warning' : '');
      var badgeText = ratio.toFixed(2) + ':1 ' + (ratio >= 7.0 ? 'AAA' : (ratio >= 4.5 ? 'AA' : 'Fail'));

      var $tr = $('<tr>' +
        '<td class="font-mono font-semibold text-primary">' + t.token + '</td>' +
        '<td class="text-secondary">' + t.role + '</td>' +
        '<td class="font-mono">' + t.hex.toUpperCase() + '</td>' +
        '<td><span class="arco-tag ' + badgeClass + '">' + badgeText + '</span></td>' +
        '<td style="text-align: right;"><span class="color-swatch-box" style="background-color: ' + t.hex + ';"></span></td>' +
        '</tr>');
      $tbody.append($tr);
    });
  };
})();
