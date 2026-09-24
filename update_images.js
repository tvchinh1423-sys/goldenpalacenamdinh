const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const sourceDir = '/tmp/gdrive_images_full';
const destDir = '/Users/vanchiinh_/Downloads/Đặt tiệc - Golden Palace/golden-palace/public/images/hd-venues';
const seedFile = '/Users/vanchiinh_/Downloads/Đặt tiệc - Golden Palace/golden-palace/prisma/seed.js';
const spacePageFile = '/Users/vanchiinh_/Downloads/Đặt tiệc - Golden Palace/golden-palace/src/app/(client)/khong-gian/[slug]/page.js';

if (!fs.existsSync(sourceDir)) {
  console.error('Source directory not found!');
  process.exit(1);
}

// Xoá toàn bộ ảnh cũ trong destDir
if (fs.existsSync(destDir)) {
  console.log('Xóa toàn bộ ảnh cũ...');
  execSync(`rm -rf "${destDir}"/*`);
} else {
  fs.mkdirSync(destDir, { recursive: true });
}

// Map Tên thư mục GDrive sang mã slug
const folderMap = {
  'TẦNG 2': 'tang-2',
  'TẦNG 3': 'tang-3',
  'TẦNG 4': 'tang-4',
  'BAR': 'quay-bar',
  'VIP': 'phong-vip'
};

const counts = {};

for (const folderName of fs.readdirSync(sourceDir)) {
  const folderPath = path.join(sourceDir, folderName);
  if (fs.statSync(folderPath).isDirectory()) {
    let slug = '';
    for (const [key, val] of Object.entries(folderMap)) {
      if (folderName.toUpperCase().includes(key)) slug = val;
    }
    
    if (slug) {
      const files = fs.readdirSync(folderPath).filter(f => f.match(/\.(jpg|jpeg|png)$/i)).sort();
      let count = 0;
      for (const file of files) {
        count++;
        const ext = path.extname(file);
        const newName = `${slug}-hd-${count}${ext.toLowerCase()}`;
        fs.copyFileSync(path.join(folderPath, file), path.join(destDir, newName));
      }
      counts[slug] = count;
      console.log(`Copied ${count} images for ${slug}`);
    }
  }
}

// Cập nhật số lượng ảnh trong prisma/seed.js
let seedContent = fs.readFileSync(seedFile, 'utf8');
for (const [slug, count] of Object.entries(counts)) {
  const regex = new RegExp(`makeHdImages\\('${slug}', \\d+\\)`, 'g');
  seedContent = seedContent.replace(regex, `makeHdImages('${slug}', ${count})`);
}
fs.writeFileSync(seedFile, seedContent);
console.log('Cập nhật prisma/seed.js');

// Cập nhật số lượng ảnh trong page.js
let pageContent = fs.readFileSync(spacePageFile, 'utf8');
for (const [slug, count] of Object.entries(counts)) {
  const regexList = new RegExp(`makeHdList\\('${slug}', \\d+\\)`, 'g');
  pageContent = pageContent.replace(regexList, `makeHdList('${slug}', ${count})`);
}
fs.writeFileSync(spacePageFile, pageContent);
console.log('Cập nhật [slug]/page.js');

// Seed lại DB
console.log('Seeding Database...');
try {
  execSync('node prisma/seed.js', { stdio: 'inherit', cwd: '/Users/vanchiinh_/Downloads/Đặt tiệc - Golden Palace/golden-palace' });
  console.log('Seed DB successful');
} catch (e) {
  console.error('Seed DB failed:', e);
}
