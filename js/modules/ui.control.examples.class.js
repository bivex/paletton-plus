define("ui.control.examples.class", ["app.ini", "app.events", "app.settings", "app.locale", "util", "ui.control.palette.class", "ui.control.button.class", "ui.control.dialog.class", "ui.control.colorinfo.class", "ui.control.adjuster.class", "ui.control.randomizer.class", "ui.control.convert.class", "ui.control.loader.class"], function(e, t, n, r, i, s, o, u, a, f, l, c, h) {
    var p, d, v;
    return d = {
        web: {
            submenu: {
                webw: {
                    data: {
                        url: "examples/webpage/index-white.html",
                        addAdjuster: !0,
                        addRandomizer: !0,
                        addSwapSecs: !0,
                        addConvert: !0
                    }
                },
                webb: {
                    data: {
                        url: "examples/webpage/index-black.html",
                        addAdjuster: !0,
                        addRandomizer: !0,
                        addSwapSecs: !0,
                        addConvert: !0
                    }
                },
                webl: {
                    data: {
                        url: "examples/webpage/index-light.html",
                        addAdjuster: !0,
                        addRandomizer: !0,
                        addSwapSecs: !0,
                        addConvert: !0
                    }
                },
                webd: {
                    data: {
                        url: "examples/webpage/index-dark.html",
                        addAdjuster: !0,
                        addRandomizer: !0,
                        addSwapSecs: !0,
                        addConvert: !0
                    }
                }
            }
        },
        uifw: {
            submenu: {
                tw: {
                    data: {
                        url: "examples/tailwind/index.html",
                        addAdjuster: !0,
                        addRandomizer: !0,
                        addSwapSecs: !0,
                        addConvert: !0
                    }
                },
                m3: {
                    data: {
                        url: "examples/material/index.html",
                        addAdjuster: !0,
                        addRandomizer: !0,
                        addSwapSecs: !0,
                        addConvert: !0
                    }
                },
                antd: {
                    data: {
                        url: "examples/antd/index.html",
                        addAdjuster: !0,
                        addRandomizer: !0,
                        addSwapSecs: !0,
                        addConvert: !0
                    }
                },
                elplus: {
                    data: {
                        url: "examples/element-plus/index.html",
                        addAdjuster: !0,
                        addRandomizer: !0,
                        addSwapSecs: !0,
                        addConvert: !0
                    }
                },
                arco: {
                    data: {
                        url: "examples/arco/index.html",
                        addAdjuster: !0,
                        addRandomizer: !0,
                        addSwapSecs: !0,
                        addConvert: !0
                    }
                },
                vant: {
                    data: {
                        url: "examples/vant/index.html",
                        addAdjuster: !0,
                        addRandomizer: !0,
                        addSwapSecs: !0,
                        addConvert: !0
                    }
                },
                nutui: {
                    data: {
                        url: "examples/nutui/index.html",
                        addAdjuster: !0,
                        addRandomizer: !0,
                        addSwapSecs: !0,
                        addConvert: !0
                    }
                },
                varlet: {
                    data: {
                        url: "examples/varlet/index.html",
                        addAdjuster: !0,
                        addRandomizer: !0,
                        addSwapSecs: !0,
                        addConvert: !0
                    }
                },
                boot: {
                    data: {
                        url: "examples/bootstrap/index.html",
                        addAdjuster: !0,
                        addRandomizer: !0,
                        addSwapSecs: !0,
                        addConvert: !0
                    }
                },
                fom: {
                    data: {
                        url: "examples/fomantic/index.html",
                        addAdjuster: !0,
                        addRandomizer: !0,
                        addSwapSecs: !0,
                        addConvert: !0
                    }
                }
            }
        },
        pic: {
            submenu: {
                shtr: {
                    data: {
                        url: "examples/abstract2/index.html",
                        addAdjuster: !0,
                        addRandomizer: !0,
                        addSwapSecs: !0,
                        addConvert: !0
                    }
                },
                flwr: {
                    data: {
                        url: "examples/flowers/index.html",
                        addAdjuster: !0,
                        addRandomizer: !0,
                        addSwapSecs: !0,
                        addConvert: !0
                    }
                },
                glo2: {
                    data: {
                        url: "examples/abstract3/index.html",
                        addAdjuster: !0,
                        addRandomizer: !0,
                        addSwapSecs: !0,
                        addConvert: !0
                    }
                },
                glo: {
                    data: {
                        url: "examples/abstract/index.html",
                        addAdjuster: !0,
                        addRandomizer: !0,
                        addSwapSecs: !0,
                        addConvert: !0
                    }
                },
                tart: {
                    data: {
                        url: "examples/tartan/index.html",
                        addAdjuster: !0,
                        addRandomizer: !0,
                        addSwapSecs: !0,
                        addConvert: !0
                    }
                }
            }
        },
        anim: {
            submenu: {
                blob: {
                    data: {
                        url: "examples/blobs/index.html",
                        addAdjuster: !0,
                        addRandomizer: !0,
                        addSwapSecs: !0,
                        addConvert: !0
                    }
                },
                stripes: {
                    data: {
                        url: "examples/stripes/index.html",
                        addAdjuster: !0,
                        addRandomizer: !0,
                        addSwapSecs: !0,
                        addConvert: !0
                    }
                }
            }
        }
    }, v = function(e) {
        var t, n, r, i, s;
        for (t in d) {
            r = d[t], s = r.submenu;
            for (n in s) {
                i = s[n];
                if (n === e) return i
            }
        }
        return null
    }, p = function() {
        function s(e, t, r, s) {
            var o, u;
            this.palette = e, this.$button = t, this.$parent = r, o = {
                "default": "webw",
                converter: null
            };
            if (!this.$parent) return;
            u = this, this.options = i.objMerge(o, s), this.selected = n.get("EXA") || this.options["default"], this.init()
        }
        return s.prototype.init = function() {
            var e;
            return e = this, this.open = !1, this.$button.click(function(t) {
                return t.preventDefault(), e.openDlg(), e.setList()
            }), t.register("ui/example/loaded", function() {
                var t;
                return (t = e.loader) != null ? typeof t.done == "function" ? t.done() : void 0 : void 0
            }), t.register("adjuster/changed", function() {
                var t;
                if (!e.open) return;
                return typeof(t = e.$iframe[0].contentWindow).colorize == "function" ? t.colorize() : void 0
            }), t.register("randomizer/changed", function() {
                var t;
                if (!e.open) return;
                return typeof(t = e.$iframe[0].contentWindow).colorize == "function" ? t.colorize() : void 0
            })
        }, s.prototype.openDlg = function() {
            var e, n, i, s, o, a, f, l, c, h, p;
            h = this, e = $("<DIV>", {
                "class": "cover"
            }), s = $("<UL>", {
                "class": "control-list list-menu"
            }), e.append(s), this.$content = $("<DIV>", {
                "class": "list-content"
            }), e.append(this.$content), this.$iframe = $("<IFRAME>", {
                id: "example-iframe",
                marginwidth: 0,
                marginheight: 0,
                frameborder: 0
            }), this.$content.append(this.$iframe);
            for (a in d) {
                l = d[a], n = $("<LI>").html('<a href="#" class="item-' + a + '">' + r("examples." + a + ".title") + "</a>"), n.addClass("item unselectable"), s.append(n);
                if (l.submenu) {
                    o = $("<UL>", {
                        "class": "submenu"
                    }), n.append(o), p = l.submenu;
                    for (f in p) c = p[f], i = $("<LI>").html('<a href="#" class="subitem-' + f + '">→  ' + r("examples." + a + ".sub." + f + ".title") + "</a>"), i.addClass("subitem selectable"), i.data("id", f), o.append(i), f === this.selected && (i.addClass("sel"), n.addClass("sel"))
                }
            }
            return s.find("li.item>a").click(function(e) {
                return e.preventDefault(), s.find("li.item.sel").removeClass("sel"), $(this).parents("li.item").addClass("sel")
            }), s.find("li.subitem>a").click(function(e) {
                return e.preventDefault(), s.find("li.subitem.sel").removeClass("sel"), n = $(this).parents("li.subitem"), n.addClass("sel"), s.find("li.item.sel").removeClass("sel"), $(this).parents("li.item").addClass("sel"), a = n.data("id"), h.setList(a)
            }), this.$tools = $("<DIV>", {
                "class": "list-tools"
            }), e.append(this.$tools), this.dlg = new u(this.$parent, e, {
                className: "dlg-examples",
                title: r("examples.title"),
                width: 990,
                height: 660,
                resizable: !1,
                draggable: !1,
                modal: !0,
                onClose: function() {
                    var e, n;
                    return (e = h.converter) != null && e.remove(), (n = h.adjuster) != null && n.close(), h.open = !1, t.trigger("ga/view")
                },
                position: {
                    my: "center bottom",
                    at: "center bottom+10",
                    of: this.$parent
                }
            }), this.open = !0
        }, s.prototype.setList = function(i) {
            var s, u, a, p, d, m, g, y;
            return i && (this.selected = i), u = v(this.selected), u || (this.selected = this.options["default"], u = v(this.selected)), a = u.data.url, this.$iframe.attr("src") === a ? this.$iframe[0].contentWindow.location.reload(!0) : this.$iframe.attr("src", a), (d = this.loader) != null && typeof d.done == "function" && d.done(), this.loader = new h(this.$iframe), n.set("EXA", this.selected), (m = this.converter) != null && m.remove(), (g = this.adjuster) != null && g.close(), this.$tools.empty(), p = this, u.data.addConvert && (this.converter = new c(this.$tools, {
                positionMy: "right bottom",
                positionAt: "right bottom",
                selected: ((y = this.options.converter) != null ? y.getSelected() : void 0) || "none",
                onChange: function() {
                    var e;
                    return typeof(e = p.$iframe[0].contentWindow).colorize == "function" ? e.colorize() : void 0
                }
            })), u.data.addSwapSecs && this.palette.hasSecs() && this.palette.model && (s = new o(this.$tools, {
                className: "btn-swap",
                label: r("color.swap"),
                asUIButton: !1,
                onClick: function() {
                    var e;
                    return t.trigger("palette/swapsecs"), typeof(e = p.$iframe[0].contentWindow).colorize == "function" ? e.colorize() : void 0
                }
            })), u.data.addAdjuster && (s = new o(this.$tools, {
                className: "btn-adj",
                asUIButton: !1,
                label: r("adjuster.btn") + "…"
            }), this.$tools.append(s.$e), this.adjuster = new f(s.$e, this.palette, this.$tools, {
                positionMy: "center bottom",
                positionAt: "center+10 bottom+30",
                positionOf: this.$tools
            })), u.data.addRandomizer && (s = new o(this.$tools, {
                className: "btn-rnd",
                asUIButton: !1,
                label: r("random.btn") + "…"
            }), this.$tools.append(s.$e), this.adjuster = new l(s.$e, this.palette, this.$tools, {
                positionMy: "center bottom",
                positionAt: "center+10 bottom+30",
                positionOf: this.$tools
            })), s = new o(this.$tools, {
                className: "btn-close",
                asUIButton: !0,
                label: r("app.btnClose"),
                onClick: function() {
                    return p.dlg.close()
                }
            }), this.$tools.append(s.$e), t.trigger("ga/view", {
                view: e.GA.view.example + "/" + this.selected
            })
        }, s
    }(), p
});
