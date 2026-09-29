define("ui.control.convert.class", ["app.ini", "app.events", "app.locale", "util", "color.convert", "ui.control.menu.class", "ui.control.button.class"], function(e, t, n, r, i, s, o) {
    var u, a;
    return a = [{
        id: "none",
        data: {
            type: null
        }
    }, {
        separator: !0
    }, {
        id: "colorblind",
        submenu: [{
            id: "protanope",
            data: {
                type: "protanope",
                amount: 1
            }
        }, {
            id: "deuteranope",
            data: {
                type: "deuteranope",
                amount: 1
            }
        }, {
            id: "tritanope",
            data: {
                type: "tritanope",
                amount: 1
            }
        }, {
            separator: !0
        }, {
            id: "protanomaly",
            data: {
                type: "protanope",
                amount: .6
            }
        }, {
            id: "deuteranomaly",
            data: {
                type: "deuteranope",
                amount: .5
            }
        }, {
            id: "tritanomaly",
            data: {
                type: "tritanope",
                amount: .5
            }
        }, {
            separator: !0
        }, {
            id: "dyschromatope",
            data: {
                type: "achromatope",
                amount: .85
            }
        }, {
            id: "achromatope",
            data: {
                type: "achromatope",
                amount: 1
            }
        }]
    }, {
        id: "desaturate",
        submenu: [{
            id: "grayhalf",
            data: {
                type: "gray",
                amount: .5
            }
        }, {
            id: "gray90",
            data: {
                type: "gray",
                amount: .9
            }
        }, {
            id: "gray",
            data: {
                type: "gray",
                amount: 1
            }
        }]
    }, {
        id: "gamma",
        submenu: [{
            id: "gamma-low",
            data: {
                type: "gamma",
                amount: .15
            }
        }, {
            id: "gamma-high",
            data: {
                type: "gamma",
                amount: .75
            }
        }]
    }, {
        separator: !0
    }, {
        id: "webcolor",
        data: {
            type: "webcolor"
        }
    }], u = function() {
        function i(e, t) {
            var n, i;
            this.$parent = e, n = {
                className: "control control-convert",
                asUIButton: !1,
                positionMy: "right bottom",
                positionAt: "right bottom+5",
                selected: "none",
                onChange: null
            };
            if (!this.$parent) return;
            i = this, this.options = r.objMerge(n, t), this.selected = this.options.selected, this.init()
        }
        return i.prototype.init = function() {
            var e, r, i;
            return i = this, t.register("ui/convert/set", function(e, t) {
                return i.setConvert(t.id)
            }), this.$e = $("<DIV>", {
                "class": this.options.className
            }), this.$parent.append(this.$e), this.button = new o(this.$e, {
                className: "",
                label: "xxx",
                asUIButton: this.options.asUIButton,
                onClick: function() {
                    return i.menu.open()
                }
            }), e = function(t, r) {
                var s, o, u, a, f;
                u = [];
                for (s = a = 0, f = t.length; a < f; s = ++a) o = t[s], o.separator ? u.push({
                    separator: !0
                }) : (o.label = n(r + "." + o.id + ".title"), o.desc = n(r + "." + o.id + ".desc"), o.submenu ? u.push({
                    label: o.label,
                    submenu: e(o.submenu, r + "." + o.id + ".sub")
                }) : u.push({
                    label: o.label,
                    desc: o.desc,
                    selected: o.id === i.selected,
                    event: "ui/convert/set",
                    id: o.id
                }));
                return u
            }, r = e(a, "convert.list"), this.menu = new s(this.button.$e, {
                className: "menu-model",
                positionMy: this.options.positionMy,
                positionAt: this.options.positionAt,
                onChange: this.options.onChange,
                items: r
            }), this.setConvert(this.selected)
        }, i.prototype.getSelected = function() {
            return this.selected
        }, i.prototype.getConvert = function(e, t) {
            var n, r, i, s, o;
            for (n = s = 0, o = t.length; s < o; n = ++s) {
                r = t[n];
                if (r.submenu) {
                    i = this.getConvert(e, r.submenu);
                    if (i) return i
                }
                if (r.id === e) return r
            }
            return null
        }, i.prototype.setConvert = function(r) {
            var i;
            return this.selected = r, i = this.getConvert(r, a), r === "none" ? (this.button.$e.removeClass("active"), this.button.setHtml(n("convert.btn") + "  ▾")) : (this.button.$e.addClass("active"), this.button.setHtml(n("convert.btnOn") + ": <b>" + i.label + "</b>  ▾")), t.trigger("convert/set", {
                data: i.data
            }), t.trigger("ga/event", {
                key: e.GA.event.converter,
                value: this.selected
            })
        }, i.prototype.remove = function() {
            return this.$e.remove(), this.menu.remove()
        }, i
    }(), u
});
