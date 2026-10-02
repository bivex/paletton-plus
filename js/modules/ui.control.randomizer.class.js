define("ui.control.randomizer.class", ["app.ini", "app.events", "app.locale", "ui.control.button.class", "ui.control.dialog.class", "util"], function(e, t, n, r, i, s) {
    var o, events = t;
    return o = function() {
        function r(e, t, n, r) {
            var i, o;
            this.$button = e, this.palette = t, this.$parent = n, i = {
                className: "",
                width: 330,
                positionMy: "left top",
                positionAt: "left top",
                positionOf: null
            };
            if (!this.$parent) return;
            o = this, this.options = s.objMerge(i, r), this.$button.click(function(e) {
                return e.preventDefault(), o.openDlg()
            });

            // Global Spacebar shortcut
            $(document).on("keydown.randomizer", function(ev) {
                if (ev.keyCode === 32 || ev.key === " ") {
                    var tag = (ev.target && ev.target.tagName ? ev.target.tagName.toLowerCase() : "");
                    if (tag !== "input" && tag !== "textarea" && tag !== "select" && !$(ev.target).is("[contenteditable]")) {
                        ev.preventDefault();
                        o.palette.randomizeQuick();
                        events.trigger("randomizer/changed");
                    }
                }
            });
        }
        return r.prototype.openDlg = function() {
            var e, r, pal;
            r = this, pal = this.palette, this.close();
            e = $("<DIV>", {
                "class": "control control-random " + this.options.className
            }).css({
                width: "100%",
                maxHeight: "560px",
                overflowY: "auto",
                paddingRight: "6px",
                boxSizing: "border-box"
            }).data("control", this);

            // Contrast Report Box
            var $contrastBox = $("<DIV>").addClass("rand-contrast-box");
            var updateContrastBadge = function() {
                var rep = pal.getContrastReport();
                $contrastBox.empty();
                if (rep) {
                    var isAA = rep.passesAA;
                    var badgeBg = isAA ? "#194d33" : "#5a3a10";
                    var badgeColor = isAA ? "#75fbc0" : "#ffb74d";
                    var badgeText = isAA ? (n("random.contrastPassed") || "AA Passed ✓") : (n("random.contrastWarning") || "Low Contrast ⚠");
                    $("<span>").css({ color: "#aaa" }).html("Primary: <b>" + rep.priBgRatio + ":1</b> • Text: <b>" + rep.textBgRatio + ":1</b>").appendTo($contrastBox);
                    $("<span>").addClass("rand-contrast-badge").css({
                        background: badgeBg,
                        color: badgeColor,
                        border: "1px solid " + badgeColor
                    }).text(badgeText).appendTo($contrastBox);
                }
            };
            updateContrastBadge();
            e.append($contrastBox);

            // Smart Actions (Keep Character & Variations)
            $("<DIV>").addClass("rand-section-title").text(n("random.actionsTitle") || "Smart Randomize").appendTo(e);

            var $btnKeep = $("<BUTTON>").addClass("rand-btn-action").html(n("random.btnKeepMood") || "⚡ Keep Character<small>rotate hues, keep contrast & style</small>").click(function() {
                r.randomizeKeepMood();
                updateContrastBadge();
            });
            e.append($btnKeep);

            var $btnVar = $("<BUTTON>").addClass("rand-btn-action").css({
                background: "linear-gradient(135deg, #1f2d3d 0%, #263c52 100%)",
                borderColor: "#60a5fa",
                color: "#bfdbfe"
            }).html(n("random.btnVariations") || "✨ Variations<small>subtle hue & saturation shift</small>").click(function() {
                r.randomizeVariations();
                updateContrastBadge();
            });
            e.append($btnVar);

            // WCAG Contrast Fix Buttons
            var $wcagRow = $("<DIV>").css({ display: "flex", gap: "6px", marginBottom: "8px" });
            $("<BUTTON>").addClass("rand-btn-action").css({
                flex: "1",
                marginBottom: "0",
                background: "#16382a",
                borderColor: "#22c55e",
                color: "#86efac"
            }).html(n("random.btnFixContrastAA") || "Fix Contrast AA<small>≥ 4.5:1</small>").click(function() {
                r.fixContrast(4.5);
                updateContrastBadge();
            }).appendTo($wcagRow);

            $("<BUTTON>").addClass("rand-btn-action").css({
                flex: "1",
                marginBottom: "0",
                background: "#1b2a40",
                borderColor: "#38bdf8",
                color: "#7dd3fc"
            }).html(n("random.btnFixContrastAAA") || "Fix Contrast AAA<small>≥ 7.0:1</small>").click(function() {
                r.fixContrast(7.0);
                updateContrastBadge();
            }).appendTo($wcagRow);
            e.append($wcagRow);

            // Designer Profiles: UI & Product
            $("<DIV>").addClass("rand-section-title").text("UI & Product Profiles").appendTo(e);
            var $uiProfiles = $("<DIV>").addClass("rand-btn-grid");
            var addProfileBtn = function(container, profileKey, label) {
                $("<BUTTON>").addClass("rand-btn-pill").text(label).click(function() {
                    r.randomizeProfile(profileKey);
                    updateContrastBadge();
                }).appendTo(container);
            };
            addProfileBtn($uiProfiles, "saas", "SaaS UI");
            addProfileBtn($uiProfiles, "minimal", "Minimal (Swiss)");
            addProfileBtn($uiProfiles, "darkui", "Dark UI");
            addProfileBtn($uiProfiles, "neutral_accent", "Neutral + Pop");
            e.append($uiProfiles);

            // Designer Profiles: Aesthetics
            $("<DIV>").addClass("rand-section-title").text("Aesthetic Profiles").appendTo(e);
            var $aesProfiles = $("<DIV>").addClass("rand-btn-grid");
            addProfileBtn($aesProfiles, "luxury", "Luxury");
            addProfileBtn($aesProfiles, "editorial", "Editorial");
            addProfileBtn($aesProfiles, "retro", "Retro");
            addProfileBtn($aesProfiles, "cyberpunk", "Cyberpunk");
            e.append($aesProfiles);

            // Designer Profiles: Nature & Mood
            $("<DIV>").addClass("rand-section-title").text("Nature & Mood Profiles").appendTo(e);
            var $natProfiles = $("<DIV>").addClass("rand-btn-grid");
            addProfileBtn($natProfiles, "nature", "Nature (Sage/Clay)");
            addProfileBtn($natProfiles, "pastel", "Pastel");
            addProfileBtn($natProfiles, "playful", "Playful");
            addProfileBtn($natProfiles, "earth", "Material / Earth");
            addProfileBtn($natProfiles, "ocean", "Ocean Marine");
            addProfileBtn($natProfiles, "sunset", "Sunset Twilight");
            e.append($natProfiles);

            // Selective Regeneration & Color Locks
            $("<DIV>").addClass("rand-section-title").text(n("random.locksTitle") || "Selective Regeneration & Locks").appendTo(e);
            
            var $regenRow = $("<DIV>").css({ display: "flex", gap: "6px", marginBottom: "8px" });
            $("<BUTTON>").addClass("rand-btn-pill").css({
                flex: "1",
                background: "#1c2b3d",
                borderColor: "#38bdf8",
                color: "#bae6fd",
                padding: "6px 8px"
            }).html(n("random.regenPrimary") || "↻ Primary Only").click(function() {
                r.regeneratePrimary();
                updateContrastBadge();
            }).appendTo($regenRow);

            $("<BUTTON>").addClass("rand-btn-pill").css({
                flex: "1",
                background: "#242038",
                borderColor: "#a78bfa",
                color: "#ddd6fe",
                padding: "6px 8px"
            }).html(n("random.regenSecondary") || "↻ Accents Only").click(function() {
                r.regenerateSecondary();
                updateContrastBadge();
            }).appendTo($regenRow);
            e.append($regenRow);

            var $locks = $("<DIV>").css({ fontSize: "11px", color: "#ccc", padding: "2px 0 10px", display: "flex", gap: "10px", justifyContent: "space-between" });
            var createLock = function(key, label) {
                var $lbl = $("<LABEL>").css({ display: "inline-flex", alignItems: "center", gap: "4px", cursor: "pointer" });
                var $chk = $("<INPUT>", { type: "checkbox" }).prop("checked", pal.isColorLocked(key));
                $chk.change(function() {
                    pal.toggleColorLock(key);
                });
                $lbl.append($chk).append(" " + label);
                $locks.append($lbl);
            };
            createLock("pri", "Lock Primary");
            createLock("sec", "Lock Secondary");
            createLock("compl", "Lock Complement");
            e.append($locks);

            // Generation Modes: Harmonies (7 modes)
            $("<DIV>").addClass("rand-section-title").text(n("random.harmoniesGroup") || "Harmonies (7 Modes)").appendTo(e);
            var $harmonies = $("<DIV>").addClass("rand-btn-grid");
            var addGenBtn = function(container, modeKey, label) {
                $("<BUTTON>").addClass("rand-btn-pill compact").text(label).click(function() {
                    r.generateMode(modeKey);
                    updateContrastBadge();
                }).appendTo(container);
            };
            addGenBtn($harmonies, "mono", "Monochromatic");
            addGenBtn($harmonies, "analog", "Analogous");
            addGenBtn($harmonies, "compl", "Complementary");
            addGenBtn($harmonies, "split", "Split Compl.");
            addGenBtn($harmonies, "triad", "Triadic");
            addGenBtn($harmonies, "tetrad", "Tetradic");
            addGenBtn($harmonies, "doublecompl", "Double Compl.");
            e.append($harmonies);

            // Generation Modes: Style & Contrast (5 modes)
            $("<DIV>").addClass("rand-section-title").text(n("random.styleGroup") || "Contrast & Style (5 Modes)").appendTo(e);
            var $styles = $("<DIV>").addClass("rand-btn-grid");
            addGenBtn($styles, "neutral_accent", "Neutral + Accent");
            addGenBtn($styles, "grayscale_accent", "Grayscale + Accent");
            addGenBtn($styles, "high_saturation", "High Saturation");
            addGenBtn($styles, "muted", "Muted");
            addGenBtn($styles, "pastel", "Pastel");
            e.append($styles);

            // Generation Modes: Temperature (2 modes)
            $("<DIV>").addClass("rand-section-title").text(n("random.tempGroup") || "Temperature (2 Modes)").appendTo(e);
            var $temps = $("<DIV>").addClass("rand-btn-grid");
            addGenBtn($temps, "warm", "Warm (Sun & Clay)");
            addGenBtn($temps, "cool", "Cool (Sky & Marine)");
            e.append($temps);

            // Favorites & Bookmarking Row
            var $favRow = $("<DIV>").css({ display: "flex", gap: "6px", marginBottom: "10px" });
            $("<BUTTON>").addClass("rand-btn-pill").css({
                flex: "1",
                background: "#2d2416",
                borderColor: "#b45309",
                color: "#fcd34d"
            }).html(n("random.btnSaveFav") || "★ Add to Favorites").click(function() {
                var ok = pal.saveFavorite();
                if (ok) {
                    var $toast = $(".global-copy-toast");
                    if (!$toast.length) $toast = $("<div>").addClass("global-copy-toast").appendTo("body");
                    $toast.html("&#9733; Saved to Favorites!").addClass("show");
                    setTimeout(function() { $toast.removeClass("show"); }, 2000);
                }
            }).appendTo($favRow);

            $("<BUTTON>").addClass("rand-btn-pill").css({
                flex: "1",
                background: "#182836",
                borderColor: "#38bdf8",
                color: "#7dd3fc"
            }).html(n("random.btnViewFavs") || "📂 Saved Palettes").click(function() {
                r.openFavoritesDlg();
            }).appendTo($favRow);
            e.append($favRow);

            // Typography & Font Pairings (Curated 8 pairings)
            $("<DIV>").addClass("rand-section-title").text(n("random.typoTitle") || "Typography & Font Pairings").appendTo(e);
            var $typoBox = $("<DIV>").addClass("rand-typo-box").css({
                background: "#161d27",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "6px",
                padding: "8px 10px",
                marginBottom: "10px"
            });

            var $typoHeader = $("<DIV>").css({
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "8px",
                gap: "8px"
            });

            var $typoCurrentBadge = $("<DIV>").addClass("rand-typo-badge").css({
                fontSize: "11px",
                color: "#94a3b8",
                flex: "1",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
            });

            var $typoGrid = $("<DIV>").addClass("rand-btn-grid");

            var updateTypoBadge = function() {
                var cur = pal.getTypography ? pal.getTypography() : null;
                if (cur) {
                    $typoCurrentBadge.html('<span style="color:#64748b">' + (n("random.typoCurrent") || "Active:") + '</span> <b style="color:#38bdf8;font-family:' + cur.heading + '">' + cur.name + '</b>');
                    $typoGrid.find(".rand-btn-pill").each(function() {
                        var $btn = $(this);
                        if ($btn.attr("data-typo-id") === cur.id) {
                            $btn.css({ borderColor: "#38bdf8", color: "#38bdf8", fontWeight: "700", background: "rgba(56,189,248,0.14)" });
                        } else {
                            $btn.css({ borderColor: "rgba(255,255,255,0.12)", color: "#cbd5e1", fontWeight: "normal", background: "transparent" });
                        }
                    });
                }
            };

            var $btnRandTypo = $("<BUTTON>").addClass("rand-btn-pill").css({
                background: "linear-gradient(135deg, #1e3a5f, #0f2744)",
                borderColor: "#38bdf8",
                color: "#e0f2fe",
                fontWeight: "600",
                padding: "4px 10px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: "0"
            }).html(n("random.btnRandTypo") || "🎲 Randomize Typography").click(function() {
                var res = r.randomizeTypography();
                updateTypoBadge();
                var $toast = $(".global-copy-toast");
                if (!$toast.length) $toast = $("<div>").addClass("global-copy-toast").appendTo("body");
                $toast.html("&#9998; Typography: <b>" + (res ? res.name : "Pairing") + "</b>").addClass("show");
                setTimeout(function() { $toast.removeClass("show"); }, 2000);
            });

            $typoHeader.append($typoCurrentBadge).append($btnRandTypo);
            $typoBox.append($typoHeader);

            var pairs = pal.getTypographyPairs ? pal.getTypographyPairs() : [];
            pairs.forEach(function(pair) {
                var $pBtn = $("<BUTTON>").addClass("rand-btn-pill compact").attr("data-typo-id", pair.id).text(pair.name).css({
                    fontSize: "10px",
                    padding: "4px 6px"
                }).click(function() {
                    r.setTypography(pair.id);
                    updateTypoBadge();
                    var $toast = $(".global-copy-toast");
                    if (!$toast.length) $toast = $("<div>").addClass("global-copy-toast").appendTo("body");
                    $toast.html("&#9998; Typography: <b>" + pair.name + "</b>").addClass("show");
                    setTimeout(function() { $toast.removeClass("show"); }, 2000);
                });
                $typoGrid.append($pBtn);
            });
            $typoBox.append($typoGrid);
            e.append($typoBox);

            updateTypoBadge();

            // Classic random 4 buttons (compact)
            $("<DIV>").addClass("rand-section-title").text("Classic Randomizer").appendTo(e);
            var $classic = $("<DIV>").css({ overflow: "hidden", marginBottom: "6px" });
            var tBtn;
            tBtn = $("<BUTTON>").addClass("btn-0-1").text(n("random.btn01")).click(function() { return r.randomize(0, 1) });
            $classic.append(tBtn);
            tBtn = $("<BUTTON>").addClass("btn-1-1").text(n("random.btn11")).click(function() { return r.randomize(1, 1) });
            $classic.append(tBtn);
            tBtn = $("<BUTTON>").addClass("btn-0-0").text(n("random.btn00")).click(function() { return r.randomize(0, 0) });
            $classic.append(tBtn);
            tBtn = $("<BUTTON>").addClass("btn-1-0").text(n("random.btn10")).click(function() { return r.randomize(1, 0) });
            $classic.append(tBtn);
            e.append($classic);

            // Space shortcut hint
            $("<DIV>").css({
                clear: "both",
                padding: "6px 0 2px",
                fontSize: "10px",
                color: "#888",
                textAlign: "center"
            }).text("Tip: Press Spacebar for instant quick randomize").appendTo(e);

            this.dlg = new i(this.$parent, e, {
                className: "dlg-random",
                title: n("random.title") || "Color Engine & Presets",
                modal: !1,
                width: 360,
                height: 580,
                destroyOnClose: !0,
                position: {
                    my: r.options.positionMy,
                    at: r.options.positionAt,
                    of: r.options.positionOf || r.$button
                }
            });
        }, r.prototype.openFavoritesDlg = function() {
            var r = this, pal = this.palette;
            var $c = $("<div>").addClass("dlg-favs-container").css({
                padding: "8px",
                maxHeight: "380px",
                overflowY: "auto",
                fontFamily: "sans-serif"
            });

            var renderList = function() {
                $c.empty();
                var currentFavs = pal.getFavorites();
                if (!currentFavs || currentFavs.length === 0) {
                    $("<div>").css({
                        padding: "30px 10px",
                        textAlign: "center",
                        color: "#888",
                        fontSize: "12px",
                        lineHeight: "1.5"
                    }).html(n("random.favEmpty") || "No saved palettes yet.").appendTo($c);
                    return;
                }

                currentFavs.forEach(function(item) {
                    var $item = $("<div>").addClass("rand-fav-item").css({
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px 10px",
                        margin: "0 0 8px 0",
                        background: "#182836",
                        border: "1px solid #233e54",
                        borderRadius: "5px"
                    });

                    // Swatches
                    var $swatches = $("<div>").css({
                        display: "flex",
                        gap: "4px",
                        marginRight: "10px"
                    });
                    if (item.hexes && item.hexes.length) {
                        item.hexes.forEach(function(h) {
                            $("<div>").css({
                                width: "22px",
                                height: "22px",
                                background: "#" + h.replace(/^#/, ""),
                                borderRadius: "3px",
                                border: "1px solid rgba(0,0,0,0.25)"
                            }).attr("title", "#" + h.replace(/^#/, "")).appendTo($swatches);
                        });
                    }
                    $item.append($swatches);

                    // Info
                    var $info = $("<div>").css({ flex: "1", fontSize: "11px", color: "#e0e0e0" });
                    $("<div>").css({ fontWeight: "bold", color: "#61b5ff" }).text(item.name || "Palette").appendTo($info);
                    $("<div>").css({ fontSize: "10px", color: "#888" }).text((item.model || "").toUpperCase() + " • " + item.hue + "°").appendTo($info);
                    $item.append($info);

                    // Actions
                    var $btns = $("<div>").css({ display: "flex", gap: "6px" });
                    $("<button>").css({
                        background: "#0d6efd",
                        color: "#fff",
                        border: "none",
                        borderRadius: "3px",
                        padding: "4px 9px",
                        fontSize: "11px",
                        cursor: "pointer",
                        fontWeight: "600"
                    }).text(n("random.favApply") || "Load").click(function() {
                        window.location.hash = "#uid=" + item.uid;
                        events.trigger("randomizer/changed");
                        var $toast = $(".global-copy-toast");
                        if (!$toast.length) $toast = $("<div>").addClass("global-copy-toast").appendTo("body");
                        $toast.html("&#10003; " + (item.name || "Palette") + " loaded!").addClass("show");
                        setTimeout(function() { $toast.removeClass("show"); }, 2000);
                    }).appendTo($btns);

                    $("<button>").css({
                        background: "#34222a",
                        color: "#ff8da1",
                        border: "1px solid #5a2e3b",
                        borderRadius: "3px",
                        padding: "4px 8px",
                        fontSize: "11px",
                        cursor: "pointer"
                    }).html("&times;").attr("title", n("random.favDelete") || "Delete").click(function() {
                        pal.removeFavorite(item.uid);
                        renderList();
                    }).appendTo($btns);

                    $item.append($btns);
                    $c.append($item);
                });
            };

            renderList();

            new i(this.$parent, $c, {
                className: "dlg-favorites",
                title: n("random.favTitle") || "Favorite Palettes",
                modal: !1,
                width: 360,
                height: 380,
                destroyOnClose: !0,
                position: {
                    my: "center top",
                    at: "center top+50",
                    of: window
                }
            });
        }, r.prototype.close = function() {
            var e;
            return (e = this.dlg) != null ? e.close() : void 0
        }, r.prototype.randomize = function(n, r) {
            var i, o, u, a;
            return u = r ? s.rndBool() : !1, o = n ? 1 : .05, i = n ? 1 : .25, a = r ? 1 : .15, this.palette.randomize(u, o, i, a), t.trigger("randomizer/changed"), t.trigger("ga/event", {
                key: e.GA.event.randomize,
                value: "" + n + r
            })
        }, r.prototype.randomizeWCAG = function(n) {
            return this.palette.randomizeWCAG(n), t.trigger("randomizer/changed"), t.trigger("ga/event", {
                key: e.GA.event.randomize,
                value: "wcag-" + n
            })
        }, r.prototype.randomizeProfile = function(p) {
            return this.palette.randomizeProfile(p), t.trigger("randomizer/changed"), t.trigger("ga/event", {
                key: e.GA.event.randomize,
                value: "profile-" + p
            })
        }, r.prototype.randomizeKeepMood = function() {
            return this.palette.randomizeKeepMood(), t.trigger("randomizer/changed"), t.trigger("ga/event", {
                key: e.GA.event.randomize,
                value: "keep-mood"
            })
        }, r.prototype.randomizeVariations = function() {
            return this.palette.randomizeVariations(), t.trigger("randomizer/changed"), t.trigger("ga/event", {
                key: e.GA.event.randomize,
                value: "variations"
            })
        }, r.prototype.randomizeMood = function(m) {
            return this.palette.randomizeMood(m), t.trigger("randomizer/changed"), t.trigger("ga/event", {
                key: e.GA.event.randomize,
                value: "mood-" + m
            })
        }, r.prototype.generateMode = function(m) {
            return this.palette.generateMode(m), t.trigger("randomizer/changed"), t.trigger("ga/event", {
                key: e.GA.event.randomize,
                value: "genmode-" + m
            })
        }, r.prototype.regeneratePrimary = function() {
            return this.palette.regeneratePrimary(), t.trigger("randomizer/changed"), t.trigger("ga/event", {
                key: e.GA.event.randomize,
                value: "regen-pri"
            })
        }, r.prototype.regenerateSecondary = function() {
            return this.palette.regenerateSecondary(), t.trigger("randomizer/changed"), t.trigger("ga/event", {
                key: e.GA.event.randomize,
                value: "regen-sec"
            })
        }, r.prototype.setHarmonyMode = function(h) {
            return this.palette.generateMode(h), t.trigger("randomizer/changed"), t.trigger("ga/event", {
                key: e.GA.event.randomize,
                value: "harmony-" + h
            })
        }, r.prototype.fixContrast = function(targetRatio) {
            var res = this.palette.fixContrast(targetRatio);
            t.trigger("randomizer/changed");
            var $toast = $(".global-copy-toast");
            if (!$toast.length) $toast = $("<div>").addClass("global-copy-toast").appendTo("body");
            $toast.html("&#10003; Contrast adjusted: <b>" + (res ? res.priBgRatio : targetRatio) + ":1</b>").addClass("show");
            setTimeout(function() { $toast.removeClass("show"); }, 2500);
            return res;
        }, r.prototype.randomizeTypography = function(type) {
            var res = this.palette.randomizeTypography(type);
            t.trigger("randomizer/changed");
            t.trigger("ga/event", {
                key: e.GA.event.randomize,
                value: "typo-" + (res ? res.id : "")
            });
            return res;
        }, r.prototype.setTypography = function(id) {
            var res = this.palette.setTypography(id);
            t.trigger("randomizer/changed");
            t.trigger("ga/event", {
                key: e.GA.event.randomize,
                value: "typo-set-" + (res ? res.id : "")
            });
            return res;
        }, r
    }(), o
});
