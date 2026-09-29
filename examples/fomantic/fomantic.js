// Fomantic-UI Paletton Showcase Colorizer
// Integrates live Paletton palette with Fomantic / Semantic UI tokens

(function() {
    var isDark = false;

    $(function() {
        if (parent && parent._Paletton && parent._Paletton.events) {
            parent._Paletton.events.trigger('ui/example/loaded');
        }

        $('#btn-theme-toggle').on('click', function(e) {
            e.preventDefault();
            isDark = !isDark;
            $('body').toggleClass('dark-mode', isDark);
            $('#fom-menu').toggleClass('inverted', isDark);
            $('#theme-icon').text(isDark ? '☀️' : '🌙');
            $('#theme-label').text(isDark ? 'Light' : 'Dark');
            colorize();
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

        var pri0 = getRgb('pri', 0);
        var pri1 = getRgb('pri', 1);
        var pri2 = getRgb('pri', 2);
        var pri3 = getRgb('pri', 3);
        var pri4 = getRgb('pri', 4);

        var sec1 = pal.hasSecs() ? getRgb('sec1', 0) : pri1;
        var sec2 = pal.hasSecs() ? getRgb('sec2', 0) : pri2;
        var compl = pal.hasCompl() ? getRgb('compl', 0) : pri3;

        var root = document.documentElement;
        root.style.setProperty('--fom-pri', pri0.hex);
        root.style.setProperty('--fom-pri-rgb', pri0.r + ', ' + pri0.g + ', ' + pri0.b);
        root.style.setProperty('--fom-sec1', sec1.hex);
        root.style.setProperty('--fom-sec1-rgb', sec1.r + ', ' + sec1.g + ', ' + sec1.b);
        root.style.setProperty('--fom-sec2', sec2.hex);
        root.style.setProperty('--fom-sec2-rgb', sec2.r + ', ' + sec2.g + ', ' + sec2.b);
        root.style.setProperty('--fom-compl', compl.hex);
        root.style.setProperty('--fom-compl-rgb', compl.r + ', ' + compl.g + ', ' + compl.b);

        // Tokens & Accessibility Table
        var tokens = [
            { role: 'Primary (@primaryColor)', varName: '--fom-pri', hex: pri0.hex, r: pri0.r, g: pri0.g, b: pri0.b },
            { role: 'Secondary (@secondaryColor)', varName: '--fom-sec1', hex: sec1.hex, r: sec1.r, g: sec1.g, b: sec1.b },
            { role: 'Positive / Accent (@positiveColor)', varName: '--fom-compl', hex: compl.hex, r: compl.r, g: compl.g, b: compl.b },
            { role: 'Tertiary Tone (@infoColor)', varName: '--fom-sec2', hex: sec2.hex, r: sec2.r, g: sec2.g, b: sec2.b },
            { role: 'Primary Tint', varName: '--fom-pri-tint', hex: pri1.hex, r: pri1.r, g: pri1.g, b: pri1.b },
            { role: 'Primary Shade', varName: '--fom-pri-shade', hex: pri4.hex, r: pri4.r, g: pri4.g, b: pri4.b }
        ];

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

        var bgRgb = isDark ? { r: 19, g: 21, b: 24 } : { r: 247, g: 249, b: 250 };
        var $tbody = $('#fom-table-body');
        $tbody.empty();

        tokens.forEach(function(item) {
            var ratio = getContrast({ r: item.r, g: item.g, b: item.b }, bgRgb);
            var labelClass = ratio >= 4.5 ? 'green' : ratio >= 3.0 ? 'yellow' : 'red';
            var passLabel = ratio >= 4.5 ? 'AAA / AA' : ratio >= 3.0 ? 'AA Large' : 'Fail';

            var $tr = $('<tr>' +
                '<td class="collapsing"><strong>' + item.role + '</strong></td>' +
                '<td><code>' + item.varName + '</code></td>' +
                '<td><code>' + item.hex + '</code></td>' +
                '<td><span class="ui mini label ' + labelClass + '">' + ratio.toFixed(2) + ':1 (' + passLabel + ')</span></td>' +
                '<td class="right aligned"><span class="fom-table-swatch" style="background-color:' + item.hex + '"></span></td>' +
                '</tr>');
            $tbody.append($tr);
        });
    };
})();
