import React, {useEffect, useMemo, useState} from 'react';
import {Alert, BackHandler, FlatList, Text, TouchableOpacity, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {getLocales} from 'expo-localization';
import AppBar from './AppBar';
import AppExit from './AppExit';
import mainStyles from './static/styles/styles_main';
import {strings} from './static/strings/strings';

const Main = () => {
    const [products, setProducts] = useState([]);
    const navigation = useNavigation();
    const deviceLanguage = getLocales()[0].languageCode;
    const messages = strings[deviceLanguage] || strings.en;
    const appBar = useMemo(() => <AppBar/>, []);
    const appExit = useMemo(() => <AppExit messages={messages}/>, []);

    useEffect(() => {
        navigation.setOptions({
            title: messages.appName,
            headerLeft: () => appBar,
            headerRight: () => appExit,
        });
    }, [navigation, appBar]);

    useEffect(() => {
        const getProducts = async () => {
            try {
                const currentUser = await AsyncStorage.getItem('currentUser');
                const productsJson = await AsyncStorage.getItem(
                    `products_${currentUser}`
                );

                if (productsJson) {
                    setProducts(JSON.parse(productsJson));
                }
            } catch (error) {
                console.error(
                    messages.errorGettingProducts,
                    error
                );
            }
        };

        getProducts().then((products) => products);
    }, [navigation]);

    const navigateAsync = async (screen, params) => {
        return new Promise((resolve) => {
            navigation.navigate(screen, params);
            resolve();
        });
    };

    const navigateToRegisterProduct = async () => {
        await navigateAsync('RegisterProduct', {
            setProducts,
            isEditing: false,
        });
    };

    const editProduct = async (product) => {
        await navigateAsync('RegisterProduct', {
            setProducts,
            product,
            isEditing: true,
        });
    };

    const deleteProduct = async (productId) => {
        try {
            const currentUser = await AsyncStorage.getItem('currentUser');
            const updatedProducts = products.filter(
                (item) => item.id !== productId
            );

            await AsyncStorage.setItem(
                `products_${currentUser}`,
                JSON.stringify(updatedProducts)
            );
            setProducts(updatedProducts);
        } catch (error) {
            console.error(messages.errorDeletingProduct, error);
            throw error;
        }
    };

    const confirmDeletion = (productId) => {
        Alert.alert(
            messages.confirmDeleteTitle,
            messages.confirmDeleteMessage,
            [
                {
                    text: messages.cancelAlertButton,
                    style: 'cancel',
                },
                {
                    text: messages.confirmAlertButton,
                    onPress: () => {
                        deleteProduct(productId)
                            .then(() => {
                                Toast.show({
                                    type: 'success',
                                    text1: messages.deleteSuccess,
                                    position: 'bottom',
                                });
                            })
                            .catch((error) => {
                                console.error(messages.errorDeletingProduct, error);

                                Toast.show({
                                    type: 'error',
                                    text1: messages.deleteError,
                                    position: 'bottom',
                                });
                            });
                    },
                },
            ],
            {cancelable: true}
        );
    };

    const renderSeparator = () => {
        return <View style={mainStyles.separatorLine}/>;
    };

    const renderProductItem = ({item}) => (
        <View style={mainStyles.itemContainer}>
            <View style={mainStyles.renderContainer}>
                <Text style={mainStyles.itemText}>{`${messages.productName}${item.name}`}</Text>
                <Text style={mainStyles.itemText}>{`${messages.productPrice}${item.price}`}</Text>
                <Text style={mainStyles.itemText}>{`${messages.productQuantity}${item.quantity}`}</Text>
                <Text style={mainStyles.itemText}>{`${messages.productExpirationDate}${item.expirationDate}`}</Text>
                <Text style={mainStyles.itemText}>{`${messages.productDescription}${item.description}`}</Text>
            </View>
            <View style={mainStyles.buttonContainer}>
                <TouchableOpacity
                    style={[mainStyles.button, mainStyles.editButton]}
                    onPress={() => editProduct(item)}>
                    <Text style={mainStyles.textEditButton}>{messages.editProductButton}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[mainStyles.button, mainStyles.deleteButton]}
                    onPress={() => confirmDeletion(item.id)}>
                    <Text style={mainStyles.textDeleteButton}>{messages.deleteProductButton}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    useEffect(() => {
        const backAction = () => {
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );
        return () => backHandler.remove();
    }, []);

    return (
        <View style={mainStyles.container}>
            <View style={mainStyles.centralizationContainer}>
                <TouchableOpacity
                    style={mainStyles.registerButton}
                    onPress={navigateToRegisterProduct}>
                    <Icon
                        name='plus-circle'
                        size={20}
                        style={mainStyles.buttonIcon}>
                    </Icon>
                    <Text style={mainStyles.textRegisterButton}>{messages.registerNewProductButton}</Text>
                </TouchableOpacity>
            </View>
            <Text style={mainStyles.title}>{messages.mainTitle}</Text>
            {products.length === 0 ? (
                <Text style={mainStyles.itemText}>{messages.noProducts}</Text>
            ) : (
                <FlatList
                    data={products}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderProductItem}
                    ItemSeparatorComponent={renderSeparator}>
                </FlatList>
            )}
        </View>
    );
};

export default Main;
