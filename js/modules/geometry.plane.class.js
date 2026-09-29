define("geometry.plane.class", [], function() {
    var e;
    return e = function() {
        function e(e, t) {
            this.$canvas = e;
            if (!this.$canvas) return;
            t ? this.originPos = origin : this.originPos = {
                top: Math.floor(this.$canvas.height() / 2),
                left: Math.floor(this.$canvas.width() / 2)
            }
        }
        return e.prototype.getCanvasPos = function(e, t) {
            return {
                left: e + this.originPos.left,
                top: t + this.originPos.top
            }
        }, e.prototype.getPagePos = function(e, t) {
            var n;
            return n = this.$canvas.offset(), {
                left: e + this.originPos.left + n.left,
                top: t + this.originPos.top + n.top
            }
        }, e.prototype.getXYbyCanvasPos = function(e) {
            return {
                x: e.left - this.originPos.left,
                y: e.top - this.originPos.top
            }
        }, e.prototype.getXYbyPagePos = function(e) {
            var t;
            return t = this.$canvas.offset(), {
                x: e.left - t.left - this.originPos.left,
                y: e.top - t.top - this.originPos.top
            }
        }, e
    }(), e
});
