import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync, existsSync } from 'fs'

// ─── Auto-generate version info ───────────────────────────
// ใช้แทรกเข้า bundle ตอน build เพื่อแสดงใน Footer
const pkg = JSON.parse(readFileSync('./package.json', 'utf8'))
const buildTime = new Date().toISOString()
let gitHash = 'dev'
try {
  // อ่าน git HEAD โดยไม่ต้องเรียก git command (ทำงานบน Vercel/Cloudflare/Firebase)
  if (existsSync('.git/HEAD')) {
    const head = readFileSync('.git/HEAD', 'utf8').trim()
    if (head.startsWith('ref: ')) {
      const refPath = '.git/' + head.slice(5)
      if (existsSync(refPath)) {
        gitHash = readFileSync(refPath, 'utf8').trim().slice(0, 7)
      }
    } else {
      gitHash = head.slice(0, 7)
    }
  }
} catch { /* ignore — fall back to 'dev' */ }

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version || '0.0.0'),
    __BUILD_TIME__: JSON.stringify(buildTime),
    __GIT_HASH__: JSON.stringify(gitHash)
  },
  build: {
    // Bump warning threshold to 1500 KB. The app is a single-page dashboard
    // with all routes (Explorer, Pitching Evaluator, Reports, Admin) in one
    // App.jsx (~5000 lines). Total bundle is ~600-900 KB minified · ~180-260 KB
    // gzipped → loads in <1s on broadband. This is fine for a classroom app
    // and avoids the noisy build warning. To split further later, lazy-load
    // report panels via dynamic import().
    chunkSizeWarningLimit: 1500,
    rolldownOptions: {
      output: {
        // Manual chunk-splitting (Vite 8 + Rolldown — function form).
        // Object form is rejected: "Expected Function but received Object".
        //  • firebase   — Firestore + Auth + Storage SDK
        //  • motion     — framer-motion
        //  • icons      — lucide-react
        //  • react      — react + react-dom runtime
        manualChunks: (id) => {
          if (id.includes('node_modules/firebase')) return 'firebase';
          if (id.includes('node_modules/framer-motion')) return 'motion';
          if (id.includes('node_modules/lucide-react')) return 'icons';
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) return 'react';
        }
      }
    }
  }
})
