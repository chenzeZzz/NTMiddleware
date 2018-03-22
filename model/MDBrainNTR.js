module.exports = function() {
	var e = require("mysql");
	var r = require("async");
	var n = require("../const.js");
	var t = require("../controller/ADBrain.js")();
	var o = e.createPool({
		connectionLimit: 100,
		multipleStatements: true,
		host: n.server_database_ntr.host,
		user: n.server_database_ntr.user,
		password: n.server_database_ntr.pass,
		database: n.server_database_ntr.database
	});
	var a = function() {
			return o
		};
	var i = function(e, r) {
			if (t.checkIsNull(e, "execQuery")) return;
			if (n.sql_log) {
				global.logger.info(e)
			}
			o.getConnection(function(n, t) {
				if (n) {
					r(300, n);
					return
				}
				t.query(e, function(e, n) {
					t.release();
					if (!e) {
						r(100, n)
					} else {
						r(301, e)
					}
				})
			})
		};
	var s = function(e, a) {
			if (t.checkIsNull(e, "execTrans")) return;
			if (n.sql_log) {
				global.logger.info(e)
			}
			o.getConnection(function(n, t) {
				if (n) {
					a(300, n);
					return
				}
				var o = function(e) {
						return function(r) {
							t.query(e, function(e, n) {
								if (!e) {
									r(null, n)
								} else {
									r(301, e)
								}
							})
						}
					};
				for (var i in e) {
					e[i] = o(e[i])
				}
				t.beginTransaction(function(n) {
					if (n) {
						t.destroy();
						a(302, n);
						return
					}
					r.series(e, function(e, r) {
						t.commit(function(e) {
							if (e) {
								t.rollback(function(e) {
									t.destroy();
									if (e) {
										a(303, e)
									}
								})
							} else {
								t.release();
								a(100, r)
							}
						})
					})
				})
			})
		};
	return {
		getPool: a,
		execQuery: i,
		execTrans: s
	}
};