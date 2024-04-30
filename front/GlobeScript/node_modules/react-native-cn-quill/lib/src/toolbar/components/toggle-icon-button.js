import React from 'react';
import { TouchableWithoutFeedback, View, Image, StyleSheet, } from 'react-native';
import { useToolbar } from './toolbar-context';
export const ToggleIconButton = (props) => {
    const { apply, isSelected, theme, styles } = useToolbar();
    const { name, valueOff, valueOn, source } = props;
    const selected = isSelected(name, valueOn);
    const handlePresss = () => apply(name, selected ? valueOff : valueOn);
    const defaultStyles = makeStyles(theme);
    const toolStyle = styles?.selection?.iconToggle?.tool
        ? styles.selection.iconToggle.tool(defaultStyles.tool)
        : defaultStyles.tool;
    const overlayStyle = styles?.selection?.iconToggle?.overlay
        ? styles.selection.iconToggle.overlay(defaultStyles.overlay)
        : defaultStyles.overlay;
    const imageStyle = styles?.selection?.iconToggle?.image
        ? styles.selection.iconToggle.image(defaultStyles.image)
        : defaultStyles.image;
    return (React.createElement(TouchableWithoutFeedback, { onPress: handlePresss },
        React.createElement(View, { style: toolStyle },
            React.createElement(Image, { source: source, style: imageStyle }),
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
ToggleIconButton.defaultProps = {
    valueOff: false,
};
