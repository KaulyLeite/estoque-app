import {StyleSheet} from 'react-native';

const veryLightGray = '#d8d8d8';

export const authStyles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        width: '80%',
    },
    container: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'flex-start',
        padding: 16,
        paddingTop: '35%',
    },
    input: {
        backgroundColor: 'white',
        borderColor: 'gray',
        borderWidth: 1,
        color: 'black',
        fontSize: 16,
        height: 40,
        marginVertical: 15,
        paddingLeft: 10,
        paddingRight: 10,
        width: '80%',
    },
    leftButton: {
        alignItems: 'center',
        backgroundColor: veryLightGray,
        borderRadius: 5,
        marginTop: 15,
        padding: 10,
        width: '48%',
    },
    linearGradient: {
        borderRadius: 5,
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
    },
    lowContainer: {
        paddingTop: '16%',
    },
    rightButton: {
        alignItems: 'center',
        backgroundColor: 'gray',
        borderRadius: 5,
        marginTop: 15,
        padding: 10,
        width: '48%',
    },
    textLeftButton: {
        color: 'black',
        fontSize: 16,
    },
    textRightButton: {
        color: 'white',
        fontSize: 16,
    },
    title: {
        color: 'black',
        fontSize: 20,
        marginBottom: 15,
    },
});
