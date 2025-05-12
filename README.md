# portfolio-backend

This repository serves as a central content source (texts and images) for my portfolio projects across different frontend technologies.

### 📝 Notes

- All content is uploaded to Cloudinary and consumed from there to ensure updates are instantly reflected across all projects

## How the Image and JSON Upload Script Works

This script automates the process of uploading images and JSON files to Cloudinary, replacing local paths with the corresponding Cloudinary URLs.

- Images are uploaded to Cloudinary under the images/ folder with their original file names.

- JSON files are uploaded with their names prefixed by jsons/ in Cloudinary. Each time a JSON file is updated, its name is modified by appending a timestamp, ensuring the URL is unique and always points to the latest version.

- Backup: Before updating the JSON files, a backup is created in a backups/ folder, with a timestamped filename for easy versioning.

How it works:

1. Uploads images to Cloudinary and replaces local image URLs with Cloudinary URLs in the images.json file.

2. Backups are taken for each JSON file before they are updated.

3. Adds timestamped versions of the JSON files to avoid caching issues and make sure the front-end always fetches the latest version.

