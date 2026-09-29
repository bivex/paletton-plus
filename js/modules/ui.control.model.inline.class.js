define("ui.control.model.inline.class", ["app.events", "app.locale", "util", "ui.control.button.class", "ui.control.checkbox.class", "ui.control.menu.class"], function(e, t, n, r, i, s) {
    var o, u, a;
    return a = ["mono", "monocompl", "analog", "analogcompl", "triad", "triadcompl", "tetrad", "free"], u = {
        monocompl: "mono",
        analogcompl: "analog",
        triadcompl: "triad"
    }, o = function() {
        function o(e, t, r) {
            var i, s;
            this.palette = e, this.$parent = t, i = {
                className: "control control-model-inline"
            };
            if (!this.$parent) return;
            s = this, this.options = n.objMerge(i, r), this.selected = null, this.init()
        }
        return o.prototype.init = function() {
            var n, r, s, o, u, f, l;
            o = this, e.register("palette/model/changed", function() {
                return o.setByPalette()
            }), this.$e = $("<DIV>", {
                "class": this.options.className
            }), this.$parent.append(this.$e), l = ["mono", "analog", "triad", "tetrad", "free"];
            for (u = 0, f = l.length; u < f; u++) s = l[u], n = $("<A>", {
                href: "#",
                "class": "model model-" + s
            }), this.$e.append(n), r = $("<SPAN>", {
                "class": "ico ico-model ico-model-" + s
            }), n.append(r), n.data("id", s), n.click(function(e) {
                var t;
                return e.preventDefault(), s = $(this).data("id"), s === "free" ? (t = o.palette.hueCnt, o.palette.setModelFree(t)) : o.palette.setModel(s), o.setByPalette()
            });
            return r = $("<DIV>", {
                "class": "info"
            }), this.$e.append(r), this.$desc = $("<DIV>", {
                "class": "desc"
            }), r.append(this.$desc), this.$note = $("<DIV>", {
                "class": "note"
            }), r.append(this.$note), this.compl = new i(r, {
                label: t("model.addCompl"),
                onClick: function(e) {
                    var t;
                    return t = $.inArray(o.palette.modelID, a), e ? t++ : t--, s = a[t], o.palette.setModel(s, o.palette.model.swapped), o.setByPalette()
                }
            }), this.setByPalette()
        }, o.prototype.setByPalette = function() {
            var e, n, i, o, a, f, l;
            o = this.palette.modelID, n = o === "monocompl" || o === "analogcompl" || o === "triadcompl", this.compl.check(n), this.compl.$e.toggle(o !== "tetrad" && o !== "free");
            if (o === "free") {
                this.$desc.empty(), e = new r(this.$desc, {
                    className: "",
                    asUIButton: !1,
                    label: t("model.list." + o + ".short") + " – " + this.palette.hueCnt + " " + t("color.colors", 1) + "  ▾",
                    onClick: function() {
                        return f.open()
                    }
                }), a = [];
                for (i = l = 2; l <= 4; i = ++l) a.push({
                    label: i + " " + t("color.colors", 1),
                    selected: i === this.palette.hueCnt,
                    event: "palette/model/free",
                    id: i
                });
                f = new s(e.$e, {
                    className: "menu-lang",
                    positionMy: "center top",
                    positionAt: "center+5 top",
                    items: a
                }), this.$note.text(t("model.list.free.desc")).show()
            } else this.$desc.html(t("model.list." + o + ".short") + " (" + t("model.list." + o + ".desc") + ")"), this.$note.hide();
            return this.$e.toggleClass("compl", n), this.$e.find(".model.selected").removeClass("selected"), n && (o = u[o]), this.$e.find(".model-" + o).addClass("selected")
        }, o
    }(), o
});
