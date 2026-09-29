define("color.cmyk.class", ["color.rgb.class", "util"], function(e, t) {
    var n;
    return n = function() {
        function n(e, t, n, r) {
            this.set(e, t, n, r)
        }
        return n.prototype.set = function(e, t, n, r) {
            this.c = e, this.m = t, this.y = n, this.k = r
        }, n.prototype.setByRGB = function(e) {
            var t, n, r, i, s, o, u;
            return n = 1 - e.r / 255, s = 1 - e.g / 255, u = 1 - e.b / 255, r = Math.min(n, Math.min(s, u)), r === 1 ? t = i = o = 0 : (t = (n - r) / (1 - r), i = (s - r) / (1 - r), o = (u - r) / (1 - r)), this.set(t, i, o, r)
        }, n.prototype.toRGB = function() {
            var t, n, r;
            return r = 255 * (1 - this.c) * (1 - this.k), n = 255 * (1 - this.m) * (1 - this.k), t = 255 * (1 - this.y) * (1 - this.k), new e(r, n, t)
        }, n.prototype.getTextPerc = function(e, n, r) {
            var i;
            return e || (e = 0), n ? (i = "", r == null && (r = "–")) : (i = " %", r == null && (r = " – ")), t.round(this.c * 100, e) + i + r + t.round(this.m * 100, e) + i + r + t.round(this.y * 100, e) + i + r + t.round(this.k * 100, e) + i
        }, n.prototype.copy = function() {
            return new n(this.c, this.m, this.y, this.k)
        }, n
    }(), n
});
