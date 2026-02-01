'use strict';

/**
 * Utility: Escape HTML to prevent XSS
 */
const escapeHtml = (unsafe) => {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

/**
 * Utility: Create star rating HTML
 */
const createStarRating = (rating) => {
  let stars = '';
  for (let i = 0; i < 5; i++) {
    const colorClass = i < rating ? 'text-warning' : 'text-muted';
    stars += `<i class="${colorClass} fa fa-star"></i>`;
  }
  return stars;
};

/**
 * Helper: Check if product is in cart
 */
const isProductInCart = (productId) => {
  if (typeof ShopCart === 'undefined') return false;
  const cart = ShopCart.getCart();
  return cart && cart.items.some(item => item.id === productId);
};

/**
 * Helper: Update cart button visibility
 */
const updateCartButtons = (productId) => {
  const inCart = isProductInCart(productId);

  // Toggle all Add buttons
  document.querySelectorAll(`.btn-add-cart[data-item-id="${productId}"]`).forEach(btn => {
    btn.style.display = inCart ? 'none' : 'inline-block';
  });

  // Toggle all Remove buttons
  document.querySelectorAll(`.btn-remove-cart[data-item-id="${productId}"]`).forEach(btn => {
    if (inCart) {
      btn.style.display = '';
      if (getComputedStyle(btn).display === 'none') btn.style.display = 'inline-block';
    } else {
      btn.style.display = 'none';
    }
  });
};

/**
 * Helper: Annotate product elements with data attributes
 */
const annotateProductActions = (product, container) => {
  if (!product || !product.id) return;
  const $container = $(container);
  const itemId = String(product.id);
  const itemName = (product.title || '').trim();

  const setAttrs = (elem) => {
    elem.dataset.itemId = itemId;
    elem.dataset.itemName = itemName;
    if (product.price) elem.dataset.price = product.price;
  };

  setAttrs($container[0]);
  $container.find('a[href*="shop-single.html"], .product-overlay a, .btn-add-cart, .btn-remove-cart')
    .each((_, el) => setAttrs(el));
};

/**
 * Template: Create Product Card HTML
 */
const createProductCard = (p) => {
  const title = escapeHtml(p.title);
  const price = p.price;
  const id = p.id;
  const image = p.image;
  const sizes = p.sizes ? p.sizes.join('/') : '';
  const colors = p.colors || [];

  let colorDots = '';
  colors.forEach(c => {
    colorDots += `<span class="product-color-dot color-dot-${escapeHtml(c)} float-left rounded-circle ml-1"></span>`;
  });

  return `
    <div class="col-md-4" data-item-id="${id}">
      <div class="card mb-4 product-wap rounded-0 h-100">
        <div class="card rounded-0">
          <a href="shop-single.html?id=${id}"><img class="card-img rounded-0 img-fluid" src="${image}" loading="lazy" alt="${title}"></a>
          <div class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
            <ul class="list-unstyled">
              <li><a class="btn btn-success text-white" href="shop-single.html?id=${id}"><i class="far fa-heart"></i></a></li>
              <li><a class="btn btn-success text-white mt-2" href="shop-single.html?id=${id}"><i class="far fa-eye"></i></a></li>
              <li><button class="btn btn-success text-white mt-2 btn-add-cart" data-item-id="${id}" data-item-name="${title}" data-price="${price}"><i class="fas fa-cart-plus"></i></button></li>
            </ul>
          </div>
        </div>
        <div class="card-body">
          <a href="shop-single.html?id=${id}" class="h3 text-decoration-none">${title}</a>
          <ul class="w-100 list-unstyled d-flex justify-content-between mb-0">
            <li>${sizes}</li>
            <li class="pt-2">${colorDots}</li>
          </ul>
          <ul class="list-unstyled d-flex justify-content-center mb-1">
            <li>${createStarRating(p.rating)}</li>
          </ul>
          <p class="text-center mb-0">$${price}</p>
          <div class="text-center mt-2">
            <button class="btn btn-success btn-add-cart" data-item-id="${id}" data-item-name="${title}" data-price="${price}">Add to Cart</button>
            <button class="btn btn-danger btn-remove-cart" data-item-id="${id}" data-item-name="${title}" style="display:none;">Remove from Cart</button>
          </div>
        </div>
      </div>
    </div>
  `;
};

/**
 * Template: Create Featured Product Card HTML (for homepage)
 */
const createFeaturedProductCard = (p) => {
  const title = escapeHtml(p.title);
  const price = p.price;
  const id = p.id;
  const image = p.image;
  const ratingHtml = createStarRating(p.rating);
  const reviews = p.reviews || 0;
  const description = escapeHtml(p.description || '');

  return `
    <div class="col-12 col-md-4 mb-4" data-item-id="${id}">
        <div class="card h-100">
            <a href="shop-single.html?id=${id}">
                <img src="${image}" class="card-img-top" alt="${title}">
            </a>
            <div class="card-body">
                <ul class="list-unstyled d-flex justify-content-between">
                    <li>
                        ${ratingHtml}
                    </li>
                    <li class="text-muted text-right">$${price}</li>
                </ul>
                <a href="shop-single.html?id=${id}" class="h2 text-decoration-none text-dark">${title}</a>
                <p class="card-text">${description}</p>
                <p class="text-muted">Reviews (${reviews})</p>
                <div class="text-center mt-3">
                    <button class="btn btn-success btn-add-cart" data-item-id="${id}" data-item-name="${title}" data-price="${price}">Add to Cart</button>
                    <button class="btn btn-danger btn-remove-cart" data-item-id="${id}" data-item-name="${title}" style="display:none;">Remove from Cart</button>
                </div>
            </div>
        </div>
    </div>
  `;
};

/**
 * Global State
 */
let allProducts = [];
const filterState = {
  category: 'all',
  search: '',
  sort: 'featured'
};

/**
 * Feature: Render Product Grid (Shop Page)
 */
const applyFilters = () => {
  let filtered = [...allProducts];

  if (filterState.category !== 'all') {
    filtered = filtered.filter(p => p.category === filterState.category);
  }
  if (filterState.search) {
    const q = filterState.search.toLowerCase();
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(q) ||
      (p.category && p.category.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  }

  // Sort
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
    default: // featured or other
      break;
  }

  renderProductGrid(filtered);
};

window.resetFilters = () => {
  filterState.category = 'all';
  filterState.search = '';
  filterState.sort = 'featured';
  $('#sort-select').val('featured');
  applyFilters();
};

const renderProductGrid = (products) => {
  const $grid = $('#product-grid');
  if (!$grid.length) return;

  if (!products || !products.length) {
    $grid.html('<div class="col-12 text-center py-5"><h3>No products found matching your criteria.</h3><button class="btn btn-success mt-3" onclick="resetFilters()">Clear Filters</button></div>');
    return;
  }

  const html = products.map(p => createProductCard(p)).join('');
  $grid.html(html);

  products.forEach(p => {
    updateCartButtons(p.id);
  });
};

/**
 * Feature: Render Featured Products (Homepage)
 */
const renderFeaturedProducts = (products) => {
  const $placeholder = $('#featured-products-placeholder');
  if (!$placeholder.length) return;

  const featured = products.filter(p => p.featured);
  if (!featured.length) {
    $placeholder.html('<div class="col-12 text-center text-muted">No featured products available.</div>');
    return;
  }

  const html = featured.map(p => createFeaturedProductCard(p)).join('');
  $placeholder.html(html);

  featured.forEach(p => {
    updateCartButtons(p.id);
  });
};

/**
 * Feature: Render Single Product Detail
 */
const renderSingleProduct = (products) => {
  const $mainImg = $('#product-detail');
  if (!$mainImg.length) return;

  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'), 10);

  if (!id) {
    $('.container.pb-5').html('<div class="alert alert-warning">No product ID provided.</div>');
    return;
  }

  const p = products.find(x => x.id === id);
  if (!p) {
    $('.container.pb-5').html('<div class="alert alert-danger">Product not found.</div>');
    return;
  }

  // 1. Basic Info
  $('#product-title').text(p.title);
  $('#product-price').text('$' + p.price);
  $('#product-description').text(p.description || '');
  $mainImg.attr('src', p.image).attr('alt', p.title);
  $('#product-category-text').text(p.category || 'Fits');
  $('#product-colors-text').text(p.colors ? p.colors.join(' / ') : 'Standard');

  // 2. Rating
  const stars = createStarRating(p.rating);
  $('#product-rating-container').html(`${stars} <span class="list-inline-item text-dark">Rating ${p.rating.toFixed(1)} | ${p.reviews || 0} Comments</span>`);

  // 3. Sizes
  const $sizeContainer = $('#product-size-container');
  const sizeNames = p.sizes || ['S', 'M', 'L', 'XL'];
  let sizeHtml = '<li class="list-inline-item">Size :</li>';
  sizeNames.forEach((s, idx) => {
    const activeClass = idx === 0 ? 'btn-success' : 'btn-secondary';
    sizeHtml += `<li class="list-inline-item"><span class="btn ${activeClass} btn-size" data-size="${s}">${s}</span></li>`;
  });
  $sizeContainer.html(sizeHtml);

  // 4. Quantity Logic
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

  // 5. Size Toggle Logic
  $sizeContainer.on('click', '.btn-size', function () {
    $('.btn-size').removeClass('btn-success').addClass('btn-secondary');
    $(this).removeClass('btn-secondary').addClass('btn-success');
  });

  // 6. Action Buttons
  const $addBtn = $('#btn-add-cart-detail');
  const $removeBtn = $('#btn-remove-cart-detail');
  const $buyBtn = $('#btn-buy-now');

  [$addBtn, $removeBtn, $buyBtn].forEach($btn => {
    $btn.attr('data-item-id', p.id).attr('data-item-name', p.title).attr('data-price', p.price);
  });

  // Buy Now is just Add + View Cart
  $buyBtn.off('click').on('click', function () {
    if (typeof ShopCart !== 'undefined') {
      ShopCart.addItem(p.id, p.title, p.price, qty);
      $('#cartModal').modal('show');
    }
  });

  // Override Add to Cart for local quantity
  $addBtn.off('click').on('click', function () {
    if (typeof ShopCart !== 'undefined') {
      ShopCart.addItem(p.id, p.title, p.price, qty);
      updateCartButtons(p.id);
    }
  });

  updateCartButtons(p.id);
  renderRelatedProducts(products, id);
};

/**
 * Feature: Render Related Products
 */
const renderRelatedProducts = (products, currentId) => {
  const $container = $('#carousel-related-product');
  if (!$container.length) return;

  const currentProduct = products.find(p => p.id === currentId);
  const related = products.filter(p => p.id !== currentId && (p.category === currentProduct?.category)).slice(0, 8);

  if (!related.length) {
    $container.html('<div class="col-12 text-center text-muted">No related products found.</div>');
    return;
  }

  const html = related.map(p => {
    const title = escapeHtml(p.title);
    return `
      <div class="p-2 pb-3">
        <div class="product-wap card rounded-0 h-100" data-item-id="${p.id}">
          <div class="card rounded-0">
            <a href="shop-single.html?id=${p.id}"><img class="card-img rounded-0 img-fluid" src="${p.image}" alt="${title}"></a>
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

  if ($.fn.slick) {
    if ($container.hasClass('slick-initialized')) $container.slick('unslick');
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

  related.forEach(p => {
    updateCartButtons(p.id);
  });
};

/**
 * Initialize
 */
$(function () {
  fetch('./data/products.json')
    .then(res => res.json())
    .then(products => {
      allProducts = products;

      // Parse URL Params
      const params = new URLSearchParams(window.location.search);
      if (params.has('category')) filterState.category = params.get('category');
      if (params.has('gender')) filterState.gender = params.get('gender');
      if (params.has('saleType')) filterState.saleType = params.get('saleType');
      if (params.has('q')) filterState.search = params.get('q');

      // Initial Renders
      renderFeaturedProducts(allProducts);
      renderSingleProduct(allProducts);
      applyFilters();
    })
    .catch(err => console.error('Error loading products:', err));

  // Event Listeners: Filters
  $(document).on('click', '.filter-link', function (e) {
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

  // Event Listeners: Sort
  $(document).on('change', '#sort-select', function () {
    filterState.sort = $(this).val();
    applyFilters();
  });

  // Event Listeners: Search (Modal and Direct)
  $(document).on('input', '#inputModalSearch, #inputMobileSearch', function () {
    filterState.search = $(this).val();
    // If we are on shop.html, apply immediately
    if ($('#product-grid').length) {
      applyFilters();
    }
  });

  // Handle Search Form Submit
  $(document).on('submit', '#templatemo_search form', function (e) {
    if ($('#product-grid').length) {
      e.preventDefault();
      applyFilters();
      $('#templatemo_search').modal('hide');
    }
    // If not on shop page, let it submit to shop.html?q=... (default behavior)
  });

  // Global Cart Listeners
  // Note: We exclude #btn-add-cart-detail because it has its own quantity-aware listener
  $(document).on('click', '.btn-add-cart:not(#btn-add-cart-detail)', function (e) {
    e.preventDefault();
    const id = parseInt(this.dataset.itemId);
    const name = this.dataset.itemName;
    const price = parseFloat(this.dataset.price) || 0;

    if (typeof ShopCart !== 'undefined') {
      ShopCart.addItem(id, name, price);
      updateCartButtons(id);
    }
  });

  $(document).on('click', '.btn-remove-cart', function (e) {
    e.preventDefault();
    const id = parseInt(this.dataset.itemId);
    if (typeof ShopCart !== 'undefined') {
      ShopCart.removeItem(id);
      updateCartButtons(id);
    }
  });

  document.addEventListener('cart-item-removed', (e) => {
    if (e.detail?.productId) updateCartButtons(e.detail.productId);
  });
});