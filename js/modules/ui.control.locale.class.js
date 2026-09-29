define("ui.control.locale.class", ["app.ini", "app.events", "app.locale", "util", "ui.control.menu.class", "ui.control.button.class"], function(e, t, n, r, i, s) {
    var o;
    return o = function() {
        function t(e, t) {
            var n, i;
            this.$parent = e, n = {
                className: "control control-lang",
                asUIButton: !1
            };
            if (!this.$parent) return;
            i = this, this.options = r.objMerge(n, t), this.selected = null, this.init()
        }
        return t.prototype.init = function() {
            var t, n, r, o, u, a;
            u = this, this.$e = $("<SPAN>", {
                "class": this.options.className
            }), this.$parent.append(this.$e), this.button = new s(this.$e, {
                className: "",
                asUIButton: u.options.asUIButton,
                label: e.lang.list[e.lang.active].title + "  ▾",
                onClick: function() {
                    return u.menu.open()
                }
            }), n = [], a = e.lang.list;
            for (t in a) o = a[t], r = o.abbr + " – " + o.title, o.enabled && n.push({
                label: r,
                selected: t === e.lang.active,
                event: "app/lang/set",
                id: t,
                data: null
            });
            return this.menu = new i(this.button.$e, {
                className: "menu-lang",
                positionMy: "center top",
                positionAt: "center+5 top",
                items: n
            })
        }, t
    }(), o
});
