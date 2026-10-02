define("ui.control.preview.class", ["app.ini", "app.events", "app.settings", "app.locale", "util", "ui.control.menu.class", "ui.control.loader.class", "ui.control.colorinfo.class"], function(e, t, n, r, i, s, o, u) {
    var a, f;
    return f = [{
        id: "uimock",
        url: "preview/ui-mockup.html"
    }, {
        separator: !0
    }, {
        id: "def",
        url: "preview/default.html"
    }, {
        id: "deftxt",
        url: "preview/default-text.html"
    }, {
        id: "alt",
        url: "preview/preview-2.html"
    }, {
        id: "alttxt",
        url: "preview/preview-2-text.html"
    }, {
        id: "circ",
        url: "preview/circles.html"
    }, {
        separator: !0
    }, {
        id: "csd3",
        url: "preview/preview-csd3.html"
    }, {
        id: "csd2",
        url: "preview/preview-csd2.html"
    }, {
        id: "csd1",
        url: "preview/preview-csd1.html"
    }, {
        separator: !0
    }, {
        id: "mond",
        url: "preview/mondrian.html"
    }, {
        id: "mond0",
        url: "preview/mondrian-dark.html"
    }], a = function() {
        function a(e, t, r, s) {
            var o, u;
            this.$button = e, this.$parent = t, this.$iframe = r, o = {
                "default": "def"
            };
            if (!this.$parent || !this.$button) return;
            u = this, this.options = i.objMerge(o, s), this.selected = n.get("PRV") || this.options["default"], this.init()
        }
        return a.prototype.init = function() {
            var e, n, i, o, u, a, l;
            u = this, t.register("ui/preview/set", function(e, t) {
                return u.setPreview(t.id)
            }), t.register("ui/preview/loaded", function() {
                return u.loaded()
            }), t.register("palette/colors/changed", function() {
                return u.colorize()
            }), t.register("palette/typography/changed", function(e, typo) {
                return u.applyTypography(typo)
            }), t.register("ui/preview/colinfo", function(e, t) {
                return u.colInfo(t.hex)
            }), n = [];
            for (e = a = 0, l = f.length; a < l; e = ++a) o = f[e], o.separator ? n.push({
                separator: !0
            }) : n.push({
                label: r("preview.list." + o.id + ".title"),
                selected: o.id === this.selected,
                event: "ui/preview/set",
                id: o.id,
                data: null
            });
            return i = new s(this.$button, {
                className: "menu-preview",
                positionMy: "center bottom",
                positionAt: "center bottom",
                items: n
            }), this.$button.click(function(e) {
                return e.preventDefault(), i.open()
            }), this.$iframe.on("load", function() {
                u.applyTypography();
            }), this.setPreview(this.selected)
        }, a.prototype.getPreview = function(e) {
            var t, n, r, i;
            for (t = r = 0, i = f.length; r < i; t = ++r) {
                n = f[t];
                if (n.id === e) return n
            }
            return null
        }, a.prototype.setPreview = function(r) {
            var i, s, u;
            return r && (this.selected = r), i = this.getPreview(this.selected), i || (this.selected = this.options["default"], i = this.getPreview(this.selected)), (s = this.$bodyIF) != null && s.html(""), (u = this.loader) != null && typeof u.done == "function" && u.done(), this.loader = new o(this.$iframe), this.$iframe.attr("src", i.url), n.set("PRV", this.selected), t.trigger("ga/event", {
                key: e.GA.event.preview,
                value: this.selected
            })
        }, a.prototype.loaded = function() {
            return this.loader.done(), t.trigger("preview/changed", {
                id: this.selected
            }), this.$bodyIF = this.$iframe.contents().find("body"), this.applyTypography(), this.colorize()
        }, a.prototype.colorize = function() {
            var e, n;
            return n = this, e = n.$iframe.get(0).contentWindow, e && e.colorize ? n.$iframe.get(0).contentWindow.colorize() : t.trigger("palette/colorize", {
                $e: n.$bodyIF,
                sorted: !1,
                converted: !0
            })
        }, a.prototype.applyTypography = function(typo) {
            try {
                var iframe = this.$iframe ? this.$iframe[0] : null;
                if (!iframe) return;
                var win = iframe.contentWindow;
                var doc = iframe.contentDocument || (win ? win.document : null);
                if (!doc || !doc.head) return;

                var pal = window._Paletton ? window._Paletton.palette : null;
                typo = typo || (pal && pal.getTypography ? pal.getTypography() : null);
                if (!typo) return;

                var root = doc.documentElement;
                if (root && root.style) {
                    if (typo.heading) root.style.setProperty('--font-heading', typo.heading);
                    if (typo.body) root.style.setProperty('--font-body', typo.body);
                    if (typo.weightHeading) root.style.setProperty('--font-weight-heading', typo.weightHeading);
                    if (typo.letterSpacing) root.style.setProperty('--letter-spacing-heading', typo.letterSpacing);
                    if (typo.lineHeight) root.style.setProperty('--line-height-body', typo.lineHeight);
                    if (typo.scale) root.style.setProperty('--type-scale-ratio', typo.scale);
                }

                var styleEl = doc.getElementById('pal-typography-style');
                if (!styleEl) {
                    styleEl = doc.createElement('style');
                    styleEl.id = 'pal-typography-style';
                    doc.head.appendChild(styleEl);
                }
                var css = [
                    ':root {',
                    '  --font-heading: ' + typo.heading + ' !important;',
                    '  --font-body: ' + typo.body + ' !important;',
                    '  --font-weight-heading: ' + typo.weightHeading + ' !important;',
                    '  --letter-spacing-heading: ' + typo.letterSpacing + ' !important;',
                    '  --line-height-body: ' + typo.lineHeight + ' !important;',
                    '  --type-scale-ratio: ' + typo.scale + ' !important;',
                    '}',
                    'body, p, span, li, td, th, input, button, select, textarea, .text-content, .copy, .preview-var {',
                    '  font-family: ' + typo.body + ' !important;',
                    '}',
                    'h1, h2, h3, h4, h5, h6, .ttl, .title, .logo, header h2, .card-title, .nav-brand, .ui-heading, .stat-value, .fw-preview-head, dt {',
                    '  font-family: ' + typo.heading + ' !important;',
                    '  font-weight: ' + typo.weightHeading + ' !important;',
                    '  letter-spacing: ' + typo.letterSpacing + ' !important;',
                    '}'
                ].join('\n');
                styleEl.textContent = css;

                var fontNameEl = doc.querySelector('.font-preview-name');
                if (fontNameEl && typo.name) {
                    fontNameEl.textContent = typo.name;
                }

                if (win && typeof win.applyTypography === 'function') {
                    win.applyTypography(typo);
                }
            } catch(err) {
                console.warn('Preview applyTypography error:', err);
            }
        }, a.prototype.colInfo = function(e) {
            return new u(null, this.$parent, {
                hex: e
            })
        }, a
    }(), a
});
