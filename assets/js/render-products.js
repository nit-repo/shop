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
    // For remove buttons, we want to show them if in cart, else hide
    if (inCart) {
      btn.style.display = ''; // Reset to default (block/inline-block) or forced 'inline-block'
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

  // Helper to set attributes
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
              <li><button class="btn btn-success text-white mt-2 btn-add-cart" data-item-id="${id}"><i class="fas fa-cart-plus"></i></button></li>
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
            <button class="btn btn-success btn-add-cart" data-item-id="${id}">Add to Cart</button>
            <button class="btn btn-danger btn-remove-cart" data-item-id="${id}" style="display:none;">Remove from Cart</button>
          </div>
        </div>
      </div>
    </div>
  `;
};

/**
 * Feature: Render Product Grid
 */
const renderProductGrid = (products) => {
  const $grid = $('#product-grid');
  if (!$grid.length) return;

  if (!products || !products.length) {
    $grid.html('<div class="col-12 text-center">No products found.</div>');
    return;
  }

  const html = products.map(p => createProductCard(p)).join('');
  $grid.html(html);

  // Post-render annotation
  products.forEach(p => {
    const $card = $grid.find(`[data-item-id="${p.id}"]`);
    if ($card.length) {
      annotateProductActions(p, $card);
      updateCartButtons(p.id);
    }
  });
};

/**
 * Feature: Render Single Product
 */
const renderSingleProduct = (products) => {
  const $productDetail = $('#product-detail');
  if (!$productDetail.length) return;

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

  // Update DOM elements
  $productDetail.attr('src', p.image).attr('alt', p.title);
  $('#multi-item-example .carousel-inner img.card-img').attr('src', p.image).attr('alt', p.title);

  $('.card-body h1.h2').text(p.title);
  $('.card-body p.h3.py-2').text('$' + p.price);

  // Rating
  const $ratingP = $('.card-body p.py-2').last();
  $ratingP.html(`${createStarRating(p.rating)} <span class="list-inline-item text-dark">Rating ${p.rating.toFixed(1)} | ${p.reviews || 0} Comments</span>`);

  // Sizes
  const $sizeUl = $('input[name="product-size"]').closest('li').parent();
  $sizeUl.empty();
  $sizeUl.append(`<li class="list-inline-item">Size : <input type="hidden" name="product-size" id="product-size" value="${p.sizes[0] || ''}"></li>`);

  p.sizes.forEach(s => {
    $sizeUl.append(`<li class="list-inline-item"><span class="btn btn-success btn-size">${s}</span></li>`);
  });

  // Colors
  $('h6').filter((_, el) => $(el).text().trim().startsWith('Avaliable Color'))
    .next().find('strong').text(p.colors.join(' / '));

  // Buttons
  const $addBtn = $('button[name="submit"][value="addtocard"]');
  const $buyBtn = $('button[name="submit"][value="buy"]');
  const $removeBtn = $('button[name="submit"][value="removefromcart"]');

  $addBtn.addClass('btn-add-cart').attr('data-item-id', p.id);
  $buyBtn.attr('data-item-id', p.id);

  // Annotate container
  const $section = $productDetail.closest('section');
  annotateProductActions(p, $section);

  // Initial cart state check
  if (isProductInCart(p.id)) {
    $addBtn.hide();
    $removeBtn.show();
  }

  // Related Products
  renderRelatedProducts(products, id);

  // Analytics
  if (typeof dataLayer !== 'undefined') {
    dataLayer.push({
      event: 'view_item',
      ecommerce: { items: [{ item_id: String(p.id), item_name: p.title, price: p.price }] }
    });
  }
};

/**
 * Feature: Render Related Products
 */
const renderRelatedProducts = (products, currentId) => {
  const $container = $('#carousel-related-product');
  // Only proceed if container exists and is NOT part of the template markup check
  // The original code had a check, we'll verify by ID availability
  if (!$container.length) return;

  const related = products.filter(p => p.id !== currentId);
  const html = related.map(p => {
    const title = escapeHtml(p.title);
    return `
      <div class="p-2 pb-3">
        <div class="product-wap card rounded-0" data-item-id="${p.id}">
          <div class="card rounded-0">
            <a href="shop-single.html?id=${p.id}"><img class="card-img rounded-0 img-fluid" src="${p.image}" alt="${title}"></a>
            <div class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
              <ul class="list-unstyled">
                <li><a class="btn btn-success text-white" href="shop-single.html?id=${p.id}"><i class="far fa-heart"></i></a></li>
                <li><a class="btn btn-success text-white mt-2" href="shop-single.html?id=${p.id}"><i class="far fa-eye"></i></a></li>
                <li><button class="btn btn-success text-white mt-2 btn-add-cart"><i class="fas fa-cart-plus"></i></button></li>
              </ul>
            </div>
          </div>
          <div class="card-body">
            <a href="shop-single.html?id=${p.id}" class="h3 text-decoration-none">${title}</a>
            <ul class="w-100 list-unstyled d-flex justify-content-between mb-0">
              <li>${p.sizes.join('/')}</li>
              <li class="pt-2">
                ${p.colors.map(c => `<span class="product-color-dot color-dot-${escapeHtml(c)} float-left rounded-circle ml-1"></span>`).join('')}
              </li>
            </ul>
             <ul class="list-unstyled d-flex justify-content-center mb-1">
              <li>${createStarRating(p.rating)}</li>
            </ul>
            <p class="text-center mb-0">$${p.price}</p>
          </div>
        </div>
      </div>
    `;
  }).join('');

  $container.html(html);

  // Initialize Slick Carousel
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
        { breakpoint: 600, settings: { slidesToShow: 2, slidesToScroll: 3 } },
        { breakpoint: 480, settings: { slidesToShow: 2, slidesToScroll: 3 } }
      ]
    });
  }

  // Annotate
  related.forEach(p => {
    const $card = $container.find(`[data-item-id="${p.id}"]`);
    annotateProductActions(p, $card);
    updateCartButtons(p.id); // Although related products usually just add, we can check state
  });
};

/**
 * Initialize
 */
$(function () {
  fetch('./data/products.json')
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then(products => {
      renderProductGrid(products);
      renderSingleProduct(products);
    })
    .catch(err => {
      console.error('Error loading products:', err);
      $('#product-grid').html('<div class="col-12 text-center text-danger">Failed to load products. Please try again later.</div>');
    });

  // Global Event Delegation for Cart Actions
  $(document).on('click', '.btn-add-cart', function (e) {
    e.preventDefault();
    const id = parseInt(this.dataset.itemId);
    const name = this.dataset.itemName;
    const price = parseFloat(this.dataset.price) || 0;

    if (typeof ShopCart !== 'undefined') {
      ShopCart.addItem(id, name, price);
      updateCartButtons(id);

      // GA4
      if (typeof dataLayer !== 'undefined') {
        dataLayer.push({
          event: 'add_to_cart',
          ecommerce: { items: [{ item_id: String(id), item_name: name, price: price }] }
        });
      }
    }
  });

  $(document).on('click', '.btn-remove-cart', function (e) {
    e.preventDefault();
    const id = parseInt(this.dataset.itemId);

    if (typeof ShopCart !== 'undefined') {
      ShopCart.removeItem(id);
      updateCartButtons(id);

      // GA4
      if (typeof dataLayer !== 'undefined') {
        dataLayer.push({
          event: 'remove_from_cart',
          ecommerce: { items: [{ item_id: String(id) }] } // Price/name might not be avail here
        });
      }
    }
  });

  // Listen for cart removal events from other sources (e.g. Cart Modal)
  document.addEventListener('cart-item-removed', function (e) {
    if (e.detail && e.detail.productId) {
      updateCartButtons(e.detail.productId);
    }
  });
});