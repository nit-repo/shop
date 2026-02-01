# FashionZ eCommerce

> A modern, lightweight eCommerce storefront built with vanilla JavaScript and Bootstrap 5.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.x-7952B3?logo=bootstrap&logoColor=white)](https://getbootstrap.com/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Pages](#pages)
- [Technologies](#technologies)
- [Architecture](#architecture)
- [Browser Support](#browser-support)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

FashionZ is a fully-functional eCommerce frontend that demonstrates modern web development practices without requiring a backend. It features dynamic product rendering, client-side filtering, persistent shopping cart, and a responsive design that works seamlessly across all devices.

**Live Demo**: [Add your deployment URL here]

### Why FashionZ?

- ✅ **No Backend Required** - Runs entirely in the browser
- ✅ **Production-Ready** - Optimized for performance and SEO
- ✅ **Easy to Deploy** - Works on any static hosting platform
- ✅ **Extensible** - Clean architecture ready for API integration
- ✅ **Well-Documented** - Comprehensive technical documentation included

## ✨ Features

### 🛍️ Shopping Experience
- **Product Catalog** - Browse 10+ curated fashion items
- **Advanced Filtering** - Filter by category (Fits/Accessories)
- **Smart Search** - Real-time search across product names and descriptions
- **Flexible Sorting** - Sort by name or price (ascending/descending)
- **Product Details** - Detailed view with size/color selection and quantity adjustment
- **Related Products** - Smart recommendations based on category

### 🛒 Shopping Cart
- **Persistent Cart** - LocalStorage-based cart survives browser sessions
- **Quantity Management** - Adjust quantities directly in cart modal
- **Live Updates** - Real-time cart badge and total calculations
- **Tax Calculation** - Automatic 10% tax computation

### 🎨 User Interface
- **Responsive Design** - Mobile-first approach with Bootstrap 5
- **Dynamic Components** - Asynchronous loading of header/footer/brands
- **Interactive Carousels** - Hero banner and related products sliders
- **Modal Dialogs** - Search and cart modals for better UX
- **Visual Feedback** - Button state changes and loading indicators

### 🔒 Security & Performance
- **XSS Protection** - HTML escaping for all dynamic content
- **Lazy Loading** - Images load on-demand for faster page loads
- **Event Delegation** - Efficient event handling for dynamic elements
- **Optimized Assets** - Minified CSS/JS for production

## 🚀 Quick Start

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (optional but recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/fashionz.git
   cd fashionz/shop
   ```

2. **Serve the files**

   **Option A: Using Python**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```

   **Option B: Using Node.js**
   ```bash
   npx http-server -p 8000
   ```

   **Option C: Using PHP**
   ```bash
   php -S localhost:8000
   ```

   **Option D: Using VS Code**
   - Install "Live Server" extension
   - Right-click `index.html` → "Open with Live Server"

3. **Open in browser**
   ```
   http://localhost:8000
   ```

### Deployment

Deploy to any static hosting platform:

**Netlify**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd shop
netlify deploy --prod
```

**Vercel**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd shop
vercel --prod
```

**GitHub Pages**
1. Push code to GitHub repository
2. Go to Settings → Pages
3. Select branch and `/shop` folder
4. Save and wait for deployment

## 📁 Project Structure

```
shop/
├── index.html              # Homepage with featured products
├── shop.html               # Product listing with filters
├── shop-single.html        # Product detail page
├── about.html              # About us page
├── contact.html            # Contact page with map
├── header.html             # Shared navigation component
├── footer.html             # Shared footer component
├── brands.html             # Shared brands carousel
├── architecture.md         # 📚 Complete technical documentation
├── README.md               # This file
├── assets/
│   ├── css/
│   │   ├── bootstrap.min.css      # Bootstrap 5 framework
│   │   ├── templatemo.css         # Base theme styles
│   │   ├── custom.css             # Project-specific styles
│   │   ├── slick.min.css          # Carousel styles
│   │   └── slick-theme.css
│   ├── js/
│   │   ├── analytics.js           # Google Analytics integration
│   │   ├── cart.js                # Shopping cart logic
│   │   ├── components.js          # Component loader
│   │   ├── render-products.js     # Product rendering engine
│   │   ├── templatemo.js          # UI helpers
│   │   ├── bootstrap.bundle.min.js
│   │   ├── jquery-3.6.0.min.js
│   │   └── slick.min.js
│   └── img/                       # Product and UI images
└── data/
    └── products.json              # Product catalog (10 items)
```

## 📄 Pages

### Homepage (`index.html`)
- Hero carousel with 3 promotional slides
- "Categories of the Month" section
- Featured products grid (dynamically loaded)
- Brand partners carousel

### Shop (`shop.html`)
- Product grid with 10 items
- Category sidebar (Fits/Accessories)
- Sort dropdown (Name/Price)
- Search functionality
- Responsive layout (1-3 columns)

### Product Detail (`shop-single.html`)
- Large product image
- Product information (title, price, rating, description)
- Size selector (S/M/L/XL)
- Quantity adjuster (+/- buttons)
- Add to Cart / Buy Now buttons
- Related products carousel

### About (`about.html`)
- Company story and mission
- Services showcase (3 features)
- Brand partners carousel

### Contact (`contact.html`)
- Interactive Leaflet.js map
- Contact form (name, email, message)
- Company contact information

## 🛠️ Technologies

### Core
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Flexbox/Grid
- **JavaScript (ES6+)** - Client-side logic

### Frameworks & Libraries
- **Bootstrap 5.x** - Responsive UI framework
- **jQuery 3.6.0** - DOM manipulation
- **Slick Carousel 1.8.1** - Product carousels
- **Leaflet.js 1.7.1** - Interactive maps
- **Font Awesome 5.x** - Icon library

### Data & State
- **JSON** - Product data storage
- **LocalStorage** - Cart persistence

## 📚 Architecture

For detailed technical documentation, see [architecture.md](architecture.md).

### Key Concepts

**Component-Based Structure**
```javascript
// Shared components loaded asynchronously
$('#header-placeholder').load('header.html');
$('#footer-placeholder').load('footer.html');
$('#brands-placeholder').load('brands.html');
```

**Dynamic Product Rendering**
```javascript
// Products loaded from JSON and rendered via templates
fetch('./data/products.json')
  .then(res => res.json())
  .then(products => {
    renderProductGrid(products);
    renderFeaturedProducts(products);
  });
```

**Client-Side State Management**
```javascript
// Cart persisted in LocalStorage
ShopCart.addItem(id, name, price, quantity);
ShopCart.getCart(); // Returns { items: [], total: 0 }
```

**Event-Driven Architecture**
```javascript
// Global event delegation for dynamic elements
$(document).on('click', '.btn-add-cart', function(e) {
  const id = this.dataset.itemId;
  ShopCart.addItem(id, name, price);
});
```

### Data Flow

```
User Action → Event Listener → Update State → Re-render UI → Sync LocalStorage
```

## 🌐 Browser Support

| Browser | Version |
|---------|---------|
| Chrome  | 60+     |
| Firefox | 55+     |
| Safari  | 11+     |
| Edge    | 79+     |



## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **TemplateMo** - Original template design
- **Bootstrap Team** - UI framework
- **jQuery Foundation** - DOM manipulation library
- **Slick Carousel** - Carousel component


**Made with ❤️ by the FashionZ Team**
