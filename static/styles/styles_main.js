import {StyleSheet} from 'react-native';

const lightRed = '#ff4d4d';
const veryLightGray = '#d8d8d8';
const veryLightOrange = '#fff3e8';

export default StyleSheet.create({
    button: {
        borderRadius: 5,
        marginLeft: 10,
        padding: 8,
    },
    buttonContainer: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    buttonIcon: {
        color: 'white',
        marginRight: 10,
    },
    centralizationContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        backgroundColor: veryLightOrange,
        flex: 1,
        padding: 16,
    },
    deleteButton: {
        backgroundColor: lightRed,
    },
    editButton: {
        backgroundColor: veryLightGray,
    },
    itemContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2,
    },
    itemText: {
        fontSize: 16,
    },
    registerButton: {
        alignItems: 'center',
        backgroundColor: 'gray',
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 24,
        marginTop: 15,
        padding: 12,
        width: '72%',
    },
    renderContainer: {
        flex: 1,
    },
    separatorLine: {
        backgroundColor: veryLightGray,
        height: 1,
        marginVertical: 10,
        width: '100%',
    },
    textDeleteButton: {
        color: 'white',
        fontSize: 16,
    },
    textEditButton: {
        color: 'black',
        fontSize: 16,
    },
    textRegisterButton: {
        color: 'white',
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    title: {
        fontSize: 18,
        marginBottom: 10,
    },
});
