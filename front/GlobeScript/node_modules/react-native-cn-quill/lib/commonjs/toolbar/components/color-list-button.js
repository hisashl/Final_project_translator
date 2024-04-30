"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ColorListButton = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactNative = require("react-native");

var _toolbarContext = require("./toolbar-context");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ColorListButton = ({
  name,
  items,
  source
}) => {
  var _styles$toolbar, _styles$toolbar$tools, _styles$toolbar$tools2, _styles$toolbar2, _styles$toolbar2$tool, _styles$toolbar3, _styles$toolbar3$tool, _styles$toolbar3$tool2, _styles$toolbar4, _styles$toolbar4$tool, _styles$toolbar5, _styles$toolbar5$tool, _styles$toolbar5$tool2, _styles$toolbar6, _styles$toolbar6$tool;

  const {
    theme,
    show,
    hide,
    open,
    selectionName,
    getSelected,
    styles
  } = (0, _toolbarContext.useToolbar)();
  const defaultStyles = makeStyles(theme);
  const toolStyle = styles !== null && styles !== void 0 && (_styles$toolbar = styles.toolbar) !== null && _styles$toolbar !== void 0 && (_styles$toolbar$tools = _styles$toolbar.toolset) !== null && _styles$toolbar$tools !== void 0 && (_styles$toolbar$tools2 = _styles$toolbar$tools.colorListButton) !== null && _styles$toolbar$tools2 !== void 0 && _styles$toolbar$tools2.tool ? (_styles$toolbar2 = styles.toolbar) === null || _styles$toolbar2 === void 0 ? void 0 : (_styles$toolbar2$tool = _styles$toolbar2.toolset) === null || _styles$toolbar2$tool === void 0 ? void 0 : _styles$toolbar2$tool.colorListButton.tool(defaultStyles.tool) : defaultStyles.tool;
  const overlayStyle = styles !== null && styles !== void 0 && (_styles$toolbar3 = styles.toolbar) !== null && _styles$toolbar3 !== void 0 && (_styles$toolbar3$tool = _styles$toolbar3.toolset) !== null && _styles$toolbar3$tool !== void 0 && (_styles$toolbar3$tool2 = _styles$toolbar3$tool.colorListButton) !== null && _styles$toolbar3$tool2 !== void 0 && _styles$toolbar3$tool2.overlay ? (_styles$toolbar4 = styles.toolbar) === null || _styles$toolbar4 === void 0 ? void 0 : (_styles$toolbar4$tool = _styles$toolbar4.toolset) === null || _styles$toolbar4$tool === void 0 ? void 0 : _styles$toolbar4$tool.colorListButton.overlay(defaultStyles.overlay) : defaultStyles.overlay;
  const imageStyle = styles !== null && styles !== void 0 && (_styles$toolbar5 = styles.toolbar) !== null && _styles$toolbar5 !== void 0 && (_styles$toolbar5$tool = _styles$toolbar5.toolset) !== null && _styles$toolbar5$tool !== void 0 && (_styles$toolbar5$tool2 = _styles$toolbar5$tool.colorListButton) !== null && _styles$toolbar5$tool2 !== void 0 && _styles$toolbar5$tool2.image ? (_styles$toolbar6 = styles.toolbar) === null || _styles$toolbar6 === void 0 ? void 0 : (_styles$toolbar6$tool = _styles$toolbar6.toolset) === null || _styles$toolbar6$tool === void 0 ? void 0 : _styles$toolbar6$tool.colorListButton.image(defaultStyles.image) : defaultStyles.image;

  const showMenu = () => {
    if (open && selectionName === name) hide();else show(name, items);
  };

  const selectedValue = getSelected(name);
  const selectedItem = items.find(x => x.valueOn === selectedValue);
  const isOpen = selectionName === name;
  return /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
    onPress: showMenu
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: toolStyle
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Image, {
    source: source,
    style: [imageStyle, {
      tintColor: selectedItem && selectedItem.valueOn !== false && typeof selectedItem.valueOn === 'string' ? selectedItem.valueOn : theme.color
    }]
  }), isOpen && /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: overlayStyle
  })));
};

exports.ColorListButton = ColorListButton;

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
//# sourceMappingURL=color-list-button.js.map