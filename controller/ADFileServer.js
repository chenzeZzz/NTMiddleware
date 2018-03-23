module.exports = function() {
	var r = require("path");
	var e = require("fs");
	var t = r.basename(__filename, ".js");
	var n = false;
	var startServer = function(r) {
			n = true;
			r(100, t + " Started")
		};
	var stopServer = function(r) {
			n = false;
			r(100, t + " Stopped")
		};
	var isStarted = function() {
			return n
		};
	var listDir = function(path, t) {
			if (!n) {
				t(201);
				return
			}
			e.readdir(path, function(err, files) {
				if (err) {
					t(201, err)
				} else {
					t(100, files)
				}
			})
		};
	var listFile = function(r) {};
	var s = function(r) {};
	return {
		startServer: startServer,
		stopServer: stopServer,
		isStarted: isStarted,
		listDir: listDir,
		listFile: listFile
	}
};