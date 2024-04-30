import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
export const Loading = ({ text }) => {
    return (React.createElement(View, { style: styles.container },
        React.createElement(Text, null, text)));
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
