define("ui.control.colorlist.table.detail", ["app.events", "app.locale", "util", "ui.control.colorinfo.class"], function(e, t, n, r) {
    var i;
    return i = {
        draw: function(e, i, s) {
            var o, u, a;
            a = function(t, i, u) {
                var a, f, l, c, h, p, d, v, m, g, y, b;
                c = $("<TR>", {
                    "class": "title"
                }), t.append(c), l = $("<TD>", {
                    "class": "title",
                    colspan: 5
                }), c.append(l), l.text(u), c = $("<TR>"), t.append(c), h = $("<TR>", {
                    "class": "info"
                }), t.append(h), g = [1, 2, 0, 3, 4], b = [];
                for (v = y = 0; y <= 4; v = ++y) m = g[v], p = s.colorTable.byPalette[i][m], l = $("<TD>", {
                    "class": "col col-" + m
                }), c.append(l), l.css({
                    background: p.getCSS()
                }), l.attr({
                    title: u + " (" + m + ")"
                }), l.data("color", n.objCopy(p)), l.click(function() {
                    return p = $(this).data("color"), new r(p, e)
                }), n.colorTooltip(l), l = $("<TD>", {
                    "class": "desc col-" + m
                }), h.append(l), d = p.getHex(), a = $("<P>", {
                    "class": "hexcode"
                }), f = $("<SPAN>"), f.text(d), a.append(f), f.click(function() {
                    return o.find(".hexcode span").hide(), o.find(".hexcode input").show(), $(this).next().focus()
                }), f = $("<INPUT>", {
                    type: "text",
                    value: d,
                    readonly: !0
                }), a.append(f), f.hide(), f.focus(function() {
                    var e;
                    return e = $(this), setTimeout(function() {
                        return e.select()
                    }, 10)
                }), l.append(a), a = $("<P>", {
                    "class": "selectable"
                }), a.text("RGB: " + p.getTextVal()), l.append(a), a = $("<P>", {
                    "class": "selectable"
                }), a.text("RGB [%]: " + p.getTextPerc(1, !0)), b.push(l.append(a));
                return b
            }, e.empty(), i.empty(), o = $("<TABLE>", {
                "class": "table table-detail"
            }), e.append(o), u = $("<TBODY>"), o.append(u), a(u, "pri", t("color.pri")), s.hasSecs() && (a(u, "sec1", t("color.sec") + " #1"), a(u, "sec2", t("color.sec") + " #2"));
            if (s.hasCompl()) return a(u, "compl", t("color.compl"))
        }
    }, i
});
