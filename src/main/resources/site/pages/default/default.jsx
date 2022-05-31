/** Wraps Regions from https://www.npmjs.com/package/react4xp-regions */
import React from 'react';
import Regions from '@enonic/react-components/Regions';
import Header from '../../../react4xp/myEntries/Header';

export default (props) => (
    <div className="default-page">
        <Header />
        <Regions {...props} />
    </div>
);
