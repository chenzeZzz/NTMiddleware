module.exports = function(e) {
	var r = require("path");
	var n = require("async");
	var t = require("http");
	var a = require("https");
	var i = require("ws");
	var o = require("./ADBrain.js")();
	var s = require("../const.js");
	var u = r.basename(__filename, ".js");
	var c = false;
	var f = false;
	if (!o.checkIsNull(s.autorun_config[u])) {
		f = s.autorun_config[u]
	}
	var v = undefined;
	var l = function() {
			if (!f) return;
			v = new i.Server({
				server: e
			});
			v.on("connection", function e(r) {
				global.logger.info("[" + u + "] " + "Connected => customer_count: " + v.clients.size);
				var n = setTimeout(function() {
					r.close()
				}, s.ws_params.ws_heart_interval);
				r.on("close", function e() {
					global.logger.error("[" + u + "] " + "Disconnected => customer_count: " + v.clients.size)
				});
				r.on("message", function e(t) {
					if (s.run_env < 2) {
						global.logger.info("[" + u + "] " + "Received: " + t)
					}
					switch (t) {
					case "Heart":
						{
							clearTimeout(n);
							n = setTimeout(function() {
								r.close()
							}, s.ws_params.ws_heart_interval);
							break
						}
					}
				})
			})
		};
	var d = function() {
			if (v != undefined) {
				v.close();
				v = undefined
			}
		};
	if (f) {
		l()
	}
	var g = function() {
			return u
		};
	var _ = function() {
			return f
		};
	var m = function(e) {
			f = true;
			l();
			e(100, u + " Started")
		};
	var p = function(e) {
			f = false;
			d();
			e(100, u + " Stopped")
		};
	var h = function(e) {
			if (!f) return;
			v.clients.forEach(function r(n) {
				if (n.readyState === i.OPEN) {
					n.send(e)
				}
			})
		};
	return {
		getTag: g,
		isStarted: _,
		startServer: m,
		stopServer: p,
		wsBroadcast: h
	}
};