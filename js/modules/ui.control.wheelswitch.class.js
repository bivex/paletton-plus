define("ui.control.wheelswitch.class", ["app.events", "util", "ui.control.button.class"], function(e, t, n) {
    var r;
    return r = function() {
        function r(n, r, i, s) {
            var o, u;
            this.$container = n, this.ctrl_wheel = r, this.palette = i, o = {
                className: ""
            }, this.options = t.objMerge(o, s), u = this, e.register("palette/colors/changed", function() {
                return u.colorize()
            }), e.register("palette/model/changed", function() {
                return u.draw()
            }), this.draw()
        }
        return r.prototype.draw = function() {
            var e, t;
            return t = this, this.$e = $("<DIV>", {
                "class": "control-wheelswitch " + this.options.className
            }), this.$container.empty().append(this.$e), this.$e.on("mouseenter", function(e) {
                var n;
                return typeof(n = t.options).onEnter == "function" ? n.onEnter(e) : void 0
            }).on("mouseleave", function(e) {
                var n;
                return typeof(n = t.options).onLeave == "function" ? n.onLeave(e) : void 0
            }), this.$colors = $("<SPAN>", {
                "class": "colors"
            }), this.$e.append(this.$colors), e = function(e) {
                var r, i;
                return i = e, r = new n(t.$colors, {
                    className: "col btn-" + e,
                    asUIButton: !1,
                    label: "",
                    onClick: function() {
                        return t.setCol(i)
                    }
                }), r
            }, this.colBtn = {}, this.colBtn.pri = e("pri"), this.palette.hasCompl() && (this.colBtn.compl = e("compl")), this.palette.hasSecs() && (this.colBtn.sec1 = e("sec1"), this.colBtn.sec2 = e("sec2")), this.switchBtn = new n(this.$e, {
                className: "lock",
                asUIButton: !1,
                label: "",
                onClick: function() {
                    return t["switch"](!t.palette.varsMultiOn)
                }
            }), this.switchBtn.$label.addClass("ico"), this["switch"](t.palette.varsMultiOn)
        }, r.prototype["switch"] = function(t) {
            return this.$colors.find(".control-button.sel").removeClass("sel"), t ? (e.trigger("palette/switchvars/multi"), this.$colors.show(), this.$colors.find(".control-button.btn-" + this.palette.varsActive).addClass("sel")) : (e.trigger("palette/switchvars/same"), this.$colors.hide()), this.switchBtn.$label.toggleClass("ico-lock", !t).toggleClass("ico-unlock", t), this.switchBtn.$e.toggle(this.palette.hueCnt > 1)
        }, r.prototype.setCol = function(t) {
            var n;
            n = this, this.$colors.find(".control-button.sel").removeClass("sel"), this.$colors.find(".control-button.btn-" + t).addClass("sel");
            if (n.palette.varsMultiOn) return e.trigger("palette/switchvars/active", {
                colId: t
            })
        }, r.prototype.colorize = function() {
            var e, t;
            return t = this, e = function(e) {
                var n;
                return (n = t.colBtn[e]) != null ? n.$button.css("background", t.palette.getColorCode(e, 0)) : void 0
            }, e("pri"), e("compl"), e("sec1"), e("sec2")
        }, r
    }(), r
});
