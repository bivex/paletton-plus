// Ant Design (AntD v5) Paletton Showcase Colorizer
// Integrates live Paletton color engine with Ant Design ConfigProvider tokens

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

    $('.ant-menu-item').on('click', function() {
      $('.ant-menu-item').removeClass('selected');
      $(this).addClass('selected');
    });

    colorize();
  });

  window.colorize = function() {
    var pal = top && top._Paletton ? top._Paletton.palette : null;
    if (!pal) return;

    function getRgb(group, idx) {
      var col = pal.getColorCode(group, idx, 'byPalette', true, -1);
      if (!col) return { r: 22, g: 119, b: 255, hex: '#1677ff' };
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

    var pri0 = getRgb('pri', 0);
    var pri1 = getRgb('pri', 1);
    var pri4 = getRgb('pri', 4);

    var sec1 = pal.hasSecs() ? getRgb('sec1', 0) : getRgb('pri', 1);
    var compl = pal.hasCompl() ? getRgb('compl', 0) : (pal.hasSecs() ? getRgb('sec2', 0) : getRgb('pri', 3));

    var root = document.documentElement;

    root.style.setProperty('--ant-color-primary', pri0.hex);
    root.style.setProperty('--ant-color-primary-hover', pri1.hex);
    root.style.setProperty('--ant-color-primary-active', pri4.hex);
    root.style.setProperty('--ant-color-primary-bg', 'rgba(' + pri0.r + ', ' + pri0.g + ', ' + pri0.b + ', 0.08)');
    root.style.setProperty('--ant-color-primary-border', 'rgba(' + pri0.r + ', ' + pri0.g + ', ' + pri0.b + ', 0.25)');

    root.style.setProperty('--ant-color-secondary', sec1.hex);
    root.style.setProperty('--ant-color-secondary-bg', 'rgba(' + sec1.r + ', ' + sec1.g + ', ' + sec1.b + ', 0.08)');
    root.style.setProperty('--ant-color-secondary-border', 'rgba(' + sec1.r + ', ' + sec1.g + ', ' + sec1.b + ', 0.25)');

    root.style.setProperty('--ant-color-accent', compl.hex);
    root.style.setProperty('--ant-color-accent-bg', 'rgba(' + compl.r + ', ' + compl.g + ', ' + compl.b + ', 0.08)');
    root.style.setProperty('--ant-color-accent-border', 'rgba(' + compl.r + ', ' + compl.g + ', ' + compl.b + ', 0.25)');

    // Update Stat Tags
    $('#stat-pri-tag').text(pri0.hex);
    $('#stat-sec-tag').text(sec1.hex);
    $('#stat-acc-tag').text(compl.hex);

    // Update Table
    var bgRgb = isDark ? { r: 20, g: 20, b: 20 } : { r: 255, g: 255, b: 255 };
    var tokens = [
      { token: 'colorPrimary', role: 'Brand & Active states', hex: pri0.hex, rgb: pri0 },
      { token: 'colorPrimaryHover', role: 'Button hover & tabs', hex: pri1.hex, rgb: pri1 },
      { token: 'colorPrimaryActive', role: 'Active click state', hex: pri4.hex, rgb: pri4 },
      { token: 'colorSuccess', role: 'Secondary harmony & tags', hex: sec1.hex, rgb: sec1 },
      { token: 'colorWarning', role: 'Complementary triggers', hex: compl.hex, rgb: compl },
      { token: 'colorPrimaryBorder', role: 'Border & focus outline', hex: pri0.hex, rgb: pri0 }
    ];

    var $tbody = $('#token-table-body');
    $tbody.empty();

    tokens.forEach(function(item) {
      var ratio = getContrast(item.rgb, bgRgb);
      var passLabel = ratio >= 4.5 ? 'AAA / AA' : ratio >= 3.0 ? 'AA Large' : 'Fail';
      var tagClass = ratio >= 4.5 ? 'ant-tag-primary' : ratio >= 3.0 ? 'ant-tag-warning' : 'ant-tag';

      var $tr = $('<tr>' +
        '<td><span class="font-mono font-semibold">' + item.token + '</span></td>' +
        '<td class="text-secondary">' + item.role + '</td>' +
        '<td class="font-mono">' + item.hex + '</td>' +
        '<td><span class="ant-tag ' + tagClass + '">' + ratio.toFixed(2) + ':1 (' + passLabel + ')</span></td>' +
        '<td style="text-align: right;"><span class="swatch-box" style="background-color:' + item.hex + '"></span></td>' +
        '</tr>');
      $tbody.append($tr);
    });
  };
})();
