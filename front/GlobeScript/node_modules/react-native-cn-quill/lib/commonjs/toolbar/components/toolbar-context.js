"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useToolbar = exports.withToolbar = exports.ToolbarProvider = exports.ToolbarConsumer = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

var _themes = require("../../constants/themes");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const ToolbarContext = /*#__PURE__*/_react.default.createContext({
  apply: () => {},
  show: () => {},
  hide: () => {},
  selectedFormats: {},
  open: false,
  isSelected: () => false,
  theme: _themes.lightTheme,
  options: [],
  selectionName: '',
  getSelected: () => false
});

const ToolbarConsumer = ToolbarContext.Consumer;
exports.ToolbarConsumer = ToolbarConsumer;

class ToolbarProvider extends _react.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "animatedValue", void 0);

    _defineProperty(this, "show", (name, options) => {
      if (this.state.isAnimating) return;
      const {
        theme
      } = this.props;

      if (theme) {
        this.setState({
          options,
          name,
          isAnimating: true
        }, () => {
          _reactNative.Animated.timing(this.animatedValue, {
            toValue: 2 * theme.size + 14,
            duration: 200,
            easing: _reactNative.Easing.sin,
            useNativeDriver: false
          }).start(() => this.setState({
            open: true,
            isAnimating: false
          }));
        });
      }
    });

    _defineProperty(this, "hide", () => {
      if (this.state.isAnimating) return;
      const {
        theme
      } = this.props;

      if (theme) {
        this.setState({
          isAnimating: true
        }, () => {
          _reactNative.Animated.timing(this.animatedValue, {
            toValue: theme.size + 10,
            duration: 200,
            easing: _reactNative.Easing.linear,
            useNativeDriver: false
          }).start(() => {
            this.setState({
              name: '',
              open: false,
              options: [],
              isAnimating: false
            });
          });
        });
      }
    });

    _defineProperty(this, "isSelected", (name, value = true) => {
      const {
        selectedFormats
      } = this.props;
      const selected = selectedFormats[name];
      return selected ? selected === value : value === false;
    });

    _defineProperty(this, "getSelected", name => {
      const {
        selectedFormats
      } = this.props;
      const selected = selectedFormats[name];
      return selected ? selected : false;
    });

    _defineProperty(this, "apply", (name, value) => {
      var _custom$actions;

      const {
        format,
        custom
      } = this.props;
      if (custom !== null && custom !== void 0 && custom.actions) custom.actions.find(x => x === name);

      if (custom !== null && custom !== void 0 && custom.actions && (custom === null || custom === void 0 ? void 0 : (_custom$actions = custom.actions) === null || _custom$actions === void 0 ? void 0 : _custom$actions.indexOf(name)) > -1) {
        if (custom !== null && custom !== void 0 && custom.handler) custom.handler(name, value);
      } else {
        format(name, value);
      }
    });

    this.state = {
      open: false,
      isAnimating: false,
      options: [],
      name: ''
    };
    this.animatedValue = new _reactNative.Animated.Value(0);
  }

  componentDidMount() {
    const {
      theme
    } = this.props;
    this.animatedValue = new _reactNative.Animated.Value(theme.size + 10);
  }

  render() {
    var _styles$toolbar, _styles$toolbar2;

    const {
      selectedFormats,
      children,
      theme,
      styles
    } = this.props;
    const {
      open,
      options,
      name
    } = this.state;
    const defaultStyles = makeStyles(theme);
    const rootStyle = styles !== null && styles !== void 0 && (_styles$toolbar = styles.toolbar) !== null && _styles$toolbar !== void 0 && _styles$toolbar.provider ? styles === null || styles === void 0 ? void 0 : (_styles$toolbar2 = styles.toolbar) === null || _styles$toolbar2 === void 0 ? void 0 : _styles$toolbar2.provider(defaultStyles.root) : defaultStyles.root;
    return /*#__PURE__*/_react.default.createElement(ToolbarContext.Provider, {
      value: {
        selectedFormats,
        apply: this.apply,
        isSelected: this.isSelected,
        theme,
        open,
        show: this.show,
        hide: this.hide,
        getSelected: this.getSelected,
        selectionName: name,
        options,
        styles
      }
    }, /*#__PURE__*/_react.default.createElement(_reactNative.Animated.View, {
      style: [rootStyle, {
        height: this.animatedValue
      }]
    }, children));
  }

}

exports.ToolbarProvider = ToolbarProvider;

const makeStyles = theme => _reactNative.StyleSheet.create({
  root: {
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: theme.color,
    position: 'relative',
    backgroundColor: theme.background,
    width: '100%'
  }
});

const withToolbar = MyComponent => {
  const WrappedComponent = /*#__PURE__*/_react.default.forwardRef((props, ref) => /*#__PURE__*/_react.default.createElement(ToolbarContext.Consumer, null, context => /*#__PURE__*/_react.default.createElement(MyComponent, _extends({}, props, {
    ref: ref,
    apply: context.apply,
    selectedFormats: context.selectedFormats
  }))));

  return WrappedComponent;
};

exports.withToolbar = withToolbar;

const useToolbar = () => (0, _react.useContext)(ToolbarContext);

exports.useToolbar = useToolbar;
//# sourceMappingURL=toolbar-context.js.map