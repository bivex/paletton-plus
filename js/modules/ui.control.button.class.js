define("ui.control.button.class", ["app.events", "util", "ui.control.dialog.class"], function(e, t, n) {
    var r;
    return r = function() {
        function e(e, n) {
            var r, i, s;
            this.$parent = e, i = {
                className: "",
                label: "",
                asUIButton: !0,
                disabled: !1,
                onClick: null
            };
            if (!this.$parent) return;
            s = this, this.options = t.objMerge(i, n), this.$e = $("<SPAN>", {
                "class": "control control-button " + this.options.className
            }), this.$parent.append(this.$e), this.$button = $("<A>", {
                "class": "button",
                href: "#",
                role: "button",
                "aria-label": this.options.label || "Action"
            }), this.$e.append(this.$button), this.$label = $("<SPAN>", {
                "class": "label"
            }), this.$label.text(this.options.label), this.$button.append(this.$label), this.options.asUIButton ? r = this.$button.button() : r = this.$button, r.click(function(e) {
                var t;
                e.preventDefault(), s.$button.blur();
                if (s.disabled) return;
                return typeof(t = s.options).onClick == "function" ? t.onClick() : void 0
            }), this.disable(this.options.disabled)
        }
        return e.prototype.setHtml = function(e) {
            var plainText = $("<div>").html(e).text().trim();
            if (plainText) this.$button.attr("aria-label", plainText);
            return this.$button.html(e)
        }, e.prototype.disable = function(e) {
            return this.disabled = !!e, this.$e.toggleClass("disabled", this.disabled)
        }, e
    }(), r
});
