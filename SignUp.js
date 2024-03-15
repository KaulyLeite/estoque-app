import React, {useEffect, useMemo, useState} from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';
import {LinearGradient} from 'expo-linear-gradient';
import {getLocales} from 'expo-localization';
import AppBar from './AppBar';
import Login from './Login';
import {authStyles} from './static/styles/styles_auth';
import {strings} from './static/strings/strings';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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

    const handleSignUp = async () => {
        try {
            if (!email || !password || !confirmPassword) {
                Toast.show({
                    type: 'error',
                    text1: messages.requiredFields,
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

            if (password !== confirmPassword) {
                Toast.show({
                    type: 'error',
                    text1: messages.passwordsDoNotMatch,
                    position: 'bottom',
                });
                return;
            }

            const storedUsersString = await AsyncStorage.getItem('users');
            const storedUsers = storedUsersString ? JSON.parse(storedUsersString) : {};

            if (storedUsers[email]) {
                Toast.show({
                    type: 'error',
                    text1: messages.emailAlreadyRegistered,
                    position: 'bottom',
                });
                return;
            }

            storedUsers[email] = password;
            await AsyncStorage.setItem('users', JSON.stringify(storedUsers));

            Toast.show({
                type: 'success',
                text1: messages.registrationSuccess,
                position: 'bottom',
            });

            navigation.navigate(Login);
        } catch (error) {
            console.error(messages.saveRegistrationDataError, error);

            Toast.show({
                type: 'error',
                text1: messages.registrationError,
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
                <Text style={authStyles.title}>{messages.signUpTitle}</Text>
                <TextInput
                    style={authStyles.input}
                    placeholder={messages.emailPlaceholder}
                    onChangeText={(text) => setEmail(text)}
                    autoCapitalize='none'>
                </TextInput>
                <TextInput
                    style={authStyles.input}
                    placeholder={messages.passwordPlaceholder}
                    secureTextEntry
                    onChangeText={(text) => setPassword(text)}>
                </TextInput>
                <TextInput
                    style={authStyles.input}
                    placeholder={messages.confirmPasswordPlaceholder}
                    secureTextEntry
                    onChangeText={(text) => setConfirmPassword(text)}>
                </TextInput>
                <View style={authStyles.buttonContainer}>
                    <TouchableOpacity
                        style={authStyles.leftButton}
                        onPress={handleGoBack}>
                        <Text style={authStyles.textLeftButton}>{messages.backButton}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={authStyles.rightButton}
                        onPress={handleSignUp}>
                        <Text style={authStyles.textRightButton}>{messages.registerButton}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    );
};

export default SignUp;
