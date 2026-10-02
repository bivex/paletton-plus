// NES.css (8-Bit Nintendo Retro) Showcase Colorizer
// Maps live Paletton color engine to 8-bit arcade retro palette

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
      $('#theme-label').text(isDark ? 'LIGHT' : 'DARK');
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
      if (!col) return { r: 32, g: 156, b: 238, hex: '#209cee' };
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

    var root = document.documentElement;

    root.style.setProperty('--nes-primary', pri0.hex);
    root.style.setProperty('--nes-success', sec1.hex);
    root.style.setProperty('--nes-warning', compl.hex);

    $('#stat-pri-tag').text(pri0.hex.toUpperCase());

    // Update Token Table
    var bgRgb = isDark ? { r: 33, g: 37, b: 41 } : { r: 255, g: 255, b: 255 };
    var tokens = [
      { token: '--nes-primary', role: 'Hero Player & Action Buttons', hex: pri0.hex, rgb: pri0 },
      { token: '--nes-success', role: 'Health Bar & 1UP Secondary', hex: sec1.hex, rgb: sec1 },
      { token: '--nes-warning', role: 'Coins, Stars & Complement', hex: compl.hex, rgb: compl }
    ];

    var $tbody = $('#token-table-body');
    $tbody.empty();

    tokens.forEach(function(t) {
      var ratio = getContrast(t.rgb, bgRgb);
      var badgeText = ratio.toFixed(1) + ':1 ' + (ratio >= 4.5 ? 'PASS' : 'WARN');

      var $tr = $('<tr>' +
        '<td class="font-mono text-primary font-bold">' + t.token + '</td>' +
        '<td>' + t.role + '</td>' +
        '<td class="font-mono">' + t.hex.toUpperCase() + '</td>' +
        '<td><span class="nes-badge"><span class="nes-badge-val" style="background-color: ' + t.rgb.hex + ';">' + badgeText + '</span></span></td>' +
        '<td style="text-align: right;"><span class="color-swatch-box" style="background-color: ' + t.rgb.hex + ';"></span></td>' +
        '</tr>');
      $tbody.append($tr);
    });
  };
})();
