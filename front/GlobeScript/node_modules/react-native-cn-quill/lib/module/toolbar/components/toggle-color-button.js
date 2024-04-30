import React from 'react';
import { TouchableWithoutFeedback, View, StyleSheet } from 'react-native';
import { useToolbar } from './toolbar-context';
export const ToggleColorButton = props => {
  var _styles$selection, _styles$selection$col, _styles$selection2, _styles$selection2$co, _styles$selection3, _styles$selection3$co;

  const {
    apply,
    isSelected,
    theme,
    styles
  } = useToolbar();
  const {
    name,
    valueOff,
    valueOn
  } = props;
  const selected = isSelected(name, valueOn);

  const handlePresss = () => apply(name, selected ? valueOff : valueOn);

  const defaultStyles = makeStyles(theme);
  const toolStyle = styles !== null && styles !== void 0 && (_styles$selection = styles.selection) !== null && _styles$selection !== void 0 && (_styles$selection$col = _styles$selection.colorToggle) !== null && _styles$selection$col !== void 0 && _styles$selection$col.tool ? styles.selection.colorToggle.tool(defaultStyles.tool) : defaultStyles.tool;
  const overlayStyle = styles !== null && styles !== void 0 && (_styles$selection2 = styles.selection) !== null && _styles$selection2 !== void 0 && (_styles$selection2$co = _styles$selection2.colorToggle) !== null && _styles$selection2$co !== void 0 && _styles$selection2$co.overlay ? styles.selection.colorToggle.overlay(defaultStyles.overlay) : defaultStyles.overlay;
  const noColorStyle = styles !== null && styles !== void 0 && (_styles$selection3 = styles.selection) !== null && _styles$selection3 !== void 0 && (_styles$selection3$co = _styles$selection3.colorToggle) !== null && _styles$selection3$co !== void 0 && _styles$selection3$co.noColor ? styles.selection.colorToggle.noColor(defaultStyles.noColor) : defaultStyles.noColor;
  return /*#__PURE__*/React.createElement(TouchableWithoutFeedback, {
    onPress: handlePresss
  }, /*#__PURE__*/React.createElement(View, {
    style: [toolStyle, {
      backgroundColor: valueOn !== false ? valueOn : theme.overlay
    }]
  }, selected && /*#__PURE__*/React.createElement(View, {
    style: overlayStyle
  }), valueOn === false && /*#__PURE__*/React.createElement(View, {
    style: noColorStyle
  })));
};

const makeStyles = theme => StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: theme.color
  },
  tool: {
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
    marginLeft: 4,
    height: Math.round(theme.size - 2),
    width: Math.round(theme.size - 2)
  },
  noColor: {
    borderTopWidth: 1,
    backgroundColor: theme.overlay,
    borderColor: theme.color,
    width: '100%',
    transform: [{
      rotate: '45deg'
    }]
  }
});

ToggleColorButton.defaultProps = {
  valueOff: false
};
//# sourceMappingURL=toggle-color-button.js.map