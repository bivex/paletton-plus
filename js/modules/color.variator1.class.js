define("color.variator1.class", ["color.wheel", "color.presets", "geometry.point.class", "lib.point.follower", "app.events", "util"], function(e, t, n, r, i, s) {
    var o, u;
    return u = [
        [.66667, .66667],
        [.33333, 1],
        [.5, .83333],
        [.83333, .5],
        [1, .33333]
    ], o = function() {
        function e(e, t, n) {
            var r, i;
            this.palette = e, r = {
                treshold: .5,
                minDistance: .05,
                onChange: null
            }, i = this, this.options = s.objMerge(r, n), this.defs = [], this.point = [], this.values = [], this.setPreset(t), this.inited = !0
        }
        return e.prototype.getVal = function(e) {
            return this.values[e]
        }, e.prototype.getVals = function(e) {
            return s.objCopy(this.values)
        }, e.prototype.setVals = function(e) {
            return this.values = e, this.calcPoints()
        }, e.prototype.setValsTransformed = function(e) {
            var t, n, r, i, s;
            r = [];
            for (t = i = 0, s = e.length; i < s; t = ++i) n = e[t], r.push(this.getValueTransform(n[0], n[1]));
            return this.setVals(r)
        }, e.prototype.getDef = function(e) {
            return this.defs[e]
        }, e.prototype.setDef = function(e, t) {
            return this.defs[e] = t
        }, e.prototype.getPoint = function(e) {
            return this.point[e]
        }, e.prototype.getSerialized = function() {
            var e, t, n, r, i, o;
            t = "", o = this.values;
            for (e = r = 0, i = o.length; r < i; e = ++r) n = o[e], t += s.myB64.encodeFloat(n[0] / 2, 2), t += s.myB64.encodeFloat(n[1] / 2, 2);
            return t
        }, e.prototype.setSerialized = function(e) {
            var t, n, r, i;
            r = [];
            for (t = i = 0; i <= 4; t = ++i) r[t] = [], n = e.substring(t * 4, t * 4 + 2), r[t][0] = s.myB64.decodeFloat(n, 2, 6) * 2, n = e.substring(t * 4 + 2, t * 4 + 4), r[t][1] = s.myB64.decodeFloat(n, 2, 6) * 2;
            return this.setVals(r)
        }, e.prototype.setMainVal = function(e) {
            var t;
            return t = this.valToPoint(e), this.moveMain(t.x, t.y)
        }, e.prototype.setValueTransform = function(e, t) {
            var n, r, i, s;
            return r = this.options.treshold, n = function(e) {
                return e < 1 ? e * (r + 1) - 1 : (e - 1) * (1 - r) + r
            }, i = n(e), s = n(t), [i, -s]
        }, e.prototype.getValueTransform = function(e, t) {
            var n, r, i, o;
            return r = this.options.treshold, n = function(e) {
                return e < r ? (e + 1) / (r + 1) : (e - r) / (1 - r) + 1
            }, i = s.round(n(e), 5), o = s.round(n(-t), 5), [i, o]
        }, e.prototype.valToPoint = function(e) {
            var t, r, i, s;
            return s = this.setValueTransform(e[0], e[1]), r = s[0], i = s[1], t = new n(null), t.setSqrXY(r, i, this.radius), t
        }, e.prototype.pointToVal = function(e) {
            var t, n, r;
            return r = e.getLimited().getSqrXY(this.radius), t = r[0], n = r[1], this.getValueTransform(t, n)
        }, e.prototype.calcVals = function() {
            var e, t, n;
            n = [];
            for (e = t = 0; t <= 4; e = ++t) n.push(this.values[e] = this.pointToVal(this.point[e]));
            return n
        }, e.prototype.calcPoints = function() {
            var e, t, n, i, s;
            s = [];
            for (e = i = 0; i <= 4; e = ++i) this.point[e] = this.valToPoint(this.values[e]), e === 0 ? s.push(n = this.pointToLoc(this.point[0])) : (t = this.pointToLoc(this.point[e]), s.push(this.setDef(e, r.getDef(n, t))));
            return s
        }, e.prototype.pointToLoc = function(e) {
            return r.createLoc(e.x, e.y)
        }, e.prototype.locToPoint = function(e, t) {
            return e.setXY(t.x, t.y)
        }, e.prototype.moveMain = function(e, t, n) {
            var i, s, o, u;
            this.point[0].setXY(e, t), this.point[0].doLimit(), o = this.pointToLoc(this.point[0]);
            for (i = u = 1; u <= 4; i = ++u) n ? (s = this.pointToLoc(this.point[i]), this.setDef(i, r.getDef(o, s))) : (s = r.getLoc(o, this.getDef(i)), this.locToPoint(this.point[i], s));
            return this.calcVals(), this.onChange()
        }, e.prototype.moveSec = function(e, t, n, i) {
            var s, o, u, a, f, l, c, h;
            if (i) return this.point[e].setXY(t, n), this.point[e].doLimit(), l = this.pointToLoc(this.point[0]), f = this.pointToLoc(this.point[e]), this.setDef(e, r.getDef(l, f)), this.calcVals(), this.onChange();
            c = this.point[e].getCopy(), h = this.point[e].getCopy(), h.setXY(t, n), h.doLimit(), o = this.point[0].getDistance(c), u = this.point[0].getDistance(h), o < this.options.minDistance && (o = this.options.minDistance), u < this.options.minDistance && (u = this.options.minDistance), s = this.point[0].getAngle(h, c), a = o > 0 ? u / o : 1;
            if (u < 1) return this.rotate(s, a)
        }, e.prototype.rotate2 = function(e, t) {
            var n, i, s, o, u, a;
            u = this.point[0], s = this.pointToLoc(u), console.log("rotate:");
            for (n = a = 1; a <= 4; n = ++a) o = this.point[n], o.setXY(o.x - u.x, o.y - u.y), o.setPolar(o.r * t, o.theta + e), o.setXY(o.x + u.x, o.y + u.y), i = this.pointToLoc(o), console.log(n, t, o.r, o.theta), this.setDef(n, r.getDef(s, i));
            return this.calcVals(), this.onChange()
        }, e.prototype.rotate = function(e, t) {
            var n, i, s, o, u, a, f;
            a = this.point[0].getCopy(), this.point[0].setXY(0, 0), s = this.pointToLoc(this.point[0]);
            for (n = f = 1; f <= 4; n = ++f) o = this.point[n], u = o.getCopy(), i = r.getLoc(s, this.getDef(n)), this.locToPoint(o, i), o.setPolar(o.r * t, o.theta + e), i = this.pointToLoc(o), this.setDef(n, r.getDef(s, i));
            return this.moveMain(a.x, a.y, !1)
        }, e.prototype.setPreset = function(e) {
            return t.presetList[e] != null ? this.setVals(s.objCopy(t.presetList[e].val)) : this.setVals(s.objCopy(u)), this.onChange()
        }, e.prototype.addSaturation = function(e) {
            return this.moveMain(this.point[0].x + e, this.point[0].y)
        }, e.prototype.addBright = function(e) {
            return this.moveMain(this.point[0].x, this.point[0].y - e)
        }, e.prototype.addContrast = function(e) {
            return e /= 100, this.rotate(0, e)
        }, e.prototype.onChange = function() {
            if (this.inited) return this.palette.varsChanged()
        }, e
    }(), o
});
