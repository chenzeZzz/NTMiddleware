/**
 * Const
 */
module.exports = {
    /*
     * 运行环境
     * 0 => dev:开发 1 => test:测试 2 => prod:生产
     */
    run_env : 2,
    sql_log : false,
    autorun_config : {
        /* 通用平台 */
        ADDeliver     : false,
        /* 机器人平台 */
        ADNTRDeliver     : true,
        ADNTRInterface   : true,
        ADNTRLooper      : true,
        ADSCWPInterface  : true,
    },
    /* 服务器标识 */
    X_Powered_By : 'ATOMIX NTMiddleware',
    /* 服务器是否支持跨域 */
    ACAO : true,
    /* 错误代码 */
    error_code : {
        100 : 'Success',
        101 : 'System Running',

        200 : 'Failed',
        201 : 'System ShutDown',
        202 : 'JSON Phrase Error',
        203 : 'COMMAND Inexistence',
        204 : 'Interface is Banned',
        205 : 'Error Params',

        300 : 'Database Connection Error',
        301 : 'Query Error',
        302 : 'TransAction Error',
        303 : 'RollBack Error',
    },
    /* 指令代码 */
    cmd_code : {
        100 : 'WebSocket Send Data',
        101 : 'Callback Response',
    },
    /* 服务器基本配置 */
    server_config : {
        host : '0.0.0.0',
        port : 8800,
    },
    /* Websocket配置 */
    ws_params : {
        /* 心跳时间 */
        ws_heart_interval : 120000
    },
    /* 数据库基本配置NTR */
    server_database_ntr : {
        host : '127.0.0.1',
        user : 'root',
        pass : 'root',
        database : 'monitor'
    },
    /* 抓取间隔 */
    Catch_timer_interval : 60000,
    /* 解析间隔 */
    Looper_timer_interval : 3000,
    /* 机器人状态位解析 */
    ROBOT_STATUS : ['未知状态','初始化','正在工作','已停机','正在维护'],
    ROBOT_ERROR : ['主控','PLC','电源','EXT','X轴','Y轴','Z轴','','视觉','红外','局放','','温湿度','噪音','','','','','','','RIOC'],
}