# Intelligent-Diagnostic-Assistant-Download
<img width="1918" height="1125" alt="image" src="https://github.com/user-attachments/assets/4674c2ac-490d-4fd4-9868-f539ca84ce0a" />
<img width="1912" height="1053" alt="image" src="https://github.com/user-attachments/assets/8e7eeb1c-b5a3-4405-b04e-f923bfd948b5" />
<img width="1897" height="1131" alt="image" src="https://github.com/user-attachments/assets/4589d11a-a447-407d-8797-8ef40e9559f1" />

Public **Windows installer** for IDA-AI Diagnostic Assistant.

## File size (> 100 MB)

GitHub blocks regular Git blobs over **100 MB**. This repo uses **Git LFS** for `*.exe` so `git push` works.

**Important:** For `VITE_ELECTRON_INSTALLER_URL` in the web app, do **not** rely on `raw.githubusercontent.com` for the installer—LFS files are not served there as a direct binary download.

Use a **GitHub Release** asset URL instead (see below).

## Recommended: GitHub Release (download link for users)

1. On GitHub: **Releases → Draft a new release**.
2. **Tag:** e.g. `v0.1.0` (match your app version).
3. **Attach** `installer/IDA-AI Diagnostic Assistant Setup 0.1.0.exe` (or upload from your PC).
4. Publish the release.

Set **`VITE_ELECTRON_INSTALLER_URL`** to the asset link (use **Copy link** on the file), e.g.:

`https://github.com/RobertSloan22/Intelligent-Diagnostic-Assistant-Download/releases/download/v0.1.0/IDA-AI%20Diagnostic%20Assistant%20Setup%200.1.0.exe`

## Optional: keep the .exe in git (LFS)

1. Build: `npm run electron:build:prod` in the private app repo (or CI artifact).
2. Copy the `.exe` into `installer/` here.
3. `git add installer/ .gitattributes` → `git commit` → `git push`  
   (requires [Git LFS](https://git-lfs.com/) installed: `git lfs install` once per machine.)

This is for **history / backup**; end users should still use the **Release** URL above for downloads.
