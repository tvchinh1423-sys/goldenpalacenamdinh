const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function scrapeGDrive() {
  console.log('Opening Puppeteer browser to inspect Google Drive folder...');
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

  console.log('Page loaded, waiting for items to render...');
  await new Promise(r => setTimeout(r, 6000));

  // Extract folder items and image thumbnails
  const data = await page.evaluate(() => {
    const labels = [];
    document.querySelectorAll('[aria-label]').forEach(el => {
      const label = el.getAttribute('aria-label');
      if (label && label.length > 2) {
        labels.push(label);
      }
    });

    const imgs = Array.from(document.querySelectorAll('img'))
      .map(img => img.src)
      .filter(src => src.includes('googleusercontent.com') || src.includes('drive'));

    return { labels: Array.from(new Set(labels)), imgs };
  });

  console.log('--- FOUND DRIVE ITEMS ---');
  console.log(data.labels.filter(l => !l.includes('Google') && !l.includes('Drive')).slice(0, 40));
  console.log('--- FOUND IMAGE THUMBNAILS --- count:', data.imgs.length);
  console.log(data.imgs.slice(0, 15));

  await browser.close();
}

scrapeGDrive().catch(err => console.error('GDrive scrape error:', err));
