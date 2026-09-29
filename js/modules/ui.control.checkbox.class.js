define("ui.control.checkbox.class", ["app.events", "util"], function(e, t) {
    var n;
    return n = function() {
        function e(e, n) {
            var r, i, s, o;
            this.$parent = e, s = {
                className: "",
                label: "",
                checked: !1,
                disabled: !1,
                onClick: null
            };
            if (!this.$parent) return;
            o = this, this.options = t.objMerge(s, n), this.checked = this.options.checked, this.disabled = this.options.disabled, this.$e = $("<A>", {
                "class": "control control-checkbox " + this.options.className
            }), this.$parent.append(this.$e), r = $("<SPAN>", {
                "class": "ico ico-checkbox"
            }), this.$e.append(r), i = $("<SPAN>", {
                "class": "label"
            }), this.$e.append(i), i.html(this.options.label), this.$e.click(function(e) {
                var t;
                e.preventDefault();
                if (o.disabled) return;
                return o.toggle(), typeof(t = o.options).onClick == "function" ? t.onClick(o.checked) : void 0
            }), this.check(this.checked)
        }
        return e.prototype.check = function(e) {
            return this.checked = !!e, this.$e.toggleClass("checked", this.checked)
        }, e.prototype.toggle = function() {
            return this.check(!this.checked)
        }, e.prototype.disable = function(e) {
            return this.disabled = !!e, this.$e.toggleClass("disabled", this.disabled)
        }, e
    }(), n
});
