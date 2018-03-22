module.exports = function(e, n, t) {
	var r = require("path");
	var o = require("async");
	var i = require("body-parser");
	var a = require("./ADBrain.js")();
	var l = require("../const.js");
	var c = require("../model/MDNTRDeliver.js")();
	var u = r.basename(__filename, ".js");
	var v = "[" + u + "] " + "Interface banned => ";
	var f = false;
	var d = false;
	if (!a.checkIsNull(l.autorun_config[u])) {
		d = l.autorun_config[u]
	}
	var s = function(e, n) {
			global.logger.warn(v + "getToken");
			t(n, 200, "getToken Stopped")
		};
	n.all(e + "/getToken", function(e, n) {
		s(e, n)
	});
	var g = function(e, n) {
			global.logger.warn(v + "jobReveiver");
			t(n, 200, "jobReveiver Stopped")
		};
	n.all(e + "/jobReveiver", function(e, n) {
		g(e, n)
	});
	var b = function(e, n) {
			global.logger.warn(v + "deviceUnitCatcher");
			t(n, 200, "deviceUnitCatcher Stopped")
		};
	n.all(e + "/deviceUnitCatcher", function(e, n) {
		b(e, n)
	});
	var p = function() {
			if (!d) return;
			s = function(e, n) {
				t(n, 100, "_token_")
			};
			g = function(e, n) {
				if (a.checkIsNull(e.query["robot_id"], "jobReveiver")) {
					t(n, 205, "robot_id");
					return
				}
				if (a.checkIsNull(e.query["queue_id"], "jobReveiver")) {
					t(n, 205, "queue_id");
					return
				}
				t(n, 100);
				var r = e.query["robot_id"];
				var o = e.query["queue_id"];
				c.updateJob(r, o, function(e, n) {
					if (e != 100) {
						global.logger.error("[" + u + "] " + "jobReveiver => CODE: %s MESSAGE: %s DATA: %s", e, l.error_code[e], JSON.stringify(n))
					}
				})
			};
			b = function(e, n) {
				if (a.checkIsNull(e.query["robot_id"], "deviceUnitCatcher")) {
					t(n, 205, "robot_id");
					return
				}
				o.auto({
					getRobot: function(n) {
						c.getRobot(e.query["robot_id"], function(e, t) {
							if (e == 100) {
								n(null, t)
							} else {
								n(e, t)
							}
						})
					},
					getDeviceUnit: ["getRobot", function(e, n) {
						if (a.checkIsNull(e["getRobot"], "deviceUnitCatcher")) return;
						c.getDeviceUnit(e["getRobot"][0], function(e, t) {
							if (e == 100) {
								n(null, t)
							} else {
								n(e, t)
							}
						})
					}],
					analyzeData: ["getDeviceUnit", function(e, t) {
						var r = e["getDeviceUnit"];
						var o = "<!DOCTYPE PathPlan>\n";
						o += '<station name="XXX">\n';
						o += "<devices>\n";
						r.forEach(function(e) {
							o += '<device id="' + e["unit_code"] + '" name="' + e["unit_name"] + '">\n';
							var n = e["object"];
							for (var t = 0; t < n.length; ++t) {
								o += '<waypoint number="' + t + '"> \n';
								o += '<field name="name" value="' + n[t]["object_name"] + '"/>\n';
								o += '<field name="code" value="' + n[t]["object_code"] + '"/>\n';
								o += '<field name="slide" value="' + n[t]["object_posx"] + '"/>\n';
								o += '<field name="rise" value="' + n[t]["object_posy"] + '"/>\n';
								o += '<field name="stretch_l" value="' + n[t]["object_posz"] + '"/>\n';
								o += '<field name="stretch_r" value="0"/>\n';
								o += '<field name="roll" value="0"/>\n';
								o += '<field name="pitch" value="0"/>\n';
								o += '<field name="yaw" value="0"/>\n';
								o += '<field name="zoom_c" value="0"/>\n';
								o += '<field name="zoom_t" value="0"/>\n';
								o += '<field name="type" value="' + n[t]["object_type"] + '"/>\n';
								o += '<field name="descript" value="0"/>\n';
								o += "</waypoint>\n"
							}
							o += "</device>\n"
						});
						o += "</devices>\n";
						o += "</station>";
						n.set("Content-Type", "application/xml;charset=utf-8;");
						n.set("Content-Disposition", 'attachment; filename="device_unit.xml"');
						n.end(o)
					}]
				}, function(e, n) {
					if (e != null) {
						global.logger.error("[" + u + "] " + "deviceUnitCatcher => CODE: %s MESSAGE: %s DATA: %s", e, l.error_code[e], JSON.stringify(n))
					}
				})
			}
		};
	var _ = function() {
			s = function(e, n) {
				global.logger.warn(v + "getToken");
				t(n, 200, "getToken Stopped")
			};
			g = function(e, n) {
				global.logger.warn(v + "jobReveiver");
				t(n, 200, "jobReveiver Stopped")
			};
			b = function(e, n) {
				global.logger.warn(v + "deviceUnitCatcher");
				t(n, 200, "deviceUnitCatcher Stopped")
			}
		};
	if (d) {
		p()
	}
	var m = function() {
			return u
		};
	var h = function() {
			return d
		};
	var j = function() {
			return f
		};
	var y = function(e) {
			d = true;
			p();
			e(100, u + " Started")
		};
	var S = function(e) {
			d = false;
			_();
			e(100, u + " Stopped")
		};
	return {
		getTag: m,
		isStarted: h,
		isBanned: j,
		startServer: y,
		stopServer: S
	}
};