define("ui.control.colorlist.class", ["app.ini", "app.events", "app.locale", "util", "ui.control.palette.class", "ui.control.button.class", "ui.control.dialog.class", "ui.control.colorinfo.class", "ui.control.colorlist.table.simple", "ui.control.colorlist.table.detail", "ui.control.colorlist.table.grid", "ui.control.colorlist.table.contrast", "ui.control.colorlist.table.tonal"], function(e, t, n, r, i, s, o, u, a, f, l, c, tonalTable) {
    var h, p;
    return p = {
        detail: {
            submenu: {
                html: {
                    event: "export/html"
                },
                css: {
                    event: "export/css"
                },
                oklch: {
                    event: "export/oklch"
                },
                tailwind: {
                    event: "export/tailwind"
                },
                dtcg: {
                    event: "export/dtcg"
                },
                figma: {
                    event: "export/figma"
                },
                less: {
                    event: "export/less"
                },
                sass: {
                    event: "export/sass"
                },
                xml: {
                    event: "export/xml"
                },
                text: {
                    event: "export/text"
                }
            }
        },
        simple: {
            submenu: {
                png: {
                    event: "export/png"
                },
                svg: {
                    event: "export/svg"
                },
                aco: {
                    event: "export/aco"
                },
                gpl: {
                    event: "export/gpl"
                },
                sketch: {
                    event: "export/sketch"
                },
                figma: {
                    event: "export/figma"
                }
            }
        },
        contrast: {
            submenu: null
        },
        tonal: {
            submenu: null
        }
    }, h = function() {
        function i(e, t, n, i) {
            var s, o;
            this.palette = e, this.$button = t, this.$parent = n, s = {
                selected: null
            };
            if (!this.$parent) return;
            o = this, this.options = r.objMerge(s, i), this.selected = this.options.selected || "detail", this.init()
        }
        return i.prototype.init = function() {
            var e;
            return e = this, this.$button.click(function(t) {
                return t.preventDefault(), e.openDlg(), e.setList()
            }), t.register("palette/uid/changed", function() {
                if (!e.open) return;
                return e.setList()
            })
        }, i.prototype.openDlg = function() {
            var r, i, s, u, a, f, l, c, h, d, v;
            d = this, r = $("<DIV>", {
                "class": "cover"
            }), u = $("<UL>", {
                "class": "list-menu control-list"
            }), r.append(u), this.$content = $("<DIV>", {
                "class": "list-content"
            }), r.append(this.$content), this.$tools = $("<DIV>", {
                "class": "list-tools"
            }), r.append(this.$tools);
            for (f in p) {
                c = p[f], i = $("<LI>").html('<a href="#" class="item-' + f + '">' + n("colorList." + f + ".title") + "</a>"), i.addClass("item selectable"), f === this.selected && i.addClass("sel"), i.data("list", f), u.append(i);
                if (c.submenu) {
                    a = $("<UL>", {
                        "class": "submenu"
                    }), i.append(a), v = c.submenu;
                    for (l in v) h = v[l], s = $("<LI>", {
                        title: n("colorList." + f + ".sub." + l + ".desc")
                    }).html('<a href="#" class="subitem-' + l + '">→  ' + n("colorList." + f + ".sub." + l + ".title") + "</a>"), s.addClass("subitem"), s.data("event", h.event), a.append(s)
                }
            }
            return u.find("li.item>a").click(function(e) {
                return e.preventDefault(), i = $(this).parents("li.item"), f = i.data("list"), u.find("li.item.sel").removeClass("sel"), i.addClass("sel"), d.setList(f)
            }), u.find("li.subitem>a").click(function(n) {
                var r;
                return n.preventDefault(), r = $(this).parent().data("event"), t.trigger(r), t.trigger("ga/view", {
                    view: e.GA.view.coltable + "/" + r
                })
            });
            var winW = $(window).width();
            var winH = $(window).height();
            var dlgW = Math.min(1600, Math.max(1060, Math.floor(winW * 0.94)));
            var dlgH = Math.min(960, Math.max(700, Math.floor(winH * 0.90)));
            this.dlg = new o(this.$parent, r, {
                className: "dlg-colorlist",
                title: n("colorList.title"),
                width: dlgW,
                height: dlgH,
                resizable: !0,
                draggable: !0,
                modal: !0,
                onClose: function() {
                    return d.open = !1, t.trigger("ga/view")
                },
                position: {
                    my: "center center",
                    at: "center center",
                    of: window
                }
            }), this.open = !0
        }, i.prototype.setList = function(r) {
            var i, o;
            o = this, r && (this.selected = r);
            switch (this.selected) {
                case "simple":
                    a.draw(this.$content, this.$tools, this.palette);
                    break;
                case "detail":
                    f.draw(this.$content, this.$tools, this.palette);
                    break;
                case "grid":
                    l.draw(this.$content, this.$tools, this.palette);
                    break;
                case "contrast":
                    c.draw(this.$content, this.$tools, this.palette);
                    break;
                case "tonal":
                    tonalTable.draw(this.$content, this.$tools, this.palette);
                    break;
            }
            return i = new s(this.$tools, {
                className: "btn-close",
                asUIButton: !0,
                label: n("app.btnClose"),
                onClick: function() {
                    return o.dlg.close()
                }
            }), this.$tools.append(i.$e), t.trigger("ga/view", {
                view: e.GA.view.coltable + "/" + this.selected
            })
        }, i
    }(), h
});
