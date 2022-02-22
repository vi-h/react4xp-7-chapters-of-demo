const portal = require('/lib/xp/portal');
const React4xp = require('/lib/enonic/react4xp');

exports.get = function (request) {
    const component = portal.getComponent();

    const clientRender = !component.config.SSR

    const colors = (component.config.colors || [])
        .map(c => (c || '').trim())
        .filter(c => !!c);

    const res = React4xp.render(
        "MultiColor",
        { colors },
        { ...request, mode: "live" },
        { clientRender }
    );

    /* if (request.mode === "edit") {
        res.pageContributions.bodyEnd = res.pageContributions.bodyEnd.filter(c => c.indexOf("vendors") !== -1 || c.indexOf("externals") !== -1);
    } */

    log.info(JSON.stringify({ ...res, body: "" }, null, 4));
    return res;
};
