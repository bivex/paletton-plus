// Microsoft Fluent UI (Windows 11 & Office 365) Showcase Colorizer
// Maps live Paletton color engine to Microsoft Fluent Design tokens

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

    $('.fluent-pivot-item').on('click', function() {
      $('.fluent-pivot-item').removeClass('is-active');
      $(this).addClass('is-active');
    });

    colorize();
  });

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
      if (!col) return { r: 0, g: 120, b: 212, hex: '#0078d4' };
      return {
        r: col.r,
        g: col.g,
        b: col.b,
        hex: col.getHex ? col.getHex(true) : '#' + col.toString()
      };
    }

    var pri0 = getRgb('pri', 0);
    var pri1 = getRgb('pri', 1);
    var pri4 = getRgb('pri', 4);
    var sec1 = pal.hasSecs() ? getRgb('sec1', 0) : getRgb('pri', 1);
    var compl = pal.hasCompl() ? getRgb('compl', 0) : (pal.hasSecs() ? getRgb('sec2', 0) : getRgb('pri', 3));

    var root = document.documentElement;

    root.style.setProperty('--fluent-brand', pri0.hex);
    root.style.setProperty('--fluent-brand-hover', pri1.hex);
    root.style.setProperty('--fluent-brand-active', pri4.hex);
    root.style.setProperty('--fluent-brand-tint', isDark ? 'rgba(' + pri0.r + ',' + pri0.g + ',' + pri0.b + ', 0.25)' : 'rgba(' + pri0.r + ',' + pri0.g + ',' + pri0.b + ', 0.12)');
    root.style.setProperty('--fluent-secondary', sec1.hex);
    root.style.setProperty('--fluent-warning', compl.hex);

    $('#stat-pri-tag').text(pri0.hex);

    // Update Token Table
    var bgRgb = isDark ? { r: 43, g: 43, b: 43 } : { r: 255, g: 255, b: 255 };
    var tokens = [
      { token: '--colorBrandBackground', role: 'Fluent Primary Action & Active Tab', hex: pri0.hex, rgb: pri0 },
      { token: '--colorBrandBackgroundHover', role: 'Button hover & Command items', hex: pri1.hex, rgb: pri1 },
      { token: '--colorBrandBackgroundTint', role: 'Fluent Badges & Selection surface', hex: 'rgba(' + pri0.r + ',' + pri0.g + ',' + pri0.b + ', 0.12)', rgb: pri0 },
      { token: '--colorStatusSuccess', role: 'Secondary Harmony & Verified tags', hex: sec1.hex, rgb: sec1 },
      { token: '--colorStatusWarning', role: 'Complement Accent & Priority cues', hex: compl.hex, rgb: compl }
    ];

    var $tbody = $('#token-table-body');
    $tbody.empty();

    tokens.forEach(function(t) {
      var ratio = getContrast(t.rgb, bgRgb);
      var badgeStyle = ratio >= 4.5 ? 'background-color: rgba(16, 124, 65, 0.15); color: #107c41;' : 'background-color: rgba(216, 59, 1, 0.15); color: #d83b01;';
      var badgeText = ratio.toFixed(2) + ':1 ' + (ratio >= 7.0 ? 'AAA' : (ratio >= 4.5 ? 'AA' : 'Fail'));

      var $tr = $('<tr>' +
        '<td class="font-mono font-medium text-primary">' + t.token + '</td>' +
        '<td class="text-secondary">' + t.role + '</td>' +
        '<td class="font-mono text-xs">' + t.hex.toUpperCase() + '</td>' +
        '<td><span style="display:inline-block; padding: 2px 7px; border-radius: 999px; font-size: 11px; font-weight: 600; ' + badgeStyle + '">' + badgeText + '</span></td>' +
        '<td style="text-align: right;"><span class="color-swatch-box" style="background-color: ' + t.rgb.hex + ';"></span></td>' +
        '</tr>');
      $tbody.append($tr);
    });
  };
})();
