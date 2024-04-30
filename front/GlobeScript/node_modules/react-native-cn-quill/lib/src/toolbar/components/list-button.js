import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useToolbar } from './toolbar-context';
export const ListButton = ({ name, items }) => {
    const { theme, show, hide, open, selectionName, getSelected, styles, } = useToolbar();
    const defaultStyles = makeStyles(theme);
    const toolStyle = styles?.toolbar?.toolset?.listButton?.tool
        ? styles.toolbar?.toolset?.listButton.tool(defaultStyles.tool)
        : defaultStyles.tool;
    const overlayStyle = styles?.toolbar?.toolset?.listButton?.overlay
        ? styles.toolbar?.toolset?.listButton.overlay(defaultStyles.overlay)
        : defaultStyles.overlay;
    const textStyle = styles?.toolbar?.toolset?.listButton?.text
        ? styles.toolbar?.toolset?.listButton.text(defaultStyles.text)
        : defaultStyles.text;
    const imageStyle = styles?.toolbar?.toolset?.listButton?.image
        ? styles.toolbar?.toolset?.listButton.image(defaultStyles.image)
        : defaultStyles.image;
    const showMenu = () => {
        if (open && selectionName === name)
            hide();
        else
            show(name, items);
    };
    const selectedValue = getSelected(name);
    const selectedItem = items.find((x) => x.valueOn === selectedValue);
    const isOpen = selectionName === name;
    return (React.createElement(TouchableOpacity, { onPress: showMenu },
        React.createElement(View, { style: toolStyle },
            selectedItem?.source ? (React.createElement(Image, { source: selectedItem.source, style: imageStyle })) : (React.createElement(Text, { style: textStyle }, selectedItem ? selectedItem.name : name)),
            isOpen && React.createElement(View, { style: [overlayStyle] }))));
};
const makeStyles = (theme) => StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: theme.overlay,
        borderRadius: 3,
    },
    tool: {
        borderRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        marginRight: 4,
        marginLeft: 4,
        height: Math.round(theme.size),
    },
    image: {
        height: Math.round(theme.size * 0.6),
        width: Math.round(theme.size * 0.6),
        tintColor: theme.color,
    },
    text: {
        color: theme.color,
        fontWeight: 'bold',
    },
});
