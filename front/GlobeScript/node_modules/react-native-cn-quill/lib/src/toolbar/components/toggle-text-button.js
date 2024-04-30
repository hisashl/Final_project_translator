import React from 'react';
import { TouchableWithoutFeedback, View, Text, StyleSheet } from 'react-native';
import { useToolbar } from './toolbar-context';
export const ToggleTextButton = (props) => {
    const { apply, isSelected, theme, styles } = useToolbar();
    const { name, valueOff, valueOn, valueName } = props;
    const selected = isSelected(name, valueOn);
    const handlePresss = () => apply(name, selected ? valueOff : valueOn);
    const defaultStyles = makeStyles(theme);
    const toolStyle = styles?.selection?.iconToggle?.tool
        ? styles.selection.iconToggle.tool(defaultStyles.tool)
        : defaultStyles.tool;
    const overlayStyle = styles?.selection?.iconToggle?.overlay
        ? styles.selection.iconToggle.overlay(defaultStyles.overlay)
        : defaultStyles.overlay;
    const textStyle = styles?.selection?.iconToggle?.image
        ? styles.selection.iconToggle.image(defaultStyles.text)
        : defaultStyles.text;
    return (React.createElement(TouchableWithoutFeedback, { onPress: handlePresss },
        React.createElement(View, { style: toolStyle },
            React.createElement(Text, { style: textStyle }, valueName),
            selected && React.createElement(View, { style: overlayStyle }))));
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
        paddingHorizontal: 4,
        marginRight: 4,
        marginLeft: 4,
        height: Math.round(theme.size),
    },
    text: {
        color: theme.color,
        fontWeight: 'bold',
    },
});
ToggleTextButton.defaultProps = {
    valueOff: false,
};
