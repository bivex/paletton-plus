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
});
