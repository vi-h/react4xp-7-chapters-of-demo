/** Simple page controller, as an example of how to render an XP page with Regions, using only server-side React.
 *
 *  NOTE:   Parts and layouts rendered with react4xp DO NOT need a page controller like this to work. Putting react4xp-
 *          rendered XP components inside regions in a thymeleaf-rendered page controller (or hardcoded, etc) is
 *          perfectly fine. This is just a demo of how to do it if you need to make the page controller in react4xp.
 */


import createEmotionServer from '@emotion/server/create-instance';
import ReactDOMServer from 'react-dom/server';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';

const portal = require('/lib/xp/portal');
const React4xp = require('/lib/enonic/react4xp');

import createCache from '@emotion/cache';
const createEmotionCache = () => createCache({ key: 'css' });

import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
  },
});

exports.get = function(request) {
    const content = portal.getContent();
    const entry = portal.getComponent();
    const cache = createEmotionCache();
    const { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(cache);

    const reactHtml = ReactDOMServer.renderToString(
      <CacheProvider value={cache}>
          <ThemeProvider theme={theme}>
              {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
              <CssBaseline />
          </ThemeProvider>
      </CacheProvider>,
    );

    const id = `react4xp_${content._id}`;

    const props = {
        regionsData: content.page.regions,
        names: "main",
        tag: "main",
        cache,
        theme
    };

    const htmlBody = `
                <html>
                    <head>
                        <meta charset="UTF-8" />
                        <title>${content.displayName}</title>
                    </head>
                    <body class="xp-page">
                        <div id="${id}">${reactHtml}</div>
                    </body>
                </html>
            `;

    // Grab the CSS from emotion
    const emotionChunks = extractCriticalToChunks(reactHtml);
    const emotionCss = constructStyleTagsFromChunks(emotionChunks);

    log.info('emotionCss: %s', JSON.stringify(emotionCss, null, 2));

    const output = React4xp.render(
        entry,
        props,
        null,
        {
            id,
            body: htmlBody,
            pageContributions: {
                headEnd: emotionCss
            }
        }
    );


    // The unclosed !DOCTYPE tag is not XML-compliant, and causes an error if used in the body parameter of React4xp.render.options above.
    // Therefore, added here:
    output.body = '<!DOCTYPE html>' + output.body;

    return output;
};
