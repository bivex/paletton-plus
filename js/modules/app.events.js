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
});
