define("ui.control.menu.class", ["app.events", "util", "ui.control.button.class"], function(e, t, n) {
    var r;
    return r = function() {
        function n(e, n) {
            var r, i;
            this.$button = e, r = {
                className: "",
                width: "auto",
                positionMy: "left top",
                positionAt: "left top",
                positionOf: null,
                onChange: null,
                items: []
            }, i = this, this.options = t.objMerge(r, n), this.init()
        }
        return n.prototype.init = function() {
            var t, n;
            return n = this, this.$e = $("<UL>", {
                "class": "control control-menu " + this.options.className,
                css: {
                    position: "absolute",
                    zIndex: 9999,
                    width: this.options.width,
                    minWidth: this.$button.outerWidth()
                }
            }), $("body").append(this.$e), this.selected = null, t = function(e, n) {
                var r, i, s, o, u, a, f;
                f = [];
                for (u = 0, a = n.length; u < a; u++) o = n[u], i = $("<LI>"), e.append(i), o.separator ? i.text("-") : (r = $("<A>", {
                    href: "#",
                    title: o.desc || ""
                }), r.html(o.label), i.append(r), o.submenu ? (s = $("<UL>"), i.append(s), t(s, o.submenu)) : o.selected && (i.addClass("selected"), this.selected = o.id)), f.push(i.data("item", o));
                return f
            }, t(this.$e, this.options.items), this.$e.hide().menu({
                select: function(t, r) {
                    var i, s;
                    i = $(r.item).data("item");
                    if (i.submenu) return;
                    return n.select(i.id), e.trigger(i.event, {
                        id: i.id,
                        data: i.data
                    }), typeof(s = n.options).onChange == "function" ? s.onChange() : void 0
                }
            })
        }, n.prototype.select = function(e) {
            return this.selected = e, this.$e.find("LI").each(function() {
                var t;
                return t = $(this).data("item"), t.selected = t.id === e, $(this).toggleClass("selected", t.selected)
            })
        }, n.prototype.getSelected = function() {
            return this.$e.find("LI.selected")
        }, n.prototype.open = function() {
            var e, t, n;
            return n = this, t = this.$e.show().position({
                my: this.options.positionMy,
                at: this.options.positionAt,
                of: this.options.positionOf || this.$button
            }), e = $("<DIV>", {
                "class": "ui-widget-overlay ui-front"
            }), this.$e.before(e), setTimeout(function() {
                return $(document).one("click", function(n) {
                    return n.preventDefault(), n.stopImmediatePropagation(), t.hide(), e.remove()
                })
            }, 10)
        }, n.prototype.remove = function() {
            return this.$e.remove()
        }, n
    }(), r
});
