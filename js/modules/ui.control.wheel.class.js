define("ui.control.wheel.class", ["color.wheel", "geometry.plane.class", "geometry.point.class", "ui.control.dot.class", "ui.control.variator.class", "ui.control.wheelswitch.class", "ui.drag", "app.events", "app.locale", "util"], function(e, t, n, r, i, s, o, u, a, f) {
    var l, c, h, p;
    return h = function(e) {
        var t;
        return t = f.rad2deg(e), f.angleNorm(t + 90)
    }, c = function(e) {
        var t;
        return t = f.angleNorm(e - 90), f.deg2rad(t)
    }, p = function(e, t, n, r) {
        return t >= n.options.triRadius[0] && t < n.options.triRadius[1] ? (e = f.angleNorm(Math.round(e / 15) * 15), r.setPolar(t, c(e)), e) : t >= n.options.secRadius[0] && t < n.options.secRadius[1] ? (e = f.angleNorm(Math.round(e / 30) * 30), r.setPolar(t, c(e)), e) : e
    }, l = function() {
        function l(e, t, n) {
            var r, i;
            this.palette = e, this.$parent = t, r = {
                className: "control control-wheel",
                width: 400,
                height: 400,
                maxFPS: 0,
                variatorRadius: 103,
                activeRadius: [125, 190],
                hueRadius: 139,
                triRadius: [156, 171],
                secRadius: [171, 185],
                variatorTreshold: .5
            };
            if (!this.$parent) return;
            i = this, this.options = f.objMerge(r, n), this.freeMode = !1, this.isOverlay = !1, this.drawBackground(), this.init(), u.register("palette/colors/changed", function() {
                return i.updateByPalette()
            }), u.register("palette/model/changed", function() {
                return i.updateByPalette()
            })
        }
        return l.prototype.init = function() {
            var e;
            return e = this, this.dotPri = new r(this.$e, {
                className: "pri",
                title: a("color.pri"),
                width: 17,
                height: 17,
                maxFPS: this.options.maxFPS,
                limit: {
                    type: "radius",
                    value: {
                        min: e.options.hueRadius,
                        max: e.options.hueRadius
                    }
                },
                onDragMove: function(t, n, r) {
                    var i, s, o, u, a;
                    return i = e.freeMode || t.shiftKey, a = n.getPolar(), o = a[0], u = a[1], s = h(u), s = p(s, o, e, e.dotPri), e.palette.setHue(s, i)
                }
            }), this.dotCompl = new r(this.$e, {
                className: "compl",
                title: a("color.compl"),
                width: 17,
                height: 17,
                opacity: .67,
                maxFPS: this.options.maxFPS,
                limit: {
                    type: "radius",
                    value: {
                        min: e.options.hueRadius,
                        max: e.options.hueRadius
                    }
                },
                onDragMove: function(t, n, r) {
                    var i, s, o, u, a;
                    return i = e.freeMode || t.shiftKey, a = n.getPolar(), o = a[0], u = a[1], s = h(u), s = p(s, o, e, e.dotPri), e.palette.setHueCompl(s, i)
                }
            }), this.dotSec1 = new r(this.$e, {
                className: "sec",
                title: a("color.sec"),
                width: 17,
                height: 17,
                maxFPS: this.options.maxFPS,
                limit: {
                    type: "radius",
                    value: {
                        min: e.options.hueRadius,
                        max: e.options.hueRadius
                    }
                },
                onDragMove: function(t, n, r) {
                    var i, s, o, u, a;
                    return s = e.freeMode || t.shiftKey, a = n.getPolar(), o = a[0], u = a[1], i = h(u), i = p(i, o, e, e.dotPri), e.palette.setHueSec(i, 1, s)
                }
            }), this.dotSec2 = new r(this.$e, {
                className: "sec",
                title: a("color.sec"),
                width: 17,
                height: 17,
                maxFPS: this.options.maxFPS,
                limit: {
                    type: "radius",
                    value: {
                        min: e.options.hueRadius,
                        max: e.options.hueRadius
                    }
                },
                onDragMove: function(t, n, r) {
                    var i, s, o, u, a;
                    return s = e.freeMode || t.shiftKey, a = n.getPolar(), o = a[0], u = a[1], i = h(u), i = p(i, o, e, e.dotPri), e.palette.setHueSec(i, 2, s)
                }
            }), this.variator = new i(this.$e, this.palette, {
                maxFPS: this.options.maxFPS
            }), this.updateByPalette()
        }, l.prototype.updateByPalette = function() {
            return this.dotPri.setPolar(1, c(this.palette.hue)), this.palette.hasCompl() ? (this.dotCompl.setPolar(1, c(this.palette.hueCompl)), this.dotCompl.show()) : this.dotCompl.hide(), this.palette.hasSecs() ? (this.dotSec1.setPolar(1, c(this.palette.hueSec1)), this.dotSec2.setPolar(1, c(this.palette.hueSec2)), this.dotSec1.show(), this.dotSec2.show()) : (this.dotSec1.hide(), this.dotSec2.hide()), this.drawDots(), this.updateBackground()
        }, l.prototype.drawDots = function() {
            return this.dotPri.draw(), this.dotCompl.draw(), this.dotSec1.draw(), this.dotSec2.draw()
        }, l.prototype.overlay = function(e) {
            return this.isOverlay = e, this.$overlay.toggleClass("over", e), e ? (this.dotPri.fadeOut(), this.dotCompl.fadeOut(), this.dotSec1.fadeOut(), this.dotSec2.fadeOut(), this.$info.fadeIn(), this.$switch.fadeIn()) : (this.dotPri.fadeIn(), this.palette.hasCompl() && this.dotCompl.fadeIn(), this.palette.hasSecs() && (this.dotSec1.fadeIn(), this.dotSec2.fadeIn()), this.$info.fadeOut(), this.$switch.fadeOut())
        }, l.prototype.updateBackground = function(t) {
            var n, r;
            return n = e.getBaseColorByHue(this.palette.getHueActive()), r = e.hsv2rgb(n), $(".wheel-bgcol").css({
                background: "#" + r.getHex()
            })
        }, l.prototype.drawBackground = function() {
            var e, r, i, u, f, l, c;
            this.$e = $("<DIV>", {
                "class": this.options.className
            }).width(this.options.width).height(this.options.height).data("control", this), this.$parent.append(this.$e), this.$e.append($("<DIV>", {
                "class": "wheel-bgcol"
            }));
            for (i = c = 1; c <= 4; i = ++c) this.$e.append($("<DIV>", {
                "class": "wheel-tile tile-" + i
            }));
            return u = new t(this.$e), f = new n(u), l = this, r = !1, e = !1, this.$overlay = $("<DIV>", {
                "class": "clickable"
            }).width(this.options.width).height(this.options.height).css({
                position: "relative",
                zIndex: 1
            }).on("mousedown", function(e) {
                return f.setXYByPagePos({
                    left: e.pageX,
                    top: e.pageY
                }), f.r >= l.options.activeRadius[0] && f.r <= l.options.activeRadius[1] && !l.isOverlay && l.dotPri.$e.triggerHandler("mousedown", e), !1
            }).on("mousemove", function(t) {
                var n;
                if (o.on) return;
                f.setXYByPagePos({
                    left: t.pageX,
                    top: t.pageY
                });
                if (f.r < l.options.variatorRadius && !r) return r = !0, n = l.$overlay.data("timerOut"), n ? (clearTimeout(n), l.$overlay.data("timerOut", null)) : (n = setTimeout(function() {
                    return l.$overlay.data("timerIn", null), l.overlay(!0)
                }, 250), l.$overlay.data("timerIn", n));
                if (f.r >= l.options.variatorRadius && r && !e) return r = !1, n = l.$overlay.data("timerIn"), n ? (clearTimeout(n), l.$overlay.data("timerIn", null)) : (n = setTimeout(function() {
                    return l.$overlay.data("timerOut", null), l.overlay(!1)
                }, 250), l.$overlay.data("timerOut", n))
            }), this.$e.append(this.$overlay), this.$info = $("<DIV>", {
                "class": "infopane"
            }), this.$overlay.append(this.$info), this.$info.text(a("variator.info.shiftText")), this.$info.fadeOut(0), this.$switch = $("<DIV>", {
                "class": "switch"
            }), this.$overlay.append(this.$switch), this["switch"] = new s(this.$switch, this, this.palette, {
                onEnter: function() {
                    return e = !0
                },
                onLeave: function() {
                    return e = !1
                }
            }), this.$switch.fadeOut(0)
        }, l
    }(), l
});
