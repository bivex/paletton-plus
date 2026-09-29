define("color.wheel", ["color.hsv.class", "color.rgb.class"], function(e, t) {
    var n, r, i, s, o, u, a, f, l, c, h;
    return s = function(e, t, n) {
        return n === -1 ? e : e + (t - e) / (1 + n)
    }, i = function(e, t, n) {
        return n === -1 ? t : t + (e - t) / (1 + n)
    }, f = {
        r: {
            rgb: new t(255, 0, 0),
            hsv: new e(0, 1, 1)
        },
        rg: {
            rgb: new t(255, 255, 0),
            hsv: new e(120, 1, 1)
        },
        g: {
            rgb: new t(0, 255, 0),
            hsv: new e(180, 1, .8)
        },
        gb: {
            rgb: new t(0, 255, 255),
            hsv: new e(210, 1, .6)
        },
        b: {
            rgb: new t(0, 0, 255),
            hsv: new e(255, .85, .7)
        },
        br: {
            rgb: new t(255, 0, 255),
            hsv: new e(315, 1, .65)
        }
    }, u = function(e) {
        return e < 120 ? h : e < 180 ? c : e < 210 ? a : e < 255 ? o : e < 315 ? n : r
    }, h = {
        a: f.r,
        b: f.rg,
        f: function(e) {
            return e === 0 ? -1 : Math.tan((120 - e) / 120 * Math.PI / 2) * .5
        },
        fi: function(e) {
            return e === -1 ? 0 : 120 - Math.atan(e / .5) * 120 / Math.PI * 2
        },
        g: s,
        orderRGB: function(e, n, r) {
            return new t(e, n, r)
        }
    }, c = {
        a: f.rg,
        b: f.g,
        f: function(e) {
            return e === 180 ? -1 : Math.tan((e - 120) / 60 * Math.PI / 2) * .5
        },
        fi: function(e) {
            return e === -1 ? 180 : 120 + Math.atan(e / .5) * 60 / Math.PI * 2
        },
        g: i,
        orderRGB: function(e, n, r) {
            return new t(n, e, r)
        }
    }, a = {
        a: f.g,
        b: f.gb,
        f: function(e) {
            return e === 180 ? -1 : Math.tan((210 - e) / 30 * Math.PI / 2) * .75
        },
        fi: function(e) {
            return e === -1 ? 180 : 210 - Math.atan(e / .75) * 30 / Math.PI * 2
        },
        g: s,
        orderRGB: function(e, n, r) {
            return new t(r, e, n)
        }
    }, o = {
        a: f.gb,
        b: f.b,
        f: function(e) {
            return e === 255 ? -1 : Math.tan((e - 210) / 45 * Math.PI / 2) * 1.33
        },
        fi: function(e) {
            return e === -1 ? 255 : 210 + Math.atan(e / 1.33) * 45 / Math.PI * 2
        },
        g: i,
        orderRGB: function(e, n, r) {
            return new t(r, n, e)
        }
    }, n = {
        a: f.b,
        b: f.br,
        f: function(e) {
            return e === 255 ? -1 : Math.tan((315 - e) / 60 * Math.PI / 2) * 1.33
        },
        fi: function(e) {
            return e === -1 ? 255 : 315 - Math.atan(e / 1.33) * 60 / Math.PI * 2
        },
        g: s,
        orderRGB: function(e, n, r) {
            return new t(n, r, e)
        }
    }, r = {
        a: f.br,
        b: f.r,
        f: function(e) {
            return (e % 360 === 0) ? -1 : Math.tan((e - 315) / 45 * Math.PI / 2) * 1.33
        },
        fi: function(e) {
            return e === -1 ? 0 : 315 + Math.atan(e / 1.33) * 45 / Math.PI * 2
        },
        g: i,
        orderRGB: function(e, n, r) {
            return new t(e, r, n)
        }
    }, l = {
        getBaseColorByHue: function(t) {
            var n, r, i, s;
            return t = (t % 360 + 360) % 360, n = u(t), r = n.f(t), s = n.g(n.a.hsv.v, n.b.hsv.v, r), i = n.g(n.a.hsv.s, n.b.hsv.s, r), new e(t, i, s)
        },
        hsv2rgb: function(e) {
            var t, n, r, i, s, o, a;
            return a = (e.h % 360 + 360) % 360, t = u(a), n = t.f(a), o = t.a.rgb, r = Math.max(o.r, Math.max(o.g, o.b)), r *= e.v, s = r * (1 - e.s), n === -1 ? i = s : i = (r + s * n) / (1 + n), t.orderRGB(r, i, s)
        },
        rgb2hsv: function(t) {
            var i, s, u, f, l, p, d, v;
            return t.r === t.b && t.r === t.g ? (s = 0, d = 0, v = t.getLum()) : (f = Math.max(t.r, Math.max(t.g, t.b)), p = Math.min(t.r, Math.min(t.g, t.b)), f === t.r ? p === t.b ? (l = t.g, i = h) : (l = t.b, i = r) : f === t.g ? p === t.r ? (l = t.b, i = a) : (l = t.r, i = c) : p === t.r ? (l = t.g, i = o) : (l = t.r, i = n), l === p ? u = -1 : u = (f - l) / (l - p), s = i.fi(u), d = (f - p) / f, v = f / 255), new e(s, d, v)
        }
    }, l
});
