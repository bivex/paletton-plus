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
});
