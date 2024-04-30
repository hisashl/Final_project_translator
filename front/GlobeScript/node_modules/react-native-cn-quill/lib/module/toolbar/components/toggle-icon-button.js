import React from 'react';
import { TouchableWithoutFeedback, View, Image, StyleSheet } from 'react-native';
import { useToolbar } from './toolbar-context';
export const ToggleIconButton = props => {
  var _styles$selection, _styles$selection$ico, _styles$selection2, _styles$selection2$ic, _styles$selection3, _styles$selection3$ic;

  const {
    apply,
    isSelected,
    theme,
    styles
  } = useToolbar();
  const {
    name,
    valueOff,
    valueOn,
    source
  } = props;
  const selected = isSelected(name, valueOn);

  const handlePresss = () => apply(name, selected ? valueOff : valueOn);

  const defaultStyles = makeStyles(theme);
  const toolStyle = styles !== null && styles !== void 0 && (_styles$selection = styles.selection) !== null && _styles$selection !== void 0 && (_styles$selection$ico = _styles$selection.iconToggle) !== null && _styles$selection$ico !== void 0 && _styles$selection$ico.tool ? styles.selection.iconToggle.tool(defaultStyles.tool) : defaultStyles.tool;
  const overlayStyle = styles !== null && styles !== void 0 && (_styles$selection2 = styles.selection) !== null && _styles$selection2 !== void 0 && (_styles$selection2$ic = _styles$selection2.iconToggle) !== null && _styles$selection2$ic !== void 0 && _styles$selection2$ic.overlay ? styles.selection.iconToggle.overlay(defaultStyles.overlay) : defaultStyles.overlay;
  const imageStyle = styles !== null && styles !== void 0 && (_styles$selection3 = styles.selection) !== null && _styles$selection3 !== void 0 && (_styles$selection3$ic = _styles$selection3.iconToggle) !== null && _styles$selection3$ic !== void 0 && _styles$selection3$ic.image ? styles.selection.iconToggle.image(defaultStyles.image) : defaultStyles.image;
  return /*#__PURE__*/React.createElement(TouchableWithoutFeedback, {
    onPress: handlePresss
  }, /*#__PURE__*/React.createElement(View, {
    style: toolStyle
  }, /*#__PURE__*/React.createElement(Image, {
    source: source,
    style: imageStyle
  }), selected && /*#__PURE__*/React.createElement(View, {
    style: overlayStyle
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
    height: Math.round(theme.size),
    width: Math.round(theme.size)
  },
  image: {
    height: Math.round(theme.size * 0.6),
    width: Math.round(theme.size * 0.6),
    tintColor: theme.color
  }
});

ToggleIconButton.defaultProps = {
  valueOff: false
};
//# sourceMappingURL=toggle-icon-button.js.map