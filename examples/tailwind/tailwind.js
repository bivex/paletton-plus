// Tailwind CSS & shadcn/ui Paletton Showcase Colorizer
// Maps live Paletton color engine to standard shadcn design tokens

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

    $('.ui-tab-trigger').on('click', function() {
      $('.ui-tab-trigger').removeClass('active');
      $(this).addClass('active');
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

    function getForegroundFor(rgb) {
      var lum = getLuminance(rgb.r, rgb.g, rgb.b);
      return lum > 0.4 ? '#09090b' : '#fafafa';
    }

    var pri0 = getRgb('pri', 0);
    var pri1 = getRgb('pri', 1);
    var pri2 = getRgb('pri', 2);
    var pri3 = getRgb('pri', 3);
    var pri4 = getRgb('pri', 4);

    var sec1 = pal.hasSecs() ? getRgb('sec1', 0) : pri1;
    var sec2 = pal.hasSecs() ? getRgb('sec2', 0) : pri2;
    var compl = pal.hasCompl() ? getRgb('compl', 0) : pri3;

    var priFg = getForegroundFor(pri0);
    var secFg = getForegroundFor(sec1);
    var accFg = getForegroundFor(compl);

    var root = document.documentElement;
    root.style.setProperty('--primary', pri0.hex);
    root.style.setProperty('--primary-rgb', pri0.r + ', ' + pri0.g + ', ' + pri0.b);
    root.style.setProperty('--primary-foreground', priFg);

    root.style.setProperty('--secondary', sec1.hex);
    root.style.setProperty('--secondary-rgb', sec1.r + ', ' + sec1.g + ', ' + sec1.b);
    root.style.setProperty('--secondary-foreground', secFg);

    root.style.setProperty('--accent', compl.hex);
    root.style.setProperty('--accent-rgb', compl.r + ', ' + compl.g + ', ' + compl.b);
    root.style.setProperty('--accent-foreground', accFg);

    root.style.setProperty('--ring', pri0.hex);

    if (isDark) {
      root.style.setProperty('--background', '#09090b');
      root.style.setProperty('--card', '#121215');
      root.style.setProperty('--card-foreground', '#fafafa');
      root.style.setProperty('--muted', '#1d1d22');
      root.style.setProperty('--muted-foreground', '#94a3b8');
      root.style.setProperty('--border', 'rgba(' + pri0.r + ', ' + pri0.g + ', ' + pri0.b + ', 0.2)');
    } else {
      root.style.setProperty('--background', '#ffffff');
      root.style.setProperty('--card', '#ffffff');
      root.style.setProperty('--card-foreground', '#09090b');
      root.style.setProperty('--muted', '#f4f4f7');
      root.style.setProperty('--muted-foreground', '#64748b');
      root.style.setProperty('--border', 'rgba(' + pri0.r + ', ' + pri0.g + ', ' + pri0.b + ', 0.15)');
    }

    // Update stat cards
    $('#stat-pri-hex').text(pri0.hex);
    $('#stat-sec-hex').text(sec1.hex);
    $('#stat-acc-hex').text(compl.hex);

    // Update tokens table
    var bgRgb = isDark ? { r: 9, g: 9, b: 11 } : { r: 255, g: 255, b: 255 };
    var tokens = [
      { name: '--primary', value: pri0.hex, rgb: pri0, role: 'Main action & branding' },
      { name: '--primary-foreground', value: priFg, rgb: priFg === '#ffffff' ? {r:255,g:255,b:255} : {r:9,g:9,b:11}, role: 'Contrast text on primary' },
      { name: '--secondary', value: sec1.hex, rgb: sec1, role: 'Secondary buttons & tags' },
      { name: '--accent', value: compl.hex, rgb: compl, role: 'High-contrast accents' },
      { name: '--ring', value: pri0.hex, rgb: pri0, role: 'Focus indicators & outlines' }
    ];

    var $tbody = $('#token-table-body');
    $tbody.empty();

    tokens.forEach(function(item) {
      var ratio = getContrast(item.rgb, bgRgb);
      var badgeClass = ratio >= 4.5 ? 'ui-badge-primary' : ratio >= 3.0 ? 'ui-badge-secondary' : 'ui-badge-outline';
      var passLabel = ratio >= 4.5 ? 'AAA / AA' : ratio >= 3.0 ? 'AA Large' : 'Fail';

      var $tr = $('<tr>' +
        '<td><span class="font-mono font-medium">' + item.name + '</span><br><span class="text-xs text-muted">' + item.role + '</span></td>' +
        '<td class="font-mono">' + item.value + '</td>' +
        '<td><span class="ui-badge ' + badgeClass + '">' + ratio.toFixed(2) + ':1 (' + passLabel + ')</span></td>' +
        '<td style="text-align: right;"><span class="swatch-box" style="background-color:' + item.value + '"></span></td>' +
        '</tr>');
      $tbody.append($tr);
    });
  };
})();
