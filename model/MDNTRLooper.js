module.exports = function() {
	var e = require("path");
	var i = require("../const.js");
	var t = require("./MDBrainNTR.js")();
	var l = require("../controller/ADBrain.js")();
	var r = require("../controller/ADNTRDeliver.js")();
	var s = require("async");
	var c = e.basename(__filename, ".js");
	var u = function(e) {
			if (l.checkIsNull(e, "scheduleDisable")) return;
			t.execQuery("UPDATE `tb_nt_schedule` SET `schedule_enabled`=0 WHERE `schedule_id`=" + e, function(e, t) {
				if (e != 100) {
					global.logger.error("[" + c + "] " + "scheduleDisable => CODE: %s MESSAGE: %s DATA: %s", e, i.error_code[e], JSON.stringify(t))
				}
			})
		};
	var n = function(e) {
			s.auto({
				getSchedule: function(e) {
					t.execQuery("SELECT s.* FROM tb_nt_schedule as s,tb_nt_robot as r WHERE s.schedule_robot_id = r.robot_id AND s.schedule_enabled = 1 AND r.robot_enable = 1", function(i, t) {
						if (i == 100) {
							e(null, t)
						} else {
							e(i, t)
						}
					})
				},
				getScheduleItem: ["getSchedule", function(e, i) {
					if (l.checkIsNull(e["getSchedule"], "getScheduleItem")) return;
					var r = e["getSchedule"];
					s.eachSeries(r, function(e, i) {
						t.execQuery("SELECT schedule_item_task_id FROM `tb_nt_schedule_item` WHERE `schedule_item_schedule_id` =" + e["schedule_id"], function(t, l) {
							if (t == 100) {
								var r = [];
								l.forEach(function(e) {
									r.push(e["schedule_item_task_id"])
								});
								e["task"] = r;
								i()
							}
						})
					}, function(e, t) {
						if (e == null) {
							i(null, r)
						} else {
							i(e, t)
						}
					})
				}],
				switchSchedule: ["getSchedule", "getScheduleItem", function(e, t) {
					if (l.checkIsNull(e["getSchedule"], "switchSchedule")) return;
					if (l.checkIsNull(e["getScheduleItem"], "switchSchedule")) return;
					var n = e["getScheduleItem"];
					s.each(n, function(e, t) {
						switch (e["schedule_mode"]) {
						case 0:
							if (i.run_env < 2) {
								global.logger.info("[" + c + "] " + "schedule2Job => MODE[0]: %s", JSON.stringify(e))
							}
							u(e["schedule_id"]);
							r.sendTask(e["schedule_robot_id"], e["schedule_mode"], e["task"]);
							break;
						case 1:
							var s = l.getDateTime(e["schedule_datetime"]);
							if (l.checkTimeArrived(s.timestamp, i.Looper_timer_interval)) {
								if (i.run_env < 2) {
									global.logger.info("[" + c + "] " + "schedule2Job => MODE[1]: %s", JSON.stringify(e))
								}
								u(e["schedule_id"]);
								r.sendTask(e["schedule_robot_id"], e["schedule_mode"], e["task"])
							}
							break;
						case 2:
							var n = e["schedule_weekday"].split("");
							if (l.getDateTime().week == 0) {
								if (n[6] == 1) {
									var d = l.getDateTime(l.getDateTime().YMD + " " + e["schedule_time"]);
									if (l.checkTimeArrived(d.timestamp, i.Looper_timer_interval)) {
										if (i.run_env < 2) {
											global.logger.info("[" + c + "] " + "schedule2Job => MODE[2]: %s", JSON.stringify(e))
										}
										r.sendTask(e["schedule_robot_id"], e["schedule_mode"], e["task"])
									}
								}
							} else {
								if (n[l.getDateTime().week - 1] == 1) {
									var d = l.getDateTime(l.getDateTime().YMD + " " + e["schedule_time"]);
									if (l.checkTimeArrived(d.timestamp, i.Looper_timer_interval)) {
										if (i.run_env < 2) {
											global.logger.info("[" + c + "] " + "schedule2Job => MODE[2]: %s", JSON.stringify(e))
										}
										r.sendTask(e["schedule_robot_id"], e["schedule_mode"], e["task"])
									}
								}
							}
							break
						}
						t()
					}, function(e, i) {
						if (e == null) {
							t(null, i)
						} else {
							t(e, i)
						}
					})
				}]
			}, function(i, t) {
				if (i == null) {
					e(100, t)
				} else {
					e(i, t)
				}
			})
		};
	return {
		schedule2Job: n
	}
};