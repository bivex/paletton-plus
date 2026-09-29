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
});
