// NutUI (JD.com) Paletton Showcase Colorizer
// Maps live Paletton color engine to JD.com NutUI tokens

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
      if (!col) return { r: 250, g: 44, b: 25, hex: '#fa2c19' };
      return {
        r: col.r,
        g: col.g,
        b: col.b,
        hex: col.getHex ? col.getHex(true) : '#' + col.toString()
      };
    }

    var pri0 = getRgb('pri', 0);
    var pri1 = getRgb('pri', 1);
    var sec1 = pal.hasSecs() ? getRgb('sec1', 0) : getRgb('pri', 1);
    var compl = pal.hasCompl() ? getRgb('compl', 0) : (pal.hasSecs() ? getRgb('sec2', 0) : getRgb('pri', 3));

    var root = document.documentElement;

    root.style.setProperty('--nut-primary-color', pri0.hex);
    root.style.setProperty('--nut-primary-color-end', pri1.hex);
    root.style.setProperty('--nut-primary-gradient', 'linear-gradient(135deg, ' + pri0.hex + ' 0%, ' + pri1.hex + ' 100%)');
    root.style.setProperty('--nut-help-color', sec1.hex);

    // Update tags in UI
    $('#stat-pri-tag').text(pri0.hex);
    $('#stat-sec-tag').text(sec1.hex);

    // Update Token Table
    var bgRgb = isDark ? { r: 30, g: 30, b: 30 } : { r: 255, g: 255, b: 255 };
    var tokens = [
      { token: '--nut-primary-color', role: 'Main JD Brand & Flash Price', hex: pri0.hex, rgb: pri0 },
      { token: '--nut-primary-color-end', role: 'Gradient end & Action buttons', hex: pri1.hex, rgb: pri1 },
      { token: '--nut-help-color', role: 'Cart CTA & Secondary Harmony', hex: sec1.hex, rgb: sec1 },
      { token: '--nut-tag-accent', role: 'Promotion & Coupon Highlights', hex: compl.hex, rgb: compl }
    ];

    var $tbody = $('#token-table-body');
    $tbody.empty();

    tokens.forEach(function(t) {
      var ratio = getContrast(t.rgb, bgRgb);
      var badgeClass = ratio >= 4.5 ? 'style="border-color:#52c41a; color:#52c41a;"' : 'style="border-color:#fa2c19; color:#fa2c19;"';
      var badgeText = ratio.toFixed(2) + ':1 ' + (ratio >= 7.0 ? 'AAA' : (ratio >= 4.5 ? 'AA' : 'Fail'));

      var $tr = $('<tr>' +
        '<td class="font-mono font-medium text-primary">' + t.token + '</td>' +
        '<td class="text-muted">' + t.role + '</td>' +
        '<td class="font-mono text-xs">' + t.hex.toUpperCase() + '</td>' +
        '<td><span class="nut-tag" ' + badgeClass + '>' + badgeText + '</span></td>' +
        '<td style="text-align: right;"><span class="color-swatch-box" style="background-color: ' + t.rgb.hex + ';"></span></td>' +
        '</tr>');
      $tbody.append($tr);
    });
  };
})();
