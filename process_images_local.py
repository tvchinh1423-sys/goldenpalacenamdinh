import os
import glob
from PIL import Image
import re

# Install dependencies just in case
os.system("python3 -m pip install Pillow")

SOURCE_DIR = "/Users/vanchiinh_/Downloads/Đặt tiệc - Golden Palace"
DEST_DIR = "/Users/vanchiinh_/Downloads/Đặt tiệc - Golden Palace/golden-palace/public/images/hd-venues"
os.makedirs(DEST_DIR, exist_ok=True)

# Clean up destination directory
for f in glob.glob(os.path.join(DEST_DIR, "*")):
    os.remove(f)

# Mapping of folder names
folders = {
    "TẦNG 2": "tang-2",
    "TẦNG 2": "tang-2",
    "TẦNG 3": "tang-3",
    "TẦNG 3": "tang-3",
    "TẦNG 4": "tang-4",
    "TẦNG 4": "tang-4",
    "BAR": "quay-bar",
    "VIP": "phong-vip"
}

counts = {}

def resize_and_save(img_path, slug, count):
    try:
        with Image.open(img_path) as img:
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            max_size = (1920, 1080)
            img.thumbnail(max_size, Image.Resampling.LANCZOS)
            dest_path = os.path.join(DEST_DIR, f"{slug}-hd-{count}.jpg")
            img.save(dest_path, "JPEG", quality=80)
            return True
    except Exception as e:
        print(f"Error resizing {img_path}: {e}")
        return False

print("Processing images from user's downloaded folders...")
for folder_name in os.listdir(SOURCE_DIR):
    folder_path = os.path.join(SOURCE_DIR, folder_name)
    if os.path.isdir(folder_path) and folder_name != "golden-palace":
        slug = ""
        for key, val in folders.items():
            if key in folder_name.upper():
                slug = val
        if slug:
            print(f"Found folder for {slug}: {folder_name}")
            count = 0
            # Sắp xếp các file để giữ thứ tự đúng
            files = sorted(os.listdir(folder_path))
            for file in files:
                if file.lower().endswith(('.jpg', '.jpeg', '.png')):
                    if count >= 12: # Lấy tối đa 12 ảnh
                        break
                    count += 1
                    src_file = os.path.join(folder_path, file)
                    if resize_and_save(src_file, slug, count):
                        counts[slug] = count

print("Updating files...")
seed_file = "/Users/vanchiinh_/Downloads/Đặt tiệc - Golden Palace/golden-palace/prisma/seed.js"
page_file = "/Users/vanchiinh_/Downloads/Đặt tiệc - Golden Palace/golden-palace/src/app/(client)/khong-gian/[slug]/page.js"

with open(seed_file, "r") as f:
    seed_c = f.read()
for slug, c in counts.items():
    seed_c = re.sub(f"makeHdImages\\('{slug}', \\d+\\)", f"makeHdImages('{slug}', {c})", seed_c)
with open(seed_file, "w") as f:
    f.write(seed_c)

with open(page_file, "r") as f:
    page_c = f.read()
for slug, c in counts.items():
    page_c = re.sub(f"makeHdList\\('{slug}', \\d+\\)", f"makeHdList('{slug}', {c})", page_c)
with open(page_file, "w") as f:
    f.write(page_c)

print("Finished processing and updating code.")
