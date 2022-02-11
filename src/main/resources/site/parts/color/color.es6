const portal = require('/lib/xp/portal');
const React4xp = require('/lib/enonic/react4xp');

exports.get = function (request) {

    const component = portal.getComponent();

    const props = {color: component.config.color};

    return React4xp.render(
        "site/parts/color/color",
        props,
        request,
        {
            clientRender: false,
            pageContributions: {
                bodyEnd: `<script>console.log("The color of the thing is: ${component.config.color}");</script>`
            }
        });
};
