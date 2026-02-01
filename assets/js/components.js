/**
 * components.js
 * Asynchronously loads shared components (header, footer)
 */
$(function () {
    // Load Header
    const $headerPlaceholder = $('#header-placeholder');
    if ($headerPlaceholder.length) {
        $headerPlaceholder.load('header.html', function () {
            // After header loads, update cart badge
            if (typeof ShopCart !== 'undefined') {
                ShopCart.updateUI();
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
