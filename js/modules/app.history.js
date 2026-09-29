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
});
