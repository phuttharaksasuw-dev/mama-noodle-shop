# MAMA NOODLE — โครงงานเว็บไซต์ร้านบะหมี่กึ่งสำเร็จรูป

เว็บไซต์ตัวอย่างประกอบด้วยหน้าร้าน (`index.html`) หน้าจัดการคำสั่งซื้อ (`admin.html`) ตะกร้าสินค้า แบบฟอร์มข้อมูลผู้รับ และใบแพ็ก/จ่าหน้าพัสดุสำหรับพิมพ์

## ไฟล์ในโปรเจกต์
- `index.html` — หน้า Landing Page และหน้าสั่งซื้อ
- `admin.html` — หน้าดูคำสั่งซื้อและพิมพ์ใบแพ็ก/จ่าหน้าพัสดุ
- `style.css` — รูปแบบและการจัดหน้าจอ
- `app.js` — รายการสินค้า ตะกร้า และการสั่งซื้อ
- `admin.js` — แสดงคำสั่งซื้อและพิมพ์
- `config.js` — URL สำหรับเชื่อม Google Apps Script
- `images/` — เก็บรูปสินค้า แยกจากไฟล์หน้าเว็บ
- `google-apps-script/Code.gs` — โค้ดเชื่อม Google Sheets

## ทดลองเปิดเว็บไซต์บนเครื่อง
1. แตกไฟล์ ZIP
2. เปิดโฟลเดอร์ `mama-noodle-shop` ใน VS Code
3. เปิด `index.html` ด้วยเว็บเบราว์เซอร์ (แนะนำติดตั้งส่วนเสริม Live Server ใน VS Code แล้วคลิกขวา `index.html` > Open with Live Server)
4. ในโหมดเริ่มต้น เว็บไซต์ใช้สินค้า demo และเก็บคำสั่งซื้อใน Local Storage ของเบราว์เซอร์เครื่องนั้น

> โหมดสาธิตไม่ได้ส่งคำสั่งซื้อไป Google Sheets และข้อมูลจะอยู่เฉพาะเบราว์เซอร์/เครื่องที่ใช้ทดสอบ

## เชื่อม Google Sheets
1. ไปที่ https://sheets.google.com แล้วสร้าง Spreadsheet ชื่อ `MAMA NOODLE DATA`
2. เปิดเมนู Extensions > Apps Script
3. ลบโค้ดตัวอย่าง แล้วคัดลอกเนื้อหาจาก `google-apps-script/Code.gs` ไปวาง
4. กด Save
5. เลือกฟังก์ชัน `setupSheets` แล้วกด Run ครั้งแรก จากนั้นอนุญาตสิทธิ์ตามหน้าจอ Google
6. กลับไปที่ Apps Script กด Deploy > New deployment
7. เลือกประเภท Web app
8. Execute as: Me
9. Who has access: Anyone (หรือ Anyone with the link หากหน้าจอแสดงตัวเลือกนี้)
10. กด Deploy และคัดลอก Web app URL ที่ลงท้ายด้วย `/exec`
11. เปิด `config.js` แล้วใส่ URL ใน `GOOGLE_SCRIPT_URL` เช่น
   `GOOGLE_SCRIPT_URL: "https://script.google.com/macros/s/รหัสของคุณ/exec"`
12. บันทึกไฟล์ แล้ว Deploy เว็บไซต์ใหม่

### โครงสร้าง Google Sheets
แท็บ `Products`:
| SKU | Name | Description | Price | Stock | ImageURL |
|---|---|---|---:|---:|---|
| MN001 | บะหมี่รสหมูสับ | รสหมูสับกลมกล่อม | 10 | 100 | |
| MN002 | บะหมี่รสต้มยำกุ้ง | รสต้มยำเข้มข้น | 12 | 100 | |

แท็บ `Orders` จะถูกสร้างอัตโนมัติเมื่อรัน `setupSheets` และเก็บข้อมูลคำสั่งซื้อที่ลูกค้าส่งเข้ามา

**การเพิ่มรูปสินค้า:** อัปโหลดไฟล์รูปลงโฟลเดอร์ `images` ใน GitHub แล้วนำ URL แบบ Raw ของรูปมาใส่ในคอลัมน์ `ImageURL` ของ Products (เช่น `https://raw.githubusercontent.com/ชื่อผู้ใช้/ชื่อrepo/main/images/mama-pork.jpg`)

## อัปโหลด GitHub
1. สร้าง Repository ใหม่ชื่อ `mama-noodle-shop`
2. ตั้งเป็น Public (เพื่อให้ Vercel เข้าถึงได้ง่าย) แล้วกด Create repository
3. ในหน้า repo เลือก Add file > Upload files
4. ลากไฟล์ทั้งหมดในโฟลเดอร์โปรเจกต์ (รวม `images` และ `google-apps-script`) ลงหน้าเว็บ
5. กด Commit changes

## Deploy ด้วย Vercel
1. เข้า https://vercel.com และ Sign up / Log in ด้วย GitHub
2. กด Add New > Project
3. Import Repository `mama-noodle-shop`
4. Framework Preset เลือก Other
5. Build Command และ Output Directory เว้นว่าง (Static HTML)
6. กด Deploy
7. เมื่อเสร็จจะได้ URL เว็บไซต์ `https://....vercel.app`

## ทดสอบก่อนส่งอาจารย์
- เปิด URL หน้าร้าน ตรวจว่ามีสินค้าอย่างน้อย 2 SKU
- เพิ่มสินค้าลงตะกร้าและตรวจยอดรวม
- กรอกชื่อ เบอร์โทร และที่อยู่ทดสอบ แล้วกดยืนยัน
- เปิด `/admin.html` ตรวจว่ามีคำสั่งซื้อ
- กดพิมพ์ใบแพ็ก/จ่าหน้าพัสดุ และตรวจหน้าตัวอย่างก่อนพิมพ์
- ตรวจ Google Sheets แท็บ Orders ว่ามีข้อมูลคำสั่งซื้อ (หลังเชื่อม Apps Script แล้ว)

## ข้อควรทราบ
- เว็บไซต์นี้เป็นโครงงานต้นแบบ ไม่ใช่ระบบชำระเงินออนไลน์จริง
- เวอร์ชันนี้บันทึกสถานะคำสั่งซื้อในหน้า demo ได้ แต่เมื่อเชื่อมชีตแล้วควรเปลี่ยนสถานะในแท็บ `Orders` โดยตรง
- ควรทดสอบการเชื่อม Apps Script และการส่งคำสั่งซื้อด้วยข้อมูลสมมติก่อนใช้จริง
- อย่าใส่ข้อมูลส่วนตัวจริงของลูกค้าในโหมดทดลองหรือ repository สาธารณะ
