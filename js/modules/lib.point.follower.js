define("lib.point.follower", [], function() {
    var e, t, n;
    return t = function() {
        function t(e, t) {
            this.x = Math.max(-1, Math.min(1, e)), this.y = Math.max(-1, Math.min(1, t))
        }
        return t.prototype.toDef = function() {
            var t, n, r, i, s;
            return r = this.rot_z(Math.PI / 4), r.x < 1 ? (t = r.y / Math.sqrt(1 - r.x * r.x), t = Math.max(-1, Math.min(1, t)), i = Math.asin(t)) : i = 0, r.y < 1 ? (n = r.x, n = Math.max(-1, Math.min(1, n)), s = Math.asin(n)) : s = 0, new e(s, i)
        }, t.prototype.rot_z = function(e) {
            return new t(this.x * Math.cos(e) + this.y * Math.sin(e), -this.x * Math.sin(e) + this.y * Math.cos(e))
        }, t
    }(), e = function() {
        function e(e, t) {
            this.psi = e, this.phi = t
        }
        return e.prototype.toLoc = function() {
            var e, n, r, i, s;
            return r = Math.min(Math.max(this.psi, -Math.PI / 2), Math.PI / 2), n = Math.min(Math.max(this.phi, -Math.PI / 2), Math.PI / 2), i = Math.sin(r), s = Math.sin(n) * Math.cos(r), e = new t(i, s), e.rot_z(-Math.PI / 4)
        }, e.prototype.rot_x = function(t) {
            var n, r;
            return n = Math.cos(this.psi), r = n ? (this.phi / n + t) * n : this.phi, new e(this.psi, r)
        }, e.prototype.rot_y = function(t) {
            return new e(this.psi + t, this.phi)
        }, e
    }(), n = {
        createLoc: function(e, n) {
            return new t(e, n)
        },
        createDef: function(t, n) {
            return new e(t, n)
        },
        getLoc: function(e, t) {
            return t.rot_x(e.toDef().phi).rot_y(e.toDef().psi).toLoc()
        },
        getDef: function(e, t) {
            return t.toDef().rot_y(-e.toDef().psi).rot_x(-e.toDef().phi)
        }
    }, n
});
