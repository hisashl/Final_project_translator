"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ToolbarSeparator = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactNative = require("react-native");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const defaultColor = '#737373';

const ToolbarSeparator = ({
  color
}) => {
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.separator, {
      backgroundColor: color || defaultColor
    }]
  });
};

exports.ToolbarSeparator = ToolbarSeparator;

const styles = _reactNative.StyleSheet.create({
  separator: {
    width: 1,
    marginTop: 4,
    marginBottom: 4
  }
});
//# sourceMappingURL=toolbar-separator.js.map