define("ui.control.paletteimg.class", ["app.events", "app.locale", "util", "ui.control.palette.class", "ui.control.dialog.class"], function(e, t, n, r, i) {
    var s;
    return s = function() {
        function e(e, r, s) {
            var o, u, a, f, l;
            this.palette = e, this.$parent = r, a = {
                somethin: null
            };
            if (!this.$parent) return;
            l = this, this.options = n.objMerge(a, s), o = $("<DIV>"), f = new i(this.$parent, o, {
                className: "dlg-paletteimg",
                title: t("palette.img.title"),
                width: 450,
                modal: !0,
                position: {
                    my: "center",
                    at: "center",
                    of: this.$parent
                }
            }), u = function(e) {
                var n, r, i, s, u, a, f, c, h, p, d;
                return a = 4 * e, u = 3 * e, n = $("<CANVAS>", {
                    css: {
                        width: 4 * a + "px",
                        height: u + "px"
                    }
                }), o.append(n), c = n.get(0), c.width = 4 * a, c.height = u, f = c.getContext("2d"), s = function(t, n, r) {
                    var i, s, o, c, h;
                    f.fillStyle = l.palette.getColorCode(t, 0, "sorted", !1), f.fillRect(n, 0, n + r * a, u), s = n, o = u - e, h = [];
                    for (i = c = 1; c <= 4; i = ++c) f.fillStyle = l.palette.getColorCode(t, i, "sorted", !1), f.fillRect(s, o, s + r * e, o + e), h.push(s += r * e);
                    return h
                }, h = l.palette.getColCnt(), d = 0, s("pri", 0, 5 - h), d += (5 - h) * a, l.palette.hasSecs() && (s("sec1", d, 1), d += a, s("sec2", d, 1), d += a), l.palette.hasCompl() && s("compl", d, 1), p = c.toDataURL("image/png"), n.remove(), r = $("<P>"), o.append(r), r.html(t("palette.img.label") + " " + 4 * a + " &times; " + u + "<br>"), i = $("<IMG>", {
                    src: p,
                    width: 4 * a,
                    height: u,
                    css: {
                        cursor: "pointer"
                    }
                }), r.append(i), i.click(function() {
                    return window.open(p)
                })
            }, u(25), u(16), u(8), u(4)
        }
        return e
    }(), s
});
