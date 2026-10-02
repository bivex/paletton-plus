// Varlet (Vue 3 Material Mobile UI) Paletton Showcase Colorizer
// Maps live Paletton color engine to Varlet Material You tokens

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

    $('.var-tab').on('click', function() {
      $('.var-tab').removeClass('is-active');
      $(this).addClass('is-active');
    });

    $('.var-bottom-nav-item').on('click', function() {
      $('.var-bottom-nav-item').removeClass('is-active');
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
      if (!col) return { r: 63, g: 81, b: 181, hex: '#3f51b5' };
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

    root.style.setProperty('--color-primary', pri0.hex);
    root.style.setProperty('--color-primary-container', 'rgba(' + pri0.r + ',' + pri0.g + ',' + pri0.b + ', 0.14)');
    root.style.setProperty('--color-success', sec1.hex);
    root.style.setProperty('--color-warning', compl.hex);

    // Update tags in UI
    $('#stat-pri-tag').text(pri0.hex);
    $('#stat-sec-tag').text(sec1.hex);

    // Update Token Table
    var bgRgb = isDark ? { r: 30, g: 30, b: 30 } : { r: 255, g: 255, b: 255 };
    var tokens = [
      { token: '--color-primary', role: 'App bar, FAB & Key triggers', hex: pri0.hex, rgb: pri0 },
      { token: '--color-primary-container', role: 'Filter chips & Selected state', hex: 'rgba(' + pri0.r + ',' + pri0.g + ',' + pri0.b + ', 0.14)', rgb: pri0 },
      { token: '--color-success', role: 'Secondary Harmony & Verified pills', hex: sec1.hex, rgb: sec1 },
      { token: '--color-warning', role: 'Complement Accent & Badges', hex: compl.hex, rgb: compl }
    ];

    var $tbody = $('#token-table-body');
    $tbody.empty();

    tokens.forEach(function(t) {
      var ratio = getContrast(t.rgb, bgRgb);
      var badgeClass = ratio >= 4.5 ? 'var-chip--success' : '';
      var badgeText = ratio.toFixed(2) + ':1 ' + (ratio >= 7.0 ? 'AAA' : (ratio >= 4.5 ? 'AA' : 'Fail'));

      var $tr = $('<tr>' +
        '<td class="font-mono font-medium text-primary">' + t.token + '</td>' +
        '<td class="text-muted">' + t.role + '</td>' +
        '<td class="font-mono text-xs">' + t.hex.toUpperCase() + '</td>' +
        '<td><span class="var-chip ' + badgeClass + '">' + badgeText + '</span></td>' +
        '<td style="text-align: right;"><span class="color-swatch-box" style="background-color: ' + t.rgb.hex + ';"></span></td>' +
        '</tr>');
      $tbody.append($tr);
    });
  };
})();
