define("ui.control.adjuster.class", ["app.ini", "app.events", "app.locale", "color.wheel", "geometry.plane.class", "geometry.point.class", "ui.control.dialog.class", "ui.control.dot.class", "ui.control.variator.class", "util"], function(e, t, n, r, i, s, o, u, a, f) {
    var l;
    return l = function() {
        function r(e, t, n, r) {
            var i, s, o;
            this.$button = e, this.palette = t, this.$parent = n, s = {
                className: "",
                width: 170,
                positionMy: "center",
                positionAt: "center",
                positionOf: null
            };
            if (!this.$parent) return;
            o = this, this.options = f.objMerge(s, r), this.$button ? this.$button.click(function(e) {
                return e.preventDefault(), o.openDlg()
            }) : (i = this.createContent(), this.$parent.append(i))
        }
        return r.prototype.createContent = function() {
            var r, i, s, o;
            return o = this, r = $("<DIV>", {
                "class": "control control-adjust " + this.options.className
            }).width(this.options.width).height(this.options.height).data("control", this), s = function(e, t, n, r, s) {
                var o, u, a, f, l, c;
                o = $("<DIV>", {
                    "class": "row"
                }), e.append(o), u = $("<DIV>", {
                    "class": "btns"
                }), o.append(u);
                for (a = l = 0, c = s.length; l < c; a = ++l) f = s[a], i(u, n, r, f, a);
                return u = $("<DIV>", {
                    "class": "hdr"
                }), o.append(u), u.html('<span class="title">' + t + "</span>")
            }, i = function(n, r, i, s, u) {
                var a, f, l, c;
                return a = $("<BUTTON>"), n.append(a), s && a.click(function() {
                    return t.trigger(r, {
                        val: s
                    }), t.trigger("adjuster/changed"), t.trigger("ga/event", {
                        key: e.GA.event.adjust,
                        value: i + "/" + s
                    })
                }), c = Math.round(o.options.width / 6) - 4, f = [21, 17, 13, 13, 17, 21], l = ["-10", "-5", "-1", "+1", "+5", "+10"], a.text(l[u]).css({
                    width: c + "px",
                    height: f[u] + "px",
                    lineHeight: f[u] + "px"
                }).data("adjust-data", {
                    type: i,
                    val: s
                })
            }, s(r, n("adjuster.lblHue"), "palette/adjust/hue", "hue", [-10, -5, -1, 1, 5, 10]), s(r, n("adjuster.lblSat"), "palette/adjust/saturation", "sat", [-0.2, -0.05, -0.01, .01, .05, .2]), s(r, n("adjuster.lblBri"), "palette/adjust/bright", "bri", [-0.2, -0.05, -0.01, .01, .05, .2]), s(r, n("adjuster.lblCon"), "palette/adjust/contrast", "con", [80, 95.2381, 99.001, 101, 105, 125]), r
        }, r.prototype.openDlg = function() {
            var r, i;
            return i = this, this.close(), r = this.createContent(), this.dlg = new o(this.$parent, r, {
                className: "dlg-adjust",
                title: n("adjuster.title"),
                modal: !1,
                width: this.options.width + 20 + "px",
                destroyOnClose: !0,
                position: {
                    my: i.options.positionMy,
                    at: i.options.positionAt,
                    of: i.options.positionOf || i.$button
                }
            }), t.trigger("ga/event", {
                key: e.GA.event.adjust,
                value: "open"
            })
        }, r.prototype.close = function() {
            var e;
            return (e = this.dlg) != null ? e.close() : void 0
        }, r
    }(), l
});
