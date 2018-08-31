// MMp5fEU3rlbg4ViQXGORjNtiHJHGnRMgN

function getGasSS(id) {
  return new GasSS(id);
}

// GASからスプレッドシートを操作する為のクラス
var GasSS = (function() {
  // メンバ変数
  this.spreadsheetID = null;  // スプレッドシートID
  this.sheetName = null;      // 操作対象シート名
  this._spreadsheet = null;   // スプレッドシートオブジェクト
  this._sheet = null;         // シートオブジェクト
  this.log = null;            // ログオブジェクト
  
  // コンストラクタ
  var GasSS = function(id) {
    this.spreadsheetID = id;
    this.log = new Log(ERR_LV_TRACE)
    this.log.output("GasSS", this.spreadsheetID, ERR_LV_TRACE);
  }
  
  // クラスメソッド用プロトタイプ
  var p = GasSS.prototype;
  
  // プロトタイプ内でメソッドを定義
  // シートIDのセット
  // @param string id シートID
  p.setId = function(id) {
    this.spreadsheetID = id;
    this.log.output("setId", "spreadsheetID=" + this.spreadsheetID, ERR_LV_DEBUG);
  }
  // シート名のセット
  // @param string sheetName シート名
  p.setSheetName = function(sheetName) {
    this.sheetName = sheetName;
    this.log.output("setSheetName", "sheetName=" + this.sheetName, ERR_LV_DEBUG);
  }
  // シートを開く
  p.openSheet = function() {
    this._openSheet(this.spreadsheetID, this.sheetName);
  }
  // シートを開く
  // @param string id シートID
  // @param string sheetName シート名
  p._openSheet = function(id, sheetName) {
    if ( id == null || sheetName == null ) {
      this.log.output("openSheet", "invalid argment: is null > id=" + id + ", sheetName=" + sheetName, ERR_LV_DEBUG);
      return;
    }
    // シートオープン
    this._spreadsheet = SpreadsheetApp.openById(id);
    this._sheet = this._spreadsheet.getSheetByName(sheetName);
  }
  // シートオープンチェック
  // @return bool true:opened
  p.isOpenedSheet = function() {
    var msg = ""
    if ( this._sheet != null )
    {
      msg = "[" + sheetName + "] sheet is opened.";
    }
    else
    {
      msg = "sheet is NOT opened";
    }
    this.log.output("isOpenedSheet", msg, ERR_LV_DEBUG);
  }
  // シートの読み込み
  // @param string range 参照文字列　ex: "a1", ex: "a1:a5"
  // @return string[] 読み込み結果
  p.getCellValue = function(range) {
    this.log.output("getCellValue", "sheet=" + this._sheet, ERR_LV_TRACE);
    var val = this._sheet.getRange(range).getValues();
    return val;
  }
  // シートの書き込み
  // @param string range 参照文字列　ex: "a1", ex: "a1:a5"
  // @param var value 書き込みデータ
  p.setCellValue = function(range, value) {
    this.log.output("setCellValue", "sheet=" + this._sheet, ERR_LV_TRACE);
    this._sheet.getRange(range).setValue(value);
    this.log.output("setCellValue", "range=" + range + "←" + value, ERR_LV_DEBUG);
  }
  
  return GasSS;
})();

/**
 * アクティブシートの対象セルに文字列を入力
 * シンプルなシート書き込みです。
 * スプレッドシートにGASを組み込んでいる場合は、こちらを使用可能。
 *
 * @param msg 書き込み文字列
 * @param row 行番号
 * @param col 列番号
 */
function writeSheet(msg, row, col) {
  // Excelへデータの記入
  var sheet = SpreadsheetApp.getActiveSheet();
  sheet.getRange(row, col).setValue(msg);
  Logger.log(msg + "[" + row + ", " + col + "]");
}
/**
 * アクティブシートの範囲書込します。
 *
 * @param msgArr 書込文字列を入れた2次元配列
 * @param startRow 書込開始行
 * @param startCol 書込開始列
 */
function writeRange(msgArr, startRow, startCol) {
  var sheet = SpreadsheetApp.getActiveSheet();
  var rowRange = msgArr.length;
  var colRange = msgArr[0].length;

  sheet.getRange(startRow, startCol, rowRange, colRange).setValues(msgArr);
}
/**
 * アクティブシートの範囲読込します。
 *
 * @param startRow 読込開始行
 * @param startCol 読込開始列
 * @param rowSize 読込行サイズ
 * @param colSize 読込列サイズ
 */
function readRange(startRow, startCol, rowSize, colSize) {
  var sheet = SpreadsheetApp.getActiveSheet();
  return sheet.getRange(startRow, startCol, rowSize, colSize).getValues();
}

/*
//--[test]---------------------------------
function testss() {
  var manager = new GasSS("15JTPRD8t_gR41MUBSQpFJ-wqh96eByeFcZaWKrIHEAQ");
  manager.setSheetName("Sheet1");
  manager.openSheet();
  manager.isOpenedSheet();
  
  Logger.log(manager.getCellValue("a1"));
  Logger.log(manager.getCellValue("a1:a5"));
  manager.setCellValue("a2", 99);
  Logger.log(manager.getCellValue("a1:a6"));
}
//--[sample]-------------------------------
var baseURL = "https://sheets.googleapis.com/v4/";            　// ベースとなるURL
var api_key = "AIzaSyDexy0_BQ81MpQ5cIQFWamn-JyRyjWLaxU";        // APIキー1
var sheet_id = "15JTPRD8t_gR41MUBSQpFJ-wqh96eByeFcZaWKrIHEAQ";  // シートID
var sheet_name = "Sheet1";                                      // sheet

function test_read_write() {
  // シートの取得
  var spreadsheet = SpreadsheetApp.openById(sheet_id);
  var sheet = spreadsheet.getSheetByName(sheet_name);

  //W
  sheet.getRange("a2").setValue("10");

  // 読み込み
  Logger.log(sheet.getRange("a1").getValue());       // A1の値を取得            [18-03-20 12:47:49:063 JST] Data
  Logger.log(sheet.getRange("a1:a5").getValues());   // A1:A4の値を取得         [18-03-20 12:47:49:065 JST] [[Data], [10.0], [2.0], [3.0], [15.0]]
  var dat = sheet.getRange("a1:a5").getValues();
  Logger.log(dat[1]);                                // 範囲の場合、配列で返される [18-03-20 12:47:49:067 JST] [10.0]
  
  // 書き込み
  sheet.getRange("b1").setValue("W B1");
}

// セルの書込サンプル
// PUT /v4/spreadsheets/{spreadsheetId}/values/{range}
function write() {

  //  https://sheets.googleapis.com/v4/spreadsheets/15JTPRD8t_gR41MUBSQpFJ-wqh96eByeFcZaWKrIHEAQ のリクエストに失敗しました（エラー: 403）。
  //  サーバー応答の一部: { "error": { "code": 403, "message": "The request is missing a valid API key.", "status": "PERMISSION_DENIED" } } 
  //  （応答の全文を見るには muteHttpExceptions オプションを使用してください）（行 24、ファイル「コード」、プロジェクト「common」）

var payload = {"value" : "key" };
  var option = {
    method: "PUT",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  };
//  var url = baseURL + sheet_id + "/values/" + sheet_name + "!A1:A4?key=" + api_key;
//  var res = common.request(url, option);
  
  //  https://sheets.googleapis.com/v4/spreadsheets/15JTPRD8t_gR41MUBSQpFJ-wqh96eByeFcZaWKrIHEAQ/values/Sheet1!B1=1?key=AIzaSyDexy0_BQ81MpQ5cIQFWamn-JyRyjWLaxU のリクエストに失敗しました（エラー: 400）。
  //  サーバー応答の一部: { "error": { "code": 400, "message": "Unable to parse range: Sheet1!B1=1", "status": "INVALID_ARGUMENT" } } 
  //  （応答の全文を見るには muteHttpExceptions オプションを使用してください）（行 24、ファイル「コード」、プロジェクト「common」）

  var url = baseURL + "spreadsheets/" + sheet_id;
  url += "/values/" + sheet_name + "!B1?key=" + api_key;
  var res = common.request(url);


  Logger.log(res);
}

// セルの読み込みサンプル
// GET /v4/spreadsheets/{spreadsheetId}/values/{range}
function read() {
  var url = baseURL + "spreadsheets/" + sheet_id + "/values/" + sheet_name + "!A1:A4?key=" + api_key;
  var res = common.request(url);
  Logger.log(res);
  
  //  結果：
  //  [18-03-13 07:32:01:340 JST] {
  //  "range": "Sheet1!A1:A4",
  //  "majorDimension": "ROWS",
  //  "values": [
  //    [
  //      "Data"
  //    ],
  //    [
  //      "データ1"
  //    ],
  //    [
  //      "データ2"
  //    ],
  //    [
  //      "データ3"
  //    ]
  //   ]
  //  }
}
*/