var path = require("path");
var cluster = require("cluster");
var express = require("express");
var tag = path.basename(__filename, ".js");
var mybrain = require("./controller/ADBrain.js")();
var myconst = require("./const.js");



var codeResponse = function(e, r, o) {
		var t = '{"code":' + r + ',"message":"' + myconst.error_code[r];
		if (o) {
			t += '","data":"' + o + '"}'
		} else {
			t += '"}'
		}
		e.end(t)
	};

if (cluster.isMaster) {
	global.logger.info("CLUSTER MASTER START..");
	cluster.fork();
	cluster.on("fork", function(e) {
		global.logger.info("[master] " + "fork => " + e.id)
	});
	cluster.on("online", function(e) {
		global.logger.info("[master] " + "online => " + e.id)
	});
	cluster.on("listening", function(e, r) {
		global.logger.info("[master] " + "listening => " + e.id + ", Pid: " + e.process.pid + ", Address: " + r.address + ":" + r.port)
	});

	var app = express();
	app.listen(myconst.server_config.port + 1, myconst.server_config.host);
	app.use(function(e, r, o) {
		r.set("X-Powered-By", myconst.X_Powered_By);
		if (myconst.ACAO) {
			r.set("Access-Control-Allow-Origin", "*")
		}
		global.logger.warn("[request] Visitor => " + e.ip + " Resource => " + e.url);
		o()
	});
	app.all("*", function(e, r) {
		r.status(404).end(codeResponse(r, 203))
	})
} else if (cluster.isWorker) {
	var app = express();
	app.listen(myconst.server_config.port, myconst.server_config.host);
	app.use(function(e, r, o) {
		r.set("X-Powered-By", myconst.X_Powered_By);
		if (myconst.ACAO) {
			r.set("Access-Control-Allow-Origin", "*")
		}
		global.logger.warn("[request] Visitor => " + e.ip + " Resource => " + e.url);
		o()
	});
	app.all("/", function(e, r) {
		r.set("Content-Type", "text/html;charset=utf-8");
		r.end("<h1>Atomix NTMiddleware!</h1>")
	});
	const static_path = __dirname + "/static/";
	app.use(express.static(static_path));
	const file_server_root = "/file";
	var file_server = require("./controller/ADFileServer.js")();
	app.all(file_server_root, function(e, r) {
		var o = function(e, r) {
				if (e.query.gg != undefined) {
					if (!file_server.isStarted()) {
						file_server.startServer(function(e, o) {
							codeResponse(r, e, o)
						})
					} else {
						r.redirect(file_server_root)
					}
				} else if (e.query.gl != undefined) {
					if (file_server.isStarted()) {
						file_server.stopServer(function(e, o) {
							codeResponse(r, e, o)
						})
					} else {
						r.redirect(file_server_root)
					}
				} else {
					if (file_server.isStarted()) {
						file_server.listDir(static_path, function(e, o) {
							codeResponse(r, 100, o)
						})
					} else {
						codeResponse(r, 201)
					}
				}
			};
		if (myconst.run_env != 2) {
			o(e, r)
		} else {
			try {
				o(e, r)
			} catch (e) {
				global.logger.error("[main] " + "Caught Fatal Error => " + e);
				codeResponse(r, 201)
			}
		}
	});


	const NTRDeliver_root = "/NTRDeliver";
	var NTRDeliver = require("./controller/ADNTRDeliver.js")(cluster);
	app.all(NTRDeliver_root, function(e, r) {
		var o = function(e, r) {
				if (e.query.gg != undefined) {
					if (!NTRDeliver.isStarted()) {
						NTRDeliver.startServer(function(e, o) {
							codeResponse(r, e, o)
						})
					} else {
						r.redirect(NTRDeliver_root)
					}
				} else if (e.query.gl != undefined) {
					if (NTRDeliver.isStarted()) {
						NTRDeliver.stopServer(function(e, o) {
							codeResponse(r, e, o)
						})
					} else {
						r.redirect(NTRDeliver_root)
					}
				} else {
					if (NTRDeliver.isStarted()) {
						if (NTRDeliver.isBanned()) {
							codeResponse(r, 204);
							return
						}
						codeResponse(r, 101)
					} else {
						codeResponse(r, 201)
					}
				}
			};
		if (myconst.run_env != 2) {
			o(e, r)
		} else {
			try {
				o(e, r)
			} catch (e) {
				global.logger.error("[main] " + "Caught Fatal Error => " + e);
				codeResponse(r, 201)
			}
		}
	});


	const NTRLooper_root = "/NTRLooper";
	var NTRLooper = require("./controller/ADNTRLooper.js")();
	app.all(NTRLooper_root, function(e, r) {
		var o = function(e, r) {
				if (e.query.gg != undefined) {
					if (!NTRLooper.isStarted()) {
						NTRLooper.startServer(function(e, o) {
							codeResponse(r, e, o)
						})
					} else {
						r.redirect(NTRLooper_root)
					}
				} else if (e.query.gl != undefined) {
					if (NTRLooper.isStarted()) {
						NTRLooper.stopServer(function(e, o) {
							codeResponse(r, e, o)
						})
					} else {
						r.redirect(NTRLooper_root)
					}
				} else {
					if (NTRLooper.isStarted()) {
						if (NTRLooper.isBanned()) {
							codeResponse(r, 204);
							return
						}
						codeResponse(r, 101)
					} else {
						codeResponse(r, 201)
					}
				}
			};
		if (myconst.run_env != 2) {
			o(e, r)
		} else {
			try {
				o(e, r)
			} catch (e) {
				global.logger.error("[main] " + "Caught Fatal Error => " + e);
				codeResponse(r, 201)
			}
		}
	});



	const NTRInterface_root = "/NTRInterface";
	var NTRInterface = require("./controller/ADNTRInterface.js")(NTRInterface_root, app, codeResponse);
	app.all(NTRInterface_root, function(e, r) {
		var o = function(e, r) {
				if (e.query.gg != undefined) {
					if (!NTRInterface.isStarted()) {
						NTRInterface.startServer(function(e, o) {
							codeResponse(r, e, o)
						})
					} else {
						r.redirect(NTRInterface_root)
					}
				} else if (e.query.gl != undefined) {
					if (NTRInterface.isStarted()) {
						NTRInterface.stopServer(function(e, o) {
							codeResponse(r, e, o)
						})
					} else {
						r.redirect(NTRInterface_root)
					}
				} else {
					if (NTRInterface.isStarted()) {
						if (NTRInterface.isBanned()) {
							codeResponse(r, 204);
							return
						}
						codeResponse(r, 101)
					} else {
						codeResponse(r, 201)
					}
				}
			};
		if (myconst.run_env != 2) {
			o(e, r)
		} else {
			try {
				o(e, r)
			} catch (e) {
				global.logger.error("[main] " + "Caught Fatal Error => " + e);
				codeResponse(r, 201)
			}
		}
	});



	const SCWPInterface_root = "/scwp/ntrobot";
	var SCWPInterface = require("./controller/ADSCWPInterface.js")(SCWPInterface_root, app, codeResponse);
	app.all(SCWPInterface_root, function(e, r) {
		var o = function(e, r) {
				if (e.query.gg != undefined) {
					if (!SCWPInterface.isStarted()) {
						SCWPInterface.startServer(function(e, o) {
							codeResponse(r, e, o)
						})
					} else {
						r.redirect(SCWPInterface_root)
					}
				} else if (e.query.gl != undefined) {
					if (SCWPInterface.isStarted()) {
						SCWPInterface.stopServer(function(e, o) {
							codeResponse(r, e, o)
						})
					} else {
						r.redirect(SCWPInterface_root)
					}
				} else {
					if (SCWPInterface.isStarted()) {
						if (SCWPInterface.isBanned()) {
							codeResponse(r, 204);
							return
						}
						codeResponse(r, 101)
					} else {
						codeResponse(r, 201)
					}
				}
			};
		if (myconst.run_env != 2) {
			o(e, r)
		} else {
			try {
				o(e, r)
			} catch (e) {
				global.logger.error("[main] " + "Caught Fatal Error => " + e);
				codeResponse(r, 201)
			}
		}
	});


	var page404 = function(e) {
			e.status(404).end('<body style="margin:0;overflow-y:hidden;"><img style="width:100%;" src="/error/404.gif"></body>')
		};
	var page500 = function(e) {
			e.status(500).end('<body style="margin:0;overflow-y:hidden;"><img style="width:100%;" src="/error/500.gif"></body>')
		};
	app.all("*", function(e, r) {
		page404(r)
	});
	process.on("message", function(e) {
		var r = mybrain.analyzeMessage(e);
		if (r.head == "?") {
			switch (r.tag) {
			case "ADStockLooper":
				{
					var o = r.cmd_array[0];
					if (o == 100) {
						var t = r.cmd_array[1];
						stock_deliver.wsBroadcast(t)
					}
					break
				}
			}
		} else if (r.head == "!") {} else if (r.head == "~") {}
	})
}