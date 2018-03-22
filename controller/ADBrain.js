module.exports = function() {
	var e = require("http");
	var r = require("crypto");
	var a = require("../const.js");
	var n = function(r, a) {
			try {
				var n = e.request(r.options, function(e) {
					var r = {
						head: undefined,
						body: ""
					};
					r.head = e.headers;
					e.setEncoding("utf8");
					e.on("data", function(e) {
						r.body += e
					});
					e.on("end", function() {
						a(100, r)
					})
				});
				n.on("error", function(e) {
					a(200, e.message);
					global.logger.error("Network Error => " + e.message)
				});
				if (r.postData != undefined) {
					n.write(r.postData)
				}
				n.end()
			} catch (e) {
				a(200, e)
			}
		};
	var t = function(e, r, a) {
			if (e != "~") {
				var n = e + r + "#" + a.join("#") + "**"
			} else {
				var n = {
					head: e,
					tag: r,
					cmd_array: a
				}
			}
			return n
		};
	var i = function(e) {
			if (v(e.head, "analyzeMessage")) {
				var r = e.substr(0, 1);
				var e = e.substr(1, e.length - 3);
				var a = e.split("#");
				var n = a.splice(0, 1)[0];
				var a = a;
				return {
					head: r,
					tag: n,
					cmd_array: a
				}
			} else {
				return {
					head: e.head,
					tag: e.tag,
					cmd_array: e.cmd_array
				}
			}
		};
	var o = function(e, r, n) {
			var t = g();
			if (!(0 < t.week && t.week < 6)) {
				if (e != undefined) {
					if (a.run_env == 0) {
						global.logger.error("休息日")
					}
					e()
				}
			} else {
				var i = t.timestamp;
				var o = Date.parse(t.YMD + " 09:25:00");
				var u = Date.parse(t.YMD + " 11:30:00");
				var s = Date.parse(t.YMD + " 13:00:00");
				var l = Date.parse(t.YMD + " 15:00:00");
				if (o < i && i < u || s < i && i < l) {
					if (r != undefined) {
						if (a.run_env == 0) {
							global.logger.error("交易时间")
						}
						r()
					}
				} else {
					if (n != undefined) {
						if (a.run_env == 0) {
							global.logger.error("非交易时间")
						}
						n()
					}
				}
			}
		};
	var u = function(e, r, n, t) {
			global.logger.error("[" + e + "] " + r + " => CODE: %s MESSAGE: %s DATA: %s", n, a.error_code[n], JSON.stringify(t))
		};
	var s = function(e) {
			return unescape(e.replace(/\\u/g, "%u"))
		};
	var l = function(e, r) {
			var a = e.toString().length;
			while (a < r) {
				e = "0" + e;
				a++
			}
			return e
		};
	var f = function(e, a) {
			var n = undefined;
			if (!v(a, "giveMeSign")) {
				n = a
			} else {
				n = (new Date).getTime()
			}
			n = Math.floor(n / 31415 / 13);
			var t = n + e + "5438";
			return r.createHmac("sha1", t).update("待加密字串").digest().toString("base64")
		};
	var g = function(e) {
			var r = undefined;
			if (!v(e, "")) {
				r = new Date(e)
			} else {
				r = new Date
			}
			var a = r.getFullYear() + "/" + (r.getMonth() + 1) + "/" + r.getDate();
			var n = r.getHours() + ":" + r.getMinutes() + ":" + r.getSeconds();
			var t = r.getDay();
			var e = a + " " + n;
			var i = r.valueOf(e);
			return {
				YMD: a,
				week: t,
				time: n,
				timestamp: i,
				datetime: e
			}
		};
	var c = function(e, r) {
			var a = g().timestamp - e;
			if (0 < a && a <= r) {
				return true
			} else {
				return false
			}
		};
	var v = function(e, r) {
			if (typeof r == "undefined") {
				r = "Undefined Function"
			}
			if (typeof e == "undefined") {
				if (a.run_env < 2 && r != "") {
					global.logger.warn(r + " => Check Null")
				}
				return true
			} else if (typeof e == "string") {
				if (e.length == 0) {
					if (a.run_env < 2 && r != "") {
						global.logger.warn(r + " => Check Null")
					}
					return true
				} else {
					return false
				}
			} else if (typeof e == "object") {
				if (e === {}) {
					if (a.run_env < 2 && r != "") {
						global.logger.warn(r + " => Check Null")
					}
					return true
				} else {
					return false
				}
			} else {
				return false
			}
		};
	var d = function(e) {
			if (!isNaN(e)) {
				return true
			} else {
				return false
			}
		};
	var h = function(e, r, a) {
			var n = "1243811801@qq.com";
			var t = "csmiaduypnhnihhi";
			var i = nodemailer.createTransport({
				service: "QQ",
				auth: {
					user: n,
					pass: t
				}
			});
			i.sendMail({
				from: "Chronus <" + n + ">",
				to: e,
				subject: r,
				html: a
			}, function(e, r) {
				console.log(e, r)
			})
		};
	return {
		mRequest: n,
		generateMessage: t,
		analyzeMessage: i,
		checkIsDealTime: o,
		generateLog: u,
		unicodeDecode: s,
		giveMeSign: f,
		getDateTime: g,
		checkTimeArrived: c,
		checkIsNull: v,
		checkIsNumber: d,
		sendMailNotify: h
	}
};