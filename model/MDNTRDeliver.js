module.exports = function() {
	var e = require("path");
	var t = require("../const.js");
	var o = require("./MDBrainNTR.js")();
	var u = require("../controller/ADBrain.js")();
	var n = require("async");
	var i = e.basename(__filename, ".js");
	var r = function(e, t) {
			if (u.checkIsNull(e, "getRobot")) return;
			o.execQuery('SELECT * FROM `tb_nt_robot` WHERE robot_id = "' + e + '"', function(e, o) {
				if (e == 100) {
					t(100, o)
				} else {
					t(e, o)
				}
			})
		};
	var s = function(e, t, n) {
			if (u.checkIsNull(e, "getRobotByIp")) return;
			if (u.checkIsNull(t, "getRobotByIp")) return;
			o.execQuery('SELECT * FROM `tb_nt_robot` WHERE robot_ip = "' + e + '" AND robot_port = "' + t + '"', function(e, t) {
				if (e == 100) {
					n(100, t)
				} else {
					n(e, t)
				}
			})
		};
	var _ = function(e, t) {
			if (u.checkIsNull(e, "getDeviceUnit")) return;
			n.auto({
				getDevice: function(t) {
					var o = {
						options: {
							hostname: e["robot_ip"],
							port: e["robot_port"],
							path: "/unit/find",
							method: "GET",
							headers: {
								"Content-Type": "application/json"
							}
						}
					};
					u.mRequest(o, function(e, o) {
						if (e == 100) {
							t(null, o)
						} else {
							t(e, o)
						}
					})
				},
				getUnit: ["getDevice", function(t, o) {
					var i = t["getDevice"]["body"];
					var r = JSON.parse(i)["value"];
					n.each(r, function(t, o) {
						var n = {
							options: {
								hostname: e["robot_ip"],
								port: e["robot_port"],
								path: "/object/find?unit_code=" + t["unit_code"],
								method: "GET",
								headers: {
									"Content-Type": "application/json"
								}
							}
						};
						u.mRequest(n, function(e, u) {
							if (e == 100) {
								t["object"] = JSON.parse(u["body"])["value"];
								o()
							}
						})
					}, function(e, t) {
						if (e == null) {
							o(null, r)
						} else {
							o(e, t)
						}
					})
				}]
			}, function(e, o) {
				if (e == null) {
					t(100, o["getUnit"])
				} else {
					t(e, o)
				}
			})
		};
	var a = function(e, t, n) {
			if (u.checkIsNull(e, "changeRobotState")) return;
			if (u.checkIsNull(t, "changeRobotState")) return;
			if (t != 0 && t != 1) return;
			o.execTrans(["UPDATE `tb_nt_robot` SET `robot_enable`=" + t + " WHERE `robot_id`=" + e], function(e, t) {
				if (e == 100) {
					n(100, t)
				} else {
					n(e, t)
				}
			})
		};
	var l = function(e, t) {
			if (u.checkIsNull(e, "changeRobotState")) return;
			n.auto({
				destroyQueue: function(t) {
					var o = {
						options: {
							hostname: e["robot_ip"],
							port: e["robot_port"],
							path: "/queue/destroy",
							method: "GET"
						}
					};
					u.mRequest(o, function(e, o) {
						if (e == 100) {
							t()
						} else {
							t(e, o)
						}
					})
				},
				findJob: ["destroyQueue", function(t, u) {
					o.execQuery("SELECT j.`job_id` FROM `tb_nt_job` as j,`tb_nt_robot` as r,`tb_nt_task` as t WHERE r.robot_id = t.task_robot_id AND t.task_id = j.job_task_id AND j.`job_stop` is null AND r.robot_id =" + e["robot_id"], function(e, t) {
						if (e == 100) {
							u(null, t)
						} else {
							u(e, t)
						}
					})
				}],
				destroyJob: ["findJob", function(e, t) {
					var u = e["findJob"];
					var n = [];
					u.forEach(function(e) {
						n.push("DELETE FROM tb_nt_job WHERE job_id = " + e["job_id"]);
						n.push("DELETE FROM tb_nt_job_result WHERE job_result_job_id = " + e["job_id"])
					});
					o.execTrans(n, function(e, o) {
						if (e == 100) {
							t(null, o)
						} else {
							t(e, o)
						}
					})
				}]
			}, function(e, o) {
				if (e == null) {
					t(100, o)
				} else {
					t(e, o)
				}
			})
		};
	var c = function(e, t) {
			if (u.checkIsNull(e, "generateTask")) return;
			var i = [];
			n.eachSeries(e, function(e, t) {
				var u = ["SELECT task_name FROM `tb_nt_task` WHERE task_id = " + e, "SELECT device_code as unit,unit_code as object FROM `tb_nt_task_item` as a,`tb_nt_device` as b,`tb_nt_unit` as c WHERE a.task_item_device_id = b.device_id AND a.task_item_unit_id = c.unit_id AND task_item_task_id = " + e + " ORDER BY `task_item_number` ASC"];
				o.execTrans(u, function(o, u) {
					if (o == 100) {
						i.push({
							task_id: e,
							task_name: u[0][0]["task_name"],
							task_data: u[1]
						});
						t()
					} else {
						t(o, u)
					}
				})
			}, function(e, o) {
				if (e == null) {
					t(100, i)
				} else {
					t(e, o)
				}
			})
		};
	var b = function(e, t, n, i, r) {
			if (u.checkIsNull(e, "insertJob")) return;
			if (u.checkIsNull(t, "insertJob")) return;
			if (u.checkIsNull(n, "insertJob")) return;
			if (u.checkIsNull(i, "insertJob")) return;
			var s = ["INSERT INTO `tb_nt_job`(`job_id`, `job_robot_id`, `job_queue_id`, `job_task_id`, `job_start`, `job_stop`, `job_status`, `job_insert_mode`, `job_priority`) VALUES (null, " + e["robot_id"] + ", " + n["queue_id"] + ", " + t + ", " + n["queue_start"] + ", " + n["queue_stop"] + ", " + n["queue_status"] + ", " + i + ", " + n["queue_priority"] + ")"];
			o.execTrans(s, function(e, t) {
				r(e, t)
			})
		};
	var f = function(e, t) {
			if (u.checkIsNull(e, "insertJobItem")) return;
			n.auto({
				getItemInfo: function(t) {
					var u = "SELECT ti.*,r.robot_station_id FROM tb_nt_task_item as ti,tb_nt_task as t,tb_nt_job as j,tb_nt_robot as r WHERE t.task_id = j.job_task_id AND t.task_id = ti.task_item_task_id AND t.task_robot_id = r.robot_id AND j.job_id = " + e;
					o.execQuery(u, function(e, o) {
						if (e == 100) {
							t(null, o)
						} else {
							t(e, o)
						}
					})
				},
				insertJobItem: ["getItemInfo", function(t, n) {
					if (u.checkIsNull(t["getItemInfo"], "async_insertJobItem")) return;
					var i = t["getItemInfo"];
					var r = i.length;
					var s = [];
					for (var _ = 0; _ < r; ++_) {
						var a = "INSERT INTO `tb_nt_job_result`(`job_result_id`, `job_result_job_id`, `job_result_status`, `job_result_time`, `job_result_result`, `job_result_condition`, `job_result_reading`, `job_result_station_id`, `job_result_device_id`, `job_result_unit_id`, `job_result_task_id`) VALUES (null, " + e + ", 0, null, null, null, null, " + i[_]["robot_station_id"] + ", " + i[_]["task_item_device_id"] + ", " + i[_]["task_item_unit_id"] + ", " + i[_]["task_item_task_id"] + ")";
						s.push(a)
					}
					o.execTrans(s, function(e, t) {
						n(e, t)
					})
				}]
			}, function(e, o) {
				if (e == null) {
					t(100, o)
				} else {
					t(e, o)
				}
			})
		};
	var d = function(e, t, o) {
			if (u.checkIsNull(e, "getQueue")) return;
			if (u.checkIsNull(t, "getQueue")) return;
			var n = {
				options: {
					hostname: e["robot_ip"],
					port: e["robot_port"],
					path: "/cloud/findQueue?queue_id=" + t,
					method: "GET"
				}
			};
			u.mRequest(n, function(e, t) {
				if (e == 100) {
					var u = JSON.parse(t["body"]);
					if (u["result"] == "success") {
						var n = JSON.parse(t["body"])["value"];
						o(100, n)
					} else {
						o(200, u["status"])
					}
				} else {
					o(e, t)
				}
			})
		};
	var j = function(e, t) {
			if (u.checkIsNull(e, "setQueueItem")) return;
			var o = {
				options: {
					hostname: e["robot_ip"],
					port: e["robot_port"],
					path: "/cloud/generateItem?now",
					method: "GET"
				}
			};
			u.mRequest(o, function(e, o) {
				if (e == 100) {
					var u = JSON.parse(o["body"]);
					if (u["result"] == "success") {
						t(100)
					} else {
						t(200)
					}
				} else {
					t(e, o)
				}
			})
		};
	var I = function(e, o, r) {
			if (u.checkIsNull(e, "getQueueItem")) return;
			if (u.checkIsNull(o, "getQueueItem")) return;
			n.series([function(t) {
				var n = {
					options: {
						hostname: e["robot_ip"],
						port: e["robot_port"],
						path: "/cloud/findQueueItem?queue_id=" + o,
						method: "GET"
					}
				};
				u.mRequest(n, function(e, o) {
					if (e == 100) {
						var u = JSON.parse(o["body"]);
						if (u["result"] == "success") {
							var n = u["value"];
							t(null, n)
						} else {
							t(200, u["status"])
						}
					} else {
						t(e, o)
					}
				})
			}], function(e, o) {
				if (e == null) {
					r(100, o[0])
				} else {
					global.logger.error("[" + i + "] " + "getQueueItem => CODE: %s MESSAGE: %s DATA: %s", e, t.error_code[e], JSON.stringify(o))
				}
			})
		};
	var p = function(e, t, i) {
			if (u.checkIsNull(e, "updateJob")) return;
			if (u.checkIsNull(t, "updateJob")) return;
			n.auto({
				getInfo: function(u) {
					var n = 'SELECT n.*,ji.job_result_id,j.job_id FROM tb_nt_job as j,tb_nt_job_result as ji,tb_nt_task as t,tb_nt_robot as n WHERE j.job_queue_id = "' + t + '" AND n.robot_id = "' + e + '" AND j.job_task_id = t.task_id AND n.robot_id = t.task_robot_id AND ji.job_result_job_id = j.job_id';
					o.execQuery(n, function(e, t) {
						if (e == 100) {
							u(null, t)
						} else {
							u(e, t)
						}
					})
				},
				getQueueInfo: ["getInfo", function(e, o) {
					if (u.checkIsNull(e["getInfo"], "getQueueInfo")) return;
					var n = e["getInfo"][0];
					var i = t;
					d(n, i, function(e, t) {
						if (e == 100) {
							o(null, t)
						} else {
							o(e, t)
						}
					})
				}],
				getQueueItemInfo: ["getInfo", function(e, o) {
					if (u.checkIsNull(e["getInfo"], "getQueueItemInfo")) return;
					var n = e["getInfo"][0];
					var i = t;
					I(n, i, function(e, t) {
						if (e == 100) {
							o(null, t)
						} else {
							o(e, t)
						}
					})
				}],
				updateJob: ["getInfo", "getQueueInfo", function(e, t) {
					if (u.checkIsNull(e["getInfo"], "updateJob")) return;
					if (u.checkIsNull(e["getQueueInfo"], "updateJob")) return;
					var n = e["getInfo"][0]["job_id"];
					var i = e["getQueueInfo"];
					var r = null;
					if (i["queue_start"] != null) {
						r = '"' + u.getDateTime(i["queue_start"]).datetime + '"'
					}
					var s = null;
					if (i["job_stop"] != null) {
						s = '"' + u.getDateTime(i["queue_stop"]).datetime + '"'
					}
					var _ = ["UPDATE `tb_nt_job` SET `job_start`=" + r + ",`job_stop`=" + s + ",`job_status`=" + i["queue_status"] + ",`job_priority`=" + i["queue_priority"] + ' WHERE `job_id`="' + n + '"'];
					o.execTrans(_, function(e, o) {
						if (e == 100) {
							t(null, o)
						} else {
							t(e, o)
						}
					})
				}],
				updateJobItem: ["getInfo", "getQueueItemInfo", function(e, t) {
					if (u.checkIsNull(e["getInfo"], "updateJobItem")) return;
					if (u.checkIsNull(e["getQueueItemInfo"], "updateJobItem")) return;
					var i = e["getInfo"][0]["job_id"];
					var r = [];
					e["getInfo"].forEach(function(e) {
						r.push(e["job_result_id"])
					});
					var s = e["getQueueItemInfo"];
					var _ = 0;
					n.each(s, function(e, t) {
						var n = s.indexOf(e);
						var a = null;
						if (e["queue_item_time"] != null) {
							a = '"' + u.getDateTime(e["queue_item_time"]).datetime + '"';
							_ = n + 1
						}
						var l = null;
						if (n === _) {
							l = 1
						} else {
							l = e["queue_item_status"]
						}
						var c = null;
						if (e["queue_item_raw"] != null) {
							c = '"' + e["queue_item_raw"] + '"'
						}
						var b = null;
						if (e["queue_item_result"] != null) {
							var f = e["queue_item_result"];
							f = f.replace("db", "");
							f = f.replace("ppm", "");
							f = f.replace("℃", "");
							f = f.replace("%", "");
							f = f.replace("°", "");
							b = '"' + f + '"'
						}
						var d = ["UPDATE `tb_nt_job_result` SET `job_result_status`=" + l + ",`job_result_time`=" + a + ",`job_result_result`=" + c + ",`job_result_condition`=" + e["queue_item_condition"] + ",`job_result_reading`=" + b + ' WHERE `job_result_id`="' + r[n] + '"'];
						o.execTrans(d, function(e, u) {
							if (e == 100) {
								if (n == s.length - 1 && a != null) {
									_ = 0;
									var r = ["UPDATE `tb_nt_job` SET `job_stop`=" + a + ',`job_status`=2 WHERE `job_id`="' + i + '"'];
									o.execTrans(r, function(e, o) {
										if (e == 100) {
											t(null, o)
										} else {
											t(e, o)
										}
									})
								}
							} else {
								t(e, u)
							}
						})
					}, function(e, o) {
						if (e == null) {
							t(null, o)
						} else {
							t(e, o)
						}
					})
				}]
			}, function(e, t) {
				if (e == null) {
					i(100, t)
				} else {
					i(e, t)
				}
			})
		};
	return {
		getRobot: r,
		getRobotByIp: s,
		getDeviceUnit: _,
		destroyRobotJob: l,
		changeRobotState: a,
		generateTask: c,
		insertJob: b,
		insertJobItem: f,
		getQueue: d,
		getQueueItem: I,
		updateJob: p
	}
};