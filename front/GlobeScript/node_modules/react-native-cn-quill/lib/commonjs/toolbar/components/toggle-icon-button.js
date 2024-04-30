"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ToggleIconButton = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactNative = require("react-native");

var _toolbarContext = require("./toolbar-context");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ToggleIconButton = props => {
  var _styles$selection, _styles$selection$ico, _styles$selection2, _styles$selection2$ic, _styles$selection3, _styles$selection3$ic;

  const {
    apply,
    isSelected,
    theme,
    styles
  } = (0, _toolbarContext.useToolbar)();
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
  return /*#__PURE__*/_react.default.createElement(_reactNative.TouchableWithoutFeedback, {
    onPress: handlePresss
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: toolStyle
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Image, {
    source: source,
    style: imageStyle
  }), selected && /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: overlayStyle
  })));
};

exports.ToggleIconButton = ToggleIconButton;

const makeStyles = theme => _reactNative.StyleSheet.create({
  overlay: { ..._reactNative.StyleSheet.absoluteFillObject,
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