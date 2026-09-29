define("ui.default.class", ["app.ini", "app.events", "app.history", "app.locale", "util", "ui.control.model.inline.class", "ui.control.adjuster.class", "ui.control.randomizer.class", "ui.control.button.class", "ui.control.btnedit.class", "ui.control.menu.class", "ui.control.wheel.class", "ui.control.presets.class", "ui.control.palette.class", "ui.control.share.class", "ui.control.preview.class", "ui.control.colorlist.class", "ui.control.examples.class", "ui.control.convert.class", "ui.control.locale.class", "ui.control.tonal.strip"], function(e, t, n, r, i, s, o, u, a, f, l, c, h, p, d, v, m, g, y, b, TonalStrip) {
    var w;
    return w = function() {
        function w(e, t, n) {
            var r, s;
            this.palette = e, this.$parent = t, r = {
                className: "",
                preview: "default"
            };
            if (!this.$parent) return;
            s = this, this.options = i.objMerge(r, n), this.pane = {}, this.ctrl = {}, this.env = {
                preview: this.options.preview
            }, this.init()
        }
        return w.prototype.init = function() {
            var n, w, E, S, x, T;
            T = this, E = this.palette, this.$parent.empty(), w = $("<DIV>", {
                id: "menu"
            }), this.$parent.append(w), this.pane.menu = w, w = $("<DIV>", {
                id: "panebox-l",
                "class": "panebox"
            }), this.$parent.append(w), this.pane["panebox-l"] = w, w = $("<DIV>", {
                id: "panebox-r",
                "class": "panebox"
            }), this.$parent.append(w), this.pane["panebox-r"] = w, w = $("<DIV>", {
                "class": "pane pane-model"
            }), this.pane["panebox-l"].append(w), this.pane["pane-model"] = w, w = $("<DIV>", {
                "class": "pane pane-content pane-content-model"
            }), this.pane["pane-model"].append(w), this.pane["pane-content-model"] = w, w = $("<DIV>", {
                "class": "pane pane-wheel"
            }), this.pane["panebox-l"].append(w), this.pane["pane-wheel"] = w, w = $("<A>", {
                href: "#",
                "class": "pane-tab pane-tab-wheel"
            }), w.text(r("color.colors")), this.pane["pane-wheel"].append(w), this.ctrl["pane-tab-wheel"] = w, w = $("<DIV>", {
                "class": "pane pane-content pane-content-wheel"
            }), this.pane["pane-wheel"].append(w), this.pane["pane-content-wheel"] = w, w = $("<DIV>", {
                "class": "pane pane-presets"
            }), this.pane["panebox-l"].append(w), this.pane["pane-presets"] = w, w = $("<A>", {
                href: "#",
                "class": "pane-tab pane-tab-presets"
            }), w.text(r("preset.btn")), this.pane["pane-presets"].append(w), this.ctrl["pane-tab-presets"] = w, w = $("<DIV>", {
                "class": "pane pane-content pane-content-presets"
            }), this.pane["pane-presets"].append(w), this.pane["pane-content-presets"] = w, this.pane["pane-palette"] = $("<DIV>", {
                "class": "pane pane-palette"
            }), this.pane["panebox-r"].append(this.pane["pane-palette"]), this.pane["pane-content-palette"] = $("<DIV>", {
                "class": "pane pane-content pane-content-palette"
            }), this.pane["pane-palette"].append(this.pane["pane-content-palette"]), this.pane["pane-tonal-strip"] = $("<DIV>", {
                "class": "pane pane-content pane-tonal-strip-container"
            }), this.pane["pane-palette"].append(this.pane["pane-tonal-strip"]), w = $("<DIV>", {
                "class": "pane pane-content pane-content-palette-desc"
            }), this.pane["pane-palette"].append(w), w.text(r("palette.label") + ":"), this.pane["pane-palette-share"] = $("<DIV>", {
                "class": "pane pane-content pane-content-palette-share"
            }), this.pane["pane-palette"].append(this.pane["pane-palette-share"]), w = $("<DIV>", {
                "class": "pane pane-examples"
            }), this.pane["panebox-r"].append(w), this.pane["pane-examples"] = w, w = $("<A>", {
                href: "#",
                "class": "pane-tab pane-tab-examples"
            }), w.text(r("examples.btn") + "…"), this.pane["pane-examples"].append(w), this.ctrl["pane-tab-examples"] = w, w = $("<DIV>", {
                "class": "pane pane-colorlist"
            }), this.pane["panebox-r"].append(w), this.pane["pane-colorlist"] = w, w = $("<A>", {
                href: "#",
                "class": "pane-tab pane-tab-colorlist"
            }), w.text(r("colorList.btn") + "…"), this.pane["pane-colorlist"].append(w), this.ctrl["pane-tab-colorlist"] = w, w = $("<DIV>", {
                "class": "pane pane-preview"
            }), this.pane["panebox-r"].append(w), this.pane["pane-preview"] = w, w = $("<A>", {
                href: "#",
                "class": "pane-tab pane-tab-preview"
            }), w.text(r("preview.btn") + "  ▾"), this.pane["pane-preview"].append(w), this.ctrl["pane-tab-preview"] = w, w = $("<DIV>", {
                "class": "pane pane-content pane-convert-preview"
            }), this.pane["pane-preview"].append(w), this.pane["pane-convert-preview"] = w, w = $("<IFRAME>", {
                "class": "pane pane-content pane-content-preview",
                "title": 'Pane Content Preview'
            }), this.pane["pane-preview"].append(w), this.pane["pane-content-preview"] = w, $("#header .promo .box1").addClass("on").html(r("app.header.api.btn")).attr("title", r("app.header.api.desc")).click(function(e) {
                return e.preventDefault(), t.trigger("app/dispatch", {
                    id: "link_widget"
                })
            }), $("#header .promo .box2").addClass("off").html(r("app.header.mobile.btn") + ' <span class="note">[' + r("app.header.scheduled") + "]<span>").attr("title", r("app.header.mobile.desc")).click(function(e) {
                return e.preventDefault(), t.trigger("app/dispatch", {
                    id: "link_mobile"
                })
            }), $("#header .promo .box3").addClass("off").html(r("app.header.more.btn") + ' <span class="note">[' + r("app.header.scheduled") + "]<span>").attr("title", r("app.header.more.desc")).click(function(e) {
                return e.preventDefault(), t.trigger("app/dispatch", {
                    id: "link_more"
                })
            }), this.ctrl["menu-undo"] = new a(this.pane.menu, {
                className: "undo",
                label: "< " + r("app.btnUndo"),
                asUIButton: !1,
                onClick: function() {
                    return t.trigger("history/back")
                }
            }), this.ctrl["menu-redo"] = new a(this.pane.menu, {
                className: "redo",
                label: r("app.btnRedo") + " >",
                asUIButton: !1,
                onClick: function() {
                    return t.trigger("history/fwd")
                }
            }), this.updateHistoryBtns(), this.ctrl["menu-reset"] = new a(this.pane.menu, {
                className: "reset",
                label: r("app.btnReset"),
                asUIButton: !1,
                onClick: function() {
                    return t.trigger("palette/reset"), t.trigger("ga/event", {
                        key: e.GA.event.reset,
                        value: ""
                    })
                }
            }), this.ctrl["menu-random"] = new a(this.pane.menu, {
                className: "randomize",
                label: r("random.btn") + "…",
                asUIButton: !1,
                onClick: function() {
                    return t.trigger("history/fwd")
                }
            }), this.ctrl.randomizer = new u(this.ctrl["menu-random"].$e, E, this.pane.menu), this.ctrl["menu-fav"] = new a(this.pane.menu, {
                className: "favorite",
                label: "★ " + (r("random.favTitle") || "Favorites"),
                asUIButton: !1,
                onClick: function() {
                    return T.ctrl.randomizer.openFavoritesDlg();
                }
            }), this.ctrl.palette = new p(E, this.pane["pane-content-palette"], {
                className: "big"
            }), this.ctrl.tonalStrip = new TonalStrip(E, this.pane["pane-tonal-strip"]), this.ctrl.share = new d(E, this.pane["pane-palette-share"]), this.ctrl.model = new s(E, this.pane["pane-content-model"]), this.ctrl["btn-hue"] = new f(this.pane["pane-content-wheel"], {
                className: "btn-hue",
                labelPre: r("app.btnHue.btn") + ": ",
                labelPost: "°",
                type: "number",
                dlgTitle: r("app.btnHue.title"),
                dlgText: r("app.btnHue.text"),
                dlgWidth: 240,
                listen: [{
                    event: "palette/colors/changed",
                    handler: function(e) {
                        return e.setValue(Math.round(E.hue))
                    }
                }],
                callback: function(n) {
                    return n = parseInt(n), isNaN(n) ? null : (n = i.angleNorm(n), E.setHue(n), t.trigger("ga/event", {
                        key: e.GA.event.enterHue,
                        value: n
                    }), Math.round(E.hue))
                }
            }), this.ctrl["btn-hue-opo"] = new a(this.pane["pane-content-wheel"], {
                className: "btn-hue-opo",
                label: r("app.btnHue.opposite"),
                onClick: function() {
                    return E.addHue(180)
                }
            }), this.ctrl["btn-dist"] = new f(this.pane["pane-content-wheel"], {
                className: "btn-dist",
                labelPre: r("app.btnDist.btn") + ": ",
                labelPost: "°",
                type: "number",
                dlgTitle: r("app.btnDist.title"),
                dlgText: r("app.btnDist.text"),
                dlgWidth: 240,
                listen: [{
                    event: "palette/colors/changed",
                    handler: function(e) {
                        return e.setValue(Math.round(E.angle)), T.ctrl["btn-dist-def"].disable(e.value === 30 || !E.hasSecs() || E.isModelFree())
                    }
                }, {
                    event: "palette/model/changed",
                    handler: function(e) {
                        var t;
                        return t = !E.hasSecs() || E.isModelFree(), e.disable(t), T.ctrl["btn-dist-def"].disable(t || e.value === 30)
                    }
                }],
                callback: function(n) {
                    return n = parseInt(n), isNaN(n) ? null : (n = i.angleNorm(n), E.setAngle(n), t.trigger("ga/event", {
                        key: e.GA.event.enterDist,
                        value: n
                    }), Math.round(E.angle))
                }
            }), this.ctrl["btn-dist-def"] = new a(this.pane["pane-content-wheel"], {
                className: "btn-dist-def",
                label: r("app.btnDist.def") + ": 30°",
                onClick: function() {
                    return E.setAngle(30)
                }
            }), this.ctrl["btn-rgb"] = new f(this.pane["pane-content-wheel"], {
                className: "btn-rgb",
                labelPre: r("app.btnRGB.btn") + ": ",
                labelPost: "",
                positionMy: "left bottom",
                positionAt: "left bottom",
                dlgTitle: r("app.btnRGB.title"),
                dlgText: r("app.btnRGB.text"),
                dlgWidth: 240,
                listen: [{
                    event: "palette/colors/changed",
                    handler: function(e) {
                        return e.setValue(E.colorTable.byPalette.pri[0].getHex())
                    }
                }],
                callback: function(n) {
                    return E.setByHex(n), t.trigger("ga/event", {
                        key: e.GA.event.enterRGB,
                        value: n
                    }), E.colorTable.byPalette.pri[0].getHex()
                }
            });
            if (window.EyeDropper) {
                var $edBtn = $("<BUTTON>", {
                    "class": "btn-eyedropper",
                    title: "Pick color from screen (EyeDropper API)"
                }).html("💧").css({
                    position: "absolute",
                    left: "172px",
                    bottom: "10px",
                    zIndex: 20,
                    width: "26px",
                    height: "22px",
                    padding: "0",
                    fontSize: "12px",
                    cursor: "pointer",
                    background: "#f0f0f0",
                    border: "1px solid #aaa",
                    borderRadius: "3px"
                });
                this.pane["pane-content-wheel"].append($edBtn);
                $edBtn.click(function(e) {
                    e.preventDefault();
                    var dropper = new window.EyeDropper();
                    dropper.open().then(function(res) {
                        if (res && res.sRGBHex) {
                            E.setByHex(res.sRGBHex);
                        }
                    }).catch(function() {});
                });
            }
            this.ctrl["btn-adj"] = new a(this.pane["pane-content-wheel"], {
                className: "btn-adj",
                label: r("adjuster.btn") + "…"
            }), this.ctrl.adjuster = new o(this.ctrl["btn-adj"].$e, E, this.pane["pane-content-wheel"]), this.ctrl.wheel = new c(E, this.pane["pane-content-wheel"]), this.ctrl.presets = new h(E, this.pane["pane-content-presets"]), this.ctrl.preview = new v(this.ctrl["pane-tab-preview"], this.pane["pane-preview"], this.pane["pane-content-preview"], {
                selected: this.env.preview
            }), this.ctrl["preview-convert"] = new y(this.pane["pane-convert-preview"]), this.ctrl.colorlist = new m(E, this.ctrl["pane-tab-colorlist"], this.$parent, null), this.ctrl.examples = new g(E, this.ctrl["pane-tab-examples"], this.$parent, {
                converter: this.ctrl["preview-convert"]
            }), this.$parent.find(".pane-tab").click(function(e) {
                var t;
                return e.preventDefault(), t = $(this), t.hasClass("unselectable") ? !0 : t.hasClass("sel") ? !1 : t.hasClass("sel") ? (e.stopImmediatePropagation(), !1) : (t.parents(".panebox").find(".pane-tab").removeClass("sel"), t.addClass("sel"))
            }), this.ctrl["pane-tab-wheel"].click(function() {
                return T.presetsToggle(!1)
            }).addClass("sel"), this.ctrl["pane-tab-presets"].click(function() {
                return T.presetsToggle(!0)
            }), this.pane["pane-content-presets"].hide(), this.ctrl["pane-tab-preview"].addClass("sel"), this.ctrl["pane-tab-colorlist"].addClass("unselectable"), this.ctrl["pane-tab-examples"].addClass("unselectable"), S = new b($("#header .lang")), t.register("preview/changed", function(e, n) {
                return T.env.preview = n.id, t.trigger("palette/colors/update")
            }), t.register("history/changed", function() {
                return T.updateHistoryBtns()
            })
        }, w.prototype.presetsToggle = function(n) {
            return this.pane["pane-content-presets"].toggle(n), this.pane["pane-content-wheel"].toggle(!n), this.ctrl.presets.activate(n), t.trigger("ga/view", {
                view: n ? e.GA.view.presets : e.GA.view.wheel
            })
        }, w.prototype.updateHistoryBtns = function() {
            return this.ctrl["menu-undo"].disable(!n.hasBack()), this.ctrl["menu-redo"].disable(!n.hasFwd())
        }, w
    }(), w
});
