import React from 'react';
import {Image} from 'react-native';
import IconImage from './static/images/icon.png';

const AppBar = () => (
    <Image
        source={IconImage}
        style={{width: 48, height: 48, marginLeft: 15}}>
    </Image>
);

export default AppBar;
