module.exports = function() {
	var e = require("path");
	var t = require("../const.js");
	var o = require("./MDBrainNTR.js")();
	var n = require("../controller/ADBrain.js")();
	var r = require("./MDNTRDeliver.js")();
	var a = require("async");
	var s = e.basename(__filename, ".js");
	var u = function(e, o, r) {
			if (n.checkIsNull(e, "getRobotStatus")) return;
			if (n.checkIsNull(o, "getRobotStatus")) return;
			a.auto({
				getRobotStatus: function(t) {
					var r = {
						options: {
							hostname: e,
							port: o,
							path: "/cloud/robotStatus",
							method: "GET"
						}
					};
					n.mRequest(r, function(e, o) {
						if (e == 100) {
							t(null, o)
						} else {
							t(e, o)
						}
					})
				}
			}, function(e, o) {
				if (n.checkIsNull(o["getRobotStatus"]["body"], "getRobotStatus")) return;
				var a = JSON.parse(o["getRobotStatus"]["body"])["value"];
				var u = t.ROBOT_STATUS[a[0]];
				var i = [];
				for (var l = 0; l < t.ROBOT_ERROR.length; ++l) {
					if (a[1] & 1 << l) {
						i.push(t.ROBOT_ERROR[l])
					}
				}
				var c = undefined;
				if (e == null) {
					c = {
						result: "0",
						description: "success",
						callBack: {
							status: u,
							errors: i
						}
					}
				} else {
					n.generateLog(s, "getRobotStatus", e, o);
					c = {
						result: "1",
						description: "failed,CODE: " + e + " MESSAGE: " + t.error_code[e]
					}
				}
				r(c)
			})
		};
	var i = function(e, o, r) {
			if (n.checkIsNull(e, "getRobotStatus")) return;
			if (n.checkIsNull(o, "getRobotStatus")) return;
			a.auto({
				getMotorStatus: function(t) {
					var r = {
						options: {
							hostname: e,
							port: o,
							path: "/cloud/motorStatus",
							method: "GET"
						}
					};
					n.mRequest(r, function(e, o) {
						if (e == 100) {
							t(null, o)
						} else {
							t(e, o)
						}
					})
				}
			}, function(e, o) {
				var a = JSON.parse(o["getMotorStatus"]["body"])["value"];
				var u = undefined;
				if (e == null) {
					u = {
						result: "0",
						description: "success",
						callBack: {
							title: ["当前位置", "目标位置", "运行状态[0:停止 1:正转 2:反转]", "刹车位", "运行速度"],
							X: a[0],
							Y: a[1],
							Z: a[2]
						}
					}
				} else {
					n.generateLog(s, "getRobotStatus", e, o);
					u = {
						result: "1",
						description: "failed,CODE: " + e + " MESSAGE: " + t.error_code[e]
					}
				}
				r(u)
			})
		};
	var l = function(e, o, u, i) {
			a.auto({
				getRobotByIp: function(t) {
					r.getRobotByIp(e, o, function(e, o) {
						if (e == 100) {
							t(null, o)
						} else {
							t(e, o)
						}
					})
				},
				changeRobotState: ["getRobotByIp", function(e, t) {
					if (n.checkIsNull(e["getRobotByIp"], "changeRobotState")) return;
					var o = e["getRobotByIp"][0];
					r.changeRobotState(o["robot_id"], u, function(e, o) {
						if (e == 100) {
							t(null, o)
						} else {
							t(e, o)
						}
					})
				}]
			}, function(e, o) {
				var r = undefined;
				if (e == null) {
					r = {
						result: "0",
						description: "success"
					}
				} else {
					n.generateLog(s, "changeRobotState", e, o);
					r = {
						result: "1",
						description: "failed,CODE: " + e + " MESSAGE: " + t.error_code[e]
					}
				}
				i(r)
			})
		};
	var c = function(e, o, u, i) {
			a.auto({
				getRobotByIp: function(t) {
					r.getRobotByIp(e, o, function(e, o) {
						if (e == 100) {
							t(null, o)
						} else {
							t(e, o)
						}
					})
				},
				changeRobotState: ["getRobotByIp", function(e, t) {
					if (n.checkIsNull(e["getRobotByIp"], "changeRobotState")) return;
					var o = e["getRobotByIp"][0];
					r.changeRobotState(o["robot_id"], u, function(e, o) {
						if (e == 100) {
							t(null, o)
						} else {
							t(e, o)
						}
					})
				}],
				changeRobotHandMode: ["getRobotByIp", function(e, t) {
					if (u == 1) {
						t();
						return
					}
					if (n.checkIsNull(e["getRobotByIp"], "changeRobotState")) return;
					var o = e["getRobotByIp"][0];
					r.destroyRobotJob(o, function(e, o) {
						if (e == 100) {
							t(null, o)
						} else {
							t(e, o)
						}
					})
				}]
			}, function(e, o) {
				var r = undefined;
				if (e == null) {
					r = {
						result: "0",
						description: "success"
					}
				} else {
					n.generateLog(s, "changeRobotState", e, o);
					r = {
						result: "1",
						description: "failed,CODE: " + e + " MESSAGE: " + t.error_code[e]
					}
				}
				i(r)
			})
		};
	var f = function(e, o, r, u, i, l) {
			a.auto({
				movePosX: function(t) {
					var a = undefined;
					if (r == -1) {
						a = {
							options: {
								hostname: e,
								port: o,
								path: "/motor/move?method=MOTOR_STOP&param=TOKEN,1,1",
								method: "GET"
							}
						}
					} else {
						a = {
							options: {
								hostname: e,
								port: o,
								path: "/motor/move?method=MOTOR_MOVE&param=TOKEN,1," + r + ",0,1000",
								method: "GET"
							}
						}
					}
					n.mRequest(a, function(e, o) {
						if (e == 100) {
							var n = JSON.parse(o["body"]);
							if (n["result"] == "success") {
								t(null, 100)
							} else {
								t(200, o)
							}
						} else {
							t(e, o)
						}
					})
				},
				movePosY: ["movePosX", function(t, r) {
					var a = undefined;
					if (u == -1) {
						a = {
							options: {
								hostname: e,
								port: o,
								path: "/motor/move?method=MOTOR_STOP&param=TOKEN,2,1",
								method: "GET"
							}
						}
					} else {
						a = {
							options: {
								hostname: e,
								port: o,
								path: "/motor/move?method=MOTOR_MOVE&param=TOKEN,2," + u + ",0,1000",
								method: "GET"
							}
						}
					}
					n.mRequest(a, function(e, t) {
						if (e == 100) {
							var o = JSON.parse(t["body"]);
							if (o["result"] == "success") {
								r(null, 100)
							} else {
								r(200, t)
							}
						} else {
							r(e, t)
						}
					})
				}],
				movePosZ: ["movePosY", function(t, r) {
					var a = undefined;
					if (i == -1) {
						a = {
							options: {
								hostname: e,
								port: o,
								path: "/motor/move?method=MOTOR_STOP&param=TOKEN,3,1",
								method: "GET"
							}
						}
					} else {
						a = {
							options: {
								hostname: e,
								port: o,
								path: "/motor/move?method=MOTOR_MOVE&param=TOKEN,3," + i + ",0,1000",
								method: "GET"
							}
						}
					}
					n.mRequest(a, function(e, t) {
						if (e == 100) {
							var o = JSON.parse(t["body"]);
							if (o["result"] == "success") {
								r(null, 100)
							} else {
								r(200, t)
							}
						} else {
							r(e, t)
						}
					})
				}],
				allFinished: ["movePosZ", function(e, t) {
					if (e["movePosZ"] == 100) {
						t(null, e)
					}
				}]
			}, function(e, o) {
				var r = undefined;
				if (e == null) {
					r = {
						result: "0",
						description: "success"
					};
					l(r)
				} else {
					n.generateLog(s, "manualMoving", e, o);
					r = {
						result: "1",
						description: "failed,CODE: " + e + " MESSAGE: " + t.error_code[e]
					};
					l(r)
				}
			})
		};
	return {
		getRobotStatus: u,
		getMotorStatus: i,
		changeRobotState: l,
		changeRobotHandMode: c,
		manualMoving: f
	}
};