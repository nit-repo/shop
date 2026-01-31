/* Cart management with localStorage persistence */
var ShopCart = {
  storageKey: 'shop_cart',

  // Initialize cart from localStorage or create empty
  init: function () {
    if (!this.getCart()) {
      localStorage.setItem(this.storageKey, JSON.stringify({ items: [], total: 0 }));
    }
    this.updateUI();
  },

  // Get cart object
  getCart: function () {
    var cart = localStorage.getItem(this.storageKey);
    return cart ? JSON.parse(cart) : null;
  },

  // Add item to cart
  addItem: function (itemId, itemName, price) {
    var cart = this.getCart() || { items: [], total: 0 };
    var existingItem = cart.items.find(function (i) { return i.id === itemId; });

    if (existingItem) {
      existingItem.qty += 1;
    } else {
      cart.items.push({
        id: itemId,
        name: itemName,
        price: parseFloat(price) || 0,
        qty: 1
      });
    }

    this.saveCart(cart);
    this.updateUI();
  },

  // Remove item from cart
  removeItem: function (itemId) {
    var cart = this.getCart();
    if (!cart) return;

    cart.items = cart.items.filter(function (i) { return i.id !== itemId; });
    this.saveCart(cart);
    this.updateUI();

    // Dispatch event for other scripts to update UI
    if (typeof document !== 'undefined') {
      var event = new CustomEvent('cart-item-removed', { detail: { productId: itemId } });
      document.dispatchEvent(event);
    }
  },

  // Update item quantity
  updateQty: function (itemId, qty) {
    var cart = this.getCart();
    if (!cart) return;

    var item = cart.items.find(function (i) { return i.id === itemId; });
    if (item) {
      item.qty = parseInt(qty) || 0;
      if (item.qty <= 0) {
        this.removeItem(itemId);
      } else {
        this.saveCart(cart);
        this.updateUI();
      }
    }
  },

  // Get cart total
  getTotal: function () {
    var cart = this.getCart();
    if (!cart || !cart.items.length) return 0;

    return cart.items.reduce(function (sum, item) {
      return sum + (item.price * item.qty);
    }, 0);
  },

  // Get item count for badge
  getItemCount: function () {
    var cart = this.getCart();
    if (!cart || !cart.items.length) return 0;
    return cart.items.reduce(function (count, item) {
      return count + item.qty;
    }, 0);
  },

  // Save cart to localStorage
  saveCart: function (cart) {
    cart.total = this.calculateTotal(cart);
    localStorage.setItem(this.storageKey, JSON.stringify(cart));
  },

  // Calculate total
  calculateTotal: function (cart) {
    return cart.items.reduce(function (sum, item) {
      return sum + (item.price * item.qty);
    }, 0);
  },

  // Update UI (badge and modal)
  updateUI: function () {
    var count = this.getItemCount();
    var $badge = $('#cart-badge');
    if ($badge.length) {
      $badge.text(count);
    }
    this.renderCartModal();
  },

  // Render cart modal content
  renderCartModal: function () {
    var cart = this.getCart();
    var $cartBody = $('#cart-items-container');
    if (!$cartBody.length) return;

    if (!cart || cart.items.length === 0) {
      $cartBody.html('<p class="text-center text-muted py-4">Your cart is empty</p>');
      $('#cart-summary').empty();
      $('#checkout-button').prop('disabled', true).addClass('disabled');
      return;
    }

    var self = this;
    var html = '<table class="table table-sm">';
    html += '<thead><tr><th>Product</th><th>Price</th><th>Qty</th><th>Total</th><th></th></tr></thead><tbody>';

    cart.items.forEach(function (item) {
      var itemTotal = (item.price * item.qty).toFixed(2);
      html += '<tr data-item-id="' + item.id + '">';
      html += '<td><strong>' + item.name + '</strong></td>';
      html += '<td>$' + item.price.toFixed(2) + '</td>';
      html += '<td><input type="number" class="form-control cart-qty" value="' + item.qty + '" min="1" data-id="' + item.id + '" style="width:60px;"></td>';
      html += '<td>$' + itemTotal + '</td>';
      html += '<td><button class="btn btn-sm btn-danger remove-item" data-id="' + item.id + '">Remove</button></td>';
      html += '</tr>';
    });

    html += '</tbody></table>';
    $cartBody.html(html);

    // Render summary
    var total = this.getTotal().toFixed(2);
    var tax = (total * 0.1).toFixed(2);
    var subtotal = total;
    var grandTotal = (parseFloat(total) + parseFloat(tax)).toFixed(2);

    var $cartSummary = $('#cart-summary');
    if ($cartSummary.length) {
      var summaryHtml = '';
      summaryHtml += '<div class="row mt-3"><div class="col-12"><hr></div></div>';
      summaryHtml += '<div class="row"><div class="col-8 text-right"><strong>Subtotal:</strong></div><div class="col-4">$' + subtotal + '</div></div>';
      summaryHtml += '<div class="row"><div class="col-8 text-right"><strong>Tax (10%):</strong></div><div class="col-4">$' + tax + '</div></div>';
      summaryHtml += '<div class="row mt-2"><div class="col-8 text-right"><strong>Total:</strong></div><div class="col-4"><strong>$' + grandTotal + '</strong></div></div>';
      $cartSummary.html(summaryHtml);
    }

    $('#checkout-button').prop('disabled', false).removeClass('disabled');

    // Attach event handlers
    $cartBody.off('change', '.cart-qty').on('change', '.cart-qty', function () {
      var id = parseInt($(this).data('id'));
      var qty = parseInt($(this).val()) || 0;
      self.updateQty(id, qty);
    });

    $cartBody.off('click', '.remove-item').on('click', '.remove-item', function (e) {
      e.preventDefault();
      var id = parseInt($(this).data('id'));
      self.removeItem(id);
    });
  },

  // Clear cart
  clear: function () {
    localStorage.setItem(this.storageKey, JSON.stringify({ items: [], total: 0 }));
    this.updateUI();
  }
};

// Initialize on document ready
$(function () {
  ShopCart.init();
});
