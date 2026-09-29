define("color.lab.class", [], function() {
    var e;
    return e = function() {
        function e(e, t, n) {
            this.set(e, t, n)
        }
        return e.prototype.set = function(e, t, n) {
            this.l = e, this.a = t, this.b = n
        }, e.prototype.setByRGB = function(e) {
            var t, n, r, i, s, o;
            return r = e.r / 255, n = e.g / 255, t = e.b / 255, r = r > .04045 ? Math.pow((r + .055) / 1.055, 2.4) : r / 12.92, r *= 100, n = n > .04045 ? Math.pow((n + .055) / 1.055, 2.4) : n / 12.92, n *= 100, t = t > .04045 ? Math.pow((t + .055) / 1.055, 2.4) : t / 12.92, t *= 100, i = r * .412424 + n * .357579 + t * .180464, s = r * .212656 + n * .715158 + t * .0721856, o = r * .0193324 + n * .119193 + t * .950444, i /= 95.047, s /= 100, o /= 108.883, i = i > .008856 ? Math.pow(i, 1 / 3) : 7.787 * i + 16 / 116, s = s > .008856 ? Math.pow(s, 1 / 3) : 7.787 * s + 16 / 116, o = o > .008856 ? Math.pow(o, 1 / 3) : 7.787 * o + 16 / 116, this.set(116 * s - 16, 500 * (i - s), 200 * (s - o))
        }, e.prototype.copy = function() {
            return new e(this.l, this.a, this.b)
        }, e
    }(), e
});
