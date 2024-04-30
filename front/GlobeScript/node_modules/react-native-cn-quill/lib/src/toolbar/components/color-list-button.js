import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, } from 'react-native';
import { useToolbar } from './toolbar-context';
export const ColorListButton = ({ name, items, source }) => {
    const { theme, show, hide, open, selectionName, getSelected, styles, } = useToolbar();
    const defaultStyles = makeStyles(theme);
    const toolStyle = styles?.toolbar?.toolset?.colorListButton?.tool
        ? styles.toolbar?.toolset?.colorListButton.tool(defaultStyles.tool)
        : defaultStyles.tool;
    const overlayStyle = styles?.toolbar?.toolset?.colorListButton?.overlay
        ? styles.toolbar?.toolset?.colorListButton.overlay(defaultStyles.overlay)
        : defaultStyles.overlay;
    const imageStyle = styles?.toolbar?.toolset?.colorListButton?.image
        ? styles.toolbar?.toolset?.colorListButton.image(defaultStyles.image)
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
            React.createElement(Image, { source: source, style: [
                    imageStyle,
                    {
                        tintColor: selectedItem &&
                            selectedItem.valueOn !== false &&
                            typeof selectedItem.valueOn === 'string'
                            ? selectedItem.valueOn
                            : theme.color,
                    },
                ] }),
            isOpen && React.createElement(View, { style: overlayStyle }))));
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
        width: Math.round(theme.size),
    },
    image: {
        height: Math.round(theme.size * 0.6),
        width: Math.round(theme.size * 0.6),
        tintColor: theme.color,
    },
});
