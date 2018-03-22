module.exports = function(t, r, e) {
	var o = require("path");
	var a = require("async");
	var n = require("body-parser");
	var i = require("./ADBrain.js")();
	var l = require("../const.js");
	var u = require("../model/MDSCWPInterface.js")();
	var s = o.basename(__filename, ".js");
	var c = "[" + s + "] " + "Interface banned => ";
	var f = false;
	var S = false;
	if (!i.checkIsNull(l.autorun_config[s])) {
		S = l.autorun_config[s]
	}
	var d = function(t, r) {
			global.logger.warn(c + "getToken");
			e(r, 200, "getToken Service Stopped")
		};
	r.all(t + "/getToken", function(t, r) {
		d(t, r)
	});
	var g = function(t, r) {
			global.logger.warn(c + "startPatrolJob");
			e(r, 200, "startPatrolJob Service Stopped")
		};
	r.all(t + "/startPatrolJob", n.text(), function(t, r) {
		g(t, r)
	});
	var p = function(t, r) {
			global.logger.warn(c + "stopPatrolJob");
			e(r, 200, "stopPatrolJob Service Stopped")
		};
	r.all(t + "/stopPatrolJob", n.text(), function(t, r) {
		p(t, r)
	});
	var v = function(t, r) {
			global.logger.warn(c + "enterManualMode");
			e(r, 200, "enterManualMode Service Stopped")
		};
	r.all(t + "/enterManualMode", n.text(), function(t, r) {
		v(t, r)
	});
	var b = function(t, r) {
			global.logger.warn(c + "exitManualMode");
			e(r, 200, "exitManualMode Service Stopped")
		};
	r.all(t + "/exitManualMode", n.text(), function(t, r) {
		b(t, r)
	});
	var y = function(t, r) {
			global.logger.warn(c + "manualMoving");
			e(r, 200, "manualMoving Service Stopped")
		};
	r.all(t + "/manualMoving", n.text(), function(t, r) {
		y(t, r)
	});
	var M = function(t, r) {
			global.logger.warn(c + "getRobotStatus");
			e(r, 200, "getRobotStatus Service Stopped")
		};
	r.all(t + "/getRobotStatus", n.text(), function(t, r) {
		M(t, r)
	});
	var J = function(t, r) {
			global.logger.warn(c + "getMotorStatus");
			e(r, 200, "getMotorStatus Service Stopped")
		};
	r.all(t + "/getMotorStatus", n.text(), function(t, r) {
		J(t, r)
	});
	var N = function() {
			if (!S) return;
			d = function(t, r) {
				e(r, 100, "_token_")
			};
			g = function(t, r) {
				try {
					JSON.parse(t.body)
				} catch (t) {
					result = {
						result: "1",
						description: "failed,MESSAGE: Error Format of Request Body"
					};
					r.end(JSON.stringify(result));
					return
				}
				var e = JSON.parse(t.body);
				var o = e["robot_ip"];
				var a = e["robot_port"];
				u.changeRobotState(o, a, 1, function(t) {
					r.end(JSON.stringify(t))
				})
			};
			p = function(t, r) {
				try {
					JSON.parse(t.body)
				} catch (t) {
					result = {
						result: "1",
						description: "failed,MESSAGE: Error Format of Request Body"
					};
					r.end(JSON.stringify(result));
					return
				}
				var e = JSON.parse(t.body);
				var o = e["robot_ip"];
				var a = e["robot_port"];
				u.changeRobotState(o, a, 0, function(t) {
					r.end(JSON.stringify(t))
				})
			};
			v = function(t, r) {
				try {
					JSON.parse(t.body)
				} catch (t) {
					result = {
						result: "1",
						description: "failed,MESSAGE: Error Format of Request Body"
					};
					r.end(JSON.stringify(result));
					return
				}
				var e = JSON.parse(t.body);
				var o = e["cmd"];
				var a = e["robot_ip"];
				var n = e["robot_port"];
				u.changeRobotHandMode(a, n, 0, function(t) {
					r.end(JSON.stringify(t))
				})
			};
			b = function(t, r) {
				try {
					JSON.parse(t.body)
				} catch (t) {
					result = {
						result: "1",
						description: "failed,MESSAGE: Error Format of Request Body"
					};
					r.end(JSON.stringify(result));
					return
				}
				var e = JSON.parse(t.body);
				var o = e["robot_ip"];
				var a = e["robot_port"];
				u.changeRobotHandMode(o, a, 1, function(t) {
					r.end(JSON.stringify(t))
				})
			};
			y = function(t, r) {
				try {
					JSON.parse(t.body)
				} catch (t) {
					result = {
						result: "1",
						description: "failed,MESSAGE: Error Format of Request Body"
					};
					r.end(JSON.stringify(result));
					return
				}
				var e = JSON.parse(t.body);
				var o = e["robot_ip"];
				var a = e["robot_port"];
				var n = parseFloat(e["slide"]);
				var i = parseFloat(e["rise"]);
				var l = parseFloat(e["stretch"]);
				var s = undefined;
				if (n >= -1 && n < 0) {
					s = 0
				} else if (n == 0) {
					s = -1
				} else if (n > 0 && n <= 1) {
					s = 99999999
				}
				var c = undefined;
				if (i >= -1 && i < 0) {
					c = 0
				} else if (i == 0) {
					c = -1
				} else if (i > 0 && i <= 1) {
					c = 1600
				}
				var f = undefined;
				if (l >= -1 && l < 0) {
					f = Math.abs(l) * 6500
				} else if (l == 0) {
					f = 0
				} else if (l > 0 && l <= 1) {
					f = Math.abs(l) * 6500 + 3e4
				}
				u.manualMoving(o, a, s, c, f, function(t) {
					r.end(JSON.stringify(t))
				})
			};
			M = function(t, r) {
				try {
					JSON.parse(t.body)
				} catch (t) {
					result = {
						result: "1",
						description: "failed,MESSAGE: Error Format of Request Body"
					};
					r.end(JSON.stringify(result));
					return
				}
				var e = JSON.parse(t.body);
				var o = e["robot_ip"];
				var a = e["robot_port"];
				u.getRobotStatus(o, a, function(t) {
					r.end(JSON.stringify(t))
				})
			};
			J = function(t, r) {
				try {
					JSON.parse(t.body)
				} catch (t) {
					result = {
						result: "1",
						description: "failed,MESSAGE: Error Format of Request Body"
					};
					r.end(JSON.stringify(result));
					return
				}
				var e = JSON.parse(t.body);
				var o = e["robot_ip"];
				var a = e["robot_port"];
				u.getMotorStatus(o, a, function(t) {
					r.end(JSON.stringify(t))
				})
			}
		};
	var O = function() {
			d = function(t, r) {
				global.logger.warn(c + "getToken");
				e(r, 200, "getToken Service Stopped")
			};
			g = function(t, r) {
				global.logger.warn(c + "startPatrolJob");
				e(r, 200, "startPatrolJob Service Stopped")
			};
			p = function(t, r) {
				global.logger.warn(c + "stopPatrolJob");
				e(r, 200, "stopPatrolJob Service Stopped")
			};
			v = function(t, r) {
				global.logger.warn(c + "enterManualMode");
				e(r, 200, "enterManualMode Service Stopped")
			};
			b = function(t, r) {
				global.logger.warn(c + "exitManualMode");
				e(r, 200, "exitManualMode Service Stopped")
			};
			y = function(t, r) {
				global.logger.warn(c + "manualMoving");
				e(r, 200, "manualMoving Service Stopped")
			};
			M = function(t, r) {
				global.logger.warn(c + "getRobotStatus");
				e(r, 200, "getRobotStatus Service Stopped")
			};
			J = function(t, r) {
				global.logger.warn(c + "getMotorStatus");
				e(r, 200, "getMotorStatus Service Stopped")
			}
		};
	if (S) {
		N()
	}
	var E = function() {
			return s
		};
	var _ = function() {
			return S
		};
	var m = function() {
			return f
		};
	var R = function(t) {
			S = true;
			N();
			t(100, s + " Service Started")
		};
	var h = function(t) {
			S = false;
			O();
			t(100, s + " Service Stopped")
		};
	return {
		getTag: E,
		isStarted: _,
		isBanned: m,
		startServer: R,
		stopServer: h
	}
};