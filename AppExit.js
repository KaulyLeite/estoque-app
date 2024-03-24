import React from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const AppExit = ({messages}) => {
    const navigation = useNavigation();

    const handleExitPress = () => {
        Alert.alert(
            messages.logOutTitle,
            messages.logOutMessage,
            [
                {
                    text: messages.cancelExitAlertButton,
                    style: 'cancel',
                },
                {
                    text: messages.confirmExitAlertButton,
                    onPress: () => {
                        import('./Login').then((module) => {
                            const login = module.default;
                            navigation.navigate(login);
                        });
                    },
                },
            ],
            {cancelable: true}
        );
    };

    return (
        <TouchableOpacity onPress={handleExitPress} style={{marginRight: 15}}>
            <Icon name='sign-out' size={30} color='gray'/>
        </TouchableOpacity>
    );
};

AppExit.propTypes = {
    messages: PropTypes.shape({
        logOutTitle: PropTypes.string.isRequired,
        logOutMessage: PropTypes.string.isRequired,
        cancelExitAlertButton: PropTypes.string.isRequired,
        confirmExitAlertButton: PropTypes.string.isRequired,
    }).isRequired,
};

export default AppExit;
