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
});
