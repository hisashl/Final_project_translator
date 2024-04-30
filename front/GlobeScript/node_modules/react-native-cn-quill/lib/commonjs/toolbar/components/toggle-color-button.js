"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ToggleColorButton = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactNative = require("react-native");

var _toolbarContext = require("./toolbar-context");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ToggleColorButton = props => {
  var _styles$selection, _styles$selection$col, _styles$selection2, _styles$selection2$co, _styles$selection3, _styles$selection3$co;

  const {
    apply,
    isSelected,
    theme,
    styles
  } = (0, _toolbarContext.useToolbar)();
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
  return /*#__PURE__*/_react.default.createElement(_reactNative.TouchableWithoutFeedback, {
    onPress: handlePresss
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [toolStyle, {
      backgroundColor: valueOn !== false ? valueOn : theme.overlay
    }]
  }, selected && /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: overlayStyle
  }), valueOn === false && /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: noColorStyle
  })));
};

exports.ToggleColorButton = ToggleColorButton;

const makeStyles = theme => _reactNative.StyleSheet.create({
  overlay: { ..._reactNative.StyleSheet.absoluteFillObject,
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