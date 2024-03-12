import React, {useEffect, useState} from 'react';
import {LogBox, Text, TextInput, TouchableOpacity, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';
import {TextInputMask} from 'react-native-masked-text';
import registerProductStyles from './static/styles/styles_register_product';

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
                text1: 'Todos os campos são obrigatórios!',
                position: 'bottom',
            });
            return false;
        }

        return validateDate(expirationDate);
    };

    const validateDate = (data) => {
        const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;

        if (!dateRegex.test(data)) {
            Toast.show({
                type: 'error',
                text1: 'Por favor, insira uma data válida!',
                position: 'bottom',
            });
            return false;
        }

        return true;
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
                    price: price,
                    quantity: quantity,
                    expirationDate: expirationDate,
                    description: description,
                };

                const productsJson = await AsyncStorage.getItem(
                    `products_${currentUser}`
                );
                const products = productsJson ? JSON.parse(productsJson) : [];
                const updatedProducts = products.map((item) =>
                    item.id === editedProduct.id ? editedProduct : item
                );

                await AsyncStorage.setItem(
                    `products_${currentUser}`,
                    JSON.stringify(updatedProducts)
                );

                if (route.params?.setProducts) {
                    route.params.setProducts(updatedProducts);
                }

                navigation.goBack();
            } else {
                const product = {
                    id: new Date().getTime(),
                    name: name,
                    price: price,
                    quantity: quantity,
                    expirationDate: expirationDate,
                    description: description,
                };

                const productsJson = await AsyncStorage.getItem(
                    `products_${currentUser}`
                );
                const products = productsJson ? JSON.parse(productsJson) : [];

                products.push(product);

                await AsyncStorage.setItem(
                    `products_${currentUser}`,
                    JSON.stringify(products)
                );

                if (route.params?.setProducts) {
                    route.params.setProducts(products);
                }

                navigation.goBack();
            }
        } catch (error) {
            console.error('Erro ao salvar produto:', error);

            Toast.show({
                type: 'error',
                text1: 'Erro ao salvar o produto!',
                position: 'bottom',
            });
        }
    };

    useEffect(() => {
        navigation.setOptions({
            title: route.params?.isEditing ? 'Editar Produto' : 'Cadastrar Produto',
        });
    }, [navigation, route.params]);

    return (
        <View style={registerProductStyles.container}>
            <View style={registerProductStyles.inputContainer}>
                <View style={registerProductStyles.fieldContainer}>
                    <Text style={registerProductStyles.label}>Nome:</Text>
                    <TextInput
                        style={registerProductStyles.input}
                        placeholder="Nome do produto"
                        value={name}
                        onChangeText={(text) => setName(text)}
                        maxLength={45}>
                    </TextInput>
                </View>
                <View style={registerProductStyles.fieldContainer}>
                    <Text style={registerProductStyles.label}>Preço:</Text>
                    <TextInputMask
                        style={registerProductStyles.input}
                        type={'money'}
                        options={{
                            precision: 2,
                            separator: ',',
                            delimiter: '.',
                            unit: 'R$ ',
                            suffixUnit: '',
                        }}
                        placeholder="R$ 0,00"
                        value={price}
                        onChangeText={(text) => setPrice(text)}
                        maxLength={12}>
                    </TextInputMask>
                </View>
                <View style={registerProductStyles.fieldContainer}>
                    <Text style={registerProductStyles.label}>Quantidade (Unid.):</Text>
                    <TextInput
                        style={registerProductStyles.input}
                        placeholder="Quantidade disponível"
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
                    <Text style={registerProductStyles.label}>Data de Validade:</Text>
                    <TextInputMask
                        style={registerProductStyles.input}
                        type={'datetime'}
                        options={{format: 'DD/MM/YYYY'}}
                        placeholder="DD/MM/YYYY"
                        value={expirationDate}
                        onChangeText={(text) => setExpirationDate(text)}
                        maxLength={10}>
                    </TextInputMask>
                </View>
                <View style={registerProductStyles.fieldContainer}>
                    <Text style={registerProductStyles.label}>Descrição:</Text>
                    <TextInput
                        style={registerProductStyles.input}
                        placeholder="Descrição do produto"
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
                    <Text style={registerProductStyles.textSaveButton}>Salvar Produto</Text>
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
