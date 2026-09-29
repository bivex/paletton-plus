define("ui.control.btnedit.class", ["app.events", "app.locale", "util", "ui.control.dialog.class"], function(e, t, n, r) {
    var i;
    return i = function() {
        function i(e, t) {
            var r, i;
            this.$parent = e, r = {
                className: "",
                labelPre: "",
                labelPost: "",
                value: 0,
                type: "text",
                dlgTitle: "",
                dlgText: "",
                dlgWidth: null,
                positionMy: "left top",
                positionAt: "left top",
                positionOf: null,
                inputSize: 5,
                asUIButton: !0,
                listen: null,
                callback: null
            };
            if (!this.$parent) return;
            i = this, this.options = n.objMerge(r, t), this.value = this.options.value, this.disabled = !1, this.init()
        }
        return i.prototype.init = function() {
            var t, n, r, i, s, o, u, a, f, l, c;
            u = this, this.$e = $("<DIV>", {
                "class": "control control-btnedit " + this.options.className
            }), this.$parent.append(this.$e), this.$button = $("<A>", {
                "class": "button",
                href: "#"
            }), this.$e.append(this.$button), t = $("<SPAN>", {
                "class": "label"
            }), t.text(this.options.labelPre), this.$button.append(t), n = $("<SPAN>", {
                "class": "value"
            }), n.text(this.options.value), this.$button.append(n), t = $("<SPAN>", {
                "class": "label"
            }), t.text(this.options.labelPost), this.$button.append(t), this.options.asUIButton ? r = this.$button.button() : r = this.$button, r.click(function(e) {
                e.preventDefault(), u.$button.blur();
                if (u.disabled) return;
                return u.openDlg(u.value)
            });
            if (this.options.listen && this.options.listen.length) {
                l = this.options.listen, c = [];
                for (o = a = 0, f = l.length; a < f; o = ++a) i = l[o], s = function(e) {
                    return function() {
                        return e(u)
                    }
                }, c.push(e.register(i.event, s(i.handler)));
                return c
            }
        }, i.prototype.openDlg = function(e) {
            var n, i, s, o, u, a;
            return a = this, n = $("<DIV>"), i = $("<DIV>", {
                "class": "text"
            }).html(this.options.dlgText), n.append(i), i = $("<DIV>", {
                "class": "input"
            }), n.append(i), s = $("<INPUT>", {
                type: this.options.type,
                value: e
            }).focus(), this.options.inputSize && s.attr("size", this.options.inputSize), s.on("keypress", function(e) {
                if (e.which === 13) return u()
            }), i.append(s), setTimeout(function() {
                return s.select()
            }, 10), o = new r(this.$parent, n, {
                className: "dlg-btnedit",
                title: this.options.dlgTitle,
                buttons: [{
                    text: t("app.btnCancel"),
                    click: function() {
                        return o.close()
                    }
                }, {
                    text: t("app.btnOK"),
                    click: function() {
                        return u()
                    }
                }],
                position: {
                    my: a.options.positionMy,
                    at: a.options.positionAt,
                    of: a.options.positionOf || a.$button
                }
            }), u = function() {
                return e = a.options.callback(s.val()), e != null && a.setValue(e), o.close()
            }
        }, i.prototype.setValue = function(e) {
            return this.value = e, this.$e.find(".value").text(e)
        }, i.prototype.disable = function(e) {
            return this.disabled = !!e, this.$e.toggle(!this.disabled)
        }, i
    }(), i
});
