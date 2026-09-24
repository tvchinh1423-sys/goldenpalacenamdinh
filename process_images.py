import os
import glob
from PIL import Image
import urllib.request
import json
import shutil

# Install dependencies just in case
os.system("python3 -m pip install Pillow gdown")

DEST_DIR = "/Users/vanchiinh_/Downloads/Đặt tiệc - Golden Palace/golden-palace/public/images/hd-venues"
os.makedirs(DEST_DIR, exist_ok=True)

# Clean up destination directory
for f in glob.glob(os.path.join(DEST_DIR, "*")):
    os.remove(f)

# Mapping of already downloaded large images
EXISTING_SOURCE = "/tmp/gdrive_images_full"
folders = {
    "TẦNG 2": "tang-2",
    "TẦNG 3": "tang-3"
}

counts = {}

def resize_and_save(img_path, slug, count):
    try:
        with Image.open(img_path) as img:
            # Convert to RGB if needed (e.g., from RGBA or CMYK)
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            # Resize preserving aspect ratio
            max_size = (1920, 1080)
            img.thumbnail(max_size, Image.Resampling.LANCZOS)
            
            dest_path = os.path.join(DEST_DIR, f"{slug}-hd-{count}.jpg")
            img.save(dest_path, "JPEG", quality=80)
            return True
    except Exception as e:
        print(f"Error resizing {img_path}: {e}")
        return False

print("Processing already downloaded images (compressing)...")
for folder_name in os.listdir(EXISTING_SOURCE):
    folder_path = os.path.join(EXISTING_SOURCE, folder_name)
    if os.path.isdir(folder_path):
        slug = ""
        for key, val in folders.items():
            if key in folder_name.upper():
                slug = val
        if slug:
            count = 0
            for file in sorted(os.listdir(folder_path)):
                if file.lower().endswith(('.jpg', '.jpeg', '.png')):
                    if count >= 12: # max 12 per venue
                        break
                    count += 1
                    src_file = os.path.join(folder_path, file)
                    if resize_and_save(src_file, slug, count):
                        counts[slug] = count

print("Downloading specific files for Tang 4 and Phong VIP...")
TO_DOWNLOAD = {
    "tang-4": [
        "1PgL09LqkpqNCe0tTCmTO1MlWmJmlf8V9", "1-frm1DUa_KtquaR7wk3bRFQvJuXkRFYw", 
        "1GeRxPtLePKj8xzrPnTSuVR589yULwMGR", "1kzpUyf_UPccxedq-N_8lxwaDaNWpK_US", 
        "12vpYYBYvjUbkpaNLW6GAJ8AMVPVYN3XP", "1qzu08lZRMDRepmvOahDn92Pq0MsvvzCH", 
        "1nCp7daq1UEmmpQLazRBX0-oKQ2ecnqIr", "1ph5LwvjrsEQqoCLC-nwP-hDo5SAiX8hL"
    ],
    "phong-vip": [
        "1C2wS1LzqE_e1JQgJeu5ApniKXEhGRcdB", "1PlrlYOrhE3A23dIPl2kBMuAcEStUyzEd", 
        "1AYJW-ic1fI1_d-bjJUNyT9W3-sR_pqVn", "13F4xTak0_H4LxZTsseCpQXaMl8YP-D3o", 
        "1tbk97k6bJf85gXaFU_DyTgRgGmie5_RK", "1gCC26pMalZTcYfhU3YZHfJBYjDm4YazA", 
        "1LdUZWWQqIaauhfs5T24AIm6YTO4GbV_W", "11vcK19rpitIjN3GGGbheNP0tl8bIKBxu"
    ]
}

for slug, ids in TO_DOWNLOAD.items():
    count = 0
    for fid in ids:
        count += 1
        tmp_file = f"/tmp/{fid}.jpg"
        print(f"Downloading {slug} {count}...")
        # Use gdown to download single file
        os.system(f"python3 -m gdown --id {fid} -O {tmp_file}")
        if os.path.exists(tmp_file):
            resize_and_save(tmp_file, slug, count)
            os.remove(tmp_file)
            counts[slug] = count
        else:
            print(f"Failed to download {fid}")

print("Updating files...")
seed_file = "/Users/vanchiinh_/Downloads/Đặt tiệc - Golden Palace/golden-palace/prisma/seed.js"
page_file = "/Users/vanchiinh_/Downloads/Đặt tiệc - Golden Palace/golden-palace/src/app/(client)/khong-gian/[slug]/page.js"

import re

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
