"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ToolSet = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactNative = require("react-native");

var _listButton = require("./list-button");

var _toggleIconButton = require("./toggle-icon-button");

var _colorListButton = require("./color-list-button");

var _formats = require("../../constants/formats");

var _toolbarContext = require("./toolbar-context");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ToolSet = props => {
  var _styles$toolbar, _styles$toolbar$tools, _styles$toolbar2, _styles$toolbar2$tool;

  const {
    tools
  } = props;
  const {
    styles
  } = (0, _toolbarContext.useToolbar)();

  const renderToggle = (index, data) => /*#__PURE__*/_react.default.createElement(_toggleIconButton.ToggleIconButton, {
    key: index,
    name: data.name,
    source: data.source,
    valueOff: data.valueOff,
    valueOn: data.valueOn
  });

  const renderTextList = (index, data) => /*#__PURE__*/_react.default.createElement(_listButton.ListButton, {
    key: index,
    name: data.name,
    items: data.values
  });

  const renderColorList = (index, data) => /*#__PURE__*/_react.default.createElement(_colorListButton.ColorListButton, {
    key: index,
    name: data.name,
    items: data.values,
    source: data.source
  });

  const rootStyle = styles !== null && styles !== void 0 && (_styles$toolbar = styles.toolbar) !== null && _styles$toolbar !== void 0 && (_styles$toolbar$tools = _styles$toolbar.toolset) !== null && _styles$toolbar$tools !== void 0 && _styles$toolbar$tools.root ? (_styles$toolbar2 = styles.toolbar) === null || _styles$toolbar2 === void 0 ? void 0 : (_styles$toolbar2$tool = _styles$toolbar2.toolset) === null || _styles$toolbar2$tool === void 0 ? void 0 : _styles$toolbar2$tool.root(defaultStyles.toolset) : defaultStyles.toolset;
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: rootStyle
  }, tools.map((tool, index) => {
    const {
      type
    } = tool;

    if (type === _formats.formatType.select) {
      return renderTextList(index, tool);
    } else if (type === _formats.formatType.color) {
      return renderColorList(index, tool);
    } else {
      return renderToggle(index, tool);
    }
  }));
};

exports.ToolSet = ToolSet;

const defaultStyles = _reactNative.StyleSheet.create({
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