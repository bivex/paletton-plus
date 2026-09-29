define("ui.control.variator.class", ["ui.control.dot.class", "color.presets", "app.events", "util"], function(e, t, n, r) {
    var i;
    return i = function() {
        function t(t, i, s) {
            var o, u, a, f, l, c;
            this.$parent = t, this.palette = i, o = {
                className: "control control-variator",
                maxFPS: 0,
                radius: 100,
                radiusTreshold: 25,
                mirror: [3, 2, 1, 0],
                onChange: null
            };
            if (!this.$parent || !this.palette) return;
            f = this, this.options = r.objMerge(o, s), this.freeMode = !1, this.radius = this.options.radius, this.radiusTreshold = this.options.radiusTreshold, a = Math.floor(this.$parent.width() / 2) + 1 - this.radius, l = Math.floor(this.$parent.height() / 2) + 1 - this.radius, this.$e = $("<DIV>", {
                "class": this.options.className
            }).css({
                position: "absolute",
                left: a,
                top: l,
                width: Math.round(this.radius * 2) + "px",
                height: Math.round(this.radius * 2) + "px"
            }).data("control", this), this.$parent.append(this.$e), this.dot = [], this.dot[0] = new e(this.$e, {
                className: "small pri",
                width: 13,
                height: 13,
                maxFPS: this.options.maxFPS,
                limit: {
                    type: "radius",
                    value: {
                        min: 0,
                        max: f.radius
                    }
                },
                onBeforeDragMove: function(e, t, n) {},
                onDragMove: function(e, t, n) {
                    var r;
                    return r = f.freeMode || e.shiftKey, f.palette.vars.moveMain(t.x / f.radius, t.y / f.radius, r), f.applyValue()
                }
            });
            for (u = c = 1; c <= 4; u = ++c) this.dot[u] = new e(this.$e, {
                className: "small sec sec" + u,
                width: 13,
                height: 13,
                zindex: 98,
                opacity: .67,
                maxFPS: this.options.maxFPS,
                limit: {
                    type: "radius",
                    value: {
                        min: 0,
                        max: f.radius
                    }
                },
                data: {
                    idx: u
                },
                onBeforeDragMove: function(e, t, n) {},
                onDragMove: function(e, t, n) {
                    var r, i;
                    return i = n.idx, r = f.freeMode || e.shiftKey, f.palette.vars.moveSec(i, t.x / f.radius, t.y / f.radius, r), f.applyValue()
                },
                onDragStop: function() {
                    return n.trigger("palette/drag/done")
                }
            });
            n.register("palette/colors/changed", function() {
                return f.applyValue()
            })
        }
        return t.prototype.setFreeMode = function(e) {
            return this.freeMode = e
        }, t.prototype.applyValue = function() {
            var e, t, n;
            n = [];
            for (e = t = 0; t <= 4; e = ++t) this.setDotByVariatorPoint(this.dot[e], this.palette.vars.getPoint(e)), n.push(this.dot[e].draw());
            return n
        }, t.prototype.setDotByVariatorPoint = function(e, t) {
            return e.setPolar(t.r * this.radius, t.theta)
        }, t
    }(), i
});
