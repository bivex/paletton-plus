define("color.palette.class", ["app.ini", "app.events", "app.locale", "util", "color.wheel", "color.presets", "color.class", "color.models.class", "color.rgb.class", "color.hsv.class", "color.variator1.class", "color.convert", "ui.control.paletteimg.class", "color.oklch"], function(e, t, n, r, i, s, o, u, a, f, l, c, h, oklch) {
    var p, d, v, m;
    return m = {
        mono: 1,
        monocompl: 2,
        triad: 3,
        triadcompl: 4,
        analog: 5,
        analogcompl: 6,
        tetrad: 7,
        free: 10
    }, v = function(e) {
        var t, n;
        for (t in m) {
            n = m[t];
            if (n === e) return t
        }
        return "mono"
    }, d = {
        model: "mono",
        hue: 0,
        angle: 30,
        preset: "pastels"
    }, p = function() {
        function i(e, n, r, i) {
            var s;
            this.hue = n, this.angle = r, this.hidden = i, this.uid = "", this.inited = !1, this.lock(), this.col = {}, this.col.pri = new o(this.hue), this.setModel(e), this.preset = "null", this.vars = new l(this, "default"), this.varsMulti = {
                pri: new l(this, "default"),
                compl: new l(this, "default"),
                sec1: new l(this, "default"),
                sec2: new l(this, "default")
            }, this.varsMultiOn = !1, this.lockedColors = {
                pri: !1,
                sec: !1,
                compl: !1
            }, this.converter = {
                on: !1,
                type: "none",
                amount: 1
            }, this.inited = !0, this.unlock(), this.modelChanged(), this.colorChanged(), s = this, this.hidden || (t.register("history/changed", function(e, t) {
                return s.loadPalette(t.data)
            }), t.register("palette/load", function(e, t) {
                return s.loadPalette(t)
            }), t.register("palette/reset", function() {
                return s.loadPalette(null)
            }), t.register("palette/colors/update", function() {
                return s.colorChanged()
            }), t.register("palette/model/free", function(e, t) {
                return s.setModelFree(t.id)
            }), t.register("drag/start", function() {
                return s.lock()
            }), t.register("drag/stop", function() {
                return s.unlock(), s.storePalette()
            }), t.register("palette/set/base", function(e, t) {
                return s.setBase(t.color)
            }), t.register("palette/switchvars/same", function() {
                return s.switchVars(!1)
            }), t.register("palette/switchvars/multi", function() {
                return s.switchVars(!0)
            }), t.register("palette/switchvars/active", function(e, t) {
                return s.setVarsActive(t.colId)
            }), t.register("palette/adjust/hue", function(e, t) {
                return s.addHue(t.val), s.storePalette()
            }), t.register("palette/adjust/saturation", function(e, t) {
                return s.addSaturation(t.val), s.storePalette()
            }), t.register("palette/adjust/bright", function(e, t) {
                return s.addBright(t.val), s.storePalette()
            }), t.register("palette/adjust/contrast", function(e, t) {
                return s.addContrast(t.val), s.storePalette()
            }), t.register("palette/swapsecs", function() {
                return s.swapSecs()
            }), t.register("palette/colorize", function(e, t) {
                return s.colorize(t.$e, t.sorted, t.converted)
            }), t.register("convert/set", function(e, t) {
                return s.setConverter(t.data)
            }), t.register("export/html", function() {
                return s["export"]("html")
            }), t.register("export/css", function() {
                return s["export"]("css")
            }), t.register("export/oklch", function() {
                return s["export"]("oklch")
            }), t.register("export/tailwind", function() {
                return s["export"]("tailwind")
            }), t.register("export/dtcg", function() {
                return s["export"]("dtcg")
            }), t.register("export/figma", function() {
                return s["export"]("figma")
            }), t.register("export/svg", function() {
                return s["export"]("svg")
            }), t.register("export/less", function() {
                return s["export"]("less")
            }), t.register("export/sass", function() {
                return s["export"]("sass")
            }), t.register("export/xml", function() {
                return s["export"]("xml")
            }), t.register("export/text", function() {
                return s["export"]("txt")
            }), t.register("export/aco", function() {
                return s["export"]("aco")
            }), t.register("export/gpl", function() {
                return s["export"]("gpl")
            }), t.register("export/sketch", function() {
                return s["export"]("sketch")
            }), t.register("export/png", function() {
                return s.exportImg()
            }))
        }
        return i.prototype.modelChanged = function() {
            if (!this.hidden) return t.trigger("palette/model/changed")
        }, i.prototype.colorChanged = function() {
            this.calcColorTable();
            if (!this.hidden) return t.trigger("palette/colors/changed"), this.storePalette()
        }, i.prototype.varsChanged = function() {
            this.calcColorTable();
            if (!this.hidden) return t.trigger("palette/colors/changed"), this.storePalette()
        }, i.prototype.setModel = function(e, t) {
            this.modelID = e, this.model = u[e], t && !this.model.swapped && this.model.swapSecs(), this.hueCompl = this.model.getComplement(this.hue), this.hueCompl != null ? this.col.compl = new o(this.hueCompl) : this.col.compl = null, this.hueSec1 = this.model.getSec1(this.hue, this.angle), this.hueSec1 != null ? this.col.sec1 = new o(this.hueSec1) : this.col.sec1 = null, this.hueSec2 = this.model.getSec2(this.hue, this.angle), this.hueSec2 != null ? this.col.sec2 = new o(this.hueSec2) : this.col.sec2 = null, this.hueCnt = 1, this.hasCompl() && this.hueCnt++, this.hasSecs() && (this.hueCnt += 2), this.hueCnt === 1 && (this.varsMultiOn = !1), this.varsMultiOn && (!this.hasCompl() && this.varsActive === "compl" || !this.hasSecs() && (this.varsActive === "sec1" || this.varsActive === "sec2")) && this.setVarsActive("pri"), this.inited && this.modelChanged();
            if (this.inited) return this.colorChanged()
        }, i.prototype.setModelFree = function(e) {
            this.modelID = "free", this.model = null;
            if (!e || e < 2 || e > 4) e = 2;
            this.hueCnt = e, e === 2 && (this.hueSec1 = this.hueSec2 = this.col.sec1 = this.col.sec2 = null), e === 3 && (this.hueCompl = this.col.compl = null);
            if (e === 2 || e === 4) this.hueCompl == null && (this.hueCompl = r.angleNorm(this.hue + 180)), this.col.compl = new o(this.hueCompl);
            e >= 3 && (this.hueSec1 == null && (this.hueSec1 = r.angleNorm(this.hue + 30)), this.col.sec1 = new o(this.hueSec1), this.hueSec2 == null && (this.hueSec2 = r.angleNorm(this.hue - 30)), this.col.sec2 = new o(this.hueSec2)), this.locked || this.modelChanged();
            if (this.inited) return this.colorChanged()
        }, i.prototype.setHue = function(e, t) {
            var n;
            return n = e - this.hue, this.isModelFree() && !t ? this.addHueAll(n) : (this.hue = r.angleNorm(e), this.col.pri.setHue(Math.round(this.hue)), this.updateCompl(), this.updateSecs(), this.colorChanged())
        }, i.prototype.addHue = function(e) {
            return this.setHue(this.hue + e)
        }, i.prototype.addHueAll = function(e) {
            return this.hue = r.angleNorm(this.hue + e), this.col.pri.setHue(Math.round(this.hue)), this.hasCompl() && (this.hueCompl = r.angleNorm(this.hueCompl + e), this.updateCompl()), this.hasSecs() && (this.hueSec1 = r.angleNorm(this.hueSec1 + e), this.hueSec2 = r.angleNorm(this.hueSec2 + e), this.updateSecs()), this.colorChanged()
        }, i.prototype.setHueCompl = function(e, t) {
            var n;
            return this.isModelFree() ? t ? (this.hueCompl = r.angleNorm(e), this.updateCompl(), this.colorChanged()) : (n = e - this.hueCompl, this.addHueAll(n)) : this.setHue(this.model.getComplement(e))
        }, i.prototype.setHueSec = function(e, t, n) {
            var i, s, o;
            return this.isModelFree() ? n ? (o = r.angleNorm(e), t === 1 ? this.hueSec1 = o : this.hueSec2 = o, this.updateSecs(), this.colorChanged()) : (s = e - (t === 1 ? this.hueSec1 : this.hueSec2), this.addHueAll(s)) : (i = r.angleDiff(e, this.hue), i = this.model.getAngle(i), this.setAngle(i))
        }, i.prototype.setAngle = function(e) {
            var t;
            this.angle = r.angleNorm(e);
            if (this.angle > 90) {
                t = "", this.modelID === "analog" ? t = "triad" : this.modelID === "triad" ? t = "analog" : this.modelID === "analogcompl" ? t = "triadcompl" : this.modelID === "triadcompl" && (t = "analogcompl");
                if (t) {
                    this.angle = 180 - this.angle, this.setModel(t, !this.model.swapped);
                    return
                }
            }
            return this.updateSecs(), this.colorChanged()
        }, i.prototype.swapSecs = function(e) {
            if (this.model) return this.model.swapSecs(), this.updateSecs(), this.colorChanged()
        }, i.prototype.setPreset = function(e) {
            return this.preset = e, this.vars.setPreset(e)
        }, i.prototype.switchVars = function(e) {
            if (this.varsMultiOn === !!e) return;
            return e && (this.hasCompl() || this.hasSecs()) ? (this.varsMultiOn = !0, this.varsMulti.pri.setVals(this.vars.getVals()), this.varsMulti.compl.setVals(this.vars.getVals()), this.varsMulti.sec1.setVals(this.vars.getVals()), this.varsMulti.sec2.setVals(this.vars.getVals()), this.setVarsActive("pri")) : this.varsMultiOn = !1, this.colorChanged()
        }, i.prototype.setVarsActive = function(e) {
            if (!this.varsMultiOn) return;
            return this.varsActive = e, this.vars = this.varsMulti[e], this.colorChanged()
        }, i.prototype.setVars = function(e) {
            return this.vars.setVals(e)
        }, i.prototype.addSaturation = function(e) {
            if (!this.varsMultiOn) return this.vars.addSaturation(e);
            this.varsMulti.pri.addSaturation(e), this.hasCompl() && this.varsMulti.compl.addSaturation(e);
            if (this.hasSecs()) return this.varsMulti.sec1.addSaturation(e), this.varsMulti.sec2.addSaturation(e)
        }, i.prototype.addBright = function(e) {
            if (!this.varsMultiOn) return this.vars.addBright(e);
            this.varsMulti.pri.addBright(e), this.hasCompl() && this.varsMulti.compl.addBright(e);
            if (this.hasSecs()) return this.varsMulti.sec1.addBright(e), this.varsMulti.sec2.addBright(e)
        }, i.prototype.addContrast = function(e) {
            if (!this.varsMultiOn) return this.vars.addContrast(e);
            this.varsMulti.pri.addContrast(e), this.hasCompl() && this.varsMulti.compl.addContrast(e);
            if (this.hasSecs()) return this.varsMulti.sec1.addContrast(e), this.varsMulti.sec2.addContrast(e)
        }, i.prototype.setBase = function(e) {
            return this.locked = !0, this.setHue(e.hsv.h), this.vars.setMainVal([e.kS, e.kV]), this.locked = !1, this.colorChanged()
        }, i.prototype.setByCssColor = function(str) {
            var p = oklch.parseCssColor(str);
            if (!p) return !1;
            var rgb = new a(p.r, p.g, p.b), col = new o(0);
            return col.setByRGB(rgb), this.setBase(col)
        }, i.prototype.setByHex = function(e) {
            var p = oklch.parseCssColor(e);
            if (p) {
                var rgb = new a(p.r, p.g, p.b), col = new o(0);
                return col.setByRGB(rgb), this.setBase(col)
            }
            var t, n;
            return n = new a(0, 0, 0), n.setByHex(e), t = new o(0), t.setByRGB(n), this.setBase(t)
        }, i.prototype.setConverter = function(e) {
            return e.type ? this.converter = {
                on: !0,
                type: e.type,
                amount: e.amount
            } : this.converter.on = !1, this.colorChanged()
        }, i.prototype.isModelFree = function() {
            return this.modelID === "free"
        }, i.prototype.hasCompl = function() {
            return this.hueCompl != null
        }, i.prototype.hasSecs = function() {
            return this.hueSec1 != null
        }, i.prototype.getVar = function(e, t) {
            return this.varsMultiOn ? this.varsMulti[t].getVal(e) : this.vars.getVal(e)
        }, i.prototype.getVars = function() {
            return this.vars.getVals()
        }, i.prototype.getHueActive = function() {
            if (!this.varsMultiOn) return this.hue;
            switch (this.varsActive) {
                case "pri":
                    return this.hue;
                case "compl":
                    return this.hueCompl;
                case "sec1":
                    return this.hueSec1;
                case "sec2":
                    return this.hueSec2
            }
        }, i.prototype.getColCnt = function() {
            var e;
            return e = 1, this.hasCompl() && (e = 2), this.hasSecs() && (e += 2), e
        }, i.prototype.updateCompl = function() {
            if (this.col.compl) {
                this.isModelFree() || (this.hueCompl = this.model.getComplement(this.hue));
                if (this.hueCompl != null) return this.col.compl.setHue(Math.round(this.hueCompl))
            }
        }, i.prototype.updateSecs = function() {
            this.col.sec1 && (this.isModelFree() || (this.hueSec1 = this.model.getSec1(this.hue, this.angle)), this.hueSec1 != null && this.col.sec1.setHue(Math.round(this.hueSec1)));
            if (this.col.sec2) {
                this.isModelFree() || (this.hueSec2 = this.model.getSec2(this.hue, this.angle));
                if (this.hueSec2 != null) return this.col.sec2.setHue(Math.round(this.hueSec2))
            }
        }, i.prototype.lock = function() {
            return this.locked = !0
        }, i.prototype.unlock = function() {
            return this.locked = !1
        }, i.prototype.storePalette = function() {
            if (this.hidden || this.locked) return;
            this.uid = this.getSerialized();
            this.recordHistory();
            return t.trigger("history/setstate", {
                uid: this.uid
            }), t.trigger("palette/uid/changed", {
                uid: this.uid
            })
        }, i.prototype.loadPalette = function(e) {
            var t;
            this.locked = !0;
            if (e && e.uid && e.uid !== -1) {
                if (e.uid === this.uid) return this.locked = !1, 0;
                t = this.setSerialized(e.uid);
                if (!t) {
                    this.loadPalette(null);
                    return
                }
                this.uid = this.getSerialized()
            } else this.setModel(d.model), this.setHue(d.hue), this.setAngle(d.angle), this.setPreset(d.preset);
            return this.locked = !1, this.modelChanged(), this.colorChanged()
        }, i.prototype.toggleColorLock = function(k) {
            return this.lockedColors[k] = !this.lockedColors[k], this.lockedColors[k]
        }, i.prototype.isColorLocked = function(k) {
            return !!this.lockedColors[k]
        }, i.prototype.recordHistory = function() {
            if (!this.uid || this.uid === -1) return;
            try {
                var hist = JSON.parse(localStorage.getItem("pal_history") || "[]");
                if (hist.length > 0 && hist[0].uid === this.uid) return;
                var hexes = [];
                var groups = ["pri"];
                if (this.hasSecs()) groups.push("sec1", "sec2");
                if (this.hasCompl()) groups.push("compl");
                for (var g = 0; g < groups.length; g++) {
                    var hex = this.getColorCode(groups[g], 0);
                    if (hex) hexes.push(hex.startsWith("#") ? hex : ("#" + hex));
                }
                hist.unshift({
                    uid: this.uid,
                    model: this.modelID,
                    hue: Math.round(this.hue),
                    hexes: hexes,
                    timestamp: Date.now()
                });
                localStorage.setItem("pal_history", JSON.stringify(hist.slice(0, 30)));
            } catch (err) {}
        }, i.prototype.getFavorites = function() {
            try {
                var favs = localStorage.getItem("pal_favorites");
                return favs ? JSON.parse(favs) : [];
            } catch (err) {
                return [];
            }
        }, i.prototype.saveFavorite = function(name) {
            try {
                var favs = this.getFavorites();
                var uid = this.uid;
                var exists = false;
                for (var idx = 0; idx < favs.length; idx++) {
                    if (favs[idx].uid === uid) {
                        exists = true;
                        break;
                    }
                }
                if (!exists) {
                    var hexes = [];
                    var groups = ["pri"];
                    if (this.hasSecs()) groups.push("sec1", "sec2");
                    if (this.hasCompl()) groups.push("compl");
                    for (var g = 0; g < groups.length; g++) {
                        var hex = this.getColorCode(groups[g], 0);
                        if (hex) hexes.push(hex.startsWith("#") ? hex : ("#" + hex));
                    }
                    favs.unshift({
                        uid: uid,
                        name: name || ("Palette " + (favs.length + 1)),
                        model: this.modelID,
                        hue: Math.round(this.hue),
                        hexes: hexes,
                        timestamp: Date.now()
                    });
                    localStorage.setItem("pal_favorites", JSON.stringify(favs.slice(0, 50)));
                }
                return true;
            } catch (err) {
                return false;
            }
        }, i.prototype.removeFavorite = function(uid) {
            try {
                var favs = this.getFavorites();
                var next = [];
                for (var idx = 0; idx < favs.length; idx++) {
                    if (favs[idx].uid !== uid) next.push(favs[idx]);
                }
                localStorage.setItem("pal_favorites", JSON.stringify(next));
                return true;
            } catch (err) {
                return false;
            }
        }, i.prototype.isFavorite = function() {
            var favs = this.getFavorites();
            for (var idx = 0; idx < favs.length; idx++) {
                if (favs[idx].uid === this.uid) return true;
            }
            return false;
        }, i.prototype.getContrastReport = function() {
            var cTable = this.colorTable && this.colorTable.byPalette && this.colorTable.byPalette.pri;
            if (!cTable || cTable.length < 5) return null;
            var baseRgb = cTable[0] ? cTable[0].rgb : null;
            var lightBgRgb = cTable[4] ? cTable[4].rgb : null;
            var darkTextRgb = cTable[3] ? cTable[3].rgb : null;
            if (!baseRgb || !lightBgRgb || !darkTextRgb) return null;
            var textBgRatio = oklch.calcWcagContrast(darkTextRgb, lightBgRgb);
            var priBgRatio = oklch.calcWcagContrast(baseRgb, lightBgRgb);
            var apcaText = oklch.calcAPCA ? oklch.calcAPCA(darkTextRgb, lightBgRgb) : 0;
            var apcaPri = oklch.calcAPCA ? oklch.calcAPCA(baseRgb, lightBgRgb) : 0;
            return {
                textBgRatio: textBgRatio,
                priBgRatio: priBgRatio,
                apcaText: apcaText,
                apcaPri: apcaPri,
                passesAA: priBgRatio >= 4.5 || textBgRatio >= 4.5,
                passesAAA: textBgRatio >= 7.0
            };
        }, i.prototype.fixContrast = function(targetRatio) {
            targetRatio = targetRatio || 4.5;
            this.locked = true;
            var vals = this.vars.getVals();
            // Shade 4: light background
            vals[4][0] = Math.min(vals[4][0], 0.05);
            vals[4][1] = 0.99;
            // Shade 1: light surface
            vals[1][0] = Math.min(vals[1][0], 0.12);
            vals[1][1] = 0.95;
            // Shade 3: dark text
            vals[3][0] = Math.max(vals[3][0], 0.70);
            vals[3][1] = targetRatio >= 7.0 ? 0.08 : 0.14;

            // Shade 0: Base primary accent - ensure target ratio against light background
            var baseSat = vals[0][0];
            var baseVal = vals[0][1];
            var h = this.hue;
            var bgRgb = { r: 250, g: 250, b: 250 };
            var colObj = new o(h);
            colObj.setSV(baseSat, baseVal);
            var testRgb = colObj.rgb;
            var ratio = oklch.calcWcagContrast(testRgb, bgRgb);
            if (ratio < targetRatio) {
                while (baseVal > 0.20 && ratio < targetRatio) {
                    baseVal -= 0.03;
                    colObj.setSV(baseSat, baseVal);
                    testRgb = colObj.rgb;
                    ratio = oklch.calcWcagContrast(testRgb, bgRgb);
                }
                vals[0][1] = Math.round(baseVal * 100) / 100;
            }

            if (this.varsMultiOn) {
                if (!this.lockedColors.pri) this.varsMulti.pri.setVals(vals);
                if (!this.lockedColors.compl && this.hasCompl()) this.varsMulti.compl.setVals(vals);
                if (!this.lockedColors.sec && this.hasSecs()) {
                    this.varsMulti.sec1.setVals(vals);
                    this.varsMulti.sec2.setVals(vals);
                }
                this.varsActive = "pri";
                this.vars = this.varsMulti.pri;
            } else {
                this.vars.setVals(vals);
            }
            this.locked = false;
            this.modelChanged();
            this.colorChanged();
            return this.getContrastReport();
        }, i.prototype.randomizeProfile = function(profile) {
            this.locked = true;
            if (!this.lockedColors.pri) {
                var hue = 0;
                if (profile === "saas") {
                    var techHues = [205, 215, 225, 235, 255, 275, 160, 180];
                    hue = techHues[Math.floor(Math.random() * techHues.length)] + (Math.random() * 16 - 8);
                } else if (profile === "minimal") {
                    var swissHues = [358, 2, 218, 38, 205];
                    hue = swissHues[Math.floor(Math.random() * swissHues.length)] + (Math.random() * 8 - 4);
                } else if (profile === "nature") {
                    var natHues = [138, 148, 158, 32, 44, 75];
                    hue = natHues[Math.floor(Math.random() * natHues.length)] + (Math.random() * 10 - 5);
                } else if (profile === "luxury") {
                    var luxHues = [42, 46, 350, 215];
                    hue = luxHues[Math.floor(Math.random() * luxHues.length)] + (Math.random() * 8 - 4);
                } else if (profile === "playful") {
                    var playHues = [45, 175, 280, 345];
                    hue = playHues[Math.floor(Math.random() * playHues.length)] + (Math.random() * 12 - 6);
                } else if (profile === "pastel") {
                    var pastHues = [195, 265, 335, 145];
                    hue = pastHues[Math.floor(Math.random() * pastHues.length)] + (Math.random() * 14 - 7);
                } else if (profile === "monochrome") {
                    hue = Math.floor(Math.random() * 360);
                } else if (profile === "cyberpunk") {
                    var cyberHues = [188, 322, 118];
                    hue = cyberHues[Math.floor(Math.random() * cyberHues.length)] + (Math.random() * 10 - 5);
                } else if (profile === "earth") {
                    var earthHues = [20, 36, 58, 80];
                    hue = earthHues[Math.floor(Math.random() * earthHues.length)] + (Math.random() * 10 - 5);
                } else if (profile === "ocean") {
                    var oceanHues = [175, 192, 215, 232];
                    hue = oceanHues[Math.floor(Math.random() * oceanHues.length)] + (Math.random() * 10 - 5);
                } else if (profile === "sunset") {
                    var sunHues = [18, 32, 45, 310, 330];
                    hue = sunHues[Math.floor(Math.random() * sunHues.length)] + (Math.random() * 10 - 5);
                } else if (profile === "neutral_accent") {
                    hue = Math.floor(Math.random() * 360);
                } else if (profile === "editorial") {
                    var editHues = [18, 30, 44, 145, 175, 348];
                    hue = editHues[Math.floor(Math.random() * editHues.length)] + (Math.random() * 14 - 7);
                } else if (profile === "retro") {
                    var retroHues = [26, 42, 78, 98, 178, 196];
                    hue = retroHues[Math.floor(Math.random() * retroHues.length)] + (Math.random() * 16 - 8);
                } else if (profile === "darkui") {
                    var darkHues = [182, 198, 268, 282, 318];
                    hue = darkHues[Math.floor(Math.random() * darkHues.length)] + (Math.random() * 16 - 8);
                } else {
                    hue = Math.floor(Math.random() * 360);
                }
                this.setHue((Math.round(hue) + 360) % 360);
            }

            if (!this.lockedColors.sec) {
                var models = ["triad", "tetrad", "analogcompl", "monocompl", "analog", "mono"];
                if (profile === "saas") models = ["analogcompl", "monocompl", "triad"];
                else if (profile === "minimal") models = ["mono", "monocompl"];
                else if (profile === "monochrome") models = ["mono"];
                else if (profile === "nature") models = ["analogcompl", "analog", "triad"];
                else if (profile === "luxury") models = ["monocompl", "triadcompl"];
                else if (profile === "playful") models = ["triad", "tetrad"];
                else if (profile === "pastel") models = ["triad", "analogcompl", "mono"];
                else if (profile === "cyberpunk") models = ["triad", "analogcompl"];
                else if (profile === "earth") models = ["analogcompl", "triad"];
                else if (profile === "ocean") models = ["analog", "analogcompl"];
                else if (profile === "sunset") models = ["analogcompl", "triad"];
                else if (profile === "neutral_accent") models = ["monocompl"];
                else if (profile === "editorial") models = ["analogcompl", "triad"];
                else if (profile === "retro") models = ["triad", "tetrad"];
                else if (profile === "darkui") models = ["monocompl", "analogcompl", "triadcompl"];
                this.setModel(models[Math.floor(Math.random() * models.length)]);
                if (this.hasSecs()) {
                    var angle = profile === "saas" || profile === "minimal" ? 30 : Math.floor(25 + Math.random() * 38);
                    this.setAngle(angle);
                }
            }

            var vals;
            if (profile === "saas") {
                vals = [[0.78, 0.95], [0.15, 0.98], [0.65, 0.60], [0.85, 0.22], [0.06, 0.99]];
            } else if (profile === "minimal") {
                vals = [[0.92, 0.88], [0.04, 0.98], [0.12, 0.88], [0.85, 0.32], [0.06, 0.14]];
            } else if (profile === "nature") {
                vals = [[0.52, 0.68], [0.22, 0.92], [0.58, 0.52], [0.68, 0.28], [0.14, 0.96]];
            } else if (profile === "luxury") {
                vals = [[0.72, 0.86], [0.10, 0.96], [0.80, 0.42], [0.88, 0.16], [0.04, 0.99]];
            } else if (profile === "playful") {
                vals = [[0.88, 0.96], [0.35, 0.96], [0.78, 0.72], [0.92, 0.45], [0.12, 0.99]];
            } else if (profile === "pastel") {
                vals = [[0.30, 0.94], [0.12, 0.98], [0.38, 0.84], [0.46, 0.62], [0.08, 0.99]];
            } else if (profile === "monochrome") {
                vals = [[0.70, 0.65], [0.18, 0.96], [0.45, 0.82], [0.82, 0.36], [0.94, 0.12]];
            } else if (profile === "cyberpunk") {
                vals = [[0.96, 0.98], [0.75, 0.92], [0.88, 0.50], [0.98, 0.10], [0.04, 0.99]];
            } else if (profile === "earth") {
                vals = [[0.62, 0.62], [0.22, 0.90], [0.68, 0.46], [0.76, 0.25], [0.14, 0.95]];
            } else if (profile === "ocean") {
                vals = [[0.78, 0.84], [0.20, 0.94], [0.68, 0.52], [0.88, 0.22], [0.06, 0.98]];
            } else if (profile === "sunset") {
                vals = [[0.84, 0.92], [0.26, 0.96], [0.75, 0.58], [0.88, 0.25], [0.08, 0.98]];
            } else if (profile === "neutral_accent") {
                vals = [[0.85, 0.90], [0.05, 0.96], [0.12, 0.75], [0.20, 0.25], [0.04, 0.99]];
            } else if (profile === "editorial") {
                vals = [[0.68, 0.72], [0.25, 0.92], [0.72, 0.48], [0.82, 0.28], [0.12, 0.96]];
            } else if (profile === "retro") {
                vals = [[0.58, 0.80], [0.30, 0.88], [0.62, 0.55], [0.70, 0.35], [0.20, 0.94]];
            } else if (profile === "darkui") {
                vals = [[0.85, 0.98], [0.70, 0.85], [0.60, 0.45], [0.95, 0.12], [0.05, 0.99]];
            }

            if (vals) {
                if (this.varsMultiOn) {
                    if (!this.lockedColors.pri) this.varsMulti.pri.setVals(vals);
                    if (!this.lockedColors.compl && this.hasCompl()) this.varsMulti.compl.setVals(vals);
                    if (!this.lockedColors.sec && this.hasSecs()) {
                        this.varsMulti.sec1.setVals(vals);
                        this.varsMulti.sec2.setVals(vals);
                    }
                    this.varsActive = "pri";
                    this.vars = this.varsMulti.pri;
                } else {
                    this.vars.setVals(vals);
                }
            }

            this.locked = false;
            this.modelChanged();
            return this.colorChanged();
        }, i.prototype.randomizeKeepMood = function() {
            this.locked = true;
            if (!this.lockedColors.pri) {
                var step = 45 + Math.floor(Math.random() * 270);
                this.setHue((this.hue + step) % 360);
            }
            if (!this.lockedColors.sec && this.hasSecs()) {
                var angle = Math.floor(20 + Math.random() * 45);
                this.setAngle(angle);
            }
            this.locked = false;
            this.modelChanged();
            return this.colorChanged();
        }, i.prototype.randomizeVariations = function() {
            this.locked = true;
            if (!this.lockedColors.pri) {
                var deltaH = Math.round((Math.random() * 24 - 12));
                this.setHue((this.hue + deltaH + 360) % 360);
            }
            if (!this.lockedColors.sec && this.hasSecs()) {
                var deltaA = Math.round((Math.random() * 12 - 6));
                this.setAngle(Math.max(10, Math.min(80, this.angle + deltaA)));
            }
            var vals = this.vars.getVals();
            for (var j = 0; j < vals.length; j++) {
                vals[j][0] = Math.max(0.02, Math.min(1.0, vals[j][0] + (Math.random() * 0.08 - 0.04)));
                vals[j][1] = Math.max(0.08, Math.min(1.0, vals[j][1] + (Math.random() * 0.08 - 0.04)));
            }
            if (this.varsMultiOn) {
                if (!this.lockedColors.pri) this.varsMulti.pri.setVals(vals);
                if (!this.lockedColors.compl && this.hasCompl()) this.varsMulti.compl.setVals(vals);
                if (!this.lockedColors.sec && this.hasSecs()) {
                    this.varsMulti.sec1.setVals(vals);
                    this.varsMulti.sec2.setVals(vals);
                }
                this.varsActive = "pri";
                this.vars = this.varsMulti.pri;
            } else {
                this.vars.setVals(vals);
            }
            this.locked = false;
            this.modelChanged();
            return this.colorChanged();
        }, i.prototype.generateMode = function(mode) {
            this.locked = true;
            var vals = null;
            mode = (mode || "").toLowerCase();

            switch (mode) {
                case "monochromatic":
                case "mono":
                    this.setModel("mono");
                    if (!this.lockedColors.pri) {
                        this.setHue(Math.floor(Math.random() * 360));
                    }
                    vals = [
                        [0.72, 0.70],
                        [0.18, 0.96],
                        [0.46, 0.82],
                        [0.82, 0.38],
                        [0.94, 0.12]
                    ];
                    break;

                case "analogous":
                case "analog":
                    this.setModel("analog");
                    if (this.hasSecs()) {
                        this.setAngle(Math.floor(25 + Math.random() * 15));
                    }
                    if (!this.lockedColors.pri) {
                        this.setHue(Math.floor(Math.random() * 360));
                    }
                    vals = [
                        [0.76, 0.82],
                        [0.24, 0.94],
                        [0.65, 0.54],
                        [0.82, 0.28],
                        [0.08, 0.98]
                    ];
                    break;

                case "complementary":
                case "compl":
                    this.setModel("monocompl");
                    if (!this.lockedColors.pri) {
                        this.setHue(Math.floor(Math.random() * 360));
                    }
                    vals = [
                        [0.82, 0.86],
                        [0.22, 0.95],
                        [0.68, 0.52],
                        [0.88, 0.22],
                        [0.06, 0.99]
                    ];
                    break;

                case "split_complementary":
                case "split":
                    this.setModel("analogcompl");
                    if (this.hasSecs()) {
                        this.setAngle(Math.floor(25 + Math.random() * 12));
                    }
                    if (!this.lockedColors.pri) {
                        this.setHue(Math.floor(Math.random() * 360));
                    }
                    vals = [
                        [0.78, 0.84],
                        [0.22, 0.94],
                        [0.68, 0.52],
                        [0.85, 0.26],
                        [0.06, 0.98]
                    ];
                    break;

                case "triadic":
                case "triad":
                    this.setModel("triad");
                    if (this.hasSecs()) {
                        this.setAngle(60);
                    }
                    if (!this.lockedColors.pri) {
                        this.setHue(Math.floor(Math.random() * 360));
                    }
                    vals = [
                        [0.78, 0.85],
                        [0.26, 0.94],
                        [0.66, 0.55],
                        [0.84, 0.26],
                        [0.07, 0.98]
                    ];
                    break;

                case "tetradic":
                case "tetrad":
                    this.setModel("tetrad");
                    if (this.hasSecs()) {
                        this.setAngle(Math.floor(45 + Math.random() * 25));
                    }
                    if (!this.lockedColors.pri) {
                        this.setHue(Math.floor(Math.random() * 360));
                    }
                    vals = [
                        [0.75, 0.84],
                        [0.25, 0.94],
                        [0.66, 0.52],
                        [0.84, 0.25],
                        [0.07, 0.98]
                    ];
                    break;

                case "double_complementary":
                case "doublecompl":
                    this.setModel("triadcompl");
                    if (this.hasSecs()) {
                        this.setAngle(Math.floor(30 + Math.random() * 15));
                    }
                    if (!this.lockedColors.pri) {
                        this.setHue(Math.floor(Math.random() * 360));
                    }
                    vals = [
                        [0.76, 0.85],
                        [0.24, 0.94],
                        [0.68, 0.52],
                        [0.85, 0.24],
                        [0.06, 0.98]
                    ];
                    break;

                case "neutral_accent":
                    this.setModel("mono");
                    if (!this.lockedColors.pri) {
                        this.setHue(Math.floor(Math.random() * 360));
                    }
                    vals = [
                        [0.88, 0.92],
                        [0.05, 0.96],
                        [0.10, 0.76],
                        [0.18, 0.22],
                        [0.03, 0.99]
                    ];
                    break;

                case "grayscale_accent":
                    this.setModel("mono");
                    if (!this.lockedColors.pri) {
                        this.setHue(Math.floor(Math.random() * 360));
                    }
                    vals = [
                        [0.96, 0.94],
                        [0.01, 0.97],
                        [0.02, 0.75],
                        [0.03, 0.16],
                        [0.00, 1.00]
                    ];
                    break;

                case "warm":
                    var warmRanges = [[345, 360], [0, 65]];
                    var range = warmRanges[Math.floor(Math.random() * warmRanges.length)];
                    var h = Math.floor(range[0] + Math.random() * (range[1] - range[0]));
                    if (!this.lockedColors.pri) {
                        this.setHue(h % 360);
                    }
                    var warmModels = ["analog", "monocompl", "triad", "mono"];
                    this.setModel(warmModels[Math.floor(Math.random() * warmModels.length)]);
                    if (this.hasSecs()) {
                        this.setAngle(Math.floor(25 + Math.random() * 20));
                    }
                    vals = [
                        [0.82, 0.88],
                        [0.28, 0.96],
                        [0.72, 0.58],
                        [0.86, 0.25],
                        [0.08, 0.98]
                    ];
                    break;

                case "cool":
                    var h = Math.floor(165 + Math.random() * 95);
                    if (!this.lockedColors.pri) {
                        this.setHue(h);
                    }
                    var coolModels = ["analog", "monocompl", "triad", "mono"];
                    this.setModel(coolModels[Math.floor(Math.random() * coolModels.length)]);
                    if (this.hasSecs()) {
                        this.setAngle(Math.floor(25 + Math.random() * 20));
                    }
                    vals = [
                        [0.78, 0.86],
                        [0.20, 0.95],
                        [0.68, 0.52],
                        [0.88, 0.22],
                        [0.06, 0.98]
                    ];
                    break;

                case "high_saturation":
                case "vibrant":
                    if (!this.lockedColors.pri) {
                        this.setHue(Math.floor(Math.random() * 360));
                    }
                    var vibModels = ["triad", "tetrad", "analogcompl", "monocompl"];
                    this.setModel(vibModels[Math.floor(Math.random() * vibModels.length)]);
                    if (this.hasSecs()) {
                        this.setAngle(Math.floor(30 + Math.random() * 30));
                    }
                    vals = [
                        [0.98, 0.98],
                        [0.65, 0.95],
                        [0.88, 0.52],
                        [0.98, 0.16],
                        [0.04, 0.99]
                    ];
                    break;

                case "muted":
                    if (!this.lockedColors.pri) {
                        this.setHue(Math.floor(Math.random() * 360));
                    }
                    var mutModels = ["analog", "analogcompl", "triad", "mono"];
                    this.setModel(mutModels[Math.floor(Math.random() * mutModels.length)]);
                    if (this.hasSecs()) {
                        this.setAngle(Math.floor(20 + Math.random() * 15));
                    }
                    vals = [
                        [0.38, 0.74],
                        [0.16, 0.92],
                        [0.42, 0.58],
                        [0.52, 0.30],
                        [0.08, 0.96]
                    ];
                    break;

                case "pastel":
                    if (!this.lockedColors.pri) {
                        this.setHue(Math.floor(Math.random() * 360));
                    }
                    var pasModels = ["mono", "analog", "triad", "analogcompl"];
                    this.setModel(pasModels[Math.floor(Math.random() * pasModels.length)]);
                    if (this.hasSecs()) {
                        this.setAngle(Math.floor(25 + Math.random() * 20));
                    }
                    vals = [
                        [0.32, 0.94],
                        [0.14, 0.98],
                        [0.28, 0.85],
                        [0.42, 0.52],
                        [0.05, 0.99]
                    ];
                    break;
            }

            if (vals) {
                if (this.varsMultiOn) {
                    if (!this.lockedColors.pri) this.varsMulti.pri.setVals(vals);
                    if (!this.lockedColors.compl && this.hasCompl()) this.varsMulti.compl.setVals(vals);
                    if (!this.lockedColors.sec && this.hasSecs()) {
                        this.varsMulti.sec1.setVals(vals);
                        this.varsMulti.sec2.setVals(vals);
                    }
                    this.varsActive = "pri";
                    this.vars = this.varsMulti.pri;
                } else {
                    this.vars.setVals(vals);
                }
            }

            this.locked = false;
            this.modelChanged();
            return this.colorChanged();
        }, i.prototype.regeneratePrimary = function() {
            this.locked = true;
            var newHue = Math.floor(Math.random() * 360);
            this.setHue(newHue);
            this.locked = false;
            this.modelChanged();
            return this.colorChanged();
        }, i.prototype.regenerateSecondary = function() {
            this.locked = true;
            if (this.hasSecs()) {
                var cur = this.angle || 0;
                var delta, attempts = 0;
                do {
                    delta = Math.floor(15 + Math.random() * 55);
                    attempts++;
                } while (Math.abs(delta - cur) < 10 && attempts < 20);
                this.setAngle(delta);
            }
            if (this.isModelFree()) {
                if (this.hasCompl()) this.setHueCompl(Math.floor(Math.random() * 360), true);
                if (this.hasSecs()) {
                    this.setHueSec(Math.floor(Math.random() * 360), 1, true);
                    this.setHueSec(Math.floor(Math.random() * 360), 2, true);
                }
            }
            this.locked = false;
            this.modelChanged();
            return this.colorChanged();
        }, i.prototype.randomizeMood = function(mood) {
            return this.generateMode(mood);
        }, i.prototype.setHarmonyMode = function(mode) {
            return this.generateMode(mode);
        }, i.prototype.randomizeQuick = function() {
            var profiles = ["saas", "minimal", "nature", "luxury", "playful", "pastel", "monochrome", "cyberpunk", "earth", "ocean", "sunset", "editorial", "retro", "darkui"];
            var p = profiles[Math.floor(Math.random() * profiles.length)];
            return this.randomizeProfile(p);
        }, i.prototype.randomizeWCAG = function(targetRatio) {
            if (!targetRatio) targetRatio = 4.5;
            this.locked = true;
            if (!this.lockedColors.pri) {
                var newHue = Math.floor(Math.random() * 360);
                this.setHue(newHue);
            }
            if (!this.lockedColors.sec) {
                var models = ["triad", "tetrad", "analogcompl", "monocompl", "analog", "mono"];
                var mId = models[Math.floor(Math.random() * models.length)];
                this.setModel(mId);
                if (this.hasSecs()) {
                    var angle = Math.floor(25 + Math.random() * 35);
                    this.setAngle(angle);
                }
            }
            var isAAA = targetRatio >= 7.0;
            var darkVal = isAAA ? 0.10 : 0.16;
            var lightVal = isAAA ? 0.99 : 0.96;
            var lightSat = isAAA ? 0.08 : 0.18;
            var baseSat = Math.round((0.65 + Math.random() * 0.25) * 1000) / 1000;
            var baseVal = Math.round((0.65 + Math.random() * 0.25) * 1000) / 1000;
            var vals = [
                [baseSat, baseVal],
                [0.32, 0.90],
                [0.75, 0.42],
                [0.92, darkVal],
                [lightSat, lightVal]
            ];
            if (this.varsMultiOn) {
                if (!this.lockedColors.pri) this.varsMulti.pri.setVals(vals);
                if (!this.lockedColors.compl && this.hasCompl()) this.varsMulti.compl.setVals(vals);
                if (!this.lockedColors.sec && this.hasSecs()) {
                    this.varsMulti.sec1.setVals(vals);
                    this.varsMulti.sec2.setVals(vals);
                }
                this.varsActive = "pri";
                this.vars = this.varsMulti.pri;
            } else {
                this.vars.setVals(vals);
            }
            this.locked = false;
            this.modelChanged();
            return this.colorChanged();
        }, i.prototype.randomize = function(e, t, n, i) {
            var o, u, a, f, l, c, h;
            this.locked = !0, h = this;
            if (e) {
                a = m[this.modelID], f = r.rnd(1, 7);
                while (f === a) f = r.rnd(1, 7);
                this.setModel(v(f)), this.switchVars(r.rnd(1, 10) > 8)
            }
            return t && (u = r.rnd(t * 30, t * 180), c = r.rndSign(), this.addHue(u * c), this.isModelFree() && (this.hasCompl() && (u = r.rnd(t * 30, t * 180), c = r.rndSign(), this.setHueCompl(this.hueCompl + u * c, !0)), this.hasSecs() && (u = r.rnd(t * 30, t * 180), c = r.rndSign(), this.setHueSec(this.hueSec1 + u * c, 1, !0), u = r.rnd(t * 30, t * 180), c = r.rndSign(), this.setHueSec(this.hueSec2 + u * c, 2, !0)))), n && (this.isModelFree() || (o = r.rnd(n * 15, n * 120), c = r.rndSign(), this.setHueSec(this.hue + this.angle + o * c))), i && (l = function(e) {
                var t, n, o, u;
                return u = 50, i > .5 && (h.vars = e, n = s.getPresetCount(), f = r.rnd(0, n - 1), h.setPreset(s.getPresetId(f)), u = 20), o = r.rnd(-u * i, u * i), e.addSaturation(o / 100), o = r.rnd(-u * i, u * i), e.addBright(o / 100), t = (Math.random() * Math.PI - Math.PI / 2) * i, u = r.rnd(100 - 75 * i, 100 + 75 * i), e.rotate(t, u / 100)
            }, this.varsMultiOn ? (l(this.varsMulti.pri), l(this.varsMulti.compl), l(this.varsMulti.sec1), l(this.varsMulti.sec2), this.varsActive = "pri", this.vars = this.varsMulti.pri) : l(this.vars)), this.locked = !1, e && this.modelChanged(), this.colorChanged()
        }, i.prototype.getSerialized = function() {
            var e, t, n, i, s;
            i = "", s = m[this.modelID], n = s === 10, n && (s += this.hueCnt - 2), i += r.myB64.encodeInt(s, 1), i += r.myB64.encodeInt(Math.round(this.hue), 2);
            if (n) {
                if (this.hueCnt === 2 || this.hueCnt === 4) i += r.myB64.encodeInt(Math.round(this.hueCompl), 2);
                this.hueCnt > 2 && (i += r.myB64.encodeInt(Math.round(this.hueSec1), 2), i += r.myB64.encodeInt(Math.round(this.hueSec2), 2))
            } else i += r.myB64.encodeInt(Math.round(this.angle), 2);
            return t = [this.varsMultiOn], i += r.myB64.encodeFlags(t), e = function(e) {
                var t;
                return t = e.getSerialized(), i += r.myB64.encodeInt(t.length, 1), i += t
            }, this.varsMultiOn ? (e(this.varsMulti.pri), this.hasCompl() && e(this.varsMulti.compl), this.hasSecs() && (e(this.varsMulti.sec1), e(this.varsMulti.sec2))) : e(this.vars), i
        }, i.prototype.setSerialized = function(e) {
            var t, n, i, s, o, u, a, f, l;
            if (!r.myB64.isValidString(e)) return !1;
            a = this, i = !1, s = 0, u = e.substring(s, s + 1), f = r.myB64.decodeInt(u, 1);
            if (f >= 10) i = !0, t = f - 10 + 2;
            else {
                this.setModel(v(f));
                switch (f) {
                    case 1:
                        t = 1;
                        break;
                    case 2:
                        t = 2;
                        break;
                    case 3:
                    case 5:
                        t = 3;
                        break;
                    default:
                        t = 4
                }
            }
            s += 1, u = e.substring(s, s + 2), f = r.myB64.decodeInt(u, 2), this.setHue(f), s += 2;
            if (i) {
                if (t === 2 || t === 4) u = e.substring(s, s + 2), f = r.myB64.decodeInt(u, 2), this.hueCompl = f, s += 2;
                t > 2 && (u = e.substring(s, s + 2), f = r.myB64.decodeInt(u, 2), this.hueSec1 = f, s += 2, u = e.substring(s, s + 2), f = r.myB64.decodeInt(u, 2), this.hueSec2 = f, s += 2), this.setModelFree(t)
            } else u = e.substring(s, s + 2), f = r.myB64.decodeInt(u, 2), f < 5 && (f = 5), f > 175 && (f = 175), this.setAngle(f), s += 2;
            return u = e.substring(s, s + 1), l = r.myB64.decodeFlags(u), this.varsMultiOn = l[0], n = l[1], s += 1, o = function(t) {
                var n;
                return u = e.substring(s, s + 1), n = r.myB64.decodeInt(u, 1), s += 1, u = e.substring(s, s + n), t.setSerialized(u), s += n, t
            }, this.varsMultiOn ? (o(this.varsMulti.pri), (t === 2 || t === 4) && o(this.varsMulti.compl), t > 2 && (o(this.varsMulti.sec1), o(this.varsMulti.sec2)), this.setVarsActive("pri")) : o(this.vars), !0
        }, i.prototype.calcColorTable = function() {
            var e, t, n;
            return this.colorTable = {
                byPalette: {},
                sorted: {},
                byLum: {}
            }, n = this, t = function(e, t) {
                var n, r;
                return n = e.getLum(), r = t.getLum(), n < r ? 1 : n > r ? -1 : 0
            }, e = function(e) {
                var r, i, s, u, a, f, l, c;
                r = n.col[e];
                if (!r) return null;
                a = [], f = [], l = [];
                for (s = c = 0; c <= 4; s = ++c) i = new o(r.baseHSV.h), u = n.getVar(s, e), i.setSV(u[0], u[1]), a[s] = i, l[s] = i, s > 0 && f.push(i);
                return f.sort(t), f.unshift(a[0]), l.sort(t), n.colorTable.byPalette[e] = a, n.colorTable.sorted[e] = f, n.colorTable.byLum[e] = l
            }, e("pri"), e("sec1"), e("sec2"), e("compl")
        }, i.prototype.getSimpleColorTable = function() {
            var e, t, n;
            return n = this, e = function(e) {
                var t, r, i, s, o, u, a;
                o = {}, a = n.colorTable[e];
                for (s in a) {
                    r = a[s], t = [];
                    for (i = u = 0; u <= 4; i = ++u) t.push(r[i].rgb.getHex(!0));
                    o[s] = t
                }
                return o
            }, t = {}, t.byPalette = e("byPalette"), t.byLum = e("byLum"), t
        }, i.prototype.getTonalScales = function(options) {
            var res = {}, groups = ["pri"], idx, k, rgb;
            this.hasSecs() && groups.push("sec1", "sec2");
            this.hasCompl() && groups.push("compl");
            for (idx = 0; idx < groups.length; idx++) {
                k = groups[idx];
                if (this.col[k] && this.col[k].rgb) {
                    rgb = this.col[k].rgb;
                    res[k] = oklch.generateTonalScale(rgb.r, rgb.g, rgb.b, options);
                }
            }
            return res;
        }, i.prototype.getColorCode = function(e, t, n, r, i) {
            var s, o;
            return this.col[e] || (e = "pri"), n || (n = "byPalette"), s = this.colorTable[n][e][t], o = s.rgb, r && this.converter && this.converter.on && (o = c.convert(o, this.converter)), i > 0 ? o.getCSS(i) : i < 0 ? o : o.getHex(!0)
        }, i.prototype.colorize = function(e, t, n) {
            var r, i, s, o, u, a, f, l, c, h, p, d, v, m, g;
            if (!e || !e.length) return;
            d = {
                bgcol: "background",
                col: "color",
                bdcol: "border-color"
            }, e.toggleClass("no-compl", !this.hasCompl()), e.toggleClass("no-secs", !this.hasSecs()), v = t ? "sorted" : "byPalette", g = ["pri", "sec1", "sec2", "compl"];
            for (c in g) {
                o = g[c], u = o;
                for (l = m = 0; m <= 4; l = ++m) {
                    i = this.getColorCode(u, l, v, n, -1), s = this.getColorCode(u, l, "byLum", n, -1), a = i.getHex(), f = s.getHex();
                    for (h in d) p = d[h], r = e.find("." + h + "-" + o + "-" + l).css(p, "#" + a), h === "bgcol" && (r.prop("title", a), r.attr("col-data", a)), r = e.find("." + h + "-" + o + "-lum-" + l).css(p, "#" + f), h === "bgcol" && (r.prop("title", f), r.attr("col-data", f))
                }
            }
            return !1
        }, i.prototype.lessColorize = function(e, t, n) {
            var r, i, s, o, u, a, f, l, c, h;
            if (e == null || e.modifyVars == null) return;
            f = {}, l = t ? "sorted" : "byPalette", h = ["pri", "compl", "sec1", "sec2"];
            for (a in h) {
                s = h[a], o = s;
                for (u = c = 0; c <= 4; u = ++c) r = this.getColorCode(o, u, l, n), i = this.getColorCode(o, u, "byLum", n), f["@col-" + s + "-" + u] = r, f["@col-" + s + "-lum-" + u] = i
            }
            return e.modifyVars(f)
        }, i.prototype["export"] = function(t) {
            var i, s, o, u;
            return u = this, t === "html" ? s = [1, 2, 0, 3, 4] : s = [0, 1, 2, 3, 4], i = function(e, t, n) {
                var i, o, a, f, l;
                f = '"' + t + '":{"ttl":"' + n + '","col":[';
                for (i = l = 0; l <= 4; i = ++l) o = s[i], a = u.getColorCode(e, o, "byPalette", !1, -1), i > 0 && (f += ","), f += '{"idx":' + o + ',"hex":"' + a.getHex() + '","r":' + a.r + ',"g":' + a.g + ',"b":' + a.b + ',"r0":' + r.round(a.r / 255, 3) + ',"g0":' + r.round(a.g / 255, 3) + ',"b0":' + r.round(a.b / 255, 3) + "}";
                return f += "]}", f
            }, o = '{"type":"' + t + '","id":"' + this.uid + '","scheme":{', o += i("pri", "primary", n("color.pri")), this.hasSecs() && (o += "," + i("sec1", "secondary-1", n("color.sec") + " (1)"), o += "," + i("sec2", "secondary-2", n("color.sec") + " (2)")), this.hasCompl() && (o += "," + i("compl", "complement", n("color.compl"))), o += "}}", r.sendRequest(e.urls["export"].url, "POST", {
                data: o
            }, "_blank")
        }, i.prototype.exportImg = function() {
            return new h(this, $("body"))
        }, i.prototype.copy = function(e) {
            var t;
            return this.isModelFree() ? (t = new i("mono", this.hue, 30, e), t.setModelFree(this.hueCnt), t.hueCompl = this.hueCompl, t.hueSec1 = this.hueSec1, t.hueSec2 = this.hueSec2, t.updateCompl(), t.updateSecs()) : t = new i(this.modelID, this.hue, this.angle, e), t.setVars(this.vars.values), t.colorChanged(), t
        }, i
    }(), p
});
