import React, {useState} from 'react';

import Button from '../shared/Button';
import ColorButtons from '../shared/ColorButtons';
import ActiveColorOval from '../shared/ActiveColorOval';

import './MultiColor.scss';
import '../shared/shared-styles.scss';

import StyledEngineProvider from "@mui/material/StyledEngineProvider";

import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

const MultiColor = (props) => {
    const [selected, setSelected] = useState(0);

    const shiftUp = () => {
        setSelected((selected + 1) % props.colors.length);
    };

    const shiftDown = () => {
        setSelected((props.colors.length + selected - 1) % props.colors.length);
    };

    const selectColorBtn = (i) => {
        setSelected((i) % props.colors.length)
    }

    return props.colors.length ?
        <div className="multi-color">
            <StyledEngineProvider injectFirst>
              <IconButton color="primary" aria-label="upload picture" component="span">
                <PhotoCamera />
              </IconButton>
            </StyledEngineProvider>
            <Button className="my-button" clickFunc={shiftDown}>Previous color</Button>
            <Button className="my-button" clickFunc={shiftUp}>Next color</Button>

            <ActiveColorOval color={props.colors[selected]}/>

            <ColorButtons colors={props.colors}
                          selectedIndex={selected}
                          clickFunc={selectColorBtn}
            />
        </div> :
        <p>Add some color!</p>
}

export default (props) => <MultiColor {...props} />;