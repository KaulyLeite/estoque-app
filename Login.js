import React, {useEffect, useMemo, useState} from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';
import {LinearGradient} from 'expo-linear-gradient';
import {getLocales} from 'expo-localization';
import AppBar from './AppBar';
import Main from './Main';
import {authStyles} from './static/styles/styles_auth';
import {strings} from './static/strings/strings';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();
    const appBar = useMemo(() => <AppBar/>, []);
    const veryLightOrange = '#ffd6ad';
    const deviceLanguage = getLocales()[0].languageCode;
    const messages = strings[deviceLanguage] || strings.en;

    useEffect(() => {
        navigation.setOptions({
            title: messages.appName,
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
                    text1: messages.requiredFields,
                    position: 'bottom',
                });
                return;
            }

            const storedUsersString = await AsyncStorage.getItem('users');

            if (!storedUsersString) {
                Toast.show({
                    type: 'error',
                    text1: messages.noRegisteredUser,
                    position: 'bottom',
                });
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email)) {
                Toast.show({
                    type: 'error',
                    text1: messages.invalidEmail,
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
                    text1: messages.loginSuccess,
                    position: 'bottom',
                });

                navigation.navigate(Main);
            } else {
                Toast.show({
                    type: 'error',
                    text1: messages.loginFailed,
                    position: 'bottom',
                });
            }
        } catch (error) {
            console.error(messages.saveLoginDataError, error);

            Toast.show({
                type: 'error',
                text1: messages.loginDataError,
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
                <Text style={authStyles.title}>{messages.loginTitle}</Text>
                <TextInput
                    style={authStyles.input}
                    placeholder={messages.emailPlaceholder}
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    autoCapitalize='none'>
                </TextInput>
                <TextInput
                    style={authStyles.input}
                    placeholder={messages.passwordPlaceholder}
                    secureTextEntry
                    value={password}
                    onChangeText={(text) => setPassword(text)}>
                </TextInput>
                <View style={authStyles.buttonContainer}>
                    <TouchableOpacity
                        style={authStyles.leftButton}
                        onPress={handleNavigateToSignUp}>
                        <Text style={authStyles.textLeftButton}>{messages.signUpButton}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={authStyles.rightButton}
                        onPress={handleLogin}>
                        <Text style={authStyles.textRightButton}>{messages.loginButton}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    );
};

export default Login;
