import {StyleSheet} from 'react-native';

const veryLightOrange = '#fff3e8';

export default StyleSheet.create({
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
        paddingTop: 25,
    },
    fieldContainer: {
        marginBottom: 16,
        width: '72%',
    },
    input: {
        backgroundColor: 'white',
        borderColor: 'gray',
        borderWidth: 1,
        color: 'black',
        fontSize: 16,
        height: 40,
        paddingLeft: 10,
        paddingRight: 10,
        width: '100%',
    },
    inputContainer: {
        alignItems: 'center',
        width: '100%',
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    saveButton: {
        alignItems: 'center',
        backgroundColor: 'gray',
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
        padding: 12,
        width: '72%',
    },
    textSaveButton: {
        color: 'white',
        textAlign: 'center',
        textTransform: 'uppercase',
    },
});
