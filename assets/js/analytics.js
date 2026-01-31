(function () {
  'use strict';

  // Exact GA / GTM snippets (kept verbatim)
  var headSnippet = '<!-- Google tag (gtag.js) -->\n' +
    '<script async src="https://www.googletagmanager.com/gtag/js?id=G-Y2P3RZNXLR"></script>\n' +
    '<script>\n' +
    '  window.dataLayer = window.dataLayer || [];\n' +
    '  function gtag(){dataLayer.push(arguments);}\n' +
    "  gtag('js', new Date());\n\n" +
    "  gtag('config', 'G-Y2P3RZNXLR');\n" +
    '</script>\n' +
    '<!-- Google Tag Manager -->\n' +
    '<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({\'gtm.start\':\n' +
    'new Date().getTime(),event:\'gtm.js\'});var f=d.getElementsByTagName(s)[0],\n' +
    "j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=\n" +
    "'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);\n" +
    "})(window,document,'script','dataLayer','GTM-WVFK4S5C');</script>\n" +
    '<!-- End Google Tag Manager -->';

  var bodySnippet = '<!-- Google Tag Manager (noscript) -->\n' +
    '<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WVFK4S5C"\n' +
    'height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>\n' +
    '<!-- End Google Tag Manager (noscript) -->';

  // Avoid duplicate insertion
  function alreadyInserted() {
    return !!document.querySelector('script[src*="gtag/js?id=G-Y2P3RZNXLR"]') ||
      !!document.querySelector('script[src*="gtm.js?id=GTM-WVFK4S5C"]') ||
      !!document.querySelector('noscript iframe[src*="GTM-WVFK4S5C"]') ||
      !!document.querySelector('script[data-analytics-injected="1"]');
  }

  if (!alreadyInserted()) {
    // 1) Ensure gtag external script loads (createElement to guarantee execution)
    if (!document.querySelector('script[src*="gtag/js?id=G-Y2P3RZNXLR"]')) {
      var s1 = document.createElement('script');
      s1.async = true;
      s1.src = 'https://www.googletagmanager.com/gtag/js?id=G-Y2P3RZNXLR';
      document.head.insertBefore(s1, document.head.firstChild);
    }

    // 2) Add inline gtag config (executed immediately)
    var inlineGtag = document.createElement('script');
    inlineGtag.text = "window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-Y2P3RZNXLR');";
    document.head.insertBefore(inlineGtag, document.head.firstChild);

    // 3) Add GTM bootstrap (executes and injects the GTM script)
    var inlineGtm = document.createElement('script');
    inlineGtm.text = "(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-WVFK4S5C');";
    document.head.insertBefore(inlineGtm, document.head.firstChild);

    // Mark injected to avoid duplicates by subsequent loads
    var marker = document.createElement('script');
    marker.setAttribute('data-analytics-injected', '1');
    marker.type = 'text/plain';
    document.head.insertBefore(marker, document.head.firstChild);
  }

  // Insert noscript iframe inside <body> immediately after opening <body>
  function insertNoscript() {
    if (!document.querySelector('noscript iframe[src*="GTM-WVFK4S5C"]')) {
      if (document.body) {
        document.body.insertAdjacentHTML('afterbegin', bodySnippet);
      } else {
        document.addEventListener('DOMContentLoaded', function () {
          document.body.insertAdjacentHTML('afterbegin', bodySnippet);
        });
      }
    }
  }

  insertNoscript();

})();