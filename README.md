# Intelligent-Diagnostic-Assistant-Download

Public installer files for **IDA-AI Diagnostic Assistant** (Windows).

## How to add a new build

1. Build the `.exe` in the private app repo (locally: `npm run electron:build:prod`, or use GitHub Actions **Build Electron installer (Windows)** and download the artifact).
2. Create `installer/` here if it does not exist. Copy the NSIS file into `installer/` (keep the real filename from electron-builder).
3. Commit and push:

   ```bash
   git add installer/
   git commit -m "Add installer v0.1.0"
   git push   ```

4. In the web app, set `VITE_ELECTRON_INSTALLER_URL` to the **raw** URL:

   `https://raw.githubusercontent.com/RobertSloan22/Intelligent-Diagnostic-Assistant-Download/main/installer/<URL-encoded-filename>.exe`

   Spaces in the filename become `%20` in the URL.

If a single `.exe` is too large for a normal git push, use [Git LFS](https://git-lfs.com/) for `installer/*.exe`, or attach the file to a **Release** on this repo and use the `releases/download/...` link instead.
