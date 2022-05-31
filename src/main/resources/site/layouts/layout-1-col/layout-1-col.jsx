/** Wraps Regions from https://www.npmjs.com/package/react4xp-regions */
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import Regions from '@enonic/react-components/Regions';

export default (props) => (
  <div className="layout1">
    <Regions {...props} />
  </div>
);
