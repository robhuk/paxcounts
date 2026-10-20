# Passenger Count PWA

A mobile-first passenger-counting Progressive Web App with an XC red, navy and blue theme.

## Features
- Starts with one train; add additional trains as required.
- Date, headcode(s), per-train unit number, and a bottom-of-form Notes / Reason field (e.g. reason for not using STAR Mobile).
- Full and Standing checkbox for each train.
- Ten station rows per train; editable station, First Class and Standard counts; totals calculated automatically.
- Save button at the top, automatic draft persistence, saved-report list, load and delete.
- Copy report to clipboard.
- Copy report and open the device's native email app with counts prefilled in the message body.
- Print/PDF preview with Print and Close Preview controls.
- Offline shell cache and update check every 12 hours when opened.
- Unique cache and local-storage identifiers; routine app updates do not delete saved passenger counts.
- GitHub Pages compatible with relative paths.

## Deploy to GitHub Pages
1. Create a repository and upload `index.html`, `manifest.webmanifest`, `sw.js`, `icon.svg`, and `README.md` to the repository root.
2. In repository **Settings → Pages**, choose deployment from the `main` branch and `/ (root)`.
3. Open the published HTTPS URL once while online.
4. On iPhone/iPad, open the site in Safari and choose **Share → Add to Home Screen**.

## Notes
- Saved counts are stored locally in the browser on the device. They are not synchronised between devices.
- Email applications differ in how they handle prefilled message bodies. The app copies the report and opens the native email composer; paste the report if it is not automatically inserted.
- PDF export uses the browser/device print sheet. Select **Save as PDF** where offered.
- Service worker updates are checked on app open at most every 12 hours. New service-worker shell assets are cached separately from saved records.
