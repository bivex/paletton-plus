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
});
