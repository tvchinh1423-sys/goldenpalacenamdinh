const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');

const FOLDERS = [
  { name: 'tang-2', id: '1qIsFhCojImpIQ4RUYlL1wglvPLawMMiC' },
  { name: 'tang-3', id: '1QzN7kGHWc-dmuIzYKGB8NowftLJCinZJ' },
  { name: 'tang-4', id: '1bKSsDbDT-mYgmxxyay1iKs6pMcd3Gq-X' },
  { name: 'phong-vip', id: '1lmVcSknJKOVCM9fjU6SYJdGpV0tLk9wG' },
  { name: 'quay-bar', id: '1HbsI6CCNc2UCnW7ywRuMcW_IaErDdBf2' }
];

const destDir = '/Users/vanchiinh_/Downloads/Đặt tiệc - Golden Palace/golden-palace/public/images/venues';

function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadImage(res.headers.location, destPath).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          console.log(`Saved: ${path.basename(destPath)} (${fs.statSync(destPath).size} bytes)`);
          resolve();
        });
      });
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

async function scrapeAllFolders() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  for (const folder of FOLDERS) {
    const folderUrl = `https://drive.google.com/drive/folders/${folder.id}`;
    console.log(`\n-----------------------------------------`);
    console.log(`Scanning Google Drive Folder: ${folder.name} (${folderUrl})`);
    
    await page.goto(folderUrl, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(r => setTimeout(r, 5000));

    // Extract file IDs and thumbnail URLs
    const filesInfo = await page.evaluate(() => {
      const result = [];
      document.querySelectorAll('[data-id], [aria-label]').forEach(el => {
        const id = el.getAttribute('data-id') || el.getAttribute('data-target-id');
        const label = el.getAttribute('aria-label') || '';
        if (id && id.length > 20 && !result.some(r => r.id === id)) {
          result.push({ id, label });
        }
      });
      return result;
    });

    console.log(`Found ${filesInfo.length} files in ${folder.name}:`, filesInfo.map(f => f.label || f.id).slice(0, 10));

    let count = 1;
    for (const f of filesInfo) {
      if (count > 5) break; // Download top 5 photos per folder
      // Google Drive Direct Thumbnail/Export URL
      const highResUrl = `https://drive.google.com/thumbnail?id=${f.id}&sz=w1600`;
      const savePath = path.join(destDir, `${folder.name}-${count}.jpg`);
      try {
        await downloadImage(highResUrl, savePath);
        count++;
      } catch (err) {
        console.error(`Failed to download ${f.id}:`, err.message);
      }
    }
  }

  await browser.close();
  console.log('\n✅ Completed downloading photos from all Google Drive folders!');
}

scrapeAllFolders().catch(err => console.error('Scrape all error:', err));
