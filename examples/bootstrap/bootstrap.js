// Bootstrap 5 Paletton Showcase Colorizer
// Integrates live Paletton palette with Bootstrap 5 design tokens

(function() {
    var isDark = false;

    $(function() {
        if (parent && parent._Paletton && parent._Paletton.events) {
            parent._Paletton.events.trigger('ui/example/loaded');
        }

        $('#btn-theme-toggle').on('click', function(e) {
            e.preventDefault();
            isDark = !isDark;
            $('html').attr('data-bs-theme', isDark ? 'dark' : 'light');
            $('#theme-icon').text(isDark ? '☀️' : '🌙');
            $('#theme-label').text(isDark ? 'Light' : 'Dark');
            colorize();
        });

        colorize();
    });

    window.colorize = function() {
        var pal = top && top._Paletton ? top._Paletton.palette : null;
        if (!pal) return;

        // Extract RGB and Hex objects from Paletton
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
        root.style.setProperty('--bs-primary', pri0.hex);
        root.style.setProperty('--bs-primary-rgb', pri0.r + ', ' + pri0.g + ', ' + pri0.b);
        root.style.setProperty('--bs-secondary', sec1.hex);
        root.style.setProperty('--bs-secondary-rgb', sec1.r + ', ' + sec1.g + ', ' + sec1.b);
        root.style.setProperty('--bs-accent', compl.hex);
        root.style.setProperty('--bs-accent-rgb', compl.r + ', ' + compl.g + ', ' + compl.b);
        root.style.setProperty('--bs-info', sec2.hex);
        root.style.setProperty('--bs-info-rgb', sec2.r + ', ' + sec2.g + ', ' + sec2.b);

        // Adjust body/card backgrounds slightly in dark/light mode for harmony
        if (isDark) {
            root.style.setProperty('--bs-body-bg', '#121519');
            root.style.setProperty('--bs-card-bg', '#1a1f26');
            root.style.setProperty('--bs-body-color', '#e2e8f0');
        } else {
            root.style.setProperty('--bs-body-bg', '#f8fafc');
            root.style.setProperty('--bs-card-bg', '#ffffff');
            root.style.setProperty('--bs-body-color', '#1e293b');
        }

        // Render dynamic Token Table
        var tokens = [
            { role: 'Primary (Brand)', token: '--bs-primary', hex: pri0.hex, r: pri0.r, g: pri0.g, b: pri0.b },
            { role: 'Secondary (Support)', token: '--bs-secondary', hex: sec1.hex, r: sec1.r, g: sec1.g, b: sec1.b },
            { role: 'Accent (Compl)', token: '--bs-accent', hex: compl.hex, r: compl.r, g: compl.g, b: compl.b },
            { role: 'Info / Accent 2', token: '--bs-info', hex: sec2.hex, r: sec2.r, g: sec2.g, b: sec2.b },
            { role: 'Primary Tint', token: '--bs-primary-tint', hex: pri1.hex, r: pri1.r, g: pri1.g, b: pri1.b },
            { role: 'Primary Shade', token: '--bs-primary-shade', hex: pri4.hex, r: pri4.r, g: pri4.g, b: pri4.b }
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

        var bgRgb = isDark ? { r: 18, g: 21, b: 25 } : { r: 248, g: 250, b: 252 };
        var $tbody = $('#token-table-body');
        $tbody.empty();

        tokens.forEach(function(item) {
            var ratio = getContrast({ r: item.r, g: item.g, b: item.b }, bgRgb);
            var badgeClass = ratio >= 4.5 ? 'bg-success' : ratio >= 3.0 ? 'bg-warning text-dark' : 'bg-danger';
            var passLabel = ratio >= 4.5 ? 'AAA / AA' : ratio >= 3.0 ? 'AA Large' : 'Fail';

            var $tr = $('<tr>' +
                '<td class="ps-3 fw-semibold">' + item.role + '</td>' +
                '<td><code>' + item.token + '</code></td>' +
                '<td class="font-monospace">' + item.hex + '</td>' +
                '<td><span class="badge ' + badgeClass + '">' + ratio.toFixed(2) + ':1 (' + passLabel + ')</span></td>' +
                '<td class="text-end pe-3"><span class="table-swatch" style="background-color:' + item.hex + '"></span></td>' +
                '</tr>');
            $tbody.append($tr);
        });
    };
})();
