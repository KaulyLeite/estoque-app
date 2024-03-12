import React, {useEffect, useMemo, useState} from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';
import {LinearGradient} from 'expo-linear-gradient';
import AppBar from './AppBar';
import Main from './Main';
import {authStyles} from './static/styles/styles_auth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();
    const appBar = useMemo(() => <AppBar/>, []);
    const veryLightOrange = '#ffd6ad';

    useEffect(() => {
        navigation.setOptions({
            title: 'Estoque App',
            headerLeft: () => appBar,
        });
    }, [navigation, appBar]);

    useEffect(() => {
        return navigation.addListener('focus', () => {
            setEmail('');
            setPassword('');
        });
    }, [navigation]);

    const handleLogin = async () => {
        try {
            if (!email || !password) {
                Toast.show({
                    type: 'error',
                    text1: 'E-mail e senhas são obrigatórios!',
                    position: 'bottom',
                });
                return;
            }

            const storedUsersString = await AsyncStorage.getItem('users');

            if (!storedUsersString) {
                Toast.show({
                    type: 'error',
                    text1: 'Nenhum usuário registrado! Registre-se.',
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

            const storedUsers = JSON.parse(storedUsersString);
            const storedPassword = storedUsers[email];

            if (storedPassword && password === storedPassword) {
                await AsyncStorage.setItem('currentUser', email);

                Toast.show({
                    type: 'success',
                    text1: 'Login realizado com sucesso!',
                    position: 'bottom',
                });

                navigation.navigate(Main);
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Login falhou! Verifique suas credenciais.',
                    position: 'bottom',
                });
            }
        } catch (error) {
            console.error('Erro ao salvar dados de login:', error);

            Toast.show({
                type: 'error',
                text1: 'Erro ao realizar o login!',
                position: 'bottom',
            });
        }
    };

    const handleNavigateToSignUp = async () => {
        const signUp = (await import('./SignUp')).default;
        navigation.navigate(signUp);
    };

    return (
        <LinearGradient
            colors={[veryLightOrange, 'white']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={authStyles.linearGradient}>
            <View style={authStyles.container}>
                <Text style={authStyles.title}>Login</Text>
                <TextInput
                    style={authStyles.input}
                    placeholder='E-mail'
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    autoCapitalize='none'>
                </TextInput>
                <TextInput
                    style={authStyles.input}
                    placeholder='Senha'
                    secureTextEntry
                    value={password}
                    onChangeText={(text) => setPassword(text)}>
                </TextInput>
                <View style={authStyles.buttonContainer}>
                    <TouchableOpacity
                        style={authStyles.leftButton}
                        onPress={handleNavigateToSignUp}>
                        <Text style={authStyles.textLeftButton}>Sign Up</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={authStyles.rightButton}
                        onPress={handleLogin}>
                        <Text style={authStyles.textRightButton}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    );
};

export default Login;
