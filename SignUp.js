import React, {useEffect, useMemo, useState} from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';
import {LinearGradient} from 'expo-linear-gradient';
import AppBar from './AppBar';
import Login from './Login';
import {authStyles} from './static/styles/styles_auth';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigation = useNavigation();
    const appBar = useMemo(() => <AppBar/>, []);
    const veryLightOrange = '#ffd6ad';

    useEffect(() => {
        navigation.setOptions({
            title: 'Estoque App',
            headerLeft: () => appBar,
        });
    }, [navigation, appBar]);

    const handleSignUp = async () => {
        try {
            if (!email || !password || !confirmPassword) {
                Toast.show({
                    type: 'error',
                    text1: 'E-mail e senhas são obrigatórios!',
                    position: 'bottom',
                });
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email)) {
                Toast.show({
                    type: 'error',
                    text1: 'Por favor, insira um e-mail válido!',
                    position: 'bottom',
                });
                return;
            }

            if (password !== confirmPassword) {
                Toast.show({
                    type: 'error',
                    text1: 'As senhas não coincidem! Tente novamente.',
                    position: 'bottom',
                });
                return;
            }

            const storedUsersString = await AsyncStorage.getItem('users');
            const storedUsers = storedUsersString ? JSON.parse(storedUsersString) : {};

            if (storedUsers[email]) {
                Toast.show({
                    type: 'error',
                    text1: 'E-mail já registrado! Escolha outro.',
                    position: 'bottom',
                });
                return;
            }

            storedUsers[email] = password;
            await AsyncStorage.setItem('users', JSON.stringify(storedUsers));

            Toast.show({
                type: 'success',
                text1: 'Registro realizado com sucesso!',
                position: 'bottom',
            });

            navigation.navigate(Login);
        } catch (error) {
            console.error('Erro ao salvar dados de registro:', error);

            Toast.show({
                type: 'error',
                text1: 'Erro ao realizar o registro!',
                position: 'bottom',
            });
        }
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    return (
        <LinearGradient
            colors={[veryLightOrange, 'white']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={authStyles.linearGradient}>
            <View style={[authStyles.container, authStyles.lowContainer]}>
                <Text style={authStyles.title}>Sign Up</Text>
                <TextInput
                    style={authStyles.input}
                    placeholder='E-mail'
                    onChangeText={(text) => setEmail(text)}
                    autoCapitalize='none'>
                </TextInput>
                <TextInput
                    style={authStyles.input}
                    placeholder='Senha'
                    secureTextEntry
                    onChangeText={(text) => setPassword(text)}>
                </TextInput>
                <TextInput
                    style={authStyles.input}
                    placeholder='Confirme a senha'
                    secureTextEntry
                    onChangeText={(text) => setConfirmPassword(text)}>
                </TextInput>
                <View style={authStyles.buttonContainer}>
                    <TouchableOpacity
                        style={authStyles.leftButton}
                        onPress={handleGoBack}>
                        <Text style={authStyles.textLeftButton}>Voltar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={authStyles.rightButton}
                        onPress={handleSignUp}>
                        <Text style={authStyles.textRightButton}>Registrar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    );
};

export default SignUp;
