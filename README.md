# Fashion Z — Static eCommerce Template



## Contents
- `index.html`, `shop.html`, `shop-single.html`, `about.html`, `contact.html` — main pages  
- `assets/` — static assets (css, js, img, webfonts)

## Run locally
Option A — quick preview (no install):

1. Open `index.html` in a browser (double-click) or serve the folder with any static server.

Option B — using npm (recommended for a local dev server):

1. Install Node.js (>=14).  
2. In the project root run:

```bash
npm install
npm run dev
```

This runs the `dev` script (uses `live-server`) to serve the project at http://localhost:3000 by default.

## Notes & recommendations
- This is a pure static template — forms are not connected to a backend.  
- The project originally includes older jQuery (1.x). I upgraded references to jQuery 3.x and jquery-migrate 3.x in HTML files. Test interactive features.  
- The contact page previously used Mapbox tiles with an embedded token; it has been switched to OpenStreetMap tiles to avoid embedded secrets. If you prefer Mapbox, replace the tile URL and provide your own token via environment/config.  
- Consider optimizing `assets/img/` (compression, responsive sizes) and reducing unused webfonts for performance.

## Tasks implemented
- README added  
- `.gitignore` added  
- `package.json` added with `dev` script  
- Updated HTML to use modern jQuery + jquery-migrate and removed embedded Mapbox token (contact page)  

## Next steps (optional)
- Run a Lighthouse audit and fix accessibility/performance issues.  
- Add an image-optimization pipeline (`imagemin`, `sharp`, or CI-based optimization).

---


