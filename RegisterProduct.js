import React, {useEffect, useState} from 'react';
import {LogBox, Text, TextInput, TouchableOpacity, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';
import {TextInputMask} from 'react-native-masked-text';
import {getLocales} from 'expo-localization';
import registerProductStyles from './static/styles/styles_register_product';
import {strings} from './static/strings/strings';

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
]);

const RegisterProduct = ({route}) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [description, setDescription] = useState('');
    const navigation = useNavigation();
    const deviceLanguage = getLocales()[0].languageCode;
    const messages = strings[deviceLanguage] || strings.en;

    useEffect(() => {
        if (route.params?.product) {
            const {product} = route.params;

            setName(product?.name || '');
            setPrice(product?.price?.toString() || '');
            setQuantity(product?.quantity?.toString() || '');
            setExpirationDate(product?.expirationDate || '');
            setDescription(product?.description || '');
        }
    }, [route.params]);

    const validateFields = () => {
        if (!name || !price || !quantity || !description) {
            Toast.show({
                type: 'error',
                text1: messages.allFieldsRequired,
                position: 'bottom',
            });
            return false;
        }

        if (route.params?.product?.expirationDate === expirationDate) {
            return true;
        }

        return validateDate(expirationDate);
    };

    const validateDate = (data) => {
        const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;

        if (!dateRegex.test(data)) {
            Toast.show({
                type: 'error',
                text1: messages.invalidDateError,
                position: 'bottom',
            });
            return false;
        }

        const [day, month, year] = data.split('/');
        const numericDay = parseInt(day, 10);
        const numericMonth = parseInt(month, 10);
        const numericYear = parseInt(year, 10);

        if (
            numericYear < 2000 ||
            numericYear > 2100 ||
            numericMonth < 1 ||
            numericMonth > 12 ||
            numericDay < 1 ||
            numericDay > 31
        ) {
            Toast.show({
                type: 'error',
                text1: messages.invalidDateError,
                position: 'bottom',
            });
            return false;
        }

        return true;
    };

    const showSuccessMessage = (action) => {
        const successMessage = action === 'edit' ? messages.editProductSuccess : messages.addProductSuccess;
        Toast.show({
            type: 'success',
            text1: successMessage,
            position: 'bottom',
        });
    };

    const saveProduct = async () => {
        try {
            const currentUser = await AsyncStorage.getItem('currentUser');

            if (!validateFields()) {
                return;
            }

            if (route.params?.product) {
                const editedProduct = {
                    id: route.params?.product?.id,
                    name: name,
                    price: price.replace(/\D/g, ''),
                    quantity: quantity,
                    expirationDate: expirationDate.replace(/\D/g, ''),
                    description: description,
                };

                const productsJson = await AsyncStorage.getItem(`products_${currentUser}`);
                const products = productsJson ? JSON.parse(productsJson) : [];
                const updatedProducts = products.map((item) =>
                    item.id === editedProduct.id ? editedProduct : item
                );

                await AsyncStorage.setItem(
                    `products_${currentUser}`,
                    JSON.stringify(updatedProducts)
                );

                showSuccessMessage('edit');

                if (route.params?.setProducts) {
                    route.params.setProducts(updatedProducts);
                }

                navigation.goBack();
            } else {
                const product = {
                    id: new Date().getTime(),
                    name: name,
                    price: price.replace(/\D/g, ''),
                    quantity: quantity,
                    expirationDate: expirationDate.replace(/\D/g, ''),
                    description: description,
                };

                const productsJson = await AsyncStorage.getItem(`products_${currentUser}`);
                const products = productsJson ? JSON.parse(productsJson) : [];

                products.push(product);

                await AsyncStorage.setItem(
                    `products_${currentUser}`,
                    JSON.stringify(products)
                );

                showSuccessMessage('add');

                if (route.params?.setProducts) {
                    route.params.setProducts(products);
                }

                navigation.goBack();
            }
        } catch (error) {
            console.error(messages.errorSavingProduct, error);

            Toast.show({
                type: 'error',
                text1: messages.saveErrorMessage,
                position: 'bottom',
            });
        }
    };

    useEffect(() => {
        navigation.setOptions({
            title: route.params?.isEditing ? messages.editProductTitle : messages.addProductTitle,
        });
    }, [navigation, route.params]);

    return (
        <View style={registerProductStyles.container}>
            <View style={registerProductStyles.inputContainer}>
                <View style={registerProductStyles.fieldContainer}>
                    <Text style={registerProductStyles.label}>{messages.productNameLabel}</Text>
                    <TextInput
                        style={registerProductStyles.input}
                        placeholder={messages.productNamePlaceholder}
                        value={name}
                        onChangeText={(text) => setName(text)}
                        maxLength={45}>
                    </TextInput>
                </View>
                <View style={registerProductStyles.fieldContainer}>
                    <Text style={registerProductStyles.label}>{messages.productPriceLabel}</Text>
                    <TextInputMask
                        style={registerProductStyles.input}
                        type={'money'}
                        options={{
                            precision: 2,
                            separator: messages.productPriceSeparator,
                            delimiter: messages.productPriceDelimiter,
                            unit: messages.productPriceUnit,
                            suffixUnit: '',
                        }}
                        placeholder={messages.productPricePlaceholder}
                        value={price}
                        onChangeText={(text) => setPrice(text)}
                        maxLength={12}>
                    </TextInputMask>
                </View>
                <View style={registerProductStyles.fieldContainer}>
                    <Text style={registerProductStyles.label}>{messages.productQuantityLabel}</Text>
                    <TextInput
                        style={registerProductStyles.input}
                        placeholder={messages.productQuantityPlaceholder}
                        value={quantity}
                        onChangeText={(text) => {
                            const numericValue = text.replace(/\D/g, '') || '';
                            setQuantity(() => numericValue);
                        }}
                        keyboardType="numeric"
                        maxLength={4}>
                    </TextInput>
                </View>
                <View style={registerProductStyles.fieldContainer}>
                    <Text style={registerProductStyles.label}>{messages.productExpirationDateLabel}</Text>
                    <TextInputMask
                        style={registerProductStyles.input}
                        type={'datetime'}
                        options={{format: messages.productExpirationDateFormat}}
                        placeholder={messages.productExpirationDatePlaceholder}
                        value={expirationDate}
                        onChangeText={(text) => setExpirationDate(text)}
                        maxLength={10}>
                    </TextInputMask>
                </View>
                <View style={registerProductStyles.fieldContainer}>
                    <Text style={registerProductStyles.label}>{messages.productDescriptionLabel}</Text>
                    <TextInput
                        style={registerProductStyles.input}
                        placeholder={messages.productDescriptionPlaceholder}
                        value={description}
                        onChangeText={(text) => setDescription(text)}
                        maxLength={45}>
                    </TextInput>
                </View>
            </View>
            <View style={registerProductStyles.centralizationContainer}>
                <TouchableOpacity style={registerProductStyles.saveButton} onPress={saveProduct}>
                    <Icon
                        name="check-circle"
                        size={20}
                        style={registerProductStyles.buttonIcon}>
                    </Icon>
                    <Text style={registerProductStyles.textSaveButton}>{messages.saveProductButton}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

RegisterProduct.propTypes = {
    navigation: PropTypes.shape({
        setOptions: PropTypes.func.isRequired,
        goBack: PropTypes.func.isRequired,
    }).isRequired,
    route: PropTypes.shape({
        params: PropTypes.shape({
            product: PropTypes.object,
            isEditing: PropTypes.bool,
            setProducts: PropTypes.func,
        }),
    }),
};

export default RegisterProduct;
