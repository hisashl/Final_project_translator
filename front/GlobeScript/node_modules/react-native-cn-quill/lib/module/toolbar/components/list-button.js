import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useToolbar } from './toolbar-context';
export const ListButton = ({
  name,
  items
}) => {
  var _styles$toolbar, _styles$toolbar$tools, _styles$toolbar$tools2, _styles$toolbar2, _styles$toolbar2$tool, _styles$toolbar3, _styles$toolbar3$tool, _styles$toolbar3$tool2, _styles$toolbar4, _styles$toolbar4$tool, _styles$toolbar5, _styles$toolbar5$tool, _styles$toolbar5$tool2, _styles$toolbar6, _styles$toolbar6$tool, _styles$toolbar7, _styles$toolbar7$tool, _styles$toolbar7$tool2, _styles$toolbar8, _styles$toolbar8$tool;

  const {
    theme,
    show,
    hide,
    open,
    selectionName,
    getSelected,
    styles
  } = useToolbar();
  const defaultStyles = makeStyles(theme);
  const toolStyle = styles !== null && styles !== void 0 && (_styles$toolbar = styles.toolbar) !== null && _styles$toolbar !== void 0 && (_styles$toolbar$tools = _styles$toolbar.toolset) !== null && _styles$toolbar$tools !== void 0 && (_styles$toolbar$tools2 = _styles$toolbar$tools.listButton) !== null && _styles$toolbar$tools2 !== void 0 && _styles$toolbar$tools2.tool ? (_styles$toolbar2 = styles.toolbar) === null || _styles$toolbar2 === void 0 ? void 0 : (_styles$toolbar2$tool = _styles$toolbar2.toolset) === null || _styles$toolbar2$tool === void 0 ? void 0 : _styles$toolbar2$tool.listButton.tool(defaultStyles.tool) : defaultStyles.tool;
  const overlayStyle = styles !== null && styles !== void 0 && (_styles$toolbar3 = styles.toolbar) !== null && _styles$toolbar3 !== void 0 && (_styles$toolbar3$tool = _styles$toolbar3.toolset) !== null && _styles$toolbar3$tool !== void 0 && (_styles$toolbar3$tool2 = _styles$toolbar3$tool.listButton) !== null && _styles$toolbar3$tool2 !== void 0 && _styles$toolbar3$tool2.overlay ? (_styles$toolbar4 = styles.toolbar) === null || _styles$toolbar4 === void 0 ? void 0 : (_styles$toolbar4$tool = _styles$toolbar4.toolset) === null || _styles$toolbar4$tool === void 0 ? void 0 : _styles$toolbar4$tool.listButton.overlay(defaultStyles.overlay) : defaultStyles.overlay;
  const textStyle = styles !== null && styles !== void 0 && (_styles$toolbar5 = styles.toolbar) !== null && _styles$toolbar5 !== void 0 && (_styles$toolbar5$tool = _styles$toolbar5.toolset) !== null && _styles$toolbar5$tool !== void 0 && (_styles$toolbar5$tool2 = _styles$toolbar5$tool.listButton) !== null && _styles$toolbar5$tool2 !== void 0 && _styles$toolbar5$tool2.text ? (_styles$toolbar6 = styles.toolbar) === null || _styles$toolbar6 === void 0 ? void 0 : (_styles$toolbar6$tool = _styles$toolbar6.toolset) === null || _styles$toolbar6$tool === void 0 ? void 0 : _styles$toolbar6$tool.listButton.text(defaultStyles.text) : defaultStyles.text;
  const imageStyle = styles !== null && styles !== void 0 && (_styles$toolbar7 = styles.toolbar) !== null && _styles$toolbar7 !== void 0 && (_styles$toolbar7$tool = _styles$toolbar7.toolset) !== null && _styles$toolbar7$tool !== void 0 && (_styles$toolbar7$tool2 = _styles$toolbar7$tool.listButton) !== null && _styles$toolbar7$tool2 !== void 0 && _styles$toolbar7$tool2.image ? (_styles$toolbar8 = styles.toolbar) === null || _styles$toolbar8 === void 0 ? void 0 : (_styles$toolbar8$tool = _styles$toolbar8.toolset) === null || _styles$toolbar8$tool === void 0 ? void 0 : _styles$toolbar8$tool.listButton.image(defaultStyles.image) : defaultStyles.image;

  const showMenu = () => {
    if (open && selectionName === name) hide();else show(name, items);
  };

  const selectedValue = getSelected(name);
  const selectedItem = items.find(x => x.valueOn === selectedValue);
  const isOpen = selectionName === name;
  return /*#__PURE__*/React.createElement(TouchableOpacity, {
    onPress: showMenu
  }, /*#__PURE__*/React.createElement(View, {
    style: toolStyle
  }, selectedItem !== null && selectedItem !== void 0 && selectedItem.source ? /*#__PURE__*/React.createElement(Image, {
    source: selectedItem.source,
    style: imageStyle
  }) : /*#__PURE__*/React.createElement(Text, {
    style: textStyle
  }, selectedItem ? selectedItem.name : name), isOpen && /*#__PURE__*/React.createElement(View, {
    style: [overlayStyle]
  })));
};

const makeStyles = theme => StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.overlay,
    borderRadius: 3
  },
  tool: {
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
    marginRight: 4,
    marginLeft: 4,
    height: Math.round(theme.size)
  },
  image: {
    height: Math.round(theme.size * 0.6),
    width: Math.round(theme.size * 0.6),
    tintColor: theme.color
  },
  text: {
    color: theme.color,
    fontWeight: 'bold'
  }
});
//# sourceMappingURL=list-button.js.map