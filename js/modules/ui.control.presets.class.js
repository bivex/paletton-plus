define("ui.control.presets.class", ["app.ini", "app.events", "app.locale", "color.wheel", "color.palette.class", "color.presets", "geometry.plane.class", "geometry.point.class", "ui.control.dot.class", "ui.control.palette.class", "ui.control.variator.class", "util"], function(e, t, n, r, i, s, o, u, a, f, l, c) {
    var h;
    return h = function() {
        function r(e, n, r) {
            var i, s;
            this.palette = e, this.$parent = n, i = {
                className: "control control-presets"
            };
            if (!this.$parent) return;
            s = this, this.options = c.objMerge(i, r), this.init(), t.register("palette/colors/changed", function() {
                if (s.active) return s.draw()
            })
        }
        return r.prototype.init = function() {
            return this.active = !1
        }, r.prototype.activate = function(e) {
            this.active = !!e;
            if (this.active) return this.draw()
        }, r.prototype.draw = function() {
            var r, i, o, u, a, l, c, h;
            c = this, this.paletteWork = this.palette.copy(!0), this.palette.varsMultiOn && (this.paletteWork.setModel("mono"), this.paletteWork.setHue(this.palette.getHueActive())), this.$parent.empty(), this.$e = $("<DIV>", {
                "class": this.options.className
            }).width(this.options.width).height(this.options.height).data("control", this), this.$parent.append(this.$e), o = $("<UL>"), this.$e.append(o), h = s.presetList;
            for (a in h) l = h[a], i = $("<LI>"), o.append(i), r = $("<A>", {
                href: "#"
            }), i.append(r), this.paletteWork.setPreset(a), u = new f(this.paletteWork, r, {
                asStatic: !0
            }), r.data("preset", a), r.append(n("preset.list." + a + ".title"));
            return o.find("a").click(function(n) {
                return n.preventDefault(), a = $(this).data("preset"), c.palette.setPreset(a), t.trigger("ga/event", {
                    key: e.GA.event.preset,
                    value: a
                })
            })
        }, r
    }(), h
});
