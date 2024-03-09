import React, {useEffect, useMemo, useState} from 'react';
import {Alert, BackHandler, FlatList, Text, TouchableOpacity, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AppBar from './AppBar';
import mainStyles from './static/styles/styles_main';

const Main = () => {
    const [products, setProducts] = useState([]);
    const navigation = useNavigation();
    const appBar = useMemo(() => <AppBar/>, []);

    useEffect(() => {
        navigation.setOptions({
            title: 'Estoque App',
            headerLeft: () => appBar,
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
                    'Erro ao obter os produtos do AsyncStorage:',
                    error
                );
            }
        };

        getProducts().then((products) => products);
    }, [navigation]);

    const navigateAsync = async (screen, params) => {
        return new Promise((resolve) => {
            navigation.navigate(screen, params, resolve);
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
            console.error('Erro ao excluir produto:', error);
            throw error;
        }
    };

    const confirmDeletion = (productId) => {
        Alert.alert(
            'Excluir Produto',
            'Tem certeza que deseja excluir este produto do estoque?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Confirmar',
                    onPress: () => {
                        deleteProduct(productId)
                            .then(() => {
                                Toast.show({
                                    type: 'success',
                                    text1: 'Produto excluído com sucesso!',
                                    position: 'bottom',
                                });
                            })
                            .catch((error) => {
                                console.error('Erro ao excluir o produto:', error);

                                Toast.show({
                                    type: 'error',
                                    text1: 'Erro ao excluir o produto!',
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
                <Text style={mainStyles.itemText}>{`Nome: ${item.name}`}</Text>
                <Text style={mainStyles.itemText}>{`Preço: ${item.price}`}</Text>
                <Text style={mainStyles.itemText}>{`Quantidade: ${item.quantity}`}</Text>
                <Text style={mainStyles.itemText}>{`Data de Validade: ${item.expirationDate}`}</Text>
                <Text style={mainStyles.itemText}>{`Descrição: ${item.description}`}</Text>
            </View>
            <View style={mainStyles.buttonContainer}>
                <TouchableOpacity
                    style={[mainStyles.button, mainStyles.editButton]}
                    onPress={() => editProduct(item)}>
                    <Text style={mainStyles.textEditButton}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[mainStyles.button, mainStyles.deleteButton]}
                    onPress={() => confirmDeletion(item.id)}>
                    <Text style={mainStyles.textDeleteButton}>Excluir</Text>
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
                        color='white'
                        style={mainStyles.buttonIcon}>
                    </Icon>
                    <Text style={mainStyles.textRegisterButton}>Registrar Novo Produto</Text>
                </TouchableOpacity>
            </View>
            <Text style={mainStyles.title}>Produtos do Estoque:</Text>
            {products.length === 0 ? (
                <Text style={mainStyles.itemText}>Não há produtos registrados.</Text>
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
