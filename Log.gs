var ERR_LV_NONE = -1;
var ERR_LV_FATAL = 0;
var ERR_LV_ERROR = 1;
var ERR_LV_WARN = 2;
var ERR_LV_INFO = 3;
var ERR_LV_DEBUG = 4;
var ERR_LV_TRACE = 5;

/**
 * ログ出力クラス
 * ログ出力レベルを設定し、対象のログの出力有無を自動的に判定して、ログ出力します。
 * 出力設定に無効値を設定している場合、またはNONEを設定している場合、ログ出力を行いません。
 */
var Log = (function() {
  const str = [ "FATAL", "ERROR", "WARN", "INFO", "DEBUG", "TRACE" ];
  this.errorLebel = ERR_LV_TRACE;
  
  var Log = function(errorLevel) {
    if ( !this.chkRangeErrLv(errorLevel) ) {
      this.errorLebel = errorLebel;
    }
    else {
      this.errorLebel = ERR_LV_NONE;
    }
  }
  var p = Log.prototype;
  p.chenchErrorLevel = function(errorLebel) {
    this.errorLebel = errorLebel;
  }
  // 渡されたレベルが有効値か判定
  p.chkRangeErrLv = function(level) {
    // 異常値判定(範囲外)
    if ( level < ERR_LV_FATAL || ERR_LV_TRACE < level )
    {
      Logger.log("@chkRangeErrLv: out of range > " + level);
      return false;
    }
    return true;
  }
  // 渡されたレベルが有効値 かつ 出力可能な状態かを判定
  p.hasErrorLevel = function(outputLv) {
    // 異常値判定(範囲外)
    if ( !this.chkRangeErrLv(outputLv) )
    {
      Logger.log("@hasErrLv: out of range > " + outputLv);
      return false;
    }
    // 出力判定 true=出力OK
    var ret = ( outputLv <= this.errorLebel );
    Logger.log("@hasErrLv: ret=" + ret + " > in=" + outputLv + ", conf=" + this.errorLebel);
    return ret;
//    return ( outputLv <= this.errorLebel )
  }
  p.getErrLvStr = function(level) {
    if ( !this.chkRangeErrLv(level) ) {
      return "";
    }
    return str[level];
  }
  p.output = function(func, msg, level) {
//    var ret = this.hasErrorLevel(this.errorLebel)
//    Logger.log("@hasErrLv ret=" + ret);
    if ( this.hasErrorLevel(level) )
    {
      var lstr = this.getErrLvStr(level);
      Logger.log("[" + lstr + "]" + func + "() " + msg);
    }
  }
  
  return Log;
})();

function test() {
  /* TEST Case
  NONE設定で出力されないこと
  各設定時に、全設定でログ出力を行い、設定値以下でないと出力されないこと
  レベル変更で正常にレベル変更されること
  異常値設定でNONE扱いとなること
  */
  var log = new Log(ERR_LV_TRACE);
  
  // 全レベル変更
  for ( var lv = -1; lv <= ERR_LV_TRACE; lv++ )
  {
    log.chenchErrorLevel(lv);
    Logger.log("---[Lavel " + log.getErrLvStr(lv) + "(" + log.errorLebel + ")]---");
    // 全レベル実行
    for ( var ii = 0; ii <= ERR_LV_TRACE; ii++ )
    {
      Logger.log("[Lv:" + ii + "]");
      log.output("func", "output log Lv_" + ii, ii);
    }
  }
}







