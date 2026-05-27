Google Sheets webhook (Google Apps Script) setup

This file explains how to create a simple Google Apps Script web app that accepts POST requests
and appends rows to a Google Sheet. Deploy the script and copy the Web App URL into your Vite env
as `VITE_SHEET_WEBHOOK` so the site can POST submissions for both the project form and bookings.

Steps

1. Create a Google Sheet and note its ID (the long string in the URL).
2. Open Extensions → Apps Script in the Google Sheets UI and replace the default code with the script below.
3. Deploy the script as a Web App (Publish → Deploy as web app), set `Execute as: Me` and `Who has access: Anyone`.
4. Copy the web app URL and set it in your project `.env` as:

VITE_SHEET_WEBHOOK=https://script.google.com/macros/s/XXXX/exec

Apps Script example (Code.gs)

```javascript
function doPost(e) {
  try {
    var ss = SpreadsheetApp.openById('YOUR_SPREADSHEET_ID');
    var sheet = ss.getSheetByName('Sheet1') || ss.getSheets()[0];

    var data = JSON.parse(e.postData.contents);
    var headers = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];

    // If sheet is empty, create headers
    if (!headers || headers.length === 0 || headers[0] === '') {
      var defaultHeaders = Object.keys(data);
      sheet.appendRow(defaultHeaders);
    }

    var row = [];
    var keys = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
    keys.forEach(function(k) {
      row.push(data[k] || '');
    });

    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({status: 'ok'})).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({status: 'error', message: err})).setMimeType(ContentService.MimeType.JSON);
  }
}
```

Notes

- This script uses a JSON payload; the React app sends `{ type: 'project_lead', timestamp: ..., ...form }`.
- Make sure the Web App's access settings match your security needs. "Anyone" lets the site POST without auth.
- For production, consider adding simple verification (secret token) to the payload and validating it server-side.

Using a secret

- Add a `secret` field to the payload and check it in `doPost` before appending.
- Store the secret in your Apps Script `PropertiesService` or in the site's environment variables.

Security

- This setup is minimal and intended for quick demos or internal tools. For public-facing sites, prefer a proper backend or Cloud Function with authentication and rate limiting.
