const fs = require('fs');
const path = require('path');
const https = require('https');

const barFileIds = [
  '1kyCDo5Dl_11rg6NSgt24rsEVxIMh1O13',
  '1hVzr2APdo6Ve-SiiKxb9uTmzGu221127',
  '1Y3ayFzBSCRfv8la_HwaM94MbrI0ectGO',
  '1GfNv-MrJbRe4Y6q-iwXZUryqfZsU-j32'
];

const destDir = '/Users/vanchiinh_/Downloads/Đặt tiệc - Golden Palace/golden-palace/public/images/venues';

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
  let c = 1;
  for (const id of barFileIds) {
    const url = `https://lh3.googleusercontent.com/d/${id}=s1600`;
    const destPath = path.join(destDir, `quay-bar-${c}.jpg`);
    await downloadFile(url, destPath);
    console.log(`Saved quay-bar-${c}.jpg (${fs.statSync(destPath).size} bytes)`);
    c++;
  }
}

run();
