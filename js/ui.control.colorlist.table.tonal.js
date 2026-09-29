define("ui.control.colorlist.table.tonal", ["app.events", "app.locale", "util", "color.oklch", "color.rgb.class", "color.class", "ui.control.colorinfo.class"], function(e, t, n, oklch, RgbClass, ColorClass, ColorInfo) {
    "use strict";

    var steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

    return {
        draw: function($content, $tools, palette) {
            $content.empty();
            $tools.empty();

            var $table = $("<TABLE>", { "class": "table table-detail table-tonal" });
            $content.append($table);
            var $tbody = $("<TBODY>");
            $table.append($tbody);

            var scales = palette.getTonalScales();

            function renderGroup($tbody, groupKey, groupTitle) {
                var groupScale = scales[groupKey];
                if (!groupScale) return;

                // Group title row
                var $titleTr = $("<TR>", { "class": "title" });
                var $titleTd = $("<TD>", { "class": "title", colspan: steps.length }).text(groupTitle);
                $titleTr.append($titleTd);
                $tbody.append($titleTr);

                // Swatch row
                var $swatchTr = $("<TR>", { "class": "tonal-swatches" });
                $tbody.append($swatchTr);

                // Info row
                var $infoTr = $("<TR>", { "class": "info tonal-info" });
                $tbody.append($infoTr);

                for (var i = 0; i < steps.length; i++) {
                    var step = steps[i];
                    var stepData = groupScale[step];
                    if (!stepData) continue;

                    var isLight = stepData.L >= 0.55;
                    var textColor = isLight ? "#111" : "#FFF";

                    var $swatchTd = $("<TD>", {
                        "class": "col col-tonal col-" + step,
                        title: groupTitle + " " + step + " (" + stepData.hex + " / " + stepData.oklchCss + ")"
                    }).css({
                        background: stepData.hex,
                        color: textColor,
                        height: "44px",
                        textAlign: "center",
                        verticalAlign: "middle",
                        fontWeight: "bold",
                        fontSize: "11px",
                        cursor: "pointer"
                    }).text(step);

                    (function(sd) {
                        $swatchTd.click(function() {
                            var rgbObj = new RgbClass(sd.r, sd.g, sd.b);
                            var colObj = new ColorClass(sd.H);
                            colObj.rgb = rgbObj;
                            colObj.setSV(sd.C, sd.L);
                            new ColorInfo(colObj, $content);
                        });
                    })(stepData);

                    $swatchTr.append($swatchTd);

                    var $infoTd = $("<TD>", {
                        "class": "desc col-tonal col-" + step
                    }).css({
                        fontSize: "10px",
                        padding: "6px 2px",
                        textAlign: "center",
                        verticalAlign: "top"
                    });

                    var $hexP = $("<P>", { "class": "hexcode" }).css({ margin: "2px 0", cursor: "pointer" });
                    var $hexSpan = $("<SPAN>").text(stepData.hex);
                    var $hexInput = $("<INPUT>", {
                        type: "text",
                        value: stepData.hex,
                        readonly: true
                    }).css({ width: "55px", fontSize: "10px", textAlign: "center" }).hide();

                    (function(inp, sp, hexVal, oklchStr) {
                        sp.click(function() {
                            var latestFmt = (window._palGetCopyFormat && window._palGetCopyFormat()) || "hex";
                            var copyVal = oklch.formatHexColor(hexVal, latestFmt);
                            if (navigator.clipboard && navigator.clipboard.writeText) {
                                navigator.clipboard.writeText(copyVal).catch(function(){});
                            }
                            if (window._palShowToast) window._palShowToast("Copied: " + copyVal);
                            $table.find(".hexcode span").show();
                            $table.find(".hexcode input").hide();
                            sp.hide();
                            inp.val(copyVal).show().focus().select();
                        });
                        inp.blur(function() {
                            inp.hide();
                            sp.show();
                        });
                    })($hexInput, $hexSpan, stepData.hex, stepData.oklchCss);

                    $hexP.append($hexSpan).append($hexInput);
                    $infoTd.append($hexP);

                    var $oklchP = $("<P>", {
                        "class": "selectable",
                        title: stepData.oklchCss + " (Click to copy)"
                    }).css({
                        fontSize: "9px",
                        color: "#888",
                        margin: "2px 0",
                        cursor: "copy"
                    }).text(Math.round(stepData.L * 100) + "% L");

                    (function(oklchStr) {
                        $oklchP.click(function() {
                            if (navigator.clipboard && navigator.clipboard.writeText) {
                                navigator.clipboard.writeText(oklchStr).catch(function(){});
                            }
                            if (window._palShowToast) window._palShowToast("Copied: " + oklchStr);
                        });
                    })(stepData.oklchCss);

                    $infoTd.append($oklchP);
                    $infoTr.append($infoTd);
                }
            }

            renderGroup($tbody, "pri", t("color.pri"));
            if (palette.hasSecs()) {
                renderGroup($tbody, "sec1", t("color.sec") + " #1");
                renderGroup($tbody, "sec2", t("color.sec") + " #2");
            }
            if (palette.hasCompl()) {
                renderGroup($tbody, "compl", t("color.compl"));
            }

            var $desc = $("<DIV>").css({ padding: "8px 12px", color: "#666", fontSize: "12px" })
                .text("11-step perceptual tonal scales (50…950) generated in OKLCH with natural warm/cool hue shift. Click any swatch for color details.");
            $tools.append($desc);
        }
    };
});
