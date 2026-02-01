# FashionZ eCommerce - Complete Technical Architecture

**Version:** 1.0  
**Last Updated:** February 2026  
**Project Type:** Static-Dynamic Hybrid SPA (Single Page Application)

---

## Table of Contents
1. [System Architecture Overview](#1-system-architecture-overview)
2. [Technology Stack](#2-technology-stack)
3. [Project Structure](#3-project-structure)
4. [Data Architecture](#4-data-architecture)
5. [Page-Level Deep Dive](#5-page-level-deep-dive)
6. [Core JavaScript Modules](#6-core-javascript-modules)
7. [Component System](#7-component-system)
8. [State Management](#8-state-management)
9. [Event Flow & User Interactions](#9-event-flow--user-interactions)
10. [Security Considerations](#10-security-considerations)
11. [Performance Optimization](#11-performance-optimization)
12. [Future Enhancements](#12-future-enhancements)

---

## 1. System Architecture Overview

### 1.1 Architectural Pattern
FashionZ implements a **Client-Side Rendered (CSR) Architecture** with the following characteristics:

- **Static HTML Shell**: Base HTML files serve as containers
- **Dynamic Content Injection**: JavaScript fetches and renders data
- **Component-Based Structure**: Reusable UI components loaded asynchronously
- **Client-Side Routing**: URL parameters drive content without page reloads
- **LocalStorage Persistence**: Cart state survives browser sessions

### 1.2 Request-Response Flow

```
User Request → Static HTML (Server) → Browser Loads JS → Fetch products.json
    ↓
Component Injection (header/footer/brands) → Render Dynamic Content
    ↓
User Interactions → Update filterState/Cart → Re-render UI
    ↓
LocalStorage Sync ← Cart Changes
```

### 1.3 Key Design Decisions

| Decision | Rationale | Trade-offs |
|----------|-----------|------------|
| Client-Side Rendering | No backend required, easy deployment | SEO limitations, initial load time |
| LocalStorage for Cart | Persistence without server | Limited to 5-10MB, client-side only |
| jQuery + Vanilla JS | Rapid development, broad compatibility | Larger bundle size than modern frameworks |
| JSON Data Source | Simple, version-controllable | Not suitable for large catalogs (>500 items) |

---

## 2. Technology Stack

### 2.1 Frontend Core
- **HTML5**: Semantic markup with ARIA attributes
- **CSS3**: Bootstrap 5.x + Custom styles
- **JavaScript**: ES6+ (transpiled for compatibility)

### 2.2 Libraries & Dependencies

| Library | Version | Purpose | CDN/Local |
|---------|---------|---------|-----------|
| jQuery | 3.6.0 | DOM manipulation, AJAX | Local |
| Bootstrap | 5.x | UI framework, responsive grid | Local |
| Slick Carousel | 1.8.1 | Product carousels | Local |
| Leaflet.js | 1.7.1 | Interactive maps (Contact page) | CDN |
| Font Awesome | 5.x | Icon library | CDN |

### 2.3 Build & Deployment
- **No Build Step**: Direct file serving (can be hosted on any static server)
- **Deployment Targets**: Netlify, Vercel, GitHub Pages, Apache/Nginx

---

## 3. Project Structure

```
shop/
├── index.html              # Homepage
├── shop.html               # Product listing page
├── shop-single.html        # Product detail page
├── about.html              # About us page
├── contact.html            # Contact page with map
├── header.html             # Shared navigation component
├── footer.html             # Shared footer component
├── brands.html             # Shared brands carousel
├── assets/
│   ├── css/
│   │   ├── bootstrap.min.css
│   │   ├── templatemo.css    # Base theme styles
│   │   ├── custom.css        # Project-specific overrides
│   │   ├── slick.min.css
│   │   └── slick-theme.css
│   ├── js/
│   │   ├── analytics.js      # Google Analytics integration
│   │   ├── cart.js           # Shopping cart logic
│   │   ├── components.js     # Component loader
│   │   ├── render-products.js # Product rendering engine
│   │   ├── templatemo.js     # UI interaction helpers
│   │   ├── bootstrap.bundle.min.js
│   │   ├── jquery-*.min.js
│   │   └── slick.min.js
│   └── img/                  # Static images
└── data/
    └── products.json         # Product catalog
```

---

## 4. Data Architecture

### 4.1 Product Schema (`products.json`)

```json
{
  "id": 1,                    // Unique identifier (integer)
  "title": "Product Name",    // Display name (string)
  "price": 25.00,             // Price in USD (float)
  "category": "Fits",         // Category: "Fits" | "Accessories"
  "image": "path/to/img.jpg", // Relative path to product image
  "description": "...",       // Full product description (string)
  "rating": 4.5,              // Star rating 0-5 (float)
  "reviews": 36,              // Number of reviews (integer)
  "colors": ["Red", "Blue"],  // Available colors (array)
  "sizes": ["S", "M", "L"],   // Available sizes (array)
  "featured": true            // Show on homepage (boolean)
}
```

### 4.2 Cart Schema (LocalStorage: `shop_cart`)

```json
{
  "items": [
    {
      "id": 1,              // Product ID
      "name": "Product",    // Product name
      "price": 25.00,       // Unit price
      "qty": 2              // Quantity
    }
  ],
  "total": 50.00           // Calculated total
}
```

### 4.3 Filter State (In-Memory)

```javascript
filterState = {
  category: 'all',        // 'all' | 'Fits' | 'Accessories'
  search: '',             // Search query string
  sort: 'featured'        // 'featured' | 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc'
}
```

---

## 5. Page-Level Deep Dive

### 5.1 Homepage (`index.html`)

#### Purpose
Primary landing page showcasing featured products and brand identity.

#### DOM Structure
```html
<div id="header-placeholder"></div>
<div id="template-mo-zay-hero-carousel">...</div>  <!-- Hero Carousel -->
<section><!-- Categories of The Month --></section>
<section>
  <div id="featured-products-placeholder"></div>   <!-- Dynamic Products -->
</section>
<div id="brands-placeholder"></div>
<div id="footer-placeholder"></div>
```

#### Execution Timeline

**T+0ms**: Page loads, browser parses HTML  
**T+50ms**: `components.js` executes
- Loads `header.html` → Triggers `ShopCart.updateUI()`
- Loads `footer.html`
- Loads `brands.html`

**T+100ms**: `render-products.js` executes
- Fetches `products.json` via `fetch()` API
- Parses JSON response

**T+200ms**: Data processing
- `renderFeaturedProducts()` filters for `featured: true`
- Generates HTML using `createFeaturedProductCard()`
- Injects into `#featured-products-placeholder`
- Calls `updateCartButtons()` for each product

**T+300ms**: Slick carousel initialization
- Hero carousel auto-plays
- Brands carousel initializes

#### Key Functions Used
- `renderFeaturedProducts(products)` - Filters and displays featured items
- `createFeaturedProductCard(p)` - Generates card HTML
- `updateCartButtons(id)` - Syncs Add/Remove button visibility

#### User Interactions
1. **Click Category**: Navigates to `shop.html?category=X`
2. **Click Featured Product**: Navigates to `shop-single.html?id=X`
3. **Add to Cart**: Triggers global `.btn-add-cart` listener

---

### 5.2 Shop Listing (`shop.html`)

#### Purpose
Product discovery interface with filtering, sorting, and search capabilities.

#### DOM Structure
```html
<div id="header-placeholder"></div>
<section class="container">
  <div class="row">
    <div class="col-lg-3">
      <!-- Sidebar: Categories -->
      <ul class="list-unstyled fw-bold">
        <li><a class="filter-link" data-type="category" data-value="Fits">...</a></li>
        <li><a class="filter-link" data-type="category" data-value="Accessories">...</a></li>
      </ul>
    </div>
    <div class="col-lg-9">
      <!-- Sort Dropdown -->
      <select id="sort-select">...</select>
      <!-- Product Grid -->
      <div id="product-grid" class="row"></div>
    </div>
  </div>
</section>
<div id="brands-placeholder"></div>
<div id="footer-placeholder"></div>
```

#### Execution Timeline

**T+0ms**: Page loads  
**T+50ms**: `render-products.js` initializes
- Parses URL parameters (`?category=Fits`, `?q=search`)
- Sets initial `filterState`

**T+100ms**: Data fetch completes
- `applyFilters()` executes
- Filters products by category/search
- Sorts based on `filterState.sort`

**T+150ms**: Grid rendering
- `renderProductGrid(filteredProducts)` generates HTML
- Each product card injected into `#product-grid`
- `updateCartButtons()` called for each product

#### Filtering Logic Flow

```javascript
User clicks category link
  ↓
Event listener captures data-type="category", data-value="Fits"
  ↓
filterState.category = "Fits"
  ↓
applyFilters() executes:
  1. Filter by category: products.filter(p => p.category === "Fits")
  2. Filter by search: filtered.filter(p => p.title.includes(query))
  3. Sort: filtered.sort(compareFn)
  ↓
renderProductGrid(filtered)
  ↓
DOM updates with new product cards
```

#### Sorting Algorithm

```javascript
switch (filterState.sort) {
  case 'name-asc':
    filtered.sort((a, b) => a.title.localeCompare(b.title));
    break;
  case 'price-asc':
    filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    break;
  // ... other cases
}
```

#### Key Functions Used
- `applyFilters()` - Master filter/sort controller
- `renderProductGrid(products)` - Renders product cards
- `createProductCard(p)` - Generates individual card HTML
- `resetFilters()` - Clears all filters

#### User Interactions
1. **Click Category**: Updates `filterState.category` → `applyFilters()`
2. **Change Sort**: Updates `filterState.sort` → `applyFilters()`
3. **Search**: Updates `filterState.search` → `applyFilters()`
4. **Click Product**: Navigates to `shop-single.html?id=X`

---

### 5.3 Product Detail (`shop-single.html`)

#### Purpose
Detailed product view with variant selection and cart actions.

#### DOM Structure
```html
<div id="header-placeholder"></div>
<section class="bg-light">
  <div class="container">
    <div class="row">
      <div class="col-lg-5">
        <img id="product-detail" src="" alt="">
      </div>
      <div class="col-lg-7">
        <h1 id="product-title">Loading...</h1>
        <p id="product-price"></p>
        <p id="product-rating-container"></p>
        <p id="product-description"></p>
        <p id="product-colors-text"></p>
        <p id="product-category-text"></p>
        <ul id="product-size-container"><!-- Dynamic sizes --></ul>
        <div>
          <span id="btn-minus">-</span>
          <span id="var-value">1</span>
          <span id="btn-plus">+</span>
        </div>
        <button id="btn-buy-now">Buy</button>
        <button id="btn-add-cart-detail">Add To Cart</button>
        <button id="btn-remove-cart-detail" style="display:none;">Remove</button>
      </div>
    </div>
  </div>
</section>
<section>
  <h4>Related Products</h4>
  <div id="carousel-related-product">Loading...</div>
</section>
<div id="footer-placeholder"></div>
```

#### Execution Timeline

**T+0ms**: Page loads  
**T+50ms**: `render-products.js` executes
- Extracts `id` from `window.location.search`
- Example: `?id=5` → `id = 5`

**T+100ms**: Product lookup
- `products.find(x => x.id === 5)`
- If not found: Display error message

**T+150ms**: Data injection
- `$('#product-title').text(p.title)`
- `$('#product-price').text('$' + p.price)`
- `$('#product-description').text(p.description)`
- `$('#product-detail').attr('src', p.image)`

**T+200ms**: Dynamic UI setup
- Generate size buttons from `p.sizes` array
- Attach click handlers to `.btn-size`
- Initialize quantity at `qty = 1`
- Attach `#btn-minus` and `#btn-plus` handlers

**T+250ms**: Related products
- `renderRelatedProducts(products, currentId)`
- Filters products with same category
- Generates carousel HTML
- Initializes Slick carousel

**T+300ms**: Cart button sync
- `updateCartButtons(p.id)` checks if product in cart
- Shows/hides Add/Remove buttons accordingly

#### Quantity Management Logic

```javascript
let qty = 1;  // Local state variable

$('#btn-minus').on('click', () => {
  if (qty > 1) {
    qty--;
    $('#var-value').text(qty);
  }
});

$('#btn-plus').on('click', () => {
  if (qty < 10) {  // Max quantity limit
    qty++;
    $('#var-value').text(qty);
  }
});
```

#### Size Selection Logic

```javascript
// Generate size buttons
sizeNames.forEach((s, idx) => {
  const activeClass = idx === 0 ? 'btn-success' : 'btn-secondary';
  html += `<span class="btn ${activeClass} btn-size" data-size="${s}">${s}</span>`;
});

// Toggle active state
$('#product-size-container').on('click', '.btn-size', function() {
  $('.btn-size').removeClass('btn-success').addClass('btn-secondary');
  $(this).removeClass('btn-secondary').addClass('btn-success');
});
```

#### Add to Cart Flow

```javascript
$('#btn-add-cart-detail').on('click', function() {
  // Uses local qty variable
  ShopCart.addItem(p.id, p.title, p.price, qty);
  updateCartButtons(p.id);  // Toggle button visibility
});
```

#### Key Functions Used
- `renderSingleProduct(products)` - Main orchestrator
- `renderRelatedProducts(products, currentId)` - Related items carousel
- `createStarRating(rating)` - Generates star icons
- `updateCartButtons(id)` - Syncs button states

#### User Interactions
1. **Adjust Quantity**: Click +/- → Updates local `qty` variable
2. **Select Size**: Click size button → Toggles active class
3. **Add to Cart**: Adds product with selected quantity
4. **Buy Now**: Adds to cart + Opens cart modal
5. **Click Related Product**: Navigates to new product detail page

---

### 5.4 About Page (`about.html`)

#### Purpose
Brand storytelling and company information.

#### DOM Structure
```html
<div id="header-placeholder"></div>
<section><!-- Hero section with text + image --></section>
<section><!-- Services grid (3 columns) --></section>
<div id="brands-placeholder"></div>
<div id="footer-placeholder"></div>
```

#### Execution Timeline
**T+0ms**: Page loads  
**T+50ms**: `components.js` loads header, footer, brands  
**T+100ms**: Page fully interactive

#### Key Features
- Static content (no dynamic rendering)
- Services showcase with icons
- Shared brands carousel

---

### 5.5 Contact Page (`contact.html`)

#### Purpose
Customer communication and location display.

#### DOM Structure
```html
<div id="header-placeholder"></div>
<section>
  <div id="mapid" style="height: 400px;"></div>  <!-- Leaflet Map -->
  <form>
    <input name="name" required>
    <input name="email" type="email" required>
    <textarea name="message" required></textarea>
    <button type="submit">Send</button>
  </form>
</section>
<div id="footer-placeholder"></div>
```

#### Execution Timeline
**T+0ms**: Page loads  
**T+50ms**: Components load  
**T+100ms**: Leaflet.js initializes map
```javascript
var map = L.map('mapid').setView([51.505, -0.09], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
L.marker([51.5, -0.09]).addTo(map);
```

#### Form Handling
Currently **client-side only** (no backend submission).

**Improvement Needed**: Integrate with:
- Formspree
- Netlify Forms
- Custom API endpoint

---

## 6. Core JavaScript Modules

### 6.1 Shopping Cart (`cart.js`)

#### Module Pattern
```javascript
var ShopCart = {
  storageKey: 'shop_cart',
  // ... methods
};
```

#### Function Reference

##### `init()`
**Purpose**: Initialize cart on page load  
**Parameters**: None  
**Returns**: void  
**Logic**:
```javascript
init: function() {
  if (!this.getCart()) {
    localStorage.setItem(this.storageKey, JSON.stringify({ items: [], total: 0 }));
  }
  this.updateUI();
}
```

##### `getCart()`
**Purpose**: Retrieve cart from localStorage  
**Parameters**: None  
**Returns**: `{items: [], total: number} | null`  
**Logic**:
```javascript
getCart: function() {
  var cart = localStorage.getItem(this.storageKey);
  return cart ? JSON.parse(cart) : null;
}
```

##### `addItem(itemId, itemName, price, qty)`
**Purpose**: Add product to cart  
**Parameters**:
- `itemId` (number): Product ID
- `itemName` (string): Product name
- `price` (number): Unit price
- `qty` (number, optional): Quantity to add (default: 1)

**Returns**: void  
**Logic**:
```javascript
addItem: function(itemId, itemName, price, qty) {
  var cart = this.getCart() || { items: [], total: 0 };
  var existingItem = cart.items.find(function(i) { return i.id === itemId; });
  var addQty = parseInt(qty) || 1;

  if (existingItem) {
    existingItem.qty += addQty;  // Increment existing
  } else {
    cart.items.push({            // Add new item
      id: itemId,
      name: itemName,
      price: parseFloat(price) || 0,
      qty: addQty
    });
  }

  this.saveCart(cart);
  this.updateUI();
}
```

##### `removeItem(itemId)`
**Purpose**: Remove product from cart  
**Parameters**: `itemId` (number)  
**Returns**: void  
**Side Effects**: Dispatches `cart-item-removed` custom event

##### `updateQty(itemId, qty)`
**Purpose**: Update quantity of existing item  
**Parameters**:
- `itemId` (number)
- `qty` (number)

**Logic**: If `qty <= 0`, calls `removeItem()`

##### `getTotal()`
**Purpose**: Calculate cart total  
**Returns**: number  
**Logic**:
```javascript
getTotal: function() {
  var cart = this.getCart();
  if (!cart || !cart.items.length) return 0;
  
  return cart.items.reduce(function(sum, item) {
    return sum + (item.price * item.qty);
  }, 0);
}
```

##### `renderCartModal()`
**Purpose**: Generate cart modal HTML  
**Returns**: void  
**Logic**:
1. Check if cart is empty → Display "empty cart" message
2. Generate table with rows for each item
3. Attach event listeners for quantity changes
4. Calculate and display subtotal, tax (10%), grand total
5. Enable/disable checkout button

**HTML Structure Generated**:
```html
<table class="table table-sm">
  <thead>
    <tr><th>Product</th><th>Price</th><th>Qty</th><th>Total</th><th></th></tr>
  </thead>
  <tbody>
    <tr data-item-id="1">
      <td><strong>Product Name</strong></td>
      <td>$25.00</td>
      <td><input type="number" class="cart-qty" value="2" data-id="1"></td>
      <td>$50.00</td>
      <td><button class="remove-item" data-id="1">Remove</button></td>
    </tr>
  </tbody>
</table>
```

---

### 6.2 Product Rendering Engine (`render-products.js`)

#### Module Structure
- **Utilities**: Helper functions
- **Templates**: HTML generators
- **State**: Global filter state
- **Renderers**: Main rendering functions
- **Event Handlers**: User interaction listeners

#### Utility Functions

##### `escapeHtml(unsafe)`
**Purpose**: Prevent XSS attacks  
**Parameters**: `unsafe` (string)  
**Returns**: string (HTML-safe)  
**Logic**:
```javascript
const escapeHtml = (unsafe) => {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};
```

**Example**:
```javascript
escapeHtml('<script>alert("XSS")</script>')
// Returns: "&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;"
```

##### `createStarRating(rating)`
**Purpose**: Generate star rating HTML  
**Parameters**: `rating` (number, 0-5)  
**Returns**: string (HTML)  
**Logic**:
```javascript
const createStarRating = (rating) => {
  let stars = '';
  for (let i = 0; i < 5; i++) {
    const colorClass = i < rating ? 'text-warning' : 'text-muted';
    stars += `<i class="${colorClass} fa fa-star"></i>`;
  }
  return stars;
};
```

**Example**:
```javascript
createStarRating(3.5)
// Returns: 3 yellow stars + 2 gray stars
```

##### `isProductInCart(productId)`
**Purpose**: Check cart status  
**Parameters**: `productId` (number)  
**Returns**: boolean  
**Logic**:
```javascript
const isProductInCart = (productId) => {
  if (typeof ShopCart === 'undefined') return false;
  const cart = ShopCart.getCart();
  return cart && cart.items.some(item => item.id === productId);
};
```

##### `updateCartButtons(productId)`
**Purpose**: Sync button visibility with cart state  
**Parameters**: `productId` (number)  
**Returns**: void  
**Logic**:
```javascript
const updateCartButtons = (productId) => {
  const inCart = isProductInCart(productId);
  
  // Hide "Add to Cart" if in cart
  document.querySelectorAll(`.btn-add-cart[data-item-id="${productId}"]`)
    .forEach(btn => {
      btn.style.display = inCart ? 'none' : 'inline-block';
    });
  
  // Show "Remove from Cart" if in cart
  document.querySelectorAll(`.btn-remove-cart[data-item-id="${productId}"]`)
    .forEach(btn => {
      btn.style.display = inCart ? 'inline-block' : 'none';
    });
};
```

#### Template Functions

##### `createProductCard(p)`
**Purpose**: Generate product card HTML for shop grid  
**Parameters**: `p` (Product object)  
**Returns**: string (HTML)  
**Template Structure**:
```html
<div class="col-md-4" data-item-id="${id}">
  <div class="card mb-4 product-wap rounded-0 h-100">
    <div class="card rounded-0">
      <a href="shop-single.html?id=${id}">
        <img class="card-img rounded-0 img-fluid" src="${image}" alt="${title}">
      </a>
      <div class="card-img-overlay">
        <!-- Overlay buttons (heart, eye, cart) -->
      </div>
    </div>
    <div class="card-body">
      <a href="shop-single.html?id=${id}" class="h3">${title}</a>
      <ul>
        <li>${sizes}</li>
        <li>${colorDots}</li>
      </ul>
      <ul>${starRating}</ul>
      <p>$${price}</p>
      <button class="btn-add-cart" data-item-id="${id}">Add to Cart</button>
      <button class="btn-remove-cart" data-item-id="${id}" style="display:none;">Remove</button>
    </div>
  </div>
</div>
```

##### `createFeaturedProductCard(p)`
**Purpose**: Generate featured product card for homepage  
**Differences from standard card**:
- Includes description snippet
- Different layout (horizontal on desktop)
- Shows review count

#### State Management

##### Global State Object
```javascript
let allProducts = [];  // Master product list
const filterState = {
  category: 'all',
  search: '',
  sort: 'featured'
};
```

##### `applyFilters()`
**Purpose**: Master filter/sort controller  
**Parameters**: None  
**Returns**: void  
**Algorithm**:
```javascript
const applyFilters = () => {
  let filtered = [...allProducts];  // Clone array
  
  // Step 1: Category filter
  if (filterState.category !== 'all') {
    filtered = filtered.filter(p => p.category === filterState.category);
  }
  
  // Step 2: Search filter
  if (filterState.search) {
    const q = filterState.search.toLowerCase();
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(q) ||
      (p.category && p.category.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  }
  
  // Step 3: Sort
  switch (filterState.sort) {
    case 'name-asc':
      filtered.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'name-desc':
      filtered.sort((a, b) => b.title.localeCompare(a.title));
      break;
    case 'price-asc':
      filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      break;
    case 'price-desc':
      filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      break;
    default:
      // Keep original order (featured first)
      break;
  }
  
  renderProductGrid(filtered);
};
```

**Performance**: O(n) for filtering, O(n log n) for sorting

#### Main Rendering Functions

##### `renderProductGrid(products)`
**Purpose**: Render shop page product grid  
**Parameters**: `products` (Array)  
**Returns**: void  
**Logic**:
```javascript
const renderProductGrid = (products) => {
  const $grid = $('#product-grid');
  if (!$grid.length) return;  // Guard clause
  
  if (!products || !products.length) {
    $grid.html(`
      <div class="col-12 text-center py-5">
        <h3>No products found matching your criteria.</h3>
        <button class="btn btn-success mt-3" onclick="resetFilters()">Clear Filters</button>
      </div>
    `);
    return;
  }
  
  const html = products.map(p => createProductCard(p)).join('');
  $grid.html(html);
  
  // Sync cart button states
  products.forEach(p => {
    updateCartButtons(p.id);
  });
};
```

##### `renderSingleProduct(products)`
**Purpose**: Render product detail page  
**Parameters**: `products` (Array)  
**Returns**: void  
**Detailed Logic**:

1. **Extract Product ID**:
```javascript
const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get('id'), 10);
```

2. **Validate & Find Product**:
```javascript
if (!id) {
  $('.container.pb-5').html('<div class="alert alert-warning">No product ID provided.</div>');
  return;
}

const p = products.find(x => x.id === id);
if (!p) {
  $('.container.pb-5').html('<div class="alert alert-danger">Product not found.</div>');
  return;
}
```

3. **Inject Basic Info**:
```javascript
$('#product-title').text(p.title);
$('#product-price').text('$' + p.price);
$('#product-description').text(p.description || '');
$('#product-detail').attr('src', p.image).attr('alt', p.title);
$('#product-category-text').text(p.category || 'Fits');
$('#product-colors-text').text(p.colors ? p.colors.join(' / ') : 'Standard');
```

4. **Generate Star Rating**:
```javascript
const stars = createStarRating(p.rating);
$('#product-rating-container').html(
  `${stars} <span class="list-inline-item text-dark">Rating ${p.rating.toFixed(1)} | ${p.reviews || 0} Comments</span>`
);
```

5. **Generate Size Buttons**:
```javascript
const sizeNames = p.sizes || ['S', 'M', 'L', 'XL'];
let sizeHtml = '<li class="list-inline-item">Size :</li>';
sizeNames.forEach((s, idx) => {
  const activeClass = idx === 0 ? 'btn-success' : 'btn-secondary';
  sizeHtml += `<li class="list-inline-item"><span class="btn ${activeClass} btn-size" data-size="${s}">${s}</span></li>`;
});
$('#product-size-container').html(sizeHtml);
```

6. **Setup Quantity Controls**:
```javascript
let qty = 1;
const $qtyVal = $('#var-value');

$('#btn-minus').off('click').on('click', () => {
  if (qty > 1) {
    qty--;
    $qtyVal.text(qty);
  }
});

$('#btn-plus').off('click').on('click', () => {
  if (qty < 10) {
    qty++;
    $qtyVal.text(qty);
  }
});
```

7. **Setup Size Toggle**:
```javascript
$('#product-size-container').on('click', '.btn-size', function() {
  $('.btn-size').removeClass('btn-success').addClass('btn-secondary');
  $(this).removeClass('btn-secondary').addClass('btn-success');
});
```

8. **Setup Action Buttons**:
```javascript
const $addBtn = $('#btn-add-cart-detail');
const $removeBtn = $('#btn-remove-cart-detail');
const $buyBtn = $('#btn-buy-now');

// Set data attributes
[$addBtn, $removeBtn, $buyBtn].forEach($btn => {
  $btn.attr('data-item-id', p.id)
      .attr('data-item-name', p.title)
      .attr('data-price', p.price);
});

// Buy Now = Add + Show Modal
$buyBtn.off('click').on('click', function() {
  if (typeof ShopCart !== 'undefined') {
    ShopCart.addItem(p.id, p.title, p.price, qty);
    $('#cartModal').modal('show');
  }
});

// Add to Cart
$addBtn.off('click').on('click', function() {
  if (typeof ShopCart !== 'undefined') {
    ShopCart.addItem(p.id, p.title, p.price, qty);
    updateCartButtons(p.id);
  }
});
```

9. **Render Related Products**:
```javascript
renderRelatedProducts(products, id);
```

##### `renderRelatedProducts(products, currentId)`
**Purpose**: Render related products carousel  
**Parameters**:
- `products` (Array): All products
- `currentId` (number): Current product ID

**Returns**: void  
**Logic**:
```javascript
const renderRelatedProducts = (products, currentId) => {
  const $container = $('#carousel-related-product');
  if (!$container.length) return;
  
  const currentProduct = products.find(p => p.id === currentId);
  const related = products
    .filter(p => p.id !== currentId && p.category === currentProduct?.category)
    .slice(0, 8);  // Limit to 8 items
  
  if (!related.length) {
    $container.html('<div class="col-12 text-center text-muted">No related products found.</div>');
    return;
  }
  
  // Generate HTML for each related product
  const html = related.map(p => {
    const title = escapeHtml(p.title);
    return `
      <div class="p-2 pb-3">
        <div class="product-wap card rounded-0 h-100" data-item-id="${p.id}">
          <div class="card rounded-0">
            <a href="shop-single.html?id=${p.id}">
              <img class="card-img rounded-0 img-fluid" src="${p.image}" alt="${title}">
            </a>
          </div>
          <div class="card-body text-center">
            <a href="shop-single.html?id=${p.id}" class="h3 text-decoration-none">${title}</a>
            <ul class="list-unstyled d-flex justify-content-center mb-1">
              <li>${createStarRating(p.rating)}</li>
            </ul>
            <p class="text-center mb-0">$${p.price}</p>
            <div class="text-center mt-3">
              <button class="btn btn-success btn-add-cart w-100" data-item-id="${p.id}" data-item-name="${title}" data-price="${p.price}">Add to Cart</button>
              <button class="btn btn-danger btn-remove-cart w-100" data-item-id="${p.id}" data-item-name="${title}" style="display:none;">Remove from Cart</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  $container.html(html);
  
  // Initialize Slick Carousel
  if ($.fn.slick) {
    if ($container.hasClass('slick-initialized')) {
      $container.slick('unslick');  // Destroy existing instance
    }
    $container.slick({
      infinite: true,
      arrows: false,
      slidesToShow: 4,
      slidesToScroll: 3,
      dots: true,
      responsive: [
        { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 3 } },
        { breakpoint: 600, settings: { slidesToShow: 2, slidesToScroll: 3 } }
      ]
    });
  }
  
  // Sync cart button states
  related.forEach(p => {
    updateCartButtons(p.id);
  });
};
```

---

### 6.3 Component Loader (`components.js`)

#### Purpose
Asynchronously load shared HTML components.

#### Implementation
```javascript
$(function() {
  // Load Header
  const $headerPlaceholder = $('#header-placeholder');
  if ($headerPlaceholder.length) {
    $headerPlaceholder.load('header.html', function() {
      // Callback after header loads
      if (typeof ShopCart !== 'undefined') {
        ShopCart.updateUI();  // Update cart badge
      }
    });
  }
  
  // Load Footer
  const $footerPlaceholder = $('#footer-placeholder');
  if ($footerPlaceholder.length) {
    $footerPlaceholder.load('footer.html');
  }
  
  // Load Brands
  const $brandsPlaceholder = $('#brands-placeholder');
  if ($brandsPlaceholder.length) {
    $brandsPlaceholder.load('brands.html');
  }
});
```

#### How `.load()` Works
```javascript
$('#target').load('file.html', callback);
```
1. Makes AJAX GET request to `file.html`
2. Receives HTML response
3. Injects HTML into `#target` element
4. Executes callback function (if provided)

---

### 6.4 UI Helpers (`templatemo.js`)

#### Accordion Logic
```javascript
$(document).ready(function() {
  var all_panels = $('.templatemo-accordion > li > ul').hide();
  
  $('.templatemo-accordion > li > a').click(function() {
    var target = $(this).next();
    if (!target.hasClass('active')) {
      all_panels.removeClass('active').slideUp();
      target.addClass('active').slideDown();
    }
    return false;
  });
});
```

**Note**: Most product interaction logic was removed from this file during Phase 5 optimization to prevent conflicts with dynamic rendering.

---

### 6.5 Analytics (`analytics.js`)

#### Purpose
Google Analytics integration.

#### Implementation
```javascript
(function() {
  // Google Analytics tracking code
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
})();
```

---

## 7. Component System

### 7.1 Header Component (`header.html`)

#### Structure
```html
<nav class="navbar navbar-expand-lg navbar-light shadow">
  <div class="container">
    <a class="navbar-brand" href="index.html">Fashion Z</a>
    <button class="navbar-toggler">...</button>
    <div class="collapse navbar-collapse">
      <ul class="nav navbar-nav">
        <li><a href="index.html">Home</a></li>
        <li><a href="about.html">About</a></li>
        <li><a href="shop.html">Shop</a></li>
        <li><a href="contact.html">Contact</a></li>
      </ul>
      <div class="navbar align-self-center">
        <a href="#" data-bs-toggle="modal" data-bs-target="#templatemo_search">
          <i class="fa fa-search"></i>
        </a>
        <a href="#" id="cart-icon-link" data-bs-toggle="modal" data-bs-target="#cartModal">
          <i class="fa fa-cart-arrow-down"></i>
          <span id="cart-badge">0</span>
        </a>
        <a href="#"><i class="fa fa-user"></i></a>
      </div>
    </div>
  </div>
</nav>

<!-- Search Modal -->
<div class="modal" id="templatemo_search">
  <div class="modal-dialog">
    <form method="get" action="shop.html">
      <input type="text" id="inputModalSearch" name="q" placeholder="Search ...">
      <button type="submit">Search</button>
    </form>
  </div>
</div>

<!-- Cart Modal -->
<div class="modal" id="cartModal">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5>Shopping Cart</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <div id="cart-items-container"></div>
        <div id="cart-summary"></div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Continue Shopping</button>
        <button type="button" class="btn btn-success" id="checkout-button">Proceed to Checkout</button>
      </div>
    </div>
  </div>
</div>
```

#### Key Features
- Responsive navigation (collapses on mobile)
- Search modal with form submission to `shop.html?q=...`
- Cart modal with dynamic content
- Cart badge shows item count

---

### 7.2 Footer Component (`footer.html`)

#### Structure
```html
<footer class="bg-dark">
  <div class="container">
    <div class="row">
      <div class="col-md-4">
        <h2>Fashion Z</h2>
        <ul>
          <li><i class="fa fa-map-marker-alt"></i> 123 Consectetur at ligula 10660</li>
          <li><i class="fa fa-phone"></i> <a href="tel:010-020-0340">010-020-0340</a></li>
          <li><i class="fa fa-envelope"></i> <a href="mailto:info@company.com">info@company.com</a></li>
        </ul>
      </div>
      <div class="col-md-4">
        <h2>Products</h2>
        <ul>
          <li><a href="#">Luxury</a></li>
          <li><a href="#">Sport Wear</a></li>
          <!-- ... -->
        </ul>
      </div>
      <div class="col-md-4">
        <h2>Further Info</h2>
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="about.html">About Us</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </div>
    </div>
    <div class="row">
      <div class="col-auto">
        <ul class="footer-icons">
          <li><a href="http://facebook.com/"><i class="fab fa-facebook-f"></i></a></li>
          <li><a href="https://www.instagram.com/"><i class="fab fa-instagram"></i></a></li>
          <li><a href="https://twitter.com/"><i class="fab fa-twitter"></i></a></li>
          <li><a href="https://www.linkedin.com/"><i class="fab fa-linkedin"></i></a></li>
        </ul>
      </div>
      <div class="col-auto">
        <input type="text" id="subscribeEmail" placeholder="Email address">
        <div class="btn-success">Subscribe</div>
      </div>
    </div>
  </div>
  <div class="bg-black py-3">
    <p>Copyright © 2021 Company Name | Designed by TemplateMo</p>
  </div>
</footer>
```

---

### 7.3 Brands Component (`brands.html`)

#### Structure
```html
<section class="bg-light py-5">
  <div class="container">
    <div class="row text-center">
      <div class="col-lg-6 m-auto">
        <h1>Our Brands</h1>
        <p>Experience the quality of our partner brands. We curate only the best for your wardrobe.</p>
      </div>
      <div class="col-lg-9 m-auto">
        <div class="row">
          <div class="col-1 align-self-center">
            <a href="#templatemo-slide-brand" role="button" data-bs-slide="prev">
              <i class="fas fa-chevron-left"></i>
            </a>
          </div>
          <div class="col">
            <div class="carousel slide" id="templatemo-slide-brand" data-bs-ride="carousel">
              <div class="carousel-inner">
                <div class="carousel-item active">
                  <div class="row">
                    <div class="col-3"><a href="#"><img src="assets/img/brand_01.png" alt="Brand Logo"></a></div>
                    <div class="col-3"><a href="#"><img src="assets/img/brand_02.png" alt="Brand Logo"></a></div>
                    <div class="col-3"><a href="#"><img src="assets/img/brand_03.png" alt="Brand Logo"></a></div>
                    <div class="col-3"><a href="#"><img src="assets/img/brand_04.png" alt="Brand Logo"></a></div>
                  </div>
                </div>
                <!-- Additional carousel items -->
              </div>
            </div>
          </div>
          <div class="col-1 align-self-center">
            <a href="#templatemo-slide-brand" role="button" data-bs-slide="next">
              <i class="fas fa-chevron-right"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

---

## 8. State Management

### 8.1 Cart State (LocalStorage)

#### Storage Key
`shop_cart`

#### State Shape
```javascript
{
  items: [
    { id: 1, name: "Product Name", price: 25.00, qty: 2 }
  ],
  total: 50.00
}
```

#### State Mutations
- `addItem()` → Add or increment
- `removeItem()` → Delete item
- `updateQty()` → Modify quantity
- `clear()` → Reset cart

#### State Synchronization
```javascript
// Write
localStorage.setItem('shop_cart', JSON.stringify(cart));

// Read
const cart = JSON.parse(localStorage.getItem('shop_cart'));
```

---

### 8.2 Filter State (In-Memory)

#### State Object
```javascript
const filterState = {
  category: 'all',     // Current category filter
  search: '',          // Search query
  sort: 'featured'     // Sort method
};
```

#### State Updates
```javascript
// Update category
filterState.category = 'Fits';
applyFilters();

// Update search
filterState.search = 'jacket';
applyFilters();

// Update sort
filterState.sort = 'price-asc';
applyFilters();
```

#### URL Synchronization
```javascript
// Read from URL
const params = new URLSearchParams(window.location.search);
if (params.has('category')) filterState.category = params.get('category');

// Write to URL (optional enhancement)
const url = new URL(window.location);
url.searchParams.set('category', filterState.category);
window.history.pushState({}, '', url);
```

---

## 9. Event Flow & User Interactions

### 9.1 Global Event Listeners

#### Add to Cart (Global Delegation)
```javascript
$(document).on('click', '.btn-add-cart:not(#btn-add-cart-detail)', function(e) {
  e.preventDefault();
  const id = parseInt(this.dataset.itemId);
  const name = this.dataset.itemName;
  const price = parseFloat(this.dataset.price) || 0;
  
  if (typeof ShopCart !== 'undefined') {
    ShopCart.addItem(id, name, price);
    updateCartButtons(id);
  }
});
```

**Why `:not(#btn-add-cart-detail)`?**  
The product detail page has its own quantity-aware listener. Excluding it prevents double-triggering.

#### Remove from Cart
```javascript
$(document).on('click', '.btn-remove-cart', function(e) {
  e.preventDefault();
  const id = parseInt(this.dataset.itemId);
  if (typeof ShopCart !== 'undefined') {
    ShopCart.removeItem(id);
    updateCartButtons(id);
  }
});
```

#### Filter Links
```javascript
$(document).on('click', '.filter-link', function(e) {
  e.preventDefault();
  const type = $(this).data('type');
  const value = $(this).data('value');
  
  if (type === 'all') {
    resetFilters();
  } else {
    filterState[type] = value;
    applyFilters();
  }
  
  // Visual feedback
  if ($(this).closest('.shop-top-menu').length) {
    $('.shop-top-menu .filter-link').removeClass('text-success').addClass('text-dark');
    $(this).removeClass('text-dark').addClass('text-success');
  }
});
```

#### Sort Dropdown
```javascript
$(document).on('change', '#sort-select', function() {
  filterState.sort = $(this).val();
  applyFilters();
});
```

#### Search Input
```javascript
$(document).on('input', '#inputModalSearch, #inputMobileSearch', function() {
  filterState.search = $(this).val();
  if ($('#product-grid').length) {
    applyFilters();
  }
});
```

---

### 9.2 Custom Events

#### `cart-item-removed`
**Dispatched by**: `ShopCart.removeItem()`  
**Purpose**: Notify other parts of the app that an item was removed  
**Listener**:
```javascript
document.addEventListener('cart-item-removed', (e) => {
  if (e.detail?.productId) {
    updateCartButtons(e.detail.productId);
  }
});
```

---

## 10. Security Considerations

### 10.1 XSS Prevention

#### Current Implementation
```javascript
const escapeHtml = (unsafe) => {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};
```

**Usage**:
```javascript
const title = escapeHtml(p.title);
html += `<h3>${title}</h3>`;  // Safe
```

#### Limitations
- Only protects against basic XSS
- Does not sanitize HTML attributes fully
- No protection against DOM-based XSS

#### Recommendations
- Use a library like **DOMPurify** for comprehensive sanitization
- Implement Content Security Policy (CSP) headers
- Validate all user inputs on both client and server

---

### 10.2 LocalStorage Security

#### Current Risks
- Data is stored in plain text
- Accessible via JavaScript (vulnerable to XSS)
- No encryption

#### Recommendations
- **Don't store sensitive data** (passwords, credit cards)
- Consider encrypting cart data if it contains PII
- Implement session timeouts
- Clear cart on logout

---

### 10.3 CSRF Protection

#### Current Status
No CSRF protection (no forms submit to backend)

#### Future Considerations
When adding backend:
- Implement CSRF tokens
- Use SameSite cookies
- Validate Origin/Referer headers

---

## 11. Performance Optimization

### 11.1 Current Optimizations

#### Lazy Loading
```html
<img src="product.jpg" loading="lazy" alt="Product">
```

#### Event Delegation
```javascript
// Instead of attaching to each button:
$('.btn-add-cart').on('click', handler);  // ❌ Slow for many buttons

// Use delegation:
$(document).on('click', '.btn-add-cart', handler);  // ✅ Single listener
```

#### Debouncing Search
```javascript
let searchTimeout;
$(document).on('input', '#inputModalSearch', function() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    filterState.search = $(this).val();
    applyFilters();
  }, 300);  // Wait 300ms after user stops typing
});
```

---

### 11.2 Performance Metrics

#### Target Metrics
- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.5s
- **Cumulative Layout Shift (CLS)**: < 0.1

#### Current Bottlenecks
1. **Large Images**: Product images not optimized
2. **Render Blocking JS**: jQuery loaded in `<head>`
3. **No Code Splitting**: All JS loaded upfront

---

### 11.3 Optimization Recommendations

#### Image Optimization
```bash
# Convert to WebP
cwebp product.jpg -q 80 -o product.webp

# Responsive images
<picture>
  <source srcset="product-small.webp" media="(max-width: 600px)">
  <source srcset="product-large.webp" media="(min-width: 601px)">
  <img src="product.jpg" alt="Product">
</picture>
```

#### Async/Defer Scripts
```html
<!-- Defer non-critical scripts -->
<script src="jquery.min.js" defer></script>
<script src="render-products.js" defer></script>

<!-- Async for analytics -->
<script src="analytics.js" async></script>
```

#### Code Splitting
```javascript
// Load product rendering only on shop pages
if (document.getElementById('product-grid')) {
  import('./render-products.js');
}
```

#### Caching Strategy
```javascript
// Service Worker for offline support
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

---

## 12. Future Enhancements

### 12.1 Short-Term (1-3 months)

#### 1. Wishlist Feature
**Implementation**:
```javascript
var Wishlist = {
  storageKey: 'shop_wishlist',
  addItem: function(productId) {
    let wishlist = JSON.parse(localStorage.getItem(this.storageKey)) || [];
    if (!wishlist.includes(productId)) {
      wishlist.push(productId);
      localStorage.setItem(this.storageKey, JSON.stringify(wishlist));
    }
  },
  // ... similar to ShopCart
};
```

#### 2. Product Reviews
**Schema**:
```json
{
  "productId": 1,
  "reviews": [
    {
      "id": 1,
      "author": "John Doe",
      "rating": 5,
      "comment": "Great product!",
      "date": "2026-01-15"
    }
  ]
}
```

#### 3. Price Range Filter
**UI**:
```html
<div class="price-filter">
  <label>Price Range: $<span id="price-min">0</span> - $<span id="price-max">100</span></label>
  <input type="range" id="price-slider" min="0" max="100" value="100">
</div>
```

**Logic**:
```javascript
$('#price-slider').on('input', function() {
  const maxPrice = $(this).val();
  $('#price-max').text(maxPrice);
  filterState.maxPrice = maxPrice;
  applyFilters();
});
```

---

### 12.2 Medium-Term (3-6 months)

#### 1. Backend Integration
**Tech Stack Options**:
- **Node.js + Express**: RESTful API
- **Firebase**: Real-time database
- **Strapi**: Headless CMS
- **Shopify Storefront API**: Full eCommerce platform

**API Endpoints**:
```
GET  /api/products          # List all products
GET  /api/products/:id      # Get single product
POST /api/cart              # Add to cart
GET  /api/cart              # Get cart
POST /api/checkout          # Process order
```

#### 2. User Authentication
**Implementation**:
```javascript
// Using Firebase Auth
firebase.auth().signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    // Load user's cart from server
  });
```

#### 3. Payment Gateway
**Options**:
- Stripe
- PayPal
- Square

**Integration**:
```javascript
const stripe = Stripe('pk_test_...');
const elements = stripe.elements();
const cardElement = elements.create('card');
cardElement.mount('#card-element');
```

---

### 12.3 Long-Term (6-12 months)

#### 1. Framework Migration
**Options**:
- **Next.js**: React-based, SSR/SSG
- **Nuxt.js**: Vue-based, SSR/SSG
- **Astro**: Multi-framework, static-first

**Benefits**:
- Better SEO (Server-Side Rendering)
- Improved performance (Code splitting)
- Modern developer experience

#### 2. Progressive Web App (PWA)
**Features**:
- Offline support
- Add to home screen
- Push notifications
- Background sync

**Implementation**:
```javascript
// manifest.json
{
  "name": "FashionZ",
  "short_name": "FashionZ",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#59ab6e",
  "icons": [...]
}
```

#### 3. Advanced Analytics
**Metrics to Track**:
- Product view duration
- Cart abandonment rate
- Conversion funnel
- A/B testing results

**Tools**:
- Google Analytics 4
- Mixpanel
- Hotjar (heatmaps)

---

## Appendix A: File Size Analysis

| File | Size | Gzipped | Notes |
|------|------|---------|-------|
| bootstrap.min.css | 160 KB | 23 KB | Consider using only needed components |
| jquery-3.6.0.min.js | 89 KB | 31 KB | Consider vanilla JS migration |
| render-products.js | 17 KB | 5 KB | Well-optimized |
| products.json | 15 KB | 3 KB | Grows with catalog |
| slick.min.js | 42 KB | 12 KB | Only load on carousel pages |

**Total JS Bundle**: ~250 KB (uncompressed)  
**Total CSS Bundle**: ~200 KB (uncompressed)

---

## Appendix B: Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| ES6 Arrow Functions | ✅ | ✅ | ✅ | ✅ |
| LocalStorage | ✅ | ✅ | ✅ | ✅ |
| Fetch API | ✅ | ✅ | ✅ | ✅ |
| CSS Grid | ✅ | ✅ | ✅ | ✅ |
| Lazy Loading | ✅ | ✅ | ✅ | ✅ |

**Minimum Supported Versions**:
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

---

## Appendix C: Glossary

**CSR**: Client-Side Rendering - JavaScript renders content in browser  
**SSR**: Server-Side Rendering - Server generates HTML  
**SSG**: Static Site Generation - Pre-render pages at build time  
**XSS**: Cross-Site Scripting - Injection attack via malicious scripts  
**CSRF**: Cross-Site Request Forgery - Unauthorized commands from trusted user  
**PWA**: Progressive Web App - Web app with native-like features  
**LCP**: Largest Contentful Paint - Time to render largest element  
**FCP**: First Contentful Paint - Time to first visible content  
**TTI**: Time to Interactive - Time until page is fully interactive  
**CLS**: Cumulative Layout Shift - Visual stability metric

---

**Document Version**: 1.0  
**Last Updated**: February 1, 2026  
**Maintained By**: Development Team
