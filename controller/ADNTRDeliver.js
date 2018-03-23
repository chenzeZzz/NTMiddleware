module.exports = function(e) {
	var n = require("path");
	var t = require("async");
	var r = require("./ADBrain.js")();
	var a = require("../const.js");
	var o = require("../model/MDNTRDeliver.js")();
	var u = n.basename(__filename, ".js");
	var s = "[" + u + "] " + "Interface banned => ";
	var i = false;
	var f = false;
	if (!r.checkIsNull(a.autorun_config[u])) {
		f = a.autorun_config[u]
	}
	var sendTask = function() {
			global.logger.warn(s + "sendTask")
		};
	var c = function() {
			if (!f) return;
			l = function(e, n, s) {
				if (r.checkIsNull(e, "sendTask")) return;
				if (r.checkIsNull(n, "sendTask")) return;
				if (r.checkIsNull(s, "sendTask")) return;
				t.auto({
					getRobot: function(n) {
						o.getRobot(e, function(e, t) {
							if (e == 100) {
								n(null, t)
							} else {
								n(401, t)
							}
						})
					},
					generateTask: function(e) {
						o.generateTask(s, function(n, t) {
							if (n == 100) {
								e(null, t)
							} else {
								e(402, t)
							}
						})
					},
					sendTask: ["getRobot", "generateTask", function(e, s) {
						var i = e.getRobot[0];
						var f = e.generateTask;
						t.eachSeries(f, function(e, s) {
							var f = JSON.stringify({
								pointCode: e["task_name"],
								taskValues: e["task_data"]
							});
							var l = {
								postData: f,
								options: {
									hostname: i["robot_ip"],
									port: i["robot_port"],
									path: "/task/build",
									method: "POST",
									headers: {
										"Content-Type": "application/json;charset=utf-8",
										"Content-Length": Buffer.byteLength(f, "utf8")
									}
								}
							};
							if (a.run_env < 2) {
								global.logger.warn("[" + u + "] " + "taskData => " + f)
							}
							r.mRequest(l, function(r, a) {
								if (r == 100) {
									var u = JSON.parse(a["body"])["value"];
									t.auto({
										getQueue: function(e) {
											o.getQueue(i, u, function(n, t) {
												if (n == 100) {
													e(null, t)
												} else {
													e(403, t)
												}
											})
										},
										insertJob: ["getQueue", function(t, r) {
											o.insertJob(i, e["task_id"], t["getQueue"], n, function(e, n) {
												if (e == 100) {
													r(null, n[0]["insertId"])
												} else {
													r(404, n)
												}
											})
										}],
										insertJobItem: ["insertJob", function(e, n) {
											var t = e["insertJob"];
											o.insertJobItem(t, function(e, t) {
												if (e == 100) {
													n(null, t)
												} else {
													n(405, t)
												}
											})
										}]
									}, function(e, n) {
										if (e == null) {
											s()
										} else {
											s(e, n)
										}
									})
								} else {
									s(406, a)
								}
							})
						}, function(e, n) {
							if (e != null) {
								s(e, n)
							}
						})
					}]
				}, function(e, n) {
					global.logger.error("[" + u + "] " + "sendTask => CODE: %s MESSAGE: %s DATA: %s", e, a.error_code[e], JSON.stringify(n))
				})
			}
		};
	var g = function() {
			l = function() {
				global.logger.warn(s + "sendTask")
			}
		};
	if (f) {
		c()
	}
	var getTag = function() {
			return u
		};
	var isStarted = function() {
			return f
		};
	var isBanned = function() {
			return i
		};
	var startServer = function(e) {
			f = true;
			c();
			e(100, u + " Started")
		};
	var stopServer = function(e) {
			f = false;
			g();
			e(100, u + " Stopped")
		};
	return {
		getTag: getTag,
		isStarted: isStarted,
		isBanned: isBanned,
		startServer: startServer,
		stopServer: stopServer,
		sendTask: sendTask
	}
};