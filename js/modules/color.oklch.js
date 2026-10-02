define("color.oklch", ["util"], function(r) {
    "use strict";

    // sRGB <-> Linear conversions
    function srgbToLinear(c) {
        var v = c / 255.0;
        return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    }

    function linearToSrgb(c) {
        var v = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(Math.max(0, c), 1.0 / 2.4) - 0.055;
        return Math.round(Math.max(0, Math.min(255, v * 255.0)));
    }

    function linearToSrgbFloat(c) {
        return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(Math.max(0, c), 1.0 / 2.4) - 0.055;
    }

    // sRGB (0..255) -> OKLab
    function srgbToOklab(red, green, blue) {
        var r_l = srgbToLinear(red);
        var g_l = srgbToLinear(green);
        var b_l = srgbToLinear(blue);

        var l = 0.4122214708 * r_l + 0.5363325363 * g_l + 0.0514459929 * b_l;
        var m = 0.2119034982 * r_l + 0.6806995451 * g_l + 0.1073969566 * b_l;
        var s = 0.0883024619 * r_l + 0.2817188376 * g_l + 0.6299787005 * b_l;

        var l_ = l > 0 ? Math.cbrt(l) : 0;
        var m_ = m > 0 ? Math.cbrt(m) : 0;
        var s_ = s > 0 ? Math.cbrt(s) : 0;

        return {
            L: 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
            a: 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
            b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_
        };
    }

    // OKLab -> sRGB (raw float, may be out of gamut)
    function oklabToSrgbRaw(L, a, b) {
        var l_ = L + 0.3963377774 * a + 0.2158037573 * b;
        var m_ = L - 0.1055613458 * a - 0.0638541728 * b;
        var s_ = L - 0.0894841775 * a - 1.2914855480 * b;

        var l = l_ * l_ * l_;
        var m = m_ * m_ * m_;
        var s = s_ * s_ * s_;

        var r_l = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
        var g_l = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
        var b_l = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

        return {
            r: linearToSrgbFloat(r_l),
            g: linearToSrgbFloat(g_l),
            b: linearToSrgbFloat(b_l)
        };
    }

    // OKLab <-> OKLCH
    function oklabToOklch(lab) {
        var C = Math.sqrt(lab.a * lab.a + lab.b * lab.b);
        var H = Math.atan2(lab.b, lab.a) * (180.0 / Math.PI);
        if (H < 0) H += 360.0;
        return { L: lab.L, C: C, H: H };
    }

    function oklchToOklab(L, C, H) {
        var hRad = (H * Math.PI) / 180.0;
        return {
            L: L,
            a: C * Math.cos(hRad),
            b: C * Math.sin(hRad)
        };
    }

    // sRGB -> OKLCH
    function srgbToOklch(r, g, b) {
        return oklabToOklch(srgbToOklab(r, g, b));
    }

    function inGamut(rgb, eps) {
        eps = eps || 0.001;
        return (
            rgb.r >= -eps && rgb.r <= 1.0 + eps &&
            rgb.g >= -eps && rgb.g <= 1.0 + eps &&
            rgb.b >= -eps && rgb.b <= 1.0 + eps
        );
    }

    // OKLCH -> sRGB with Gamut Mapping (binary search on Chroma)
    function oklchToSrgb(L, C, H) {
        if (L <= 0.0001) return { r: 0, g: 0, b: 0 };
        if (L >= 0.9999) return { r: 255, g: 255, b: 255 };

        var lab = oklchToOklab(L, C, H);
        var raw = oklabToSrgbRaw(lab.L, lab.a, lab.b);

        if (inGamut(raw)) {
            return {
                r: Math.round(Math.max(0, Math.min(1, raw.r)) * 255),
                g: Math.round(Math.max(0, Math.min(1, raw.g)) * 255),
                b: Math.round(Math.max(0, Math.min(1, raw.b)) * 255)
            };
        }

        // Binary search chroma
        var low = 0.0;
        var high = C;
        var best = { r: L, g: L, b: L };

        for (var i = 0; i < 16; i++) {
            var mid = (low + high) * 0.5;
            var testLab = oklchToOklab(L, mid, H);
            var testRgb = oklabToSrgbRaw(testLab.L, testLab.a, testLab.b);
            if (inGamut(testRgb)) {
                low = mid;
                best = testRgb;
            } else {
                high = mid;
            }
        }

        return {
            r: Math.round(Math.max(0, Math.min(1, best.r)) * 255),
            g: Math.round(Math.max(0, Math.min(1, best.g)) * 255),
            b: Math.round(Math.max(0, Math.min(1, best.b)) * 255)
        };
    }

    function formatCssOklch(L, C, H, alpha) {
        var lPerc = (L * 100).toFixed(1) + "%";
        var cVal = C.toFixed(3);
        var hDeg = H.toFixed(1);
        if (alpha != null && alpha < 1) {
            return "oklch(" + lPerc + " " + cVal + " " + hDeg + " / " + alpha + ")";
        }
        return "oklch(" + lPerc + " " + cVal + " " + hDeg + ")";
    }

    function rgbToHsl(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h = 0, s = 0, l = (max + min) / 2;
        if (max !== min) {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) * 60; break;
                case g: h = ((b - r) / d + 2) * 60; break;
                case b: h = ((r - g) / d + 4) * 60; break;
            }
        }
        return { h: h, s: s, l: l };
    }

    function formatColorString(r, g, b, format) {
        format = (format || "hex").toLowerCase();
        var cr = Math.max(0, Math.min(255, Math.round(r || 0)));
        var cg = Math.max(0, Math.min(255, Math.round(g || 0)));
        var cb = Math.max(0, Math.min(255, Math.round(b || 0)));
        var hex = ((1 << 24) + (cr << 16) + (cg << 8) + cb).toString(16).slice(1).toUpperCase();
        if (format === "hex") {
            return "#" + hex;
        }
        if (format === "oklch") {
            var oklch = srgbToOklch(cr, cg, cb);
            return formatCssOklch(oklch.L, oklch.C, oklch.H);
        }
        if (format === "rgb") {
            return "rgb(" + cr + ", " + cg + ", " + cb + ")";
        }
        if (format === "hsl") {
            var hsl = rgbToHsl(cr, cg, cb);
            return "hsl(" + Math.round(hsl.h) + ", " + Math.round(hsl.s * 100) + "%, " + Math.round(hsl.l * 100) + "%)";
        }
        return "#" + hex;
    }

    function formatHexColor(hexStr, format) {
        var hex = (hexStr || "").replace(/^#/, "");
        if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        var r = parseInt(hex.slice(0, 2), 16) || 0;
        var g = parseInt(hex.slice(2, 4), 16) || 0;
        var b = parseInt(hex.slice(4, 6), 16) || 0;
        return formatColorString(r, g, b, format);
    }

    /**
     * Generate modern 11-step tonal scale (50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950)
     * with perceptually uniform lightness steps and subtle natural hue-shift (warm light, cool shadow).
     */
    var TONAL_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
    var TONAL_LIGHTNESS = {
        50: 0.98,
        100: 0.94,
        200: 0.86,
        300: 0.77,
        400: 0.67,
        500: 0.56,
        600: 0.46,
        700: 0.36,
        800: 0.27,
        900: 0.18,
        950: 0.11
    };

    function generateTonalScale(baseR, baseG, baseB, options) {
        options = options || {};
        var base = srgbToOklch(baseR, baseG, baseB);
        var maxC = Math.max(0.04, base.C);
        var hueShift = options.hueShift !== undefined ? options.hueShift : 4.0; // degrees
        var scale = {};

        for (var i = 0; i < TONAL_STEPS.length; i++) {
            var step = TONAL_STEPS[i];
            var targetL = TONAL_LIGHTNESS[step];

            // Chroma curve: peak at midtones, taper at extremes
            // Bell-shaped curve centered around L=0.55
            var distFromCenter = Math.abs(targetL - 0.55);
            var chromaFactor = Math.max(0.15, 1.0 - distFromCenter * 1.5);
            var stepC = maxC * chromaFactor;

            // Hue shift: shift lighter steps towards warmer (~80 deg, yellow/amber),
            // darker steps towards cooler (~260 deg, blue)
            var stepH = base.H;
            if (hueShift > 0) {
                var shiftFactor = (targetL - 0.55) * 2; // -1 to +1
                stepH = (base.H + shiftFactor * hueShift + 360) % 360;
            }

            var rgb = oklchToSrgb(targetL, stepC, stepH);
            scale[step] = {
                step: step,
                L: targetL,
                C: stepC,
                H: stepH,
                r: rgb.r,
                g: rgb.g,
                b: rgb.b,
                hex: "#" + ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1).toUpperCase(),
                css: "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")",
                oklchCss: formatCssOklch(targetL, stepC, stepH)
            };
        }

        return scale;
    }

    function getRelativeLuminance(r, g, b) {
        var rL = srgbToLinear(r);
        var gL = srgbToLinear(g);
        var bL = srgbToLinear(b);
        return 0.2126 * rL + 0.7152 * gL + 0.0722 * bL;
    }

    function calcWcagContrast(rgb1, rgb2) {
        if (!rgb1 || !rgb2) return 1.0;
        var r1 = rgb1.r != null ? rgb1.r : (rgb1[0] || 0);
        var g1 = rgb1.g != null ? rgb1.g : (rgb1[1] || 0);
        var b1 = rgb1.b != null ? rgb1.b : (rgb1[2] || 0);
        var r2 = rgb2.r != null ? rgb2.r : (rgb2[0] || 0);
        var g2 = rgb2.g != null ? rgb2.g : (rgb2[1] || 0);
        var b2 = rgb2.b != null ? rgb2.b : (rgb2[2] || 0);
        var l1 = getRelativeLuminance(r1, g1, b1);
        var l2 = getRelativeLuminance(r2, g2, b2);
        var lighter = Math.max(l1, l2);
        var darker = Math.min(l1, l2);
        var ratio = (lighter + 0.05) / (darker + 0.05);
        return Math.round(ratio * 100) / 100;
    }

    function simulateColorBlindness(r, g, b, type) {
        var rl = srgbToLinear(r);
        var gl = srgbToLinear(g);
        var bl = srgbToLinear(b);
        var ro, go, bo;
        if (type === "protanopia") {
            ro = 0.56667 * rl + 0.43333 * gl + 0.00000 * bl;
            go = 0.55833 * rl + 0.44167 * gl + 0.00000 * bl;
            bo = 0.00000 * rl + 0.24167 * gl + 0.75833 * bl;
        } else if (type === "deuteranopia") {
            ro = 0.62500 * rl + 0.37500 * gl + 0.00000 * bl;
            go = 0.70000 * rl + 0.30000 * gl + 0.00000 * bl;
            bo = 0.00000 * rl + 0.30000 * gl + 0.70000 * bl;
        } else if (type === "tritanopia") {
            ro = 0.95000 * rl + 0.05000 * gl + 0.00000 * bl;
            go = 0.00000 * rl + 0.43333 * gl + 0.56667 * bl;
            bo = 0.00000 * rl + 0.47500 * gl + 0.52500 * bl;
        } else if (type === "achromatopsia" || type === "grayscale") {
            var y = 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
            ro = y; go = y; bo = y;
        } else {
            ro = rl; go = gl; bo = bl;
        }
        return {
            r: linearToSrgb(ro),
            g: linearToSrgb(go),
            b: linearToSrgb(bo)
        };
    }

    function sRgbToApcaY(c) {
        if (!c) return 0;
        var cr = c.r != null ? c.r : (c[0] != null ? c[0] : 0);
        var cg = c.g != null ? c.g : (c[1] != null ? c[1] : 0);
        var cb = c.b != null ? c.b : (c[2] != null ? c[2] : 0);
        var r = Math.pow(Math.max(0, Math.min(255, cr)) / 255.0, 2.4);
        var g = Math.pow(Math.max(0, Math.min(255, cg)) / 255.0, 2.4);
        var b = Math.pow(Math.max(0, Math.min(255, cb)) / 255.0, 2.4);
        return 0.2126729 * r + 0.7151522 * g + 0.0721750 * b;
    }

    function calcAPCA(txtRgb, bgRgb) {
        if (!txtRgb || !bgRgb) return 0;
        var yTxt = sRgbToApcaY(txtRgb);
        var yBg = sRgbToApcaY(bgRgb);
        var blkThrs = 0.022;
        var blkClmp = 1.414;
        if (yTxt < blkThrs) yTxt += Math.pow(blkThrs - yTxt, blkClmp);
        if (yBg < blkThrs) yBg += Math.pow(blkThrs - yBg, blkClmp);
        var deltaY2 = Math.abs(yBg - yTxt);
        if (deltaY2 < 0.0005) return 0;
        var SAPC = 0;
        if (yBg > yTxt) {
            SAPC = (Math.pow(yBg, 0.56) - Math.pow(yTxt, 0.57)) * 1.14;
        } else {
            SAPC = (Math.pow(yBg, 0.65) - Math.pow(yTxt, 0.62)) * 1.14;
        }
        if (Math.abs(SAPC) < 0.1) return 0;
        var Lc = SAPC > 0 ? (SAPC - 0.027) * 100 : (SAPC + 0.027) * 100;
        return Math.round(Lc * 10) / 10;
    }

    function interpolateOklab(r1, g1, b1, r2, g2, b2, t) {
        var lab1 = srgbToOklab(r1, g1, b1);
        var lab2 = srgbToOklab(r2, g2, b2);
        var L = lab1.L * (1 - t) + lab2.L * t;
        var a = lab1.a * (1 - t) + lab2.a * t;
        var b = lab1.b * (1 - t) + lab2.b * t;
        var lch = oklabToOklch({ L: L, a: a, b: b });
        return oklchToSrgb(lch.L, lch.C, lch.H);
    }

    function parseCssColor(str) {
        if (!str || typeof str !== 'string') return null;
        str = str.trim();

        // 1. OKLCH: oklch(L C H) or oklch(L% C H)
        var mOklch = str.match(/^oklch\(\s*([\d\.]+)%?\s+([\d\.]+)\s+([\d\.]+)/i);
        if (mOklch) {
            var rawL = parseFloat(mOklch[1]);
            var L = str.includes('%') || rawL > 1 ? rawL / 100.0 : rawL;
            var C = parseFloat(mOklch[2]);
            var H = parseFloat(mOklch[3]);
            return oklchToSrgb(L, C, H);
        }

        // 2. RGB: rgb(r, g, b) or rgba(r, g, b, a)
        var mRgb = str.match(/^rgba?\(\s*([\d\.]+%?)[,\s]+([\d\.]+%?)[,\s]+([\d\.]+%?)/i);
        if (mRgb) {
            var parseVal = function(v) {
                return v.endsWith('%') ? Math.round(parseFloat(v) * 2.55) : Math.round(parseFloat(v));
            };
            return {
                r: Math.max(0, Math.min(255, parseVal(mRgb[1]))),
                g: Math.max(0, Math.min(255, parseVal(mRgb[2]))),
                b: Math.max(0, Math.min(255, parseVal(mRgb[3])))
            };
        }

        // 3. HSL: hsl(h, s%, l%) or hsla(h, s%, l%, a)
        var mHsl = str.match(/^hsla?\(\s*([\d\.]+)(?:deg)?[,\s]+([\d\.]+)%[,\s]+([\d\.]+)%/i);
        if (mHsl) {
            var h = (parseFloat(mHsl[1]) % 360 + 360) % 360;
            var s = parseFloat(mHsl[2]) / 100.0;
            var l = parseFloat(mHsl[3]) / 100.0;
            var a = s * Math.min(l, 1 - l);
            var f = function(n) {
                var k = (n + h / 30) % 12;
                var color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
                return Math.round(Math.max(0, Math.min(255, 255 * color)));
            };
            return { r: f(0), g: f(8), b: f(4) };
        }

        // 4. HEX: #RGB, #RRGGBB, RGB, RRGGBB
        var cleanHex = str.replace(/[^0-9a-f]/gi, '');
        if (cleanHex.length === 3) {
            cleanHex = cleanHex[0] + cleanHex[0] + cleanHex[1] + cleanHex[1] + cleanHex[2] + cleanHex[2];
        }
        if (cleanHex.length === 6) {
            var num = parseInt(cleanHex, 16);
            return {
                r: (num >> 16) & 255,
                g: (num >> 8) & 255,
                b: num & 255
            };
        }

        return null;
    }

    // === Seed-based PRNG & Gaussian Distribution ===
    function mulberry32(seed) {
        var s = (seed >>> 0);
        return function() {
            var t = s += 0x6D2B79F5;
            t = Math.imul(t ^ (t >>> 15), t | 1);
            t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }

    function stringToSeed(str) {
        if (typeof str === "number") return str >>> 0;
        if (!str) return (Math.random() * 0xFFFFFFFF) >>> 0;
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = Math.imul(31, hash) + str.charCodeAt(i) | 0;
        }
        return hash >>> 0;
    }

    function generateSeed() {
        return Math.random().toString(36).substring(2, 10);
    }

    // Box-Muller Gaussian Jitter
    function randomGaussian(rng, mean, stdDev) {
        var u1 = rng();
        var u2 = rng();
        while (u1 <= 1e-7) u1 = rng();
        var z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        return (mean || 0) + z0 * (stdDev !== undefined ? stdDev : 1);
    }

    /**
     * Binary search on OKLCH Lightness L to guarantee WCAG targetRatio (e.g. 4.5 or 7.0).
     * Preserves H, applies gamut mapping on C at each step, and returns optimal readable L.
     */
    function fitContrast(fgOklch, bgRgb, targetRatio, options) {
        options = options || {};
        targetRatio = targetRatio || 4.5;
        if (!bgRgb) bgRgb = { r: 255, g: 255, b: 255 };
        var bgLum = getRelativeLuminance(bgRgb.r, bgRgb.g, bgRgb.b);

        var curRgb = oklchToSrgb(fgOklch.L, fgOklch.C, fgOklch.H);
        var curRatio = calcWcagContrast(curRgb, bgRgb);
        if (curRatio >= targetRatio) {
            return {
                L: fgOklch.L,
                C: fgOklch.C,
                H: fgOklch.H,
                rgb: curRgb,
                ratio: curRatio,
                passed: true
            };
        }

        var maxDarkRatio = (bgLum + 0.05) / 0.05;
        var maxLightRatio = 1.05 / (bgLum + 0.05);
        var goDark = (bgLum >= 0.179 && maxDarkRatio >= targetRatio) || (maxLightRatio < targetRatio);

        var lo = goDark ? 0.0 : Math.min(0.99, fgOklch.L);
        var hi = goDark ? Math.max(0.01, fgOklch.L) : 1.0;

        var bestL = goDark ? 0.0 : 1.0;
        var bestRgb = oklchToSrgb(bestL, fgOklch.C, fgOklch.H);
        var bestRatio = calcWcagContrast(bestRgb, bgRgb);

        for (var i = 0; i < 20; i++) {
            var mid = (lo + hi) * 0.5;
            var testRgb = oklchToSrgb(mid, fgOklch.C, fgOklch.H);
            var ratio = calcWcagContrast(testRgb, bgRgb);

            if (goDark) {
                if (ratio >= targetRatio) {
                    bestL = mid;
                    bestRgb = testRgb;
                    bestRatio = ratio;
                    lo = mid;
                } else {
                    hi = mid;
                }
            } else {
                if (ratio >= targetRatio) {
                    bestL = mid;
                    bestRgb = testRgb;
                    bestRatio = ratio;
                    hi = mid;
                } else {
                    lo = mid;
                }
            }
        }

        if (bestRatio < targetRatio) {
            var fallbackL = goDark ? 0.02 : 0.98;
            bestL = fallbackL;
            bestRgb = oklchToSrgb(bestL, 0.01, fgOklch.H);
            bestRatio = calcWcagContrast(bestRgb, bgRgb);
        }

        var apca = calcAPCA(bestRgb, bgRgb);
        return {
            L: bestL,
            C: fgOklch.C,
            H: fgOklch.H,
            rgb: bestRgb,
            ratio: bestRatio,
            apca: apca,
            passed: bestRatio >= targetRatio
        };
    }

    function fitContrastApca(fgOklch, bgRgb, targetLc, options) {
        targetLc = Math.abs(targetLc || 60);
        if (!bgRgb) bgRgb = { r: 255, g: 255, b: 255 };
        var bgLum = getRelativeLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
        var curRgb = oklchToSrgb(fgOklch.L, fgOklch.C, fgOklch.H);
        var curLc = Math.abs(calcAPCA(curRgb, bgRgb));
        if (curLc >= targetLc) {
            return { L: fgOklch.L, C: fgOklch.C, H: fgOklch.H, rgb: curRgb, apca: curLc, passed: true };
        }

        var goDark = bgLum >= 0.179;
        var lo = goDark ? 0.0 : Math.min(0.99, fgOklch.L);
        var hi = goDark ? Math.max(0.01, fgOklch.L) : 1.0;

        var bestL = goDark ? 0.0 : 1.0;
        var bestRgb = oklchToSrgb(bestL, fgOklch.C, fgOklch.H);
        var bestLc = Math.abs(calcAPCA(bestRgb, bgRgb));

        for (var i = 0; i < 20; i++) {
            var mid = (lo + hi) * 0.5;
            var testRgb = oklchToSrgb(mid, fgOklch.C, fgOklch.H);
            var lc = Math.abs(calcAPCA(testRgb, bgRgb));
            if (goDark) {
                if (lc >= targetLc) {
                    bestL = mid; bestRgb = testRgb; bestLc = lc;
                    lo = mid;
                } else {
                    hi = mid;
                }
            } else {
                if (lc >= targetLc) {
                    bestL = mid; bestRgb = testRgb; bestLc = lc;
                    hi = mid;
                } else {
                    lo = mid;
                }
            }
        }
        return { L: bestL, C: fgOklch.C, H: fgOklch.H, rgb: bestRgb, apca: bestLc, passed: bestLc >= targetLc };
    }

    function auditSemanticContrast(priRgb, bgRgb, textRgb, secRgb) {
        if (!priRgb || !bgRgb || !textRgb) return null;
        var textBgRatio = calcWcagContrast(textRgb, bgRgb);
        var priBgRatio = calcWcagContrast(priRgb, bgRgb);
        var secBgRatio = secRgb ? calcWcagContrast(secRgb, bgRgb) : null;

        var apcaText = Math.abs(calcAPCA(textRgb, bgRgb));
        var apcaPri = Math.abs(calcAPCA(priRgb, bgRgb));
        var apcaSec = secRgb ? Math.abs(calcAPCA(secRgb, bgRgb)) : null;

        var passesAA = textBgRatio >= 4.5 && priBgRatio >= 3.0;
        var passesAAA = textBgRatio >= 7.0 && priBgRatio >= 4.5;

        return {
            textBgRatio: textBgRatio,
            priBgRatio: priBgRatio,
            secBgRatio: secBgRatio,
            apcaText: apcaText,
            apcaPri: apcaPri,
            apcaSec: apcaSec,
            passesAA: passesAA,
            passesAAA: passesAAA,
            score: Math.min(100, Math.round((Math.min(7.0, textBgRatio) / 7.0 * 50) + (Math.min(4.5, priBgRatio) / 4.5 * 50)))
        };
    }

    /**
     * OKLab Euclidean color difference Delta E OK:
     * Reflects perceived visual distance uniformly across hue and lightness.
     * JND ~ 0.02, distinct accents >= 0.08, high contrast >= 0.15.
     */
    function deltaEOk(rgb1, rgb2) {
        if (!rgb1 || !rgb2) return 0;
        var lab1 = srgbToOklab(rgb1.r, rgb1.g, rgb1.b);
        var lab2 = srgbToOklab(rgb2.r, rgb2.g, rgb2.b);
        var dL = lab1.L - lab2.L;
        var da = lab1.a - lab2.a;
        var db = lab1.b - lab2.b;
        return Math.sqrt(dL * dL + da * da + db * db);
    }

    /**
     * Delta E OK under simulated Color Vision Deficiency (CVD).
     */
    function cvdDeltaEOk(rgb1, rgb2, type) {
        var sim1 = simulateColorBlindness(rgb1.r, rgb1.g, rgb1.b, type);
        var sim2 = simulateColorBlindness(rgb2.r, rgb2.g, rgb2.b, type);
        return deltaEOk(sim1, sim2);
    }

    /**
     * Multi-objective scoring function for batch generate-and-test candidate evaluation:
     * 1. Semantic contrast (WCAG text/bg, primary/bg, APCA)
     * 2. Perceptual accent distinctness (Delta E OK between swatches)
     * 3. Color vision deficiency safety (CVD simulation for protan/deutan/tritan)
     * 4. Novelty distance (anti-repeat vs last 5 palettes in history)
     * 5. Profile curve adherence
     */
    function scorePaletteCandidate(candidate, profile, history, options) {
        options = options || {};
        var targetRatio = options.targetRatio || 4.5;
        var priColors = candidate.pri;
        if (!priColors || priColors.length < 5) return { totalScore: 0 };

        var bgRgb = priColors[4];
        var textRgb = priColors[3];
        var priRgb = priColors[0];

        // 1. Contrast Score (0-100, weight 35%)
        var textRatio = calcWcagContrast(textRgb, bgRgb);
        var priRatio = calcWcagContrast(priRgb, bgRgb);
        var textScore = textRatio >= 7.0 ? 100 : (textRatio >= targetRatio ? (75 + (textRatio - targetRatio) * 10) : (textRatio / targetRatio * 60));
        var priTarget = targetRatio >= 7.0 ? 4.5 : 3.0;
        var priScore = priRatio >= priTarget ? (80 + Math.min(20, (priRatio - priTarget) * 10)) : (priRatio / priTarget * 60);
        var contrastScore = Math.max(0, Math.min(100, textScore * 0.65 + priScore * 0.35));

        // 2. Accent Distinctness Score (0-100, weight 25%)
        var accents = [priRgb];
        if (candidate.sec1 && candidate.sec1[0]) accents.push(candidate.sec1[0]);
        if (candidate.sec2 && candidate.sec2[0]) accents.push(candidate.sec2[0]);
        if (candidate.compl && candidate.compl[0]) accents.push(candidate.compl[0]);

        var minDelta = 1.0;
        var pairCount = 0;
        for (var i = 0; i < accents.length; i++) {
            for (var j = i + 1; j < accents.length; j++) {
                var dE = deltaEOk(accents[i], accents[j]);
                if (dE < minDelta) minDelta = dE;
                pairCount++;
            }
        }
        var distinctnessScore = 95;
        if (pairCount > 0) {
            if (minDelta >= 0.12) {
                distinctnessScore = 100;
            } else if (minDelta < 0.05) {
                distinctnessScore = Math.max(10, (minDelta / 0.05) * 40);
            } else {
                distinctnessScore = 40 + ((minDelta - 0.05) / 0.07) * 60;
            }
        }

        // 3. CVD Safety Score (0-100, weight 15%)
        var minCvdDelta = 1.0;
        var cvdPairs = 0;
        if (pairCount > 0) {
            var cvdTypes = ["deuteranopia", "protanopia"];
            for (var c = 0; c < cvdTypes.length; c++) {
                for (var ci = 0; ci < accents.length; ci++) {
                    for (var cj = ci + 1; cj < accents.length; cj++) {
                        var cdE = cvdDeltaEOk(accents[ci], accents[cj], cvdTypes[c]);
                        if (cdE < minCvdDelta) minCvdDelta = cdE;
                        cvdPairs++;
                    }
                }
            }
        }
        var cvdScore = 95;
        if (cvdPairs > 0) {
            if (minCvdDelta >= 0.08) {
                cvdScore = 100;
            } else if (minCvdDelta < 0.03) {
                cvdScore = Math.max(15, (minCvdDelta / 0.03) * 45);
            } else {
                cvdScore = 45 + ((minCvdDelta - 0.03) / 0.05) * 55;
            }
        }

        // 4. Novelty Distance Score (0-100, weight 15%)
        var noveltyScore = 100;
        if (history && history.length > 0) {
            var recentDiffs = [];
            for (var h = 0; h < Math.min(5, history.length); h++) {
                var prevHue = history[h].hue !== undefined ? history[h].hue : (history[h].priHue !== undefined ? history[h].priHue : null);
                if (prevHue !== null) {
                    var diffH = Math.abs(candidate.hue - prevHue);
                    var circularDiff = Math.min(diffH, 360 - diffH);
                    recentDiffs.push(circularDiff);
                }
            }
            if (recentDiffs.length > 0) {
                var immediateDiff = recentDiffs[0];
                if (immediateDiff < 15) {
                    noveltyScore = Math.max(20, (immediateDiff / 15) * 50);
                } else if (immediateDiff < 35) {
                    noveltyScore = 50 + ((immediateDiff - 15) / 20) * 35;
                } else {
                    noveltyScore = 85 + Math.min(15, ((immediateDiff - 35) / 50) * 15);
                }
            }
        }

        // 5. Profile Adherence Score (0-100, weight 10%)
        var adherenceScore = 90;
        if (profile && profile.curve) {
            var targetPriL = profile.curve[0][0];
            var priOklch = srgbToOklch(priRgb.r, priRgb.g, priRgb.b);
            var lDiff = Math.abs(priOklch.L - targetPriL);
            adherenceScore = Math.max(40, 100 - lDiff * 150);
        }

        var totalScore = Math.round(
            contrastScore * 0.35 +
            distinctnessScore * 0.25 +
            cvdScore * 0.15 +
            noveltyScore * 0.15 +
            adherenceScore * 0.10
        );

        return {
            totalScore: totalScore,
            contrastScore: Math.round(contrastScore),
            distinctnessScore: Math.round(distinctnessScore),
            cvdScore: Math.round(cvdScore),
            noveltyScore: Math.round(noveltyScore),
            adherenceScore: Math.round(adherenceScore),
            minDelta: minDelta,
            minCvdDelta: minCvdDelta,
            textRatio: textRatio,
            priRatio: priRatio
        };
    }

    /**
     * Generate complete semantic tokens including light & dark modes, functional roles,
     * and 11-step tonal scales (50-950) from the palette.
     */
    function generateSemanticTokens(priRgb, secRgb, complRgb, options) {
        options = options || {};
        var priOklch = srgbToOklch(priRgb.r, priRgb.g, priRgb.b);
        var baseHue = priOklch.H;
        var secRgbActual = secRgb || oklchToSrgb(priOklch.L, priOklch.C, (baseHue + 40) % 360);
        var complRgbActual = complRgb || oklchToSrgb(priOklch.L, priOklch.C, (baseHue + 180) % 360);

        // Scales
        var primaryScale = generateTonalScale(priRgb.r, priRgb.g, priRgb.b, { hueShift: 3 });
        var accentScale = generateTonalScale(secRgbActual.r, secRgbActual.g, secRgbActual.b, { hueShift: 4 });
        var complScale = generateTonalScale(complRgbActual.r, complRgbActual.g, complRgbActual.b, { hueShift: 3 });

        // Functional roles in OKLCH
        var successRgb = oklchToSrgb(0.62, 0.17, 145);
        var warningRgb = oklchToSrgb(0.76, 0.16, 85);
        var dangerRgb = oklchToSrgb(0.58, 0.22, 28);
        var infoRgb = oklchToSrgb(0.62, 0.16, 235);

        var successScale = generateTonalScale(successRgb.r, successRgb.g, successRgb.b);
        var warningScale = generateTonalScale(warningRgb.r, warningRgb.g, warningRgb.b);
        var dangerScale = generateTonalScale(dangerRgb.r, dangerRgb.g, dangerRgb.b);
        var infoScale = generateTonalScale(infoRgb.r, infoRgb.g, infoRgb.b);

        // Light mode semantic roles
        var bgLight = oklchToSrgb(0.985, 0.006, baseHue);
        var surfaceLight = oklchToSrgb(0.95, 0.010, baseHue);
        var surfaceRaisedLight = oklchToSrgb(1.00, 0.002, baseHue);
        var textLight = oklchToSrgb(0.14, 0.015, baseHue);
        var textMutedLight = oklchToSrgb(0.45, 0.020, baseHue);
        var borderLight = oklchToSrgb(0.86, 0.012, baseHue);

        // Dark mode semantic roles
        var bgDark = oklchToSrgb(0.12, 0.015, baseHue);
        var surfaceDark = oklchToSrgb(0.18, 0.020, baseHue);
        var surfaceRaisedDark = oklchToSrgb(0.24, 0.025, baseHue);
        var textDark = oklchToSrgb(0.94, 0.008, baseHue);
        var textMutedDark = oklchToSrgb(0.68, 0.018, baseHue);
        var borderDark = oklchToSrgb(0.28, 0.020, baseHue);

        var hexFromRgb = function(c) {
            return "#" + ((1 << 24) + (c.r << 16) + (c.g << 8) + c.b).toString(16).slice(1).toUpperCase();
        };

        return {
            primary: primaryScale,
            accent: accentScale,
            complement: complScale,
            success: successScale,
            warning: warningScale,
            danger: dangerScale,
            info: infoScale,
            modes: {
                light: {
                    bg: hexFromRgb(bgLight),
                    surface: hexFromRgb(surfaceLight),
                    surfaceRaised: hexFromRgb(surfaceRaisedLight),
                    text: hexFromRgb(textLight),
                    textMuted: hexFromRgb(textMutedLight),
                    border: hexFromRgb(borderLight),
                    primary: hexFromRgb(primaryScale[500] ? primaryScale[500] : priRgb),
                    accent: hexFromRgb(accentScale[500] ? accentScale[500] : secRgbActual),
                    success: hexFromRgb(successScale[500] ? successScale[500] : successRgb),
                    warning: hexFromRgb(warningScale[500] ? warningScale[500] : warningRgb),
                    danger: hexFromRgb(dangerScale[500] ? dangerScale[500] : dangerRgb)
                },
                dark: {
                    bg: hexFromRgb(bgDark),
                    surface: hexFromRgb(surfaceDark),
                    surfaceRaised: hexFromRgb(surfaceRaisedDark),
                    text: hexFromRgb(textDark),
                    textMuted: hexFromRgb(textMutedDark),
                    border: hexFromRgb(borderDark),
                    primary: hexFromRgb(primaryScale[400] ? primaryScale[400] : priRgb),
                    accent: hexFromRgb(accentScale[400] ? accentScale[400] : secRgbActual),
                    success: hexFromRgb(successScale[400] ? successScale[400] : successRgb),
                    warning: hexFromRgb(warningScale[400] ? warningScale[400] : warningRgb),
                    danger: hexFromRgb(dangerScale[400] ? dangerScale[400] : dangerRgb)
                }
            }
        };
    }

    function formatCssVariables(tokens, typography) {
        var out = ":root {\n";
        out += "  /* === Color Scales (50-950) === */\n";
        var scales = ["primary", "accent", "success", "warning", "danger", "info"];
        for (var s = 0; s < scales.length; s++) {
            var name = scales[s];
            var scale = tokens[name];
            if (scale) {
                for (var step in scale) {
                    out += "  --color-" + name + "-" + step + ": " + scale[step].hex + ";\n";
                }
            }
        }

        out += "\n  /* === Semantic Roles (Light Default) === */\n";
        var light = tokens.modes.light;
        for (var role in light) {
            out += "  --color-" + role + ": " + light[role] + ";\n";
        }

        if (typography) {
            out += "\n  /* === Typography Tokens & Fluid Scale === */\n";
            out += "  --font-heading: " + (typography.heading || "sans-serif") + ";\n";
            out += "  --font-body: " + (typography.body || "sans-serif") + ";\n";
            out += "  --font-weight-heading: " + (typography.weightHeading || "700") + ";\n";
            out += "  --letter-spacing-heading: " + (typography.letterSpacing || "-0.025em") + ";\n";
            out += "  --letter-spacing-body: 0em;\n";
            out += "  --letter-spacing-caps: 0.08em;\n";
            out += "  --line-height-heading: " + (typography.lineHeightHeading || "1.2") + ";\n";
            out += "  --line-height-body: " + (typography.lineHeight || "1.6") + ";\n";
            out += "  --type-scale-ratio: " + (typography.scale || "1.25") + ";\n";
            out += "  --font-size-h1: clamp(2.2rem, 1.8rem + 2vw, 3.8rem);\n";
            out += "  --font-size-h2: clamp(1.75rem, 1.5rem + 1.2vw, 2.5rem);\n";
            out += "  --font-size-h3: clamp(1.35rem, 1.25rem + 0.6vw, 1.8rem);\n";
            out += "  --font-size-body: clamp(0.95rem, 0.9rem + 0.25vw, 1.125rem);\n";
            out += "  --font-size-caption: clamp(0.75rem, 0.72rem + 0.15vw, 0.875rem);\n";
            out += "  --content-max-width: 65ch;\n";
        }
        out += "}\n\n";

        out += "/* === Dark Theme === */\n";
        out += "[data-theme=\"dark\"], .dark {\n";
        var dark = tokens.modes.dark;
        for (var dRole in dark) {
            out += "  --color-" + dRole + ": " + dark[dRole] + ";\n";
        }
        out += "}\n";

        return out;
    }

    function formatTailwindConfig(tokens, typography) {
        var extractScale = function(scale) {
            var obj = {};
            if (!scale) return obj;
            for (var step in scale) {
                obj[step] = scale[step].hex;
            }
            if (scale[500]) obj["DEFAULT"] = scale[500].hex;
            return obj;
        };

        var config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        primary: extractScale(tokens.primary),
                        accent: extractScale(tokens.accent),
                        success: extractScale(tokens.success),
                        warning: extractScale(tokens.warning),
                        danger: extractScale(tokens.danger),
                        info: extractScale(tokens.info),
                        bg: "var(--color-bg)",
                        surface: "var(--color-surface)",
                        "surface-raised": "var(--color-surfaceRaised)",
                        text: "var(--color-text)",
                        "text-muted": "var(--color-textMuted)",
                        border: "var(--color-border)"
                    },
                    fontFamily: {
                        heading: [(typography && typography.heading) ? typography.heading.replace(/['"]/g, '').split(',')[0].trim() : "sans-serif", "sans-serif"],
                        body: [(typography && typography.body) ? typography.body.replace(/['"]/g, '').split(',')[0].trim() : "sans-serif", "sans-serif"]
                    }
                }
            }
        };

        return "/** @type {import('tailwindcss').Config} */\nmodule.exports = " + JSON.stringify(config, null, 2) + ";\n";
    }

    function formatDtcgTokens(tokens, typography) {
        var dtcg = {
            "$schema": "https://design-tokens.github.io/community-group/format/",
            "color": {
                "primary": {},
                "accent": {},
                "success": {},
                "warning": {},
                "danger": {},
                "semantic": {
                    "bg": {
                        "light": { "$value": tokens.modes.light.bg, "$type": "color" },
                        "dark": { "$value": tokens.modes.dark.bg, "$type": "color" }
                    },
                    "surface": {
                        "light": { "$value": tokens.modes.light.surface, "$type": "color" },
                        "dark": { "$value": tokens.modes.dark.surface, "$type": "color" }
                    },
                    "text": {
                        "light": { "$value": tokens.modes.light.text, "$type": "color" },
                        "dark": { "$value": tokens.modes.dark.text, "$type": "color" }
                    },
                    "text-muted": {
                        "light": { "$value": tokens.modes.light.textMuted, "$type": "color" },
                        "dark": { "$value": tokens.modes.dark.textMuted, "$type": "color" }
                    },
                    "border": {
                        "light": { "$value": tokens.modes.light.border, "$type": "color" },
                        "dark": { "$value": tokens.modes.dark.border, "$type": "color" }
                    }
                }
            }
        };

        var addScale = function(name, scaleObj) {
            for (var step in scaleObj) {
                dtcg.color[name][step] = {
                    "$value": scaleObj[step].hex,
                    "$type": "color",
                    "$description": "OKLCH L=" + scaleObj[step].L.toFixed(2) + " C=" + scaleObj[step].C.toFixed(3) + " H=" + scaleObj[step].H.toFixed(0)
                };
            }
        };
        addScale("primary", tokens.primary);
        addScale("accent", tokens.accent);
        addScale("success", tokens.success);
        addScale("warning", tokens.warning);
        addScale("danger", tokens.danger);

        if (typography) {
            dtcg.typography = {
                "fontFamily": {
                    "heading": { "$value": typography.heading, "$type": "fontFamily" },
                    "body": { "$value": typography.body, "$type": "fontFamily" }
                },
                "letterSpacing": {
                    "heading": { "$value": typography.letterSpacing || "-0.025em", "$type": "dimension" },
                    "body": { "$value": "0em", "$type": "dimension" }
                },
                "lineHeight": {
                    "heading": { "$value": typography.lineHeightHeading || "1.2", "$type": "number" },
                    "body": { "$value": typography.lineHeight || "1.6", "$type": "number" }
                }
            };
        }

        return JSON.stringify(dtcg, null, 2);
    }

    function formatFigmaTokens(tokens, typography) {
        var figma = {
            "version": "1.0.0",
            "collections": [
                {
                    "name": "Semantic Colors",
                    "modes": ["Light", "Dark"],
                    "variables": [
                        { "name": "color/bg", "type": "COLOR", "values": { "Light": tokens.modes.light.bg, "Dark": tokens.modes.dark.bg } },
                        { "name": "color/surface", "type": "COLOR", "values": { "Light": tokens.modes.light.surface, "Dark": tokens.modes.dark.surface } },
                        { "name": "color/surface-raised", "type": "COLOR", "values": { "Light": tokens.modes.light.surfaceRaised, "Dark": tokens.modes.dark.surfaceRaised } },
                        { "name": "color/text", "type": "COLOR", "values": { "Light": tokens.modes.light.text, "Dark": tokens.modes.dark.text } },
                        { "name": "color/text-muted", "type": "COLOR", "values": { "Light": tokens.modes.light.textMuted, "Dark": tokens.modes.dark.textMuted } },
                        { "name": "color/border", "type": "COLOR", "values": { "Light": tokens.modes.light.border, "Dark": tokens.modes.dark.border } },
                        { "name": "color/primary", "type": "COLOR", "values": { "Light": tokens.modes.light.primary, "Dark": tokens.modes.dark.primary } },
                        { "name": "color/accent", "type": "COLOR", "values": { "Light": tokens.modes.light.accent, "Dark": tokens.modes.dark.accent } },
                        { "name": "color/success", "type": "COLOR", "values": { "Light": tokens.modes.light.success, "Dark": tokens.modes.dark.success } },
                        { "name": "color/warning", "type": "COLOR", "values": { "Light": tokens.modes.light.warning, "Dark": tokens.modes.dark.warning } },
                        { "name": "color/danger", "type": "COLOR", "values": { "Light": tokens.modes.light.danger, "Dark": tokens.modes.dark.danger } }
                    ]
                }
            ]
        };
        return JSON.stringify(figma, null, 2);
    }

    // Comprehensive OKLCH Profiles Dictionary (22 profiles with [L, C] perceptual curves)
    var OKLCH_PROFILES = {
        saas: {
            id: "saas",
            name: "SaaS & Cloud Platform",
            category: "ui",
            hues: [220, 235, 250, 265, 175, 195],
            models: ["analogcompl", "monocompl", "triad"],
            angle: [24, 34],
            curve: [[0.56, 0.16], [0.95, 0.03], [0.72, 0.10], [0.22, 0.04], [0.99, 0.005]],
            typoCategory: "ui"
        },
        minimal: {
            id: "minimal",
            name: "Swiss Minimal & Bauhaus",
            category: "ui",
            hues: [30, 210, 355, 45, 150],
            models: ["mono", "monocompl"],
            angle: [25, 35],
            curve: [[0.50, 0.08], [0.96, 0.01], [0.78, 0.03], [0.18, 0.02], [0.99, 0.002]],
            typoCategory: "ui"
        },
        cyberpunk: {
            id: "cyberpunk",
            name: "Cyberpunk Neon 2077",
            category: "game",
            hues: [195, 325, 140, 60],
            models: ["triad", "analogcompl"],
            angle: [30, 50],
            curve: [[0.72, 0.25], [0.86, 0.18], [0.60, 0.22], [0.16, 0.06], [0.08, 0.03]],
            typoCategory: "game"
        },
        darkui: {
            id: "darkui",
            name: "Modern Dark Mode",
            category: "ui",
            hues: [215, 240, 275, 310, 180],
            models: ["monocompl", "analogcompl", "triadcompl"],
            angle: [25, 40],
            curve: [[0.65, 0.17], [0.82, 0.08], [0.50, 0.12], [0.20, 0.03], [0.11, 0.015]],
            typoCategory: "ui"
        },
        luxury: {
            id: "luxury",
            name: "Luxury & High Jewelry",
            category: "editorial",
            hues: [75, 82, 350, 240],
            models: ["monocompl", "triadcompl"],
            angle: [28, 42],
            curve: [[0.68, 0.12], [0.95, 0.02], [0.52, 0.10], [0.18, 0.03], [0.98, 0.008]],
            typoCategory: "editorial"
        },
        nature: {
            id: "nature",
            name: "Organic Botanical",
            category: "ui",
            hues: [135, 145, 155, 65, 80],
            models: ["analogcompl", "analog", "triad"],
            angle: [25, 35],
            curve: [[0.55, 0.11], [0.94, 0.025], [0.70, 0.08], [0.24, 0.04], [0.98, 0.008]],
            typoCategory: "ui"
        },
        playful: {
            id: "playful",
            name: "Playful & EdTech",
            category: "ui",
            hues: [45, 140, 240, 340],
            models: ["triad", "tetrad"],
            angle: [30, 48],
            curve: [[0.65, 0.22], [0.93, 0.06], [0.75, 0.18], [0.25, 0.08], [0.98, 0.015]],
            typoCategory: "ui"
        },
        pastel: {
            id: "pastel",
            name: "Soft Pastel Calm",
            category: "ui",
            hues: [195, 260, 330, 140],
            models: ["triad", "analogcompl", "mono"],
            angle: [25, 35],
            curve: [[0.82, 0.07], [0.96, 0.02], [0.88, 0.05], [0.35, 0.04], [0.99, 0.005]],
            typoCategory: "ui"
        },
        monochrome: {
            id: "monochrome",
            name: "Pure Monochromatic",
            category: "ui",
            hues: [220],
            models: ["mono"],
            angle: [30, 30],
            curve: [[0.50, 0.01], [0.95, 0.002], [0.75, 0.005], [0.22, 0.005], [0.99, 0.001]],
            typoCategory: "ui"
        },
        earth: {
            id: "earth",
            name: "Warm Earth & Terracotta",
            category: "ui",
            hues: [45, 60, 75, 85],
            models: ["analogcompl", "triad"],
            angle: [25, 38],
            curve: [[0.52, 0.09], [0.93, 0.03], [0.68, 0.07], [0.22, 0.03], [0.98, 0.01]],
            typoCategory: "ui"
        },
        ocean: {
            id: "ocean",
            name: "Deep Ocean & Aqua",
            category: "ui",
            hues: [190, 210, 230, 245],
            models: ["analog", "analogcompl"],
            angle: [25, 35],
            curve: [[0.55, 0.14], [0.94, 0.03], [0.72, 0.10], [0.20, 0.05], [0.98, 0.008]],
            typoCategory: "ui"
        },
        sunset: {
            id: "sunset",
            name: "Sunset Gradient",
            category: "ui",
            hues: [25, 45, 70, 320, 340],
            models: ["analogcompl", "triad"],
            angle: [28, 44],
            curve: [[0.62, 0.19], [0.94, 0.04], [0.74, 0.14], [0.22, 0.06], [0.98, 0.01]],
            typoCategory: "ui"
        },
        neutral_accent: {
            id: "neutral_accent",
            name: "Neutral Gray with Vibrant Accent",
            category: "ui",
            hues: [25, 140, 220, 280, 340],
            models: ["monocompl"],
            angle: [30, 30],
            curve: [[0.60, 0.20], [0.95, 0.005], [0.80, 0.01], [0.20, 0.01], [0.99, 0.002]],
            typoCategory: "ui"
        },
        editorial: {
            id: "editorial",
            name: "High Editorial Magazine",
            category: "editorial",
            hues: [30, 45, 140, 220, 350],
            models: ["analogcompl", "triad"],
            angle: [26, 40],
            curve: [[0.48, 0.11], [0.95, 0.015], [0.70, 0.08], [0.18, 0.025], [0.98, 0.005]],
            typoCategory: "editorial"
        },
        retro: {
            id: "retro",
            name: "Retro Synth & 70s Warmth",
            category: "editorial",
            hues: [45, 75, 145, 195],
            models: ["triad", "tetrad"],
            angle: [30, 46],
            curve: [[0.58, 0.13], [0.92, 0.04], [0.72, 0.10], [0.26, 0.05], [0.97, 0.02]],
            typoCategory: "editorial"
        },
        game_rpg: {
            id: "game_rpg",
            name: "Dark Fantasy RPG (Elden/Witcher)",
            category: "game",
            hues: [75, 30, 355, 275],
            models: ["triadcompl", "analogcompl", "tetrad"],
            angle: [26, 40],
            curve: [[0.65, 0.15], [0.92, 0.03], [0.48, 0.12], [0.18, 0.04], [0.08, 0.02]],
            typoCategory: "game"
        },
        game_cyberpunk: {
            id: "game_cyberpunk",
            name: "Sci-Fi HUD & Hologram",
            category: "game",
            hues: [195, 325, 140, 95],
            models: ["triad", "analogcompl", "tetrad"],
            angle: [32, 54],
            curve: [[0.74, 0.26], [0.88, 0.18], [0.60, 0.22], [0.15, 0.08], [0.06, 0.03]],
            typoCategory: "game"
        },
        game_arcade: {
            id: "game_arcade",
            name: "8-Bit Retro Arcade (NES/Famicom)",
            category: "game",
            hues: [30, 140, 230, 350],
            models: ["triad", "tetrad"],
            angle: [35, 55],
            curve: [[0.68, 0.24], [0.90, 0.12], [0.76, 0.20], [0.22, 0.10], [0.98, 0.01]],
            typoCategory: "game"
        },
        game_fps: {
            id: "game_fps",
            name: "Tactical Military FPS (CoD/Arma)",
            category: "game",
            hues: [115, 75, 50, 215],
            models: ["monocompl", "analogcompl"],
            angle: [24, 34],
            curve: [[0.48, 0.09], [0.88, 0.03], [0.62, 0.07], [0.20, 0.03], [0.10, 0.02]],
            typoCategory: "game"
        },
        game_horror: {
            id: "game_horror",
            name: "Survival Horror (Resident Evil)",
            category: "game",
            hues: [25, 355, 175, 270],
            models: ["monocompl", "triad"],
            angle: [25, 42],
            curve: [[0.42, 0.14], [0.75, 0.05], [0.35, 0.10], [0.14, 0.03], [0.05, 0.015]],
            typoCategory: "game"
        },
        game_cozy: {
            id: "game_cozy",
            name: "Cozy / Casual Mobile (Animal Crossing)",
            category: "game",
            hues: [340, 65, 150, 205],
            models: ["triad", "tetrad", "analogcompl"],
            angle: [28, 48],
            curve: [[0.72, 0.17], [0.94, 0.05], [0.82, 0.13], [0.32, 0.06], [0.99, 0.01]],
            typoCategory: "game"
        },
        game_esports: {
            id: "game_esports",
            name: "Esports Arena (Apex/Valorant)",
            category: "game",
            hues: [85, 355, 200, 275],
            models: ["monocompl", "triad"],
            angle: [34, 52],
            curve: [[0.70, 0.25], [0.88, 0.15], [0.55, 0.20], [0.16, 0.06], [0.07, 0.025]],
            typoCategory: "game"
        },
        game_space: {
            id: "game_space",
            name: "Deep Space Sci-Fi (EVE/Starfield)",
            category: "game",
            hues: [190, 280, 45, 230],
            models: ["analogcompl", "triadcompl"],
            angle: [28, 46],
            curve: [[0.62, 0.18], [0.86, 0.10], [0.50, 0.15], [0.16, 0.05], [0.07, 0.02]],
            typoCategory: "game"
        }
    };

    return {
        srgbToLinear: srgbToLinear,
        linearToSrgb: linearToSrgb,
        srgbToOklab: srgbToOklab,
        oklabToOklch: oklabToOklch,
        oklchToOklab: oklchToOklab,
        srgbToOklch: srgbToOklch,
        oklchToSrgb: oklchToSrgb,
        formatCssOklch: formatCssOklch,
        generateTonalScale: generateTonalScale,
        calcAPCA: calcAPCA,
        getRelativeLuminance: getRelativeLuminance,
        calcWcagContrast: calcWcagContrast,
        simulateColorBlindness: simulateColorBlindness,
        interpolateOklab: interpolateOklab,
        parseCssColor: parseCssColor,
        rgbToHsl: rgbToHsl,
        formatColorString: formatColorString,
        formatHexColor: formatHexColor,
        TONAL_STEPS: TONAL_STEPS,
        TONAL_LIGHTNESS: TONAL_LIGHTNESS,
        mulberry32: mulberry32,
        stringToSeed: stringToSeed,
        generateSeed: generateSeed,
        randomGaussian: randomGaussian,
        fitContrast: fitContrast,
        fitContrastApca: fitContrastApca,
        auditSemanticContrast: auditSemanticContrast,
        deltaEOk: deltaEOk,
        cvdDeltaEOk: cvdDeltaEOk,
        scorePaletteCandidate: scorePaletteCandidate,
        generateSemanticTokens: generateSemanticTokens,
        formatCssVariables: formatCssVariables,
        formatTailwindConfig: formatTailwindConfig,
        formatDtcgTokens: formatDtcgTokens,
        formatFigmaTokens: formatFigmaTokens,
        OKLCH_PROFILES: OKLCH_PROFILES
    };
});
