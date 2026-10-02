parent._Paletton.events.trigger('ui/preview/loaded');

// Typography synchronization bridge
(function() {
    function applyTypography(typo) {
        if (!typo) return;
        var root = document.documentElement;
        if (typo.heading) root.style.setProperty('--font-heading', typo.heading);
        if (typo.body) root.style.setProperty('--font-body', typo.body);
        if (typo.weightHeading) root.style.setProperty('--font-weight-heading', typo.weightHeading);
        if (typo.letterSpacing) root.style.setProperty('--letter-spacing-heading', typo.letterSpacing);
        if (typo.lineHeight) root.style.setProperty('--line-height-body', typo.lineHeight);
        if (typo.scale) root.style.setProperty('--type-scale-ratio', typo.scale);

        if (document.body) {
            document.body.style.fontFamily = typo.body;
            var headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6, .preview-heading, .title, .nav-brand, .card-title, .col-title');
            for (var i = 0; i < headings.length; i++) {
                headings[i].style.fontFamily = typo.heading;
                if (typo.weightHeading) headings[i].style.fontWeight = typo.weightHeading;
                if (typo.letterSpacing) headings[i].style.letterSpacing = typo.letterSpacing;
            }
        }
        var fontNameEl = document.querySelector('.font-preview-name');
        if (fontNameEl && typo.name) {
            fontNameEl.textContent = typo.name;
        }
    }

    try {
        if (window.parent && window.parent._Paletton) {
            var pal = window.parent._Paletton.palette;
            if (pal && typeof pal.getTypography === 'function') {
                applyTypography(pal.getTypography());
            }
            if (window.parent._Paletton.events && typeof window.parent._Paletton.events.register === 'function') {
                window.parent._Paletton.events.register('palette/typography/changed', function(e, typo) {
                    applyTypography(typo);
                });
            }
        }
    } catch(err) {
        console.warn('Typography bridge error:', err);
    }
})();

$(function() {

    $('.bgcol')
        .tooltip({
            position: {
                my: 'left+10 top+10',
                at: 'left bottom'
            },
            track: true,
            show: {
                effect: 'fadeIn',
                delay: 0
            },
            hide: {
                effect: 'fadeOut',
                delay: 0
            },
            content: function() {
                var $e = $(this),
                    col = $e.attr('title'),
                    data = $e.attr('col-data'),
                    str = col;
                if (data) {
                    str = '<p>' + str + '</p><p class="info">Click for more info</p>';
                }
                return str;
            }
        })
        .click(function(e) {
            e.stopPropagation();
            var data = $(this).attr('col-data');
            parent._Paletton.events.trigger('ui/preview/colinfo', {
                hex: data
            });
            $(this).tooltip('close');
        })

});
