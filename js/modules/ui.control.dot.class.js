define("ui.control.dot.class", ["app.events", "util", "ui.drag", "geometry.plane.class", "geometry.point.class"], function(e, t, n, r, i) {
    var s;
    return s = function() {
        function s(e, s) {
            var o, u;
            this.$parent = e, o = {
                className: "",
                classOver: "over",
                classActive: "active",
                title: "",
                width: 17,
                height: 17,
                zindex: 99,
                opacity: 1,
                limit: null,
                dragable: !0,
                onDragStart: null,
                onDragMove: null,
                onBeforeDragMove: null,
                onDragStop: null,
                drawOnMove: !1,
                maxFPS: 0,
                data: null
            };
            if (!this.$parent) return;
            u = this, this.options = t.objMerge(o, s), this.data = this.options.data || {}, this.drag = {
                on: !1
            }, this.visible = !0, this.parW = this.$parent.width(), this.parH = this.$parent.height(), this.plane = new r(this.$parent), this.point = new i(this.plane), this.options.limit && this.point.setLimit(this.options.limit), this.$e = $("<DIV>", {
                "class": "control control-dot " + this.options.className,
                title: this.options.title
            }).css({
                position: "absolute",
                width: this.options.width + "px",
                height: this.options.height + "px",
                zIndex: this.options.zindex,
                opacity: this.options.opacity
            }).data("control", this), this.options.dragable && this.$e.mouseenter(function(e) {
                return $(this).addClass(u.options.classOver)
            }).mouseleave(function(e) {
                return $(this).removeClass(u.options.classOver)
            }).on("mousedown touchstart", function(e, t) {
                return t && (e = t), n.start(u, e, u.options.maxFPS), !1
            }), e.append(this.$e), this.draw()
        }
        return s.prototype.setXY = function(e, t) {
            return this.point.setXY(e, t), this.draw()
        }, s.prototype.setDeltaXY = function(e, t) {
            return this.point.setXY(this.point.x + e, this.point.y + t), this.draw()
        }, s.prototype.setPolar = function(e, t) {
            return this.point.setPolar(e, t), this.draw()
        }, s.prototype.doLimit = function() {
            return this.point.doLimit()
        }, s.prototype.setData = function(e, t) {
            return this.data[e] = t
        }, s.prototype.getData = function(e) {
            return this.data[e]
        }, s.prototype.show = function() {
            if (this.visible) return;
            return this.visible = !0, this.$e.show()
        }, s.prototype.hide = function() {
            if (!this.visible) return;
            return this.visible = !1, this.$e.hide()
        }, s.prototype.fadeOut = function() {
            return this.$e.fadeOut()
        }, s.prototype.fadeIn = function() {
            return this.$e.fadeIn()
        }, s.prototype.draw = function() {
            var e, t;
            if (!this.visible) return;
            return e = this.point.getLimited(), t = e.getCanvasPos(), this.$e.css({
                left: Math.floor(t.left - this.options.width / 2) + "px",
                top: Math.floor(t.top - this.options.height / 2) + "px"
            })
        }, s.prototype.onDragStart = function() {
            var t;
            return e.trigger("drag/start"), this.$e.addClass(this.options.classActive), typeof(t = this.options).onDragStart == "function" ? t.onDragStart(this.point, this.options.data) : void 0
        }, s.prototype.onDragStop = function() {
            var t;
            return e.trigger("drag/stop"), this.$e.removeClass(this.options.classActive), typeof(t = this.options).onDragStop == "function" ? t.onDragStop(this.point, this.options.data) : void 0
        }, s.prototype.onDragMove = function(e) {
            var t;
            return this.options.onBeforeDragMove != null && (this.data.beforeMoveData = this.options.onBeforeDragMove(e, this.point, this.options.data)), this.point.setXYByPagePos(e.pos), this.options.drawOnMove && this.draw(), typeof(t = this.options).onDragMove == "function" ? t.onDragMove(e, this.point, this.data) : void 0
        }, s
    }(), s
});
