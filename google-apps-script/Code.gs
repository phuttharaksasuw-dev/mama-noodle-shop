/*
 * MAMA NOODLE — Google Apps Script
 * วิธีใช้: วางโค้ดนี้ใน Apps Script ที่ผูกกับ Google Spreadsheet
 * ชีต Products: SKU | Name | Description | Price | Stock | ImageURL
 * ชีต Orders: OrderID | CreatedAt | Customer | Phone | Address | Note | ItemsJSON | Total | Status
 */
const PRODUCT_SHEET = "Products";
const ORDER_SHEET = "Orders";

function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let p = ss.getSheetByName(PRODUCT_SHEET) || ss.insertSheet(PRODUCT_SHEET);
  let o = ss.getSheetByName(ORDER_SHEET) || ss.insertSheet(ORDER_SHEET);
  if (p.getLastRow() === 0) {
    p.appendRow(["SKU","Name","Description","Price","Stock","ImageURL"]);
    p.appendRow(["MN001","บะหมี่รสหมูสับ","รสหมูสับกลมกล่อม อร่อยง่ายในทุกมื้อ",10,100,""]);
    p.appendRow(["MN002","บะหมี่รสต้มยำกุ้ง","รสต้มยำเข้มข้น เปรี้ยวเผ็ดกำลังดี",12,100,""]);
  }
  if (o.getLastRow() === 0) o.appendRow(["OrderID","CreatedAt","Customer","Phone","Address","Note","ItemsJSON","Total","Status"]);
}

function doGet(e) {
  setupSheets();
  const action = (e.parameter.action || "products").toLowerCase();
  let result;
  if (action === "products") result = {ok:true, products:getProducts_()};
  else if (action === "orders") result = {ok:true, orders:getOrders_()};
  else result = {ok:false, message:"Unknown action"};
  const json = JSON.stringify(result);
  const callback = e.parameter.callback;
  if (callback) return ContentService.createTextOutput(callback + "(" + json + ");").setMimeType(ContentService.MimeType.JAVASCRIPT);
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  setupSheets();
  try {
    const body = JSON.parse(e.postData.contents || "{}");
    if (body.action !== "createOrder" || !body.order) throw new Error("Invalid request");
    const o = body.order;
    if (!o.customer || !o.phone || !o.address || !Array.isArray(o.items) || !o.items.length) throw new Error("Missing order data");
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(ORDER_SHEET);
    sheet.appendRow([o.orderId, new Date(o.createdAt), o.customer, o.phone, o.address, o.note || "", JSON.stringify(o.items), Number(o.total), "รอแพ็กสินค้า"]);
    return ContentService.createTextOutput(JSON.stringify({ok:true,orderId:o.orderId})).setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ok:false,message:String(err)})).setMimeType(ContentService.MimeType.JSON);
  }
}

function getProducts_() {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(PRODUCT_SHEET);
  if (sh.getLastRow() < 2) return [];
  return sh.getRange(2,1,sh.getLastRow()-1,6).getValues().filter(r=>r[0] && r[1]).map(r=>({
    sku:String(r[0]), name:String(r[1]), description:String(r[2]||""),
    price:Number(r[3])||0, stock:Number(r[4])||0, image:String(r[5]||"")
  }));
}

function getOrders_() {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(ORDER_SHEET);
  if (sh.getLastRow() < 2) return [];
  return sh.getRange(2,1,sh.getLastRow()-1,9).getValues().reverse().map(r=>({
    orderId:String(r[0]), createdAt:r[1] instanceof Date ? r[1].toISOString() : String(r[1]),
    customer:String(r[2]), phone:String(r[3]), address:String(r[4]), note:String(r[5]||""),
    items:parseItems_(r[6]), total:Number(r[7])||0, status:String(r[8]||"รอแพ็กสินค้า")
  }));
}
function parseItems_(value) { try { return JSON.parse(value || "[]"); } catch(e) { return []; } }
