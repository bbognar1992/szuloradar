# Vercel Deploy Beállítások

## 404 NOT_FOUND hiba megoldása

### 1. Root Directory beállítása

A Vercel Dashboard-ban:
1. Menj a Project Settings → General
2. **Root Directory**: Állítsd be `frontend`-re
3. Save

### 2. Environment Változók

Add hozzá a következő environment változót:
- `NEXT_PUBLIC_API_BASE_URL` = `https://your-backend-url.com`

### 3. Build Settings

A Vercel automatikusan felismeri a Next.js-t, de ellenőrizd:
- **Framework Preset**: Next.js
- **Build Command**: `npm run build` (vagy automatikus)
- **Output Directory**: `.next` (vagy automatikus)
- **Install Command**: `npm install` (vagy automatikus)

### 4. Ha még mindig 404

Ellenőrizd a build logokat a Vercel Dashboard-ban:
- Menj a Deployments fülre
- Kattints a legutóbbi deployment-re
- Nézd meg a Build Logs-ot, hogy volt-e hiba

### 5. Next.js 15 kompatibilitás

Ha a Next.js 15-ös verzióval van probléma, próbáld meg:
- Visszaállítani Next.js 14-re: `"next": "^14.2.0"`
- Vagy ellenőrizd a Next.js 15 breaking changes dokumentációját

