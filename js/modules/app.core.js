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
