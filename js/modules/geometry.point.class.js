define("geometry.point.class", ["util"], function(e) {
    var t;
    return t = function() {
        function t(e) {
            this.plane = e, this.x = 0, this.y = 0, this.r = 0, this.theta = 0, this.limit = {
                type: "radius",
                value: {
                    min: 0,
                    max: 1
                }
            }
        }
        return t.prototype.setLimit = function(e) {
            this.limit = e
        }, t.prototype.setXY = function(t, n) {
            var r;
            return this.x = t, this.y = n, r = e.xy2polar(this.x, this.y), this.r = r[0], this.theta = r[1], r
        }, t.prototype.setPolar = function(t, n) {
            var r;
            return this.r = t, n > 2 * Math.PI && (n -= 2 * Math.PI), n < 0 && (n += 2 * Math.PI), this.theta = n, r = e.polar2xy(this.r, this.theta), this.x = r[0], this.y = r[1], r
        }, t.prototype.getSqrXY = function(t) {
            var n, r, i;
            return t || (t = 1), i = this.getSqrPolar(), n = i[0], r = i[1], e.polar2xy(n / t, r)
        }, t.prototype.setSqrXY = function(t, n, r) {
            var i, s, o;
            return r || (r = 1), o = e.xy2polar(t, n), i = o[0], s = o[1], this.setSqrPolar(i * r, s)
        }, t.prototype.getSqrPolar = function() {
            var e;
            return e = Math.max(Math.abs(Math.sin(this.theta)), Math.abs(Math.cos(this.theta))), [this.r / e, this.theta]
        }, t.prototype.setSqrPolar = function(e, t) {
            var n;
            return n = Math.max(Math.abs(Math.sin(t)), Math.abs(Math.cos(t))), this.setPolar(e * n, t)
        }, t.prototype.getXY = function() {
            return [this.x, this.y]
        }, t.prototype.getPolar = function() {
            return [this.r, this.theta]
        }, t.prototype.getCopy = function() {
            var e;
            return e = new t, e.x = this.x, e.y = this.y, e.r = this.r, e.theta = this.theta, e
        }, t.prototype.getLimited = function() {
            var e;
            return this.limit ? (e = new t(this.plane), e.setXY(this.x, this.y), e.setLimit(this.limit), e.doLimit(), e) : this
        }, t.prototype.getCanvasPos = function() {
            return this.plane.getCanvasPos(this.x, this.y)
        }, t.prototype.getPagePos = function() {
            return this.plane.getPagePos(this.x, this.y)
        }, t.prototype.setXYByCanvasPos = function(e) {
            var t;
            return t = this.plane.getXYbyCanvasPos(e), this.setXY(t.x, t.y)
        }, t.prototype.setXYByPagePos = function(e) {
            var t;
            return t = this.plane.getXYbyPagePos(e), this.setXY(t.x, t.y)
        }, t.prototype.doLimit = function() {
            var e, t, n;
            if (this.limit.type === "radius") return e = Math.min(Math.max(this.r, this.limit.value.min), this.limit.value.max), this.setPolar(e, this.theta, !0);
            if (this.limit.type === "bounds") return t = Math.min(Math.max(this.x, this.limit.value.xMin), this.limit.value.xMax), n = Math.min(Math.max(this.y, this.limit.value.yMin), this.limit.value.yMax), this.setXY(t, n, !0)
        }, t.prototype.getDistance = function(e) {
            var t, n;
            return t = this.x - e.x, n = this.y - e.y, Math.sqrt(t * t + n * n)
        }, t.prototype.getAngle = function(e, n) {
            var r, i, s;
            return i = new t(this.plane), s = new t(this.plane), i.setXY(e.x - this.x, e.y - this.y), s.setXY(n.x - this.x, n.y - this.y), r = i.theta - s.theta
        }, t
    }(), t
});
