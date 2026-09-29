define("ui.control.colorlist.table.grid", ["app.events", "app.settings", "app.locale", "util", "color.class", "ui.control.colorinfo.class", "ui.control.btnedit.class"], function(e, t, n, r, i, s, o) {
    var u;
    return u = {
        draw: function(e, t, n) {
            var r, i, o, u, a, f;
            return e.empty(), t.empty(), r = $("<TABLE>", {
                "class": "table-grid"
            }), e.append(r), i = $("<TBODY>"), r.append(i), f = n.getColorGrid(19), a = function(t, n, r) {
                var i, o, u, a, l, c, h, p, d, v, m, g, y, b, w, E;
                i = $("<TABLE>", {
                    "class": "grid"
                }), o = $("<TBODY>"), i.append(o), f[t] || (t = "pri"), n ? (y = f[t].length - 1, b = 0, g = -1) : (y = 0, b = f[t].length - 1, g = 1);
                for (d = w = y; g > 0 ? w <= b : w >= b; d = w += g) {
                    m = f[t][d], a = $("<TR>"), o.append(a), r ? (h = m.length - 1, p = 0, c = -1) : (h = 0, p = m.length - 1, c = 1);
                    for (v = E = h; c > 0 ? E <= p : E >= p; v = E += c) l = m[v], u = $("<TD>", {
                        "class": "empty"
                    }), a.append(u), u.css({
                        background: l.getHex(!0)
                    }).data("color", l).click(function(t) {
                        var n;
                        return t.stopPropagation(), n = $(this).data("color"), new s(n, e)
                    })
                }
                return i
            }, u = $("<TR>"), i.append(u), o = $("<TD>"), u.append(o), o.append(a("pri", 0, 0)), o = $("<TD>"), u.append(o), o.append(a("sec1", 0, 1)), u = $("<TR>"), i.append(u), o = $("<TD>"), u.append(o), o.append(a("sec2", 1, 0)), o = $("<TD>"), u.append(o), o.append(a("compl", 1, 1))
        }
    }, u
});
