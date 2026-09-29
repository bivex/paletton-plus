define("ui.control.colorlist.table.contrast", ["app.events", "app.settings", "app.locale", "util", "color.class", "ui.control.colorinfo.class", "ui.control.btnedit.class"], function(e, t, n, r, i, s, o) {
    var u;
    return u = {
        draw: function(e, u, a) {
            var f, l, c, h, p, d, v, m, g, y, b, w, E, S, x, T, N, C, k, L, A, O;
            b = t.get("CFLT"), b != null || 0 <= b && b <= 21 || (b = 2), e.empty(), u.empty(), c = $("<TABLE>", {
                "class": "table table-contrast"
            }), e.append(c), h = $("<TBODY>"), c.append(h), m = new i(0), m.setSV(0, 1), v = [m], v = v.concat(a.colorTable.byLum.pri), a.hasSecs() && (v = v.concat(a.colorTable.byLum.sec1), v = v.concat(a.colorTable.byLum.sec2)), a.hasCompl() && (v = v.concat(a.colorTable.byLum.compl)), m = new i(0), m.setSV(0, 0), v.push(m), d = $("<TR>"), h.append(d), p = $("<TD>", {
                "class": "empty"
            }), d.append(p);
            for (w = N = 0, L = v.length; N < L; w = ++N) y = v[w], p = $("<TH>", {
                "class": "col colx col-" + w,
                title: y.getHex()
            }), d.append(p), p.css({
                background: y.getCSS()
            }), p.data("color", r.objCopy(y)), r.colorTooltip(p);
            for (w = C = 0, A = v.length; C < A; w = ++C) {
                y = v[w], d = $("<TR>"), h.append(d), p = $("<TH>", {
                    "class": "col coly col-" + w,
                    title: y.getHex()
                }), d.append(p), p.css({
                    background: y.getCSS()
                }), p.data("color", r.objCopy(y)), r.colorTooltip(p);
                for (E = k = 0, O = v.length; k < O; E = ++k) g = v[E], x = g.getLumWCAG() + .05, T = y.getLumWCAG() + .05, S = x / T, S < 1 && (S = 1 / S), S = r.round(S, 1), p = $("<TD>", {
                    "class": "col bg col-" + w + "-" + E,
                    title: y.getHex()
                }), d.append(p), p.css({
                    background: y.getCSS(),
                    opacity: S < b ? .1 : 1
                }), p.data("color", r.objCopy(y)), p.data("contrast", S), r.colorTooltip(p), l = $("<DIV>", {
                    "class": "col fg",
                    title: g.getHex()
                }), p.append(l), l.css({
                    background: g.getCSS()
                }), l.data("color", r.objCopy(g)), r.colorTooltip(l), l = $("<DIV>", {
                    "class": "info"
                }).text(S), p.append(l), l.css({
                    color: T < .33 ? "rgba(255,255,255,0.33)" : "rgba(0,0,0,0.66)"
                })
            }
            return h.find(".col").click(function(t) {
                return t.stopPropagation(), m = $(this).data("color"), new s(m, e)
            }), l = $("<DIV>").text(n("colorList.contrast.desc")), u.append(l), f = new o(u, {
                className: "btn-filter",
                labelPre: n("colorList.contrast.filter.btn") + ": ",
                labelPost: "",
                value: b,
                dlgTitle: n("colorList.contrast.filter.title"),
                dlgText: n("colorList.contrast.filter.text"),
                dlgWidth: 240,
                positionMy: "right bottom",
                positionAt: "right bottom",
                listen: [],
                callback: function(e) {
                    return e = parseFloat(e), isNaN(e) && (e = 0), e < 0 && (e = 0), e > 21 && (e = 21), e = r.round(e, 1), h.find(".bg.col").each(function() {
                        return S = $(this).data("contrast"), $(this).css("opacity", S < e ? .1 : 1)
                    }), t.set("CFLT", e), e
                }
            })
        }
    }, u
});
