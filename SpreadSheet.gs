
// GASからスプレッドシートを操作する為のクラス
var GasSS = (function() {
  // メンバ変数
  this.spreadsheetID = null;
  this.sheetName = null;
  this._sheet = null
  
  // コンストラクタ
  var GasSS = function(id) {
    this.spreadsheetID = id;
    this.log("GasSS", this.spreadsheetID);
  }
  
  // クラスメソッド用プロトタイプ
  var p = GasSS.prototype;
  
  // プロトタイプ内でメソッドを定義
  p.test = function(text) { Logger.log(text); }
  // ログ出力
  p.log = function(func, text) { Logger.log(func + "() " + text); }
  // 値のセット
  p.setId = function(id) {
    this.spreadsheetID = id;
    this.log("setId", "spreadsheetID=" + this.spreadsheetID);
  }
  p.setSheetName = function(sheetName) {
    this.sheetName = sheetName;
    this.log("setSheetName", "sheetName=" + this.sheetName);
  }
  // シートを開く
  p.openSheet = function() {
    this._openSheet(this.spreadsheetID, this.sheetName);
  }
  p._openSheet = function(id, sheetName) {
    if ( id == null || sheetName == null ) {
      this.log("openSheet", "invalid argment: is null > id=" + id + ", sheetName=" + sheetName);
      return;
    }
    this._sheet = this._sheet.getSheetByName(sheet_name);
  }
  // シートの読み込み
  p.getCellValue = function(range) {
    var val = this._sheet.getRange(range).getValue();
    this.log("getCellValue()", "range=" + range + ": " + val);
  }
  
  
  return GasSS;
})();
//--[test]---------------------------------
function test() {
  var manager = new GasSS("15JTPRD8t_gR41MUBSQpFJ-wqh96eByeFcZaWKrIHEAQ");
  manager.setSheetName("Sheet1");
  manager.openSheet();
  manager.getCellValue("a1");
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

  // 読み込み
  Logger.log(sheet.getRange("a1").getValue());       // A1の値を取得
  Logger.log(sheet.getRange("a1:a4").getValues());   // A1:A4の値を取得
  var dat = sheet.getRange("a1:a4").getValues();
  Logger.log(dat[1]);                                // 範囲の場合、配列で返される
  
  // 書き込み
  sheet.getRange("b1").setValue("W B1");
}

// セルの書込サンプル
// PUT /v4/spreadsheets/{spreadsheetId}/values/{range}
function write() {
  /*******************************************
  https://sheets.googleapis.com/v4/spreadsheets/15JTPRD8t_gR41MUBSQpFJ-wqh96eByeFcZaWKrIHEAQ のリクエストに失敗しました（エラー: 403）。
  サーバー応答の一部: { "error": { "code": 403, "message": "The request is missing a valid API key.", "status": "PERMISSION_DENIED" } } 
  （応答の全文を見るには muteHttpExceptions オプションを使用してください）（行 24、ファイル「コード」、プロジェクト「common」）
  *******************************************/
  var payload = {"value" : "key" };
  var option = {
    method: "PUT",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  };
//  var url = baseURL + sheet_id + "/values/" + sheet_name + "!A1:A4?key=" + api_key;
//  var res = common.request(url, option);
  
  /*******************************************
  https://sheets.googleapis.com/v4/spreadsheets/15JTPRD8t_gR41MUBSQpFJ-wqh96eByeFcZaWKrIHEAQ/values/Sheet1!B1=1?key=AIzaSyDexy0_BQ81MpQ5cIQFWamn-JyRyjWLaxU のリクエストに失敗しました（エラー: 400）。
  サーバー応答の一部: { "error": { "code": 400, "message": "Unable to parse range: Sheet1!B1=1", "status": "INVALID_ARGUMENT" } } 
  （応答の全文を見るには muteHttpExceptions オプションを使用してください）（行 24、ファイル「コード」、プロジェクト「common」）
  *******************************************/
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
  /*---------------------------------------
  結果：
  [18-03-13 07:32:01:340 JST] {
  "range": "Sheet1!A1:A4",
  "majorDimension": "ROWS",
  "values": [
    [
      "Data"
    ],
    [
      "データ1"
    ],
    [
      "データ2"
    ],
    [
      "データ3"
    ]
   ]
  }
  ---------------------------------------*/
}
