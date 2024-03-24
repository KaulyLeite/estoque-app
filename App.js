import React from 'react';
import Toast from 'react-native-toast-message';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Login from './Login';
import SignUp from './SignUp';
import Main from './Main';
import RegisterProduct from './RegisterProduct';

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='Login'>
                <Stack.Screen name='Login' component={Login}/>
                <Stack.Screen name='SignUp' component={SignUp}/>
                <Stack.Screen name='Main' component={Main}/>
                <Stack.Screen name='RegisterProduct' component={RegisterProduct}/>
            </Stack.Navigator>
            <Toast/>
        </NavigationContainer>
    );
}
