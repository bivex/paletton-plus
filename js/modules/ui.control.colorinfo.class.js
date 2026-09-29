define("ui.control.colorinfo.class", ["app.events", "app.locale", "util", "color.class", "color.rgb.class", "ui.control.button.class", "ui.control.palette.class", "ui.control.dialog.class", "color.oklch"], function(e, t, n, r, i, s, o, u, oklch) {
    var a;
    return a = function() {
        function o(o, a, f) {
            var l, c, h, p, d, v, m, g, y, b, w, E, S, x, T, N;
            this.color = o, this.$parent = a, y = {
                somethin: null
            };
            if (!this.$parent) return;
            N = this, this.options = n.objMerge(y, f), this.options.hex && (T = new i(0, 0, 0), T.setByHex(this.options.hex), this.color = new r(0), this.color.setByRGB(T)), l = $("<DIV>"), b = new u(this.$parent, l, {
                className: "dlg-colorinfo",
                title: t("colorInfo.title"),
                width: 520
            }), c = $("<CANVAS>", {
                css: {
                    width: "100%",
                    height: "150px"
                }
            }), l.append(c), S = c.width(), x = c.height(), g = c.get(0), g.width = S, g.height = x, m = g.getContext("2d"), m.fillStyle = this.color.getCSS(), m.fillRect(0, 0, S, x), w = g.toDataURL("image/png"), c.remove(), c = $("<IMG>", {
                src: w,
                width: S,
                height: x,
                css: {
                    cursor: "pointer"
                }
            }), l.append(c), c.click(function() {
                return window.open(w)
            }), h = $("<TABLE>"), l.append(h), p = $("<TBODY>"), h.append(p), d = function(e, t) {
                var n, r, i, s;
                return s = $("<TR>"), p.append(s), i = $("<TH>").append(e), s.append(i), r = $("<TD>"), n = $("<CODE>", { title: "Click to copy" }).text(t), r.append(n), n.click(function() {
                    var e, val = n.text();
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        navigator.clipboard.writeText(val).catch(function(){});
                    }
                    if (window._palShowToast) {
                        window._palShowToast("Copied: " + val);
                    }
                    e = $("<INPUT>", {
                        type: "text",
                        value: val,
                        readonly: !0
                    }), n.hide().after(e), e.focus(function() {
                        var e;
                        return e = $(this), setTimeout(function() {
                            return e.select()
                        }, 10)
                    }).blur(function() {
                        return n.show(), $(this).remove()
                    }), e.width(n.width()).focus()
                }), s.append(r)
            }, d("RGB [hex]", this.color.getHex()), d("RGB [0–255]", this.color.getTextVal(", ")), d("RGB [0–100%]", this.color.getTextPerc(1, !0, ", ")), d("HSL", oklch ? oklch.formatColorString(this.color.rgb.r, this.color.rgb.g, this.color.rgb.b, "hsl") : ""), d("OKLCH", this.color.getTextOKLCH()), d("APCA Contrast", "on #FFF: " + this.color.getAPCA({r:255,g:255,b:255}) + " Lc | on #000: " + this.color.getAPCA({r:0,g:0,b:0}) + " Lc"), d(t("colorInfo.lblHue") + "* (RYB)", this.color.hsv.h + "°"), d(t("colorInfo.lblLum") + " [0–100%]", n.round(this.color.getLum() * 100, 2) + " %"), d(t("colorInfo.lblLumRel") + ' <a href="http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef" target="_blank">' + t("colorInfo.linkWCAG") + "</a> [0–100%]", n.round(this.color.getLumWCAG() * 100, 2) + " %"), E = this.color.rgb.getLAB(), d("LAB", n.round(E.l, 2) + ", " + n.round(E.a, 2) + ", " + n.round(E.b, 2)), v = new s(l, {
                className: "apply",
                label: t("colorInfo.btnApply"),
                asUIButton: !0,
                onClick: function() {
                    return e.trigger("palette/set/base", {
                        color: N.color
                    }), b.close()
                }
            })
        }
        return o
    }(), a
});
