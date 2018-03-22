module.exports = function(r) {
	var e = require("path");
	var n = require("async");
	var a = require("./ADBrain.js")();
	var t = require("../const.js");
	var i = require("../model/MDNTRLooper.js")();
	var u = e.basename(__filename, ".js");
	var o = false;
	var f = false;
	if (!a.checkIsNull(t.autorun_config[u])) {
		f = t.autorun_config[u]
	}
	var s = undefined;
	var v = t.Looper_timer_interval;
	var c = function() {
			i.schedule2Job(function(r, e) {
				if (r != 100) {
					global.logger.error("[" + u + "] " + "schedule2Job => CODE: %s MESSAGE: %s DATA: %s", r, t.error_code[r], JSON.stringify(e));
					o = true
				} else {
					o = false
				}
			})
		};
	var l = function() {
			if (!f) return;
			var r = function() {
					c()
				};
			r();
			s = setInterval(function() {
				r()
			}, v)
		};
	var d = function() {
			if (s != undefined) {
				clearInterval(s)
			}
		};
	if (f) {
		l()
	}
	var g = function() {
			return u
		};
	var S = function() {
			return f
		};
	var p = function() {
			return o
		};
	var _ = function(r) {
			f = true;
			l();
			r(100, u + " Started")
		};
	var m = function(r) {
			f = false;
			d();
			r(100, u + " Stopped")
		};
	return {
		getTag: g,
		isStarted: S,
		isBanned: p,
		startServer: _,
		stopServer: m
	}
};