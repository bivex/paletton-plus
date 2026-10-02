// 98.css / XP.css (Windows 98 Desktop) Showcase Colorizer
// Maps live Paletton color engine to classic Windows 98 / XP system metrics

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
      colorize();
    });

    $('.win-tab').on('click', function() {
      $('.win-tab').removeClass('is-active');
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
      if (!col) return { r: 0, g: 0, b: 128, hex: '#000080' };
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

    var root = document.documentElement;

    root.style.setProperty('--win-title-start', pri0.hex);
    root.style.setProperty('--win-title-end', pri1.hex);
    root.style.setProperty('--win-highlight', pri0.hex);

    $('#stat-pri-tag').text(pri0.hex.toUpperCase());

    // Update Token Table
    var bgRgb = isDark ? { r: 43, g: 43, b: 43 } : { r: 192, g: 192, b: 192 };
    var tokens = [
      { token: 'ActiveTitle (Start)', role: 'Titlebar gradient & Highlight selection', hex: pri0.hex, rgb: pri0 },
      { token: 'ActiveTitle (End)', role: 'Titlebar gradient secondary hue', hex: pri1.hex, rgb: pri1 },
      { token: 'MenuHighlight', role: 'Classic Menu focus item', hex: sec1.hex, rgb: sec1 }
    ];

    var $tbody = $('#token-table-body');
    $tbody.empty();

    tokens.forEach(function(t) {
      var ratio = getContrast(t.rgb, bgRgb);
      var badgeText = ratio.toFixed(1) + ':1 ' + (ratio >= 4.5 ? 'OK' : 'Low');

      var $tr = $('<tr>' +
        '<td class="font-bold">' + t.token + '</td>' +
        '<td>' + t.role + '</td>' +
        '<td class="font-mono">' + t.hex.toUpperCase() + '</td>' +
        '<td><b>' + badgeText + '</b></td>' +
        '<td style="text-align: right;"><span class="color-swatch-box" style="background-color: ' + t.rgb.hex + ';"></span></td>' +
        '</tr>');
      $tbody.append($tr);
    });
  };
})();
