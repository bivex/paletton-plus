define("app.locale", [], function() {
    return function(e, t) {
        var n, r, i, s, o, u;
        try {
            n = e.split("."), s = _Paletton_Strings;
            for (o = 0, u = n.length; o < u; o++) i = n[o], s = s[i];
            return t === 1 ? s.toLocaleLowerCase() : t === 2 ? s.toLocaleUpperCase() : s
        } catch (a) {
            return r = a, "???"
        }
    }
});
