import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ListButton } from './list-button';
import { ToggleIconButton } from './toggle-icon-button';
import { ColorListButton } from './color-list-button';
import { formatType } from '../../constants/formats';
import { useToolbar } from './toolbar-context';
export const ToolSet = (props) => {
    const { tools } = props;
    const { styles } = useToolbar();
    const renderToggle = (index, data) => (React.createElement(ToggleIconButton, { key: index, name: data.name, source: data.source, valueOff: data.valueOff, valueOn: data.valueOn }));
    const renderTextList = (index, data) => (React.createElement(ListButton, { key: index, name: data.name, items: data.values }));
    const renderColorList = (index, data) => (React.createElement(ColorListButton, { key: index, name: data.name, items: data.values, source: data.source }));
    const rootStyle = styles?.toolbar?.toolset?.root
        ? styles.toolbar?.toolset?.root(defaultStyles.toolset)
        : defaultStyles.toolset;
    return (React.createElement(View, { style: rootStyle }, tools.map((tool, index) => {
        const { type } = tool;
        if (type === formatType.select) {
            return renderTextList(index, tool);
        }
        else if (type === formatType.color) {
            return renderColorList(index, tool);
        }
        else {
            return renderToggle(index, tool);
        }
    })));
};
const defaultStyles = StyleSheet.create({
    toolset: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingTop: 2,
        paddingBottom: 2,
        paddingLeft: 3,
        paddingRight: 3,
        marginRight: 1,
    },
});
