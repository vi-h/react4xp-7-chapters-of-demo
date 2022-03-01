import { forceArray } from '../../lib/project-util';
import { getCreatedNonce } from '../../lib/createNonce';
import getCriticalCss from '../../lib/criticalCss';

exports.responseProcessor = (req, res) => {
  const criticalCss = getCriticalCss({ path: 'css/main.critical.css' });

  if (res?.headers?.['content-security-policy']) {
    const nonceVar = getCreatedNonce();
    const csp = [];

    res.headers['content-security-policy'].split(';').forEach((policyElem) => {
      // style-src need updating as it is used by the style tag with criticalCss
      if (policyElem.indexOf('style-src') !== -1) {
        csp.push(`${policyElem} 'nonce-${nonceVar}'`);
        // script-src need updating as it is used by the script tag with React4xp.CLIENT.hydrate function
      } else if (policyElem.indexOf('script-src') !== -1) {
        csp.push(`${policyElem} 'nonce-${nonceVar}'`);
      } else {
        csp.push(policyElem);
      }
    });
    res.headers['content-security-policy'] = csp.join(';');

    const nonceAttribute = `nonce='${nonceVar}'`;

    // Add criticalCss to beginning of headEnd, with the nonceAttribute
    forceArray(res.pageContributions.headEnd)
      .unshift(`
        <style ${nonceAttribute} id="critical-style">
          ${criticalCss}
        </style>`);

    // if the content security policy exists, add the nonce to the expected inline script
    // for React4xp.CLIENT.hydrate-function
    res.pageContributions.bodyEnd = forceArray(res.pageContributions.bodyEnd).map((bodyEndContrib) => {
      if (bodyEndContrib.indexOf('React4xp.CLIENT.hydrate') !== -1) {
        return bodyEndContrib.replace('<script>', `<script ${nonceAttribute}>`);
      }
      return bodyEndContrib;
    });
  } else {
    forceArray(res.pageContributions.headEnd)
      .unshift(`
        <style id="critical-style">
          ${criticalCss}
        </style>`);
  }
  return res;
};
