const portal = require('/lib/xp/portal');
const React4xp = require('/lib/enonic/react4xp');


exports.get = function (request) {
    const entry = portal.getComponent();

    const content = portal.getContent();
    const pageConfig = (content.page || {})?.config || {};

    const props = {
        message: pageConfig.greeting,
        messageTarget: pageConfig.greetee,
        droppableThing: pageConfig.things,
        initialCount: pageConfig.startCount
    };

    return React4xp.render(
        entry,
        props,
        request,
        {
            id: "react4xpApp",
            body: `
                    <html>
                        <head></head>
                        <body class="xp-page">
                            <div id="react4xpApp"></div>
                        </body>
                    </html>
                `
            // clientRender: true // nice to have if we get errors, so we get proper SourceMap and so on in the browser
        }
    )
};