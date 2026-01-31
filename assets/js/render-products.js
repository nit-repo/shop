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
        html += '          <li><a class="btn btn-success text-white" href="shop-single.html"><i class="far fa-heart"></i></a></li>';
        html += '          <li><a class="btn btn-success text-white mt-2" href="shop-single.html?id=' + p.id + '"><i class="far fa-eye"></i></a></li>';
        html += '          <li><a class="btn btn-success text-white mt-2" href="shop-single.html"><i class="fas fa-cart-plus"></i></a></li>';
        html += '        </ul>';
        html += '      </div>';
        html += '    </div>';
        html += '    <div class="card-body">';
        html += '      <a href="shop-single.html?id=' + p.id + '" class="h3 text-decoration-none">' + p.title + '</a>';
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
        html += '        <button class="btn btn-success btn-add-cart" data-id="' + p.id + '" data-item-id="' + p.id + '" data-item-name="' + (p.title && p.title.replace(/"/g, '&quot;')) + '">Add to Cart</button>';
        html += '      </div>';
        html += '    </div>';
        html += '  </div>';
        html += '</div>';
      });
      $grid.html(html);
    })
    .catch(function (err) {
      console.error('Failed to load products.json', err);
      $grid.html('<div class="col-12">Failed to load products.</div>');
    });
});

// Simple Add-to-cart handler: increments cart badge if present
$(function () {
  $(document).on('click', '.btn-add-cart', function (e) {
    e.preventDefault();
    var id = $(this).data('id');
    // Find cart badge (nearest element with a badge inside header)
    var $badge = $('.fa-cart-arrow-down').closest('a').find('.badge');
    if (!$badge.length) {
      // try alternate selector
      $badge = $('.nav-icon .badge').first();
    }
    if ($badge.length) {
      var val = parseInt($badge.text()) || 0;
      $badge.text(val + 1);
    } else {
      // fallback: show a temporary toast
      console.log('Added to cart (id=' + id + ')');
      alert('Added to cart');
    }
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

    })
    .catch(function (err) {
      console.error('Failed to load products.json', err);
      $('.container.pb-5').html('<div class="alert alert-danger">Failed to load product data.</div>');
    });
});