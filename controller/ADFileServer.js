module.exports = function() {
	var r = require("path");
	var e = require("fs");
	var t = r.basename(__filename, ".js");
	var n = false;
	var a = function(r) {
			n = true;
			r(100, t + " Started")
		};
	var i = function(r) {
			n = false;
			r(100, t + " Stopped")
		};
	var u = function() {
			return n
		};
	var f = function(r, t) {
			if (!n) {
				t(201);
				return
			}
			e.readdir(r, function(r, e) {
				if (r) {
					t(201, r)
				} else {
					t(100, e)
				}
			})
		};
	var o = function(r) {};
	var s = function(r) {};
	return {
		startServer: a,
		stopServer: i,
		isStarted: u,
		listDir: f,
		listFile: o
	}
};