define("util", [], function() {
    var e, t, n, r, i, s, o, u;
    return s = function(e) {
        return $ && $.extend ? $.extend(!0, {}, e) : n(e) ? t(e) : r(e) ? u({}, e) : e
    }, t = function(e) {
        var t, n, r, i;
        t = [];
        for (r = 0, i = e.length; r < i; r++) n = e[r], t.push(s(n));
        return t
    }, u = function(e, s) {
        var o, a;
        if (!r(e)) return {};
        if (!r(s || i(s))) return e;
        for (o in s) a = s[o], n(a) ? e[o] = t(a) : r(a) ? (r(e[o]) || (e[o] = {}), e[o] = u(e[o], a)) : e[o] = a;
        return e
    }, r = function(e) {
        return e && e.constructor && e.constructor === Object
    }, i = function(e) {
        var t;
        if (!r(e)) return !1;
        for (t in e) return !1;
        return !0
    }, o = function(e, t) {
        return $ && $.extend ? $.extend({}, e, t) : u(s(e), t)
    }, n = function(e) {
        return $ && $.extend ? $.isArray(e) : e === null || typeof e != "object" ? !1 : toString.call(e) === "[object Array]"
    }, e = {
        dec2hex: function(e, t) {
            var n;
            t || (t = 2), n = e.toString(16);
            while (n.length < t) n = "0" + n;
            return n.toUpperCase()
        },
        hex2dec: function(e) {
            return parseInt(e, 16)
        },
        hex2rgb: function(e) {
            var t, n, r;
            return e && e.match(/^\s*[0-9a-fA-F]{6}\s*$/) ? (r = this.hex2dec(e.substring(0, 2)), n = this.hex2dec(e.substring(2, 4)), t = this.hex2dec(e.substring(4, 6)), [r, n, t]) : [0, 0, 0]
        },
        intervalNorm: function(e, t, n) {
            return e < t ? t : e > n ? n : e
        },
        round: function(e, t) {
            var n;
            return n = Math.pow(10, t), Math.round(e * n) / n
        },
        rnd: function(e, t) {
            return e + Math.floor((t - e + 1) * Math.random())
        },
        rndSign: function() {
            return Math.random() < .5 ? 1 : -1
        },
        rndBool: function() {
            return Math.random() < .5
        },
        angleNorm: function(e) {
            return (e % 360 + 360) % 360
        },
        angleDiff: function(e, t) {
            var n, r;
            return n = this.angleNorm(e), r = this.angleNorm(t), r - n > 180 ? n += 360 : n - r > 180 && (r += 360), r - n
        },
        angleDiffRad: function(e, t) {
            var n, r;
            return n = this.rad2deg(e), r = this.rad2deg(t), this.deg2rad(this.angleDiff(n, r))
        },
        angleAdd: function(e, t) {
            var n;
            return n = e + t, this.angleNorm(n)
        },
        rad2deg: function(e) {
            return e * 180 / Math.PI
        },
        deg2rad: function(e) {
            return e * Math.PI / 180
        },
        xy2polar: function(e, t) {
            var n, r;
            return n = Math.sqrt(e * e + t * t), r = Math.atan2(t, e), r < 0 && (r += 2 * Math.PI), [n, r]
        },
        polar2xy: function(e, t) {
            var n, r;
            return n = e * Math.cos(t), r = e * Math.sin(t), [n, r]
        },
        normalizeCoords: function(e, t) {
            return [e[0] / t, e[1] / t]
        },
        unNormalizeCoords: function(e, t) {
            return [e[0] * t, e[1] * t]
        },
        objMerge: function(e, t) {
            return o(e, t)
        },
        objCopy: function(e) {
            return e === null ? null : n(e) ? e.slice() : s(e)
        },
        myB64: {
            _key: "0123456789abcdefghijklmnopqrstuvwxyz-ABCDEFGHIJKLMNOPQRSTUVWXYZ+",
            _pad: "0000000000000000",
            encodeInt: function(e, t) {
                var n, r, i;
                r = "", i = e, e || (r = "0");
                while (i) n = i & 63, r = this._key.charAt(n) + r, i >>= 6;
                return t && (r = this._pad + r, r = r.substring(r.length - t)), r
            },
            decodeInt: function(e) {
                var t, n, r, i, s;
                r = 0;
                if (!e) return 0;
                for (n = i = 0, s = e.length - 1; 0 <= s ? i <= s : i >= s; n = 0 <= s ? ++i : --i) r <<= 6, t = this._key.indexOf(e.charAt(n)), r |= t;
                return r
            },
            encodeFloat: function(e, t) {
                var n;
                return t || (t = 1), n = Math.round((Math.pow(64, t) - 1) * e), this.encodeInt(n, t)
            },
            decodeFloat: function(e, t, n) {
                var r, i, s;
                return i = this.decodeInt(e), i ? (s = i / (Math.pow(64, t) - 1), n && (r = Math.pow(10, n), s = Math.round(s * r) / r), s) : 0
            },
            encodeFlags: function(e) {
                var t, n, r, i;
                r = 0;
                for (t = i = 0; i <= 5; t = ++i) !e[t] || (n = 1 << t, r |= n);
                return this.encodeInt(r, 1)
            },
            decodeFlags: function(e) {
                var t, n, r, i, s;
                i = this.decodeInt(e), t = [];
                for (n = s = 0; s <= 5; n = ++s) r = 1 << n, t.push(!!(i & r));
                return t
            },
            isValidString: function(e) {
                var t, n, r;
                for (n = 0, r = e.length; n < r; n++) {
                    t = e[n];
                    if (this._key.indexOf(t) === -1) return !1
                }
                return !0
            }
        },
        sendRequest: function(e, t, n, r) {
            var i, s, o, u;
            s = $("<form>", {
                action: e,
                method: t
            }), r && s.attr("target", r), $("body").append(s);
            for (o in n) u = n[o], i = $("<INPUT>", {
                type: "hidden",
                name: o
            }), i.val(u), s.append(i);
            return s.submit(), s.remove()
        },
        colorTooltip: function(e) {
            return e.tooltip({
                position: {
                    my: "left+5 top+5",
                    at: "left bottom"
                },
                track: !0,
                show: {
                    effect: "fadeIn",
                    delay: 0
                },
                hide: {
                    effect: "fadeOut",
                    delay: 0
                },
                content: function() {
                    return "<p>" + $(this).attr("title") + '</p><p class="info">Click for more info</p>'
                }
            })
        }
    }, e
});
