/* Helper: Check if product is in cart */
function isProductInCart(productId) {
  if (typeof ShopCart === 'undefined') return false;
  var cart = ShopCart.getCart();
  return cart.items.some(function(item) { return item.id === productId; });
}

/* Helper: Toggle add/remove buttons based on cart state */
function updateCartButtons(productId) {
  $('[data-item-id="' + productId + '"]').each(function() {
    var $addBtn = $(this).find('.btn-add-cart');
    var $removeBtn = $(this).find('.btn-remove-cart');
    
    if (isProductInCart(productId)) {
      $addBtn.hide();
      $removeBtn.show();
    } else {
      $addBtn.show();
      $removeBtn.hide();
    }
  });
}

/* Helper: Annotate all product actions in a container with data-item-id and data-item-name using safe DOM APIs */
function annotateProductActions(product, container) {
  if (!product || !product.id) return;
  var itemId = String(product.id);
  var itemName = (product.title || '').trim(); // Plain text, no HTML
  
  var $container = container.jquery ? container : $(container);
  
  // Set on container itself
  $container.prop('dataset').itemId = itemId;
  $container.prop('dataset').itemName = itemName;
  
  // Set on all image anchors
  $container.find('a[href*="shop-single.html"]').each(function() {
    this.dataset.itemId = itemId;
    this.dataset.itemName = itemName;
  });
  
  // Set on overlay action links (heart, view, cart)
  $container.find('.product-overlay a').each(function() {
    this.dataset.itemId = itemId;
    this.dataset.itemName = itemName;
  });
  
  // Set on add-to-cart button
  $container.find('.btn-add-cart, .btn-remove-cart').each(function() {
    this.dataset.itemId = itemId;
    this.dataset.itemName = itemName;
  });
}

/* Render product grid from /data/products.json */
$(function () {
  var $grid = $('#product-grid');
  if (!$grid.length) return;

  fetch('./data/products.json')
    .then(function (res) { return res.json(); })
    .then(function (products) {
      var html = '';
      products.forEach(function (p) {
        html += '<div class="col-md-4" data-item-id="' + p.id + '" data-item-name="' + (p.title && p.title.replace(/"/g, '&quot;')) + '">';
        html += '  <div class="card mb-4 product-wap rounded-0 h-100">';
        html += '    <div class="card rounded-0">';
        html += '      <a href="shop-single.html?id=' + p.id + '" data-item-id="' + p.id + '" data-item-name="' + (p.title && p.title.replace(/"/g, '&quot;')) + '"><img class="card-img rounded-0 img-fluid" src="' + p.image + '" loading="lazy" alt="' + p.title + '"></a>';
        html += '      <div class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">';
        html += '        <ul class="list-unstyled">';
        html += '          <li><a class="btn btn-success text-white" href="shop-single.html" data-item-id="' + p.id + '" data-item-name="' + (p.title && p.title.replace(/"/g, '&quot;')) + '"><i class="far fa-heart"></i></a></li>';
        html += '          <li><a class="btn btn-success text-white mt-2" href="shop-single.html?id=' + p.id + '" data-item-id="' + p.id + '" data-item-name="' + (p.title && p.title.replace(/"/g, '&quot;')) + '"><i class="far fa-eye"></i></a></li>';
        html += '          <li><a class="btn btn-success text-white mt-2" href="shop-single.html" data-item-id="' + p.id + '" data-item-name="' + (p.title && p.title.replace(/"/g, '&quot;')) + '"><i class="fas fa-cart-plus"></i></a></li>';
        html += '        </ul>';
        html += '      </div>';
        html += '    </div>';
        html += '    <div class="card-body">';
        html += '      <a href="shop-single.html?id=' + p.id + '" class="h3 text-decoration-none" data-item-id="' + p.id + '" data-item-name="' + (p.title && p.title.replace(/"/g, '&quot;')) + '">' + p.title + '</a>';
        html += '      <ul class="w-100 list-unstyled d-flex justify-content-between mb-0">';
        html += '        <li>' + p.sizes.join('/') + '</li>';
        html += '        <li class="pt-2">';
        p.colors.forEach(function(c){
          html += '<span class="product-color-dot color-dot-' + c + ' float-left rounded-circle ml-1"></span>';
        });
        html += '        </li>';
        html += '      </ul>';
        html += '      <ul class="list-unstyled d-flex justify-content-center mb-1"><li>';
        for (var i = 0; i < 5; i++) {
          if (i < p.rating) html += '<i class="text-warning fa fa-star"></i>';
          else html += '<i class="text-muted fa fa-star"></i>';
        }
        html += '</li></ul>';
        html += '      <p class="text-center mb-0">$' + p.price + '</p>';
        html += '      <div class="text-center mt-2">';
        html += '        <button class="btn btn-success btn-add-cart" data-id="' + p.id + '" data-item-id="' + p.id + '" data-item-name="' + (p.title && p.title.replace(/"/g, '&quot;')) + '" data-price="' + p.price + '">Add to Cart</button>';
        html += '        <button class="btn btn-danger btn-remove-cart" data-id="' + p.id + '" data-item-id="' + p.id + '" data-item-name="' + (p.title && p.title.replace(/"/g, '&quot;')) + '" style="display:none;">Remove from Cart</button>';
        html += '      </div>';
        html += '    </div>';
        html += '  </div>';
        html += '</div>';
      });
      $grid.html(html);
      
      // Annotate all product actions using DOM dataset for safe assignment
      products.forEach(function (p) {
        var $productCard = $grid.find('[data-item-id="' + p.id + '"]').first();
        if ($productCard.length) {
          annotateProductActions(p, $productCard);
          updateCartButtons(p.id);
        }
      });
    })
    .catch(function (err) {
      console.error('Failed to load products.json', err);
      $grid.html('<div class="col-12">Failed to load products.</div>');
    });
});

// Add-to-cart and Remove-from-cart handlers
$(function () {
  // Add to cart button
  $(document).on('click', '.btn-add-cart', function (e) {
    e.preventDefault();
    
    // Read id/name/price from dataset first (new safe method), fall back to data-id for backward compat
    var id = parseInt(this.dataset.itemId || $(this).data('id'));
    var name = this.dataset.itemName || '';
    var price = parseFloat(this.dataset.price) || 0;
    
    // Add to localStorage cart
    if (typeof ShopCart !== 'undefined') {
      ShopCart.addItem(id, name, price);
    }
    
    // Push GA4 add_to_cart event if dataLayer is available
    if (typeof dataLayer !== 'undefined' && id) {
      dataLayer.push({
        event: 'add_to_cart',
        ecommerce: {
          items: [{
            item_id: String(id),
            item_name: name,
            price: price
          }]
        }
      });
    }
    
    // Update button visibility
    updateCartButtons(id);
  });
  
  // Remove from cart button
  $(document).on('click', '.btn-remove-cart', function (e) {
    e.preventDefault();
    
    var id = parseInt(this.dataset.itemId || $(this).data('id'));
    var name = this.dataset.itemName || '';
    
    // Remove from localStorage cart
    if (typeof ShopCart !== 'undefined') {
      ShopCart.removeItem(id);
    }
    
    // Push GA4 remove_from_cart event if dataLayer is available
    if (typeof dataLayer !== 'undefined' && id) {
      dataLayer.push({
        event: 'remove_from_cart',
        ecommerce: {
          items: [{
            item_id: String(id),
            item_name: name
          }]
        }
      });
    }
    
    // Update button visibility
    updateCartButtons(id);
  });
});

// Render single product on shop-single.html when ?id=xxx
$(function () {
  var $productDetail = $('#product-detail');
  if (!$productDetail.length) return;

  var params = new URLSearchParams(window.location.search);
  var id = parseInt(params.get('id'), 10);
  if (!id) {
    $('.container.pb-5').html('<div class="alert alert-warning">No product id provided.</div>');
    return;
  }

  fetch('./data/products.json')
    .then(function (res) { return res.json(); })
    .then(function (products) {
      var p = products.find(function (x) { return x.id === id; });
      if (!p) {
        $('.container.pb-5').html('<div class="alert alert-danger">Product not found.</div>');
        return;
      }

      // Main image + thumbnails
      $productDetail.attr('src', p.image).attr('alt', p.title);
      $('#multi-item-example .carousel-inner img.card-img').attr('src', p.image).attr('alt', p.title);

      // Title + Price
      $('.card-body h1.h2').text(p.title);
      $('.card-body p.h3.py-2').text('$' + p.price);

      // Rating + reviews
      var $ratingP = $('.card-body p.py-2').last();
      var stars = '';
      for (var i = 0; i < 5; i++) {
        stars += i < p.rating ? '<i class="fa fa-star text-warning"></i>' : '<i class="fa fa-star text-secondary"></i>';
      }
      $ratingP.html(stars + ' <span class="list-inline-item text-dark">Rating ' + (p.rating).toFixed(1) + ' | ' + (p.reviews || 0) + ' Comments</span>');

      // Hidden product-title
      $('input[name="product-title"]').val(p.title);

      // Sizes (replace the size buttons)
      var $sizeUl = $('input[name="product-size"]').closest('li').parent();
      $sizeUl.empty();
      $sizeUl.append('<li class="list-inline-item">Size : <input type="hidden" name="product-size" id="product-size" value="' + (p.sizes[0] || '') + '"></li>');
      p.sizes.forEach(function (s) {
        $sizeUl.append('<li class="list-inline-item"><span class="btn btn-success btn-size">' + s + '</span></li>');
      });
      $sizeUl.on('click', '.btn-size', function () {
        $('#product-size').val($(this).text());
        $sizeUl.find('.btn-size').removeClass('active');
        $(this).addClass('active');
      });
      $sizeUl.find('.btn-size').first().addClass('active');

      // Available colors text
      $('h6').filter(function () { return $(this).text().trim().startsWith('Avaliable Color'); })
        .next().find('strong').text(p.colors.join(' / '));

      // Make the single-page "Add To Cart" button work with existing handler
      $('button[name="submit"][value="addtocard"]').addClass('btn-add-cart').attr('data-id', p.id);
      $('button[name="submit"][value="buy"]').attr('data-item-id', p.id).attr('data-item-name', p.title);
      $('button[name="submit"][value="addtocard"]').attr('data-item-id', p.id).attr('data-item-name', p.title).attr('data-price', p.price);
      
      // Check if product is already in cart and set button visibility
      if (isProductInCart(p.id)) {
        $('button[name="submit"][value="addtocard"]').hide();
        $('button[name="submit"][value="removefromcart"]').show();
      }
      
      // Set data attributes on product detail container and main image
      $productDetail.prop('dataset').itemId = String(p.id);
      $productDetail.prop('dataset').itemName = (p.title || '').trim();
      
      // Annotate the entire product section
      var $productSection = $productDetail.closest('section');
      if ($productSection.length) {
        annotateProductActions(p, $productSection);
      }
      
      // Push GA4 view_item event
      if (typeof dataLayer !== 'undefined') {
        dataLayer.push({
          event: 'view_item',
          ecommerce: {
            items: [{
              item_id: String(p.id),
              item_name: p.title || '',
              price: p.price,
              quantity: 1
            }]
          }
        });
      }

    })
    .catch(function (err) {
      console.error('Failed to load products.json', err);
      $('.container.pb-5').html('<div class="alert alert-danger">Failed to load product data.</div>');
    });
});

// Render related products on single product page
$(function () {
  var $carouselContainer = $('#carousel-related-product');
  if (!$carouselContainer.length) return;

  var params = new URLSearchParams(window.location.search);
  var currentId = parseInt(params.get('id'), 10);
  if (!currentId) return;

  fetch('./data/products.json')
    .then(function (res) { return res.json(); })
    .then(function (products) {
      // Get related products: all products except current one
      var relatedProducts = products.filter(function (p) { return p.id !== currentId; });
      
      var html = '';
      relatedProducts.forEach(function (p) {
        html += '<div class="p-2 pb-3">';
        html += '  <div class="product-wap card rounded-0" data-item-id="' + p.id + '" data-item-name="' + (p.title && p.title.replace(/"/g, '&quot;')) + '">';
        html += '    <div class="card rounded-0">';
        html += '      <a href="shop-single.html?id=' + p.id + '" data-item-id="' + p.id + '" data-item-name="' + (p.title && p.title.replace(/"/g, '&quot;')) + '"><img class="card-img rounded-0 img-fluid" src="' + p.image + '" alt="' + p.title + '"></a>';
        html += '      <div class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">';
        html += '        <ul class="list-unstyled">';
        html += '          <li><a class="btn btn-success text-white" href="shop-single.html" data-item-id="' + p.id + '" data-item-name="' + (p.title && p.title.replace(/"/g, '&quot;')) + '"><i class="far fa-heart"></i></a></li>';
        html += '          <li><a class="btn btn-success text-white mt-2" href="shop-single.html?id=' + p.id + '" data-item-id="' + p.id + '" data-item-name="' + (p.title && p.title.replace(/"/g, '&quot;')) + '"><i class="far fa-eye"></i></a></li>';
        html += '          <li><a class="btn btn-success text-white mt-2" href="shop-single.html" data-item-id="' + p.id + '" data-item-name="' + (p.title && p.title.replace(/"/g, '&quot;')) + '"><i class="fas fa-cart-plus"></i></a></li>';
        html += '        </ul>';
        html += '      </div>';
        html += '    </div>';
        html += '    <div class="card-body">';
        html += '      <a href="shop-single.html?id=' + p.id + '" class="h3 text-decoration-none" data-item-id="' + p.id + '" data-item-name="' + (p.title && p.title.replace(/"/g, '&quot;')) + '">' + p.title + '</a>';
        html += '      <ul class="w-100 list-unstyled d-flex justify-content-between mb-0">';
        html += '        <li>' + p.sizes.join('/') + '</li>';
        html += '        <li class="pt-2">';
        p.colors.forEach(function(c){
          html += '<span class="product-color-dot color-dot-' + c + ' float-left rounded-circle ml-1"></span>';
        });
        html += '        </li>';
        html += '      </ul>';
        html += '      <ul class="list-unstyled d-flex justify-content-center mb-1"><li>';
        for (var i = 0; i < 5; i++) {
          html += i < p.rating ? '<i class="text-warning fa fa-star"></i>' : '<i class="text-muted fa fa-star"></i>';
        }
        html += '</li></ul>';
        html += '      <p class="text-center mb-0">$' + p.price + '</p>';
        html += '    </div>';
        html += '  </div>';
        html += '</div>';
      });
      
      $carouselContainer.html(html);
      
      // Annotate all related products using safe DOM dataset
      relatedProducts.forEach(function (p) {
        var $productCard = $carouselContainer.find('[data-item-id="' + p.id + '"]').first();
        if ($productCard.length) {
          annotateProductActions(p, $productCard);
        }
      });
      
      // Re-initialize Slick carousel
      if ($.fn.slick) {
        try {
          $('#carousel-related-product').slick('unslick');
        } catch(e) {}
        
        $('#carousel-related-product').slick({
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
    })
    .catch(function (err) {
      console.error('Failed to load related products', err);
      $carouselContainer.html('<div class="p-2 pb-3 text-center">Failed to load related products.</div>');
    });
});