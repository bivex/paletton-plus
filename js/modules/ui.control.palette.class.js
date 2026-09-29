define("ui.control.palette.class", ["app.events", "util", "color.oklch", "app.locale"], function(events, util, oklch, lang) {
    var PaletteControl;

    function getCopyFormat() {
        try {
            return localStorage.getItem("pal_copy_format") || "hex";
        } catch(err) {
            return "hex";
        }
    }

    function setCopyFormat(fmt) {
        try {
            localStorage.setItem("pal_copy_format", fmt);
        } catch(err) {}
        if (window._Paletton) window._Paletton.copyFormat = fmt;
        events.trigger("palette/copyformat/changed", { format: fmt });
    }

    function copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).catch(function(){});
        } else {
            var ta = document.createElement("textarea");
            ta.value = text;
            ta.style.position = "fixed";
            ta.style.opacity = "0";
            document.body.appendChild(ta);
            ta.select();
            try { document.execCommand("copy"); } catch(err) {}
            document.body.removeChild(ta);
        }
    }

    function showToast(text) {
        var $toast = $(".global-copy-toast");
        if (!$toast.length) {
            $toast = $("<div>", { "class": "global-copy-toast" });
            $("body").append($toast);
        }
        $toast.text(text).addClass("visible");
        clearTimeout(window._globalCopyToastTimer);
        window._globalCopyToastTimer = setTimeout(function() {
            $toast.removeClass("visible");
        }, 1500);
    }

    // Expose helpers globally
    if (typeof window !== "undefined") {
        window._palCopyColor = function(hex) {
            var fmt = getCopyFormat();
            var val = oklch.formatHexColor(hex, fmt);
            copyToClipboard(val);
            var prefix = (lang ? lang("palette.copied") : "Copied") || "Copied";
            showToast(prefix + ": " + val);
            return val;
        };
        window._palGetCopyFormat = getCopyFormat;
        window._palSetCopyFormat = setCopyFormat;
        window._palShowToast = showToast;
    }

    PaletteControl = function() {
        function PaletteControl(pal, $container, opts) {
            var defaultOpts, self;
            this.palette = pal;
            this.$container = $container;
            defaultOpts = {
                className: "",
                asStatic: !1
            };
            this.options = util.objMerge(defaultOpts, opts);
            self = this;
            if (!this.options.asStatic) {
                events.register("palette/colors/changed", function() {
                    return self.colorize();
                });
                events.register("palette/model/changed", function() {
                    return self.draw();
                });
                events.register("palette/copyformat/changed", function(e, data) {
                    self.updateTooltips();
                });
            }
            this.draw();
        }

        PaletteControl.prototype.updateTooltips = function() {
            if (!this.$e) return;
            var fmt = getCopyFormat().toUpperCase();
            this.$e.find("td[col-data], span[col-data]").each(function() {
                var $sw = $(this);
                var hex = $sw.attr("col-data") || "";
                if (hex) {
                    var formatted = oklch.formatHexColor(hex, fmt.toLowerCase());
                    $sw.attr("title", formatted + " — Click to copy (" + fmt + ") • Shift+click for info");
                }
            });
        };

        PaletteControl.prototype.draw = function() {
            var $tbody, $table, $tr, self, buildColumn, colCount;
            self = this;
            this.$e = $("<DIV>", {
                "class": "control-palette " + this.options.className
            });
            this.$container.empty().append(this.$e);

            $table = $("<TABLE>");
            this.$e.append($table);
            $tbody = $("<TBODY>");
            $table.append($tbody);
            $tr = $("<TR>");
            $tbody.append($tr);

            function bindSwatch($el, grp, idx) {
                $el.css("cursor", "pointer");
                $el.on("click", function(ev) {
                    ev.stopPropagation();
                    var hex = $el.attr("col-data") || $el.prop("title") || "";
                    if (!hex && self.palette && self.palette.colorTable) {
                        try {
                            var tbl = self.options.asStatic ? self.palette.colorTable.sorted : self.palette.colorTable.byPalette;
                            if (tbl && tbl[grp] && tbl[grp][idx]) {
                                hex = tbl[grp][idx].getHex ? tbl[grp][idx].getHex() : "";
                            }
                        } catch(err) {}
                    }
                    if (!hex) return;

                    // Shift-click or Alt-click opens color info dialog
                    if (ev.shiftKey || ev.altKey) {
                        events.trigger("ui/preview/colinfo", { hex: hex });
                        return;
                    }

                    var fmt = getCopyFormat();
                    var val = oklch.formatHexColor(hex, fmt);
                    copyToClipboard(val);
                    var prefix = (lang ? lang("palette.copied") : "Copied") || "Copied";
                    showToast(prefix + ": " + val);

                    $el.addClass("swatch-copied-flash");
                    setTimeout(function() {
                        $el.removeClass("swatch-copied-flash");
                    }, 300);
                });

                $el.on("dblclick", function(ev) {
                    ev.stopPropagation();
                    var hex = $el.attr("col-data") || $el.prop("title") || "";
                    if (hex) {
                        events.trigger("ui/preview/colinfo", { hex: hex });
                    }
                });
            }

            buildColumn = function(grp) {
                var $varSpan, $td, colObj, stepIdx, stepCount, results;
                $td = $("<TD>", {
                    "class": "bgcol-" + grp + "-0"
                });
                if (self.options.asStatic) {
                    colObj = self.palette.colorTable.sorted[grp][0];
                    $td.css("background", colObj.getCSS());
                    $td.attr("col-data", colObj.getHex());
                }
                bindSwatch($td, grp, 0);
                $tr.append($td);

                results = [];
                for (stepIdx = stepCount = 1; stepCount <= 4; stepIdx = ++stepCount) {
                    $varSpan = $("<SPAN>", {
                        "class": "var var-" + stepIdx + " bgcol-" + grp + "-" + stepIdx
                    });
                    $td.append($varSpan);
                    if (self.options.asStatic) {
                        colObj = self.palette.colorTable.sorted[grp][stepIdx];
                        $varSpan.attr("col-data", colObj.getHex());
                        results.push($varSpan.css("background", colObj.getCSS()));
                    } else {
                        results.push(void 0);
                    }
                    bindSwatch($varSpan, grp, stepIdx);
                }
                return results;
            };

            buildColumn("pri");
            if (this.palette.hasSecs()) {
                buildColumn("sec1");
                buildColumn("sec2");
            }
            if (this.palette.hasCompl()) {
                buildColumn("compl");
            }

            colCount = this.palette.getColCnt();
            $tr.find(".bgcol-pri-0").addClass("span" + (5 - colCount));

            // If this is the main palette (big), add copy format pills selector
            if (this.options.className && this.options.className.indexOf("big") !== -1) {
                var $parentPane = this.$container.parent();
                if ($parentPane.length) {
                    $parentPane.find(".pane-palette-copyfmt").remove();
                    var $fmtBar = $("<div>", { "class": "pane pane-content pane-palette-copyfmt" });
                    var curFmt = getCopyFormat();
                    var formats = ["hex", "oklch", "rgb", "hsl"];

                    $.each(formats, function(idx, fmt) {
                        var $btn = $("<button>", {
                            type: "button",
                            "class": "copyfmt-btn" + (fmt === curFmt ? " active" : ""),
                            "data-fmt": fmt
                        }).text(fmt.toUpperCase());

                        $btn.on("click", function(ev) {
                            ev.stopPropagation();
                            $fmtBar.find(".copyfmt-btn").removeClass("active");
                            $btn.addClass("active");
                            setCopyFormat(fmt);
                            showToast("Format: " + fmt.toUpperCase());
                        });

                        $fmtBar.append($btn);
                    });

                    $parentPane.append($fmtBar);
                }
            }

            this.updateTooltips();
        };

        PaletteControl.prototype.colorize = function() {
            var res = events.trigger("palette/colorize", {
                $e: this.$e,
                sorted: !0,
                converted: !1
            });
            this.updateTooltips();
            return res;
        };

        return PaletteControl;
    }();

    return PaletteControl;
});
