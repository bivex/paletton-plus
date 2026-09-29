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
});
