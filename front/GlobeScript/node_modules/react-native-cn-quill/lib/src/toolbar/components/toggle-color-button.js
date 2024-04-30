import React from 'react';
import { TouchableWithoutFeedback, View, StyleSheet } from 'react-native';
import { useToolbar } from './toolbar-context';
export const ToggleColorButton = (props) => {
    const { apply, isSelected, theme, styles } = useToolbar();
    const { name, valueOff, valueOn } = props;
    const selected = isSelected(name, valueOn);
    const handlePresss = () => apply(name, selected ? valueOff : valueOn);
    const defaultStyles = makeStyles(theme);
    const toolStyle = styles?.selection?.colorToggle?.tool
        ? styles.selection.colorToggle.tool(defaultStyles.tool)
        : defaultStyles.tool;
    const overlayStyle = styles?.selection?.colorToggle?.overlay
        ? styles.selection.colorToggle.overlay(defaultStyles.overlay)
        : defaultStyles.overlay;
    const noColorStyle = styles?.selection?.colorToggle?.noColor
        ? styles.selection.colorToggle.noColor(defaultStyles.noColor)
        : defaultStyles.noColor;
    return (React.createElement(TouchableWithoutFeedback, { onPress: handlePresss },
        React.createElement(View, { style: [
                toolStyle,
                {
                    backgroundColor: valueOn !== false ? valueOn : theme.overlay,
                },
            ] },
            selected && React.createElement(View, { style: overlayStyle }),
            valueOn === false && React.createElement(View, { style: noColorStyle }))));
};
const makeStyles = (theme) => StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: theme.color,
    },
    tool: {
        borderRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 4,
        marginLeft: 4,
        height: Math.round(theme.size - 2),
        width: Math.round(theme.size - 2),
    },
    noColor: {
        borderTopWidth: 1,
        backgroundColor: theme.overlay,
        borderColor: theme.color,
        width: '100%',
        transform: [{ rotate: '45deg' }],
    },
});
ToggleColorButton.defaultProps = {
    valueOff: false,
};
