define("ui.control.dialog.class", ["util"], function(e) {
    var t;
    return t = function() {
        function t(t, n, r) {
            var i, s;
            this.$parent = t, i = {
                className: "",
                title: "",
                width: 300,
                height: "auto",
                modal: !0,
                draggable: !0,
                resizable: !1,
                autoOpen: !0,
                buttons: null,
                destroyOnClose: !0,
                onClose: null,
                position: {
                    my: "center",
                    at: "center",
                    of: this.$parent
                }
            };
            if (!this.$parent) return;
            s = this, this.options = e.objMerge(i, r), this.dlgInited = !1, this.$e = $("<DIV>", {
                "class": "control control-dlg " + this.options.className
            }), this.$parent.append(this.$e), this.$e.append(n), this.$e.dialog({
                dialogClass: this.options.className,
                title: this.options.title,
                modal: this.options.modal,
                width: this.options.width,
                height: this.options.height,
                draggable: this.options.draggable,
                resizable: this.options.resizable,
                autoOpen: this.options.autoOpen,
                buttons: this.options.buttons,
                position: this.options.position,
                close: function() {
                    var e;
                    typeof(e = s.options).onClose == "function" && e.onClose();
                    if (s.options.destroyOnClose) return $(this).dialog("destroy"), s.dlgInited = !1, s.$e.remove()
                }
            }), this.dlgInited = !0
        }
        return t.prototype.open = function() {
            if (this.dlgInited) return this.$e.dialog("open")
        }, t.prototype.close = function() {
            if (this.dlgInited) return this.$e.dialog("close")
        }, t
    }(), t
});
