const libs = {
  portal: require('/lib/xp/portal'),
  react4xp: require('/lib/enonic/react4xp')
};

exports.get = (req) => {
  const component = libs.portal.getComponent();

  return libs.react4xp.render(
    'site/layouts/layout-1-col/layout-1-col',
    {
      regionData: component.regions,
      regionsData: component.regions,
      names: 'layout1'
    },
    {
      ...req,
      mode: 'live' // With this edit mode might behave strange for some components. Make sure to test properly.
    },
    {}
  );
};
