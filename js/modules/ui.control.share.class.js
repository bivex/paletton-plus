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
});
