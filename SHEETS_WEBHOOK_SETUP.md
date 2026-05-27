Google Sheets webhook (Google Apps Script) setup

This file explains how to create a simple Google Apps Script web app that accepts POST requests
and appends rows to a Google Sheet. Deploy the script and copy the Web App URL into your Vite env
as `VITE_SHEET_WEBHOOK` so the site can POST submissions for both the project form and bookings.

Steps

1. Create a Google Sheet and note its ID (the long string in the URL).
2. Open Extensions → Apps Script in the Google Sheets UI and replace the default code with the script below.
3. Deploy the script as a Web App: `Deploy` → `New deployment` → choose `Web app`.
   - Set `Execute as` to **Me**.
   - For `Who has access`, choose **Anyone** (or a more restricted option if you use OAuth). Using **Anyone** allows the static site to POST without OAuth.
4. Copy the web app URL and set it in your project `.env` as:

VITE_SHEET_WEBHOOK=https://script.google.com/macros/s/XXXX/exec

Apps Script example (Code.gs)

```javascript
// Store your secret in the script's Properties: Project Settings → Script properties → Add key WEBHOOK_SECRET
function doPost(e) {
  try {
    var body = e.postData && e.postData.contents ? JSON.parse(e.postData.contents) : {};

    // Verify secret (recommended)
    var expected = PropertiesService.getScriptProperties().getProperty('WEBHOOK_SECRET') || '';
    var provided = body.secret || '';
    if (expected && provided !== expected) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: 'error', message: 'invalid secret' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var ss = SpreadsheetApp.openById('YOUR_SPREADSHEET_ID');
    var sheet = ss.getSheetByName('Sheet1') || ss.getSheets()[0];

    // Build headers if sheet is empty
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    if (!headers || headers.length === 0 || headers[0] === '') {
      var defaultHeaders = Object.keys(body);
      sheet.appendRow(defaultHeaders);
      headers = defaultHeaders;
    }

    // Map payload keys to sheet columns (preserves header order)
    var row = headers.map(function(h) { return body[h] || ''; });
    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({ status: 'ok' })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: String(err) })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

Notes & security

- The React app should send a JSON body that includes a `secret` field matching the `WEBHOOK_SECRET` stored in the Apps Script properties. The app also sends a `timestamp` and `type` (e.g. `project_lead` or `booking`).
- To set the script property: in Apps Script open Project Settings → Script properties and add `WEBHOOK_SECRET`.
- For local development, create a `.env` with `VITE_SHEET_WEBHOOK` and `VITE_SHEET_SECRET`. See `.env.example` in the repo.
- Apps Script web apps do not provide direct access to arbitrary HTTP headers from `doPost`; include the secret in the JSON payload (the script checks `body.secret`).
- For public-facing production systems, consider using an authenticated backend or Cloud Function with proper IAM and rate limiting. This setup is fine for internal tools or low-risk demos.

Quick test

1. Deploy the web app and copy the URL.
2. In the project root create a `.env` file (do NOT commit it) with:

```
VITE_SHEET_WEBHOOK=https://script.google.com/macros/s/XXXX/exec
VITE_SHEET_SECRET=your-secret-token-here
```

3. Run the dev server:

```bash
npm install
npm run dev
```

4. Open the site, fill the form, and submit. Confirm a new row appears in the spreadsheet.

If you need, I can also add a small server-side alternative (Cloud Function) that accepts headers and provides more secure handling.
