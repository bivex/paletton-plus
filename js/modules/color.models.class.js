define("color.models.class", ["util", "color.class"], function(e, t) {
    var n, r, i, s, o, u, a, f, l, c;
    return l = function(t) {
        return e.angleAdd(t, 180)
    }, u = function(t, n) {
        return e.angleAdd(t, n)
    }, o = function(t, n) {
        return e.angleAdd(t, -n)
    }, f = function(t, n) {
        return e.angleAdd(t + 180, n)
    }, a = function(t, n) {
        return e.angleAdd(t + 180, -n)
    }, s = function(e) {
        return e < 0 ? -e : e
    }, i = function(e) {
        return e < 0 ? 180 + e : 180 - e
    }, r = function(e) {
        return e < 0 ? -e : 180 - e
    }, n = function() {
        function t(e, t, n, r) {
            this.fnGetCompl = e, this.fnGetSecCW = t, this.fnGetSecCCW = n, this.fnFixAngle = r, this.minD = 5, this.maxD = 175, this.swapped = !1
        }
        return t.prototype.getAngle = function(t) {
            return this.fnFixAngle && (t = this.fnFixAngle(t)), e.intervalNorm(t, this.minD, this.maxD)
        }, t.prototype.getComplement = function(e) {
            return this.fnGetCompl ? this.fnGetCompl(e) : null
        }, t.prototype.swapSecs = function() {
            return this.swapped = !this.swapped
        }, t.prototype.getSec1 = function(t, n) {
            var r;
            return r = this.fnGetSecCW, this.swapped && (r = this.fnGetSecCCW), r ? r(t, e.intervalNorm(n, this.minD, this.maxD)) : null
        }, t.prototype.getSec2 = function(t, n) {
            var r;
            return r = this.fnGetSecCCW, this.swapped && (r = this.fnGetSecCW), r ? r(t, e.intervalNorm(n, this.minD, this.maxD)) : null
        }, t
    }(), c = {
        mono: new n(null, null, null, null),
        monocompl: new n(l, null, null, null),
        triad: new n(null, f, a, i),
        triadcompl: new n(l, f, a, i),
        analog: new n(null, u, o, s),
        analogcompl: new n(l, u, o, s),
        tetrad: new n(l, u, f, r)
    }, c
});
