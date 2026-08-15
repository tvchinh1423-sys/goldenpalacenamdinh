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

const destDir = '/Users/vanchiinh_/Downloads/Đặt tiệc - Golden Palace/golden-palace/public/images/hd-venues';

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadFile(res.headers.location, destPath).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve());
      });
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

async function run() {
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  const galleryMapping = {};

  for (const folder of FOLDERS) {
    console.log(`\n========================================`);
    console.log(`Inspecting Folder: ${folder.name} (${folder.id})`);
    
    await page.goto(`https://drive.google.com/drive/folders/${folder.id}`, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(r => setTimeout(r, 5000));

    // Scroll down to load more items if needed
    await page.evaluate(() => window.scrollBy(0, 1000));
    await new Promise(r => setTimeout(r, 2000));

    const filesInfo = await page.evaluate(() => {
      const res = [];
      document.querySelectorAll('[data-id]').forEach(el => {
        const id = el.getAttribute('data-id');
        const label = el.getAttribute('aria-label') || el.innerText || '';
        if (id && id.length > 20 && !res.some(r => r.id === id)) {
          res.push({ id, label });
        }
      });
      return res;
    });

    console.log(`Total items found in ${folder.name}: ${filesInfo.length}`);
    galleryMapping[folder.name] = [];

    let downloadedCount = 0;
    for (const f of filesInfo) {
      if (downloadedCount >= 12) break; // Get top 12 crisp HD photos per folder

      // Ignore video files or non-image labels if detected
      if (f.label.toLowerCase().includes('.mp4') || f.label.toLowerCase().includes('.mov') || f.label.toLowerCase().includes('video')) {
        console.log(`Skipping video file: ${f.label}`);
        continue;
      }

      const tempPath = path.join(destDir, `${folder.name}-temp-${f.id.slice(0, 8)}.jpg`);
      const highResUrl = `https://lh3.googleusercontent.com/d/${f.id}=s2400`;

      try {
        await downloadFile(highResUrl, tempPath);
        const sz = fs.statSync(tempPath).size;

        // FILTER: Only keep high quality photos (>150KB), discard blurry icons/video stills (<100KB)
        if (sz > 120000) {
          downloadedCount++;
          const finalFilename = `${folder.name}-hd-${downloadedCount}.jpg`;
          const finalPath = path.join(destDir, finalFilename);
          fs.renameSync(tempPath, finalPath);
          console.log(`✅ Saved Crisp HD Photo ${downloadedCount}: ${finalFilename} (${(sz / 1024).toFixed(1)} KB)`);
          galleryMapping[folder.name].push(`/images/hd-venues/${finalFilename}`);
        } else {
          console.log(`⚠️ Discarded low-res/video still: ${f.id} (${(sz / 1024).toFixed(1)} KB)`);
          fs.unlinkSync(tempPath);
        }
      } catch (err) {
        console.error(`Error downloading ${f.id}:`, err.message);
      }
    }
  }

  await browser.close();

  // Save mapping to JSON
  fs.writeFileSync(path.join(__dirname, 'hd-gallery-map.json'), JSON.stringify(galleryMapping, null, 2));
  console.log('\n✨ DOWNLOAD COMPLETE! HD Gallery Map saved to hd-gallery-map.json');
}

run().catch(err => console.error('HD download error:', err));
