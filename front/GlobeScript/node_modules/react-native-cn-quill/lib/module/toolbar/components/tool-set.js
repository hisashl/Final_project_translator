import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ListButton } from './list-button';
import { ToggleIconButton } from './toggle-icon-button';
import { ColorListButton } from './color-list-button';
import { formatType } from '../../constants/formats';
import { useToolbar } from './toolbar-context';
export const ToolSet = props => {
  var _styles$toolbar, _styles$toolbar$tools, _styles$toolbar2, _styles$toolbar2$tool;

  const {
    tools
  } = props;
  const {
    styles
  } = useToolbar();

  const renderToggle = (index, data) => /*#__PURE__*/React.createElement(ToggleIconButton, {
    key: index,
    name: data.name,
    source: data.source,
    valueOff: data.valueOff,
    valueOn: data.valueOn
  });

  const renderTextList = (index, data) => /*#__PURE__*/React.createElement(ListButton, {
    key: index,
    name: data.name,
    items: data.values
  });

  const renderColorList = (index, data) => /*#__PURE__*/React.createElement(ColorListButton, {
    key: index,
    name: data.name,
    items: data.values,
    source: data.source
  });

  const rootStyle = styles !== null && styles !== void 0 && (_styles$toolbar = styles.toolbar) !== null && _styles$toolbar !== void 0 && (_styles$toolbar$tools = _styles$toolbar.toolset) !== null && _styles$toolbar$tools !== void 0 && _styles$toolbar$tools.root ? (_styles$toolbar2 = styles.toolbar) === null || _styles$toolbar2 === void 0 ? void 0 : (_styles$toolbar2$tool = _styles$toolbar2.toolset) === null || _styles$toolbar2$tool === void 0 ? void 0 : _styles$toolbar2$tool.root(defaultStyles.toolset) : defaultStyles.toolset;
  return /*#__PURE__*/React.createElement(View, {
    style: rootStyle
  }, tools.map((tool, index) => {
    const {
      type
    } = tool;

    if (type === formatType.select) {
      return renderTextList(index, tool);
    } else if (type === formatType.color) {
      return renderColorList(index, tool);
    } else {
      return renderToggle(index, tool);
    }
  }));
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
    marginRight: 1
  }
});
//# sourceMappingURL=tool-set.js.map