define("color.class", ["color.rgb.class", "color.hsv.class", "color.wheel", "util"], function(e, t, n, r) {
    var i;
    return i = function() {
        function e(e) {
            this._setHue(e), this._setSV(0, 0), this.hsv = new t(0, 0, 0), this._update()
        }
        return e.prototype._setHue = function(e) {
            return e = Math.round(r.angleNorm(e)), this.baseHSV = n.getBaseColorByHue(e)
        }, e.prototype._setSV = function(e, t) {
            return this.kS = r.intervalNorm(e, 0, 2), this.kV = r.intervalNorm(t, 0, 2)
        }, e.prototype._update = function() {
            var e;
            return e = function(e, t) {
                return t <= 1 ? e * t : e + (1 - e) * (t - 1)
            }, this.hsv.set(this.baseHSV.h, e(this.baseHSV.s, this.kS), e(this.baseHSV.v, this.kV)), this.rgb = n.hsv2rgb(this.hsv)
        }, e.prototype.setHue = function(e) {
            return this._setHue(e), this._update()
        }, e.prototype.setSV = function(e, t) {
            return this._setSV(e, t), this._update()
        }, e.prototype.setByHSV = function(e) {
            var t, n, r;
            return t = function(e, t) {
                return e === 0 ? 0 : t <= e ? t / e : 1 - e <= 0 ? 1 : (t - e) / (1 - e) + 1
            }, this._setHue(e.h), n = t(this.baseHSV.s, e.s), r = t(this.baseHSV.v, e.v), this._setSV(n, r), this._update()
        }, e.prototype.setByRGB = function(e) {
            return this.setByHSV(n.rgb2hsv(e))
        }, e.prototype.rotate = function(e) {
            var t;
            return t = r.angleAdd(this.baseHSV.h, e), this.setHue(t)
        }, e.prototype.getCSS = function(e) {
            return this.rgb.getCSS(e)
        }, e.prototype.getTextVal = function(e) {
            return this.rgb.getTextVal(e)
        }, e.prototype.getTextPerc = function(e, t, n) {
            return this.rgb.getTextPerc(e, t, n)
        }, e.prototype.getHex = function(e) {
            return this.rgb.getHex(e)
        }, e.prototype.getLum = function() {
            return this.rgb.getLum()
        }, e.prototype.getLumWCAG = function() {
            return this.rgb.getLumWCAG()
        }, e.prototype.getCMYK = function() {
            return this.rgb.getCMYK()
        }, e.prototype.getTextCMYK = function(e, t, n) {
            var r;
            return r = this.rgb.getCMYK(), r.getTextPerc(e, t, n)
        }, e.prototype.getOKLCH = function() {
            return this.rgb.getOKLCH()
        }, e.prototype.getTextOKLCH = function() {
            return this.rgb.getTextOKLCH()
        }, e.prototype.getTonalScale = function(options) {
            return this.rgb.getTonalScale(options)
        }, e.prototype.getConverted = function(e, t) {
            return this.rgb.getConverted(e, t)
        }, e.prototype.getAPCA = function(bg) {
            return this.rgb.getAPCA(bg)
        }, e.prototype.getContrast = function(other) {
            return this.rgb.getContrast(other && other.rgb ? other.rgb : other)
        }, e
    }(), i
});
