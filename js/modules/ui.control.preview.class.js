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
            }), this.$bodyIF = this.$iframe.contents().find("body"), this.colorize()
        }, a.prototype.colorize = function() {
            var e, n;
            return n = this, e = n.$iframe.get(0).contentWindow, e && e.colorize ? n.$iframe.get(0).contentWindow.colorize() : t.trigger("palette/colorize", {
                $e: n.$bodyIF,
                sorted: !1,
                converted: !0
            })
        }, a.prototype.colInfo = function(e) {
            return new u(null, this.$parent, {
                hex: e
            })
        }, a
    }(), a
});
