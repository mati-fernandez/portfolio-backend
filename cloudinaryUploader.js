import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const IMAGES_DIR = './images';
const JSON_FILES = ['./images.json', './en.json', './es.json', './pt.json'];
const BACKUP_DIR = './backups';

const uploadedUrls = {};

const uploadImage = async (filePath) => {
  const fileName = path.basename(filePath);
  const publicId = `images/${fileName.split('.')[0]}`;

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: publicId,
      resource_type: 'image',
    });
    console.log(`Uploaded: ${fileName} => ${result.secure_url}`);
    uploadedUrls[fileName] = result.secure_url;
  } catch (error) {
    console.error(`Error uploading ${fileName}:`, error.message);
  }
};

const backupJsonFiles = () => {
  if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR);
  const now = new Date();
  const timestamp = now
    .toLocaleString('sv')
    .replace(' ', '_')
    .replace(/:/g, '-');
  JSON_FILES.forEach((file) => {
    const backupFile = path.join(
      BACKUP_DIR,
      `${path.basename(file)}.${timestamp}.bak`
    );
    fs.copyFileSync(file, backupFile);
    console.log(`Backup created: ${backupFile}`);
  });
};

const updateJsonFiles = () => {
  JSON_FILES.forEach((file) => {
    try {
      let content = fs.readFileSync(file, 'utf8');
      Object.entries(uploadedUrls).forEach(([name, url]) => {
        const regex = new RegExp(`"src":\\s*"([^"]*images/${name}[^"]*)"`, 'g');
        content = content.replace(regex, `"src": "${url}"`);
      });
      if (file.endsWith('.json')) {
        const timestamp = new Date().toISOString();
        const updatedFile = file.replace('.json', `-${timestamp}.json`);
        fs.writeFileSync(updatedFile, content);
        console.log(`Updated ${updatedFile}`);
      } else {
        fs.writeFileSync(file, content);
        console.log(`Updated ${file}`);
      }
    } catch (error) {
      console.error(`Error updating ${file}:`, error.message);
    }
  });
};

const uploadJson = async (filePath) => {
  const fileName = path.basename(filePath);
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: `jsons/${fileName}`,
      resource_type: 'raw',
    });
    console.log(`Uploaded JSON: ${fileName} => ${result.secure_url}`);
  } catch (error) {
    console.error(`Error uploading ${fileName}:`, error.message);
  }
};

(async () => {
  const files = fs.readdirSync(IMAGES_DIR);
  const imageFiles = files.filter((f) => /\.(png|jpe?g|webp)$/i.test(f));

  for (const file of imageFiles) {
    await uploadImage(path.join(IMAGES_DIR, file));
  }

  backupJsonFiles();
  updateJsonFiles();

  for (const jsonFile of JSON_FILES) {
    await uploadJson(jsonFile);
  }
})();
