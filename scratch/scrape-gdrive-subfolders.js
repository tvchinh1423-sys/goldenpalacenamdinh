const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function scrapeGDriveSubfolders() {
  console.log('Opening Puppeteer browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  await page.goto('https://drive.google.com/drive/folders/16KT_D46aIg9Jq0KM9u8imNpNU-bxgILo', {
    waitUntil: 'networkidle2',
    timeout: 60000
  });

  await new Promise(r => setTimeout(r, 4000));

  // Find elements with text containing 'HỘI TRƯỜNG', 'PHÒNG VIP', 'QUẦY BAR'
  const folderElements = await page.evaluate(() => {
    const res = [];
    document.querySelectorAll('[data-id], [aria-label]').forEach(el => {
      const label = el.getAttribute('aria-label') || el.innerText || '';
      if (label.includes('HỘI TRƯỜNG') || label.includes('PHÒNG VIP') || label.includes('QUẦY BAR')) {
        const id = el.getAttribute('data-id') || el.getAttribute('data-target-id');
        res.push({ label, id, html: el.outerHTML.slice(0, 200) });
      }
    });
    return res;
  });

  console.log('Found Folder Elements:', folderElements);

  // Take a full screenshot of the Drive page so we can see
  const screenshotPath = path.join(__dirname, 'gdrive-page.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log('Screenshot saved to:', screenshotPath);

  await browser.close();
}

scrapeGDriveSubfolders().catch(err => console.error('GDrive subfolders scrape error:', err));
