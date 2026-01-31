/* Render product grid from ./data/products.json */
$(function () {
  var $grid = $('#product-grid');
  if (!$grid.length) return;

  fetch('./data/products.json')
    .then(function (res) { return res.json(); })
    .then(function (products) {
      var html = '';
      products.forEach(function (p) {
        html += '<div class="col-md-4">';
        html += '  <div class="card mb-4 product-wap rounded-0 h-100">';
        html += '    <div class="card rounded-0">';
        html += '      <a href="shop-single.html?id=' + p.id + '"><img class="card-img rounded-0 img-fluid" src="' + p.image + '" loading="lazy"></a>';
        html += '      <div class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">';
        html += '        <ul class="list-unstyled">';
        html += '          <li><a class="btn btn-success text-white" href="shop-single.html"><i class="far fa-heart"></i></a></li>';
        html += '          <li><a class="btn btn-success text-white mt-2" href="shop-single.html"><i class="far fa-eye"></i></a></li>';
        html += '          <li><a class="btn btn-success text-white mt-2" href="shop-single.html"><i class="fas fa-cart-plus"></i></a></li>';
        html += '        </ul>';
        html += '      </div>';
        html += '    </div>';
        html += '    <div class="card-body">';
        html += '      <a href="shop-single.html" class="h3 text-decoration-none">' + p.title + '</a>';
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
        html += '        <button class="btn btn-success btn-add-cart" data-id="' + p.id + '">Add to Cart</button>';
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

