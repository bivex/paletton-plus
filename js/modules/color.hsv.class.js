define("color.hsv.class", ["util"], function(e) {
    var t;
    return t = function() {
        function t(e, t, n) {
            this.set(e, t, n)
        }
        return t.prototype.set = function(e, t, n) {
            this.h = e, this.s = t, this.v = n
        }, t.prototype.copy = function() {
            return new t(this.h, this.s, this.v)
        }, t.prototype.setH = function(t) {
            return this.h = e.angleNorm(t)
        }, t.prototype.setS = function(t) {
            return this.s = e.intervalNorm(t, 0, 1)
        }, t.prototype.setV = function(t) {
            return this.v = e.intervalNorm(t, 0, 1)
        }, t
    }(), t
});
