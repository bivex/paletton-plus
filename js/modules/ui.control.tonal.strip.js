define("ui.control.tonal.strip", ["app.events", "color.oklch", "util"], function(events, oklch, util) {

    var STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

    // Luminance for white/black text contrast heuristic
    function textColor(hex) {
        var r = parseInt(hex.slice(0,2),16)/255,
            g = parseInt(hex.slice(2,4),16)/255,
            b = parseInt(hex.slice(4,6),16)/255;
        r = r < 0.04045 ? r/12.92 : Math.pow((r+0.055)/1.055, 2.4);
        g = g < 0.04045 ? g/12.92 : Math.pow((g+0.055)/1.055, 2.4);
        b = b < 0.04045 ? b/12.92 : Math.pow((b+0.055)/1.055, 2.4);
        var L = 0.2126*r + 0.7152*g + 0.0722*b;
        return L > 0.179 ? "#000000" : "#ffffff";
    }

    function hexFromScale(scale, stepIdx) {
        var s = scale[stepIdx];
        if (!s) return "888888";
        var r = Math.round(Math.max(0,Math.min(1,s.r))*255),
            g = Math.round(Math.max(0,Math.min(1,s.g))*255),
            b = Math.round(Math.max(0,Math.min(1,s.b))*255);
        return (r<16?"0":"")+r.toString(16)+(g<16?"0":"")+g.toString(16)+(b<16?"0":"")+b.toString(16);
    }

    // Copy text to clipboard
    function copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).catch(function(){});
        } else {
            var ta = document.createElement("textarea");
            ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
            document.body.appendChild(ta); ta.select();
            try { document.execCommand("copy"); } catch(e) {}
            document.body.removeChild(ta);
        }
    }

    // GROUP_LABELS
    var GROUP_LABELS = { pri: "Primary", sec1: "Secondary 1", sec2: "Secondary 2", compl: "Complement" };

    function TonalStrip(palette, $container) {
        this.palette = palette;
        this.$container = $container;
        this.$e = null;
        this._copyToast = null;
        this._init();
    }

    TonalStrip.prototype._init = function() {
        var self = this;
        this.$e = $("<div>", { "class": "tonal-strip" });
        this.$container.append(this.$e);

        // Toast element
        this._$toast = $("<div>", { "class": "tonal-strip-toast" }).text("Copied!");
        this.$container.append(this._$toast);

        events.register("palette/colors/changed", function() { self.render(); });
        events.register("palette/model/changed",  function() { self.render(); });
        events.register("palette/copyformat/changed", function() { self.render(); });
        this.render();
    };

    TonalStrip.prototype.render = function() {
        var self = this;
        var palette = this.palette;
        var scales;
        try {
            scales = palette.getTonalScales();
        } catch(e) { return; }
        if (!scales || !scales.pri) return;

        this.$e.empty();

        var groups = ["pri"];
        if (palette.hasSecs())  { groups.push("sec1"); groups.push("sec2"); }
        if (palette.hasCompl()) { groups.push("compl"); }

        var curFmt = (window._palGetCopyFormat && window._palGetCopyFormat()) || "hex";

        $.each(groups, function(gi, grp) {
            var scale = scales[grp];
            if (!scale) return;

            var $row = $("<div>", { "class": "tonal-strip-row" });

            // Label
            var $label = $("<span>", { "class": "tonal-strip-label" }).text(GROUP_LABELS[grp] || grp);
            $row.append($label);

            // Swatches
            var $swatches = $("<div>", { "class": "tonal-strip-swatches" });

            $.each(STEPS, function(si, step) {
                var hex = hexFromScale(scale, si);
                var formatted = oklch.formatHexColor(hex, curFmt);
                var tc  = textColor(hex);
                var $sw = $("<div>", {
                    "class": "tonal-swatch",
                    "title": step + " — " + formatted + " (Click to copy " + curFmt.toUpperCase() + ")"
                }).css({ background: "#" + hex });

                var $stepLabel = $("<span>", { "class": "tonal-swatch-step" }).text(step).css("color", tc);
                var $hexLabel  = $("<span>", { "class": "tonal-swatch-hex"  }).text("#" + hex).css("color", tc);

                $sw.append($stepLabel).append($hexLabel);

                $sw.on("click", (function(h, s, fmtVal) {
                    return function(ev) {
                        var latestFmt = (window._palGetCopyFormat && window._palGetCopyFormat()) || "hex";
                        var copyVal = oklch.formatHexColor(h, latestFmt);
                        copyToClipboard(copyVal);
                        if (window._palShowToast) {
                            window._palShowToast("Copied: " + copyVal);
                        } else {
                            self._showToast(copyVal, ev);
                        }
                        $sw.addClass("swatch-copied-flash");
                        setTimeout(function() {
                            $sw.removeClass("swatch-copied-flash");
                        }, 300);
                    };
                })(hex, step, formatted));

                $swatches.append($sw);
            });

            $row.append($swatches);
            self.$e.append($row);
        });
    };

    TonalStrip.prototype._showToast = function(text, ev) {
        var self = this;
        this._$toast.text("Copied " + text).addClass("visible");
        clearTimeout(this._copyTimer);
        this._copyTimer = setTimeout(function() {
            self._$toast.removeClass("visible");
        }, 1400);
    };

    return TonalStrip;
});
