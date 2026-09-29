define("color.convert", ["color.rgb.class", "util"], function(e, t) {
    var n, r;
    return n = {
        protanope: {
            x: .7465,
            y: .2535,
            m: 1.273463,
            yint: -0.073894
        },
        deuteranope: {
            x: 1.4,
            y: -0.4,
            m: .968437,
            yint: .003331
        },
        tritanope: {
            x: .1748,
            y: 0,
            m: .062921,
            yint: .292119
        }
    }, r = {
        convert: function(r, i) {
            var s, o, u, a, f, l, c, h, p, d, v, m, g, y, b, w, E, S, x, T, N, C, k, L, A, O, M, _, D, P, H, B, j, F, I, q, R, U, z, W;
            return g = {
                type: "none",
                amount: 1
            }, B = t.objMerge(g, i), z = B.type, f = B.amount, f > 1 && (f = 1), f < 0 && (f = 0), U = r.r, R = r.g, q = r.b, C = U, w = C, m = C, z === "webcolor" ? (C = Math.round(U / 51) * 51, w = Math.round(R / 51) * 51, m = Math.round(q / 51) * 51, new e(C, w, m)) : z === "gamma" ? (O = f * 3, C = 255 * Math.pow(U / 255, O), w = 255 * Math.pow(R / 255, O), m = 255 * Math.pow(q / 255, O), new e(C >> 0, w >> 0, m >> 0)) : z === "gray" ? (_ = Math.round(r.getLum() * 255), C = U * (1 - f) + _ * f, w = R * (1 - f) + _ * f, m = q * (1 - f) + _ * f, new e(C >> 0, w >> 0, m >> 0)) : z === "achromatope" ? (C = U * .212656 + R * .715158 + q * .072186, C = U * (1 - f) + C * f, w = R * (1 - f) + C * f, m = q * (1 - f) + C * f, new e(C >> 0, w >> 0, m >> 0)) : (z === "custom" ? (p = B.x, d = B.y, h = B.m, v = B.yint) : (M = n[B.type]) ? (p = M.x, d = M.y, h = M.m, v = M.yint) : z = "none", B.type === "none" ? r : (U === 0 && R === 0 && q === 0 ? new e(0, 0, 0) : (I = Math.pow(U, 2.2), F = Math.pow(R, 2.2), j = Math.pow(q, 2.2), s = I * .412424 + F * .357579 + j * .180464, o = I * .212656 + F * .715158 + j * .0721856, u = I * .0193324 + F * .119193 + j * .950444, l = s / (s + o + u), c = o / (s + o + u), D = (c - d) / (l - p), W = c - l * D, y = (v - W) / (D - h), b = D * y + W, s = y * o / b, u = (1 - (y + b)) * o / b, P = .312713 * o / .329016, H = .358271 * o / .329016, E = P - s, S = H - u, N = E * 3.24071 + S * -0.498571, T = E * -0.969258 + S * .0415557, x = E * .0556352 + S * 1.05707, C = s * 3.24071 + o * -1.53726 + u * -0.498571, w = s * -0.969258 + o * 1.87599 + u * .0415557, m = s * .0556352 + o * -0.203996 + u * 1.05707, A = ((C < 0 ? 0 : 1) - C) / N, L = ((w < 0 ? 0 : 1) - w) / T, k = ((m < 0 ? 0 : 1) - m) / x, a = Math.max(A > 1 || A < 0 ? 0 : A, L > 1 || L < 0 ? 0 : L, k > 1 || k < 0 ? 0 : k), C += a * N, w += a * T, m += a * x, C = Math.pow(Math.max(0, C), 1 / 2.2), w = Math.pow(Math.max(0, w), 1 / 2.2), m = Math.pow(Math.max(0, m), 1 / 2.2), C = U * (1 - f) + C * f, w = R * (1 - f) + w * f, m = q * (1 - f) + m * f, new e(C >> 0, w >> 0, m >> 0))))
        }
    }, r
});
