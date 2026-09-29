define("color.rgb.class", ["color.cmyk.class", "color.lab.class", "util", "color.oklch"], function(e, t, n, oklch) {
    var r;
    return r = function() {
        function r(e, t, n) {
            this.set(e, t, n)
        }
        return r.prototype.set = function(e, t, n) {
            return this.r = Math.round(e > 255 ? 255 : e > 0 ? e : 0), this.g = Math.round(t > 255 ? 255 : t > 0 ? t : 0), this.b = Math.round(n > 255 ? 255 : n > 0 ? n : 0)
        }, r.prototype.setNormalized = function(e, t, n) {
            var r, i;
            return i = Math.max(e, t, n), i > 255 && (r = 255 / i, e = Math.round(e * r), t = Math.round(t * r), n = Math.round(n * r)), this.set(e, t, n)
        }, r.prototype.setByHex = function(e) {
            var t, r, i, s;
            return s = n.hex2rgb(e), i = s[0], r = s[1], t = s[2], this.set(i, r, t)
        }, r.prototype.copy = function() {
            return new r(this.r, this.g, this.b)
        }, r.prototype.getCSS = function(e) {
            return e != null ? "rgba(" + this.r + "," + this.g + "," + this.b + "," + e + ")" : "rgb(" + this.r + "," + this.g + "," + this.b + ")"
        }, r.prototype.getTextVal = function(e) {
            return e == null && (e = "–"), this.r + e + this.g + e + this.b
        }, r.prototype.getTextPerc = function(e, t, r) {
            var i;
            return e || (e = 0), t ? (i = "", r == null && (r = "–")) : (i = " %", r == null && (r = " – ")), n.round(this.r / 255 * 100, e) + i + r + n.round(this.g / 255 * 100, e) + i + r + n.round(this.b / 255 * 100, e) + i
        }, r.prototype.getHex = function(e) {
            var t;
            return t = "", e && (t = "#"), t += n.dec2hex(this.r) + n.dec2hex(this.g) + n.dec2hex(this.b), t
        }, r.prototype.getLum = function() {
            return (this.r * .299 + this.g * .587 + this.b * .114) / 255
        }, r.prototype.getLumWCAG = function() {
            var e;
            return e = function(e) {
                var t;
                return t = e / 255, t <= .03928 ? t / 12.92 : Math.pow((t + .055) / 1.055, 2.4)
            }, e(this.r) * .2126 + e(this.g) * .7152 + e(this.b) * .0722
        }, r.prototype.getLAB = function() {
            var e;
            return e = new t(0, 0, 0), e.setByRGB(this), e
        }, r.prototype.getCMYK = function() {
            var t;
            return t = new e(0, 0, 0, 0), t.setByRGB(this), t
        }, r.prototype.getOKLCH = function() {
            return oklch.srgbToOklch(this.r, this.g, this.b)
        }, r.prototype.getTextOKLCH = function() {
            var o = this.getOKLCH();
            return oklch.formatCssOklch(o.L, o.C, o.H)
        }, r.prototype.setByOKLCH = function(L, C, H) {
            var c = oklch.oklchToSrgb(L, C, H);
            return this.set(c.r, c.g, c.b)
        }, r.prototype.getTonalScale = function(options) {
            return oklch.generateTonalScale(this.r, this.g, this.b, options)
        }, r.prototype.getConverted = function(e, t) {
            return e(this, t)
        }, r.prototype.getAPCA = function(bg) {
            return oklch.calcAPCA(this, bg || { r: 255, g: 255, b: 255 })
        }, r.prototype.getContrast = function(other) {
            return r.calcContrast(this, other)
        }, r.calcContrast = function(c1, c2) {
            if (!c1 || !c2) return 1.0;
            var getL = function(c) {
                if (typeof c.getLumWCAG === "function") return c.getLumWCAG();
                var e = function(val) {
                    var t = (val || 0) / 255;
                    return t <= .03928 ? t / 12.92 : Math.pow((t + .055) / 1.055, 2.4);
                };
                var cr = c.r != null ? c.r : (c[0] || 0);
                var cg = c.g != null ? c.g : (c[1] || 0);
                var cb = c.b != null ? c.b : (c[2] || 0);
                return e(cr) * .2126 + e(cg) * .7152 + e(cb) * .0722;
            };
            var l1 = getL(c1) + 0.05, l2 = getL(c2) + 0.05;
            var ratio = l1 > l2 ? l1 / l2 : l2 / l1;
            return Math.round(ratio * 100) / 100;
        }, r.calcAPCA = function(txt, bg) {
            return oklch.calcAPCA(txt, bg);
        }, r
    }(), r
});
