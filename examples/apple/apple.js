// Apple Human Interface Guidelines (macOS & iOS) Paletton Showcase Colorizer
// Maps live Paletton color engine to Apple System Accents and Materials

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

    $('.sidebar-item').on('click', function() {
      $('.sidebar-item').removeClass('is-active');
      $(this).addClass('is-active');
    });

    $('.segmented-item').on('click', function() {
      $('.segmented-item').removeClass('is-active');
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
      if (!col) return { r: 0, g: 122, b: 255, hex: '#007aff' };
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

    root.style.setProperty('--apple-accent', pri0.hex);
    root.style.setProperty('--apple-accent-rgb', pri0.r + ', ' + pri0.g + ', ' + pri0.b);
    root.style.setProperty('--apple-accent-surface', isDark ? 'rgba(' + pri0.r + ', ' + pri0.g + ', ' + pri0.b + ', 0.22)' : 'rgba(' + pri0.r + ', ' + pri0.g + ', ' + pri0.b + ', 0.12)');
    root.style.setProperty('--apple-secondary', sec1.hex);
    root.style.setProperty('--apple-warning', compl.hex);

    $('#stat-pri-tag').text(pri0.hex);

    // Update Token Table
    var bgRgb = isDark ? { r: 38, g: 38, b: 42 } : { r: 255, g: 255, b: 255 };
    var tokens = [
      { token: '--apple-accent', role: 'System Accent & Active selection', hex: pri0.hex, rgb: pri0 },
      { token: '--apple-accent-surface', role: 'Tinted buttons & Glass surfaces', hex: 'rgba(' + pri0.r + ',' + pri0.g + ',' + pri0.b + ', 0.12)', rgb: pri0 },
      { token: '--apple-secondary', role: 'Secondary Harmony & Badges', hex: sec1.hex, rgb: sec1 },
      { token: '--apple-warning', role: 'System alerts & Complement', hex: compl.hex, rgb: compl }
    ];

    var $tbody = $('#token-table-body');
    $tbody.empty();

    tokens.forEach(function(t) {
      var ratio = getContrast(t.rgb, bgRgb);
      var badgeStyle = ratio >= 4.5 ? 'background-color: rgba(52, 199, 89, 0.15); color: #34c759;' : 'background-color: rgba(255, 59, 48, 0.15); color: #ff3b30;';
      var badgeText = ratio.toFixed(2) + ':1 ' + (ratio >= 7.0 ? 'AAA' : (ratio >= 4.5 ? 'AA' : 'Fail'));

      var $tr = $('<tr>' +
        '<td class="font-mono font-medium text-accent">' + t.token + '</td>' +
        '<td class="text-secondary">' + t.role + '</td>' +
        '<td class="font-mono text-xs">' + t.hex.toUpperCase() + '</td>' +
        '<td><span style="display:inline-block; padding: 2px 7px; border-radius: 4px; font-size: 11px; font-weight: 600; ' + badgeStyle + '">' + badgeText + '</span></td>' +
        '<td style="text-align: right;"><span class="color-swatch-box" style="background-color: ' + t.rgb.hex + ';"></span></td>' +
        '</tr>');
      $tbody.append($tr);
    });
  };
})();
