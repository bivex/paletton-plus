// Element Plus (Vue 3) Paletton Showcase Colorizer
// Maps live Paletton color engine to Element Plus CSS variable tokens

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

    $('.el-menu-item').on('click', function() {
      $('.el-menu-item').removeClass('is-active');
      $(this).addClass('is-active');
    });

    colorize();
  });

  // Color mix helper for Element Plus tint / shade formula
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
      if (!col) return { r: 64, g: 158, b: 255, hex: '#409eff' };
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

    // Element Plus Primary tints
    var priL3 = mix(pri0, isDark ? black : white, 30);
    var priL5 = mix(pri0, isDark ? black : white, 50);
    var priL7 = mix(pri0, isDark ? black : white, 70);
    var priL8 = mix(pri0, isDark ? black : white, 80);
    var priL9 = mix(pri0, isDark ? black : white, 90);
    var priD2 = mix(pri0, black, 20);

    // Success tints
    var secL3 = mix(sec1, isDark ? black : white, 30);
    var secL5 = mix(sec1, isDark ? black : white, 50);
    var secL9 = mix(sec1, isDark ? black : white, 90);

    // Warning tints
    var wrnL3 = mix(compl, isDark ? black : white, 30);
    var wrnL5 = mix(compl, isDark ? black : white, 50);
    var wrnL9 = mix(compl, isDark ? black : white, 90);

    var root = document.documentElement;

    // Apply CSS Variables
    root.style.setProperty('--el-color-primary', pri0.hex);
    root.style.setProperty('--el-color-primary-light-3', priL3.hex);
    root.style.setProperty('--el-color-primary-light-5', priL5.hex);
    root.style.setProperty('--el-color-primary-light-7', priL7.hex);
    root.style.setProperty('--el-color-primary-light-8', priL8.hex);
    root.style.setProperty('--el-color-primary-light-9', isDark ? 'rgba(' + pri0.r + ',' + pri0.g + ',' + pri0.b + ',0.15)' : priL9.hex);
    root.style.setProperty('--el-color-primary-dark-2', priD2.hex);

    root.style.setProperty('--el-color-success', sec1.hex);
    root.style.setProperty('--el-color-success-light-3', secL3.hex);
    root.style.setProperty('--el-color-success-light-5', secL5.hex);
    root.style.setProperty('--el-color-success-light-9', isDark ? 'rgba(' + sec1.r + ',' + sec1.g + ',' + sec1.b + ',0.15)' : secL9.hex);

    root.style.setProperty('--el-color-warning', compl.hex);
    root.style.setProperty('--el-color-warning-light-3', wrnL3.hex);
    root.style.setProperty('--el-color-warning-light-5', wrnL5.hex);
    root.style.setProperty('--el-color-warning-light-9', isDark ? 'rgba(' + compl.r + ',' + compl.g + ',' + compl.b + ',0.15)' : wrnL9.hex);

    // Update Card Values & Badges
    $('#stat-pri-tag').text(pri0.hex);
    $('#stat-sec-tag').text(sec1.hex);
    $('#stat-acc-tag').text(compl.hex);

    // Update Token Table
    var bgRgb = isDark ? { r: 20, g: 20, b: 20 } : { r: 255, g: 255, b: 255 };
    var tokens = [
      { token: '--el-color-primary', role: 'Main Brand & Action button', hex: pri0.hex, rgb: pri0 },
      { token: '--el-color-primary-light-3', role: 'Hover state for primary', hex: priL3.hex, rgb: priL3 },
      { token: '--el-color-primary-light-9', role: 'Light tag & alert background', hex: priL9.hex, rgb: priL9 },
      { token: '--el-color-primary-dark-2', role: 'Active click state', hex: priD2.hex, rgb: priD2 },
      { token: '--el-color-success', role: 'Success badge & Secondary harmony', hex: sec1.hex, rgb: sec1 },
      { token: '--el-color-warning', role: 'Warning notification & Complement', hex: compl.hex, rgb: compl }
    ];

    var $tbody = $('#token-table-body');
    $tbody.empty();

    tokens.forEach(function(t) {
      var ratio = getContrast(t.rgb, bgRgb);
      var badgeClass = ratio >= 4.5 ? 'el-tag--success' : (ratio >= 3.0 ? 'el-tag--warning' : '');
      var badgeText = ratio.toFixed(2) + ':1 ' + (ratio >= 7.0 ? 'AAA' : (ratio >= 4.5 ? 'AA' : 'Fail'));

      var $tr = $('<tr>' +
        '<td class="font-mono font-semibold text-primary">' + t.token + '</td>' +
        '<td class="text-secondary">' + t.role + '</td>' +
        '<td class="font-mono">' + t.hex.toUpperCase() + '</td>' +
        '<td><span class="el-tag el-tag--round ' + badgeClass + '">' + badgeText + '</span></td>' +
        '<td style="text-align: right;"><span class="color-swatch-box" style="background-color: ' + t.hex + ';"></span></td>' +
        '</tr>');
      $tbody.append($tr);
    });
  };
})();
