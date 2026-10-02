/**
 * Created by waleed on 1/16/2019.
 */
(function() {
    define("app.ini", [], function() {
        var e;
        return e = {
            version: {
                main: 4,
                sub: 0
            },
            namespace: {
                prefix: "_Paletton",
                widgetPrefix: "_Paletton_Widget",
                prefixID: "paletton"
            },
            cookie: {
                settings: "Paletton",
                settingsExp: 35,
                returning: "rv"
            },
            lang: {
                def: "en",
                active: null,
                path: "/js/lang/",
                list: {
                    en: {
                        title: "English",
                        abbr: "EN",
                        enabled: !0
                    },
                    cs: {
                        title: "Česky",
                        abbr: "CS",
                        enabled: !0
                    },
                    ru: {
                        title: "Русский",
                        abbr: "RU",
                        enabled: !0
                    },
                    es: {
                        title: "Español",
                        abbr: "ES",
                        enabled: !1
                    }
                }
            },
            urls: {
                "export": {
                    url: "export/index.php"
                },
                palette: {
                    url: "/palette.php"
                },
                about: {
                    url: "/wiki/"
                },
                versions: {
                    url: "/wiki/index.php?title=Paletton_version_history"
                },
                version_prev: {
                    url: "http://colorschemedesigner.com/csd-3.5/"
                },
                social_fb: {
                    url: "https://www.facebook.com/Paletton"
                },
                social_tw: {
                    url: "https://twitter.com/PalettonCom"
                },
                social_gplus: {
                    url: "https://plus.google.com/118420217375686132904"
                },
                link_widget: {
                    url: "/widget/"
                },
                link_mobile: {
                    url: "",
                    str: "app.header.mobile.desc"
                },
                link_more: {
                    url: "",
                    str: "app.header.more.desc"
                },
                email: {
                    url: "info@paletton.com"
                }
            },
            GA: {
                view: {
                    prefix: "/view/",
                    title: "App",
                    def: "default",
                    presets: "presets",
                    wheel: "wheel",
                    example: "example",
                    coltable: "coltable"
                },
                event: {
                    enterRGB: "Enter RGB",
                    enterHue: "Enter hue",
                    enterDist: "Enter angle",
                    preset: "Apply Preset",
                    randomize: "Randomize",
                    preview: "Set Preview",
                    reset: "Reset",
                    converter: "Vision sim.",
                    adjust: "Fine tuner",
                    redirect: "Redirect",
                    language: "Language switch"
                }
            }
        }, e
    })
}).call(this),
    function() {
        define("app.events", [], function() {
            var e, t;
            return t = "PALETTON", e = {
                init: function(e) {
                    this.$rootElm = e
                },
                register: function(e, n) {
                    if (!this.$rootElm) return;
                    return this.$rootElm.on(t + ":" + e, n)
                },
                trigger: function(e, n) {
                    if (!this.$rootElm) return;
                    return this.$rootElm.triggerHandler(t + ":" + e, n)
                },
                listenMessages: function(t) {
                    if (!this.$rootElm) return;
                    return t = function(t) {
                        if (!t || !t.data) return;
                        return e.trigger(t.data.id, t.data.data)
                    }, window.addEventListener("message", t)
                },
                sendMessage: function(e, t, n, r) {
                    var i;
                    if (!this.$rootElm) return;
                    return i = {
                        id: n,
                        data: r
                    }, e.postMessage(i, t)
                }
            }, e
        })
    }.call(this),
    function() {
        define("app.locale", [], function() {
            return function(e, t) {
                var n, r, i, s, o, u;
                try {
                    n = e.split("."), s = _Paletton_Strings;
                    for (o = 0, u = n.length; o < u; o++) i = n[o], s = s[i];
                    return t === 1 ? s.toLocaleLowerCase() : t === 2 ? s.toLocaleUpperCase() : s
                } catch (a) {
                    return r = a, "???"
                }
            }
        })
    }.call(this),
    function() {
        define("app.history", ["app.events", "app.locale"], function(e, t) {
            var n, r;
            return r = function(e) {
                var t;
                return t = window.location.href.split("#"), window.location.replace(t[0] + e)
            }, n = {
                init: function() {
                    var n, r;
                    n = document.location.hash.substring(1), r = this, $(window).hashchange(function() {
                        return r.processState()
                    }), this.states = [], this.blockedStates = [], this.statePtr = -1, this.maxPtr = -1, e.register("history/setstate", function(e, t) {
                        return r.setState(t)
                    }), e.register("history/back", function() {
                        return r.back()
                    }), e.register("history/fwd", function() {
                        return r.fwd()
                    }), e.register("history/block", function() {
                        return r.blockState()
                    }), this.processState();
                    if (n && n.indexOf("=") === -1 && confirm(t("app.confirmOldUID"))) return e.trigger("app/dispatch", {
                        id: "version_prev",
                        query: "#" + n
                    })
                },
                getState: function() {
                    var e, t;
                    return t = document.location.hash.substring(1), e = this.parseHash(t), e
                },
                setState: function(e) {
                    var t;
                    if (this.statePtr < 0 || e.uid !== this.states[this.statePtr].uid) return this.maxPtr = ++this.statePtr, this.states[this.maxPtr] = e, t = this.getUrlByUID(e.uid), r(t)
                },
                gotoState: function(e) {
                    var t, n;
                    if (e >= 0 && e <= this.maxPtr) return this.statePtr = e, t = this.states[e], n = this.getUrlByUID(t.uid), r(n)
                },
                setDefaultState: function() {},
                blockState: function() {
                    if (this.statePtr === -1) return;
                    return this.blockedStates[this.statePtr] = !0
                },
                processState: function() {
                    var t;
                    return t = this.getState(), t.uid ? this.statePtr < 0 && (this.statePtr = 0, this.states[0] = t) : t = null, e.trigger("history/changed", {
                        data: t
                    })
                },
                getUrlByUID: function(e) {
                    return e ? "#uid=" + e : ""
                },
                parseHash: function(e) {
                    var t, n, r, i, s, o, u, a, f;
                    n = e.split("&"), i = {};
                    for (r = u = 0, a = n.length; u < a; r = ++u) t = n[r], f = t.split("="), s = f[0], o = f[1], i[s] = o;
                    return i
                },
                hasBack: function() {
                    return this.statePtr > 0 && !this.blockedStates[this.statePtr]
                },
                hasFwd: function() {
                    return this.statePtr > -1 && this.statePtr < this.maxPtr
                },
                back: function() {
                    return this.gotoState(this.statePtr - 1)
                },
                fwd: function() {
                    return this.gotoState(this.statePtr + 1)
                }
            }, n
        })
    }.call(this),
    function() {
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
        })
    }.call(this),
    function() {
        define("app.settings", ["app.ini", "util"], function(e, t) {
            var n, r, i;
            return r = ["LNG", "PRV", "EXA", "CFLT"], n = function() {
                return document.cookie = "testcookie=1", document.cookie.indexOf("testcookie") !== -1
            }, i = {
                init: function() {
                    var e, t;
                    t = this, this.cookiesEnabled = n(), this.data = {}, $.cookie.json = !0, this.load();
                    for (e in this.data) $.inArray(e, r) === -1 && delete this.data[e];
                    return this.store()
                },
                get: function(e) {
                    return this.data[e]
                },
                set: function(e, t) {
                    return this.data[e] = t, this.store()
                },
                load: function() {
                    var t;
                    t = $.cookie(e.cookie.settings);
                    if (t) return this.data = t
                },
                store: function() {
                    return $.cookie(e.cookie.settings, this.data, {
                        expires: e.cookie.settingsExp,
                        path: "/"
                    })
                }
            }, i
        })
    }.call(this),
    function() {
        define("app.dispatcher", ["app.ini", "app.settings", "app.events", "app.locale", "util"], function(e, t, n, r, i) {
            var s;
            return s = {
                init: function() {
                    var e;
                    return e = this, n.register("app/dispatch", function(t, n) {
                        return e.dispatch(n)
                    }), n.register("app/lang/set", function(t, n) {
                        return e.setLang(n)
                    })
                },
                dispatch: function(t) {
                    var i, s;
                    i = e.urls[t.id];
                    if (!i) return;
                    return n.trigger("ga/event", {
                        key: e.GA.event.redirect,
                        value: t.id
                    }), i.url ? (s = i.url, t.query && (s += t.query), t.sameWin ? document.location.href = s : window.open(s)) : i.str ? alert(r(i.str)) : alert(r("error.dispatchURLNotAvailable"))
                },
                setLang: function(r) {
                    var s;
                    s = r.id, n.trigger("ga/event", {
                        key: e.GA.event.language,
                        value: r.id
                    });
                    if (s && e.lang.list[s] && e.lang.list[s].enabled) return t.cookiesEnabled ? (t.set("LNG", s), document.location.reload()) : i.sendRequest("", "get", {
                        lang: s
                    })
                }
            }, s
        })
    }.call(this),
    function() {
        define("util.ga.events", ["app.ini", "app.events"], function(e, t) {
            var n, r, i, s, o, u;
            return i = null, r = e.GA.view.def, s = "", u = "", o = "", n = {
                init: function(e) {
                    return i = e, t.register("palette/model/changed", function() {
                        return n.sendView()
                    }), t.register("ga/view", function(e, t) {
                        return n.sendView(t)
                    }), t.register("ga/event", function(e, t) {
                        return n.sendEvent(t)
                    }), n.sendView()
                },
                sendView: function(t) {
                    var n, a, f, l;
                    if (typeof ga == "undefined" || ga === null) return;
                    return l = i.palette, a = i.lang, f = l.modelID, (t != null ? t.view : void 0) === e.GA.view.presets && (r = e.GA.view.presets), (t != null ? t.view : void 0) === e.GA.view.wheel && (r = e.GA.view.wheel), (t != null ? t.view : void 0) ? s = t.view : s = r, u = e.GA.view.prefix + s, o = e.GA.view.title + " (" + s + ")", n = {
                        page: u,
                        title: o,
                        dimension1: a,
                        dimension2: f,
                        dimension3: ""
                    }, ga("send", "pageview", n)
                },
                sendEvent: function(e) {
                    var t, n, r, s;
                    if (!e || !e.key || !e.value || typeof ga == "undefined" || ga === null) return;
                    return s = i.palette, n = i.lang, r = s.modelID, t = {
                        eventCategory: e.key,
                        eventAction: e.value,
                        page: u,
                        title: o,
                        dimension1: n,
                        dimension2: r,
                        dimension3: ""
                    }, ga("send", "event", t)
                }
            }, n
        })
    }.call(this),
    function() {
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
        })
    }.call(this),
    function() {
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
        })
    }.call(this),
    function() {
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
        })
    }.call(this),
    function() {
        define("color.oklch", ["util"], function(r) {
    "use strict";

    // sRGB <-> Linear conversions
    function srgbToLinear(c) {
        var v = c / 255.0;
        return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    }

    function linearToSrgb(c) {
        var v = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(Math.max(0, c), 1.0 / 2.4) - 0.055;
        return Math.round(Math.max(0, Math.min(255, v * 255.0)));
    }

    function linearToSrgbFloat(c) {
        return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(Math.max(0, c), 1.0 / 2.4) - 0.055;
    }

    // sRGB (0..255) -> OKLab
    function srgbToOklab(red, green, blue) {
        var r_l = srgbToLinear(red);
        var g_l = srgbToLinear(green);
        var b_l = srgbToLinear(blue);

        var l = 0.4122214708 * r_l + 0.5363325363 * g_l + 0.0514459929 * b_l;
        var m = 0.2119034982 * r_l + 0.6806995451 * g_l + 0.1073969566 * b_l;
        var s = 0.0883024619 * r_l + 0.2817188376 * g_l + 0.6299787005 * b_l;

        var l_ = l > 0 ? Math.cbrt(l) : 0;
        var m_ = m > 0 ? Math.cbrt(m) : 0;
        var s_ = s > 0 ? Math.cbrt(s) : 0;

        return {
            L: 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
            a: 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
            b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_
        };
    }

    // OKLab -> sRGB (raw float, may be out of gamut)
    function oklabToSrgbRaw(L, a, b) {
        var l_ = L + 0.3963377774 * a + 0.2158037573 * b;
        var m_ = L - 0.1055613458 * a - 0.0638541728 * b;
        var s_ = L - 0.0894841775 * a - 1.2914855480 * b;

        var l = l_ * l_ * l_;
        var m = m_ * m_ * m_;
        var s = s_ * s_ * s_;

        var r_l = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
        var g_l = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
        var b_l = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

        return {
            r: linearToSrgbFloat(r_l),
            g: linearToSrgbFloat(g_l),
            b: linearToSrgbFloat(b_l)
        };
    }

    // OKLab <-> OKLCH
    function oklabToOklch(lab) {
        var C = Math.sqrt(lab.a * lab.a + lab.b * lab.b);
        var H = Math.atan2(lab.b, lab.a) * (180.0 / Math.PI);
        if (H < 0) H += 360.0;
        return { L: lab.L, C: C, H: H };
    }

    function oklchToOklab(L, C, H) {
        var hRad = (H * Math.PI) / 180.0;
        return {
            L: L,
            a: C * Math.cos(hRad),
            b: C * Math.sin(hRad)
        };
    }

    // sRGB -> OKLCH
    function srgbToOklch(r, g, b) {
        return oklabToOklch(srgbToOklab(r, g, b));
    }

    function inGamut(rgb, eps) {
        eps = eps || 0.001;
        return (
            rgb.r >= -eps && rgb.r <= 1.0 + eps &&
            rgb.g >= -eps && rgb.g <= 1.0 + eps &&
            rgb.b >= -eps && rgb.b <= 1.0 + eps
        );
    }

    // OKLCH -> sRGB with Gamut Mapping (binary search on Chroma)
    function oklchToSrgb(L, C, H) {
        if (L <= 0.0001) return { r: 0, g: 0, b: 0 };
        if (L >= 0.9999) return { r: 255, g: 255, b: 255 };

        var lab = oklchToOklab(L, C, H);
        var raw = oklabToSrgbRaw(lab.L, lab.a, lab.b);

        if (inGamut(raw)) {
            return {
                r: Math.round(Math.max(0, Math.min(1, raw.r)) * 255),
                g: Math.round(Math.max(0, Math.min(1, raw.g)) * 255),
                b: Math.round(Math.max(0, Math.min(1, raw.b)) * 255)
            };
        }

        // Binary search chroma
        var low = 0.0;
        var high = C;
        var best = { r: L, g: L, b: L };

        for (var i = 0; i < 16; i++) {
            var mid = (low + high) * 0.5;
            var testLab = oklchToOklab(L, mid, H);
            var testRgb = oklabToSrgbRaw(testLab.L, testLab.a, testLab.b);
            if (inGamut(testRgb)) {
                low = mid;
                best = testRgb;
            } else {
                high = mid;
            }
        }

        return {
            r: Math.round(Math.max(0, Math.min(1, best.r)) * 255),
            g: Math.round(Math.max(0, Math.min(1, best.g)) * 255),
            b: Math.round(Math.max(0, Math.min(1, best.b)) * 255)
        };
    }

    function formatCssOklch(L, C, H, alpha) {
        var lPerc = (L * 100).toFixed(1) + "%";
        var cVal = C.toFixed(3);
        var hDeg = H.toFixed(1);
        if (alpha != null && alpha < 1) {
            return "oklch(" + lPerc + " " + cVal + " " + hDeg + " / " + alpha + ")";
        }
        return "oklch(" + lPerc + " " + cVal + " " + hDeg + ")";
    }

    function rgbToHsl(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h = 0, s = 0, l = (max + min) / 2;
        if (max !== min) {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) * 60; break;
                case g: h = ((b - r) / d + 2) * 60; break;
                case b: h = ((r - g) / d + 4) * 60; break;
            }
        }
        return { h: h, s: s, l: l };
    }

    function formatColorString(r, g, b, format) {
        format = (format || "hex").toLowerCase();
        var cr = Math.max(0, Math.min(255, Math.round(r || 0)));
        var cg = Math.max(0, Math.min(255, Math.round(g || 0)));
        var cb = Math.max(0, Math.min(255, Math.round(b || 0)));
        var hex = ((1 << 24) + (cr << 16) + (cg << 8) + cb).toString(16).slice(1).toUpperCase();
        if (format === "hex") {
            return "#" + hex;
        }
        if (format === "oklch") {
            var oklch = srgbToOklch(cr, cg, cb);
            return formatCssOklch(oklch.L, oklch.C, oklch.H);
        }
        if (format === "rgb") {
            return "rgb(" + cr + ", " + cg + ", " + cb + ")";
        }
        if (format === "hsl") {
            var hsl = rgbToHsl(cr, cg, cb);
            return "hsl(" + Math.round(hsl.h) + ", " + Math.round(hsl.s * 100) + "%, " + Math.round(hsl.l * 100) + "%)";
        }
        return "#" + hex;
    }

    function formatHexColor(hexStr, format) {
        var hex = (hexStr || "").replace(/^#/, "");
        if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        var r = parseInt(hex.slice(0, 2), 16) || 0;
        var g = parseInt(hex.slice(2, 4), 16) || 0;
        var b = parseInt(hex.slice(4, 6), 16) || 0;
        return formatColorString(r, g, b, format);
    }

    /**
     * Generate modern 11-step tonal scale (50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950)
     * with perceptually uniform lightness steps and subtle natural hue-shift (warm light, cool shadow).
     */
    var TONAL_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
    var TONAL_LIGHTNESS = {
        50: 0.98,
        100: 0.94,
        200: 0.86,
        300: 0.77,
        400: 0.67,
        500: 0.56,
        600: 0.46,
        700: 0.36,
        800: 0.27,
        900: 0.18,
        950: 0.11
    };

    function generateTonalScale(baseR, baseG, baseB, options) {
        options = options || {};
        var base = srgbToOklch(baseR, baseG, baseB);
        var maxC = Math.max(0.04, base.C);
        var hueShift = options.hueShift !== undefined ? options.hueShift : 4.0; // degrees
        var scale = {};

        for (var i = 0; i < TONAL_STEPS.length; i++) {
            var step = TONAL_STEPS[i];
            var targetL = TONAL_LIGHTNESS[step];

            // Chroma curve: peak at midtones, taper at extremes
            // Bell-shaped curve centered around L=0.55
            var distFromCenter = Math.abs(targetL - 0.55);
            var chromaFactor = Math.max(0.15, 1.0 - distFromCenter * 1.5);
            var stepC = maxC * chromaFactor;

            // Hue shift: shift lighter steps towards warmer (~80 deg, yellow/amber),
            // darker steps towards cooler (~260 deg, blue)
            var stepH = base.H;
            if (hueShift > 0) {
                var shiftFactor = (targetL - 0.55) * 2; // -1 to +1
                stepH = (base.H + shiftFactor * hueShift + 360) % 360;
            }

            var rgb = oklchToSrgb(targetL, stepC, stepH);
            scale[step] = {
                step: step,
                L: targetL,
                C: stepC,
                H: stepH,
                r: rgb.r,
                g: rgb.g,
                b: rgb.b,
                hex: "#" + ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1).toUpperCase(),
                css: "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")",
                oklchCss: formatCssOklch(targetL, stepC, stepH)
            };
        }

        return scale;
    }

    function getRelativeLuminance(r, g, b) {
        var rL = srgbToLinear(r);
        var gL = srgbToLinear(g);
        var bL = srgbToLinear(b);
        return 0.2126 * rL + 0.7152 * gL + 0.0722 * bL;
    }

    function calcWcagContrast(rgb1, rgb2) {
        if (!rgb1 || !rgb2) return 1.0;
        var r1 = rgb1.r != null ? rgb1.r : (rgb1[0] || 0);
        var g1 = rgb1.g != null ? rgb1.g : (rgb1[1] || 0);
        var b1 = rgb1.b != null ? rgb1.b : (rgb1[2] || 0);
        var r2 = rgb2.r != null ? rgb2.r : (rgb2[0] || 0);
        var g2 = rgb2.g != null ? rgb2.g : (rgb2[1] || 0);
        var b2 = rgb2.b != null ? rgb2.b : (rgb2[2] || 0);
        var l1 = getRelativeLuminance(r1, g1, b1);
        var l2 = getRelativeLuminance(r2, g2, b2);
        var lighter = Math.max(l1, l2);
        var darker = Math.min(l1, l2);
        var ratio = (lighter + 0.05) / (darker + 0.05);
        return Math.round(ratio * 100) / 100;
    }

    function simulateColorBlindness(r, g, b, type) {
        var rl = srgbToLinear(r);
        var gl = srgbToLinear(g);
        var bl = srgbToLinear(b);
        var ro, go, bo;
        if (type === "protanopia") {
            ro = 0.56667 * rl + 0.43333 * gl + 0.00000 * bl;
            go = 0.55833 * rl + 0.44167 * gl + 0.00000 * bl;
            bo = 0.00000 * rl + 0.24167 * gl + 0.75833 * bl;
        } else if (type === "deuteranopia") {
            ro = 0.62500 * rl + 0.37500 * gl + 0.00000 * bl;
            go = 0.70000 * rl + 0.30000 * gl + 0.00000 * bl;
            bo = 0.00000 * rl + 0.30000 * gl + 0.70000 * bl;
        } else if (type === "tritanopia") {
            ro = 0.95000 * rl + 0.05000 * gl + 0.00000 * bl;
            go = 0.00000 * rl + 0.43333 * gl + 0.56667 * bl;
            bo = 0.00000 * rl + 0.47500 * gl + 0.52500 * bl;
        } else if (type === "achromatopsia" || type === "grayscale") {
            var y = 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
            ro = y; go = y; bo = y;
        } else {
            ro = rl; go = gl; bo = bl;
        }
        return {
            r: linearToSrgb(ro),
            g: linearToSrgb(go),
            b: linearToSrgb(bo)
        };
    }

    function sRgbToApcaY(c) {
        if (!c) return 0;
        var cr = c.r != null ? c.r : (c[0] != null ? c[0] : 0);
        var cg = c.g != null ? c.g : (c[1] != null ? c[1] : 0);
        var cb = c.b != null ? c.b : (c[2] != null ? c[2] : 0);
        var r = Math.pow(Math.max(0, Math.min(255, cr)) / 255.0, 2.4);
        var g = Math.pow(Math.max(0, Math.min(255, cg)) / 255.0, 2.4);
        var b = Math.pow(Math.max(0, Math.min(255, cb)) / 255.0, 2.4);
        return 0.2126729 * r + 0.7151522 * g + 0.0721750 * b;
    }

    function calcAPCA(txtRgb, bgRgb) {
        if (!txtRgb || !bgRgb) return 0;
        var yTxt = sRgbToApcaY(txtRgb);
        var yBg = sRgbToApcaY(bgRgb);
        var blkThrs = 0.022;
        var blkClmp = 1.414;
        if (yTxt < blkThrs) yTxt += Math.pow(blkThrs - yTxt, blkClmp);
        if (yBg < blkThrs) yBg += Math.pow(blkThrs - yBg, blkClmp);
        var deltaY2 = Math.abs(yBg - yTxt);
        if (deltaY2 < 0.0005) return 0;
        var SAPC = 0;
        if (yBg > yTxt) {
            SAPC = (Math.pow(yBg, 0.56) - Math.pow(yTxt, 0.57)) * 1.14;
        } else {
            SAPC = (Math.pow(yBg, 0.65) - Math.pow(yTxt, 0.62)) * 1.14;
        }
        if (Math.abs(SAPC) < 0.1) return 0;
        var Lc = SAPC > 0 ? (SAPC - 0.027) * 100 : (SAPC + 0.027) * 100;
        return Math.round(Lc * 10) / 10;
    }

    function interpolateOklab(r1, g1, b1, r2, g2, b2, t) {
        var lab1 = srgbToOklab(r1, g1, b1);
        var lab2 = srgbToOklab(r2, g2, b2);
        var L = lab1.L * (1 - t) + lab2.L * t;
        var a = lab1.a * (1 - t) + lab2.a * t;
        var b = lab1.b * (1 - t) + lab2.b * t;
        var lch = oklabToOklch({ L: L, a: a, b: b });
        return oklchToSrgb(lch.L, lch.C, lch.H);
    }

    function parseCssColor(str) {
        if (!str || typeof str !== 'string') return null;
        str = str.trim();

        // 1. OKLCH: oklch(L C H) or oklch(L% C H)
        var mOklch = str.match(/^oklch\(\s*([\d\.]+)%?\s+([\d\.]+)\s+([\d\.]+)/i);
        if (mOklch) {
            var rawL = parseFloat(mOklch[1]);
            var L = str.includes('%') || rawL > 1 ? rawL / 100.0 : rawL;
            var C = parseFloat(mOklch[2]);
            var H = parseFloat(mOklch[3]);
            return oklchToSrgb(L, C, H);
        }

        // 2. RGB: rgb(r, g, b) or rgba(r, g, b, a)
        var mRgb = str.match(/^rgba?\(\s*([\d\.]+%?)[,\s]+([\d\.]+%?)[,\s]+([\d\.]+%?)/i);
        if (mRgb) {
            var parseVal = function(v) {
                return v.endsWith('%') ? Math.round(parseFloat(v) * 2.55) : Math.round(parseFloat(v));
            };
            return {
                r: Math.max(0, Math.min(255, parseVal(mRgb[1]))),
                g: Math.max(0, Math.min(255, parseVal(mRgb[2]))),
                b: Math.max(0, Math.min(255, parseVal(mRgb[3])))
            };
        }

        // 3. HSL: hsl(h, s%, l%) or hsla(h, s%, l%, a)
        var mHsl = str.match(/^hsla?\(\s*([\d\.]+)(?:deg)?[,\s]+([\d\.]+)%[,\s]+([\d\.]+)%/i);
        if (mHsl) {
            var h = (parseFloat(mHsl[1]) % 360 + 360) % 360;
            var s = parseFloat(mHsl[2]) / 100.0;
            var l = parseFloat(mHsl[3]) / 100.0;
            var a = s * Math.min(l, 1 - l);
            var f = function(n) {
                var k = (n + h / 30) % 12;
                var color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
                return Math.round(Math.max(0, Math.min(255, 255 * color)));
            };
            return { r: f(0), g: f(8), b: f(4) };
        }

        // 4. HEX: #RGB, #RRGGBB, RGB, RRGGBB
        var cleanHex = str.replace(/[^0-9a-f]/gi, '');
        if (cleanHex.length === 3) {
            cleanHex = cleanHex[0] + cleanHex[0] + cleanHex[1] + cleanHex[1] + cleanHex[2] + cleanHex[2];
        }
        if (cleanHex.length === 6) {
            var num = parseInt(cleanHex, 16);
            return {
                r: (num >> 16) & 255,
                g: (num >> 8) & 255,
                b: num & 255
            };
        }

        return null;
    }

    // === Seed-based PRNG & Gaussian Distribution ===
    function mulberry32(seed) {
        var s = (seed >>> 0);
        return function() {
            var t = s += 0x6D2B79F5;
            t = Math.imul(t ^ (t >>> 15), t | 1);
            t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }

    function stringToSeed(str) {
        if (typeof str === "number") return str >>> 0;
        if (!str) return (Math.random() * 0xFFFFFFFF) >>> 0;
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = Math.imul(31, hash) + str.charCodeAt(i) | 0;
        }
        return hash >>> 0;
    }

    function generateSeed() {
        return Math.random().toString(36).substring(2, 10);
    }

    // Box-Muller Gaussian Jitter
    function randomGaussian(rng, mean, stdDev) {
        var u1 = rng();
        var u2 = rng();
        while (u1 <= 1e-7) u1 = rng();
        var z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        return (mean || 0) + z0 * (stdDev !== undefined ? stdDev : 1);
    }

    /**
     * Binary search on OKLCH Lightness L to guarantee WCAG targetRatio (e.g. 4.5 or 7.0).
     * Preserves H, applies gamut mapping on C at each step, and returns optimal readable L.
     */
    function fitContrast(fgOklch, bgRgb, targetRatio, options) {
        options = options || {};
        targetRatio = targetRatio || 4.5;
        if (!bgRgb) bgRgb = { r: 255, g: 255, b: 255 };
        var bgLum = getRelativeLuminance(bgRgb.r, bgRgb.g, bgRgb.b);

        var curRgb = oklchToSrgb(fgOklch.L, fgOklch.C, fgOklch.H);
        var curRatio = calcWcagContrast(curRgb, bgRgb);
        if (curRatio >= targetRatio) {
            return {
                L: fgOklch.L,
                C: fgOklch.C,
                H: fgOklch.H,
                rgb: curRgb,
                ratio: curRatio,
                passed: true
            };
        }

        var maxDarkRatio = (bgLum + 0.05) / 0.05;
        var maxLightRatio = 1.05 / (bgLum + 0.05);
        var goDark = (bgLum >= 0.179 && maxDarkRatio >= targetRatio) || (maxLightRatio < targetRatio);

        var lo = goDark ? 0.0 : Math.min(0.99, fgOklch.L);
        var hi = goDark ? Math.max(0.01, fgOklch.L) : 1.0;

        var bestL = goDark ? 0.0 : 1.0;
        var bestRgb = oklchToSrgb(bestL, fgOklch.C, fgOklch.H);
        var bestRatio = calcWcagContrast(bestRgb, bgRgb);

        for (var i = 0; i < 20; i++) {
            var mid = (lo + hi) * 0.5;
            var testRgb = oklchToSrgb(mid, fgOklch.C, fgOklch.H);
            var ratio = calcWcagContrast(testRgb, bgRgb);

            if (goDark) {
                if (ratio >= targetRatio) {
                    bestL = mid;
                    bestRgb = testRgb;
                    bestRatio = ratio;
                    lo = mid;
                } else {
                    hi = mid;
                }
            } else {
                if (ratio >= targetRatio) {
                    bestL = mid;
                    bestRgb = testRgb;
                    bestRatio = ratio;
                    hi = mid;
                } else {
                    lo = mid;
                }
            }
        }

        if (bestRatio < targetRatio) {
            var fallbackL = goDark ? 0.02 : 0.98;
            bestL = fallbackL;
            bestRgb = oklchToSrgb(bestL, 0.01, fgOklch.H);
            bestRatio = calcWcagContrast(bestRgb, bgRgb);
        }

        var apca = calcAPCA(bestRgb, bgRgb);
        return {
            L: bestL,
            C: fgOklch.C,
            H: fgOklch.H,
            rgb: bestRgb,
            ratio: bestRatio,
            apca: apca,
            passed: bestRatio >= targetRatio
        };
    }

    function fitContrastApca(fgOklch, bgRgb, targetLc, options) {
        targetLc = Math.abs(targetLc || 60);
        if (!bgRgb) bgRgb = { r: 255, g: 255, b: 255 };
        var bgLum = getRelativeLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
        var curRgb = oklchToSrgb(fgOklch.L, fgOklch.C, fgOklch.H);
        var curLc = Math.abs(calcAPCA(curRgb, bgRgb));
        if (curLc >= targetLc) {
            return { L: fgOklch.L, C: fgOklch.C, H: fgOklch.H, rgb: curRgb, apca: curLc, passed: true };
        }

        var goDark = bgLum >= 0.179;
        var lo = goDark ? 0.0 : Math.min(0.99, fgOklch.L);
        var hi = goDark ? Math.max(0.01, fgOklch.L) : 1.0;

        var bestL = goDark ? 0.0 : 1.0;
        var bestRgb = oklchToSrgb(bestL, fgOklch.C, fgOklch.H);
        var bestLc = Math.abs(calcAPCA(bestRgb, bgRgb));

        for (var i = 0; i < 20; i++) {
            var mid = (lo + hi) * 0.5;
            var testRgb = oklchToSrgb(mid, fgOklch.C, fgOklch.H);
            var lc = Math.abs(calcAPCA(testRgb, bgRgb));
            if (goDark) {
                if (lc >= targetLc) {
                    bestL = mid; bestRgb = testRgb; bestLc = lc;
                    lo = mid;
                } else {
                    hi = mid;
                }
            } else {
                if (lc >= targetLc) {
                    bestL = mid; bestRgb = testRgb; bestLc = lc;
                    hi = mid;
                } else {
                    lo = mid;
                }
            }
        }
        return { L: bestL, C: fgOklch.C, H: fgOklch.H, rgb: bestRgb, apca: bestLc, passed: bestLc >= targetLc };
    }

    function auditSemanticContrast(priRgb, bgRgb, textRgb, secRgb) {
        if (!priRgb || !bgRgb || !textRgb) return null;
        var textBgRatio = calcWcagContrast(textRgb, bgRgb);
        var priBgRatio = calcWcagContrast(priRgb, bgRgb);
        var secBgRatio = secRgb ? calcWcagContrast(secRgb, bgRgb) : null;

        var apcaText = Math.abs(calcAPCA(textRgb, bgRgb));
        var apcaPri = Math.abs(calcAPCA(priRgb, bgRgb));
        var apcaSec = secRgb ? Math.abs(calcAPCA(secRgb, bgRgb)) : null;

        var passesAA = textBgRatio >= 4.5 && priBgRatio >= 3.0;
        var passesAAA = textBgRatio >= 7.0 && priBgRatio >= 4.5;

        return {
            textBgRatio: textBgRatio,
            priBgRatio: priBgRatio,
            secBgRatio: secBgRatio,
            apcaText: apcaText,
            apcaPri: apcaPri,
            apcaSec: apcaSec,
            passesAA: passesAA,
            passesAAA: passesAAA,
            score: Math.min(100, Math.round((Math.min(7.0, textBgRatio) / 7.0 * 50) + (Math.min(4.5, priBgRatio) / 4.5 * 50)))
        };
    }

    /**
     * OKLab Euclidean color difference Delta E OK:
     * Reflects perceived visual distance uniformly across hue and lightness.
     * JND ~ 0.02, distinct accents >= 0.08, high contrast >= 0.15.
     */
    function deltaEOk(rgb1, rgb2) {
        if (!rgb1 || !rgb2) return 0;
        var lab1 = srgbToOklab(rgb1.r, rgb1.g, rgb1.b);
        var lab2 = srgbToOklab(rgb2.r, rgb2.g, rgb2.b);
        var dL = lab1.L - lab2.L;
        var da = lab1.a - lab2.a;
        var db = lab1.b - lab2.b;
        return Math.sqrt(dL * dL + da * da + db * db);
    }

    /**
     * Delta E OK under simulated Color Vision Deficiency (CVD).
     */
    function cvdDeltaEOk(rgb1, rgb2, type) {
        var sim1 = simulateColorBlindness(rgb1.r, rgb1.g, rgb1.b, type);
        var sim2 = simulateColorBlindness(rgb2.r, rgb2.g, rgb2.b, type);
        return deltaEOk(sim1, sim2);
    }

    /**
     * Multi-objective scoring function for batch generate-and-test candidate evaluation:
     * 1. Semantic contrast (WCAG text/bg, primary/bg, APCA)
     * 2. Perceptual accent distinctness (Delta E OK between swatches)
     * 3. Color vision deficiency safety (CVD simulation for protan/deutan/tritan)
     * 4. Novelty distance (anti-repeat vs last 5 palettes in history)
     * 5. Profile curve adherence
     */
    function scorePaletteCandidate(candidate, profile, history, options) {
        options = options || {};
        var targetRatio = options.targetRatio || 4.5;
        var priColors = candidate.pri;
        if (!priColors || priColors.length < 5) return { totalScore: 0 };

        var bgRgb = priColors[4];
        var textRgb = priColors[3];
        var priRgb = priColors[0];

        // 1. Contrast Score (0-100, weight 35%)
        var textRatio = calcWcagContrast(textRgb, bgRgb);
        var priRatio = calcWcagContrast(priRgb, bgRgb);
        var textScore = textRatio >= 7.0 ? 100 : (textRatio >= targetRatio ? (75 + (textRatio - targetRatio) * 10) : (textRatio / targetRatio * 60));
        var priTarget = targetRatio >= 7.0 ? 4.5 : 3.0;
        var priScore = priRatio >= priTarget ? (80 + Math.min(20, (priRatio - priTarget) * 10)) : (priRatio / priTarget * 60);
        var contrastScore = Math.max(0, Math.min(100, textScore * 0.65 + priScore * 0.35));

        // 2. Accent Distinctness Score (0-100, weight 25%)
        var accents = [priRgb];
        if (candidate.sec1 && candidate.sec1[0]) accents.push(candidate.sec1[0]);
        if (candidate.sec2 && candidate.sec2[0]) accents.push(candidate.sec2[0]);
        if (candidate.compl && candidate.compl[0]) accents.push(candidate.compl[0]);

        var minDelta = 1.0;
        var pairCount = 0;
        for (var i = 0; i < accents.length; i++) {
            for (var j = i + 1; j < accents.length; j++) {
                var dE = deltaEOk(accents[i], accents[j]);
                if (dE < minDelta) minDelta = dE;
                pairCount++;
            }
        }
        var distinctnessScore = 95;
        if (pairCount > 0) {
            if (minDelta >= 0.12) {
                distinctnessScore = 100;
            } else if (minDelta < 0.05) {
                distinctnessScore = Math.max(10, (minDelta / 0.05) * 40);
            } else {
                distinctnessScore = 40 + ((minDelta - 0.05) / 0.07) * 60;
            }
        }

        // 3. CVD Safety Score (0-100, weight 15%)
        var minCvdDelta = 1.0;
        var cvdPairs = 0;
        if (pairCount > 0) {
            var cvdTypes = ["deuteranopia", "protanopia"];
            for (var c = 0; c < cvdTypes.length; c++) {
                for (var ci = 0; ci < accents.length; ci++) {
                    for (var cj = ci + 1; cj < accents.length; cj++) {
                        var cdE = cvdDeltaEOk(accents[ci], accents[cj], cvdTypes[c]);
                        if (cdE < minCvdDelta) minCvdDelta = cdE;
                        cvdPairs++;
                    }
                }
            }
        }
        var cvdScore = 95;
        if (cvdPairs > 0) {
            if (minCvdDelta >= 0.08) {
                cvdScore = 100;
            } else if (minCvdDelta < 0.03) {
                cvdScore = Math.max(15, (minCvdDelta / 0.03) * 45);
            } else {
                cvdScore = 45 + ((minCvdDelta - 0.03) / 0.05) * 55;
            }
        }

        // 4. Novelty Distance Score (0-100, weight 15%)
        var noveltyScore = 100;
        if (history && history.length > 0) {
            var recentDiffs = [];
            for (var h = 0; h < Math.min(5, history.length); h++) {
                var prevHue = history[h].hue !== undefined ? history[h].hue : (history[h].priHue !== undefined ? history[h].priHue : null);
                if (prevHue !== null) {
                    var diffH = Math.abs(candidate.hue - prevHue);
                    var circularDiff = Math.min(diffH, 360 - diffH);
                    recentDiffs.push(circularDiff);
                }
            }
            if (recentDiffs.length > 0) {
                var immediateDiff = recentDiffs[0];
                if (immediateDiff < 15) {
                    noveltyScore = Math.max(20, (immediateDiff / 15) * 50);
                } else if (immediateDiff < 35) {
                    noveltyScore = 50 + ((immediateDiff - 15) / 20) * 35;
                } else {
                    noveltyScore = 85 + Math.min(15, ((immediateDiff - 35) / 50) * 15);
                }
            }
        }

        // 5. Profile Adherence Score (0-100, weight 10%)
        var adherenceScore = 90;
        if (profile && profile.curve) {
            var targetPriL = profile.curve[0][0];
            var priOklch = srgbToOklch(priRgb.r, priRgb.g, priRgb.b);
            var lDiff = Math.abs(priOklch.L - targetPriL);
            adherenceScore = Math.max(40, 100 - lDiff * 150);
        }

        var totalScore = Math.round(
            contrastScore * 0.35 +
            distinctnessScore * 0.25 +
            cvdScore * 0.15 +
            noveltyScore * 0.15 +
            adherenceScore * 0.10
        );

        return {
            totalScore: totalScore,
            contrastScore: Math.round(contrastScore),
            distinctnessScore: Math.round(distinctnessScore),
            cvdScore: Math.round(cvdScore),
            noveltyScore: Math.round(noveltyScore),
            adherenceScore: Math.round(adherenceScore),
            minDelta: minDelta,
            minCvdDelta: minCvdDelta,
            textRatio: textRatio,
            priRatio: priRatio
        };
    }

    /**
     * Generate complete semantic tokens including light & dark modes, functional roles,
     * and 11-step tonal scales (50-950) from the palette.
     */
    function generateSemanticTokens(priRgb, secRgb, complRgb, options) {
        options = options || {};
        var priOklch = srgbToOklch(priRgb.r, priRgb.g, priRgb.b);
        var baseHue = priOklch.H;
        var secRgbActual = secRgb || oklchToSrgb(priOklch.L, priOklch.C, (baseHue + 40) % 360);
        var complRgbActual = complRgb || oklchToSrgb(priOklch.L, priOklch.C, (baseHue + 180) % 360);

        // Scales
        var primaryScale = generateTonalScale(priRgb.r, priRgb.g, priRgb.b, { hueShift: 3 });
        var accentScale = generateTonalScale(secRgbActual.r, secRgbActual.g, secRgbActual.b, { hueShift: 4 });
        var complScale = generateTonalScale(complRgbActual.r, complRgbActual.g, complRgbActual.b, { hueShift: 3 });

        // Functional roles in OKLCH
        var successRgb = oklchToSrgb(0.62, 0.17, 145);
        var warningRgb = oklchToSrgb(0.76, 0.16, 85);
        var dangerRgb = oklchToSrgb(0.58, 0.22, 28);
        var infoRgb = oklchToSrgb(0.62, 0.16, 235);

        var successScale = generateTonalScale(successRgb.r, successRgb.g, successRgb.b);
        var warningScale = generateTonalScale(warningRgb.r, warningRgb.g, warningRgb.b);
        var dangerScale = generateTonalScale(dangerRgb.r, dangerRgb.g, dangerRgb.b);
        var infoScale = generateTonalScale(infoRgb.r, infoRgb.g, infoRgb.b);

        // Light mode semantic roles
        var bgLight = oklchToSrgb(0.985, 0.006, baseHue);
        var surfaceLight = oklchToSrgb(0.95, 0.010, baseHue);
        var surfaceRaisedLight = oklchToSrgb(1.00, 0.002, baseHue);
        var textLight = oklchToSrgb(0.14, 0.015, baseHue);
        var textMutedLight = oklchToSrgb(0.45, 0.020, baseHue);
        var borderLight = oklchToSrgb(0.86, 0.012, baseHue);

        // Dark mode semantic roles
        var bgDark = oklchToSrgb(0.12, 0.015, baseHue);
        var surfaceDark = oklchToSrgb(0.18, 0.020, baseHue);
        var surfaceRaisedDark = oklchToSrgb(0.24, 0.025, baseHue);
        var textDark = oklchToSrgb(0.94, 0.008, baseHue);
        var textMutedDark = oklchToSrgb(0.68, 0.018, baseHue);
        var borderDark = oklchToSrgb(0.28, 0.020, baseHue);

        var hexFromRgb = function(c) {
            return "#" + ((1 << 24) + (c.r << 16) + (c.g << 8) + c.b).toString(16).slice(1).toUpperCase();
        };

        return {
            primary: primaryScale,
            accent: accentScale,
            complement: complScale,
            success: successScale,
            warning: warningScale,
            danger: dangerScale,
            info: infoScale,
            modes: {
                light: {
                    bg: hexFromRgb(bgLight),
                    surface: hexFromRgb(surfaceLight),
                    surfaceRaised: hexFromRgb(surfaceRaisedLight),
                    text: hexFromRgb(textLight),
                    textMuted: hexFromRgb(textMutedLight),
                    border: hexFromRgb(borderLight),
                    primary: hexFromRgb(primaryScale[500] ? primaryScale[500] : priRgb),
                    accent: hexFromRgb(accentScale[500] ? accentScale[500] : secRgbActual),
                    success: hexFromRgb(successScale[500] ? successScale[500] : successRgb),
                    warning: hexFromRgb(warningScale[500] ? warningScale[500] : warningRgb),
                    danger: hexFromRgb(dangerScale[500] ? dangerScale[500] : dangerRgb)
                },
                dark: {
                    bg: hexFromRgb(bgDark),
                    surface: hexFromRgb(surfaceDark),
                    surfaceRaised: hexFromRgb(surfaceRaisedDark),
                    text: hexFromRgb(textDark),
                    textMuted: hexFromRgb(textMutedDark),
                    border: hexFromRgb(borderDark),
                    primary: hexFromRgb(primaryScale[400] ? primaryScale[400] : priRgb),
                    accent: hexFromRgb(accentScale[400] ? accentScale[400] : secRgbActual),
                    success: hexFromRgb(successScale[400] ? successScale[400] : successRgb),
                    warning: hexFromRgb(warningScale[400] ? warningScale[400] : warningRgb),
                    danger: hexFromRgb(dangerScale[400] ? dangerScale[400] : dangerRgb)
                }
            }
        };
    }

    function formatCssVariables(tokens, typography) {
        var out = ":root {\n";
        out += "  /* === Color Scales (50-950) === */\n";
        var scales = ["primary", "accent", "success", "warning", "danger", "info"];
        for (var s = 0; s < scales.length; s++) {
            var name = scales[s];
            var scale = tokens[name];
            if (scale) {
                for (var step in scale) {
                    out += "  --color-" + name + "-" + step + ": " + scale[step].hex + ";\n";
                }
            }
        }

        out += "\n  /* === Semantic Roles (Light Default) === */\n";
        var light = tokens.modes.light;
        for (var role in light) {
            out += "  --color-" + role + ": " + light[role] + ";\n";
        }

        if (typography) {
            out += "\n  /* === Typography Tokens & Fluid Scale === */\n";
            out += "  --font-heading: " + (typography.heading || "sans-serif") + ";\n";
            out += "  --font-body: " + (typography.body || "sans-serif") + ";\n";
            out += "  --font-weight-heading: " + (typography.weightHeading || "700") + ";\n";
            out += "  --letter-spacing-heading: " + (typography.letterSpacing || "-0.025em") + ";\n";
            out += "  --letter-spacing-body: 0em;\n";
            out += "  --letter-spacing-caps: 0.08em;\n";
            out += "  --line-height-heading: " + (typography.lineHeightHeading || "1.2") + ";\n";
            out += "  --line-height-body: " + (typography.lineHeight || "1.6") + ";\n";
            out += "  --type-scale-ratio: " + (typography.scale || "1.25") + ";\n";
            out += "  --font-size-h1: clamp(2.2rem, 1.8rem + 2vw, 3.8rem);\n";
            out += "  --font-size-h2: clamp(1.75rem, 1.5rem + 1.2vw, 2.5rem);\n";
            out += "  --font-size-h3: clamp(1.35rem, 1.25rem + 0.6vw, 1.8rem);\n";
            out += "  --font-size-body: clamp(0.95rem, 0.9rem + 0.25vw, 1.125rem);\n";
            out += "  --font-size-caption: clamp(0.75rem, 0.72rem + 0.15vw, 0.875rem);\n";
            out += "  --content-max-width: 65ch;\n";
        }
        out += "}\n\n";

        out += "/* === Dark Theme === */\n";
        out += "[data-theme=\"dark\"], .dark {\n";
        var dark = tokens.modes.dark;
        for (var dRole in dark) {
            out += "  --color-" + dRole + ": " + dark[dRole] + ";\n";
        }
        out += "}\n";

        return out;
    }

    function formatTailwindConfig(tokens, typography) {
        var extractScale = function(scale) {
            var obj = {};
            if (!scale) return obj;
            for (var step in scale) {
                obj[step] = scale[step].hex;
            }
            if (scale[500]) obj["DEFAULT"] = scale[500].hex;
            return obj;
        };

        var config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        primary: extractScale(tokens.primary),
                        accent: extractScale(tokens.accent),
                        success: extractScale(tokens.success),
                        warning: extractScale(tokens.warning),
                        danger: extractScale(tokens.danger),
                        info: extractScale(tokens.info),
                        bg: "var(--color-bg)",
                        surface: "var(--color-surface)",
                        "surface-raised": "var(--color-surfaceRaised)",
                        text: "var(--color-text)",
                        "text-muted": "var(--color-textMuted)",
                        border: "var(--color-border)"
                    },
                    fontFamily: {
                        heading: [(typography && typography.heading) ? typography.heading.replace(/['"]/g, '').split(',')[0].trim() : "sans-serif", "sans-serif"],
                        body: [(typography && typography.body) ? typography.body.replace(/['"]/g, '').split(',')[0].trim() : "sans-serif", "sans-serif"]
                    }
                }
            }
        };

        return "/** @type {import('tailwindcss').Config} */\nmodule.exports = " + JSON.stringify(config, null, 2) + ";\n";
    }

    function formatDtcgTokens(tokens, typography) {
        var dtcg = {
            "$schema": "https://design-tokens.github.io/community-group/format/",
            "color": {
                "primary": {},
                "accent": {},
                "success": {},
                "warning": {},
                "danger": {},
                "semantic": {
                    "bg": {
                        "light": { "$value": tokens.modes.light.bg, "$type": "color" },
                        "dark": { "$value": tokens.modes.dark.bg, "$type": "color" }
                    },
                    "surface": {
                        "light": { "$value": tokens.modes.light.surface, "$type": "color" },
                        "dark": { "$value": tokens.modes.dark.surface, "$type": "color" }
                    },
                    "text": {
                        "light": { "$value": tokens.modes.light.text, "$type": "color" },
                        "dark": { "$value": tokens.modes.dark.text, "$type": "color" }
                    },
                    "text-muted": {
                        "light": { "$value": tokens.modes.light.textMuted, "$type": "color" },
                        "dark": { "$value": tokens.modes.dark.textMuted, "$type": "color" }
                    },
                    "border": {
                        "light": { "$value": tokens.modes.light.border, "$type": "color" },
                        "dark": { "$value": tokens.modes.dark.border, "$type": "color" }
                    }
                }
            }
        };

        var addScale = function(name, scaleObj) {
            for (var step in scaleObj) {
                dtcg.color[name][step] = {
                    "$value": scaleObj[step].hex,
                    "$type": "color",
                    "$description": "OKLCH L=" + scaleObj[step].L.toFixed(2) + " C=" + scaleObj[step].C.toFixed(3) + " H=" + scaleObj[step].H.toFixed(0)
                };
            }
        };
        addScale("primary", tokens.primary);
        addScale("accent", tokens.accent);
        addScale("success", tokens.success);
        addScale("warning", tokens.warning);
        addScale("danger", tokens.danger);

        if (typography) {
            dtcg.typography = {
                "fontFamily": {
                    "heading": { "$value": typography.heading, "$type": "fontFamily" },
                    "body": { "$value": typography.body, "$type": "fontFamily" }
                },
                "letterSpacing": {
                    "heading": { "$value": typography.letterSpacing || "-0.025em", "$type": "dimension" },
                    "body": { "$value": "0em", "$type": "dimension" }
                },
                "lineHeight": {
                    "heading": { "$value": typography.lineHeightHeading || "1.2", "$type": "number" },
                    "body": { "$value": typography.lineHeight || "1.6", "$type": "number" }
                }
            };
        }

        return JSON.stringify(dtcg, null, 2);
    }

    function formatFigmaTokens(tokens, typography) {
        var figma = {
            "version": "1.0.0",
            "collections": [
                {
                    "name": "Semantic Colors",
                    "modes": ["Light", "Dark"],
                    "variables": [
                        { "name": "color/bg", "type": "COLOR", "values": { "Light": tokens.modes.light.bg, "Dark": tokens.modes.dark.bg } },
                        { "name": "color/surface", "type": "COLOR", "values": { "Light": tokens.modes.light.surface, "Dark": tokens.modes.dark.surface } },
                        { "name": "color/surface-raised", "type": "COLOR", "values": { "Light": tokens.modes.light.surfaceRaised, "Dark": tokens.modes.dark.surfaceRaised } },
                        { "name": "color/text", "type": "COLOR", "values": { "Light": tokens.modes.light.text, "Dark": tokens.modes.dark.text } },
                        { "name": "color/text-muted", "type": "COLOR", "values": { "Light": tokens.modes.light.textMuted, "Dark": tokens.modes.dark.textMuted } },
                        { "name": "color/border", "type": "COLOR", "values": { "Light": tokens.modes.light.border, "Dark": tokens.modes.dark.border } },
                        { "name": "color/primary", "type": "COLOR", "values": { "Light": tokens.modes.light.primary, "Dark": tokens.modes.dark.primary } },
                        { "name": "color/accent", "type": "COLOR", "values": { "Light": tokens.modes.light.accent, "Dark": tokens.modes.dark.accent } },
                        { "name": "color/success", "type": "COLOR", "values": { "Light": tokens.modes.light.success, "Dark": tokens.modes.dark.success } },
                        { "name": "color/warning", "type": "COLOR", "values": { "Light": tokens.modes.light.warning, "Dark": tokens.modes.dark.warning } },
                        { "name": "color/danger", "type": "COLOR", "values": { "Light": tokens.modes.light.danger, "Dark": tokens.modes.dark.danger } }
                    ]
                }
            ]
        };
        return JSON.stringify(figma, null, 2);
    }

    // Comprehensive OKLCH Profiles Dictionary (22 profiles with [L, C] perceptual curves)
    var OKLCH_PROFILES = {
        saas: {
            id: "saas",
            name: "SaaS & Cloud Platform",
            category: "ui",
            hues: [220, 235, 250, 265, 175, 195],
            models: ["analogcompl", "monocompl", "triad"],
            angle: [24, 34],
            curve: [[0.56, 0.16], [0.95, 0.03], [0.72, 0.10], [0.22, 0.04], [0.99, 0.005]],
            typoCategory: "ui"
        },
        minimal: {
            id: "minimal",
            name: "Swiss Minimal & Bauhaus",
            category: "ui",
            hues: [30, 210, 355, 45, 150],
            models: ["mono", "monocompl"],
            angle: [25, 35],
            curve: [[0.50, 0.08], [0.96, 0.01], [0.78, 0.03], [0.18, 0.02], [0.99, 0.002]],
            typoCategory: "ui"
        },
        cyberpunk: {
            id: "cyberpunk",
            name: "Cyberpunk Neon 2077",
            category: "game",
            hues: [195, 325, 140, 60],
            models: ["triad", "analogcompl"],
            angle: [30, 50],
            curve: [[0.72, 0.25], [0.86, 0.18], [0.60, 0.22], [0.16, 0.06], [0.08, 0.03]],
            typoCategory: "game"
        },
        darkui: {
            id: "darkui",
            name: "Modern Dark Mode",
            category: "ui",
            hues: [215, 240, 275, 310, 180],
            models: ["monocompl", "analogcompl", "triadcompl"],
            angle: [25, 40],
            curve: [[0.65, 0.17], [0.82, 0.08], [0.50, 0.12], [0.20, 0.03], [0.11, 0.015]],
            typoCategory: "ui"
        },
        luxury: {
            id: "luxury",
            name: "Luxury & High Jewelry",
            category: "editorial",
            hues: [75, 82, 350, 240],
            models: ["monocompl", "triadcompl"],
            angle: [28, 42],
            curve: [[0.68, 0.12], [0.95, 0.02], [0.52, 0.10], [0.18, 0.03], [0.98, 0.008]],
            typoCategory: "editorial"
        },
        nature: {
            id: "nature",
            name: "Organic Botanical",
            category: "ui",
            hues: [135, 145, 155, 65, 80],
            models: ["analogcompl", "analog", "triad"],
            angle: [25, 35],
            curve: [[0.55, 0.11], [0.94, 0.025], [0.70, 0.08], [0.24, 0.04], [0.98, 0.008]],
            typoCategory: "ui"
        },
        playful: {
            id: "playful",
            name: "Playful & EdTech",
            category: "ui",
            hues: [45, 140, 240, 340],
            models: ["triad", "tetrad"],
            angle: [30, 48],
            curve: [[0.65, 0.22], [0.93, 0.06], [0.75, 0.18], [0.25, 0.08], [0.98, 0.015]],
            typoCategory: "ui"
        },
        pastel: {
            id: "pastel",
            name: "Soft Pastel Calm",
            category: "ui",
            hues: [195, 260, 330, 140],
            models: ["triad", "analogcompl", "mono"],
            angle: [25, 35],
            curve: [[0.82, 0.07], [0.96, 0.02], [0.88, 0.05], [0.35, 0.04], [0.99, 0.005]],
            typoCategory: "ui"
        },
        monochrome: {
            id: "monochrome",
            name: "Pure Monochromatic",
            category: "ui",
            hues: [220],
            models: ["mono"],
            angle: [30, 30],
            curve: [[0.50, 0.01], [0.95, 0.002], [0.75, 0.005], [0.22, 0.005], [0.99, 0.001]],
            typoCategory: "ui"
        },
        earth: {
            id: "earth",
            name: "Warm Earth & Terracotta",
            category: "ui",
            hues: [45, 60, 75, 85],
            models: ["analogcompl", "triad"],
            angle: [25, 38],
            curve: [[0.52, 0.09], [0.93, 0.03], [0.68, 0.07], [0.22, 0.03], [0.98, 0.01]],
            typoCategory: "ui"
        },
        ocean: {
            id: "ocean",
            name: "Deep Ocean & Aqua",
            category: "ui",
            hues: [190, 210, 230, 245],
            models: ["analog", "analogcompl"],
            angle: [25, 35],
            curve: [[0.55, 0.14], [0.94, 0.03], [0.72, 0.10], [0.20, 0.05], [0.98, 0.008]],
            typoCategory: "ui"
        },
        sunset: {
            id: "sunset",
            name: "Sunset Gradient",
            category: "ui",
            hues: [25, 45, 70, 320, 340],
            models: ["analogcompl", "triad"],
            angle: [28, 44],
            curve: [[0.62, 0.19], [0.94, 0.04], [0.74, 0.14], [0.22, 0.06], [0.98, 0.01]],
            typoCategory: "ui"
        },
        neutral_accent: {
            id: "neutral_accent",
            name: "Neutral Gray with Vibrant Accent",
            category: "ui",
            hues: [25, 140, 220, 280, 340],
            models: ["monocompl"],
            angle: [30, 30],
            curve: [[0.60, 0.20], [0.95, 0.005], [0.80, 0.01], [0.20, 0.01], [0.99, 0.002]],
            typoCategory: "ui"
        },
        editorial: {
            id: "editorial",
            name: "High Editorial Magazine",
            category: "editorial",
            hues: [30, 45, 140, 220, 350],
            models: ["analogcompl", "triad"],
            angle: [26, 40],
            curve: [[0.48, 0.11], [0.95, 0.015], [0.70, 0.08], [0.18, 0.025], [0.98, 0.005]],
            typoCategory: "editorial"
        },
        retro: {
            id: "retro",
            name: "Retro Synth & 70s Warmth",
            category: "editorial",
            hues: [45, 75, 145, 195],
            models: ["triad", "tetrad"],
            angle: [30, 46],
            curve: [[0.58, 0.13], [0.92, 0.04], [0.72, 0.10], [0.26, 0.05], [0.97, 0.02]],
            typoCategory: "editorial"
        },
        game_rpg: {
            id: "game_rpg",
            name: "Dark Fantasy RPG (Elden/Witcher)",
            category: "game",
            hues: [75, 30, 355, 275],
            models: ["triadcompl", "analogcompl", "tetrad"],
            angle: [26, 40],
            curve: [[0.65, 0.15], [0.92, 0.03], [0.48, 0.12], [0.18, 0.04], [0.08, 0.02]],
            typoCategory: "game"
        },
        game_cyberpunk: {
            id: "game_cyberpunk",
            name: "Sci-Fi HUD & Hologram",
            category: "game",
            hues: [195, 325, 140, 95],
            models: ["triad", "analogcompl", "tetrad"],
            angle: [32, 54],
            curve: [[0.74, 0.26], [0.88, 0.18], [0.60, 0.22], [0.15, 0.08], [0.06, 0.03]],
            typoCategory: "game"
        },
        game_arcade: {
            id: "game_arcade",
            name: "8-Bit Retro Arcade (NES/Famicom)",
            category: "game",
            hues: [30, 140, 230, 350],
            models: ["triad", "tetrad"],
            angle: [35, 55],
            curve: [[0.68, 0.24], [0.90, 0.12], [0.76, 0.20], [0.22, 0.10], [0.98, 0.01]],
            typoCategory: "game"
        },
        game_fps: {
            id: "game_fps",
            name: "Tactical Military FPS (CoD/Arma)",
            category: "game",
            hues: [115, 75, 50, 215],
            models: ["monocompl", "analogcompl"],
            angle: [24, 34],
            curve: [[0.48, 0.09], [0.88, 0.03], [0.62, 0.07], [0.20, 0.03], [0.10, 0.02]],
            typoCategory: "game"
        },
        game_horror: {
            id: "game_horror",
            name: "Survival Horror (Resident Evil)",
            category: "game",
            hues: [25, 355, 175, 270],
            models: ["monocompl", "triad"],
            angle: [25, 42],
            curve: [[0.42, 0.14], [0.75, 0.05], [0.35, 0.10], [0.14, 0.03], [0.05, 0.015]],
            typoCategory: "game"
        },
        game_cozy: {
            id: "game_cozy",
            name: "Cozy / Casual Mobile (Animal Crossing)",
            category: "game",
            hues: [340, 65, 150, 205],
            models: ["triad", "tetrad", "analogcompl"],
            angle: [28, 48],
            curve: [[0.72, 0.17], [0.94, 0.05], [0.82, 0.13], [0.32, 0.06], [0.99, 0.01]],
            typoCategory: "game"
        },
        game_esports: {
            id: "game_esports",
            name: "Esports Arena (Apex/Valorant)",
            category: "game",
            hues: [85, 355, 200, 275],
            models: ["monocompl", "triad"],
            angle: [34, 52],
            curve: [[0.70, 0.25], [0.88, 0.15], [0.55, 0.20], [0.16, 0.06], [0.07, 0.025]],
            typoCategory: "game"
        },
        game_space: {
            id: "game_space",
            name: "Deep Space Sci-Fi (EVE/Starfield)",
            category: "game",
            hues: [190, 280, 45, 230],
            models: ["analogcompl", "triadcompl"],
            angle: [28, 46],
            curve: [[0.62, 0.18], [0.86, 0.10], [0.50, 0.15], [0.16, 0.05], [0.07, 0.02]],
            typoCategory: "game"
        }
    };

    return {
        srgbToLinear: srgbToLinear,
        linearToSrgb: linearToSrgb,
        srgbToOklab: srgbToOklab,
        oklabToOklch: oklabToOklch,
        oklchToOklab: oklchToOklab,
        srgbToOklch: srgbToOklch,
        oklchToSrgb: oklchToSrgb,
        formatCssOklch: formatCssOklch,
        generateTonalScale: generateTonalScale,
        calcAPCA: calcAPCA,
        getRelativeLuminance: getRelativeLuminance,
        calcWcagContrast: calcWcagContrast,
        simulateColorBlindness: simulateColorBlindness,
        interpolateOklab: interpolateOklab,
        parseCssColor: parseCssColor,
        rgbToHsl: rgbToHsl,
        formatColorString: formatColorString,
        formatHexColor: formatHexColor,
        TONAL_STEPS: TONAL_STEPS,
        TONAL_LIGHTNESS: TONAL_LIGHTNESS,
        mulberry32: mulberry32,
        stringToSeed: stringToSeed,
        generateSeed: generateSeed,
        randomGaussian: randomGaussian,
        fitContrast: fitContrast,
        fitContrastApca: fitContrastApca,
        auditSemanticContrast: auditSemanticContrast,
        deltaEOk: deltaEOk,
        cvdDeltaEOk: cvdDeltaEOk,
        scorePaletteCandidate: scorePaletteCandidate,
        generateSemanticTokens: generateSemanticTokens,
        formatCssVariables: formatCssVariables,
        formatTailwindConfig: formatTailwindConfig,
        formatDtcgTokens: formatDtcgTokens,
        formatFigmaTokens: formatFigmaTokens,
        OKLCH_PROFILES: OKLCH_PROFILES
    };
});

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
                }, r.prototype.getConverted = function(e, t) {
                    return e(this, t)
                }, r
            }(), r
        })
    }.call(this),
    function() {
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
        })
    }.call(this),
    function() {
        define("color.presets", ["util"], function(e) {
            var t, n, r, i, s;
            i = {
                "pale-light": {
                    val: [
                        [.24649, 1.78676],
                        [.09956, 1.95603],
                        [.17209, 1.88583],
                        [.32122, 1.65929],
                        [.39549, 1.50186]
                    ]
                },
                "pastels-bright": {
                    val: [
                        [.65667, 1.86024],
                        [.04738, 1.99142],
                        [.39536, 1.89478],
                        [.90297, 1.85419],
                        [1.86422, 1.8314]
                    ]
                },
                shiny: {
                    val: [
                        [1.00926, 2],
                        [.3587, 2],
                        [.5609, 2],
                        [2, .8502],
                        [2, .65438]
                    ]
                },
                "pastels-lightest": {
                    val: [
                        [.34088, 1.09786],
                        [.13417, 1.62645],
                        [.23137, 1.38072],
                        [.45993, .92696],
                        [.58431, .81098]
                    ]
                },
                "pastels-very-light": {
                    val: [
                        [.58181, 1.32382],
                        [.27125, 1.81913],
                        [.44103, 1.59111],
                        [.70192, 1.02722],
                        [.84207, .91425]
                    ]
                },
                full: {
                    val: [
                        [1, 1],
                        [.61056, 1.24992],
                        [.77653, 1.05996],
                        [1.06489, .77234],
                        [1.25783, .60685]
                    ]
                },
                "pastels-light": {
                    val: [
                        [.37045, .90707],
                        [.15557, 1.28367],
                        [.25644, 1.00735],
                        [.49686, .809],
                        [.64701, .69855]
                    ]
                },
                "pastels-med": {
                    val: [
                        [.66333, .8267],
                        [.36107, 1.30435],
                        [.52846, .95991],
                        [.78722, .70882],
                        [.91265, .5616]
                    ]
                },
                darker: {
                    val: [
                        [.93741, .68672],
                        [.68147, .88956],
                        [.86714, .82989],
                        [1.12072, .5673],
                        [1.44641, .42034]
                    ]
                },
                "pastels-mid-pale": {
                    val: [
                        [.38302, .68001],
                        [.15521, .98457],
                        [.26994, .81586],
                        [.46705, .54194],
                        [.64065, .44875]
                    ]
                },
                pastels: {
                    val: [
                        [.66667, .66667],
                        [.33333, 1],
                        [.5, .83333],
                        [.83333, .5],
                        [1, .33333]
                    ]
                },
                "dark-neon": {
                    val: [
                        [.94645, .59068],
                        [.99347, .91968],
                        [.93954, .7292],
                        [1.01481, .41313],
                        [1.04535, .24368]
                    ]
                },
                "pastels-dark": {
                    val: [
                        [.36687, .39819],
                        [.25044, .65561],
                        [.319, .54623],
                        [.55984, .37953],
                        [.70913, .3436]
                    ]
                },
                "pastels-very-dark": {
                    val: [
                        [.60117, .41845],
                        [.36899, .59144],
                        [.42329, .44436],
                        [.72826, .35958],
                        [.88393, .27004]
                    ]
                },
                dark: {
                    val: [
                        [1.31883, .40212],
                        [.9768, .25402],
                        [1.27265, .30941],
                        [1.21289, .60821],
                        [1.29837, .82751]
                    ]
                },
                "pastels-mid-dark": {
                    val: [
                        [.26952, .22044],
                        [.23405, .52735],
                        [.23104, .37616],
                        [.42324, .20502],
                        [.54424, .18483]
                    ]
                },
                "pastels-darkest": {
                    val: [
                        [.53019, .23973],
                        [.48102, .50306],
                        [.50001, .36755],
                        [.6643, .32778],
                        [.77714, .3761]
                    ]
                },
                darkest: {
                    val: [
                        [1.46455, .21042],
                        [.99797, .16373],
                        [.96326, .274],
                        [1.56924, .45022],
                        [1.23016, .66]
                    ]
                },
                "almost black": {
                    val: [
                        [.12194, .15399],
                        [.34224, .50742],
                        [.24211, .34429],
                        [.31846, .24986],
                        [.52251, .33869]
                    ]
                },
                "almost-gray-dark": {
                    val: [
                        [.10266, .24053],
                        [.13577, .39387],
                        [.11716, .30603],
                        [.14993, .22462],
                        [.29809, .19255]
                    ]
                },
                "almost-gray-darker": {
                    val: [
                        [.07336, .36815],
                        [.18061, .50026],
                        [.09777, .314],
                        [.12238, .25831],
                        [.14388, .1883]
                    ]
                },
                "almost-gray-mid": {
                    val: [
                        [.07291, .59958],
                        [.19602, .74092],
                        [.10876, .5366],
                        [.15632, .48229],
                        [.20323, .42268]
                    ]
                },
                "almost-gray-lighter": {
                    val: [
                        [.06074, .82834],
                        [.14546, .97794],
                        [.10798, .76459],
                        [.15939, .68697],
                        [.22171, .62926]
                    ]
                },
                "almost-gray-light": {
                    val: [
                        [.03501, 1.59439],
                        [.23204, 1.10483],
                        [.14935, 1.33784],
                        [.07371, 1.04897],
                        [.09635, .91368]
                    ]
                }
            }, r = [];
            for (t in i) n = i[t], r.push(t);
            return s = {
                presetList: i,
                getPresetCount: function() {
                    return r.length
                },
                getPresetId: function(e) {
                    return r[e]
                }
            }, s
        })
    }.call(this),
    function() {
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
                }, e.prototype.getAPCA = function(bg) {
                    return this.rgb.getAPCA(bg)
                }, e.prototype.getContrast = function(other) {
                    return this.rgb.getContrast(other && other.rgb ? other.rgb : other)
                }, e.prototype.getConverted = function(e, t) {
                    return this.rgb.getConverted(e, t)
                }, e
            }(), i
        })
    }.call(this),
    function() {
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
        })
    }.call(this),
    function() {
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
        })
    }.call(this),
    function() {
        define("lib.point.follower", [], function() {
            var e, t, n;
            return t = function() {
                function t(e, t) {
                    this.x = Math.max(-1, Math.min(1, e)), this.y = Math.max(-1, Math.min(1, t))
                }
                return t.prototype.toDef = function() {
                    var t, n, r, i, s;
                    return r = this.rot_z(Math.PI / 4), r.x < 1 ? (t = r.y / Math.sqrt(1 - r.x * r.x), t = Math.max(-1, Math.min(1, t)), i = Math.asin(t)) : i = 0, r.y < 1 ? (n = r.x, n = Math.max(-1, Math.min(1, n)), s = Math.asin(n)) : s = 0, new e(s, i)
                }, t.prototype.rot_z = function(e) {
                    return new t(this.x * Math.cos(e) + this.y * Math.sin(e), -this.x * Math.sin(e) + this.y * Math.cos(e))
                }, t
            }(), e = function() {
                function e(e, t) {
                    this.psi = e, this.phi = t
                }
                return e.prototype.toLoc = function() {
                    var e, n, r, i, s;
                    return r = Math.min(Math.max(this.psi, -Math.PI / 2), Math.PI / 2), n = Math.min(Math.max(this.phi, -Math.PI / 2), Math.PI / 2), i = Math.sin(r), s = Math.sin(n) * Math.cos(r), e = new t(i, s), e.rot_z(-Math.PI / 4)
                }, e.prototype.rot_x = function(t) {
                    var n, r;
                    return n = Math.cos(this.psi), r = n ? (this.phi / n + t) * n : this.phi, new e(this.psi, r)
                }, e.prototype.rot_y = function(t) {
                    return new e(this.psi + t, this.phi)
                }, e
            }(), n = {
                createLoc: function(e, n) {
                    return new t(e, n)
                },
                createDef: function(t, n) {
                    return new e(t, n)
                },
                getLoc: function(e, t) {
                    return t.rot_x(e.toDef().phi).rot_y(e.toDef().psi).toLoc()
                },
                getDef: function(e, t) {
                    return t.toDef().rot_y(-e.toDef().psi).rot_x(-e.toDef().phi)
                }
            }, n
        })
    }.call(this),
    function() {
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
        })
    }.call(this),
    function() {
        define("color.convert", ["color.rgb.class", "util"], function(e, t) {
            var n, r;
            return n = {
                protanope: {
                    x: .7465,
                    y: .2535,
                    m: 1.273463,
                    yint: -0.073894
                },
                deuteranope: {
                    x: 1.4,
                    y: -0.4,
                    m: .968437,
                    yint: .003331
                },
                tritanope: {
                    x: .1748,
                    y: 0,
                    m: .062921,
                    yint: .292119
                }
            }, r = {
                convert: function(r, i) {
                    var s, o, u, a, f, l, c, h, p, d, v, m, g, y, b, w, E, S, x, T, N, C, k, L, A, O, M, _, D, P, H, B, j, F, I, q, R, U, z, W;
                    return g = {
                        type: "none",
                        amount: 1
                    }, B = t.objMerge(g, i), z = B.type, f = B.amount, f > 1 && (f = 1), f < 0 && (f = 0), U = r.r, R = r.g, q = r.b, C = U, w = C, m = C, z === "webcolor" ? (C = Math.round(U / 51) * 51, w = Math.round(R / 51) * 51, m = Math.round(q / 51) * 51, new e(C, w, m)) : z === "gamma" ? (O = f * 3, C = 255 * Math.pow(U / 255, O), w = 255 * Math.pow(R / 255, O), m = 255 * Math.pow(q / 255, O), new e(C >> 0, w >> 0, m >> 0)) : z === "gray" ? (_ = Math.round(r.getLum() * 255), C = U * (1 - f) + _ * f, w = R * (1 - f) + _ * f, m = q * (1 - f) + _ * f, new e(C >> 0, w >> 0, m >> 0)) : z === "achromatope" ? (C = U * .212656 + R * .715158 + q * .072186, C = U * (1 - f) + C * f, w = R * (1 - f) + C * f, m = q * (1 - f) + C * f, new e(C >> 0, w >> 0, m >> 0)) : (z === "custom" ? (p = B.x, d = B.y, h = B.m, v = B.yint) : (M = n[B.type]) ? (p = M.x, d = M.y, h = M.m, v = M.yint) : z = "none", B.type === "none" ? r : (U === 0 && R === 0 && q === 0 ? new e(0, 0, 0) : (I = Math.pow(U, 2.2), F = Math.pow(R, 2.2), j = Math.pow(q, 2.2), s = I * .412424 + F * .357579 + j * .180464, o = I * .212656 + F * .715158 + j * .0721856, u = I * .0193324 + F * .119193 + j * .950444, l = s / (s + o + u), c = o / (s + o + u), D = (c - d) / (l - p), W = c - l * D, y = (v - W) / (D - h), b = D * y + W, s = y * o / b, u = (1 - (y + b)) * o / b, P = .312713 * o / .329016, H = .358271 * o / .329016, E = P - s, S = H - u, N = E * 3.24071 + S * -0.498571, T = E * -0.969258 + S * .0415557, x = E * .0556352 + S * 1.05707, C = s * 3.24071 + o * -1.53726 + u * -0.498571, w = s * -0.969258 + o * 1.87599 + u * .0415557, m = s * .0556352 + o * -0.203996 + u * 1.05707, A = ((C < 0 ? 0 : 1) - C) / N, L = ((w < 0 ? 0 : 1) - w) / T, k = ((m < 0 ? 0 : 1) - m) / x, a = Math.max(A > 1 || A < 0 ? 0 : A, L > 1 || L < 0 ? 0 : L, k > 1 || k < 0 ? 0 : k), C += a * N, w += a * T, m += a * x, C = Math.pow(Math.max(0, C), 1 / 2.2), w = Math.pow(Math.max(0, w), 1 / 2.2), m = Math.pow(Math.max(0, m), 1 / 2.2), C = U * (1 - f) + C * f, w = R * (1 - f) + w * f, m = q * (1 - f) + m * f, new e(C >> 0, w >> 0, m >> 0))))
                }
            }, r
        })
    }.call(this),
    function() {
        define("ui.control.palette.class", ["app.events", "util", "color.oklch", "app.locale"], function(events, util, oklch, lang) {
    var PaletteControl;

    function getCopyFormat() {
        try {
            return localStorage.getItem("pal_copy_format") || "hex";
        } catch(err) {
            return "hex";
        }
    }

    function setCopyFormat(fmt) {
        try {
            localStorage.setItem("pal_copy_format", fmt);
        } catch(err) {}
        if (window._Paletton) window._Paletton.copyFormat = fmt;
        events.trigger("palette/copyformat/changed", { format: fmt });
    }

    function copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).catch(function(){});
        } else {
            var ta = document.createElement("textarea");
            ta.value = text;
            ta.style.position = "fixed";
            ta.style.opacity = "0";
            document.body.appendChild(ta);
            ta.select();
            try { document.execCommand("copy"); } catch(err) {}
            document.body.removeChild(ta);
        }
    }

    function showToast(text) {
        var $toast = $(".global-copy-toast");
        if (!$toast.length) {
            $toast = $("<div>", { "class": "global-copy-toast" });
            $("body").append($toast);
        }
        $toast.text(text).addClass("visible");
        clearTimeout(window._globalCopyToastTimer);
        window._globalCopyToastTimer = setTimeout(function() {
            $toast.removeClass("visible");
        }, 1500);
    }

    // Expose helpers globally
    if (typeof window !== "undefined") {
        window._palCopyColor = function(hex) {
            var fmt = getCopyFormat();
            var val = oklch.formatHexColor(hex, fmt);
            copyToClipboard(val);
            var prefix = (lang ? lang("palette.copied") : "Copied") || "Copied";
            showToast(prefix + ": " + val);
            return val;
        };
        window._palGetCopyFormat = getCopyFormat;
        window._palSetCopyFormat = setCopyFormat;
        window._palShowToast = showToast;
    }

    PaletteControl = function() {
        function PaletteControl(pal, $container, opts) {
            var defaultOpts, self;
            this.palette = pal;
            this.$container = $container;
            defaultOpts = {
                className: "",
                asStatic: !1
            };
            this.options = util.objMerge(defaultOpts, opts);
            self = this;
            if (!this.options.asStatic) {
                events.register("palette/colors/changed", function() {
                    return self.colorize();
                });
                events.register("palette/model/changed", function() {
                    return self.draw();
                });
                events.register("palette/copyformat/changed", function(e, data) {
                    self.updateTooltips();
                });
            }
            this.draw();
        }

        PaletteControl.prototype.updateTooltips = function() {
            if (!this.$e) return;
            var fmt = getCopyFormat().toUpperCase();
            this.$e.find("td[col-data], span[col-data]").each(function() {
                var $sw = $(this);
                var hex = $sw.attr("col-data") || "";
                if (hex) {
                    var formatted = oklch.formatHexColor(hex, fmt.toLowerCase());
                    $sw.attr("title", formatted + " — Click to copy (" + fmt + ") • Shift+click for info");
                }
            });
        };

        PaletteControl.prototype.draw = function() {
            var $tbody, $table, $tr, self, buildColumn, colCount;
            self = this;
            this.$e = $("<DIV>", {
                "class": "control-palette " + this.options.className
            });
            this.$container.empty().append(this.$e);

            $table = $("<TABLE>");
            this.$e.append($table);
            $tbody = $("<TBODY>");
            $table.append($tbody);
            $tr = $("<TR>");
            $tbody.append($tr);

            function bindSwatch($el, grp, idx) {
                $el.css("cursor", "pointer");
                $el.on("click", function(ev) {
                    ev.stopPropagation();
                    var hex = $el.attr("col-data") || $el.prop("title") || "";
                    if (!hex && self.palette && self.palette.colorTable) {
                        try {
                            var tbl = self.options.asStatic ? self.palette.colorTable.sorted : self.palette.colorTable.byPalette;
                            if (tbl && tbl[grp] && tbl[grp][idx]) {
                                hex = tbl[grp][idx].getHex ? tbl[grp][idx].getHex() : "";
                            }
                        } catch(err) {}
                    }
                    if (!hex) return;

                    // Shift-click or Alt-click opens color info dialog
                    if (ev.shiftKey || ev.altKey) {
                        events.trigger("ui/preview/colinfo", { hex: hex });
                        return;
                    }

                    var fmt = getCopyFormat();
                    var val = oklch.formatHexColor(hex, fmt);
                    copyToClipboard(val);
                    var prefix = (lang ? lang("palette.copied") : "Copied") || "Copied";
                    showToast(prefix + ": " + val);

                    $el.addClass("swatch-copied-flash");
                    setTimeout(function() {
                        $el.removeClass("swatch-copied-flash");
                    }, 300);
                });

                $el.on("dblclick", function(ev) {
                    ev.stopPropagation();
                    var hex = $el.attr("col-data") || $el.prop("title") || "";
                    if (hex) {
                        events.trigger("ui/preview/colinfo", { hex: hex });
                    }
                });
            }

            buildColumn = function(grp) {
                var $varSpan, $td, colObj, stepIdx, stepCount, results;
                $td = $("<TD>", {
                    "class": "bgcol-" + grp + "-0"
                });
                if (self.options.asStatic) {
                    colObj = self.palette.colorTable.sorted[grp][0];
                    $td.css("background", colObj.getCSS());
                    $td.attr("col-data", colObj.getHex());
                }
                bindSwatch($td, grp, 0);
                $tr.append($td);

                results = [];
                for (stepIdx = stepCount = 1; stepCount <= 4; stepIdx = ++stepCount) {
                    $varSpan = $("<SPAN>", {
                        "class": "var var-" + stepIdx + " bgcol-" + grp + "-" + stepIdx
                    });
                    $td.append($varSpan);
                    if (self.options.asStatic) {
                        colObj = self.palette.colorTable.sorted[grp][stepIdx];
                        $varSpan.attr("col-data", colObj.getHex());
                        results.push($varSpan.css("background", colObj.getCSS()));
                    } else {
                        results.push(void 0);
                    }
                    bindSwatch($varSpan, grp, stepIdx);
                }
                return results;
            };

            buildColumn("pri");
            if (this.palette.hasSecs()) {
                buildColumn("sec1");
                buildColumn("sec2");
            }
            if (this.palette.hasCompl()) {
                buildColumn("compl");
            }

            colCount = this.palette.getColCnt();
            $tr.find(".bgcol-pri-0").addClass("span" + (5 - colCount));

            // If this is the main palette (big), add copy format pills selector
            if (this.options.className && this.options.className.indexOf("big") !== -1) {
                var $parentPane = this.$container.parent();
                if ($parentPane.length) {
                    $parentPane.find(".pane-palette-copyfmt").remove();
                    var $fmtBar = $("<div>", { "class": "pane pane-content pane-palette-copyfmt" });
                    var curFmt = getCopyFormat();
                    var formats = ["hex", "oklch", "rgb", "hsl"];

                    $.each(formats, function(idx, fmt) {
                        var $btn = $("<button>", {
                            type: "button",
                            "class": "copyfmt-btn" + (fmt === curFmt ? " active" : ""),
                            "data-fmt": fmt
                        }).text(fmt.toUpperCase());

                        $btn.on("click", function(ev) {
                            ev.stopPropagation();
                            $fmtBar.find(".copyfmt-btn").removeClass("active");
                            $btn.addClass("active");
                            setCopyFormat(fmt);
                            showToast("Format: " + fmt.toUpperCase());
                        });

                        $fmtBar.append($btn);
                    });

                    $parentPane.append($fmtBar);
                }
            }

            this.updateTooltips();
        };

        PaletteControl.prototype.colorize = function() {
            var res = events.trigger("palette/colorize", {
                $e: this.$e,
                sorted: !0,
                converted: !1
            });
            this.updateTooltips();
            return res;
        };

        return PaletteControl;
    }();

    return PaletteControl;
});
    }.call(this),
    function() {
        define("ui.control.dialog.class", ["util"], function(e) {
    var t;
    return t = function() {
        function t(t, n, r) {
            var i, s;
            this.$parent = t, i = {
                className: "",
                title: "",
                width: 300,
                height: "auto",
                modal: !0,
                draggable: !0,
                resizable: !1,
                autoOpen: !0,
                buttons: null,
                destroyOnClose: !0,
                onClose: null,
                position: {
                    my: "center",
                    at: "center",
                    of: this.$parent
                }
            };
            if (!this.$parent) return;
            s = this, this.options = e.objMerge(i, r), this.dlgInited = !1, this.$e = $("<DIV>", {
                "class": "control control-dlg " + this.options.className
            }), this.$parent.append(this.$e), this.$e.append(n), this.$e.dialog({
                dialogClass: this.options.className,
                title: this.options.title,
                modal: this.options.modal,
                width: this.options.width,
                height: this.options.height,
                draggable: this.options.draggable,
                resizable: this.options.resizable,
                autoOpen: this.options.autoOpen,
                buttons: this.options.buttons,
                position: this.options.position,
                close: function() {
                    var e;
                    typeof(e = s.options).onClose == "function" && e.onClose();
                    if (s.options.destroyOnClose) return $(this).dialog("destroy"), s.dlgInited = !1, s.$e.remove()
                }
            }), this.dlgInited = !0
        }
        return t.prototype.open = function() {
            if (this.dlgInited) return this.$e.dialog("open")
        }, t.prototype.close = function() {
            if (this.dlgInited) return this.$e.dialog("close")
        }, t
    }(), t
});
    }.call(this),
    function() {
        define("ui.control.paletteimg.class", ["app.events", "app.locale", "util", "ui.control.palette.class", "ui.control.dialog.class"], function(e, t, n, r, i) {
            var s;
            return s = function() {
                function e(e, r, s) {
                    var o, u, a, f, l;
                    this.palette = e, this.$parent = r, a = {
                        somethin: null
                    };
                    if (!this.$parent) return;
                    l = this, this.options = n.objMerge(a, s), o = $("<DIV>"), f = new i(this.$parent, o, {
                        className: "dlg-paletteimg",
                        title: t("palette.img.title"),
                        width: 450,
                        modal: !0,
                        position: {
                            my: "center",
                            at: "center",
                            of: this.$parent
                        }
                    }), u = function(e) {
                        var n, r, i, s, u, a, f, c, h, p, d;
                        return a = 4 * e, u = 3 * e, n = $("<CANVAS>", {
                            css: {
                                width: 4 * a + "px",
                                height: u + "px"
                            }
                        }), o.append(n), c = n.get(0), c.width = 4 * a, c.height = u, f = c.getContext("2d"), s = function(t, n, r) {
                            var i, s, o, c, h;
                            f.fillStyle = l.palette.getColorCode(t, 0, "sorted", !1), f.fillRect(n, 0, n + r * a, u), s = n, o = u - e, h = [];
                            for (i = c = 1; c <= 4; i = ++c) f.fillStyle = l.palette.getColorCode(t, i, "sorted", !1), f.fillRect(s, o, s + r * e, o + e), h.push(s += r * e);
                            return h
                        }, h = l.palette.getColCnt(), d = 0, s("pri", 0, 5 - h), d += (5 - h) * a, l.palette.hasSecs() && (s("sec1", d, 1), d += a, s("sec2", d, 1), d += a), l.palette.hasCompl() && s("compl", d, 1), p = c.toDataURL("image/png"), n.remove(), r = $("<P>"), o.append(r), r.html(t("palette.img.label") + " " + 4 * a + " &times; " + u + "<br>"), i = $("<IMG>", {
                            src: p,
                            width: 4 * a,
                            height: u,
                            css: {
                                cursor: "pointer"
                            }
                        }), r.append(i), i.click(function() {
                            return window.open(p)
                        })
                    }, u(25), u(16), u(8), u(4)
                }
                return e
            }(), s
        })
    }.call(this),
    function() {
        define("color.palette.class", ["app.ini", "app.events", "app.locale", "util", "color.wheel", "color.presets", "color.class", "color.models.class", "color.rgb.class", "color.hsv.class", "color.variator1.class", "color.convert", "ui.control.paletteimg.class", "color.oklch"], function(e, t, n, r, i, s, o, u, a, f, l, c, h, oklch) {
    var p, d, v, m;
    return m = {
        mono: 1,
        monocompl: 2,
        triad: 3,
        triadcompl: 4,
        analog: 5,
        analogcompl: 6,
        tetrad: 7,
        free: 10
    }, v = function(e) {
        var t, n;
        for (t in m) {
            n = m[t];
            if (n === e) return t
        }
        return "mono"
    },    d = {
        model: "mono",
        hue: 0,
        angle: 30,
        preset: "pastels"
    }, TYPOGRAPHY_PAIRS = [
        // ── Gaming & Game UI Category (9 Presets) ──
        {
            id: "game_retro_pixel",
            category: "game",
            profileMatch: ["game_arcade", "game_indie"],
            name: "👾 8-Bit Arcade (Press Start)",
            heading: "'Press Start 2P', 'VT323', 'Silkscreen', 'Courier New', monospace",
            headingCyrillic: "'Rubik Pixels', 'Silkscreen', 'Courier New', monospace",
            body: "'VT323', 'Silkscreen', 'Courier New', monospace",
            bodyCyrillic: "'Rubik Pixels', 'Courier New', monospace",
            weightHeading: "400",
            scale: "1.25",
            letterSpacing: "0.05em",
            lineHeightHeading: "1.5",
            lineHeight: "1.6",
            cyrillic: false
        },
        {
            id: "game_scifi_cyber",
            category: "game",
            profileMatch: ["cyberpunk", "game_scifi", "game_esports", "neon"],
            name: "🤖 Cyberpunk HUD (Orbitron)",
            heading: "'Orbitron', 'Audiowide', 'Michroma', 'Impact', sans-serif",
            headingCyrillic: "'Russo One', 'Exo 2', 'Unbounded', 'Impact', sans-serif",
            body: "'Rajdhani', 'Exo 2', -apple-system, sans-serif",
            bodyCyrillic: "'Exo 2', 'Raleway', -apple-system, sans-serif",
            weightHeading: "800",
            scale: "1.333",
            letterSpacing: "0.06em",
            lineHeightHeading: "1.15",
            lineHeight: "1.45",
            cyrillic: false
        },
        {
            id: "game_dark_fantasy",
            category: "game",
            profileMatch: ["dark_fantasy", "gothic", "game_horror"],
            name: "⚔️ Dark Fantasy RPG (Cinzel)",
            heading: "'Cinzel', 'Cinzel Decorative', 'MedievalSharp', 'Georgia', serif",
            headingCyrillic: "'Cormorant', 'Cormorant Garamond', 'IM Fell English', Georgia, serif",
            body: "'Cormorant Garamond', 'Garamond', Georgia, serif",
            bodyCyrillic: "'Cormorant Garamond', 'Garamond', Georgia, serif",
            weightHeading: "700",
            scale: "1.414",
            letterSpacing: "0.04em",
            lineHeightHeading: "1.2",
            lineHeight: "1.6",
            cyrillic: false
        },
        {
            id: "game_tactical_fps",
            category: "game",
            profileMatch: ["game_fps", "military"],
            name: "🎯 Tactical Military (Black Ops)",
            heading: "'Black Ops One', 'Share Tech Mono', 'Impact', monospace, sans-serif",
            headingCyrillic: "'Oswald', 'Bebas Neue', 'Impact', sans-serif",
            body: "'Share Tech Mono', 'JetBrains Mono', 'Courier New', monospace",
            bodyCyrillic: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
            weightHeading: "800",
            scale: "1.25",
            letterSpacing: "0.08em",
            lineHeightHeading: "1.1",
            lineHeight: "1.5",
            cyrillic: false
        },
        {
            id: "game_esports_speed",
            category: "game",
            profileMatch: ["game_esports", "esports"],
            name: "🏆 Esports Arena (Russo One)",
            heading: "'Russo One', 'Montserrat', 'Arial Black', sans-serif",
            headingCyrillic: "'Russo One', 'Montserrat', 'Arial Black', sans-serif",
            body: "'Chakra Petch', 'Roboto', 'Arial', sans-serif",
            bodyCyrillic: "'Roboto', 'Ubuntu', 'Arial', sans-serif",
            weightHeading: "900",
            scale: "1.35",
            letterSpacing: "-0.02em",
            lineHeightHeading: "1.1",
            lineHeight: "1.35",
            cyrillic: true
        },
        {
            id: "game_cozy_casual",
            category: "game",
            profileMatch: ["game_cozy", "casual", "indie"],
            name: "🍭 Cozy Casual (Fredoka)",
            heading: "'Fredoka', 'Bungee', 'Luckiest Guy', 'Century Gothic', cursive, sans-serif",
            headingCyrillic: "'Nunito', 'Comfortaa', 'Rounded Mplus 1c', cursive, sans-serif",
            body: "'Nunito', 'Comfortaa', -apple-system, sans-serif",
            bodyCyrillic: "'Nunito', 'Comfortaa', -apple-system, sans-serif",
            weightHeading: "700",
            scale: "1.3",
            letterSpacing: "0.02em",
            lineHeightHeading: "1.3",
            lineHeight: "1.45",
            cyrillic: false
        },
        {
            id: "game_mecha_terminal",
            category: "game",
            profileMatch: ["game_scifi", "terminal", "hacker"],
            name: "⚙️ Mecha Terminal (Tech Mono)",
            heading: "'Share Tech Mono', 'Space Mono', 'Consolas', monospace",
            headingCyrillic: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
            body: "'Share Tech Mono', 'Courier New', monospace",
            bodyCyrillic: "'JetBrains Mono', 'Courier New', monospace",
            weightHeading: "700",
            scale: "1.2",
            letterSpacing: "0.1em",
            lineHeightHeading: "1.35",
            lineHeight: "1.55",
            cyrillic: false
        },
        {
            id: "game_gothic_horror",
            category: "game",
            profileMatch: ["game_horror", "dark", "gothic"],
            name: "💀 Survival Horror (Nosifer)",
            heading: "'Creepster', 'Nosifer', 'Playfair Display', Georgia, serif",
            headingCyrillic: "'Cormorant', 'Playfair Display', Georgia, serif",
            body: "'Special Elite', 'Courier New', Georgia, serif",
            bodyCyrillic: "'PT Serif', 'Georgia', serif",
            weightHeading: "700",
            scale: "1.414",
            letterSpacing: "0.05em",
            lineHeightHeading: "1.2",
            lineHeight: "1.6",
            cyrillic: false
        },
        {
            id: "game_anime_jrpg",
            category: "game",
            profileMatch: ["anime", "jrpg", "fantasy"],
            name: "⛩️ Anime / JRPG (Rounded)",
            heading: "'M PLUS Rounded 1c', 'Zen Tokyo Zoo', 'Century Gothic', sans-serif",
            headingCyrillic: "'Nunito', 'Comfortaa', 'Century Gothic', sans-serif",
            body: "'M PLUS 1p', 'Noto Sans JP', sans-serif",
            bodyCyrillic: "'PT Sans', 'Ubuntu', sans-serif",
            weightHeading: "800",
            scale: "1.333",
            letterSpacing: "0.01em",
            lineHeightHeading: "1.25",
            lineHeight: "1.5",
            cyrillic: false
        },

        // ── UI & Web Category (5 Presets) ──
        {
            id: "modern_sans",
            category: "ui",
            profileMatch: ["saas", "minimal", "dashboard", "enterprise"],
            name: "Modern Sans (SaaS)",
            heading: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
            headingCyrillic: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
            body: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
            bodyCyrillic: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
            weightHeading: "700",
            scale: "1.25",
            letterSpacing: "-0.02em",
            lineHeightHeading: "1.2",
            lineHeight: "1.5",
            cyrillic: true
        },
        {
            id: "swiss_grotesk",
            category: "ui",
            profileMatch: ["minimal", "bauhaus", "swiss"],
            name: "Swiss Grotesk (Clean)",
            heading: "'Helvetica Neue', Helvetica, 'Arial Black', Arial, sans-serif",
            headingCyrillic: "'Helvetica Neue', Helvetica, 'Arial Black', Arial, sans-serif",
            body: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            bodyCyrillic: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            weightHeading: "800",
            scale: "1.414",
            letterSpacing: "-0.03em",
            lineHeightHeading: "1.15",
            lineHeight: "1.4",
            cyrillic: true
        },
        {
            id: "humanist",
            category: "ui",
            profileMatch: ["saas", "health", "education"],
            name: "Humanist (Warm UI)",
            heading: "'Trebuchet MS', 'Segoe UI', 'Lucida Grande', sans-serif",
            headingCyrillic: "'PT Sans', 'Ubuntu', 'Segoe UI', sans-serif",
            body: "'Open Sans', 'Segoe UI', Arial, sans-serif",
            bodyCyrillic: "'Open Sans', 'PT Sans', 'Segoe UI', sans-serif",
            weightHeading: "700",
            scale: "1.25",
            letterSpacing: "-0.01em",
            lineHeightHeading: "1.2",
            lineHeight: "1.55",
            cyrillic: false
        },
        {
            id: "tech_mono",
            category: "ui",
            profileMatch: ["developer", "terminal", "saas"],
            name: "Developer Monospace",
            heading: "'JetBrains Mono', 'Fira Code', Consolas, 'Courier New', monospace",
            headingCyrillic: "'JetBrains Mono', 'Fira Code', Consolas, 'Courier New', monospace",
            body: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
            bodyCyrillic: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
            weightHeading: "700",
            scale: "1.2",
            letterSpacing: "-0.01em",
            lineHeightHeading: "1.3",
            lineHeight: "1.65",
            cyrillic: true
        },
        {
            id: "minimal_system",
            category: "ui",
            profileMatch: ["minimal", "saas", "app"],
            name: "Native System Compact",
            heading: "-apple-system, 'SF Pro Display', 'Segoe UI', sans-serif",
            headingCyrillic: "-apple-system, 'SF Pro Display', 'Segoe UI', sans-serif",
            body: "-apple-system, 'SF Pro Text', 'Segoe UI', sans-serif",
            bodyCyrillic: "-apple-system, 'SF Pro Text', 'Segoe UI', sans-serif",
            weightHeading: "600",
            scale: "1.2",
            letterSpacing: "-0.015em",
            lineHeightHeading: "1.2",
            lineHeight: "1.45",
            cyrillic: true
        },

        // ── Editorial & Brand Category (5 Presets) ──
        {
            id: "editorial_serif",
            category: "editorial",
            profileMatch: ["editorial", "newspaper", "literary"],
            name: "Editorial Serif",
            heading: "Georgia, 'Playfair Display', 'Times New Roman', serif",
            headingCyrillic: "'PT Serif', Georgia, 'Times New Roman', serif",
            body: "Georgia, 'Charter', 'Source Serif Pro', serif",
            bodyCyrillic: "'PT Serif', Georgia, serif",
            weightHeading: "700",
            scale: "1.333",
            letterSpacing: "0",
            lineHeightHeading: "1.2",
            lineHeight: "1.6",
            cyrillic: false
        },
        {
            id: "luxury_didot",
            category: "editorial",
            profileMatch: ["luxury", "fashion", "premium", "elegant"],
            name: "Luxury / Didot",
            heading: "'Didot', 'Bodoni MT', 'Cinzel', Georgia, serif",
            headingCyrillic: "'Cormorant', 'Playfair Display', Georgia, serif",
            body: "'Cormorant Garamond', 'Garamond', Georgia, serif",
            bodyCyrillic: "'Cormorant Garamond', 'PT Serif Caption', Georgia, serif",
            weightHeading: "600",
            scale: "1.5",
            letterSpacing: "0.05em",
            lineHeightHeading: "1.15",
            lineHeight: "1.7",
            cyrillic: false
        },
        {
            id: "playful_round",
            category: "editorial",
            profileMatch: ["fun", "kids", "casual"],
            name: "Playful / Casual",
            heading: "'Comic Sans MS', 'Century Gothic', 'Quicksand', cursive, sans-serif",
            headingCyrillic: "'Nunito', 'Comfortaa', 'Rounded Mplus 1c', cursive, sans-serif",
            body: "'Nunito', 'Segoe UI', Arial, sans-serif",
            bodyCyrillic: "'Nunito', 'PT Sans', Arial, sans-serif",
            weightHeading: "700",
            scale: "1.25",
            letterSpacing: "0.01em",
            lineHeightHeading: "1.25",
            lineHeight: "1.5",
            cyrillic: false
        },
        {
            id: "display_impact",
            category: "editorial",
            profileMatch: ["advertising", "bold", "promo"],
            name: "Display Impact",
            heading: "Impact, 'Arial Black', sans-serif",
            headingCyrillic: "'Impact', 'Arial Black', sans-serif",
            body: "Arial, 'Helvetica Neue', sans-serif",
            bodyCyrillic: "Arial, 'Helvetica Neue', sans-serif",
            weightHeading: "900",
            scale: "1.414",
            letterSpacing: "0.02em",
            lineHeightHeading: "1.05",
            lineHeight: "1.35",
            cyrillic: true
        },
        {
            id: "brutalist_poster",
            category: "editorial",
            profileMatch: ["brutalism", "industrial", "modern"],
            name: "Brutalist Heavy Poster",
            heading: "'Arial Black', Impact, sans-serif",
            headingCyrillic: "'Arial Black', Impact, sans-serif",
            body: "'Courier New', Courier, monospace",
            bodyCyrillic: "'Courier New', Courier, monospace",
            weightHeading: "900",
            scale: "1.5",
            letterSpacing: "0.03em",
            lineHeightHeading: "1.0",
            lineHeight: "1.3",
            cyrillic: true
        }
    ], p = function() {
        function i(e, n, r, i) {
            var s;
            this.hue = n, this.angle = r, this.hidden = i, this.uid = "", this.inited = !1, this.lock(), this.col = {}, this.col.pri = new o(this.hue), this.setModel(e), this.preset = "null", this.vars = new l(this, "default"), this.varsMulti = {
                pri: new l(this, "default"),
                compl: new l(this, "default"),
                sec1: new l(this, "default"),
                sec2: new l(this, "default")
            }, this.varsMultiOn = !1, this.lockedColors = {
                pri: !1,
                sec: !1,
                compl: !1
            }, this.converter = {
                on: !1,
                type: "none",
                amount: 1
            }, this.typography = TYPOGRAPHY_PAIRS[0], this.currentSeed = oklch.generateSeed(), this.chaos = 1.0, this.lastProfiles = [], this.inited = !0, this.unlock(), this.modelChanged(), this.colorChanged(), s = this, this.hidden || (t.register("history/changed", function(e, t) {
                return s.loadPalette(t.data)
            }), t.register("palette/load", function(e, t) {
                return s.loadPalette(t)
            }), t.register("palette/reset", function() {
                return s.loadPalette(null)
            }), t.register("palette/colors/update", function() {
                return s.colorChanged()
            }), t.register("palette/model/free", function(e, t) {
                return s.setModelFree(t.id)
            }), t.register("drag/start", function() {
                return s.lock()
            }), t.register("drag/stop", function() {
                return s.unlock(), s.storePalette()
            }), t.register("palette/set/base", function(e, t) {
                return s.setBase(t.color)
            }), t.register("palette/switchvars/same", function() {
                return s.switchVars(!1)
            }), t.register("palette/switchvars/multi", function() {
                return s.switchVars(!0)
            }), t.register("palette/switchvars/active", function(e, t) {
                return s.setVarsActive(t.colId)
            }), t.register("palette/adjust/hue", function(e, t) {
                return s.addHue(t.val), s.storePalette()
            }), t.register("palette/adjust/saturation", function(e, t) {
                return s.addSaturation(t.val), s.storePalette()
            }), t.register("palette/adjust/bright", function(e, t) {
                return s.addBright(t.val), s.storePalette()
            }), t.register("palette/adjust/contrast", function(e, t) {
                return s.addContrast(t.val), s.storePalette()
            }), t.register("palette/swapsecs", function() {
                return s.swapSecs()
            }), t.register("palette/colorize", function(e, t) {
                return s.colorize(t.$e, t.sorted, t.converted)
            }), t.register("convert/set", function(e, t) {
                return s.setConverter(t.data)
            }), t.register("palette/typography/set", function(e, t) {
                return s.setTypography(t)
            }), t.register("palette/typography/randomize", function(e, t) {
                return s.randomizeTypography(t)
            }), t.register("export/html", function() {
                return s["export"]("html")
            }), t.register("export/css", function() {
                return s["export"]("css")
            }), t.register("export/oklch", function() {
                return s["export"]("oklch")
            }), t.register("export/tailwind", function() {
                return s["export"]("tailwind")
            }), t.register("export/dtcg", function() {
                return s["export"]("dtcg")
            }), t.register("export/figma", function() {
                return s["export"]("figma")
            }), t.register("export/svg", function() {
                return s["export"]("svg")
            }), t.register("export/less", function() {
                return s["export"]("less")
            }), t.register("export/sass", function() {
                return s["export"]("sass")
            }), t.register("export/xml", function() {
                return s["export"]("xml")
            }), t.register("export/text", function() {
                return s["export"]("txt")
            }), t.register("export/aco", function() {
                return s["export"]("aco")
            }), t.register("export/gpl", function() {
                return s["export"]("gpl")
            }), t.register("export/sketch", function() {
                return s["export"]("sketch")
            }), t.register("export/png", function() {
                return s.exportImg()
            }))
        }
        return i.prototype.modelChanged = function() {
            if (!this.hidden) return t.trigger("palette/model/changed")
        }, i.prototype.colorChanged = function() {
            this.calcColorTable();
            if (!this.hidden) return t.trigger("palette/colors/changed"), this.storePalette()
        }, i.prototype.varsChanged = function() {
            this.calcColorTable();
            if (!this.hidden) return t.trigger("palette/colors/changed"), this.storePalette()
        }, i.prototype.setModel = function(e, t) {
            this.modelID = e, this.model = u[e], t && !this.model.swapped && this.model.swapSecs(), this.hueCompl = this.model.getComplement(this.hue), this.hueCompl != null ? this.col.compl = new o(this.hueCompl) : this.col.compl = null, this.hueSec1 = this.model.getSec1(this.hue, this.angle), this.hueSec1 != null ? this.col.sec1 = new o(this.hueSec1) : this.col.sec1 = null, this.hueSec2 = this.model.getSec2(this.hue, this.angle), this.hueSec2 != null ? this.col.sec2 = new o(this.hueSec2) : this.col.sec2 = null, this.hueCnt = 1, this.hasCompl() && this.hueCnt++, this.hasSecs() && (this.hueCnt += 2), this.hueCnt === 1 && (this.varsMultiOn = !1), this.varsMultiOn && (!this.hasCompl() && this.varsActive === "compl" || !this.hasSecs() && (this.varsActive === "sec1" || this.varsActive === "sec2")) && this.setVarsActive("pri"), this.inited && this.modelChanged();
            if (this.inited) return this.colorChanged()
        }, i.prototype.setModelFree = function(e) {
            this.modelID = "free", this.model = null;
            if (!e || e < 2 || e > 4) e = 2;
            this.hueCnt = e, e === 2 && (this.hueSec1 = this.hueSec2 = this.col.sec1 = this.col.sec2 = null), e === 3 && (this.hueCompl = this.col.compl = null);
            if (e === 2 || e === 4) this.hueCompl == null && (this.hueCompl = r.angleNorm(this.hue + 180)), this.col.compl = new o(this.hueCompl);
            e >= 3 && (this.hueSec1 == null && (this.hueSec1 = r.angleNorm(this.hue + 30)), this.col.sec1 = new o(this.hueSec1), this.hueSec2 == null && (this.hueSec2 = r.angleNorm(this.hue - 30)), this.col.sec2 = new o(this.hueSec2)), this.locked || this.modelChanged();
            if (this.inited) return this.colorChanged()
        }, i.prototype.setHue = function(e, t) {
            var n;
            return n = e - this.hue, this.isModelFree() && !t ? this.addHueAll(n) : (this.hue = r.angleNorm(e), this.col.pri.setHue(Math.round(this.hue)), this.updateCompl(), this.updateSecs(), this.colorChanged())
        }, i.prototype.addHue = function(e) {
            return this.setHue(this.hue + e)
        }, i.prototype.addHueAll = function(e) {
            return this.hue = r.angleNorm(this.hue + e), this.col.pri.setHue(Math.round(this.hue)), this.hasCompl() && (this.hueCompl = r.angleNorm(this.hueCompl + e), this.updateCompl()), this.hasSecs() && (this.hueSec1 = r.angleNorm(this.hueSec1 + e), this.hueSec2 = r.angleNorm(this.hueSec2 + e), this.updateSecs()), this.colorChanged()
        }, i.prototype.setHueCompl = function(e, t) {
            var n;
            return this.isModelFree() ? t ? (this.hueCompl = r.angleNorm(e), this.updateCompl(), this.colorChanged()) : (n = e - this.hueCompl, this.addHueAll(n)) : this.setHue(this.model.getComplement(e))
        }, i.prototype.setHueSec = function(e, t, n) {
            var i, s, o;
            return this.isModelFree() ? n ? (o = r.angleNorm(e), t === 1 ? this.hueSec1 = o : this.hueSec2 = o, this.updateSecs(), this.colorChanged()) : (s = e - (t === 1 ? this.hueSec1 : this.hueSec2), this.addHueAll(s)) : (i = r.angleDiff(e, this.hue), i = this.model.getAngle(i), this.setAngle(i))
        }, i.prototype.setAngle = function(e) {
            var t;
            this.angle = r.angleNorm(e);
            if (this.angle > 90) {
                t = "", this.modelID === "analog" ? t = "triad" : this.modelID === "triad" ? t = "analog" : this.modelID === "analogcompl" ? t = "triadcompl" : this.modelID === "triadcompl" && (t = "analogcompl");
                if (t) {
                    this.angle = 180 - this.angle, this.setModel(t, !this.model.swapped);
                    return
                }
            }
            return this.updateSecs(), this.colorChanged()
        }, i.prototype.swapSecs = function(e) {
            if (this.model) return this.model.swapSecs(), this.updateSecs(), this.colorChanged()
        }, i.prototype.setPreset = function(e) {
            return this.preset = e, this.vars.setPreset(e)
        }, i.prototype.switchVars = function(e) {
            if (this.varsMultiOn === !!e) return;
            return e && (this.hasCompl() || this.hasSecs()) ? (this.varsMultiOn = !0, this.varsMulti.pri.setVals(this.vars.getVals()), this.varsMulti.compl.setVals(this.vars.getVals()), this.varsMulti.sec1.setVals(this.vars.getVals()), this.varsMulti.sec2.setVals(this.vars.getVals()), this.setVarsActive("pri")) : this.varsMultiOn = !1, this.colorChanged()
        }, i.prototype.setVarsActive = function(e) {
            if (!this.varsMultiOn) return;
            return this.varsActive = e, this.vars = this.varsMulti[e], this.colorChanged()
        }, i.prototype.setVars = function(e) {
            return this.vars.setVals(e)
        }, i.prototype.addSaturation = function(e) {
            if (!this.varsMultiOn) return this.vars.addSaturation(e);
            this.varsMulti.pri.addSaturation(e), this.hasCompl() && this.varsMulti.compl.addSaturation(e);
            if (this.hasSecs()) return this.varsMulti.sec1.addSaturation(e), this.varsMulti.sec2.addSaturation(e)
        }, i.prototype.addBright = function(e) {
            if (!this.varsMultiOn) return this.vars.addBright(e);
            this.varsMulti.pri.addBright(e), this.hasCompl() && this.varsMulti.compl.addBright(e);
            if (this.hasSecs()) return this.varsMulti.sec1.addBright(e), this.varsMulti.sec2.addBright(e)
        }, i.prototype.addContrast = function(e) {
            if (!this.varsMultiOn) return this.vars.addContrast(e);
            this.varsMulti.pri.addContrast(e), this.hasCompl() && this.varsMulti.compl.addContrast(e);
            if (this.hasSecs()) return this.varsMulti.sec1.addContrast(e), this.varsMulti.sec2.addContrast(e)
        }, i.prototype.setBase = function(e) {
            return this.locked = !0, this.setHue(e.hsv.h), this.vars.setMainVal([e.kS, e.kV]), this.locked = !1, this.colorChanged()
        }, i.prototype.setByCssColor = function(str) {
            var p = oklch.parseCssColor(str);
            if (!p) return !1;
            var rgb = new a(p.r, p.g, p.b), col = new o(0);
            return col.setByRGB(rgb), this.setBase(col)
        }, i.prototype.setByHex = function(e) {
            var p = oklch.parseCssColor(e);
            if (p) {
                var rgb = new a(p.r, p.g, p.b), col = new o(0);
                return col.setByRGB(rgb), this.setBase(col)
            }
            var t, n;
            return n = new a(0, 0, 0), n.setByHex(e), t = new o(0), t.setByRGB(n), this.setBase(t)
        }, i.prototype.setConverter = function(e) {
            return e.type ? this.converter = {
                on: !0,
                type: e.type,
                amount: e.amount
            } : this.converter.on = !1, this.colorChanged()
        }, i.prototype.isModelFree = function() {
            return this.modelID === "free"
        }, i.prototype.hasCompl = function() {
            return this.hueCompl != null
        }, i.prototype.hasSecs = function() {
            return this.hueSec1 != null
        }, i.prototype.getVar = function(e, t) {
            return this.varsMultiOn ? this.varsMulti[t].getVal(e) : this.vars.getVal(e)
        }, i.prototype.getVars = function() {
            return this.vars.getVals()
        }, i.prototype.getHueActive = function() {
            if (!this.varsMultiOn) return this.hue;
            switch (this.varsActive) {
                case "pri":
                    return this.hue;
                case "compl":
                    return this.hueCompl;
                case "sec1":
                    return this.hueSec1;
                case "sec2":
                    return this.hueSec2
            }
        }, i.prototype.getColCnt = function() {
            var e;
            return e = 1, this.hasCompl() && (e = 2), this.hasSecs() && (e += 2), e
        }, i.prototype.updateCompl = function() {
            if (this.col.compl) {
                this.isModelFree() || (this.hueCompl = this.model.getComplement(this.hue));
                if (this.hueCompl != null) return this.col.compl.setHue(Math.round(this.hueCompl))
            }
        }, i.prototype.updateSecs = function() {
            this.col.sec1 && (this.isModelFree() || (this.hueSec1 = this.model.getSec1(this.hue, this.angle)), this.hueSec1 != null && this.col.sec1.setHue(Math.round(this.hueSec1)));
            if (this.col.sec2) {
                this.isModelFree() || (this.hueSec2 = this.model.getSec2(this.hue, this.angle));
                if (this.hueSec2 != null) return this.col.sec2.setHue(Math.round(this.hueSec2))
            }
        }, i.prototype.lock = function() {
            return this.locked = !0
        }, i.prototype.unlock = function() {
            return this.locked = !1
        }, i.prototype.storePalette = function() {
            if (this.hidden || this.locked) return;
            this.uid = this.getSerialized();
            this.recordHistory();
            return t.trigger("history/setstate", {
                uid: this.uid
            }), t.trigger("palette/uid/changed", {
                uid: this.uid
            })
        }, i.prototype.loadPalette = function(e) {
            var t;
            this.locked = !0;
            if (e && e.uid && e.uid !== -1) {
                if (e.uid === this.uid) return this.locked = !1, 0;
                t = this.setSerialized(e.uid);
                if (!t) {
                    this.loadPalette(null);
                    return
                }
                this.uid = this.getSerialized()
            } else this.setModel(d.model), this.setHue(d.hue), this.setAngle(d.angle), this.setPreset(d.preset);
            return this.locked = !1, this.modelChanged(), this.colorChanged()
        }, i.prototype.toggleColorLock = function(k) {
            return this.lockedColors[k] = !this.lockedColors[k], this.lockedColors[k]
        }, i.prototype.isColorLocked = function(k) {
            return !!this.lockedColors[k]
        }, i.prototype.recordHistory = function() {
            if (!this.uid || this.uid === -1) return;
            try {
                var hist = JSON.parse(localStorage.getItem("pal_history") || "[]");
                if (hist.length > 0 && hist[0].uid === this.uid) return;
                var hexes = [];
                var groups = ["pri"];
                if (this.hasSecs()) groups.push("sec1", "sec2");
                if (this.hasCompl()) groups.push("compl");
                for (var g = 0; g < groups.length; g++) {
                    var hex = this.getColorCode(groups[g], 0);
                    if (hex) hexes.push(hex.startsWith("#") ? hex : ("#" + hex));
                }
                hist.unshift({
                    uid: this.uid,
                    model: this.modelID,
                    hue: Math.round(this.hue),
                    hexes: hexes,
                    timestamp: Date.now()
                });
                localStorage.setItem("pal_history", JSON.stringify(hist.slice(0, 30)));
            } catch (err) {}
        }, i.prototype.getFavorites = function() {
            try {
                var favs = localStorage.getItem("pal_favorites");
                return favs ? JSON.parse(favs) : [];
            } catch (err) {
                return [];
            }
        }, i.prototype.saveFavorite = function(name) {
            try {
                var favs = this.getFavorites();
                var uid = this.uid;
                var exists = false;
                for (var idx = 0; idx < favs.length; idx++) {
                    if (favs[idx].uid === uid) {
                        exists = true;
                        break;
                    }
                }
                if (!exists) {
                    var hexes = [];
                    var groups = ["pri"];
                    if (this.hasSecs()) groups.push("sec1", "sec2");
                    if (this.hasCompl()) groups.push("compl");
                    for (var g = 0; g < groups.length; g++) {
                        var hex = this.getColorCode(groups[g], 0);
                        if (hex) hexes.push(hex.startsWith("#") ? hex : ("#" + hex));
                    }
                    favs.unshift({
                        uid: uid,
                        name: name || ("Palette " + (favs.length + 1)),
                        model: this.modelID,
                        hue: Math.round(this.hue),
                        hexes: hexes,
                        timestamp: Date.now()
                    });
                    localStorage.setItem("pal_favorites", JSON.stringify(favs.slice(0, 50)));
                }
                return true;
            } catch (err) {
                return false;
            }
        }, i.prototype.removeFavorite = function(uid) {
            try {
                var favs = this.getFavorites();
                var next = [];
                for (var idx = 0; idx < favs.length; idx++) {
                    if (favs[idx].uid !== uid) next.push(favs[idx]);
                }
                localStorage.setItem("pal_favorites", JSON.stringify(next));
                return true;
            } catch (err) {
                return false;
            }
        }, i.prototype.isFavorite = function() {
            var favs = this.getFavorites();
            for (var idx = 0; idx < favs.length; idx++) {
                if (favs[idx].uid === this.uid) return true;
            }
            return false;
        }, i.prototype.getSeed = function() {
            return this.currentSeed || (this.currentSeed = oklch.generateSeed());
        }, i.prototype.setSeed = function(seed) {
            if (!seed) return this.getSeed();
            this.currentSeed = String(seed).trim();
            t.trigger("palette/seed/changed", { seed: this.currentSeed });
            return this.currentSeed;
        }, i.prototype.getChaos = function() {
            return this.chaos !== undefined ? this.chaos : 1.0;
        }, i.prototype.setChaos = function(val) {
            var c = parseFloat(val);
            if (!isNaN(c) && c >= 0.1 && c <= 2.5) {
                this.chaos = Math.round(c * 10) / 10;
                t.trigger("palette/chaos/changed", { chaos: this.chaos });
            }
            return this.chaos;
        }, i.prototype.getContrastReport = function() {
            var cTable = this.colorTable && this.colorTable.byPalette && this.colorTable.byPalette.pri;
            if (!cTable || cTable.length < 5) return null;
            var baseRgb = cTable[0] ? cTable[0].rgb : null;
            var lightBgRgb = cTable[4] ? cTable[4].rgb : null;
            var darkTextRgb = cTable[3] ? cTable[3].rgb : null;
            var secRgb = (this.colorTable.byPalette && this.colorTable.byPalette.sec1 && this.colorTable.byPalette.sec1[0]) ? this.colorTable.byPalette.sec1[0].rgb : null;
            if (!baseRgb || !lightBgRgb || !darkTextRgb) return null;
            return oklch.auditSemanticContrast(baseRgb, lightBgRgb, darkTextRgb, secRgb);
        }, i.prototype.fixContrast = function(targetRatio) {
            targetRatio = targetRatio || 4.5;
            this.locked = true;
            var cTable = this.colorTable && this.colorTable.byPalette && this.colorTable.byPalette.pri;
            var bgRgb = (cTable && cTable[4] && cTable[4].rgb) ? cTable[4].rgb : { r: 255, g: 255, b: 255 };

            var groups = ["pri"];
            if (this.hasSecs()) groups.push("sec1", "sec2");
            if (this.hasCompl()) groups.push("compl");

            for (var g = 0; g < groups.length; g++) {
                var grp = groups[g];
                var varsObj = this.varsMultiOn ? this.varsMulti[grp] : this.vars;
                if (!varsObj) continue;
                if (this.lockedColors[grp]) continue;

                var vals = varsObj.getVals();
                var gHue = (grp === "pri" ? this.hue : (grp === "compl" ? this.hueCompl : (grp === "sec1" ? this.hueSec1 : this.hueSec2))) || this.hue;

                // Slot 3 (Text): guarantee targetRatio against background
                var colText = new o(gHue);
                colText.setSV(vals[3][0], vals[3][1]);
                var textOklch = oklch.srgbToOklch(colText.rgb.r, colText.rgb.g, colText.rgb.b);
                var fittedText = oklch.fitContrast(textOklch, bgRgb, targetRatio);
                colText.setByRGB(fittedText.rgb);
                vals[3] = [colText.kS, colText.kV];

                // Slot 0 (Primary brand button / accent): guarantee contrast
                var colPri = new o(gHue);
                colPri.setSV(vals[0][0], vals[0][1]);
                var priOklch = oklch.srgbToOklch(colPri.rgb.r, colPri.rgb.g, colPri.rgb.b);
                var priTarget = targetRatio >= 7.0 ? 4.5 : 3.0;
                var fittedPri = oklch.fitContrast(priOklch, bgRgb, priTarget);
                colPri.setByRGB(fittedPri.rgb);
                vals[0] = [colPri.kS, colPri.kV];

                varsObj.setVals(vals);
                if (!this.varsMultiOn) break;
            }
            this.locked = false;
            this.colorChanged();
            return this.getContrastReport();
        }, i.prototype.randomizeProfile = function(profile, options) {
            options = options || {};
            this.locked = true;

            var seedStr = options.seed || oklch.generateSeed();
            this.currentSeed = String(seedStr);
            var seedNum = oklch.stringToSeed(this.currentSeed);
            var rng = oklch.mulberry32(seedNum);

            var chaos = options.chaos !== undefined ? options.chaos : (this.chaos || 1.0);
            var prof = oklch.OKLCH_PROFILES[profile] || oklch.OKLCH_PROFILES["saas"];
            this.currentProfileId = prof.id;

            if (!this.lastProfiles) this.lastProfiles = [];
            this.lastProfiles.unshift(prof.id);
            if (this.lastProfiles.length > 5) this.lastProfiles.pop();

            // 1. Primary Hue with Box-Muller Gaussian Jitter & Context-Aware Locking
            var baseH = this.hue;
            if (!this.lockedColors.pri) {
                var pickedBaseH = prof.hues[Math.floor(rng() * prof.hues.length)];
                var jitter = oklch.randomGaussian(rng, 0, 10 * chaos);
                baseH = Math.round((pickedBaseH + jitter + 360) % 360);
                this.setHue(baseH);
            } else {
                baseH = Math.round(this.hue);
            }

            // 2. Harmony Model & Secondary Angle
            if (!this.lockedColors.sec) {
                var pickedModel = prof.models[Math.floor(rng() * prof.models.length)];
                this.setModel(pickedModel);
                if (this.hasSecs()) {
                    var minA = prof.angle ? prof.angle[0] : 25;
                    var maxA = prof.angle ? prof.angle[1] : 35;
                    var midA = (minA + maxA) * 0.5;
                    var aJitter = oklch.randomGaussian(rng, 0, 4 * chaos);
                    var angle = Math.max(15, Math.min(75, Math.round(midA + aJitter)));
                    this.setAngle(angle);
                }
            }

            // 3. OKLCH Perceptual Curve [L, C] & Gamut Mapping
            var targetRatio = options.targetRatio || 4.5;
            var curve = prof.curve;
            var self = this;

            /**
             * Convert Paletton wheel hue (RYB-based, 0-360) to actual OKLCH hue angle
             * by sampling the wheel color object at a stable midtone reference point.
             * Paletton wheel ≠ OKLCH cylindrical angle — they differ by 14-26° typically.
             */
            var palettonHueToOklchH = function(wheelHue) {
                var refCol = new o(wheelHue);
                // Sample at stable mid-saturation/brightness that is chromatic and in-gamut
                refCol.setSV(0.75, 0.80);
                if (!refCol.rgb) return wheelHue; // fallback
                var ref = oklch.srgbToOklch(refCol.rgb.r, refCol.rgb.g, refCol.rgb.b);
                // Only trust the OKLCH hue if the color is chromatic enough
                return ref.C > 0.04 ? ref.H : wheelHue;
            };

            var calcGroupVals = function(groupKey, gHue) {
                // Convert Paletton wheel angle to true perceptual OKLCH hue
                var oklchH = palettonHueToOklchH(gHue);

                var rgbs = [];
                for (var s = 0; s < 5; s++) {
                    var ptL = curve[s][0];
                    var ptC = curve[s][1];
                    var lJitter = oklch.randomGaussian(rng, 0, 0.015 * chaos);
                    var cJitter = oklch.randomGaussian(rng, 0, 0.01 * chaos);
                    var finalL = Math.max(0.02, Math.min(0.99, ptL + lJitter));
                    var finalC = Math.max(0.005, Math.min(0.35, ptC + cJitter));
                    rgbs[s] = oklch.oklchToSrgb(finalL, finalC, oklchH);
                }

                // Exact WCAG Contrast Guarantee using fitContrast (in OKLCH space)
                var bgRgb = rgbs[4];
                var textFit = oklch.fitContrast({ L: curve[3][0], C: curve[3][1], H: oklchH }, bgRgb, targetRatio);
                rgbs[3] = textFit.rgb;

                var priMinRatio = (profile === "minimal" || profile === "saas") ? 3.0 : 2.5;
                var priFit = oklch.fitContrast({ L: curve[0][0], C: curve[0][1], H: oklchH }, bgRgb, priMinRatio);
                rgbs[0] = priFit.rgb;

                // Map into Paletton internal [kS, kV] — using gHue (wheel angle) as the base hue
                var groupVals = [];
                for (var k = 0; k < 5; k++) {
                    var col = new o(gHue);
                    col.setByRGB(rgbs[k]);
                    groupVals[k] = [col.kS, col.kV];
                }
                return groupVals;
            };

            var priVals = calcGroupVals("pri", this.hue);

            if (this.varsMultiOn) {
                if (!this.lockedColors.pri) this.varsMulti.pri.setVals(priVals);
                if (!this.lockedColors.compl && this.hasCompl()) {
                    this.varsMulti.compl.setVals(calcGroupVals("compl", this.hueCompl));
                }
                if (!this.lockedColors.sec && this.hasSecs()) {
                    this.varsMulti.sec1.setVals(calcGroupVals("sec1", this.hueSec1));
                    this.varsMulti.sec2.setVals(calcGroupVals("sec2", this.hueSec2));
                }
                this.varsActive = "pri";
                this.vars = this.varsMulti.pri;
            } else {
                this.vars.setVals(priVals);
            }

            if (prof.typoCategory && this.randomizeTypography) {
                this.randomizeTypography(prof.typoCategory, prof.id, rng);
            }

            this.locked = false;
            this.modelChanged();
            this.colorChanged();

            // Post-render contrast verification: read ACTUAL rendered RGB from colorTable
            // and iterate fixContrast if roundtrip lossy conversion degraded it below target
            this._verifyAndFixContrast(targetRatio);

            t.trigger("palette/seed/changed", { seed: this.currentSeed });
            return this.getContrastReport();
        }, i.prototype.randomizeKeepMood = function(options) {
            options = options || {};
            this.locked = true;
            // Use seeded PRNG for reproducibility
            var seedStr = options.seed || oklch.generateSeed();
            this.currentSeed = String(seedStr);
            var rng = oklch.mulberry32(oklch.stringToSeed(this.currentSeed));

            if (!this.lockedColors.pri) {
                var step = 45 + Math.floor(rng() * 270);
                this.setHue((this.hue + step) % 360);
            }
            if (!this.lockedColors.sec && this.hasSecs()) {
                var angle = Math.floor(20 + rng() * 45);
                this.setAngle(angle);
            }

            var groups = ["pri"];
            if (this.hasSecs()) groups.push("sec1", "sec2");
            if (this.hasCompl()) groups.push("compl");

            for (var g = 0; g < groups.length; g++) {
                var grp = groups[g];
                var varsObj = this.varsMultiOn ? this.varsMulti[grp] : this.vars;
                if (!varsObj) continue;

                var vals = varsObj.getVals();
                var gHue = (grp === "pri" ? this.hue : (grp === "compl" ? this.hueCompl : (grp === "sec1" ? this.hueSec1 : this.hueSec2))) || this.hue;

                for (var j = 0; j < vals.length; j++) {
                    var col = new o(gHue);
                    col.setSV(vals[j][0], vals[j][1]);
                    var curOklch = oklch.srgbToOklch(col.rgb.r, col.rgb.g, col.rgb.b);
                    // Use the actual OKLCH hue from the rendered color (already correct here since
                    // we derive from an existing rendered slot)
                    var newRgb = oklch.oklchToSrgb(curOklch.L, curOklch.C, curOklch.H);
                    col.setByRGB(newRgb);
                    vals[j] = [col.kS, col.kV];
                }
                varsObj.setVals(vals);
                if (!this.varsMultiOn) break;
            }

            this.locked = false;
            this.modelChanged();
            t.trigger("palette/seed/changed", { seed: this.currentSeed });
            return this.colorChanged();
        }, i.prototype.randomizeVariations = function(options) {
            options = options || {};
            this.locked = true;
            var chaos = options.chaos !== undefined ? options.chaos : (this.chaos || 1.0);
            // Use seeded PRNG for reproducibility
            var seedStr = options.seed || oklch.generateSeed();
            this.currentSeed = String(seedStr);
            var rng = oklch.mulberry32(oklch.stringToSeed(this.currentSeed));

            if (!this.lockedColors.pri) {
                var deltaH = Math.round(oklch.randomGaussian(rng, 0, 6 * chaos));
                this.setHue((this.hue + deltaH + 360) % 360);
            }
            if (!this.lockedColors.sec && this.hasSecs()) {
                var deltaA = Math.round(oklch.randomGaussian(rng, 0, 4 * chaos));
                this.setAngle(Math.max(15, Math.min(75, this.angle + deltaA)));
            }

            var groups = ["pri"];
            if (this.hasSecs()) groups.push("sec1", "sec2");
            if (this.hasCompl()) groups.push("compl");

            for (var g = 0; g < groups.length; g++) {
                var grp = groups[g];
                var varsObj = this.varsMultiOn ? this.varsMulti[grp] : this.vars;
                if (!varsObj) continue;
                if (this.lockedColors[grp]) continue;

                var vals = varsObj.getVals();
                var gHue = (grp === "pri" ? this.hue : (grp === "compl" ? this.hueCompl : (grp === "sec1" ? this.hueSec1 : this.hueSec2))) || this.hue;

                for (var j = 0; j < vals.length; j++) {
                    var col = new o(gHue);
                    col.setSV(vals[j][0], vals[j][1]);
                    // Derive actual OKLCH from the rendered slot color (hue already correct)
                    var curOklch = oklch.srgbToOklch(col.rgb.r, col.rgb.g, col.rgb.b);

                    var dL = oklch.randomGaussian(rng, 0, 0.02 * chaos);
                    var dC = oklch.randomGaussian(rng, 0, 0.015 * chaos);

                    var newL = Math.max(0.02, Math.min(0.99, curOklch.L + dL));
                    var newC = Math.max(0.005, Math.min(0.35, curOklch.C + dC));
                    var newRgb = oklch.oklchToSrgb(newL, newC, curOklch.H);

                    col.setByRGB(newRgb);
                    vals[j] = [col.kS, col.kV];
                }
                varsObj.setVals(vals);
                if (!this.varsMultiOn) break;
            }

            this.locked = false;
            this.modelChanged();
            t.trigger("palette/seed/changed", { seed: this.currentSeed });
            return this.colorChanged();
        }, i.prototype.generateMode = function(mode) {
            this.locked = true;
            var vals = null;
            mode = (mode || "").toLowerCase();

            switch (mode) {
                case "monochromatic":
                case "mono":
                    this.setModel("mono");
                    if (!this.lockedColors.pri) {
                        this.setHue(Math.floor(Math.random() * 360));
                    }
                    vals = [
                        [0.72, 0.70],
                        [0.18, 0.96],
                        [0.46, 0.82],
                        [0.82, 0.38],
                        [0.94, 0.12]
                    ];
                    break;

                case "analogous":
                case "analog":
                    this.setModel("analog");
                    if (this.hasSecs()) {
                        this.setAngle(Math.floor(25 + Math.random() * 15));
                    }
                    if (!this.lockedColors.pri) {
                        this.setHue(Math.floor(Math.random() * 360));
                    }
                    vals = [
                        [0.76, 0.82],
                        [0.24, 0.94],
                        [0.65, 0.54],
                        [0.82, 0.28],
                        [0.08, 0.98]
                    ];
                    break;

                case "complementary":
                case "compl":
                    this.setModel("monocompl");
                    if (!this.lockedColors.pri) {
                        this.setHue(Math.floor(Math.random() * 360));
                    }
                    vals = [
                        [0.82, 0.86],
                        [0.22, 0.95],
                        [0.68, 0.52],
                        [0.88, 0.22],
                        [0.06, 0.99]
                    ];
                    break;

                case "split_complementary":
                case "split":
                    this.setModel("analogcompl");
                    if (this.hasSecs()) {
                        this.setAngle(Math.floor(25 + Math.random() * 12));
                    }
                    if (!this.lockedColors.pri) {
                        this.setHue(Math.floor(Math.random() * 360));
                    }
                    vals = [
                        [0.78, 0.84],
                        [0.22, 0.94],
                        [0.68, 0.52],
                        [0.85, 0.26],
                        [0.06, 0.98]
                    ];
                    break;

                case "triadic":
                case "triad":
                    this.setModel("triad");
                    if (this.hasSecs()) {
                        this.setAngle(60);
                    }
                    if (!this.lockedColors.pri) {
                        this.setHue(Math.floor(Math.random() * 360));
                    }
                    vals = [
                        [0.78, 0.85],
                        [0.26, 0.94],
                        [0.66, 0.55],
                        [0.84, 0.26],
                        [0.07, 0.98]
                    ];
                    break;

                case "tetradic":
                case "tetrad":
                    this.setModel("tetrad");
                    if (this.hasSecs()) {
                        this.setAngle(Math.floor(45 + Math.random() * 25));
                    }
                    if (!this.lockedColors.pri) {
                        this.setHue(Math.floor(Math.random() * 360));
                    }
                    vals = [
                        [0.75, 0.84],
                        [0.25, 0.94],
                        [0.66, 0.52],
                        [0.84, 0.25],
                        [0.07, 0.98]
                    ];
                    break;

                case "double_complementary":
                case "doublecompl":
                    this.setModel("triadcompl");
                    if (this.hasSecs()) {
                        this.setAngle(Math.floor(30 + Math.random() * 15));
                    }
                    if (!this.lockedColors.pri) {
                        this.setHue(Math.floor(Math.random() * 360));
                    }
                    vals = [
                        [0.76, 0.85],
                        [0.24, 0.94],
                        [0.68, 0.52],
                        [0.85, 0.24],
                        [0.06, 0.98]
                    ];
                    break;

                case "neutral_accent":
                    this.setModel("mono");
                    if (!this.lockedColors.pri) {
                        this.setHue(Math.floor(Math.random() * 360));
                    }
                    vals = [
                        [0.88, 0.92],
                        [0.05, 0.96],
                        [0.10, 0.76],
                        [0.18, 0.22],
                        [0.03, 0.99]
                    ];
                    break;

                case "grayscale_accent":
                    this.setModel("mono");
                    if (!this.lockedColors.pri) {
                        this.setHue(Math.floor(Math.random() * 360));
                    }
                    vals = [
                        [0.96, 0.94],
                        [0.01, 0.97],
                        [0.02, 0.75],
                        [0.03, 0.16],
                        [0.00, 1.00]
                    ];
                    break;

                case "warm":
                    var warmRanges = [[345, 360], [0, 65]];
                    var range = warmRanges[Math.floor(Math.random() * warmRanges.length)];
                    var h = Math.floor(range[0] + Math.random() * (range[1] - range[0]));
                    if (!this.lockedColors.pri) {
                        this.setHue(h % 360);
                    }
                    var warmModels = ["analog", "monocompl", "triad", "mono"];
                    this.setModel(warmModels[Math.floor(Math.random() * warmModels.length)]);
                    if (this.hasSecs()) {
                        this.setAngle(Math.floor(25 + Math.random() * 20));
                    }
                    vals = [
                        [0.82, 0.88],
                        [0.28, 0.96],
                        [0.72, 0.58],
                        [0.86, 0.25],
                        [0.08, 0.98]
                    ];
                    break;

                case "cool":
                    var h = Math.floor(165 + Math.random() * 95);
                    if (!this.lockedColors.pri) {
                        this.setHue(h);
                    }
                    var coolModels = ["analog", "monocompl", "triad", "mono"];
                    this.setModel(coolModels[Math.floor(Math.random() * coolModels.length)]);
                    if (this.hasSecs()) {
                        this.setAngle(Math.floor(25 + Math.random() * 20));
                    }
                    vals = [
                        [0.78, 0.86],
                        [0.20, 0.95],
                        [0.68, 0.52],
                        [0.88, 0.22],
                        [0.06, 0.98]
                    ];
                    break;

                case "high_saturation":
                case "vibrant":
                    if (!this.lockedColors.pri) {
                        this.setHue(Math.floor(Math.random() * 360));
                    }
                    var vibModels = ["triad", "tetrad", "analogcompl", "monocompl"];
                    this.setModel(vibModels[Math.floor(Math.random() * vibModels.length)]);
                    if (this.hasSecs()) {
                        this.setAngle(Math.floor(30 + Math.random() * 30));
                    }
                    vals = [
                        [0.98, 0.98],
                        [0.65, 0.95],
                        [0.88, 0.52],
                        [0.98, 0.16],
                        [0.04, 0.99]
                    ];
                    break;

                case "muted":
                    if (!this.lockedColors.pri) {
                        this.setHue(Math.floor(Math.random() * 360));
                    }
                    var mutModels = ["analog", "analogcompl", "triad", "mono"];
                    this.setModel(mutModels[Math.floor(Math.random() * mutModels.length)]);
                    if (this.hasSecs()) {
                        this.setAngle(Math.floor(20 + Math.random() * 15));
                    }
                    vals = [
                        [0.38, 0.74],
                        [0.16, 0.92],
                        [0.42, 0.58],
                        [0.52, 0.30],
                        [0.08, 0.96]
                    ];
                    break;

                case "pastel":
                    if (!this.lockedColors.pri) {
                        this.setHue(Math.floor(Math.random() * 360));
                    }
                    var pasModels = ["mono", "analog", "triad", "analogcompl"];
                    this.setModel(pasModels[Math.floor(Math.random() * pasModels.length)]);
                    if (this.hasSecs()) {
                        this.setAngle(Math.floor(25 + Math.random() * 20));
                    }
                    vals = [
                        [0.32, 0.94],
                        [0.14, 0.98],
                        [0.28, 0.85],
                        [0.42, 0.52],
                        [0.05, 0.99]
                    ];
                    break;
            }

            if (vals) {
                if (this.varsMultiOn) {
                    if (!this.lockedColors.pri) this.varsMulti.pri.setVals(vals);
                    if (!this.lockedColors.compl && this.hasCompl()) this.varsMulti.compl.setVals(vals);
                    if (!this.lockedColors.sec && this.hasSecs()) {
                        this.varsMulti.sec1.setVals(vals);
                        this.varsMulti.sec2.setVals(vals);
                    }
                    this.varsActive = "pri";
                    this.vars = this.varsMulti.pri;
                } else {
                    this.vars.setVals(vals);
                }
            }

            this.locked = false;
            this.modelChanged();
            return this.colorChanged();
        }, i.prototype.regeneratePrimary = function() {
            this.locked = true;
            var newHue = Math.floor(Math.random() * 360);
            this.setHue(newHue);
            this.locked = false;
            this.modelChanged();
            return this.colorChanged();
        }, i.prototype.regenerateSecondary = function() {
            this.locked = true;
            if (this.hasSecs()) {
                var cur = this.angle || 0;
                var delta, attempts = 0;
                do {
                    delta = Math.floor(15 + Math.random() * 55);
                    attempts++;
                } while (Math.abs(delta - cur) < 10 && attempts < 20);
                this.setAngle(delta);
            }
            if (this.isModelFree()) {
                if (this.hasCompl()) this.setHueCompl(Math.floor(Math.random() * 360), true);
                if (this.hasSecs()) {
                    this.setHueSec(Math.floor(Math.random() * 360), 1, true);
                    this.setHueSec(Math.floor(Math.random() * 360), 2, true);
                }
            }
            this.locked = false;
            this.modelChanged();
            return this.colorChanged();
        }, i.prototype.randomizeMood = function(mood) {
            return this.generateMode(mood);
        }, i.prototype.setHarmonyMode = function(mode) {
            return this.generateMode(mode);
        }, i.prototype._verifyAndFixContrast = function(targetRatio) {
            /**
             * Post-render contrast verification.
             * After randomizeProfile commits [kS,kV] values, reads ACTUAL RGB from colorTable
             * (the lossy Paletton roundtrip may shift L by up to 0.087), checks WCAG contrast
             * for each group's text slot (index 3) vs bg slot (index 4), and corrects kV
             * via binary search if the pair falls below targetRatio.
             *
             * Slot layout: 0=primary-accent, 1=light, 2=mid, 3=text, 4=background
             */
            targetRatio = targetRatio || 4.5;
            var groups = ["pri"];
            if (this.hasSecs()) groups.push("sec1", "sec2");
            if (this.hasCompl()) groups.push("compl");

            var changed = false;
            for (var gi = 0; gi < groups.length; gi++) {
                var grp = groups[gi];
                if (!this.colorTable || !this.colorTable.byPalette || !this.colorTable.byPalette[grp]) continue;

                var palette = this.colorTable.byPalette[grp]; // array of 5 color objects
                if (!palette[3] || !palette[4]) continue;

                var textRgb  = palette[3].rgb;
                var bgRgb    = palette[4].rgb;
                if (!textRgb || !bgRgb) continue;

                var contrast = oklch.calcWcagContrast(textRgb, bgRgb);
                if (contrast >= targetRatio) continue; // already good

                // Contrast failed — fix by adjusting kV of slot 3 (text) via binary search
                var varsObj = this.varsMultiOn ? this.varsMulti[grp] : this.vars;
                if (!varsObj) continue;
                var vals = varsObj.getVals();

                var bgRgbOklch = oklch.srgbToOklch(bgRgb.r, bgRgb.g, bgRgb.b);
                var textRgbOklch = oklch.srgbToOklch(textRgb.r, textRgb.g, textRgb.b);

                // Direction: if bg is dark, text goes lighter; if bg is light, text goes darker
                var bgL = bgRgbOklch.L;
                var dir = bgL > 0.5 ? -1 : 1; // dir=-1 means text goes darker, +1 means lighter

                var gHue = (grp === "pri" ? this.hue : (grp === "compl" ? this.hueCompl : (grp === "sec1" ? this.hueSec1 : this.hueSec2))) || this.hue;

                var lo = 0, hi = 1;
                for (var iter = 0; iter < 20; iter++) {
                    var mid = (lo + hi) / 2;
                    var tryL = dir === 1 ? (mid) : (1 - mid);
                    var tryRgb = oklch.oklchToSrgb(tryL, textRgbOklch.C, textRgbOklch.H);
                    var tryContrast = oklch.calcWcagContrast(tryRgb, bgRgb);
                    if (tryContrast >= targetRatio) {
                        hi = mid;
                    } else {
                        lo = mid;
                    }
                }
                var fixedL = dir === 1 ? hi : (1 - hi);
                var fixedRgb = oklch.oklchToSrgb(fixedL, textRgbOklch.C, textRgbOklch.H);
                var fixedCol = new o(gHue);
                fixedCol.setByRGB(fixedRgb);
                vals[3] = [fixedCol.kS, fixedCol.kV];
                varsObj.setVals(vals);
                changed = true;
            }

            if (changed) {
                // Re-render after contrast fixes without triggering storePalette again
                this.calcColorTable();
            }
        }, i.prototype._extractCandidateColors = function(profileId, seed, options) {
            // Silently generate a palette candidate without side effects (no UI updates)
            options = options || {};
            var prof = oklch.OKLCH_PROFILES[profileId];
            if (!prof) return null;

            var chaos = options.chaos !== undefined ? options.chaos : (this.chaos || 1.0);
            var targetRatio = options.targetRatio || 4.5;
            var rng = oklch.mulberry32(oklch.stringToSeed(seed));

            var baseHue = prof.hues[Math.floor(rng() * prof.hues.length)];
            var hueJitter = oklch.randomGaussian(rng, 0, 10 * chaos);
            var finalHue = Math.round((baseHue + hueJitter + 360) % 360);

            var curve = prof.curve;

            // Same OKLCH hue correction as randomizeProfile — Paletton wheel ≠ OKLCH angle
            var palettonHueToOklchH_c = function(wheelHue) {
                var refCol = new o(wheelHue);
                refCol.setSV(0.75, 0.80);
                if (!refCol.rgb) return wheelHue;
                var ref = oklch.srgbToOklch(refCol.rgb.r, refCol.rgb.g, refCol.rgb.b);
                return ref.C > 0.04 ? ref.H : wheelHue;
            };

            var calcRgbs = function(gHue) {
                var oklchH = palettonHueToOklchH_c(gHue);
                var rgbs = [];
                for (var s = 0; s < 5; s++) {
                    var ptL = curve[s][0];
                    var ptC = curve[s][1];
                    var lJ = oklch.randomGaussian(rng, 0, 0.015 * chaos);
                    var cJ = oklch.randomGaussian(rng, 0, 0.01 * chaos);
                    var fL = Math.max(0.02, Math.min(0.99, ptL + lJ));
                    var fC = Math.max(0.005, Math.min(0.35, ptC + cJ));
                    rgbs[s] = oklch.oklchToSrgb(fL, fC, oklchH);
                }
                var bgRgb = rgbs[4];
                var textFit = oklch.fitContrast({ L: curve[3][0], C: curve[3][1], H: oklchH }, bgRgb, targetRatio);
                rgbs[3] = textFit.rgb;
                return rgbs;
            };

            var pickedModel = prof.models[Math.floor(rng() * prof.models.length)];
            var minA = prof.angle ? prof.angle[0] : 25;
            var maxA = prof.angle ? prof.angle[1] : 35;
            var midA = (minA + maxA) * 0.5;
            var angle = Math.max(15, Math.min(75, Math.round(midA + oklch.randomGaussian(rng, 0, 4 * chaos))));

            // Compute harmony hues
            var modelObj = (typeof u !== "undefined" && u) ? u[pickedModel] : null;
            var hueCompl = modelObj ? modelObj.getComplement(finalHue) : (finalHue + 180) % 360;
            var hueSec1 = modelObj ? modelObj.getSec1(finalHue, angle) : (finalHue + angle) % 360;
            var hueSec2 = modelObj ? modelObj.getSec2(finalHue, angle) : (finalHue - angle + 360) % 360;

            return {
                hue: finalHue,
                model: pickedModel,
                angle: angle,
                pri: calcRgbs(finalHue),
                sec1: hueSec1 != null ? calcRgbs(hueSec1) : null,
                sec2: hueSec2 != null ? calcRgbs(hueSec2) : null,
                compl: hueCompl != null ? calcRgbs(hueCompl) : null,
                seed: seed,
                profileId: profileId
            };
        }, i.prototype.randomizeQuick = function() {
            var allProfiles = Object.keys(oklch.OKLCH_PROFILES);
            var last2 = (this.lastProfiles && this.lastProfiles.length >= 2) ? this.lastProfiles.slice(0, 2) : (this.lastProfiles || []);

            // Weighted pool: exclude last 2 profiles
            var pool = allProfiles.filter(function(k) { return last2.indexOf(k) === -1; });
            if (!pool.length) pool = allProfiles;

            var self = this;
            var history = [];
            try {
                var hist = JSON.parse(localStorage.getItem("pal_history") || "[]");
                for (var h = 0; h < Math.min(5, hist.length); h++) {
                    history.push({ hue: hist[h].hue });
                }
            } catch(e) {}

            var CANDIDATE_COUNT = 20;
            var bestCandidate = null;
            var bestScore = -1;
            var chaos = this.chaos || 1.0;

            for (var ci = 0; ci < CANDIDATE_COUNT; ci++) {
                var candSeed = oklch.generateSeed() + "_" + ci;
                var profId = pool[Math.floor(Math.random() * pool.length)];
                var candidate = null;
                try {
                    candidate = this._extractCandidateColors(profId, candSeed, { chaos: chaos });
                } catch(e) { continue; }
                if (!candidate) continue;

                var score = oklch.scorePaletteCandidate(candidate, oklch.OKLCH_PROFILES[profId], history, {});
                if (score.totalScore > bestScore) {
                    bestScore = score.totalScore;
                    bestCandidate = candidate;
                }
            }

            if (bestCandidate) {
                return this.randomizeProfile(bestCandidate.profileId, { seed: bestCandidate.seed, chaos: chaos });
            }

            // Fallback: pick any profile
            var p = pool[Math.floor(Math.random() * pool.length)];
            return this.randomizeProfile(p, { seed: oklch.generateSeed() });
        }, i.prototype.randomizeWCAG = function(targetRatio) {
            targetRatio = targetRatio || 4.5;
            this.locked = true;

            var newSeed = oklch.generateSeed();
            this.currentSeed = newSeed;
            var rng = oklch.mulberry32(oklch.stringToSeed(newSeed));

            if (!this.lockedColors.pri) {
                var newHue = Math.floor(rng() * 360);
                this.setHue(newHue);
            }
            if (!this.lockedColors.sec) {
                var models = ["triad", "tetrad", "analogcompl", "monocompl", "analog", "mono"];
                var mId = models[Math.floor(rng() * models.length)];
                this.setModel(mId);
                if (this.hasSecs()) {
                    var angle = Math.floor(25 + rng() * 35);
                    this.setAngle(angle);
                }
            }

            var isAAA = targetRatio >= 7.0;
            var bgL = isAAA ? 0.99 : 0.96;
            var textL = isAAA ? 0.12 : 0.20;
            var priL = isAAA ? 0.40 : 0.52;

            var curve = [
                [priL, 0.18],
                [0.93, 0.04],
                [0.68, 0.14],
                [textL, 0.04],
                [bgL, 0.005]
            ];

            var calcGroupVals = function(gHue) {
                var rgbs = [];
                for (var s = 0; s < 5; s++) {
                    rgbs[s] = oklch.oklchToSrgb(curve[s][0], curve[s][1], gHue);
                }
                var bgRgb = rgbs[4];
                var fittedText = oklch.fitContrast({ L: curve[3][0], C: curve[3][1], H: gHue }, bgRgb, targetRatio);
                rgbs[3] = fittedText.rgb;

                var priTarget = isAAA ? 4.5 : 3.0;
                var fittedPri = oklch.fitContrast({ L: curve[0][0], C: curve[0][1], H: gHue }, bgRgb, priTarget);
                rgbs[0] = fittedPri.rgb;

                var res = [];
                for (var k = 0; k < 5; k++) {
                    var col = new o(gHue);
                    col.setByRGB(rgbs[k]);
                    res[k] = [col.kS, col.kV];
                }
                return res;
            };

            var priVals = calcGroupVals(this.hue);
            if (this.varsMultiOn) {
                if (!this.lockedColors.pri) this.varsMulti.pri.setVals(priVals);
                if (!this.lockedColors.compl && this.hasCompl()) this.varsMulti.compl.setVals(calcGroupVals(this.hueCompl));
                if (!this.lockedColors.sec && this.hasSecs()) {
                    this.varsMulti.sec1.setVals(calcGroupVals(this.hueSec1));
                    this.varsMulti.sec2.setVals(calcGroupVals(this.hueSec2));
                }
                this.varsActive = "pri";
                this.vars = this.varsMulti.pri;
            } else {
                this.vars.setVals(priVals);
            }

            this.locked = false;
            this.modelChanged();
            this.colorChanged();
            t.trigger("palette/seed/changed", { seed: this.currentSeed });
            return this.getContrastReport();
        }, i.prototype.randomize = function(e, t, n, i) {
            var o, u, a, f, l, c, h;
            this.locked = !0, h = this;
            if (e) {
                a = m[this.modelID], f = r.rnd(1, 7);
                while (f === a) f = r.rnd(1, 7);
                this.setModel(v(f)), this.switchVars(r.rnd(1, 10) > 8)
            }
            return t && (u = r.rnd(t * 30, t * 180), c = r.rndSign(), this.addHue(u * c), this.isModelFree() && (this.hasCompl() && (u = r.rnd(t * 30, t * 180), c = r.rndSign(), this.setHueCompl(this.hueCompl + u * c, !0)), this.hasSecs() && (u = r.rnd(t * 30, t * 180), c = r.rndSign(), this.setHueSec(this.hueSec1 + u * c, 1, !0), u = r.rnd(t * 30, t * 180), c = r.rndSign(), this.setHueSec(this.hueSec2 + u * c, 2, !0)))), n && (this.isModelFree() || (o = r.rnd(n * 15, n * 120), c = r.rndSign(), this.setHueSec(this.hue + this.angle + o * c))), i && (l = function(e) {
                var t, n, o, u;
                return u = 50, i > .5 && (h.vars = e, n = s.getPresetCount(), f = r.rnd(0, n - 1), h.setPreset(s.getPresetId(f)), u = 20), o = r.rnd(-u * i, u * i), e.addSaturation(o / 100), o = r.rnd(-u * i, u * i), e.addBright(o / 100), t = (Math.random() * Math.PI - Math.PI / 2) * i, u = r.rnd(100 - 75 * i, 100 + 75 * i), e.rotate(t, u / 100)
            }, this.varsMultiOn ? (l(this.varsMulti.pri), l(this.varsMulti.compl), l(this.varsMulti.sec1), l(this.varsMulti.sec2), this.varsActive = "pri", this.vars = this.varsMulti.pri) : l(this.vars)), this.locked = !1, e && this.modelChanged(), this.colorChanged()
        }, i.prototype.getSerialized = function() {
            var e, t, n, i, s;
            i = "", s = m[this.modelID], n = s === 10, n && (s += this.hueCnt - 2), i += r.myB64.encodeInt(s, 1), i += r.myB64.encodeInt(Math.round(this.hue), 2);
            if (n) {
                if (this.hueCnt === 2 || this.hueCnt === 4) i += r.myB64.encodeInt(Math.round(this.hueCompl), 2);
                this.hueCnt > 2 && (i += r.myB64.encodeInt(Math.round(this.hueSec1), 2), i += r.myB64.encodeInt(Math.round(this.hueSec2), 2))
            } else i += r.myB64.encodeInt(Math.round(this.angle), 2);
            return t = [this.varsMultiOn], i += r.myB64.encodeFlags(t), e = function(e) {
                var t;
                return t = e.getSerialized(), i += r.myB64.encodeInt(t.length, 1), i += t
            }, this.varsMultiOn ? (e(this.varsMulti.pri), this.hasCompl() && e(this.varsMulti.compl), this.hasSecs() && (e(this.varsMulti.sec1), e(this.varsMulti.sec2))) : e(this.vars), i
        }, i.prototype.setSerialized = function(e) {
            var t, n, i, s, o, u, a, f, l;
            if (!r.myB64.isValidString(e)) return !1;
            a = this, i = !1, s = 0, u = e.substring(s, s + 1), f = r.myB64.decodeInt(u, 1);
            if (f >= 10) i = !0, t = f - 10 + 2;
            else {
                this.setModel(v(f));
                switch (f) {
                    case 1:
                        t = 1;
                        break;
                    case 2:
                        t = 2;
                        break;
                    case 3:
                    case 5:
                        t = 3;
                        break;
                    default:
                        t = 4
                }
            }
            s += 1, u = e.substring(s, s + 2), f = r.myB64.decodeInt(u, 2), this.setHue(f), s += 2;
            if (i) {
                if (t === 2 || t === 4) u = e.substring(s, s + 2), f = r.myB64.decodeInt(u, 2), this.hueCompl = f, s += 2;
                t > 2 && (u = e.substring(s, s + 2), f = r.myB64.decodeInt(u, 2), this.hueSec1 = f, s += 2, u = e.substring(s, s + 2), f = r.myB64.decodeInt(u, 2), this.hueSec2 = f, s += 2), this.setModelFree(t)
            } else u = e.substring(s, s + 2), f = r.myB64.decodeInt(u, 2), f < 5 && (f = 5), f > 175 && (f = 175), this.setAngle(f), s += 2;
            return u = e.substring(s, s + 1), l = r.myB64.decodeFlags(u), this.varsMultiOn = l[0], n = l[1], s += 1, o = function(t) {
                var n;
                return u = e.substring(s, s + 1), n = r.myB64.decodeInt(u, 1), s += 1, u = e.substring(s, s + n), t.setSerialized(u), s += n, t
            }, this.varsMultiOn ? (o(this.varsMulti.pri), (t === 2 || t === 4) && o(this.varsMulti.compl), t > 2 && (o(this.varsMulti.sec1), o(this.varsMulti.sec2)), this.setVarsActive("pri")) : o(this.vars), !0
        }, i.prototype.calcColorTable = function() {
            var e, t, n;
            return this.colorTable = {
                byPalette: {},
                sorted: {},
                byLum: {}
            }, n = this, t = function(e, t) {
                var n, r;
                return n = e.getLum(), r = t.getLum(), n < r ? 1 : n > r ? -1 : 0
            }, e = function(e) {
                var r, i, s, u, a, f, l, c;
                r = n.col[e];
                if (!r) return null;
                a = [], f = [], l = [];
                for (s = c = 0; c <= 4; s = ++c) i = new o(r.baseHSV.h), u = n.getVar(s, e), i.setSV(u[0], u[1]), a[s] = i, l[s] = i, s > 0 && f.push(i);
                return f.sort(t), f.unshift(a[0]), l.sort(t), n.colorTable.byPalette[e] = a, n.colorTable.sorted[e] = f, n.colorTable.byLum[e] = l
            }, e("pri"), e("sec1"), e("sec2"), e("compl")
        }, i.prototype.getSimpleColorTable = function() {
            var e, t, n;
            return n = this, e = function(e) {
                var t, r, i, s, o, u, a;
                o = {}, a = n.colorTable[e];
                for (s in a) {
                    r = a[s], t = [];
                    for (i = u = 0; u <= 4; i = ++u) t.push(r[i].rgb.getHex(!0));
                    o[s] = t
                }
                return o
            }, t = {}, t.byPalette = e("byPalette"), t.byLum = e("byLum"), t
        }, i.prototype.getTonalScales = function(options) {
            var res = {}, groups = ["pri"], idx, k, rgb;
            this.hasSecs() && groups.push("sec1", "sec2");
            this.hasCompl() && groups.push("compl");
            for (idx = 0; idx < groups.length; idx++) {
                k = groups[idx];
                if (this.col[k] && this.col[k].rgb) {
                    rgb = this.col[k].rgb;
                    res[k] = oklch.generateTonalScale(rgb.r, rgb.g, rgb.b, options);
                }
            }
            return res;
        }, i.prototype.getColorCode = function(e, t, n, r, i) {
            var s, o;
            return this.col[e] || (e = "pri"), n || (n = "byPalette"), s = this.colorTable[n][e][t], o = s.rgb, r && this.converter && this.converter.on && (o = c.convert(o, this.converter)), i > 0 ? o.getCSS(i) : i < 0 ? o : o.getHex(!0)
        }, i.prototype.colorize = function(e, t, n) {
            var r, i, s, o, u, a, f, l, c, h, p, d, v, m, g;
            if (!e || !e.length) return;
            d = {
                bgcol: "background",
                col: "color",
                bdcol: "border-color"
            }, e.toggleClass("no-compl", !this.hasCompl()), e.toggleClass("no-secs", !this.hasSecs()), v = t ? "sorted" : "byPalette", g = ["pri", "sec1", "sec2", "compl"];
            for (c in g) {
                o = g[c], u = o;
                for (l = m = 0; m <= 4; l = ++m) {
                    i = this.getColorCode(u, l, v, n, -1), s = this.getColorCode(u, l, "byLum", n, -1), a = i.getHex(), f = s.getHex();
                    for (h in d) p = d[h], r = e.find("." + h + "-" + o + "-" + l).css(p, "#" + a), h === "bgcol" && (r.prop("title", a), r.attr("col-data", a)), r = e.find("." + h + "-" + o + "-lum-" + l).css(p, "#" + f), h === "bgcol" && (r.prop("title", f), r.attr("col-data", f))
                }
            }
            if (this.typography && e && e.length) {
                try {
                    var docElem = e[0].ownerDocument ? e[0].ownerDocument.documentElement : null;
                    if (docElem && docElem.style) {
                        var typo = this.typography;
                        if (typo.heading) docElem.style.setProperty('--font-heading', typo.heading);
                        if (typo.body) docElem.style.setProperty('--font-body', typo.body);
                        if (typo.weightHeading) docElem.style.setProperty('--font-weight-heading', typo.weightHeading);
                        if (typo.letterSpacing) docElem.style.setProperty('--letter-spacing-heading', typo.letterSpacing);
                        if (typo.lineHeight) docElem.style.setProperty('--line-height-body', typo.lineHeight);
                        if (typo.scale) docElem.style.setProperty('--type-scale-ratio', typo.scale);
                    }
                } catch(err) {}
            }
            return !1
        }, i.prototype.lessColorize = function(e, t, n) {
            var r, i, s, o, u, a, f, l, c, h;
            if (e == null || e.modifyVars == null) return;
            f = {}, l = t ? "sorted" : "byPalette", h = ["pri", "compl", "sec1", "sec2"];
            for (a in h) {
                s = h[a], o = s;
                for (u = c = 0; c <= 4; u = ++c) r = this.getColorCode(o, u, l, n), i = this.getColorCode(o, u, "byLum", n), f["@col-" + s + "-" + u] = r, f["@col-" + s + "-lum-" + u] = i
            }
            return e.modifyVars(f)
        }, i.prototype.getSemanticTokens = function() {
            var priRgb = null, secRgb = null, complRgb = null;
            if (this.col && this.col.pri && this.col.pri.rgb) {
                priRgb = { r: this.col.pri.rgb.r, g: this.col.pri.rgb.g, b: this.col.pri.rgb.b };
            }
            if (this.col && this.col.sec1 && this.col.sec1.rgb) {
                secRgb = { r: this.col.sec1.rgb.r, g: this.col.sec1.rgb.g, b: this.col.sec1.rgb.b };
            }
            if (this.col && this.col.compl && this.col.compl.rgb) {
                complRgb = { r: this.col.compl.rgb.r, g: this.col.compl.rgb.g, b: this.col.compl.rgb.b };
            }
            if (!priRgb) {
                if (this.colorTable && this.colorTable.byPalette && this.colorTable.byPalette.pri && this.colorTable.byPalette.pri[0]) {
                    var c0 = this.colorTable.byPalette.pri[0];
                    priRgb = { r: c0.rgb.r, g: c0.rgb.g, b: c0.rgb.b };
                } else {
                    priRgb = { r: 70, g: 130, b: 220 };
                }
            }
            return oklch.generateSemanticTokens(priRgb, secRgb, complRgb);
        }, i.prototype._showExportDialog = function(title, content) {
            var $body = $(document.body);
            var $overlay = $("<div>").css({
                position: "fixed", inset: "0", background: "rgba(0,0,0,0.65)",
                zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center"
            });
            var $box = $("<div>").css({
                background: "#1e1e2e", borderRadius: "10px", padding: "20px",
                maxWidth: "700px", width: "90%", maxHeight: "80vh",
                display: "flex", flexDirection: "column", gap: "12px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)", border: "1px solid #444",
                color: "#cdd6f4", fontFamily: "JetBrains Mono, Fira Code, Consolas, monospace"
            });
            var $header = $("<div>").css({ display: "flex", alignItems: "center", justifyContent: "space-between" });
            $header.append($("<strong>").text(title).css({ fontSize: "15px" }));
            var $close = $("<button>").text("✕").css({
                background: "none", border: "none", color: "#cdd6f4", cursor: "pointer", fontSize: "18px", lineHeight: "1"
            });
            $header.append($close);
            $box.append($header);
            var $textarea = $("<textarea>").val(content).css({
                background: "#181825", border: "1px solid #555", borderRadius: "6px",
                padding: "10px", color: "#cdd6f4", fontFamily: "inherit", fontSize: "11.5px",
                resize: "none", height: "320px", width: "100%", boxSizing: "border-box",
                lineHeight: "1.6", overflowY: "auto", whiteSpace: "pre"
            }).prop("readonly", true);
            $box.append($textarea);
            var $actions = $("<div>").css({ display: "flex", gap: "8px" });
            var $copy = $("<button>").text("📋 Copy All").css({
                background: "#45475a", border: "none", borderRadius: "6px", color: "#cdd6f4",
                padding: "8px 16px", cursor: "pointer", fontFamily: "inherit", fontSize: "13px"
            });
            $copy.on("click", function() {
                try {
                    navigator.clipboard.writeText($textarea.val());
                    $copy.text("✅ Copied!");
                    setTimeout(function() { $copy.text("📋 Copy All"); }, 2000);
                } catch(e) {
                    $textarea[0].select();
                    document.execCommand("copy");
                    $copy.text("✅ Copied!");
                    setTimeout(function() { $copy.text("📋 Copy All"); }, 2000);
                }
            });
            $actions.append($copy);
            $box.append($actions);
            $overlay.append($box);
            $body.append($overlay);
            var closeDialog = function() { $overlay.remove(); };
            $close.on("click", closeDialog);
            $overlay.on("click", function(ev) { if (ev.target === $overlay[0]) closeDialog(); });
            $(document).on("keydown.exportdlg", function(ev) {
                if (ev.keyCode === 27) { closeDialog(); $(document).off("keydown.exportdlg"); }
            });
            $textarea[0].focus();
            $textarea[0].select();
        }, i.prototype["export"] = function(t) {
            var i, s, o, u;

            // Handle token-based exports with inline dialog
            if (t === "css" || t === "tailwind" || t === "dtcg" || t === "figma") {
                var tokens = this.getSemanticTokens();
                var typo = this.getTypography();
                var content, title;
                if (t === "css") {
                    title = "CSS Variables (Semantic + Tonal Scales)";
                    content = oklch.formatCssVariables(tokens, typo);
                } else if (t === "tailwind") {
                    title = "Tailwind CSS Config";
                    content = oklch.formatTailwindConfig(tokens, typo);
                } else if (t === "dtcg") {
                    title = "Design Tokens (DTCG JSON)";
                    content = oklch.formatDtcgTokens(tokens, typo);
                } else if (t === "figma") {
                    title = "Figma Variables (JSON)";
                    content = oklch.formatFigmaTokens(tokens, typo);
                }
                if (content) {
                    this._showExportDialog(title, content);
                    return;
                }
            }

            // Legacy server-based export
            return u = this, t === "html" ? s = [1, 2, 0, 3, 4] : s = [0, 1, 2, 3, 4], i = function(e, t, n) {
                var i, o, a, f, l;
                f = '"' + t + '":{"ttl":"' + n + '","col":[';
                for (i = l = 0; l <= 4; i = ++l) o = s[i], a = u.getColorCode(e, o, "byPalette", !1, -1), i > 0 && (f += ","), f += '{"idx":' + o + ',"hex":"' + a.getHex() + '","r":' + a.r + ',"g":' + a.g + ',"b":' + a.b + ',"r0":' + r.round(a.r / 255, 3) + ',"g0":' + r.round(a.g / 255, 3) + ',"b0":' + r.round(a.b / 255, 3) + "}";
                return f += "]}", f
            }, o = '{"type":"' + t + '","id":"' + this.uid + '","scheme":{', o += i("pri", "primary", n("color.pri")), this.hasSecs() && (o += "," + i("sec1", "secondary-1", n("color.sec") + " (1)"), o += "," + i("sec2", "secondary-2", n("color.sec") + " (2)")), this.hasCompl() && (o += "," + i("compl", "complement", n("color.compl"))), o += "}}", r.sendRequest(e.urls["export"].url, "POST", {
                data: o
            }, "_blank")
        }, i.prototype.exportImg = function() {
            return new h(this, $("body"))
        }, i.prototype.copy = function(e) {
            var t;
            return this.isModelFree() ? (t = new i("mono", this.hue, 30, e), t.setModelFree(this.hueCnt), t.hueCompl = this.hueCompl, t.hueSec1 = this.hueSec1, t.hueSec2 = this.hueSec2, t.updateCompl(), t.updateSecs()) : t = new i(this.modelID, this.hue, this.angle, e), t.setVars(this.vars.values), t.colorChanged(), t
        }, i.prototype.getTypographyPairs = function() {
            return TYPOGRAPHY_PAIRS;
        }, i.prototype.getTypography = function() {
            return this.typography || TYPOGRAPHY_PAIRS[0];
        }, i.prototype.setTypography = function(e) {
            var typo = null;
            if (typeof e === "string") {
                for (var j = 0; j < TYPOGRAPHY_PAIRS.length; j++) {
                    if (TYPOGRAPHY_PAIRS[j].id === e) {
                        typo = TYPOGRAPHY_PAIRS[j];
                        break;
                    }
                }
            } else if (e && e.heading) {
                typo = e;
            }
            if (!typo) typo = TYPOGRAPHY_PAIRS[0];
            this.typography = typo;
            t.trigger("palette/typography/changed", this.typography);
            return this.typography;
        }, i.prototype.generateWildTypography = function(preferredCategory, rng) {
            rng = rng || Math.random;

            // Detect Cyrillic context (app language = 'ru' or 'uk')
            var needsCyrillic = (typeof window !== "undefined" && window._Paletton && window._Paletton.locale &&
                (window._Paletton.locale === "ru" || window._Paletton.locale === "uk")) ? true : false;

            // Only include headings with Cyrillic support when needed
            var headingList = needsCyrillic ? [
                { name: "Russo One", font: "'Russo One', 'Impact', sans-serif", weights: ["900"], cyrillic: true },
                { name: "JetBrains Mono", font: "'JetBrains Mono', Consolas, monospace", weights: ["700"], cyrillic: true },
                { name: "Nunito", font: "'Nunito', 'Comfortaa', -apple-system, sans-serif", weights: ["700", "800"], cyrillic: true },
                { name: "Roboto", font: "Roboto, 'Segoe UI', sans-serif", weights: ["700", "900"], cyrillic: true },
                { name: "Ubuntu", font: "'Ubuntu', 'Segoe UI', sans-serif", weights: ["700"], cyrillic: true },
                { name: "PT Sans", font: "'PT Sans', 'Segoe UI', sans-serif", weights: ["700"], cyrillic: true },
                { name: "Cormorant", font: "'Cormorant', 'Cormorant Garamond', Georgia, serif", weights: ["600", "700"], cyrillic: true },
                { name: "Exo 2", font: "'Exo 2', Roboto, sans-serif", weights: ["700", "800"], cyrillic: true },
                { name: "Montserrat", font: "Montserrat, 'Segoe UI', sans-serif", weights: ["700", "800", "900"], cyrillic: true },
                { name: "Impact", font: "Impact, 'Arial Black', sans-serif", weights: ["900"], cyrillic: true },
                { name: "Arial Black", font: "'Arial Black', Impact, sans-serif", weights: ["900"], cyrillic: true },
                { name: "Georgia", font: "Georgia, 'Times New Roman', serif", weights: ["700"], cyrillic: true }
            ] : [
                { name: "Press Start 2P", font: "'Press Start 2P', 'VT323', monospace", weights: ["400"], cyrillic: false },
                { name: "Orbitron", font: "'Orbitron', 'Impact', sans-serif", weights: ["700", "800", "900"], cyrillic: false },
                { name: "Cinzel", font: "'Cinzel', 'Georgia', serif", weights: ["700", "800"], cyrillic: false },
                { name: "Black Ops One", font: "'Black Ops One', 'Impact', monospace, sans-serif", weights: ["800"], cyrillic: false },
                { name: "Russo One", font: "'Russo One', 'Impact', sans-serif", weights: ["900"], cyrillic: true },
                { name: "Fredoka", font: "'Fredoka', 'Century Gothic', cursive, sans-serif", weights: ["600", "700"], cyrillic: false },
                { name: "Share Tech Mono", font: "'Share Tech Mono', 'Courier New', monospace", weights: ["700"], cyrillic: false },
                { name: "VT323", font: "'VT323', monospace", weights: ["400"], cyrillic: false },
                { name: "Nosifer", font: "'Nosifer', 'Creepster', Georgia, serif", weights: ["700"], cyrillic: false },
                { name: "M PLUS Rounded 1c", font: "'M PLUS Rounded 1c', 'Century Gothic', sans-serif", weights: ["700", "800"], cyrillic: false },
                { name: "Impact", font: "Impact, 'Arial Black', sans-serif", weights: ["900"], cyrillic: true },
                { name: "Georgia", font: "Georgia, 'Times New Roman', serif", weights: ["700"], cyrillic: true },
                { name: "Helvetica Neue", font: "'Helvetica Neue', Arial, sans-serif", weights: ["700", "800"], cyrillic: true },
                { name: "Playfair Display", font: "'Playfair Display', Georgia, serif", weights: ["700", "800"], cyrillic: false },
                { name: "Trebuchet MS", font: "'Trebuchet MS', 'Segoe UI', sans-serif", weights: ["700"], cyrillic: true },
                { name: "JetBrains Mono", font: "'JetBrains Mono', Consolas, monospace", weights: ["700"], cyrillic: true },
                { name: "Cormorant", font: "'Cormorant', 'Cormorant Garamond', Georgia, serif", weights: ["600", "700"], cyrillic: true },
                { name: "Montserrat", font: "Montserrat, 'Segoe UI', sans-serif", weights: ["700", "800"], cyrillic: true },
                { name: "Exo 2", font: "'Exo 2', Roboto, sans-serif", weights: ["700", "800"], cyrillic: true }
            ];

            var bodyList = needsCyrillic ? [
                { name: "System Sans", font: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", cyrillic: true },
                { name: "Roboto", font: "Roboto, 'Segoe UI', sans-serif", cyrillic: true },
                { name: "JetBrains Mono", font: "'JetBrains Mono', Consolas, monospace", cyrillic: true },
                { name: "Nunito", font: "'Nunito', -apple-system, sans-serif", cyrillic: true },
                { name: "PT Sans", font: "'PT Sans', 'Segoe UI', sans-serif", cyrillic: true },
                { name: "Cormorant Garamond", font: "'Cormorant Garamond', Georgia, serif", cyrillic: true }
            ] : [
                { name: "Rajdhani", font: "'Rajdhani', -apple-system, sans-serif", cyrillic: false },
                { name: "VT323", font: "'VT323', monospace", cyrillic: false },
                { name: "Share Tech Mono", font: "'Share Tech Mono', monospace", cyrillic: false },
                { name: "System Sans", font: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", cyrillic: true },
                { name: "Nunito", font: "'Nunito', -apple-system, sans-serif", cyrillic: true },
                { name: "Cormorant Garamond", font: "'Cormorant Garamond', Georgia, serif", cyrillic: true },
                { name: "JetBrains Mono", font: "'JetBrains Mono', Consolas, monospace", cyrillic: true },
                { name: "Open Sans", font: "'Open Sans', 'Segoe UI', Arial, sans-serif", cyrillic: true },
                { name: "Charter Serif", font: "'Charter', Georgia, serif", cyrillic: true },
                { name: "Helvetica Neue", font: "'Helvetica Neue', Helvetica, Arial, sans-serif", cyrillic: true },
                { name: "Roboto", font: "Roboto, 'Segoe UI', sans-serif", cyrillic: true }
            ];

            var scales = ["1.2", "1.25", "1.3", "1.333", "1.414", "1.5", "1.618"];
            // Heading-specific letter-spacing and line-heights (tight for headings)
            var headingLetterSpacings = ["-0.04em", "-0.03em", "-0.02em", "-0.01em", "0", "0.02em", "0.05em", "0.08em"];
            var headingLineHeights = ["1.0", "1.1", "1.15", "1.2", "1.25", "1.3"];
            var bodyLineHeights = ["1.45", "1.5", "1.55", "1.6", "1.65"];

            var pickedH = headingList[Math.floor(rng() * headingList.length)];
            var pickedB = bodyList[Math.floor(rng() * bodyList.length)];
            var weightH = pickedH.weights[Math.floor(rng() * pickedH.weights.length)];
            var scale = scales[Math.floor(rng() * scales.length)];
            var ls = headingLetterSpacings[Math.floor(rng() * headingLetterSpacings.length)];
            var lhH = headingLineHeights[Math.floor(rng() * headingLineHeights.length)];
            var lhB = bodyLineHeights[Math.floor(rng() * bodyLineHeights.length)];

            return {
                id: "wild_" + Math.random().toString(36).substr(2, 6),
                category: "wild",
                name: "⚡ " + pickedH.name + " + " + pickedB.name + " (" + scale + "x)",
                heading: pickedH.font,
                body: pickedB.font,
                weightHeading: weightH,
                scale: scale,
                letterSpacing: ls,
                lineHeightHeading: lhH,
                lineHeight: lhB,
                cyrillic: pickedH.cyrillic && pickedB.cyrillic
            };
        }, i.prototype.resolveTypography = function(typo) {
            // Apply Cyrillic fallbacks if context is Cyrillic and pair doesn't support it
            if (!typo) return typo;
            var needsCyrillic = (typeof window !== "undefined" && window._Paletton && window._Paletton.locale &&
                (window._Paletton.locale === "ru" || window._Paletton.locale === "uk")) ? true : false;
            if (!needsCyrillic || typo.cyrillic) return typo;
            // Clone and replace with Cyrillic alternatives
            var resolved = {};
            for (var k in typo) { if (typo.hasOwnProperty(k)) resolved[k] = typo[k]; }
            if (typo.headingCyrillic) resolved.heading = typo.headingCyrillic;
            if (typo.bodyCyrillic) resolved.body = typo.bodyCyrillic;
            resolved._cyrillicResolved = true;
            return resolved;
        }, i.prototype.randomizeTypography = function(type, profileId, rng) {
            type = (type || "").toLowerCase();
            rng = rng || Math.random;
            var curId = this.typography ? this.typography.id : "";
            var self = this;

            var needsCyrillic = (typeof window !== "undefined" && window._Paletton && window._Paletton.locale &&
                (window._Paletton.locale === "ru" || window._Paletton.locale === "uk")) ? true : false;

            if (type === "wild") {
                var wild = this.generateWildTypography(null, rng);
                return this.setTypography(wild);
            }

            // Try profile-matched pairs first (strong coupling)
            if (profileId && type !== "wild") {
                var profileMatched = TYPOGRAPHY_PAIRS.filter(function(p) {
                    if (!p.profileMatch) return false;
                    for (var m = 0; m < p.profileMatch.length; m++) {
                        if (p.profileMatch[m] === profileId || profileId.indexOf(p.profileMatch[m]) !== -1) return true;
                    }
                    return false;
                });
                // Filter Cyrillic-incompatible pairs when needed
                if (needsCyrillic) {
                    var cyrillicMatched = profileMatched.filter(function(p) { return p.cyrillic || p.headingCyrillic; });
                    if (cyrillicMatched.length > 0) profileMatched = cyrillicMatched;
                }
                if (profileMatched.length > 0 && rng() < 0.70) {
                    var available = profileMatched.filter(function(p) { return p.id !== curId; });
                    if (!available.length) available = profileMatched;
                    var picked = available[Math.floor(rng() * available.length)];
                    return this.setTypography(this.resolveTypography(picked));
                }
            }

            // Category-filtered pool fallback
            var pool = TYPOGRAPHY_PAIRS;
            if (type === "game" || type === "gaming") {
                pool = TYPOGRAPHY_PAIRS.filter(function(p) { return p.category === "game"; });
            } else if (type === "ui" || type === "web") {
                pool = TYPOGRAPHY_PAIRS.filter(function(p) { return p.category === "ui"; });
            } else if (type === "editorial") {
                pool = TYPOGRAPHY_PAIRS.filter(function(p) { return p.category === "editorial"; });
            }

            // Filter Cyrillic-incompatible when needed
            if (needsCyrillic) {
                var cyrillicPool = pool.filter(function(p) { return p.cyrillic || p.headingCyrillic; });
                if (cyrillicPool.length > 0) pool = cyrillicPool;
            }

            // 30% chance for wild when no specific profile
            if (!type || type === "all") {
                if (rng() < 0.30) {
                    var wildFallback = this.generateWildTypography(null, rng);
                    return this.setTypography(wildFallback);
                }
            }

            var available2 = pool.filter(function(p) { return p.id !== curId; });
            if (!available2.length) available2 = pool;
            var picked2 = available2[Math.floor(rng() * available2.length)];
            return this.setTypography(this.resolveTypography(picked2));
        }, i
    }(), p
});

define("ui.control.button.class", ["app.events", "util", "ui.control.dialog.class"], function(e, t, n) {
            var r;
            return r = function() {
                function e(e, n) {
                    var r, i, s;
                    this.$parent = e, i = {
                        className: "",
                        label: "",
                        asUIButton: !0,
                        disabled: !1,
                        onClick: null
                    };
                    if (!this.$parent) return;
                    s = this, this.options = t.objMerge(i, n), this.$e = $("<SPAN>", {
                        "class": "control control-button " + this.options.className
                    }), this.$parent.append(this.$e), this.$button = $("<A>", {
                        "class": "button",
                        href: "#",
                        role: "button",
                        "aria-label": this.options.label || "Action"
                    }), this.$e.append(this.$button), this.$label = $("<SPAN>", {
                        "class": "label"
                    }), this.$label.text(this.options.label), this.$button.append(this.$label), this.options.asUIButton ? r = this.$button.button() : r = this.$button, r.click(function(e) {
                        var t;
                        e.preventDefault(), s.$button.blur();
                        if (s.disabled) return;
                        return typeof(t = s.options).onClick == "function" ? t.onClick() : void 0
                    }), this.disable(this.options.disabled)
                }
                return e.prototype.setHtml = function(e) {
                    var plainText = $("<div>").html(e).text().trim();
                    if (plainText) this.$button.attr("aria-label", plainText);
                    return this.$button.html(e)
                }, e.prototype.disable = function(e) {
                    return this.disabled = !!e, this.$e.toggleClass("disabled", this.disabled)
                }, e
            }(), r
        });
    }.call(this),
    function() {
        define("ui.control.checkbox.class", ["app.events", "util"], function(e, t) {
            var n;
            return n = function() {
                function e(e, n) {
                    var r, i, s, o;
                    this.$parent = e, s = {
                        className: "",
                        label: "",
                        checked: !1,
                        disabled: !1,
                        onClick: null
                    };
                    if (!this.$parent) return;
                    o = this, this.options = t.objMerge(s, n), this.checked = this.options.checked, this.disabled = this.options.disabled, this.$e = $("<SPAN>", {
                        "class": "control control-checkbox " + this.options.className,
                        role: "checkbox",
                        tabindex: 0,
                        "aria-checked": this.checked ? "true" : "false",
                        "aria-label": this.options.label || "Checkbox"
                    }), this.$parent.append(this.$e), r = $("<SPAN>", {
                        "class": "ico ico-checkbox",
                        "aria-hidden": "true"
                    }), this.$e.append(r), i = $("<SPAN>", {
                        "class": "label"
                    }), this.$e.append(i), i.html(this.options.label), this.$e.click(function(e) {
                        var t;
                        e.preventDefault();
                        if (o.disabled) return;
                        return o.toggle(), typeof(t = o.options).onClick == "function" ? t.onClick(o.checked) : void 0
                    }).keydown(function(e) {
                        var t;
                        if (e.keyCode === 13 || e.keyCode === 32) {
                            e.preventDefault();
                            if (!o.disabled) {
                                o.toggle();
                                if (typeof(t = o.options).onClick == "function") t.onClick(o.checked);
                            }
                        }
                    }), this.check(this.checked)
                }
                return e.prototype.check = function(e) {
                    return this.checked = !!e, this.$e.attr("aria-checked", this.checked ? "true" : "false"), this.$e.toggleClass("checked", this.checked)
                }, e.prototype.toggle = function() {
                    return this.check(!this.checked)
                }, e.prototype.disable = function(e) {
                    return this.disabled = !!e, this.$e.toggleClass("disabled", this.disabled)
                }, e
            }(), n
        });
    }.call(this),
    function() {
        define("ui.control.menu.class", ["app.events", "util", "ui.control.button.class"], function(e, t, n) {
            var r;
            return r = function() {
                function n(e, n) {
                    var r, i;
                    this.$button = e, r = {
                        className: "",
                        width: "auto",
                        positionMy: "left top",
                        positionAt: "left top",
                        positionOf: null,
                        onChange: null,
                        items: []
                    }, i = this, this.options = t.objMerge(r, n), this.init()
                }
                return n.prototype.init = function() {
                    var t, n;
                    return n = this, this.$e = $("<UL>", {
                        "class": "control control-menu " + this.options.className,
                        css: {
                            position: "absolute",
                            zIndex: 9999,
                            width: this.options.width,
                            minWidth: this.$button.outerWidth()
                        }
                    }), $("body").append(this.$e), this.selected = null, t = function(e, n) {
                        var r, i, s, o, u, a, f;
                        f = [];
                        for (u = 0, a = n.length; u < a; u++) o = n[u], i = $("<LI>"), e.append(i), o.separator ? i.text("-") : (r = $("<A>", {
                            href: "#",
                            title: o.desc || ""
                        }), r.html(o.label), i.append(r), o.submenu ? (s = $("<UL>"), i.append(s), t(s, o.submenu)) : o.selected && (i.addClass("selected"), this.selected = o.id)), f.push(i.data("item", o));
                        return f
                    }, t(this.$e, this.options.items), this.$e.hide().menu({
                        select: function(t, r) {
                            var i, s;
                            i = $(r.item).data("item");
                            if (i.submenu) return;
                            return n.select(i.id), e.trigger(i.event, {
                                id: i.id,
                                data: i.data
                            }), typeof(s = n.options).onChange == "function" ? s.onChange() : void 0
                        }
                    })
                }, n.prototype.select = function(e) {
                    return this.selected = e, this.$e.find("LI").each(function() {
                        var t;
                        return t = $(this).data("item"), t.selected = t.id === e, $(this).toggleClass("selected", t.selected)
                    })
                }, n.prototype.getSelected = function() {
                    return this.$e.find("LI.selected")
                }, n.prototype.open = function() {
                    var e, t, n;
                    return n = this, t = this.$e.show().position({
                        my: this.options.positionMy,
                        at: this.options.positionAt,
                        of: this.options.positionOf || this.$button
                    }), e = $("<DIV>", {
                        "class": "ui-widget-overlay ui-front"
                    }), this.$e.before(e), setTimeout(function() {
                        return $(document).one("click", function(n) {
                            return n.preventDefault(), n.stopImmediatePropagation(), t.hide(), e.remove()
                        })
                    }, 10)
                }, n.prototype.remove = function() {
                    return this.$e.remove()
                }, n
            }(), r
        })
    }.call(this),
    function() {
        define("ui.control.model.inline.class", ["app.events", "app.locale", "util", "ui.control.button.class", "ui.control.checkbox.class", "ui.control.menu.class"], function(e, t, n, r, i, s) {
            var o, u, a;
            return a = ["mono", "monocompl", "analog", "analogcompl", "triad", "triadcompl", "tetrad", "free"], u = {
                monocompl: "mono",
                analogcompl: "analog",
                triadcompl: "triad"
            }, o = function() {
                function o(e, t, r) {
                    var i, s;
                    this.palette = e, this.$parent = t, i = {
                        className: "control control-model-inline"
                    };
                    if (!this.$parent) return;
                    s = this, this.options = n.objMerge(i, r), this.selected = null, this.init()
                }
                return o.prototype.init = function() {
                    var n, r, s, o, u, f, l;
                    o = this, e.register("palette/model/changed", function() {
                        return o.setByPalette()
                    }), this.$e = $("<DIV>", {
                        "class": this.options.className
                    }), this.$parent.append(this.$e), l = ["mono", "analog", "triad", "tetrad", "free"];
                    for (u = 0, f = l.length; u < f; u++) {
                        s = l[u];
                        var modelTitle = t("model.list." + s + ".title") || t("model.list." + s + ".short") || s;
                        n = $("<A>", {
                            href: "#",
                            "class": "model model-" + s,
                            title: modelTitle,
                            "aria-label": modelTitle,
                            role: "button"
                        });
                        this.$e.append(n);
                        r = $("<SPAN>", {
                            "class": "ico ico-model ico-model-" + s,
                            "aria-hidden": "true"
                        });
                        n.append(r);
                        n.data("id", s);
                        n.click(function(e) {
                            var t;
                            return e.preventDefault(), s = $(this).data("id"), s === "free" ? (t = o.palette.hueCnt, o.palette.setModelFree(t)) : o.palette.setModel(s), o.setByPalette()
                        });
                    }
                    return r = $("<DIV>", {
                        "class": "info"
                    }), this.$e.append(r), this.$desc = $("<DIV>", {
                        "class": "desc"
                    }), r.append(this.$desc), this.$note = $("<DIV>", {
                        "class": "note"
                    }), r.append(this.$note), this.compl = new i(r, {
                        label: t("model.addCompl"),
                        onClick: function(e) {
                            var t;
                            return t = $.inArray(o.palette.modelID, a), e ? t++ : t--, s = a[t], o.palette.setModel(s, o.palette.model.swapped), o.setByPalette()
                        }
                    }), this.setByPalette()
                }, o.prototype.setByPalette = function() {
                    var e, n, i, o, a, f, l;
                    o = this.palette.modelID, n = o === "monocompl" || o === "analogcompl" || o === "triadcompl", this.compl.check(n), this.compl.$e.toggle(o !== "tetrad" && o !== "free");
                    if (o === "free") {
                        this.$desc.empty(), e = new r(this.$desc, {
                            className: "",
                            asUIButton: !1,
                            label: t("model.list." + o + ".short") + " – " + this.palette.hueCnt + " " + t("color.colors", 1) + "  ▾",
                            onClick: function() {
                                return f.open()
                            }
                        }), a = [];
                        for (i = l = 2; l <= 4; i = ++l) a.push({
                            label: i + " " + t("color.colors", 1),
                            selected: i === this.palette.hueCnt,
                            event: "palette/model/free",
                            id: i
                        });
                        f = new s(e.$e, {
                            className: "menu-lang",
                            positionMy: "center top",
                            positionAt: "center+5 top",
                            items: a
                        }), this.$note.text(t("model.list.free.desc")).show()
                    } else this.$desc.html(t("model.list." + o + ".short") + " (" + t("model.list." + o + ".desc") + ")"), this.$note.hide();
                    return this.$e.toggleClass("compl", n), this.$e.find(".model.selected").removeClass("selected"), n && (o = u[o]), this.$e.find(".model-" + o).addClass("selected")
                }, o
            }(), o
        });
    }.call(this),
    function() {
        define("geometry.plane.class", [], function() {
            var e;
            return e = function() {
                function e(e, t) {
                    this.$canvas = e;
                    if (!this.$canvas) return;
                    t ? this.originPos = origin : this.originPos = {
                        top: Math.floor(this.$canvas.height() / 2),
                        left: Math.floor(this.$canvas.width() / 2)
                    }
                }
                return e.prototype.getCanvasPos = function(e, t) {
                    return {
                        left: e + this.originPos.left,
                        top: t + this.originPos.top
                    }
                }, e.prototype.getPagePos = function(e, t) {
                    var n;
                    return n = this.$canvas.offset(), {
                        left: e + this.originPos.left + n.left,
                        top: t + this.originPos.top + n.top
                    }
                }, e.prototype.getXYbyCanvasPos = function(e) {
                    return {
                        x: e.left - this.originPos.left,
                        y: e.top - this.originPos.top
                    }
                }, e.prototype.getXYbyPagePos = function(e) {
                    var t;
                    return t = this.$canvas.offset(), {
                        x: e.left - t.left - this.originPos.left,
                        y: e.top - t.top - this.originPos.top
                    }
                }, e
            }(), e
        })
    }.call(this),
    function() {
        define("util.debouncer.class", [], function() {
            var e;
            return e = function() {
                function e(e, t) {
                    this.maxFPS = e, this.targetHandler = t, this.maxFPS ? (this.on = !0, this.delay = Math.round(1e3 / e), this.lastTick = null, this.lastEvent = null, this.timerID = null) : this.on = !1
                }
                return e.prototype.debounce = function(e) {
                    var t, n = this;
                    return this.on ? this.timerID ? this.lastEvent = e : (t = new Date, t = t.getTime(), this.lastTick && t - this.lastTick <= this.delay ? this.timerID = setTimeout(function() {
                        return n.handleDebounced()
                    }, this.delay) : this.handleDebounced(e)) : this.handleDebounced(e)
                }, e.prototype.stop = function() {
                    return this.handleDebounced()
                }, e.prototype.handleDebounced = function(e) {
                    var t;
                    return t = new Date, this.lastTick = t.getTime(), e || (e = this.lastEvent), this.timerID && (clearTimeout(this.timerID), this.timerID = null), this.targetHandler(e)
                }, e
            }(), e
        })
    }.call(this),
    function() {
        define("ui.drag", ["util.debouncer.class"], function(e) {
            var t;
            return t = {
                start: function(n, r, i) {
                    var s;
                    return this.control = n, t.on ? !1 : (i ? t.debouncer = new e(i, t.move) : t.debouncer = null, t.on = !0, $(document).on("mousemove touchmove", t.moveDebounced), $(document).on("mouseup touchend", t.stop), typeof(s = t.control).onDragStart == "function" && s.onDragStart(), t.move(r))
                },
                stop: function(e) {
                    var n, r;
                    return $(document).off("mousemove touchmove", t.moveDebounced), $(document).off("mouseup touchend", t.stop), (r = this.debouncer) != null && r.stop(), typeof(n = t.control).onDragStop == "function" && n.onDragStop(), t.on = !1
                },
                moveDebounced: function(e) {
                    return t.debouncer ? t.debouncer.debounce(e) : t.move(e)
                },
                move: function(e) {
                    var n, r, i;
                    return r = e.originalEvent, n = {
                        pos: {
                            left: r.pageX,
                            top: r.pageY
                        },
                        shiftKey: e.shiftKey,
                        altKey: e.altKey
                    }, typeof(i = t.control).onDragMove == "function" ? i.onDragMove(n) : void 0
                }
            }, t
        })
    }.call(this),
    function() {
        define("ui.control.dot.class", ["app.events", "util", "ui.drag", "geometry.plane.class", "geometry.point.class"], function(e, t, n, r, i) {
            var s;
            return s = function() {
                function s(e, s) {
                    var o, u;
                    this.$parent = e, o = {
                        className: "",
                        classOver: "over",
                        classActive: "active",
                        title: "",
                        width: 17,
                        height: 17,
                        zindex: 99,
                        opacity: 1,
                        limit: null,
                        dragable: !0,
                        onDragStart: null,
                        onDragMove: null,
                        onBeforeDragMove: null,
                        onDragStop: null,
                        drawOnMove: !1,
                        maxFPS: 0,
                        data: null
                    };
                    if (!this.$parent) return;
                    u = this, this.options = t.objMerge(o, s), this.data = this.options.data || {}, this.drag = {
                        on: !1
                    }, this.visible = !0, this.parW = this.$parent.width(), this.parH = this.$parent.height(), this.plane = new r(this.$parent), this.point = new i(this.plane), this.options.limit && this.point.setLimit(this.options.limit), this.$e = $("<DIV>", {
                        "class": "control control-dot " + this.options.className,
                        title: this.options.title
                    }).css({
                        position: "absolute",
                        width: this.options.width + "px",
                        height: this.options.height + "px",
                        zIndex: this.options.zindex,
                        opacity: this.options.opacity
                    }).data("control", this), this.options.dragable && this.$e.mouseenter(function(e) {
                        return $(this).addClass(u.options.classOver)
                    }).mouseleave(function(e) {
                        return $(this).removeClass(u.options.classOver)
                    }).on("mousedown touchstart", function(e, t) {
                        return t && (e = t), n.start(u, e, u.options.maxFPS), !1
                    }), e.append(this.$e), this.draw()
                }
                return s.prototype.setXY = function(e, t) {
                    return this.point.setXY(e, t), this.draw()
                }, s.prototype.setDeltaXY = function(e, t) {
                    return this.point.setXY(this.point.x + e, this.point.y + t), this.draw()
                }, s.prototype.setPolar = function(e, t) {
                    return this.point.setPolar(e, t), this.draw()
                }, s.prototype.doLimit = function() {
                    return this.point.doLimit()
                }, s.prototype.setData = function(e, t) {
                    return this.data[e] = t
                }, s.prototype.getData = function(e) {
                    return this.data[e]
                }, s.prototype.show = function() {
                    if (this.visible) return;
                    return this.visible = !0, this.$e.show()
                }, s.prototype.hide = function() {
                    if (!this.visible) return;
                    return this.visible = !1, this.$e.hide()
                }, s.prototype.fadeOut = function() {
                    return this.$e.fadeOut()
                }, s.prototype.fadeIn = function() {
                    return this.$e.fadeIn()
                }, s.prototype.draw = function() {
                    var e, t;
                    if (!this.visible) return;
                    return e = this.point.getLimited(), t = e.getCanvasPos(), this.$e.css({
                        left: Math.floor(t.left - this.options.width / 2) + "px",
                        top: Math.floor(t.top - this.options.height / 2) + "px"
                    })
                }, s.prototype.onDragStart = function() {
                    var t;
                    return e.trigger("drag/start"), this.$e.addClass(this.options.classActive), typeof(t = this.options).onDragStart == "function" ? t.onDragStart(this.point, this.options.data) : void 0
                }, s.prototype.onDragStop = function() {
                    var t;
                    return e.trigger("drag/stop"), this.$e.removeClass(this.options.classActive), typeof(t = this.options).onDragStop == "function" ? t.onDragStop(this.point, this.options.data) : void 0
                }, s.prototype.onDragMove = function(e) {
                    var t;
                    return this.options.onBeforeDragMove != null && (this.data.beforeMoveData = this.options.onBeforeDragMove(e, this.point, this.options.data)), this.point.setXYByPagePos(e.pos), this.options.drawOnMove && this.draw(), typeof(t = this.options).onDragMove == "function" ? t.onDragMove(e, this.point, this.data) : void 0
                }, s
            }(), s
        })
    }.call(this),
    function() {
        define("ui.control.variator.class", ["ui.control.dot.class", "color.presets", "app.events", "util"], function(e, t, n, r) {
            var i;
            return i = function() {
                function t(t, i, s) {
                    var o, u, a, f, l, c;
                    this.$parent = t, this.palette = i, o = {
                        className: "control control-variator",
                        maxFPS: 0,
                        radius: 100,
                        radiusTreshold: 25,
                        mirror: [3, 2, 1, 0],
                        onChange: null
                    };
                    if (!this.$parent || !this.palette) return;
                    f = this, this.options = r.objMerge(o, s), this.freeMode = !1, this.radius = this.options.radius, this.radiusTreshold = this.options.radiusTreshold, a = Math.floor(this.$parent.width() / 2) + 1 - this.radius, l = Math.floor(this.$parent.height() / 2) + 1 - this.radius, this.$e = $("<DIV>", {
                        "class": this.options.className
                    }).css({
                        position: "absolute",
                        left: a,
                        top: l,
                        width: Math.round(this.radius * 2) + "px",
                        height: Math.round(this.radius * 2) + "px"
                    }).data("control", this), this.$parent.append(this.$e), this.dot = [], this.dot[0] = new e(this.$e, {
                        className: "small pri",
                        width: 13,
                        height: 13,
                        maxFPS: this.options.maxFPS,
                        limit: {
                            type: "radius",
                            value: {
                                min: 0,
                                max: f.radius
                            }
                        },
                        onBeforeDragMove: function(e, t, n) {},
                        onDragMove: function(e, t, n) {
                            var r;
                            return r = f.freeMode || e.shiftKey, f.palette.vars.moveMain(t.x / f.radius, t.y / f.radius, r), f.applyValue()
                        }
                    });
                    for (u = c = 1; c <= 4; u = ++c) this.dot[u] = new e(this.$e, {
                        className: "small sec sec" + u,
                        width: 13,
                        height: 13,
                        zindex: 98,
                        opacity: .67,
                        maxFPS: this.options.maxFPS,
                        limit: {
                            type: "radius",
                            value: {
                                min: 0,
                                max: f.radius
                            }
                        },
                        data: {
                            idx: u
                        },
                        onBeforeDragMove: function(e, t, n) {},
                        onDragMove: function(e, t, n) {
                            var r, i;
                            return i = n.idx, r = f.freeMode || e.shiftKey, f.palette.vars.moveSec(i, t.x / f.radius, t.y / f.radius, r), f.applyValue()
                        },
                        onDragStop: function() {
                            return n.trigger("palette/drag/done")
                        }
                    });
                    n.register("palette/colors/changed", function() {
                        return f.applyValue()
                    })
                }
                return t.prototype.setFreeMode = function(e) {
                    return this.freeMode = e
                }, t.prototype.applyValue = function() {
                    var e, t, n;
                    n = [];
                    for (e = t = 0; t <= 4; e = ++t) this.setDotByVariatorPoint(this.dot[e], this.palette.vars.getPoint(e)), n.push(this.dot[e].draw());
                    return n
                }, t.prototype.setDotByVariatorPoint = function(e, t) {
                    return e.setPolar(t.r * this.radius, t.theta)
                }, t
            }(), i
        })
    }.call(this),
    function() {
        define("ui.control.adjuster.class", ["app.ini", "app.events", "app.locale", "color.wheel", "geometry.plane.class", "geometry.point.class", "ui.control.dialog.class", "ui.control.dot.class", "ui.control.variator.class", "util"], function(e, t, n, r, i, s, o, u, a, f) {
            var l;
            return l = function() {
                function r(e, t, n, r) {
                    var i, s, o;
                    this.$button = e, this.palette = t, this.$parent = n, s = {
                        className: "",
                        width: 170,
                        positionMy: "center",
                        positionAt: "center",
                        positionOf: null
                    };
                    if (!this.$parent) return;
                    o = this, this.options = f.objMerge(s, r), this.$button ? this.$button.click(function(e) {
                        return e.preventDefault(), o.openDlg()
                    }) : (i = this.createContent(), this.$parent.append(i))
                }
                return r.prototype.createContent = function() {
                    var r, i, s, o;
                    return o = this, r = $("<DIV>", {
                        "class": "control control-adjust " + this.options.className
                    }).width(this.options.width).height(this.options.height).data("control", this), s = function(e, t, n, r, s) {
                        var o, u, a, f, l, c;
                        o = $("<DIV>", {
                            "class": "row"
                        }), e.append(o), u = $("<DIV>", {
                            "class": "btns"
                        }), o.append(u);
                        for (a = l = 0, c = s.length; l < c; a = ++l) f = s[a], i(u, n, r, f, a);
                        return u = $("<DIV>", {
                            "class": "hdr"
                        }), o.append(u), u.html('<span class="title">' + t + "</span>")
                    }, i = function(n, r, i, s, u) {
                        var a, f, l, c;
                        return a = $("<BUTTON>"), n.append(a), s && a.click(function() {
                            return t.trigger(r, {
                                val: s
                            }), t.trigger("adjuster/changed"), t.trigger("ga/event", {
                                key: e.GA.event.adjust,
                                value: i + "/" + s
                            })
                        }), c = Math.round(o.options.width / 6) - 4, f = [21, 17, 13, 13, 17, 21], l = ["-10", "-5", "-1", "+1", "+5", "+10"], a.text(l[u]).css({
                            width: c + "px",
                            height: f[u] + "px",
                            lineHeight: f[u] + "px"
                        }).data("adjust-data", {
                            type: i,
                            val: s
                        })
                    }, s(r, n("adjuster.lblHue"), "palette/adjust/hue", "hue", [-10, -5, -1, 1, 5, 10]), s(r, n("adjuster.lblSat"), "palette/adjust/saturation", "sat", [-0.2, -0.05, -0.01, .01, .05, .2]), s(r, n("adjuster.lblBri"), "palette/adjust/bright", "bri", [-0.2, -0.05, -0.01, .01, .05, .2]), s(r, n("adjuster.lblCon"), "palette/adjust/contrast", "con", [80, 95.2381, 99.001, 101, 105, 125]), r
                }, r.prototype.openDlg = function() {
                    var r, i;
                    return i = this, this.close(), r = this.createContent(), this.dlg = new o(this.$parent, r, {
                        className: "dlg-adjust",
                        title: n("adjuster.title"),
                        modal: !1,
                        width: this.options.width + 20 + "px",
                        height: 290,
                        destroyOnClose: !0,
                        position: {
                            my: i.options.positionMy,
                            at: i.options.positionAt,
                            of: i.options.positionOf || i.$button
                        }
                    }), t.trigger("ga/event", {
                        key: e.GA.event.adjust,
                        value: "open"
                    })
                }, r.prototype.close = function() {
                    var e;
                    return (e = this.dlg) != null ? e.close() : void 0
                }, r
            }(), l
        })
    }.call(this),
    function() {
        define("ui.control.randomizer.class", ["app.ini", "app.events", "app.locale", "ui.control.button.class", "ui.control.dialog.class", "util"], function(e, t, n, r, i, s) {
            var o, events = t;
            return o = function() {
                function r(e, t, n, r) {
                    var i, o;
                    this.$button = e, this.palette = t, this.$parent = n, i = {
                        className: "",
                        width: 330,
                        positionMy: "left top",
                        positionAt: "left top",
                        positionOf: null
                    };
                    if (!this.$parent) return;
                    o = this, this.options = s.objMerge(i, r), this.$button.click(function(e) {
                        return e.preventDefault(), o.openDlg()
                    });

                    // Global Spacebar shortcut
                    $(document).on("keydown.randomizer", function(ev) {
                        if (ev.keyCode === 32 || ev.key === " ") {
                            var tag = (ev.target && ev.target.tagName ? ev.target.tagName.toLowerCase() : "");
                            if (tag !== "input" && tag !== "textarea" && tag !== "select" && !$(ev.target).is("[contenteditable]")) {
                                ev.preventDefault();
                                o.palette.randomizeQuick();
                                events.trigger("randomizer/changed");
                            }
                        }
                    });
                }
                return r.prototype.openDlg = function() {
                    var e, r, pal;
                    r = this, pal = this.palette, this.close();
                    e = $("<DIV>", {
                        "class": "control control-random " + this.options.className
                    }).css({
                        width: "100%",
                        maxHeight: "560px",
                        overflowY: "auto",
                        paddingRight: "6px",
                        boxSizing: "border-box"
                    }).data("control", this);

                    // Seed & Chaos Control Box
                    var $seedBox = $("<DIV>").css({
                        background: "#161b22",
                        border: "1px solid #30363d",
                        borderRadius: "6px",
                        padding: "8px 10px",
                        marginBottom: "10px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px"
                    });

                    var $seedRow = $("<DIV>").css({ display: "flex", alignItems: "center", gap: "6px" });
                    $("<span>").css({ fontSize: "11px", fontWeight: "700", color: "#8b949e", width: "42px" }).text("Seed:").appendTo($seedRow);
                    var $seedInput = $("<INPUT>", { type: "text" }).css({
                        flex: "1",
                        background: "#0d1117",
                        border: "1px solid #30363d",
                        borderRadius: "4px",
                        color: "#e6edf3",
                        fontFamily: "monospace",
                        fontSize: "11px",
                        padding: "3px 6px"
                    }).val(pal.getSeed ? pal.getSeed() : "").appendTo($seedRow);

                    $("<BUTTON>").addClass("rand-btn-pill").css({
                        padding: "3px 8px",
                        fontSize: "10px",
                        background: "#21262d",
                        borderColor: "#38bdf8",
                        color: "#38bdf8"
                    }).text("Apply").click(function() {
                        var s = $seedInput.val().trim();
                        if (s && pal.setSeed) {
                            pal.setSeed(s);
                            r.randomizeProfile(pal.currentProfileId || "saas", { seed: s });
                            updateContrastBadge();
                        }
                    }).appendTo($seedRow);

                    $("<BUTTON>").addClass("rand-btn-pill").css({
                        padding: "3px 8px",
                        fontSize: "10px",
                        background: "#21262d",
                        borderColor: "#6e7681",
                        color: "#c9d1d9"
                    }).text("Copy").click(function() {
                        var curSeed = pal.getSeed ? pal.getSeed() : $seedInput.val();
                        if (navigator.clipboard && navigator.clipboard.writeText) {
                            navigator.clipboard.writeText(curSeed).catch(function(){});
                        }
                        var btn = $(this);
                        var oldText = btn.text();
                        btn.text("Copied! ✓");
                        setTimeout(function() { btn.text(oldText); }, 1200);
                    }).appendTo($seedRow);

                    $seedBox.append($seedRow);

                    var $chaosRow = $("<DIV>").css({ display: "flex", alignItems: "center", gap: "8px" });
                    var curChaos = pal.getChaos ? pal.getChaos() : 1.0;
                    var $chaosLabel = $("<span>").css({ fontSize: "11px", color: "#8b949e", width: "85px" }).text("Chaos: " + curChaos.toFixed(1) + "x");
                    $("<INPUT>", {
                        type: "range",
                        min: "0.1",
                        max: "2.0",
                        step: "0.1"
                    }).css({ flex: "1", cursor: "pointer" }).val(curChaos).on("input change", function() {
                        var val = parseFloat($(this).val());
                        if (pal.setChaos) pal.setChaos(val);
                        $chaosLabel.text("Chaos: " + val.toFixed(1) + "x");
                    }).appendTo($chaosRow);
                    $chaosRow.append($chaosLabel);
                    $seedBox.append($chaosRow);
                    e.append($seedBox);

                    events.register("palette/seed/changed", function(ev, data) {
                        if ($seedInput && data && data.seed) $seedInput.val(data.seed);
                    });

                    // Contrast Report Box
                    var $contrastBox = $("<DIV>").addClass("rand-contrast-box");
                    var updateContrastBadge = function() {
                        var rep = pal.getContrastReport();
                        $contrastBox.empty();
                        if (rep) {
                            var isAA = rep.passesAA;
                            var isAAA = rep.passesAAA;
                            var badgeBg = isAAA ? "#133827" : (isAA ? "#194d33" : "#5a3a10");
                            var badgeColor = isAAA ? "#4ade80" : (isAA ? "#75fbc0" : "#ffb74d");
                            var badgeText = isAAA ? "AAA Passed ★" : (isAA ? (n("random.contrastPassed") || "AA Passed ✓") : (n("random.contrastWarning") || "Low Contrast ⚠"));
                            var apcaTxt = rep.apcaText ? (" • APCA: <b>" + rep.apcaText + " Lc</b>") : "";
                            $("<span>").css({ color: "#aaa" }).html("Primary: <b>" + rep.priBgRatio + ":1</b> • Text: <b>" + rep.textBgRatio + ":1</b>" + apcaTxt).appendTo($contrastBox);
                            $("<span>").addClass("rand-contrast-badge").css({
                                background: badgeBg,
                                color: badgeColor,
                                border: "1px solid " + badgeColor
                            }).text(badgeText).appendTo($contrastBox);
                        }
                    };
                    updateContrastBadge();
                    e.append($contrastBox);

                    // Smart Actions (Keep Character & Variations)
                    $("<DIV>").addClass("rand-section-title").text(n("random.actionsTitle") || "Smart Randomize").appendTo(e);

                    var $btnKeep = $("<BUTTON>").addClass("rand-btn-action").html(n("random.btnKeepMood") || "⚡ Keep Character<small>rotate hues, keep contrast & style</small>").click(function() {
                        r.randomizeKeepMood();
                        updateContrastBadge();
                    });
                    e.append($btnKeep);

                    var $btnVar = $("<BUTTON>").addClass("rand-btn-action").css({
                        background: "linear-gradient(135deg, #1f2d3d 0%, #263c52 100%)",
                        borderColor: "#60a5fa",
                        color: "#bfdbfe"
                    }).html(n("random.btnVariations") || "✨ Variations<small>subtle hue & saturation shift</small>").click(function() {
                        r.randomizeVariations();
                        updateContrastBadge();
                    });
                    e.append($btnVar);

                    // WCAG Contrast Fix Buttons
                    var $wcagRow = $("<DIV>").css({ display: "flex", gap: "6px", marginBottom: "8px" });
                    $("<BUTTON>").addClass("rand-btn-action").css({
                        flex: "1",
                        marginBottom: "0",
                        background: "#16382a",
                        borderColor: "#22c55e",
                        color: "#86efac"
                    }).html(n("random.btnFixContrastAA") || "Fix Contrast AA<small>≥ 4.5:1</small>").click(function() {
                        r.fixContrast(4.5);
                        updateContrastBadge();
                    }).appendTo($wcagRow);

                    $("<BUTTON>").addClass("rand-btn-action").css({
                        flex: "1",
                        marginBottom: "0",
                        background: "#1b2a40",
                        borderColor: "#38bdf8",
                        color: "#7dd3fc"
                    }).html(n("random.btnFixContrastAAA") || "Fix Contrast AAA<small>≥ 7.0:1</small>").click(function() {
                        r.fixContrast(7.0);
                        updateContrastBadge();
                    }).appendTo($wcagRow);
                    e.append($wcagRow);

                    // Designer Profiles: UI & Product
                    $("<DIV>").addClass("rand-section-title").text("UI & Product Profiles").appendTo(e);
                    var $uiProfiles = $("<DIV>").addClass("rand-btn-grid");
                    var addProfileBtn = function(container, profileKey, label) {
                        $("<BUTTON>").addClass("rand-btn-pill").text(label).click(function() {
                            r.randomizeProfile(profileKey);
                            updateContrastBadge();
                        }).appendTo(container);
                    };
                    addProfileBtn($uiProfiles, "saas", "SaaS UI");
                    addProfileBtn($uiProfiles, "minimal", "Minimal (Swiss)");
                    addProfileBtn($uiProfiles, "darkui", "Dark UI");
                    addProfileBtn($uiProfiles, "neutral_accent", "Neutral + Pop");
                    e.append($uiProfiles);

                    // Designer Profiles: Gaming & Entertainment
                    $("<DIV>").addClass("rand-section-title").text(n("random.gamingGroup") || "Gaming & Entertainment (8 Profiles)").appendTo(e);
                    var $gameProfiles = $("<DIV>").addClass("rand-btn-grid");
                    addProfileBtn($gameProfiles, "game_rpg", "Dark Fantasy RPG");
                    addProfileBtn($gameProfiles, "game_cyberpunk", "Cyberpunk HUD");
                    addProfileBtn($gameProfiles, "game_arcade", "8-Bit Retro Arcade");
                    addProfileBtn($gameProfiles, "game_fps", "Tactical Military FPS");
                    addProfileBtn($gameProfiles, "game_horror", "Survival Horror");
                    addProfileBtn($gameProfiles, "game_cozy", "Cozy / Casual Mobile");
                    addProfileBtn($gameProfiles, "game_esports", "Esports Arena");
                    addProfileBtn($gameProfiles, "game_space", "Deep Space Sci-Fi");
                    e.append($gameProfiles);

                    // Designer Profiles: Aesthetics
                    $("<DIV>").addClass("rand-section-title").text("Aesthetic Profiles").appendTo(e);
                    var $aesProfiles = $("<DIV>").addClass("rand-btn-grid");
                    addProfileBtn($aesProfiles, "luxury", "Luxury");
                    addProfileBtn($aesProfiles, "editorial", "Editorial");
                    addProfileBtn($aesProfiles, "retro", "Retro");
                    addProfileBtn($aesProfiles, "cyberpunk", "Cyberpunk");
                    e.append($aesProfiles);

                    // Designer Profiles: Nature & Mood
                    $("<DIV>").addClass("rand-section-title").text("Nature & Mood Profiles").appendTo(e);
                    var $natProfiles = $("<DIV>").addClass("rand-btn-grid");
                    addProfileBtn($natProfiles, "nature", "Nature (Sage/Clay)");
                    addProfileBtn($natProfiles, "pastel", "Pastel");
                    addProfileBtn($natProfiles, "playful", "Playful");
                    addProfileBtn($natProfiles, "earth", "Material / Earth");
                    addProfileBtn($natProfiles, "ocean", "Ocean Marine");
                    addProfileBtn($natProfiles, "sunset", "Sunset Twilight");
                    e.append($natProfiles);

                    // Selective Regeneration & Color Locks
                    $("<DIV>").addClass("rand-section-title").text(n("random.locksTitle") || "Selective Regeneration & Locks").appendTo(e);

                    var $regenRow = $("<DIV>").css({ display: "flex", gap: "6px", marginBottom: "8px" });
                    $("<BUTTON>").addClass("rand-btn-pill").css({
                        flex: "1",
                        background: "#1c2b3d",
                        borderColor: "#38bdf8",
                        color: "#bae6fd",
                        padding: "6px 8px"
                    }).html(n("random.regenPrimary") || "↻ Primary Only").click(function() {
                        r.regeneratePrimary();
                        updateContrastBadge();
                    }).appendTo($regenRow);

                    $("<BUTTON>").addClass("rand-btn-pill").css({
                        flex: "1",
                        background: "#242038",
                        borderColor: "#a78bfa",
                        color: "#ddd6fe",
                        padding: "6px 8px"
                    }).html(n("random.regenSecondary") || "↻ Accents Only").click(function() {
                        r.regenerateSecondary();
                        updateContrastBadge();
                    }).appendTo($regenRow);
                    e.append($regenRow);

                    var $locks = $("<DIV>").css({ fontSize: "11px", color: "#ccc", padding: "2px 0 10px", display: "flex", gap: "10px", justifyContent: "space-between" });
                    var createLock = function(key, label) {
                        var $lbl = $("<LABEL>").css({ display: "inline-flex", alignItems: "center", gap: "4px", cursor: "pointer" });
                        var $chk = $("<INPUT>", { type: "checkbox" }).prop("checked", pal.isColorLocked(key));
                        $chk.change(function() {
                            pal.toggleColorLock(key);
                        });
                        $lbl.append($chk).append(" " + label);
                        $locks.append($lbl);
                    };
                    createLock("pri", "Lock Primary");
                    createLock("sec", "Lock Secondary");
                    createLock("compl", "Lock Complement");
                    e.append($locks);

                    // Generation Modes: Harmonies (7 modes)
                    $("<DIV>").addClass("rand-section-title").text(n("random.harmoniesGroup") || "Harmonies (7 Modes)").appendTo(e);
                    var $harmonies = $("<DIV>").addClass("rand-btn-grid");
                    var addGenBtn = function(container, modeKey, label) {
                        $("<BUTTON>").addClass("rand-btn-pill compact").text(label).click(function() {
                            r.generateMode(modeKey);
                            updateContrastBadge();
                        }).appendTo(container);
                    };
                    addGenBtn($harmonies, "mono", "Monochromatic");
                    addGenBtn($harmonies, "analog", "Analogous");
                    addGenBtn($harmonies, "compl", "Complementary");
                    addGenBtn($harmonies, "split", "Split Compl.");
                    addGenBtn($harmonies, "triad", "Triadic");
                    addGenBtn($harmonies, "tetrad", "Tetradic");
                    addGenBtn($harmonies, "doublecompl", "Double Compl.");
                    e.append($harmonies);

                    // Generation Modes: Style & Contrast (5 modes)
                    $("<DIV>").addClass("rand-section-title").text(n("random.styleGroup") || "Contrast & Style (5 Modes)").appendTo(e);
                    var $styles = $("<DIV>").addClass("rand-btn-grid");
                    addGenBtn($styles, "neutral_accent", "Neutral + Accent");
                    addGenBtn($styles, "grayscale_accent", "Grayscale + Accent");
                    addGenBtn($styles, "high_saturation", "High Saturation");
                    addGenBtn($styles, "muted", "Muted");
                    addGenBtn($styles, "pastel", "Pastel");
                    e.append($styles);

                    // Generation Modes: Temperature (2 modes)
                    $("<DIV>").addClass("rand-section-title").text(n("random.tempGroup") || "Temperature (2 Modes)").appendTo(e);
                    var $temps = $("<DIV>").addClass("rand-btn-grid");
                    addGenBtn($temps, "warm", "Warm (Sun & Clay)");
                    addGenBtn($temps, "cool", "Cool (Sky & Marine)");
                    e.append($temps);

                    // Favorites & Bookmarking Row
                    var $favRow = $("<DIV>").css({ display: "flex", gap: "6px", marginBottom: "10px" });
                    $("<BUTTON>").addClass("rand-btn-pill").css({
                        flex: "1",
                        background: "#2d2416",
                        borderColor: "#b45309",
                        color: "#fcd34d"
                    }).html(n("random.btnSaveFav") || "★ Add to Favorites").click(function() {
                        var ok = pal.saveFavorite();
                        if (ok) {
                            var $toast = $(".global-copy-toast");
                            if (!$toast.length) $toast = $("<div>").addClass("global-copy-toast").appendTo("body");
                            $toast.html("&#9733; Saved to Favorites!").addClass("show");
                            setTimeout(function() { $toast.removeClass("show"); }, 2000);
                        }
                    }).appendTo($favRow);

                    $("<BUTTON>").addClass("rand-btn-pill").css({
                        flex: "1",
                        background: "#182836",
                        borderColor: "#38bdf8",
                        color: "#7dd3fc"
                    }).html(n("random.btnViewFavs") || "📂 Saved Palettes").click(function() {
                        r.openFavoritesDlg();
                    }).appendTo($favRow);
                    e.append($favRow);

                    // Typography & Font Pairings
                    $("<DIV>").addClass("rand-section-title").text(n("random.typoTitle") || "Typography & Font Pairings").appendTo(e);
                    var $typoBox = $("<DIV>").addClass("rand-typo-box").css({
                        background: "#161d27",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "6px",
                        padding: "8px 10px",
                        marginBottom: "10px"
                    });

                    // Active Typography Badge
                    var $typoCurrentBadge = $("<DIV>").addClass("rand-typo-badge").css({
                        fontSize: "11px",
                        color: "#94a3b8",
                        marginBottom: "8px",
                        padding: "4px 8px",
                        background: "rgba(0,0,0,0.25)",
                        borderRadius: "4px",
                        border: "1px solid rgba(255,255,255,0.05)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                    });
                    $typoBox.append($typoCurrentBadge);

                    // 3 Action Buttons: Random All | 🎮 Game Font | ⚡ Wild Gen
                    var $typoActionsRow = $("<DIV>").css({
                        display: "flex",
                        gap: "5px",
                        marginBottom: "8px"
                    });

                    var triggerTypoToast = function(typoObj) {
                        var $toast = $(".global-copy-toast");
                        if (!$toast.length) $toast = $("<div>").addClass("global-copy-toast").appendTo("body");
                        $toast.html("&#9998; Typography: <b>" + (typoObj ? typoObj.name : "Pairing") + "</b>").addClass("show");
                        setTimeout(function() { $toast.removeClass("show"); }, 2000);
                    };

                    var createTypoActionBtn = function(label, bg, border, color, onClick) {
                        return $("<BUTTON>").addClass("rand-btn-pill").css({
                            flex: "1",
                            background: bg,
                            borderColor: border,
                            color: color,
                            fontWeight: "600",
                            fontSize: "10px",
                            padding: "5px 4px",
                            cursor: "pointer",
                            textAlign: "center",
                            whiteSpace: "nowrap"
                        }).html(label).click(onClick);
                    };

                    $typoActionsRow.append(
                        createTypoActionBtn(n("random.btnRandTypo") || "🎲 Random All", "linear-gradient(135deg, #1e3a5f, #0f2744)", "#38bdf8", "#e0f2fe", function() {
                            var res = r.randomizeTypography("all");
                            updateTypoBadge();
                            triggerTypoToast(res);
                        })
                    );

                    $typoActionsRow.append(
                        createTypoActionBtn(n("random.btnRandGameTypo") || "🎮 Game Font", "linear-gradient(135deg, #3b1d54, #1e1136)", "#c084fc", "#f3e8ff", function() {
                            var res = r.randomizeTypography("game");
                            updateTypoBadge();
                            triggerTypoToast(res);
                        })
                    );

                    $typoActionsRow.append(
                        createTypoActionBtn(n("random.btnWildTypo") || "⚡ Wild Gen", "linear-gradient(135deg, #451a03, #290f02)", "#f59e0b", "#fef3c7", function() {
                            var res = r.randomizeTypography("wild");
                            updateTypoBadge();
                            triggerTypoToast(res);
                        })
                    );

                    $typoBox.append($typoActionsRow);

                    // Category Filter Tabs
                    var currentCategory = "all";
                    var $typoCatRow = $("<DIV>").css({
                        display: "flex",
                        gap: "4px",
                        marginBottom: "8px",
                        borderBottom: "1px solid rgba(255,255,255,0.08)",
                        paddingBottom: "6px"
                    });

                    var $typoGrid = $("<DIV>").addClass("rand-btn-grid");

                    var pairs = pal.getTypographyPairs ? pal.getTypographyPairs() : [];

                    var renderCategoryTabs = function() {
                        $typoCatRow.empty();
                        var cats = [
                            { id: "all", label: n("random.catAll") || "All" },
                            { id: "game", label: n("random.catGame") || "🎮 Gaming" },
                            { id: "ui", label: n("random.catUI") || "UI & Web" },
                            { id: "editorial", label: n("random.catEditorial") || "Editorial" }
                        ];
                        cats.forEach(function(c) {
                            var isAct = currentCategory === c.id;
                            $("<BUTTON>").addClass("rand-btn-pill compact").css({
                                fontSize: "9px",
                                padding: "2px 6px",
                                background: isAct ? "rgba(56,189,248,0.2)" : "transparent",
                                borderColor: isAct ? "#38bdf8" : "rgba(255,255,255,0.1)",
                                color: isAct ? "#38bdf8" : "#94a3b8",
                                fontWeight: isAct ? "bold" : "normal"
                            }).text(c.label).click(function() {
                                currentCategory = c.id;
                                renderCategoryTabs();
                                renderPresets();
                            }).appendTo($typoCatRow);
                        });
                    };

                    var renderPresets = function() {
                        $typoGrid.empty();
                        var filtered = pairs.filter(function(pair) {
                            if (currentCategory === "all") return true;
                            return pair.category === currentCategory;
                        });
                        filtered.forEach(function(pair) {
                            var $pBtn = $("<BUTTON>").addClass("rand-btn-pill compact").attr("data-typo-id", pair.id).text(pair.name).css({
                                fontSize: "10px",
                                padding: "4px 6px"
                            }).click(function() {
                                r.setTypography(pair.id);
                                updateTypoBadge();
                                triggerTypoToast(pair);
                            });
                            $typoGrid.append($pBtn);
                        });
                        updateTypoBadge();
                    };

                    var updateTypoBadge = function() {
                        var cur = pal.getTypography ? pal.getTypography() : null;
                        if (cur) {
                            var tag = cur.category === "game" ? "🎮 " : (cur.category === "wild" ? "⚡ " : "");
                            $typoCurrentBadge.html('<span style="color:#64748b">' + (n("random.typoCurrent") || "Active:") + '</span> <b style="color:#38bdf8;font-family:' + cur.heading + '">' + tag + cur.name + '</b>');
                            $typoGrid.find(".rand-btn-pill").each(function() {
                                var $btn = $(this);
                                if ($btn.attr("data-typo-id") === cur.id) {
                                    $btn.css({ borderColor: "#38bdf8", color: "#38bdf8", fontWeight: "700", background: "rgba(56,189,248,0.14)" });
                                } else {
                                    $btn.css({ borderColor: "rgba(255,255,255,0.12)", color: "#cbd5e1", fontWeight: "normal", background: "transparent" });
                                }
                            });
                        }
                    };

                    renderCategoryTabs();
                    renderPresets();

                    $typoBox.append($typoCatRow);
                    $typoBox.append($typoGrid);
                    e.append($typoBox);

                    updateTypoBadge();

                    // Classic random 4 buttons (compact)
                    $("<DIV>").addClass("rand-section-title").text("Classic Randomizer").appendTo(e);
                    var $classic = $("<DIV>").css({ overflow: "hidden", marginBottom: "6px" });
                    var tBtn;
                    tBtn = $("<BUTTON>").addClass("btn-0-1").text(n("random.btn01")).click(function() { return r.randomize(0, 1) });
                    $classic.append(tBtn);
                    tBtn = $("<BUTTON>").addClass("btn-1-1").text(n("random.btn11")).click(function() { return r.randomize(1, 1) });
                    $classic.append(tBtn);
                    tBtn = $("<BUTTON>").addClass("btn-0-0").text(n("random.btn00")).click(function() { return r.randomize(0, 0) });
                    $classic.append(tBtn);
                    tBtn = $("<BUTTON>").addClass("btn-1-0").text(n("random.btn10")).click(function() { return r.randomize(1, 0) });
                    $classic.append(tBtn);
                    e.append($classic);

                    // Space shortcut hint
                    $("<DIV>").css({
                        clear: "both",
                        padding: "6px 0 2px",
                        fontSize: "10px",
                        color: "#888",
                        textAlign: "center"
                    }).text("Tip: Press Spacebar for instant quick randomize").appendTo(e);

                    this.dlg = new i(this.$parent, e, {
                        className: "dlg-random",
                        title: n("random.title") || "Color Engine & Presets",
                        modal: !1,
                        width: 360,
                        height: 580,
                        destroyOnClose: !0,
                        position: {
                            my: r.options.positionMy,
                            at: r.options.positionAt,
                            of: r.options.positionOf || r.$button
                        }
                    });
                }, r.prototype.openFavoritesDlg = function() {
                    var r = this, pal = this.palette;
                    var $c = $("<div>").addClass("dlg-favs-container").css({
                        padding: "8px",
                        maxHeight: "380px",
                        overflowY: "auto",
                        fontFamily: "sans-serif"
                    });

                    var renderList = function() {
                        $c.empty();
                        var currentFavs = pal.getFavorites();
                        if (!currentFavs || currentFavs.length === 0) {
                            $("<div>").css({
                                padding: "30px 10px",
                                textAlign: "center",
                                color: "#888",
                                fontSize: "12px",
                                lineHeight: "1.5"
                            }).html(n("random.favEmpty") || "No saved palettes yet.").appendTo($c);
                            return;
                        }

                        currentFavs.forEach(function(item) {
                            var $item = $("<div>").addClass("rand-fav-item").css({
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "8px 10px",
                                margin: "0 0 8px 0",
                                background: "#182836",
                                border: "1px solid #233e54",
                                borderRadius: "5px"
                            });

                            // Swatches
                            var $swatches = $("<div>").css({
                                display: "flex",
                                gap: "4px",
                                marginRight: "10px"
                            });
                            if (item.hexes && item.hexes.length) {
                                item.hexes.forEach(function(h) {
                                    $("<div>").css({
                                        width: "22px",
                                        height: "22px",
                                        background: "#" + h.replace(/^#/, ""),
                                        borderRadius: "3px",
                                        border: "1px solid rgba(0,0,0,0.25)"
                                    }).attr("title", "#" + h.replace(/^#/, "")).appendTo($swatches);
                                });
                            }
                            $item.append($swatches);

                            // Info
                            var $info = $("<div>").css({ flex: "1", fontSize: "11px", color: "#e0e0e0" });
                            $("<div>").css({ fontWeight: "bold", color: "#61b5ff" }).text(item.name || "Palette").appendTo($info);
                            $("<div>").css({ fontSize: "10px", color: "#888" }).text((item.model || "").toUpperCase() + " • " + item.hue + "°").appendTo($info);
                            $item.append($info);

                            // Actions
                            var $btns = $("<div>").css({ display: "flex", gap: "6px" });
                            $("<button>").css({
                                background: "#0d6efd",
                                color: "#fff",
                                border: "none",
                                borderRadius: "3px",
                                padding: "4px 9px",
                                fontSize: "11px",
                                cursor: "pointer",
                                fontWeight: "600"
                            }).text(n("random.favApply") || "Load").click(function() {
                                window.location.hash = "#uid=" + item.uid;
                                events.trigger("randomizer/changed");
                                var $toast = $(".global-copy-toast");
                                if (!$toast.length) $toast = $("<div>").addClass("global-copy-toast").appendTo("body");
                                $toast.html("&#10003; " + (item.name || "Palette") + " loaded!").addClass("show");
                                setTimeout(function() { $toast.removeClass("show"); }, 2000);
                            }).appendTo($btns);

                            $("<button>").css({
                                background: "#34222a",
                                color: "#ff8da1",
                                border: "1px solid #5a2e3b",
                                borderRadius: "3px",
                                padding: "4px 8px",
                                fontSize: "11px",
                                cursor: "pointer"
                            }).html("&times;").attr("title", n("random.favDelete") || "Delete").click(function() {
                                pal.removeFavorite(item.uid);
                                renderList();
                            }).appendTo($btns);

                            $item.append($btns);
                            $c.append($item);
                        });
                    };

                    renderList();

                    new i(this.$parent, $c, {
                        className: "dlg-favorites",
                        title: n("random.favTitle") || "Favorite Palettes",
                        modal: !1,
                        width: 360,
                        height: 380,
                        destroyOnClose: !0,
                        position: {
                            my: "center top",
                            at: "center top+50",
                            of: window
                        }
                    });
                }, r.prototype.close = function() {
                    var e;
                    return (e = this.dlg) != null ? e.close() : void 0
                }, r.prototype.randomize = function(n, r) {
                    var i, o, u, a;
                    return u = r ? s.rndBool() : !1, o = n ? 1 : .05, i = n ? 1 : .25, a = r ? 1 : .15, this.palette.randomize(u, o, i, a), t.trigger("randomizer/changed"), t.trigger("ga/event", {
                        key: e.GA.event.randomize,
                        value: "" + n + r
                    })
                }, r.prototype.randomizeWCAG = function(n) {
                    return this.palette.randomizeWCAG(n), t.trigger("randomizer/changed"), t.trigger("ga/event", {
                        key: e.GA.event.randomize,
                        value: "wcag-" + n
                    })
                }, r.prototype.randomizeProfile = function(p) {
                    return this.palette.randomizeProfile(p), t.trigger("randomizer/changed"), t.trigger("ga/event", {
                        key: e.GA.event.randomize,
                        value: "profile-" + p
                    })
                }, r.prototype.randomizeKeepMood = function() {
                    return this.palette.randomizeKeepMood(), t.trigger("randomizer/changed"), t.trigger("ga/event", {
                        key: e.GA.event.randomize,
                        value: "keep-mood"
                    })
                }, r.prototype.randomizeVariations = function() {
                    return this.palette.randomizeVariations(), t.trigger("randomizer/changed"), t.trigger("ga/event", {
                        key: e.GA.event.randomize,
                        value: "variations"
                    })
                }, r.prototype.randomizeMood = function(m) {
                    return this.palette.randomizeMood(m), t.trigger("randomizer/changed"), t.trigger("ga/event", {
                        key: e.GA.event.randomize,
                        value: "mood-" + m
                    })
                }, r.prototype.generateMode = function(m) {
                    return this.palette.generateMode(m), t.trigger("randomizer/changed"), t.trigger("ga/event", {
                        key: e.GA.event.randomize,
                        value: "genmode-" + m
                    })
                }, r.prototype.regeneratePrimary = function() {
                    return this.palette.regeneratePrimary(), t.trigger("randomizer/changed"), t.trigger("ga/event", {
                        key: e.GA.event.randomize,
                        value: "regen-pri"
                    })
                }, r.prototype.regenerateSecondary = function() {
                    return this.palette.regenerateSecondary(), t.trigger("randomizer/changed"), t.trigger("ga/event", {
                        key: e.GA.event.randomize,
                        value: "regen-sec"
                    })
                }, r.prototype.setHarmonyMode = function(h) {
                    return this.palette.generateMode(h), t.trigger("randomizer/changed"), t.trigger("ga/event", {
                        key: e.GA.event.randomize,
                        value: "harmony-" + h
                    })
                }, r.prototype.fixContrast = function(targetRatio) {
                    var res = this.palette.fixContrast(targetRatio);
                    t.trigger("randomizer/changed");
                    var $toast = $(".global-copy-toast");
                    if (!$toast.length) $toast = $("<div>").addClass("global-copy-toast").appendTo("body");
                    $toast.html("&#10003; Contrast adjusted: <b>" + (res ? res.priBgRatio : targetRatio) + ":1</b>").addClass("show");
                    setTimeout(function() { $toast.removeClass("show"); }, 2500);
                    return res;
                }, r.prototype.randomizeTypography = function(type) {
                    var res = this.palette.randomizeTypography(type);
                    t.trigger("randomizer/changed");
                    t.trigger("ga/event", {
                        key: e.GA.event.randomize,
                        value: "typo-" + (res ? res.id : "")
                    });
                    return res;
                }, r.prototype.randomizeGameTypography = function() {
                    return this.randomizeTypography("game");
                }, r.prototype.randomizeWildTypography = function() {
                    return this.randomizeTypography("wild");
                }, r.prototype.setTypography = function(id) {
                    var res = this.palette.setTypography(id);
                    t.trigger("randomizer/changed");
                    t.trigger("ga/event", {
                        key: e.GA.event.randomize,
                        value: "typo-set-" + (res ? res.id : "")
                    });
                    return res;
                }, r
            }(), o
        });
    }.call(this),
    function() {
        define("ui.control.btnedit.class", ["app.events", "app.locale", "util", "ui.control.dialog.class"], function(e, t, n, r) {
            var i;
            return i = function() {
                function i(e, t) {
                    var r, i;
                    this.$parent = e, r = {
                        className: "",
                        labelPre: "",
                        labelPost: "",
                        value: 0,
                        type: "text",
                        dlgTitle: "",
                        dlgText: "",
                        dlgWidth: null,
                        positionMy: "left top",
                        positionAt: "left top",
                        positionOf: null,
                        inputSize: 5,
                        asUIButton: !0,
                        listen: null,
                        callback: null
                    };
                    if (!this.$parent) return;
                    i = this, this.options = n.objMerge(r, t), this.value = this.options.value, this.disabled = !1, this.init()
                }
                return i.prototype.init = function() {
                    var t, n, r, i, s, o, u, a, f, l, c;
                    u = this, this.$e = $("<DIV>", {
                        "class": "control control-btnedit " + this.options.className
                    }), this.$parent.append(this.$e), this.$button = $("<A>", {
                        "class": "button",
                        href: "#"
                    }), this.$e.append(this.$button), t = $("<SPAN>", {
                        "class": "label"
                    }), t.text(this.options.labelPre), this.$button.append(t), n = $("<SPAN>", {
                        "class": "value"
                    }), n.text(this.options.value), this.$button.append(n), t = $("<SPAN>", {
                        "class": "label"
                    }), t.text(this.options.labelPost), this.$button.append(t), this.options.asUIButton ? r = this.$button.button() : r = this.$button, r.click(function(e) {
                        e.preventDefault(), u.$button.blur();
                        if (u.disabled) return;
                        return u.openDlg(u.value)
                    });
                    if (this.options.listen && this.options.listen.length) {
                        l = this.options.listen, c = [];
                        for (o = a = 0, f = l.length; a < f; o = ++a) i = l[o], s = function(e) {
                            return function() {
                                return e(u)
                            }
                        }, c.push(e.register(i.event, s(i.handler)));
                        return c
                    }
                }, i.prototype.openDlg = function(e) {
                    var n, i, s, o, u, a;
                    return a = this, n = $("<DIV>"), i = $("<DIV>", {
                        "class": "text"
                    }).html(this.options.dlgText), n.append(i), i = $("<DIV>", {
                        "class": "input"
                    }), n.append(i), s = $("<INPUT>", {
                        type: this.options.type,
                        value: e
                    }).focus(), this.options.inputSize && s.attr("size", this.options.inputSize), s.on("keypress", function(e) {
                        if (e.which === 13) return u()
                    }), i.append(s), setTimeout(function() {
                        return s.select()
                    }, 10), o = new r(this.$parent, n, {
                        className: "dlg-btnedit",
                        title: this.options.dlgTitle,
                        buttons: [{
                            text: t("app.btnCancel"),
                            click: function() {
                                return o.close()
                            }
                        }, {
                            text: t("app.btnOK"),
                            click: function() {
                                return u()
                            }
                        }],
                        position: {
                            my: a.options.positionMy,
                            at: a.options.positionAt,
                            of: a.options.positionOf || a.$button
                        }
                    }), u = function() {
                        return e = a.options.callback(s.val()), e != null && a.setValue(e), o.close()
                    }
                }, i.prototype.setValue = function(e) {
                    return this.value = e, this.$e.find(".value").text(e)
                }, i.prototype.disable = function(e) {
                    return this.disabled = !!e, this.$e.toggle(!this.disabled)
                }, i
            }(), i
        })
    }.call(this),
    function() {
        define("ui.control.wheelswitch.class", ["app.events", "util", "ui.control.button.class"], function(e, t, n) {
            var r;
            return r = function() {
                function r(n, r, i, s) {
                    var o, u;
                    this.$container = n, this.ctrl_wheel = r, this.palette = i, o = {
                        className: ""
                    }, this.options = t.objMerge(o, s), u = this, e.register("palette/colors/changed", function() {
                        return u.colorize()
                    }), e.register("palette/model/changed", function() {
                        return u.draw()
                    }), this.draw()
                }
                return r.prototype.draw = function() {
                    var e, t;
                    return t = this, this.$e = $("<DIV>", {
                        "class": "control-wheelswitch " + this.options.className
                    }), this.$container.empty().append(this.$e), this.$e.on("mouseenter", function(e) {
                        var n;
                        return typeof(n = t.options).onEnter == "function" ? n.onEnter(e) : void 0
                    }).on("mouseleave", function(e) {
                        var n;
                        return typeof(n = t.options).onLeave == "function" ? n.onLeave(e) : void 0
                    }), this.$colors = $("<SPAN>", {
                        "class": "colors"
                    }), this.$e.append(this.$colors), e = function(e) {
                        var r, i;
                        return i = e, r = new n(t.$colors, {
                            className: "col btn-" + e,
                            asUIButton: !1,
                            label: "",
                            onClick: function() {
                                return t.setCol(i)
                            }
                        }), r
                    }, this.colBtn = {}, this.colBtn.pri = e("pri"), this.palette.hasCompl() && (this.colBtn.compl = e("compl")), this.palette.hasSecs() && (this.colBtn.sec1 = e("sec1"), this.colBtn.sec2 = e("sec2")), this.switchBtn = new n(this.$e, {
                        className: "lock",
                        asUIButton: !1,
                        label: "",
                        onClick: function() {
                            return t["switch"](!t.palette.varsMultiOn)
                        }
                    }), this.switchBtn.$label.addClass("ico"), this["switch"](t.palette.varsMultiOn)
                }, r.prototype["switch"] = function(t) {
                    return this.$colors.find(".control-button.sel").removeClass("sel"), t ? (e.trigger("palette/switchvars/multi"), this.$colors.show(), this.$colors.find(".control-button.btn-" + this.palette.varsActive).addClass("sel")) : (e.trigger("palette/switchvars/same"), this.$colors.hide()), this.switchBtn.$label.toggleClass("ico-lock", !t).toggleClass("ico-unlock", t), this.switchBtn.$e.toggle(this.palette.hueCnt > 1)
                }, r.prototype.setCol = function(t) {
                    var n;
                    n = this, this.$colors.find(".control-button.sel").removeClass("sel"), this.$colors.find(".control-button.btn-" + t).addClass("sel");
                    if (n.palette.varsMultiOn) return e.trigger("palette/switchvars/active", {
                        colId: t
                    })
                }, r.prototype.colorize = function() {
                    var e, t;
                    return t = this, e = function(e) {
                        var n;
                        return (n = t.colBtn[e]) != null ? n.$button.css("background", t.palette.getColorCode(e, 0)) : void 0
                    }, e("pri"), e("compl"), e("sec1"), e("sec2")
                }, r
            }(), r
        })
    }.call(this),
    function() {
        define("ui.control.wheel.class", ["color.wheel", "geometry.plane.class", "geometry.point.class", "ui.control.dot.class", "ui.control.variator.class", "ui.control.wheelswitch.class", "ui.drag", "app.events", "app.locale", "util"], function(e, t, n, r, i, s, o, u, a, f) {
            var l, c, h, p;
            return h = function(e) {
                var t;
                return t = f.rad2deg(e), f.angleNorm(t + 90)
            }, c = function(e) {
                var t;
                return t = f.angleNorm(e - 90), f.deg2rad(t)
            }, p = function(e, t, n, r) {
                return t >= n.options.triRadius[0] && t < n.options.triRadius[1] ? (e = f.angleNorm(Math.round(e / 15) * 15), r.setPolar(t, c(e)), e) : t >= n.options.secRadius[0] && t < n.options.secRadius[1] ? (e = f.angleNorm(Math.round(e / 30) * 30), r.setPolar(t, c(e)), e) : e
            }, l = function() {
                function l(e, t, n) {
                    var r, i;
                    this.palette = e, this.$parent = t, r = {
                        className: "control control-wheel",
                        width: 400,
                        height: 400,
                        maxFPS: 0,
                        variatorRadius: 103,
                        activeRadius: [125, 190],
                        hueRadius: 139,
                        triRadius: [156, 171],
                        secRadius: [171, 185],
                        variatorTreshold: .5
                    };
                    if (!this.$parent) return;
                    i = this, this.options = f.objMerge(r, n), this.freeMode = !1, this.isOverlay = !1, this.drawBackground(), this.init(), u.register("palette/colors/changed", function() {
                        return i.updateByPalette()
                    }), u.register("palette/model/changed", function() {
                        return i.updateByPalette()
                    })
                }
                return l.prototype.init = function() {
                    var e;
                    return e = this, this.dotPri = new r(this.$e, {
                        className: "pri",
                        title: a("color.pri"),
                        width: 17,
                        height: 17,
                        maxFPS: this.options.maxFPS,
                        limit: {
                            type: "radius",
                            value: {
                                min: e.options.hueRadius,
                                max: e.options.hueRadius
                            }
                        },
                        onDragMove: function(t, n, r) {
                            var i, s, o, u, a;
                            return i = e.freeMode || t.shiftKey, a = n.getPolar(), o = a[0], u = a[1], s = h(u), s = p(s, o, e, e.dotPri), e.palette.setHue(s, i)
                        }
                    }), this.dotCompl = new r(this.$e, {
                        className: "compl",
                        title: a("color.compl"),
                        width: 17,
                        height: 17,
                        opacity: .67,
                        maxFPS: this.options.maxFPS,
                        limit: {
                            type: "radius",
                            value: {
                                min: e.options.hueRadius,
                                max: e.options.hueRadius
                            }
                        },
                        onDragMove: function(t, n, r) {
                            var i, s, o, u, a;
                            return i = e.freeMode || t.shiftKey, a = n.getPolar(), o = a[0], u = a[1], s = h(u), s = p(s, o, e, e.dotPri), e.palette.setHueCompl(s, i)
                        }
                    }), this.dotSec1 = new r(this.$e, {
                        className: "sec",
                        title: a("color.sec"),
                        width: 17,
                        height: 17,
                        maxFPS: this.options.maxFPS,
                        limit: {
                            type: "radius",
                            value: {
                                min: e.options.hueRadius,
                                max: e.options.hueRadius
                            }
                        },
                        onDragMove: function(t, n, r) {
                            var i, s, o, u, a;
                            return s = e.freeMode || t.shiftKey, a = n.getPolar(), o = a[0], u = a[1], i = h(u), i = p(i, o, e, e.dotPri), e.palette.setHueSec(i, 1, s)
                        }
                    }), this.dotSec2 = new r(this.$e, {
                        className: "sec",
                        title: a("color.sec"),
                        width: 17,
                        height: 17,
                        maxFPS: this.options.maxFPS,
                        limit: {
                            type: "radius",
                            value: {
                                min: e.options.hueRadius,
                                max: e.options.hueRadius
                            }
                        },
                        onDragMove: function(t, n, r) {
                            var i, s, o, u, a;
                            return s = e.freeMode || t.shiftKey, a = n.getPolar(), o = a[0], u = a[1], i = h(u), i = p(i, o, e, e.dotPri), e.palette.setHueSec(i, 2, s)
                        }
                    }), this.variator = new i(this.$e, this.palette, {
                        maxFPS: this.options.maxFPS
                    }), this.updateByPalette()
                }, l.prototype.updateByPalette = function() {
                    return this.dotPri.setPolar(1, c(this.palette.hue)), this.palette.hasCompl() ? (this.dotCompl.setPolar(1, c(this.palette.hueCompl)), this.dotCompl.show()) : this.dotCompl.hide(), this.palette.hasSecs() ? (this.dotSec1.setPolar(1, c(this.palette.hueSec1)), this.dotSec2.setPolar(1, c(this.palette.hueSec2)), this.dotSec1.show(), this.dotSec2.show()) : (this.dotSec1.hide(), this.dotSec2.hide()), this.drawDots(), this.updateBackground()
                }, l.prototype.drawDots = function() {
                    return this.dotPri.draw(), this.dotCompl.draw(), this.dotSec1.draw(), this.dotSec2.draw()
                }, l.prototype.overlay = function(e) {
                    return this.isOverlay = e, this.$overlay.toggleClass("over", e), e ? (this.dotPri.fadeOut(), this.dotCompl.fadeOut(), this.dotSec1.fadeOut(), this.dotSec2.fadeOut(), this.$info.fadeIn(), this.$switch.fadeIn()) : (this.dotPri.fadeIn(), this.palette.hasCompl() && this.dotCompl.fadeIn(), this.palette.hasSecs() && (this.dotSec1.fadeIn(), this.dotSec2.fadeIn()), this.$info.fadeOut(), this.$switch.fadeOut())
                }, l.prototype.updateBackground = function(t) {
                    var n, r;
                    return n = e.getBaseColorByHue(this.palette.getHueActive()), r = e.hsv2rgb(n), $(".wheel-bgcol").css({
                        background: "#" + r.getHex()
                    })
                }, l.prototype.drawBackground = function() {
                    var e, r, i, u, f, l, c;
                    this.$e = $("<DIV>", {
                        "class": this.options.className
                    }).width(this.options.width).height(this.options.height).data("control", this), this.$parent.append(this.$e), this.$e.append($("<DIV>", {
                        "class": "wheel-bgcol"
                    }));
                    for (i = c = 1; c <= 4; i = ++c) this.$e.append($("<DIV>", {
                        "class": "wheel-tile tile-" + i
                    }));
                    return u = new t(this.$e), f = new n(u), l = this, r = !1, e = !1, this.$overlay = $("<DIV>", {
                        "class": "clickable"
                    }).width(this.options.width).height(this.options.height).css({
                        position: "relative",
                        zIndex: 1
                    }).on("mousedown", function(e) {
                        return f.setXYByPagePos({
                            left: e.pageX,
                            top: e.pageY
                        }), f.r >= l.options.activeRadius[0] && f.r <= l.options.activeRadius[1] && !l.isOverlay && l.dotPri.$e.triggerHandler("mousedown", e), !1
                    }).on("mousemove", function(t) {
                        var n;
                        if (o.on) return;
                        f.setXYByPagePos({
                            left: t.pageX,
                            top: t.pageY
                        });
                        if (f.r < l.options.variatorRadius && !r) return r = !0, n = l.$overlay.data("timerOut"), n ? (clearTimeout(n), l.$overlay.data("timerOut", null)) : (n = setTimeout(function() {
                            return l.$overlay.data("timerIn", null), l.overlay(!0)
                        }, 250), l.$overlay.data("timerIn", n));
                        if (f.r >= l.options.variatorRadius && r && !e) return r = !1, n = l.$overlay.data("timerIn"), n ? (clearTimeout(n), l.$overlay.data("timerIn", null)) : (n = setTimeout(function() {
                            return l.$overlay.data("timerOut", null), l.overlay(!1)
                        }, 250), l.$overlay.data("timerOut", n))
                    }), this.$e.append(this.$overlay), this.$info = $("<DIV>", {
                        "class": "infopane"
                    }), this.$overlay.append(this.$info), this.$info.text(a("variator.info.shiftText")), this.$info.fadeOut(0), this.$switch = $("<DIV>", {
                        "class": "switch"
                    }), this.$overlay.append(this.$switch), this["switch"] = new s(this.$switch, this, this.palette, {
                        onEnter: function() {
                            return e = !0
                        },
                        onLeave: function() {
                            return e = !1
                        }
                    }), this.$switch.fadeOut(0)
                }, l
            }(), l
        })
    }.call(this),
    function() {
        define("ui.control.presets.class", ["app.ini", "app.events", "app.locale", "color.wheel", "color.palette.class", "color.presets", "geometry.plane.class", "geometry.point.class", "ui.control.dot.class", "ui.control.palette.class", "ui.control.variator.class", "util"], function(e, t, n, r, i, s, o, u, a, f, l, c) {
            var h;
            return h = function() {
                function r(e, n, r) {
                    var i, s;
                    this.palette = e, this.$parent = n, i = {
                        className: "control control-presets"
                    };
                    if (!this.$parent) return;
                    s = this, this.options = c.objMerge(i, r), this.init(), t.register("palette/colors/changed", function() {
                        if (s.active) return s.draw()
                    })
                }
                return r.prototype.init = function() {
                    return this.active = !1
                }, r.prototype.activate = function(e) {
                    this.active = !!e;
                    if (this.active) return this.draw()
                }, r.prototype.draw = function() {
                    var r, i, o, u, a, l, c, h;
                    c = this, this.paletteWork = this.palette.copy(!0), this.palette.varsMultiOn && (this.paletteWork.setModel("mono"), this.paletteWork.setHue(this.palette.getHueActive())), this.$parent.empty(), this.$e = $("<DIV>", {
                        "class": this.options.className
                    }).width(this.options.width).height(this.options.height).data("control", this), this.$parent.append(this.$e), o = $("<UL>"), this.$e.append(o), h = s.presetList;
                    for (a in h) l = h[a], i = $("<LI>"), o.append(i), r = $("<A>", {
                        href: "#"
                    }), i.append(r), this.paletteWork.setPreset(a), u = new f(this.paletteWork, r, {
                        asStatic: !0
                    }), r.data("preset", a), r.append(n("preset.list." + a + ".title"));
                    return o.find("a").click(function(n) {
                        return n.preventDefault(), a = $(this).data("preset"), c.palette.setPreset(a), t.trigger("ga/event", {
                            key: e.GA.event.preset,
                            value: a
                        })
                    })
                }, r
            }(), h
        })
    }.call(this),
    function() {
        define("ui.control.share.class", ["app.ini", "app.events", "app.locale", "util"], function(e, t, n, r) {
            var i;
            return i = function() {
                function t(t, i, s) {
                    var o, u, a, f;
                    this.palette = t, this.$parent = i, u = {
                        className: "",
                        text: n("app.btnShare.btn") + "  ▸"
                    };
                    if (!this.$parent) return;
                    f = this, this.options = r.objMerge(u, s), a = this.$parent.position(), this.$e = $("<SPAN>", {
                        "class": "control control-share " + this.options.className
                    }), this.$parent.append(this.$e), o = $("<A>", {
                        href: "#"
                    }).html(this.options.text), this.$e.append(o), o.click(function(t) {
                        return t.preventDefault(), r.sendRequest(e.urls.palette.url, "GET", {
                            uid: f.palette.uid
                        }, "_blank")
                    })
                }
                return t.prototype.done = function() {
                    return this.$e.remove()
                }, t
            }(), i
        })
    }.call(this),
    function() {
        define("ui.control.loader.class", ["app.events", "util"], function(e, t) {
            var n;
            return n = function() {
                function e(e, n) {
                    var r, i, s, o;
                    this.$parent = e, i = {
                        className: "",
                        hideParent: !1
                    };
                    if (!this.$parent) return;
                    o = this, this.options = t.objMerge(i, n), s = this.$parent.position(), this.$e = $("<DIV>", {
                        "class": "control control-loader " + this.options.className,
                        css: {
                            position: "absolute",
                            zIndex: 9999,
                            left: s.left + "px",
                            top: s.top + "px",
                            width: this.$parent.width() + "px",
                            height: this.$parent.height() + "px"
                        }
                    }), r = $("<DIV>", {
                        "class": "loader-in"
                    }), this.$e.append(r), this.$parent.after(this.$e), this.options.hideParent && this.$parent.css("visibility", "hidden")
                }
                return e.prototype.done = function() {
                    this.$e.remove();
                    if (this.options.hideParent) return this.$parent.css("visibility", "visible")
                }, e
            }(), n
        })
    }.call(this),
    function() {
        define("ui.control.colorinfo.class", ["app.events", "app.locale", "util", "color.class", "color.rgb.class", "ui.control.button.class", "ui.control.palette.class", "ui.control.dialog.class", "color.oklch"], function(e, t, n, r, i, s, o, u, oklch) {
    var a;
    return a = function() {
        function o(o, a, f) {
            var l, c, h, p, d, v, m, g, y, b, w, E, S, x, T, N;
            this.color = o, this.$parent = a, y = {
                somethin: null
            };
            if (!this.$parent) return;
            N = this, this.options = n.objMerge(y, f), this.options.hex && (T = new i(0, 0, 0), T.setByHex(this.options.hex), this.color = new r(0), this.color.setByRGB(T)), l = $("<DIV>"), b = new u(this.$parent, l, {
                className: "dlg-colorinfo",
                title: t("colorInfo.title"),
                width: 520
            }), c = $("<CANVAS>", {
                css: {
                    width: "100%",
                    height: "150px"
                }
            }), l.append(c), S = c.width(), x = c.height(), g = c.get(0), g.width = S, g.height = x, m = g.getContext("2d"), m.fillStyle = this.color.getCSS(), m.fillRect(0, 0, S, x), w = g.toDataURL("image/png"), c.remove(), c = $("<IMG>", {
                src: w,
                width: S,
                height: x,
                css: {
                    cursor: "pointer"
                }
            }), l.append(c), c.click(function() {
                return window.open(w)
            }), h = $("<TABLE>"), l.append(h), p = $("<TBODY>"), h.append(p), d = function(e, t) {
                var n, r, i, s;
                return s = $("<TR>"), p.append(s), i = $("<TH>").append(e), s.append(i), r = $("<TD>"), n = $("<CODE>", { title: "Click to copy" }).text(t), r.append(n), n.click(function() {
                    var e, val = n.text();
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        navigator.clipboard.writeText(val).catch(function(){});
                    }
                    if (window._palShowToast) {
                        window._palShowToast("Copied: " + val);
                    }
                    e = $("<INPUT>", {
                        type: "text",
                        value: val,
                        readonly: !0
                    }), n.hide().after(e), e.focus(function() {
                        var e;
                        return e = $(this), setTimeout(function() {
                            return e.select()
                        }, 10)
                    }).blur(function() {
                        return n.show(), $(this).remove()
                    }), e.width(n.width()).focus()
                }), s.append(r)
            }, d("RGB [hex]", this.color.getHex()), d("RGB [0–255]", this.color.getTextVal(", ")), d("RGB [0–100%]", this.color.getTextPerc(1, !0, ", ")), d("HSL", oklch ? oklch.formatColorString(this.color.rgb.r, this.color.rgb.g, this.color.rgb.b, "hsl") : ""), d("OKLCH", this.color.getTextOKLCH()), d("APCA Contrast", "on #FFF: " + this.color.getAPCA({r:255,g:255,b:255}) + " Lc | on #000: " + this.color.getAPCA({r:0,g:0,b:0}) + " Lc"), d(t("colorInfo.lblHue") + "* (RYB)", this.color.hsv.h + "°"), d(t("colorInfo.lblLum") + " [0–100%]", n.round(this.color.getLum() * 100, 2) + " %"), d(t("colorInfo.lblLumRel") + ' <a href="http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef" target="_blank">' + t("colorInfo.linkWCAG") + "</a> [0–100%]", n.round(this.color.getLumWCAG() * 100, 2) + " %"), E = this.color.rgb.getLAB(), d("LAB", n.round(E.l, 2) + ", " + n.round(E.a, 2) + ", " + n.round(E.b, 2)), v = new s(l, {
                className: "apply",
                label: t("colorInfo.btnApply"),
                asUIButton: !0,
                onClick: function() {
                    return e.trigger("palette/set/base", {
                        color: N.color
                    }), b.close()
                }
            })
        }
        return o
    }(), a
});
    }.call(this),
    function() {
        define("ui.control.preview.class", ["app.ini", "app.events", "app.settings", "app.locale", "util", "ui.control.menu.class", "ui.control.loader.class", "ui.control.colorinfo.class"], function(e, t, n, r, i, s, o, u) {
    var a, f;
    return f = [{
        id: "uimock",
        url: "preview/ui-mockup.html"
    }, {
        separator: !0
    }, {
        id: "def",
        url: "preview/default.html"
    }, {
        id: "deftxt",
        url: "preview/default-text.html"
    }, {
        id: "alt",
        url: "preview/preview-2.html"
    }, {
        id: "alttxt",
        url: "preview/preview-2-text.html"
    }, {
        id: "circ",
        url: "preview/circles.html"
    }, {
        separator: !0
    }, {
        id: "csd3",
        url: "preview/preview-csd3.html"
    }, {
        id: "csd2",
        url: "preview/preview-csd2.html"
    }, {
        id: "csd1",
        url: "preview/preview-csd1.html"
    }, {
        separator: !0
    }, {
        id: "mond",
        url: "preview/mondrian.html"
    }, {
        id: "mond0",
        url: "preview/mondrian-dark.html"
    }], a = function() {
        function a(e, t, r, s) {
            var o, u;
            this.$button = e, this.$parent = t, this.$iframe = r, o = {
                "default": "def"
            };
            if (!this.$parent || !this.$button) return;
            u = this, this.options = i.objMerge(o, s), this.selected = n.get("PRV") || this.options["default"], this.init()
        }
        return a.prototype.init = function() {
            var e, n, i, o, u, a, l;
            u = this, t.register("ui/preview/set", function(e, t) {
                return u.setPreview(t.id)
            }), t.register("ui/preview/loaded", function() {
                return u.loaded()
            }), t.register("palette/colors/changed", function() {
                return u.colorize()
            }), t.register("palette/typography/changed", function(e, typo) {
                return u.applyTypography(typo)
            }), t.register("ui/preview/colinfo", function(e, t) {
                return u.colInfo(t.hex)
            }), n = [];
            for (e = a = 0, l = f.length; a < l; e = ++a) o = f[e], o.separator ? n.push({
                separator: !0
            }) : n.push({
                label: r("preview.list." + o.id + ".title"),
                selected: o.id === this.selected,
                event: "ui/preview/set",
                id: o.id,
                data: null
            });
            return i = new s(this.$button, {
                className: "menu-preview",
                positionMy: "center bottom",
                positionAt: "center bottom",
                items: n
            }), this.$button.click(function(e) {
                return e.preventDefault(), i.open()
            }), this.$iframe.on("load", function() {
                u.applyTypography();
            }), this.setPreview(this.selected)
        }, a.prototype.getPreview = function(e) {
            var t, n, r, i;
            for (t = r = 0, i = f.length; r < i; t = ++r) {
                n = f[t];
                if (n.id === e) return n
            }
            return null
        }, a.prototype.setPreview = function(r) {
            var i, s, u;
            return r && (this.selected = r), i = this.getPreview(this.selected), i || (this.selected = this.options["default"], i = this.getPreview(this.selected)), (s = this.$bodyIF) != null && s.html(""), (u = this.loader) != null && typeof u.done == "function" && u.done(), this.loader = new o(this.$iframe), this.$iframe.attr("src", i.url), n.set("PRV", this.selected), t.trigger("ga/event", {
                key: e.GA.event.preview,
                value: this.selected
            })
        }, a.prototype.loaded = function() {
            return this.loader.done(), t.trigger("preview/changed", {
                id: this.selected
            }), this.$bodyIF = this.$iframe.contents().find("body"), this.applyTypography(), this.colorize()
        }, a.prototype.colorize = function() {
            var e, n;
            return n = this, e = n.$iframe.get(0).contentWindow, e && e.colorize ? n.$iframe.get(0).contentWindow.colorize() : t.trigger("palette/colorize", {
                $e: n.$bodyIF,
                sorted: !1,
                converted: !0
            })
        }, a.prototype.applyTypography = function(typo) {
            try {
                var iframe = this.$iframe ? this.$iframe[0] : null;
                if (!iframe) return;
                var win = iframe.contentWindow;
                var doc = iframe.contentDocument || (win ? win.document : null);
                if (!doc || !doc.head) return;

                var pal = window._Paletton ? window._Paletton.palette : null;
                typo = typo || (pal && pal.getTypography ? pal.getTypography() : null);
                if (!typo) return;

                var root = doc.documentElement;
                if (root && root.style) {
                    if (typo.heading) root.style.setProperty('--font-heading', typo.heading);
                    if (typo.body) root.style.setProperty('--font-body', typo.body);
                    if (typo.weightHeading) root.style.setProperty('--font-weight-heading', typo.weightHeading);
                    if (typo.letterSpacing) root.style.setProperty('--letter-spacing-heading', typo.letterSpacing);
                    if (typo.lineHeight) root.style.setProperty('--line-height-body', typo.lineHeight);
                    if (typo.scale) root.style.setProperty('--type-scale-ratio', typo.scale);
                }

                var styleEl = doc.getElementById('pal-typography-style');
                if (!styleEl) {
                    styleEl = doc.createElement('style');
                    styleEl.id = 'pal-typography-style';
                    doc.head.appendChild(styleEl);
                }
                var css = [
                    "@import url('https://fonts.googleapis.com/css2?family=Black+Ops+One&family=Cinzel:wght@600;700;800&family=Fredoka:wght@600;700&family=Orbitron:wght@700;800;900&family=Press+Start+2P&family=Rajdhani:wght@600;700&family=Russo+One&family=Share+Tech+Mono&family=VT323&display=swap');",
                    ':root {',
                    '  --font-heading: ' + typo.heading + ' !important;',
                    '  --font-body: ' + typo.body + ' !important;',
                    '  --font-weight-heading: ' + typo.weightHeading + ' !important;',
                    '  --letter-spacing-heading: ' + typo.letterSpacing + ' !important;',
                    '  --line-height-body: ' + typo.lineHeight + ' !important;',
                    '  --type-scale-ratio: ' + typo.scale + ' !important;',
                    '}',
                    'body, p, span, li, td, th, input, button, select, textarea, .text-content, .copy, .preview-var {',
                    '  font-family: ' + typo.body + ' !important;',
                    '}',
                    'h1, h2, h3, h4, h5, h6, .ttl, .title, .logo, header h2, .card-title, .nav-brand, .ui-heading, .stat-value, .fw-preview-head, dt {',
                    '  font-family: ' + typo.heading + ' !important;',
                    '  font-weight: ' + typo.weightHeading + ' !important;',
                    '  letter-spacing: ' + typo.letterSpacing + ' !important;',
                    '}'
                ].join('\n');
                styleEl.textContent = css;

                var fontNameEl = doc.querySelector('.font-preview-name');
                if (fontNameEl && typo.name) {
                    fontNameEl.textContent = typo.name;
                }

                if (win && typeof win.applyTypography === 'function') {
                    win.applyTypography(typo);
                }
            } catch(err) {
                console.warn('Preview applyTypography error:', err);
            }
        }, a.prototype.colInfo = function(e) {
            return new u(null, this.$parent, {
                hex: e
            })
        }, a
    }(), a
});
    }.call(this),
    function() {
        define("ui.control.colorlist.table.simple", ["app.events", "app.locale", "util", "ui.control.colorinfo.class"], function(e, t, n, r) {
            var i;
            return i = {
                draw: function(e, i, s) {
                    var o, u, a;
                    a = function(t, i, o) {
                        var u, a, f, l, c, h, p, d;
                        a = $("<TR>"), t.append(a), h = [1, 2, 0, 3, 4], d = [];
                        for (l = p = 0; p <= 4; l = ++p) c = h[l], f = s.colorTable.byPalette[i][c], u = $("<TD>", {
                            "class": "col col-" + c,
                            title: o + " (" + c + ")"
                        }), a.append(u), u.css({
                            background: f.getCSS()
                        }), f.getLum() < .3 ? u.addClass("dark") : u.addClass("light"), u.text(f.getHex()), u.data("color", n.objCopy(f)), u.click(function() {
                            return f = $(this).data("color"), new r(f, e)
                        }), d.push(n.colorTooltip(u));
                        return d
                    }, e.empty(), i.empty(), o = $("<TABLE>", {
                        "class": "table table-simple"
                    }), e.append(o), u = $("<TBODY>"), o.append(u), a(u, "pri", t("color.pri")), s.hasSecs() && (a(u, "sec1", t("color.sec") + " #1"), a(u, "sec2", t("color.sec") + " #2"));
                    if (s.hasCompl()) return a(u, "compl", t("color.compl"))
                }
            }, i
        })
    }.call(this),
    function() {
        define("ui.control.colorlist.table.detail", ["app.events", "app.locale", "util", "ui.control.colorinfo.class"], function(e, t, n, r) {
            var i;
            return i = {
                draw: function(e, i, s) {
                    var o, u, a;
                    a = function(t, i, u) {
                        var a, f, l, c, h, p, d, v, m, g, y, b;
                        c = $("<TR>", {
                            "class": "title"
                        }), t.append(c), l = $("<TD>", {
                            "class": "title",
                            colspan: 5
                        }), c.append(l), l.text(u), c = $("<TR>"), t.append(c), h = $("<TR>", {
                            "class": "info"
                        }), t.append(h), g = [1, 2, 0, 3, 4], b = [];
                        for (v = y = 0; y <= 4; v = ++y) m = g[v], p = s.colorTable.byPalette[i][m], l = $("<TD>", {
                            "class": "col col-" + m
                        }), c.append(l), l.css({
                            background: p.getCSS()
                        }), l.attr({
                            title: u + " (" + m + ")"
                        }), l.data("color", n.objCopy(p)), l.click(function() {
                            return p = $(this).data("color"), new r(p, e)
                        }), n.colorTooltip(l), l = $("<TD>", {
                            "class": "desc col-" + m
                        }), h.append(l), d = p.getHex(), a = $("<P>", {
                            "class": "hexcode"
                        }), f = $("<SPAN>"), f.text(d), a.append(f), f.click(function() {
                            return o.find(".hexcode span").hide(), o.find(".hexcode input").show(), $(this).next().focus()
                        }), f = $("<INPUT>", {
                            type: "text",
                            value: d,
                            readonly: !0
                        }), a.append(f), f.hide(), f.focus(function() {
                            var e;
                            return e = $(this), setTimeout(function() {
                                return e.select()
                            }, 10)
                        }), l.append(a), a = $("<P>", {
                            "class": "selectable"
                        }), a.text("RGB: " + p.getTextVal()), l.append(a), a = $("<P>", {
                            "class": "selectable"
                        }), a.text("RGB [%]: " + p.getTextPerc(1, !0)), b.push(l.append(a));
                        return b
                    }, e.empty(), i.empty(), o = $("<TABLE>", {
                        "class": "table table-detail"
                    }), e.append(o), u = $("<TBODY>"), o.append(u), a(u, "pri", t("color.pri")), s.hasSecs() && (a(u, "sec1", t("color.sec") + " #1"), a(u, "sec2", t("color.sec") + " #2"));
                    if (s.hasCompl()) return a(u, "compl", t("color.compl"))
                }
            }, i
        })
    }.call(this),
    function() {
        define("ui.control.colorlist.table.grid", ["app.events", "app.settings", "app.locale", "util", "color.class", "ui.control.colorinfo.class", "ui.control.btnedit.class"], function(e, t, n, r, i, s, o) {
            var u;
            return u = {
                draw: function(e, t, n) {
                    var r, i, o, u, a, f;
                    return e.empty(), t.empty(), r = $("<TABLE>", {
                        "class": "table-grid"
                    }), e.append(r), i = $("<TBODY>"), r.append(i), f = n.getColorGrid(19), a = function(t, n, r) {
                        var i, o, u, a, l, c, h, p, d, v, m, g, y, b, w, E;
                        i = $("<TABLE>", {
                            "class": "grid"
                        }), o = $("<TBODY>"), i.append(o), f[t] || (t = "pri"), n ? (y = f[t].length - 1, b = 0, g = -1) : (y = 0, b = f[t].length - 1, g = 1);
                        for (d = w = y; g > 0 ? w <= b : w >= b; d = w += g) {
                            m = f[t][d], a = $("<TR>"), o.append(a), r ? (h = m.length - 1, p = 0, c = -1) : (h = 0, p = m.length - 1, c = 1);
                            for (v = E = h; c > 0 ? E <= p : E >= p; v = E += c) l = m[v], u = $("<TD>", {
                                "class": "empty"
                            }), a.append(u), u.css({
                                background: l.getHex(!0)
                            }).data("color", l).click(function(t) {
                                var n;
                                return t.stopPropagation(), n = $(this).data("color"), new s(n, e)
                            })
                        }
                        return i
                    }, u = $("<TR>"), i.append(u), o = $("<TD>"), u.append(o), o.append(a("pri", 0, 0)), o = $("<TD>"), u.append(o), o.append(a("sec1", 0, 1)), u = $("<TR>"), i.append(u), o = $("<TD>"), u.append(o), o.append(a("sec2", 1, 0)), o = $("<TD>"), u.append(o), o.append(a("compl", 1, 1))
                }
            }, u
        })
    }.call(this),
    function() {
        define("ui.control.colorlist.table.contrast", ["app.events", "app.settings", "app.locale", "util", "color.class", "ui.control.colorinfo.class", "ui.control.btnedit.class"], function(e, t, n, r, i, s, o) {
            var u;
            return u = {
                draw: function(e, u, a) {
                    var f, l, c, h, p, d, v, m, g, y, b, w, E, S, x, T, N, C, k, L, A, O;
                    b = t.get("CFLT"), b != null || 0 <= b && b <= 21 || (b = 2), e.empty(), u.empty(), c = $("<TABLE>", {
                        "class": "table table-contrast"
                    }), e.append(c), h = $("<TBODY>"), c.append(h), m = new i(0), m.setSV(0, 1), v = [m], v = v.concat(a.colorTable.byLum.pri), a.hasSecs() && (v = v.concat(a.colorTable.byLum.sec1), v = v.concat(a.colorTable.byLum.sec2)), a.hasCompl() && (v = v.concat(a.colorTable.byLum.compl)), m = new i(0), m.setSV(0, 0), v.push(m), d = $("<TR>"), h.append(d), p = $("<TD>", {
                        "class": "empty"
                    }), d.append(p);
                    for (w = N = 0, L = v.length; N < L; w = ++N) y = v[w], p = $("<TH>", {
                        "class": "col colx col-" + w,
                        title: y.getHex()
                    }), d.append(p), p.css({
                        background: y.getCSS()
                    }), p.data("color", r.objCopy(y)), r.colorTooltip(p);
                    for (w = C = 0, A = v.length; C < A; w = ++C) {
                        y = v[w], d = $("<TR>"), h.append(d), p = $("<TH>", {
                            "class": "col coly col-" + w,
                            title: y.getHex()
                        }), d.append(p), p.css({
                            background: y.getCSS()
                        }), p.data("color", r.objCopy(y)), r.colorTooltip(p);
                        for (E = k = 0, O = v.length; k < O; E = ++k) g = v[E], x = g.getLumWCAG() + .05, T = y.getLumWCAG() + .05, S = x / T, S < 1 && (S = 1 / S), S = r.round(S, 1), p = $("<TD>", {
                            "class": "col bg col-" + w + "-" + E,
                            title: y.getHex()
                        }), d.append(p), p.css({
                            background: y.getCSS(),
                            opacity: S < b ? .1 : 1
                        }), p.data("color", r.objCopy(y)), p.data("contrast", S), r.colorTooltip(p), l = $("<DIV>", {
                            "class": "col fg",
                            title: g.getHex()
                        }), p.append(l), l.css({
                            background: g.getCSS()
                        }), l.data("color", r.objCopy(g)), r.colorTooltip(l), l = $("<DIV>", {
                            "class": "info"
                        }).text(S), p.append(l), l.css({
                            color: T < .33 ? "rgba(255,255,255,0.33)" : "rgba(0,0,0,0.66)"
                        })
                    }
                    return h.find(".col").click(function(t) {
                        return t.stopPropagation(), m = $(this).data("color"), new s(m, e)
                    }), l = $("<DIV>").text(n("colorList.contrast.desc")), u.append(l), f = new o(u, {
                        className: "btn-filter",
                        labelPre: n("colorList.contrast.filter.btn") + ": ",
                        labelPost: "",
                        value: b,
                        dlgTitle: n("colorList.contrast.filter.title"),
                        dlgText: n("colorList.contrast.filter.text"),
                        dlgWidth: 240,
                        positionMy: "right bottom",
                        positionAt: "right bottom",
                        listen: [],
                        callback: function(e) {
                            return e = parseFloat(e), isNaN(e) && (e = 0), e < 0 && (e = 0), e > 21 && (e = 21), e = r.round(e, 1), h.find(".bg.col").each(function() {
                                return S = $(this).data("contrast"), $(this).css("opacity", S < e ? .1 : 1)
                            }), t.set("CFLT", e), e
                        }
                    })
                }
            }, u
        })
    }.call(this),
    function() {
        define("ui.control.colorlist.table.tonal", ["app.events", "app.locale", "util", "color.oklch", "color.rgb.class", "color.class", "ui.control.colorinfo.class"], function(e, t, n, oklch, RgbClass, ColorClass, ColorInfo) {
    "use strict";

    var steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

    return {
        draw: function($content, $tools, palette) {
            $content.empty();
            $tools.empty();

            var $table = $("<TABLE>", { "class": "table table-detail table-tonal" });
            $content.append($table);
            var $tbody = $("<TBODY>");
            $table.append($tbody);

            var scales = palette.getTonalScales();

            function renderGroup($tbody, groupKey, groupTitle) {
                var groupScale = scales[groupKey];
                if (!groupScale) return;

                // Group title row
                var $titleTr = $("<TR>", { "class": "title" });
                var $titleTd = $("<TD>", { "class": "title", colspan: steps.length }).text(groupTitle);
                $titleTr.append($titleTd);
                $tbody.append($titleTr);

                // Swatch row
                var $swatchTr = $("<TR>", { "class": "tonal-swatches" });
                $tbody.append($swatchTr);

                // Info row
                var $infoTr = $("<TR>", { "class": "info tonal-info" });
                $tbody.append($infoTr);

                for (var i = 0; i < steps.length; i++) {
                    var step = steps[i];
                    var stepData = groupScale[step];
                    if (!stepData) continue;

                    var isLight = stepData.L >= 0.55;
                    var textColor = isLight ? "#111" : "#FFF";

                    var $swatchTd = $("<TD>", {
                        "class": "col col-tonal col-" + step,
                        title: groupTitle + " " + step + " (" + stepData.hex + " / " + stepData.oklchCss + ")"
                    }).css({
                        background: stepData.hex,
                        color: textColor,
                        height: "44px",
                        textAlign: "center",
                        verticalAlign: "middle",
                        fontWeight: "bold",
                        fontSize: "11px",
                        cursor: "pointer"
                    }).text(step);

                    (function(sd) {
                        $swatchTd.click(function() {
                            var rgbObj = new RgbClass(sd.r, sd.g, sd.b);
                            var colObj = new ColorClass(sd.H);
                            colObj.rgb = rgbObj;
                            colObj.setSV(sd.C, sd.L);
                            new ColorInfo(colObj, $content);
                        });
                    })(stepData);

                    $swatchTr.append($swatchTd);

                    var $infoTd = $("<TD>", {
                        "class": "desc col-tonal col-" + step
                    }).css({
                        fontSize: "10px",
                        padding: "6px 2px",
                        textAlign: "center",
                        verticalAlign: "top"
                    });

                    var $hexP = $("<P>", { "class": "hexcode" }).css({ margin: "2px 0", cursor: "pointer" });
                    var $hexSpan = $("<SPAN>").text(stepData.hex);
                    var $hexInput = $("<INPUT>", {
                        type: "text",
                        value: stepData.hex,
                        readonly: true
                    }).css({ width: "55px", fontSize: "10px", textAlign: "center" }).hide();

                    (function(inp, sp, hexVal, oklchStr) {
                        sp.click(function() {
                            var latestFmt = (window._palGetCopyFormat && window._palGetCopyFormat()) || "hex";
                            var copyVal = oklch.formatHexColor(hexVal, latestFmt);
                            if (navigator.clipboard && navigator.clipboard.writeText) {
                                navigator.clipboard.writeText(copyVal).catch(function(){});
                            }
                            if (window._palShowToast) window._palShowToast("Copied: " + copyVal);
                            $table.find(".hexcode span").show();
                            $table.find(".hexcode input").hide();
                            sp.hide();
                            inp.val(copyVal).show().focus().select();
                        });
                        inp.blur(function() {
                            inp.hide();
                            sp.show();
                        });
                    })($hexInput, $hexSpan, stepData.hex, stepData.oklchCss);

                    $hexP.append($hexSpan).append($hexInput);
                    $infoTd.append($hexP);

                    var $oklchP = $("<P>", {
                        "class": "selectable",
                        title: stepData.oklchCss + " (Click to copy)"
                    }).css({
                        fontSize: "9px",
                        color: "#888",
                        margin: "2px 0",
                        cursor: "copy"
                    }).text(Math.round(stepData.L * 100) + "% L");

                    (function(oklchStr) {
                        $oklchP.click(function() {
                            if (navigator.clipboard && navigator.clipboard.writeText) {
                                navigator.clipboard.writeText(oklchStr).catch(function(){});
                            }
                            if (window._palShowToast) window._palShowToast("Copied: " + oklchStr);
                        });
                    })(stepData.oklchCss);

                    $infoTd.append($oklchP);
                    $infoTr.append($infoTd);
                }
            }

            renderGroup($tbody, "pri", t("color.pri"));
            if (palette.hasSecs()) {
                renderGroup($tbody, "sec1", t("color.sec") + " #1");
                renderGroup($tbody, "sec2", t("color.sec") + " #2");
            }
            if (palette.hasCompl()) {
                renderGroup($tbody, "compl", t("color.compl"));
            }

            var $desc = $("<DIV>").css({ padding: "8px 12px", color: "#666", fontSize: "12px" })
                .text("11-step perceptual tonal scales (50…950) generated in OKLCH with natural warm/cool hue shift. Click any swatch for color details.");
            $tools.append($desc);
        }
    };
});
    }.call(this),
    function() {
        define("ui.control.colorlist.table.tonal", ["app.events", "app.locale", "util", "color.oklch", "color.rgb.class", "color.class", "ui.control.colorinfo.class"], function(e, t, n, oklch, RgbClass, ColorClass, ColorInfo) {
            "use strict";
        
            var steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
        
            return {
                draw: function($content, $tools, palette) {
                    $content.empty();
                    $tools.empty();
        
                    var $table = $("<TABLE>", { "class": "table table-detail table-tonal" });
                    $content.append($table);
                    var $tbody = $("<TBODY>");
                    $table.append($tbody);
        
                    var scales = palette.getTonalScales();
        
                    function renderGroup($tbody, groupKey, groupTitle) {
                        var groupScale = scales[groupKey];
                        if (!groupScale) return;
        
                        // Group title row
                        var $titleTr = $("<TR>", { "class": "title" });
                        var $titleTd = $("<TD>", { "class": "title", colspan: steps.length }).text(groupTitle);
                        $titleTr.append($titleTd);
                        $tbody.append($titleTr);
        
                        // Swatch row
                        var $swatchTr = $("<TR>", { "class": "tonal-swatches" });
                        $tbody.append($swatchTr);
        
                        // Info row
                        var $infoTr = $("<TR>", { "class": "info tonal-info" });
                        $tbody.append($infoTr);
        
                        for (var i = 0; i < steps.length; i++) {
                            var step = steps[i];
                            var stepData = groupScale[step];
                            if (!stepData) continue;
        
                            var isLight = stepData.L >= 0.55;
                            var textColor = isLight ? "#111" : "#FFF";
        
                            var $swatchTd = $("<TD>", {
                                "class": "col col-tonal col-" + step,
                                title: groupTitle + " " + step + " (" + stepData.hex + " / " + stepData.oklchCss + ")"
                            }).css({
                                background: stepData.hex,
                                color: textColor,
                                height: "44px",
                                textAlign: "center",
                                verticalAlign: "middle",
                                fontWeight: "bold",
                                fontSize: "11px",
                                cursor: "pointer"
                            }).text(step);
        
                            (function(sd) {
                                $swatchTd.click(function() {
                                    var rgbObj = new RgbClass(sd.r, sd.g, sd.b);
                                    var colObj = new ColorClass(sd.H);
                                    colObj.rgb = rgbObj;
                                    colObj.setSV(sd.C, sd.L);
                                    new ColorInfo(colObj, $content);
                                });
                            })(stepData);
        
                            $swatchTr.append($swatchTd);
        
                            var $infoTd = $("<TD>", {
                                "class": "desc col-tonal col-" + step
                            }).css({
                                fontSize: "10px",
                                padding: "6px 2px",
                                textAlign: "center",
                                verticalAlign: "top"
                            });
        
                            var $hexP = $("<P>", { "class": "hexcode" }).css({ margin: "2px 0", cursor: "pointer" });
                            var $hexSpan = $("<SPAN>").text(stepData.hex);
                            var $hexInput = $("<INPUT>", {
                                type: "text",
                                value: stepData.hex,
                                readonly: true
                            }).css({ width: "55px", fontSize: "10px", textAlign: "center" }).hide();
        
                            (function(inp, sp) {
                                sp.click(function() {
                                    $table.find(".hexcode span").show();
                                    $table.find(".hexcode input").hide();
                                    sp.hide();
                                    inp.show().focus().select();
                                });
                                inp.blur(function() {
                                    inp.hide();
                                    sp.show();
                                });
                            })($hexInput, $hexSpan);
        
                            $hexP.append($hexSpan).append($hexInput);
                            $infoTd.append($hexP);
        
                            var $oklchP = $("<P>", {
                                "class": "selectable",
                                title: stepData.oklchCss
                            }).css({
                                fontSize: "9px",
                                color: "#888",
                                margin: "2px 0",
                                cursor: "copy"
                            }).text(Math.round(stepData.L * 100) + "% L");
        
                            $infoTd.append($oklchP);
                            $infoTr.append($infoTd);
                        }
                    }
        
                    renderGroup($tbody, "pri", t("color.pri"));
                    if (palette.hasSecs()) {
                        renderGroup($tbody, "sec1", t("color.sec") + " #1");
                        renderGroup($tbody, "sec2", t("color.sec") + " #2");
                    }
                    if (palette.hasCompl()) {
                        renderGroup($tbody, "compl", t("color.compl"));
                    }
        
                    var $desc = $("<DIV>").css({ padding: "8px 12px", color: "#666", fontSize: "12px" })
                        .text("11-step perceptual tonal scales (50…950) generated in OKLCH with natural warm/cool hue shift. Click any swatch for color details.");
                    $tools.append($desc);
                }
            };
        });
    }.call(this),
    function() {
        define("ui.control.colorlist.table.tonal", ["app.events", "app.locale", "util", "color.oklch", "color.rgb.class", "color.class", "ui.control.colorinfo.class"], function(e, t, n, oklch, RgbClass, ColorClass, ColorInfo) {
            "use strict";
        
            var steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
        
            return {
                draw: function($content, $tools, palette) {
                    $content.empty();
                    $tools.empty();
        
                    var $table = $("<TABLE>", { "class": "table table-detail table-tonal" });
                    $content.append($table);
                    var $tbody = $("<TBODY>");
                    $table.append($tbody);
        
                    var scales = palette.getTonalScales();
        
                    function renderGroup($tbody, groupKey, groupTitle) {
                        var groupScale = scales[groupKey];
                        if (!groupScale) return;
        
                        // Group title row
                        var $titleTr = $("<TR>", { "class": "title" });
                        var $titleTd = $("<TD>", { "class": "title", colspan: steps.length }).text(groupTitle);
                        $titleTr.append($titleTd);
                        $tbody.append($titleTr);
        
                        // Swatch row
                        var $swatchTr = $("<TR>", { "class": "tonal-swatches" });
                        $tbody.append($swatchTr);
        
                        // Info row
                        var $infoTr = $("<TR>", { "class": "info tonal-info" });
                        $tbody.append($infoTr);
        
                        for (var i = 0; i < steps.length; i++) {
                            var step = steps[i];
                            var stepData = groupScale[step];
                            if (!stepData) continue;
        
                            var isLight = stepData.L >= 0.55;
                            var textColor = isLight ? "#111" : "#FFF";
        
                            var $swatchTd = $("<TD>", {
                                "class": "col col-tonal col-" + step,
                                title: groupTitle + " " + step + " (" + stepData.hex + " / " + stepData.oklchCss + ")"
                            }).css({
                                background: stepData.hex,
                                color: textColor,
                                height: "44px",
                                textAlign: "center",
                                verticalAlign: "middle",
                                fontWeight: "bold",
                                fontSize: "11px",
                                cursor: "pointer"
                            }).text(step);
        
                            (function(sd) {
                                $swatchTd.click(function() {
                                    var rgbObj = new RgbClass(sd.r, sd.g, sd.b);
                                    var colObj = new ColorClass(sd.H);
                                    colObj.rgb = rgbObj;
                                    colObj.setSV(sd.C, sd.L);
                                    new ColorInfo(colObj, $content);
                                });
                            })(stepData);
        
                            $swatchTr.append($swatchTd);
        
                            var $infoTd = $("<TD>", {
                                "class": "desc col-tonal col-" + step
                            }).css({
                                fontSize: "10px",
                                padding: "6px 2px",
                                textAlign: "center",
                                verticalAlign: "top"
                            });
        
                            var $hexP = $("<P>", { "class": "hexcode" }).css({ margin: "2px 0", cursor: "pointer" });
                            var $hexSpan = $("<SPAN>").text(stepData.hex);
                            var $hexInput = $("<INPUT>", {
                                type: "text",
                                value: stepData.hex,
                                readonly: true
                            }).css({ width: "55px", fontSize: "10px", textAlign: "center" }).hide();
        
                            (function(inp, sp) {
                                sp.click(function() {
                                    $table.find(".hexcode span").show();
                                    $table.find(".hexcode input").hide();
                                    sp.hide();
                                    inp.show().focus().select();
                                });
                                inp.blur(function() {
                                    inp.hide();
                                    sp.show();
                                });
                            })($hexInput, $hexSpan);
        
                            $hexP.append($hexSpan).append($hexInput);
                            $infoTd.append($hexP);
        
                            var $oklchP = $("<P>", {
                                "class": "selectable",
                                title: stepData.oklchCss
                            }).css({
                                fontSize: "9px",
                                color: "#888",
                                margin: "2px 0",
                                cursor: "copy"
                            }).text(Math.round(stepData.L * 100) + "% L");
        
                            $infoTd.append($oklchP);
                            $infoTr.append($infoTd);
                        }
                    }
        
                    renderGroup($tbody, "pri", t("color.pri"));
                    if (palette.hasSecs()) {
                        renderGroup($tbody, "sec1", t("color.sec") + " #1");
                        renderGroup($tbody, "sec2", t("color.sec") + " #2");
                    }
                    if (palette.hasCompl()) {
                        renderGroup($tbody, "compl", t("color.compl"));
                    }
        
                    var $desc = $("<DIV>").css({ padding: "8px 12px", color: "#666", fontSize: "12px" })
                        .text("11-step perceptual tonal scales (50…950) generated in OKLCH with natural warm/cool hue shift. Click any swatch for color details.");
                    $tools.append($desc);
                }
            };
        });
    }.call(this),
    function() {
        define("ui.control.colorlist.class", ["app.ini", "app.events", "app.locale", "util", "ui.control.palette.class", "ui.control.button.class", "ui.control.dialog.class", "ui.control.colorinfo.class", "ui.control.colorlist.table.simple", "ui.control.colorlist.table.detail", "ui.control.colorlist.table.grid", "ui.control.colorlist.table.contrast", "ui.control.colorlist.table.tonal"], function(e, t, n, r, i, s, o, u, a, f, l, c, tonalTable) {
    var h, p;
    return p = {
        detail: {
            submenu: {
                html: {
                    event: "export/html"
                },
                css: {
                    event: "export/css"
                },
                oklch: {
                    event: "export/oklch"
                },
                tailwind: {
                    event: "export/tailwind"
                },
                dtcg: {
                    event: "export/dtcg"
                },
                figma: {
                    event: "export/figma"
                },
                less: {
                    event: "export/less"
                },
                sass: {
                    event: "export/sass"
                },
                xml: {
                    event: "export/xml"
                },
                text: {
                    event: "export/text"
                }
            }
        },
        simple: {
            submenu: {
                png: {
                    event: "export/png"
                },
                svg: {
                    event: "export/svg"
                },
                aco: {
                    event: "export/aco"
                },
                gpl: {
                    event: "export/gpl"
                },
                sketch: {
                    event: "export/sketch"
                },
                figma: {
                    event: "export/figma"
                }
            }
        },
        contrast: {
            submenu: null
        },
        tonal: {
            submenu: null
        }
    }, h = function() {
        function i(e, t, n, i) {
            var s, o;
            this.palette = e, this.$button = t, this.$parent = n, s = {
                selected: null
            };
            if (!this.$parent) return;
            o = this, this.options = r.objMerge(s, i), this.selected = this.options.selected || "detail", this.init()
        }
        return i.prototype.init = function() {
            var e;
            return e = this, this.$button.click(function(t) {
                return t.preventDefault(), e.openDlg(), e.setList()
            }), t.register("palette/uid/changed", function() {
                if (!e.open) return;
                return e.setList()
            })
        }, i.prototype.openDlg = function() {
            var r, i, s, u, a, f, l, c, h, d, v;
            d = this, r = $("<DIV>", {
                "class": "cover"
            }), u = $("<UL>", {
                "class": "list-menu control-list"
            }), r.append(u), this.$content = $("<DIV>", {
                "class": "list-content"
            }), r.append(this.$content), this.$tools = $("<DIV>", {
                "class": "list-tools"
            }), r.append(this.$tools);
            for (f in p) {
                c = p[f], i = $("<LI>").html('<a href="#" class="item-' + f + '">' + n("colorList." + f + ".title") + "</a>"), i.addClass("item selectable"), f === this.selected && i.addClass("sel"), i.data("list", f), u.append(i);
                if (c.submenu) {
                    a = $("<UL>", {
                        "class": "submenu"
                    }), i.append(a), v = c.submenu;
                    for (l in v) h = v[l], s = $("<LI>", {
                        title: n("colorList." + f + ".sub." + l + ".desc")
                    }).html('<a href="#" class="subitem-' + l + '">→  ' + n("colorList." + f + ".sub." + l + ".title") + "</a>"), s.addClass("subitem"), s.data("event", h.event), a.append(s)
                }
            }
            u.find("li.item>a").click(function(e) {
                return e.preventDefault(), i = $(this).parents("li.item"), f = i.data("list"), u.find("li.item.sel").removeClass("sel"), i.addClass("sel"), d.setList(f)
            });
            u.find("li.subitem>a").click(function(n) {
                var r;
                return n.preventDefault(), r = $(this).parent().data("event"), t.trigger(r), t.trigger("ga/view", {
                    view: e.GA.view.coltable + "/" + r
                })
            });
            var winW = $(window).width();
            var winH = $(window).height();
            var dlgW = Math.min(1600, Math.max(1060, Math.floor(winW * 0.94)));
            var dlgH = Math.min(960, Math.max(700, Math.floor(winH * 0.90)));
            this.dlg = new o(this.$parent, r, {
                className: "dlg-colorlist",
                title: n("colorList.title"),
                width: dlgW,
                height: dlgH,
                resizable: !0,
                draggable: !0,
                modal: !0,
                onClose: function() {
                    return d.open = !1, t.trigger("ga/view")
                },
                position: {
                    my: "center center",
                    at: "center center",
                    of: window
                }
            });
            this.open = !0;
        }, i.prototype.setList = function(r) {
            var i, o;
            o = this, r && (this.selected = r);
            switch (this.selected) {
                case "simple":
                    a.draw(this.$content, this.$tools, this.palette);
                    break;
                case "detail":
                    f.draw(this.$content, this.$tools, this.palette);
                    break;
                case "grid":
                    l.draw(this.$content, this.$tools, this.palette);
                    break;
                case "contrast":
                    c.draw(this.$content, this.$tools, this.palette);
                    break;
                case "tonal":
                    tonalTable.draw(this.$content, this.$tools, this.palette);
                    break;
            }
            return i = new s(this.$tools, {
                className: "btn-close",
                asUIButton: !0,
                label: n("app.btnClose"),
                onClick: function() {
                    return o.dlg.close()
                }
            }), this.$tools.append(i.$e), t.trigger("ga/view", {
                view: e.GA.view.coltable + "/" + this.selected
            })
        }, i
    }(), h
});
    }.call(this),
    function() {
        define("ui.control.convert.class", ["app.ini", "app.events", "app.locale", "util", "color.convert", "ui.control.menu.class", "ui.control.button.class"], function(e, t, n, r, i, s, o) {
            var u, a;
            return a = [{
                id: "none",
                data: {
                    type: null
                }
            }, {
                separator: !0
            }, {
                id: "colorblind",
                submenu: [{
                    id: "protanope",
                    data: {
                        type: "protanope",
                        amount: 1
                    }
                }, {
                    id: "deuteranope",
                    data: {
                        type: "deuteranope",
                        amount: 1
                    }
                }, {
                    id: "tritanope",
                    data: {
                        type: "tritanope",
                        amount: 1
                    }
                }, {
                    separator: !0
                }, {
                    id: "protanomaly",
                    data: {
                        type: "protanope",
                        amount: .6
                    }
                }, {
                    id: "deuteranomaly",
                    data: {
                        type: "deuteranope",
                        amount: .5
                    }
                }, {
                    id: "tritanomaly",
                    data: {
                        type: "tritanope",
                        amount: .5
                    }
                }, {
                    separator: !0
                }, {
                    id: "dyschromatope",
                    data: {
                        type: "achromatope",
                        amount: .85
                    }
                }, {
                    id: "achromatope",
                    data: {
                        type: "achromatope",
                        amount: 1
                    }
                }]
            }, {
                id: "desaturate",
                submenu: [{
                    id: "grayhalf",
                    data: {
                        type: "gray",
                        amount: .5
                    }
                }, {
                    id: "gray90",
                    data: {
                        type: "gray",
                        amount: .9
                    }
                }, {
                    id: "gray",
                    data: {
                        type: "gray",
                        amount: 1
                    }
                }]
            }, {
                id: "gamma",
                submenu: [{
                    id: "gamma-low",
                    data: {
                        type: "gamma",
                        amount: .15
                    }
                }, {
                    id: "gamma-high",
                    data: {
                        type: "gamma",
                        amount: .75
                    }
                }]
            }, {
                separator: !0
            }, {
                id: "webcolor",
                data: {
                    type: "webcolor"
                }
            }], u = function() {
                function i(e, t) {
                    var n, i;
                    this.$parent = e, n = {
                        className: "control control-convert",
                        asUIButton: !1,
                        positionMy: "right bottom",
                        positionAt: "right bottom+5",
                        selected: "none",
                        onChange: null
                    };
                    if (!this.$parent) return;
                    i = this, this.options = r.objMerge(n, t), this.selected = this.options.selected, this.init()
                }
                return i.prototype.init = function() {
                    var e, r, i;
                    return i = this, t.register("ui/convert/set", function(e, t) {
                        return i.setConvert(t.id)
                    }), this.$e = $("<DIV>", {
                        "class": this.options.className
                    }), this.$parent.append(this.$e), this.button = new o(this.$e, {
                        className: "",
                        label: "xxx",
                        asUIButton: this.options.asUIButton,
                        onClick: function() {
                            return i.menu.open()
                        }
                    }), e = function(t, r) {
                        var s, o, u, a, f;
                        u = [];
                        for (s = a = 0, f = t.length; a < f; s = ++a) o = t[s], o.separator ? u.push({
                            separator: !0
                        }) : (o.label = n(r + "." + o.id + ".title"), o.desc = n(r + "." + o.id + ".desc"), o.submenu ? u.push({
                            label: o.label,
                            submenu: e(o.submenu, r + "." + o.id + ".sub")
                        }) : u.push({
                            label: o.label,
                            desc: o.desc,
                            selected: o.id === i.selected,
                            event: "ui/convert/set",
                            id: o.id
                        }));
                        return u
                    }, r = e(a, "convert.list"), this.menu = new s(this.button.$e, {
                        className: "menu-model",
                        positionMy: this.options.positionMy,
                        positionAt: this.options.positionAt,
                        onChange: this.options.onChange,
                        items: r
                    }), this.setConvert(this.selected)
                }, i.prototype.getSelected = function() {
                    return this.selected
                }, i.prototype.getConvert = function(e, t) {
                    var n, r, i, s, o;
                    for (n = s = 0, o = t.length; s < o; n = ++s) {
                        r = t[n];
                        if (r.submenu) {
                            i = this.getConvert(e, r.submenu);
                            if (i) return i
                        }
                        if (r.id === e) return r
                    }
                    return null
                }, i.prototype.setConvert = function(r) {
                    var i;
                    return this.selected = r, i = this.getConvert(r, a), r === "none" ? (this.button.$e.removeClass("active"), this.button.setHtml(n("convert.btn") + "  ▾")) : (this.button.$e.addClass("active"), this.button.setHtml(n("convert.btnOn") + ": <b>" + i.label + "</b>  ▾")), t.trigger("convert/set", {
                        data: i.data
                    }), t.trigger("ga/event", {
                        key: e.GA.event.converter,
                        value: this.selected
                    })
                }, i.prototype.remove = function() {
                    return this.$e.remove(), this.menu.remove()
                }, i
            }(), u
        })
    }.call(this),
    function() {
        define("ui.control.examples.class", ["app.ini", "app.events", "app.settings", "app.locale", "util", "ui.control.palette.class", "ui.control.button.class", "ui.control.dialog.class", "ui.control.colorinfo.class", "ui.control.adjuster.class", "ui.control.randomizer.class", "ui.control.convert.class", "ui.control.loader.class"], function(e, t, n, r, i, s, o, u, a, f, l, c, h) {
    var p, d, v;
    return d = {
        web: {
            submenu: {
                webw: {
                    data: {
                        url: "examples/webpage/index-white.html",
                        addAdjuster: !0,
                        addRandomizer: !0,
                        addSwapSecs: !0,
                        addConvert: !0
                    }
                },
                webb: {
                    data: {
                        url: "examples/webpage/index-black.html",
                        addAdjuster: !0,
                        addRandomizer: !0,
                        addSwapSecs: !0,
                        addConvert: !0
                    }
                },
                webl: {
                    data: {
                        url: "examples/webpage/index-light.html",
                        addAdjuster: !0,
                        addRandomizer: !0,
                        addSwapSecs: !0,
                        addConvert: !0
                    }
                },
                webd: {
                    data: {
                        url: "examples/webpage/index-dark.html",
                        addAdjuster: !0,
                        addRandomizer: !0,
                        addSwapSecs: !0,
                        addConvert: !0
                    }
                }
            }
        },
        uifw: {
            submenu: {
                tw: {
                    data: {
                        url: "examples/tailwind/index.html",
                        addAdjuster: !0,
                        addRandomizer: !0,
                        addSwapSecs: !0,
                        addConvert: !0
                    }
                },
                m3: {
                    data: {
                        url: "examples/material/index.html",
                        addAdjuster: !0,
                        addRandomizer: !0,
                        addSwapSecs: !0,
                        addConvert: !0
                    }
                },
                antd: {
                    data: {
                        url: "examples/antd/index.html",
                        addAdjuster: !0,
                        addRandomizer: !0,
                        addSwapSecs: !0,
                        addConvert: !0
                    }
                },
                elplus: {
                    data: {
                        url: "examples/element-plus/index.html",
                        addAdjuster: !0,
                        addRandomizer: !0,
                        addSwapSecs: !0,
                        addConvert: !0
                    }
                },
                arco: {
                    data: {
                        url: "examples/arco/index.html",
                        addAdjuster: !0,
                        addRandomizer: !0,
                        addSwapSecs: !0,
                        addConvert: !0
                    }
                },
                vant: {
                    data: {
                        url: "examples/vant/index.html",
                        addAdjuster: !0,
                        addRandomizer: !0,
                        addSwapSecs: !0,
                        addConvert: !0
                    }
                },
                nutui: {
                    data: {
                        url: "examples/nutui/index.html",
                        addAdjuster: !0,
                        addRandomizer: !0,
                        addSwapSecs: !0,
                        addConvert: !0
                    }
                },
                varlet: {
                    data: {
                        url: "examples/varlet/index.html",
                        addAdjuster: !0,
                        addRandomizer: !0,
                        addSwapSecs: !0,
                        addConvert: !0
                    }
                },
                apple: {
                    data: {
                        url: "examples/apple/index.html",
                        addAdjuster: !0,
                        addRandomizer: !0,
                        addSwapSecs: !0,
                        addConvert: !0
                    }
                },
                fluent: {
                    data: {
                        url: "examples/fluent/index.html",
                        addAdjuster: !0,
                        addRandomizer: !0,
                        addSwapSecs: !0,
                        addConvert: !0
                    }
                },
                atlassian: {
                    data: {
                        url: "examples/atlassian/index.html",
                        addAdjuster: !0,
                        addRandomizer: !0,
                        addSwapSecs: !0,
                        addConvert: !0
                    }
                },
                nes: {
                    data: {
                        url: "examples/nes/index.html",
                        addAdjuster: !0,
                        addRandomizer: !0,
                        addSwapSecs: !0,
                        addConvert: !0
                    }
                },
                win98: {
                    data: {
                        url: "examples/win98/index.html",
                        addAdjuster: !0,
                        addRandomizer: !0,
                        addSwapSecs: !0,
                        addConvert: !0
                    }
                },
                boot: {
                    data: {
                        url: "examples/bootstrap/index.html",
                        addAdjuster: !0,
                        addRandomizer: !0,
                        addSwapSecs: !0,
                        addConvert: !0
                    }
                },
                fom: {
                    data: {
                        url: "examples/fomantic/index.html",
                        addAdjuster: !0,
                        addRandomizer: !0,
                        addSwapSecs: !0,
                        addConvert: !0
                    }
                }
            }
        },
        pic: {
            submenu: {
                shtr: {
                    data: {
                        url: "examples/abstract2/index.html",
                        addAdjuster: !0,
                        addRandomizer: !0,
                        addSwapSecs: !0,
                        addConvert: !0
                    }
                },
                flwr: {
                    data: {
                        url: "examples/flowers/index.html",
                        addAdjuster: !0,
                        addRandomizer: !0,
                        addSwapSecs: !0,
                        addConvert: !0
                    }
                },
                glo2: {
                    data: {
                        url: "examples/abstract3/index.html",
                        addAdjuster: !0,
                        addRandomizer: !0,
                        addSwapSecs: !0,
                        addConvert: !0
                    }
                },
                glo: {
                    data: {
                        url: "examples/abstract/index.html",
                        addAdjuster: !0,
                        addRandomizer: !0,
                        addSwapSecs: !0,
                        addConvert: !0
                    }
                },
                tart: {
                    data: {
                        url: "examples/tartan/index.html",
                        addAdjuster: !0,
                        addRandomizer: !0,
                        addSwapSecs: !0,
                        addConvert: !0
                    }
                }
            }
        },
        anim: {
            submenu: {
                blob: {
                    data: {
                        url: "examples/blobs/index.html",
                        addAdjuster: !0,
                        addRandomizer: !0,
                        addSwapSecs: !0,
                        addConvert: !0
                    }
                },
                stripes: {
                    data: {
                        url: "examples/stripes/index.html",
                        addAdjuster: !0,
                        addRandomizer: !0,
                        addSwapSecs: !0,
                        addConvert: !0
                    }
                }
            }
        }
    }, v = function(e) {
        var t, n, r, i, s;
        for (t in d) {
            r = d[t], s = r.submenu;
            for (n in s) {
                i = s[n];
                if (n === e) return i
            }
        }
        return null
    }, p = function() {
        function s(e, t, r, s) {
            var o, u;
            this.palette = e, this.$button = t, this.$parent = r, o = {
                "default": "webw",
                converter: null
            };
            if (!this.$parent) return;
            u = this, this.options = i.objMerge(o, s), this.selected = n.get("EXA") || this.options["default"], this.init()
        }
        return s.prototype.init = function() {
            var e;
            return e = this, this.open = !1, this.$button.click(function(t) {
                return t.preventDefault(), e.openDlg(), e.setList()
            }), t.register("ui/example/loaded", function() {
                var t;
                if ((t = e.loader) != null && typeof t.done == "function") t.done();
                return e.applyTypography();
            }), t.register("adjuster/changed", function() {
                var t;
                if (!e.open) return;
                return typeof(t = e.$iframe[0].contentWindow).colorize == "function" ? t.colorize() : void 0
            }), t.register("randomizer/changed", function() {
                var t;
                if (!e.open) return;
                if (typeof(t = e.$iframe[0].contentWindow).colorize == "function") t.colorize();
                return e.applyTypography();
            }), t.register("palette/typography/changed", function(t, typo) {
                if (!e.open) return;
                return e.applyTypography(typo);
            })
        }, s.prototype.openDlg = function() {
            var e, n, i, s, o, a, f, l, c, h, p;
            h = this, e = $("<DIV>", {
                "class": "cover"
            }), s = $("<UL>", {
                "class": "control-list list-menu"
            }), e.append(s), this.$content = $("<DIV>", {
                "class": "list-content"
            }), e.append(this.$content), this.$iframe = $("<IFRAME>", {
                id: "example-iframe",
                marginwidth: 0,
                marginheight: 0,
                frameborder: 0
            }).on("load", function() {
                h.applyTypography();
            }), this.$content.append(this.$iframe);
            for (a in d) {
                l = d[a], n = $("<LI>").html('<a href="#" class="item-' + a + '">' + r("examples." + a + ".title") + "</a>"), n.addClass("item unselectable"), s.append(n);
                if (l.submenu) {
                    o = $("<UL>", {
                        "class": "submenu"
                    }), n.append(o), p = l.submenu;
                    for (f in p) c = p[f], i = $("<LI>").html('<a href="#" class="subitem-' + f + '">→  ' + r("examples." + a + ".sub." + f + ".title") + "</a>"), i.addClass("subitem selectable"), i.data("id", f), o.append(i), f === this.selected && (i.addClass("sel"), n.addClass("sel"))
                }
            }
            s.find("li.item>a").click(function(e) {
                return e.preventDefault(), s.find("li.item.sel").removeClass("sel"), $(this).parents("li.item").addClass("sel")
            });
            s.find("li.subitem>a").click(function(e) {
                return e.preventDefault(), s.find("li.subitem.sel").removeClass("sel"), n = $(this).parents("li.subitem"), n.addClass("sel"), s.find("li.item.sel").removeClass("sel"), $(this).parents("li.item").addClass("sel"), a = n.data("id"), h.setList(a)
            });
            this.$tools = $("<DIV>", {
                "class": "list-tools"
            });
            e.append(this.$tools);
            var winW = $(window).width();
            var winH = $(window).height();
            var dlgW = Math.min(1600, Math.max(1060, Math.floor(winW * 0.94)));
            var dlgH = Math.min(960, Math.max(700, Math.floor(winH * 0.90)));
            this.dlg = new u(this.$parent, e, {
                className: "dlg-examples",
                title: r("examples.title"),
                width: dlgW,
                height: dlgH,
                resizable: !0,
                draggable: !0,
                modal: !0,
                onClose: function() {
                    var e, n, r_ctrl;
                    return (e = h.converter) != null && e.remove(), (n = h.adjuster) != null && n.close(), (r_ctrl = h.randomizer) != null && r_ctrl.close(), h.open = !1, t.trigger("ga/view")
                },
                position: {
                    my: "center center",
                    at: "center center",
                    of: window
                }
            });
            this.open = !0;
        }, s.prototype.setList = function(i) {
            var s, u, a, p, d, m, g, r_ctrl, y;
            return i && (this.selected = i), u = v(this.selected), u || (this.selected = this.options["default"], u = v(this.selected)), a = u.data.url, this.$iframe.attr("src") === a ? this.$iframe[0].contentWindow.location.reload(!0) : this.$iframe.attr("src", a), (d = this.loader) != null && typeof d.done == "function" && d.done(), this.loader = new h(this.$iframe), n.set("EXA", this.selected), (m = this.converter) != null && m.remove(), (g = this.adjuster) != null && g.close(), (r_ctrl = this.randomizer) != null && r_ctrl.close(), this.$tools.empty(), p = this, u.data.addConvert && (this.converter = new c(this.$tools, {
                positionMy: "right bottom",
                positionAt: "right bottom",
                selected: ((y = this.options.converter) != null ? y.getSelected() : void 0) || "none",
                onChange: function() {
                    var e;
                    return typeof(e = p.$iframe[0].contentWindow).colorize == "function" ? e.colorize() : void 0
                }
            })), u.data.addSwapSecs && this.palette.hasSecs() && this.palette.model && (s = new o(this.$tools, {
                className: "btn-swap",
                label: r("color.swap"),
                asUIButton: !1,
                onClick: function() {
                    var e;
                    return t.trigger("palette/swapsecs"), typeof(e = p.$iframe[0].contentWindow).colorize == "function" ? e.colorize() : void 0
                }
            })), u.data.addAdjuster && (s = new o(this.$tools, {
                className: "btn-adj",
                asUIButton: !1,
                label: r("adjuster.btn") + "…"
            }), this.$tools.append(s.$e), this.adjuster = new f(s.$e, this.palette, this.$tools, {
                positionMy: "center bottom",
                positionAt: "center+10 bottom+30",
                positionOf: this.$tools
            })), u.data.addRandomizer && (s = new o(this.$tools, {
                className: "btn-rnd",
                asUIButton: !1,
                label: r("random.btn") + "…"
            }), this.$tools.append(s.$e), this.randomizer = new l(s.$e, this.palette, this.$tools, {
                positionMy: "center bottom",
                positionAt: "center+10 bottom+30",
                positionOf: this.$tools
            })), s = new o(this.$tools, {
                className: "btn-close",
                asUIButton: !0,
                label: r("app.btnClose"),
                onClick: function() {
                    return p.dlg.close()
                }
            }), this.$tools.append(s.$e), t.trigger("ga/view", {
                view: e.GA.view.example + "/" + this.selected
            })
        }, s.prototype.applyTypography = function(typo) {
            if (!this.open || !this.$iframe || !this.$iframe.length) return;
            try {
                var iframe = this.$iframe[0];
                var win = iframe.contentWindow;
                var doc = iframe.contentDocument || (win ? win.document : null);
                if (!doc || !doc.head) return;

                typo = typo || (this.palette && this.palette.getTypography ? this.palette.getTypography() : null);
                if (!typo) return;

                var root = doc.documentElement;
                if (root && root.style) {
                    if (typo.heading) root.style.setProperty('--font-heading', typo.heading);
                    if (typo.body) root.style.setProperty('--font-body', typo.body);
                    if (typo.weightHeading) root.style.setProperty('--font-weight-heading', typo.weightHeading);
                    if (typo.letterSpacing) root.style.setProperty('--letter-spacing-heading', typo.letterSpacing);
                    if (typo.lineHeight) root.style.setProperty('--line-height-body', typo.lineHeight);
                    if (typo.scale) root.style.setProperty('--type-scale-ratio', typo.scale);
                }

                var styleEl = doc.getElementById('pal-typography-style');
                if (!styleEl) {
                    styleEl = doc.createElement('style');
                    styleEl.id = 'pal-typography-style';
                    doc.head.appendChild(styleEl);
                }
                var css = [
                    "@import url('https://fonts.googleapis.com/css2?family=Black+Ops+One&family=Cinzel:wght@600;700;800&family=Fredoka:wght@600;700&family=Orbitron:wght@700;800;900&family=Press+Start+2P&family=Rajdhani:wght@600;700&family=Russo+One&family=Share+Tech+Mono&family=VT323&display=swap');",
                    ':root {',
                    '  --font-heading: ' + typo.heading + ' !important;',
                    '  --font-body: ' + typo.body + ' !important;',
                    '  --font-weight-heading: ' + typo.weightHeading + ' !important;',
                    '  --letter-spacing-heading: ' + typo.letterSpacing + ' !important;',
                    '  --line-height-body: ' + typo.lineHeight + ' !important;',
                    '  --type-scale-ratio: ' + typo.scale + ' !important;',
                    '}',
                    'body, p, span, li, td, th, input, button, select, textarea, .text-content, .copy, dl, dt, dd {',
                    '  font-family: ' + typo.body + ' !important;',
                    '}',
                    'h1, h2, h3, h4, h5, h6, .ttl, .title, .logo, header h2, .card-title, .nav-brand, .ui-heading, .stat-value, .fw-preview-head, dt {',
                    '  font-family: ' + typo.heading + ' !important;',
                    '  font-weight: ' + typo.weightHeading + ' !important;',
                    '  letter-spacing: ' + typo.letterSpacing + ' !important;',
                    '}'
                ].join('\n');
                styleEl.textContent = css;

                var fontNameEl = doc.querySelector('.font-preview-name');
                if (fontNameEl && typo.name) {
                    fontNameEl.textContent = typo.name;
                }

                if (win && typeof win.applyTypography === 'function') {
                    win.applyTypography(typo);
                }
            } catch(err) {
                console.warn('Examples applyTypography error:', err);
            }
        }, s
    }(), p
});
    }.call(this),
    function() {
        define("ui.control.locale.class", ["app.ini", "app.events", "app.locale", "util", "ui.control.menu.class", "ui.control.button.class"], function(e, t, n, r, i, s) {
            var o;
            return o = function() {
                function t(e, t) {
                    var n, i;
                    this.$parent = e, n = {
                        className: "control control-lang",
                        asUIButton: !1
                    };
                    if (!this.$parent) return;
                    i = this, this.options = r.objMerge(n, t), this.selected = null, this.init()
                }
                return t.prototype.init = function() {
                    var t, n, r, o, u, a;
                    u = this, this.$e = $("<SPAN>", {
                        "class": this.options.className
                    }), this.$parent.append(this.$e), this.button = new s(this.$e, {
                        className: "",
                        asUIButton: u.options.asUIButton,
                        label: e.lang.list[e.lang.active].title + "  ▾",
                        onClick: function() {
                            return u.menu.open()
                        }
                    }), n = [], a = e.lang.list;
                    for (t in a) o = a[t], r = o.abbr + " – " + o.title, o.enabled && n.push({
                        label: r,
                        selected: t === e.lang.active,
                        event: "app/lang/set",
                        id: t,
                        data: null
                    });
                    return this.menu = new i(this.button.$e, {
                        className: "menu-lang",
                        positionMy: "center top",
                        positionAt: "center+5 top",
                        items: n
                    })
                }, t
            }(), o
        })
    }.call(this),
    function() {
        define("ui.control.tonal.strip", ["app.events", "color.oklch", "util"], function(events, oklch, util) {

            var STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

            // Luminance for white/black text contrast heuristic
            function textColor(hex) {
                var r = parseInt(hex.slice(0,2),16)/255,
                    g = parseInt(hex.slice(2,4),16)/255,
                    b = parseInt(hex.slice(4,6),16)/255;
                r = r < 0.04045 ? r/12.92 : Math.pow((r+0.055)/1.055, 2.4);
                g = g < 0.04045 ? g/12.92 : Math.pow((g+0.055)/1.055, 2.4);
                b = b < 0.04045 ? b/12.92 : Math.pow((b+0.055)/1.055, 2.4);
                var L = 0.2126*r + 0.7152*g + 0.0722*b;
                return L > 0.179 ? "#000000" : "#ffffff";
            }

            function hexFromScale(scale, stepIdx) {
                var s = scale[stepIdx];
                if (!s) return "888888";
                var r = Math.round(Math.max(0,Math.min(1,s.r))*255),
                    g = Math.round(Math.max(0,Math.min(1,s.g))*255),
                    b = Math.round(Math.max(0,Math.min(1,s.b))*255);
                return (r<16?"0":"")+r.toString(16)+(g<16?"0":"")+g.toString(16)+(b<16?"0":"")+b.toString(16);
            }

            // Copy text to clipboard
            function copyToClipboard(text) {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(text).catch(function(){});
                } else {
                    var ta = document.createElement("textarea");
                    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
                    document.body.appendChild(ta); ta.select();
                    try { document.execCommand("copy"); } catch(e) {}
                    document.body.removeChild(ta);
                }
            }

            // GROUP_LABELS
            var GROUP_LABELS = { pri: "Primary", sec1: "Secondary 1", sec2: "Secondary 2", compl: "Complement" };

            function TonalStrip(palette, $container) {
                this.palette = palette;
                this.$container = $container;
                this.$e = null;
                this._copyToast = null;
                this._init();
            }

            TonalStrip.prototype._init = function() {
                var self = this;
                this.$e = $("<div>", { "class": "tonal-strip" });
                this.$container.append(this.$e);

                // Toast element
                this._$toast = $("<div>", { "class": "tonal-strip-toast" }).text("Copied!");
                this.$container.append(this._$toast);

                events.register("palette/colors/changed", function() { self.render(); });
                events.register("palette/model/changed",  function() { self.render(); });
                events.register("palette/copyformat/changed", function() { self.render(); });
                this.render();
            };

            TonalStrip.prototype.render = function() {
                var self = this;
                var palette = this.palette;
                var scales;
                try {
                    scales = palette.getTonalScales();
                } catch(e) { return; }
                if (!scales || !scales.pri) return;

                this.$e.empty();

                var groups = ["pri"];
                if (palette.hasSecs())  { groups.push("sec1"); groups.push("sec2"); }
                if (palette.hasCompl()) { groups.push("compl"); }

                var curFmt = (window._palGetCopyFormat && window._palGetCopyFormat()) || "hex";

                $.each(groups, function(gi, grp) {
                    var scale = scales[grp];
                    if (!scale) return;

                    var $row = $("<div>", { "class": "tonal-strip-row" });

                    // Label
                    var $label = $("<span>", { "class": "tonal-strip-label" }).text(GROUP_LABELS[grp] || grp);
                    $row.append($label);

                    // Swatches
                    var $swatches = $("<div>", { "class": "tonal-strip-swatches" });

                    $.each(STEPS, function(si, step) {
                        var hex = hexFromScale(scale, si);
                        var formatted = oklch.formatHexColor(hex, curFmt);
                        var tc  = textColor(hex);
                        var $sw = $("<div>", {
                            "class": "tonal-swatch",
                            "title": step + " — " + formatted + " (Click to copy " + curFmt.toUpperCase() + ")"
                        }).css({ background: "#" + hex });

                        var $stepLabel = $("<span>", { "class": "tonal-swatch-step" }).text(step).css("color", tc);
                        var $hexLabel  = $("<span>", { "class": "tonal-swatch-hex"  }).text("#" + hex).css("color", tc);

                        $sw.append($stepLabel).append($hexLabel);

                        $sw.on("click", (function(h, s, fmtVal) {
                            return function(ev) {
                                var latestFmt = (window._palGetCopyFormat && window._palGetCopyFormat()) || "hex";
                                var copyVal = oklch.formatHexColor(h, latestFmt);
                                copyToClipboard(copyVal);
                                if (window._palShowToast) {
                                    window._palShowToast("Copied: " + copyVal);
                                } else {
                                    self._showToast(copyVal, ev);
                                }
                                $sw.addClass("swatch-copied-flash");
                                setTimeout(function() {
                                    $sw.removeClass("swatch-copied-flash");
                                }, 300);
                            };
                        })(hex, step, formatted));

                        $swatches.append($sw);
                    });

                    $row.append($swatches);
                    self.$e.append($row);
                });
            };

            TonalStrip.prototype._showToast = function(text, ev) {
                var self = this;
                this._$toast.text("Copied " + text).addClass("visible");
                clearTimeout(this._copyTimer);
                this._copyTimer = setTimeout(function() {
                    self._$toast.removeClass("visible");
                }, 1400);
            };

            return TonalStrip;
        });
    }.call(this), function() {
        define("ui.default.class", ["app.ini", "app.events", "app.history", "app.locale", "util", "ui.control.model.inline.class", "ui.control.adjuster.class", "ui.control.randomizer.class", "ui.control.button.class", "ui.control.btnedit.class", "ui.control.menu.class", "ui.control.wheel.class", "ui.control.presets.class", "ui.control.palette.class", "ui.control.share.class", "ui.control.preview.class", "ui.control.colorlist.class", "ui.control.examples.class", "ui.control.convert.class", "ui.control.locale.class", "ui.control.tonal.strip"], function(e, t, n, r, i, s, o, u, a, f, l, c, h, p, d, v, m, g, y, b, TonalStrip) {
    var w;
    return w = function() {
        function w(e, t, n) {
            var r, s;
            this.palette = e, this.$parent = t, r = {
                className: "",
                preview: "default"
            };
            if (!this.$parent) return;
            s = this, this.options = i.objMerge(r, n), this.pane = {}, this.ctrl = {}, this.env = {
                preview: this.options.preview
            }, this.init()
        }
        return w.prototype.init = function() {
            var n, w, E, S, x, T;
            T = this, E = this.palette, this.$parent.empty(), w = $("<DIV>", {
                id: "menu"
            }), this.$parent.append(w), this.pane.menu = w, w = $("<DIV>", {
                id: "panebox-l",
                "class": "panebox"
            }), this.$parent.append(w), this.pane["panebox-l"] = w, w = $("<DIV>", {
                id: "panebox-r",
                "class": "panebox"
            }), this.$parent.append(w), this.pane["panebox-r"] = w, w = $("<DIV>", {
                "class": "pane pane-model"
            }), this.pane["panebox-l"].append(w), this.pane["pane-model"] = w, w = $("<DIV>", {
                "class": "pane pane-content pane-content-model"
            }), this.pane["pane-model"].append(w), this.pane["pane-content-model"] = w, w = $("<DIV>", {
                "class": "pane pane-wheel"
            }), this.pane["panebox-l"].append(w), this.pane["pane-wheel"] = w, w = $("<A>", {
                href: "#",
                "class": "pane-tab pane-tab-wheel"
            }), w.text(r("color.colors")), this.pane["pane-wheel"].append(w), this.ctrl["pane-tab-wheel"] = w, w = $("<DIV>", {
                "class": "pane pane-content pane-content-wheel"
            }), this.pane["pane-wheel"].append(w), this.pane["pane-content-wheel"] = w, w = $("<DIV>", {
                "class": "pane pane-presets"
            }), this.pane["panebox-l"].append(w), this.pane["pane-presets"] = w, w = $("<A>", {
                href: "#",
                "class": "pane-tab pane-tab-presets"
            }), w.text(r("preset.btn")), this.pane["pane-presets"].append(w), this.ctrl["pane-tab-presets"] = w, w = $("<DIV>", {
                "class": "pane pane-content pane-content-presets"
            }), this.pane["pane-presets"].append(w), this.pane["pane-content-presets"] = w, this.pane["pane-palette"] = $("<DIV>", {
                "class": "pane pane-palette"
            }), this.pane["panebox-r"].append(this.pane["pane-palette"]), this.pane["pane-content-palette"] = $("<DIV>", {
                "class": "pane pane-content pane-content-palette"
            }), this.pane["pane-palette"].append(this.pane["pane-content-palette"]), this.pane["pane-tonal-strip"] = $("<DIV>", {
                "class": "pane pane-content pane-tonal-strip-container"
            }), this.pane["pane-palette"].append(this.pane["pane-tonal-strip"]), w = $("<DIV>", {
                "class": "pane pane-content pane-content-palette-desc"
            }), this.pane["pane-palette"].append(w), w.text(r("palette.label") + ":"), this.pane["pane-palette-share"] = $("<DIV>", {
                "class": "pane pane-content pane-content-palette-share"
            }), this.pane["pane-palette"].append(this.pane["pane-palette-share"]), w = $("<DIV>", {
                "class": "pane pane-examples"
            }), this.pane["panebox-r"].append(w), this.pane["pane-examples"] = w, w = $("<A>", {
                href: "#",
                "class": "pane-tab pane-tab-examples"
            }), w.text(r("examples.btn") + "…"), this.pane["pane-examples"].append(w), this.ctrl["pane-tab-examples"] = w, w = $("<DIV>", {
                "class": "pane pane-colorlist"
            }), this.pane["panebox-r"].append(w), this.pane["pane-colorlist"] = w, w = $("<A>", {
                href: "#",
                "class": "pane-tab pane-tab-colorlist"
            }), w.text(r("colorList.btn") + "…"), this.pane["pane-colorlist"].append(w), this.ctrl["pane-tab-colorlist"] = w, w = $("<DIV>", {
                "class": "pane pane-preview"
            }), this.pane["panebox-r"].append(w), this.pane["pane-preview"] = w, w = $("<A>", {
                href: "#",
                "class": "pane-tab pane-tab-preview"
            }), w.text(r("preview.btn") + "  ▾"), this.pane["pane-preview"].append(w), this.ctrl["pane-tab-preview"] = w, w = $("<DIV>", {
                "class": "pane pane-content pane-convert-preview"
            }), this.pane["pane-preview"].append(w), this.pane["pane-convert-preview"] = w, w = $("<IFRAME>", {
                "class": "pane pane-content pane-content-preview",
                "title": 'Pane Content Preview'
            }), this.pane["pane-preview"].append(w), this.pane["pane-content-preview"] = w, $("#header .promo .box1").addClass("on").html(r("app.header.api.btn")).attr("title", r("app.header.api.desc")).click(function(e) {
                return e.preventDefault(), t.trigger("app/dispatch", {
                    id: "link_widget"
                })
            }), $("#header .promo .box2").addClass("off").html(r("app.header.mobile.btn") + ' <span class="note">[' + r("app.header.scheduled") + "]<span>").attr("title", r("app.header.mobile.desc")).click(function(e) {
                return e.preventDefault(), t.trigger("app/dispatch", {
                    id: "link_mobile"
                })
            }), $("#header .promo .box3").addClass("off").html(r("app.header.more.btn") + ' <span class="note">[' + r("app.header.scheduled") + "]<span>").attr("title", r("app.header.more.desc")).click(function(e) {
                return e.preventDefault(), t.trigger("app/dispatch", {
                    id: "link_more"
                })
            }), this.ctrl["menu-undo"] = new a(this.pane.menu, {
                className: "undo",
                label: "< " + r("app.btnUndo"),
                asUIButton: !1,
                onClick: function() {
                    return t.trigger("history/back")
                }
            }), this.ctrl["menu-redo"] = new a(this.pane.menu, {
                className: "redo",
                label: r("app.btnRedo") + " >",
                asUIButton: !1,
                onClick: function() {
                    return t.trigger("history/fwd")
                }
            }), this.updateHistoryBtns(), this.ctrl["menu-reset"] = new a(this.pane.menu, {
                className: "reset",
                label: r("app.btnReset"),
                asUIButton: !1,
                onClick: function() {
                    return t.trigger("palette/reset"), t.trigger("ga/event", {
                        key: e.GA.event.reset,
                        value: ""
                    })
                }
            }), this.ctrl["menu-random"] = new a(this.pane.menu, {
                className: "randomize",
                label: r("random.btn") + "…",
                asUIButton: !1,
                onClick: function() {
                    return t.trigger("history/fwd")
                }
            }), this.ctrl.randomizer = new u(this.ctrl["menu-random"].$e, E, this.pane.menu), this.ctrl["menu-fav"] = new a(this.pane.menu, {
                className: "favorite",
                label: "★ " + (r("random.favTitle") || "Favorites"),
                asUIButton: !1,
                onClick: function() {
                    return T.ctrl.randomizer.openFavoritesDlg();
                }
            }), this.ctrl.palette = new p(E, this.pane["pane-content-palette"], {
                className: "big"
            }), this.ctrl.tonalStrip = new TonalStrip(E, this.pane["pane-tonal-strip"]), this.ctrl.share = new d(E, this.pane["pane-palette-share"]), this.ctrl.model = new s(E, this.pane["pane-content-model"]), this.ctrl["btn-hue"] = new f(this.pane["pane-content-wheel"], {
                className: "btn-hue",
                labelPre: r("app.btnHue.btn") + ": ",
                labelPost: "°",
                type: "number",
                dlgTitle: r("app.btnHue.title"),
                dlgText: r("app.btnHue.text"),
                dlgWidth: 240,
                listen: [{
                    event: "palette/colors/changed",
                    handler: function(e) {
                        return e.setValue(Math.round(E.hue))
                    }
                }],
                callback: function(n) {
                    return n = parseInt(n), isNaN(n) ? null : (n = i.angleNorm(n), E.setHue(n), t.trigger("ga/event", {
                        key: e.GA.event.enterHue,
                        value: n
                    }), Math.round(E.hue))
                }
            }), this.ctrl["btn-hue-opo"] = new a(this.pane["pane-content-wheel"], {
                className: "btn-hue-opo",
                label: r("app.btnHue.opposite"),
                onClick: function() {
                    return E.addHue(180)
                }
            }), this.ctrl["btn-dist"] = new f(this.pane["pane-content-wheel"], {
                className: "btn-dist",
                labelPre: r("app.btnDist.btn") + ": ",
                labelPost: "°",
                type: "number",
                dlgTitle: r("app.btnDist.title"),
                dlgText: r("app.btnDist.text"),
                dlgWidth: 240,
                listen: [{
                    event: "palette/colors/changed",
                    handler: function(e) {
                        return e.setValue(Math.round(E.angle)), T.ctrl["btn-dist-def"].disable(e.value === 30 || !E.hasSecs() || E.isModelFree())
                    }
                }, {
                    event: "palette/model/changed",
                    handler: function(e) {
                        var t;
                        return t = !E.hasSecs() || E.isModelFree(), e.disable(t), T.ctrl["btn-dist-def"].disable(t || e.value === 30)
                    }
                }],
                callback: function(n) {
                    return n = parseInt(n), isNaN(n) ? null : (n = i.angleNorm(n), E.setAngle(n), t.trigger("ga/event", {
                        key: e.GA.event.enterDist,
                        value: n
                    }), Math.round(E.angle))
                }
            }), this.ctrl["btn-dist-def"] = new a(this.pane["pane-content-wheel"], {
                className: "btn-dist-def",
                label: r("app.btnDist.def") + ": 30°",
                onClick: function() {
                    return E.setAngle(30)
                }
            }), this.ctrl["btn-rgb"] = new f(this.pane["pane-content-wheel"], {
                className: "btn-rgb",
                labelPre: r("app.btnRGB.btn") + ": ",
                labelPost: "",
                positionMy: "left bottom",
                positionAt: "left bottom",
                dlgTitle: r("app.btnRGB.title"),
                dlgText: r("app.btnRGB.text"),
                dlgWidth: 240,
                listen: [{
                    event: "palette/colors/changed",
                    handler: function(e) {
                        return e.setValue(E.colorTable.byPalette.pri[0].getHex())
                    }
                }],
                callback: function(n) {
                    return E.setByHex(n), t.trigger("ga/event", {
                        key: e.GA.event.enterRGB,
                        value: n
                    }), E.colorTable.byPalette.pri[0].getHex()
                }
            });
            if (window.EyeDropper) {
                var $edBtn = $("<BUTTON>", {
                    "class": "btn-eyedropper",
                    title: "Pick color from screen (EyeDropper API)"
                }).html("💧").css({
                    position: "absolute",
                    left: "172px",
                    bottom: "10px",
                    zIndex: 20,
                    width: "26px",
                    height: "22px",
                    padding: "0",
                    fontSize: "12px",
                    cursor: "pointer",
                    background: "#f0f0f0",
                    border: "1px solid #aaa",
                    borderRadius: "3px"
                });
                this.pane["pane-content-wheel"].append($edBtn);
                $edBtn.click(function(e) {
                    e.preventDefault();
                    var dropper = new window.EyeDropper();
                    dropper.open().then(function(res) {
                        if (res && res.sRGBHex) {
                            E.setByHex(res.sRGBHex);
                        }
                    }).catch(function() {});
                });
            }
            this.ctrl["btn-adj"] = new a(this.pane["pane-content-wheel"], {
                className: "btn-adj",
                label: r("adjuster.btn") + "…"
            }), this.ctrl.adjuster = new o(this.ctrl["btn-adj"].$e, E, this.pane["pane-content-wheel"]), this.ctrl.wheel = new c(E, this.pane["pane-content-wheel"]), this.ctrl.presets = new h(E, this.pane["pane-content-presets"]), this.ctrl.preview = new v(this.ctrl["pane-tab-preview"], this.pane["pane-preview"], this.pane["pane-content-preview"], {
                selected: this.env.preview
            }), this.ctrl["preview-convert"] = new y(this.pane["pane-convert-preview"]), this.ctrl.colorlist = new m(E, this.ctrl["pane-tab-colorlist"], this.$parent, null), this.ctrl.examples = new g(E, this.ctrl["pane-tab-examples"], this.$parent, {
                converter: this.ctrl["preview-convert"]
            }), this.$parent.find(".pane-tab").click(function(e) {
                var t;
                return e.preventDefault(), t = $(this), t.hasClass("unselectable") ? !0 : t.hasClass("sel") ? !1 : t.hasClass("sel") ? (e.stopImmediatePropagation(), !1) : (t.parents(".panebox").find(".pane-tab").removeClass("sel"), t.addClass("sel"))
            }), this.ctrl["pane-tab-wheel"].click(function() {
                return T.presetsToggle(!1)
            }).addClass("sel"), this.ctrl["pane-tab-presets"].click(function() {
                return T.presetsToggle(!0)
            }), this.pane["pane-content-presets"].hide(), this.ctrl["pane-tab-preview"].addClass("sel"), this.ctrl["pane-tab-colorlist"].addClass("unselectable"), this.ctrl["pane-tab-examples"].addClass("unselectable"), S = new b($("#header .lang")), t.register("preview/changed", function(e, n) {
                return T.env.preview = n.id, t.trigger("palette/colors/update")
            }), t.register("history/changed", function() {
                return T.updateHistoryBtns()
            })
        }, w.prototype.presetsToggle = function(n) {
            return this.pane["pane-content-presets"].toggle(n), this.pane["pane-content-wheel"].toggle(!n), this.ctrl.presets.activate(n), t.trigger("ga/view", {
                view: n ? e.GA.view.presets : e.GA.view.wheel
            })
        }, w.prototype.updateHistoryBtns = function() {
            return this.ctrl["menu-undo"].disable(!n.hasBack()), this.ctrl["menu-redo"].disable(!n.hasFwd())
        }, w
    }(), w
});
    }.call(this),
    function() {
        define("app.core", ["app.ini", "app.events", "app.history", "app.settings", "app.dispatcher", "util", "util.ga.events", "color.palette.class", "ui.default.class"], function(e, t, n, r, i, s, o, u, a) {
            var f, l;
            return f = function(t) {
                return t && e.lang.list[t] && e.lang.list[t].enabled
            }, l = {
                init: function() {
                    var n, s, o, u, a, l, c, h, p, d;
                    l = this, t.init($("#app")), r.init(), i.init(), u = "", a = document.location.search.substring(1);
                    if (a) {
                        s = a.split("&");
                        for (h = 0, p = s.length; h < p; h++) n = s[h], d = n.split("="), o = d[0], c = d[1], o === "lang" && (u = c)
                    }
                    if (!u) {
                        var navLang = (navigator.language || navigator.userLanguage || "").substring(0, 2).toLowerCase();
                        if (f(navLang)) u = navLang;
                    }
                    return u || (u = r.get("LNG")), f(u) ? (e.lang.active = u, this.initPh2()) : (e.lang.active = e.lang.def || "en", this.initPh2());
                },
                initPh2: function() {
                    var t, n;
                    return n = this, t = e.lang.active, r.set("LNG", t), $("html").attr("lang", t).prop("lang", t), t !== "en" ? $.ajax({
                        dataType: "script",
                        url: e.lang.path + t + ".js",
                        cache: !0,
                        success: function() {
                            return n.initPh3()
                        },
                        error: function() {
                            return n.initPh3()
                        }
                    }) : this.initPh3()
                },
                initPh3: function() {
                    var i, s, f, l;
                    return f = this, typeof addthis_config != "undefined" && addthis_config !== null && (addthis_config.ui_language = e.lang.active), i = new u("mono", 0, 30), l = new a(i, $("#content")), s = window[e.namespace.prefix] = {
                        lang: e.lang.active,
                        settings: r,
                        events: t,
                        palette: i,
                        ui: l
                    }, n.init(), o.init(s)
                }
            }, l
        });
    }.call(this),
    function() {
        var e;
        e = function(e) {
            return $("#jstest").removeClass("loading").html("ERROR: " + e)
        }, $(function() {
            return require.config(), false ? e('This application is allowed to run at <a href="http://paletton.com">Paletton.com</a> domain only.') : $("#csstest:hidden").length !== 1 ? e("No document styling (CSS) detected. CSS is required for this application.") : browserInfo.isOldIE ? e('MSIE prior to version 9 is not supported by this application.<p>You may try a <a href="/previous/">previous version</a>, it could work work you.</p>') : browserInfo.isOpera ? e('Opera browser is not supported by this application.<p>You may try a <a href="/previous/">previous version</a>, it could work work you.</p>') : require(["app.core"], function(e) {
                return e.init()
            })
        })
    }.call(this), define("app", function() {});
