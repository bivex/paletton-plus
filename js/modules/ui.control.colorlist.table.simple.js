define("ui.control.colorlist.table.simple", ["app.events", "app.locale", "util", "ui.control.colorinfo.class"], function(e, t, n, r) {
    var i;
    return i = {
        draw: function(e, i, s) {
            var o, u, a;
            a = function(t, i, o) {
                var u, a, f, l, c, h, p, d;
                a = $("<TR>"), t.append(a), h = [1, 2, 0, 3, 4], d = [];
                for (l = p = 0; p <= 4; l = ++p) c = h[l], f = s.colorTable.byPalette[i][c], u = $("<TD>", {
                    "class": "col col-" + c,
                    title: o + " (" + c + ")"
                }), a.append(u), u.css({
                    background: f.getCSS()
                }), f.getLum() < .3 ? u.addClass("dark") : u.addClass("light"), u.text(f.getHex()), u.data("color", n.objCopy(f)), u.click(function() {
                    return f = $(this).data("color"), new r(f, e)
                }), d.push(n.colorTooltip(u));
                return d
            }, e.empty(), i.empty(), o = $("<TABLE>", {
                "class": "table table-simple"
            }), e.append(o), u = $("<TBODY>"), o.append(u), a(u, "pri", t("color.pri")), s.hasSecs() && (a(u, "sec1", t("color.sec") + " #1"), a(u, "sec2", t("color.sec") + " #2"));
            if (s.hasCompl()) return a(u, "compl", t("color.compl"))
        }
    }, i
});
