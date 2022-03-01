/** Simple page controller, as an example of how to render an XP page with Regions, using only server-side React.
 *
 *  NOTE:   Parts and layouts rendered with react4xp DO NOT need a page controller like this to work. Putting react4xp-
 *          rendered XP components inside regions in a thymeleaf-rendered page controller (or hardcoded, etc) is
 *          perfectly fine. This is just a demo of how to do it if you need to make the page controller in react4xp.
 */

const libs = {
  portal: require('/lib/xp/portal'),
  react4xp: require('/lib/enonic/react4xp')
};

exports.get = (request) => {
  const content = libs.portal.getContent();
  const entry = libs.portal.getComponent();

  const id = `react4xp_${content._id}`;

  const props = {
    regionsData: content.page.regions,
    names: 'main',
    tag: 'main'
  };

  // criticalCss is added by the processor add-general-nonces, as this need a nonce to work with the CSP
  const mainCss = libs.portal.assetUrl({ path: 'css/main.rest.css' });

  // Hash to CSP 'sha256-PgYV+wbDCgJYbGcKuv1bxTzJrFaVWEez53gYTSzKLmA='
  // - if code inside script changes (also changed spacing will affect this), add new hash to CSP
  const loadDeferredStylesScript = `
    <script>
      function loadDeferredStyles() {
        var addStylesNode = document.getElementById("deferred-styles");
        var replacement = document.createElement("div");
        replacement.innerHTML = addStylesNode.textContent;

        var nodeToInsertAfter = document.getElementById('critical-style')
        // Need to make sure it is inserted after critical-style which should be added first, 
        // but still before the React style.
        nodeToInsertAfter.parentNode.insertBefore(replacement, nodeToInsertAfter.nextSibling);

        addStylesNode.parentElement.removeChild(addStylesNode);
      }

      var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

      if (raf) raf(function () {
        window.setTimeout(loadDeferredStyles, 0);
      });
      else window.addEventListener('load', loadDeferredStyles);
  </script>`;

  const output = libs.react4xp.render(
    entry,
    props,
    {
      ...request,
      mode: 'live' // With this edit mode might behave strange for some components. Make sure to test properly.
    },
    {
      id,
      body: `
        <html>
          <head>
            <meta charset="UTF-8" />
            <title>${content.displayName}</title>
            <noscript id="deferred-styles">
              <link data-critical="true" rel="stylesheet" type="text/css" media="all" href="${mainCss}"/>
            </noscript>
          </head>
          <body class="xp-page">
            <div id="${id}"></div>
            ${loadDeferredStylesScript}
          </body>
        </html>
        `
    }
  );

  // The unclosed !DOCTYPE tag is not XML-compliant, and causes an error if used in the body parameter of React4xp.render.options above.
  // Therefore, added here:
  output.body = `<!DOCTYPE html>${output.body}`;

  return output;
};
