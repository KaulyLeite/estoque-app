import React from 'react';
import {TouchableOpacity, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const AppExit = () => {
    const navigation = useNavigation();

    const handleExitPress = () => {
        Alert.alert(
            'Log Out',
            'Tem certeza que deseja sair?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Sim',
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
            <Icon name="sign-out" size={30} color="gray"/>
        </TouchableOpacity>
    );
};

export default AppExit;
