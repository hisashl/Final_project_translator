function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component, useContext } from 'react';
import { StyleSheet, Animated, Easing } from 'react-native';
import { lightTheme } from '../../constants/themes';
const ToolbarContext = /*#__PURE__*/React.createContext({
  apply: () => {},
  show: () => {},
  hide: () => {},
  selectedFormats: {},
  open: false,
  isSelected: () => false,
  theme: lightTheme,
  options: [],
  selectionName: '',
  getSelected: () => false
});
export const ToolbarConsumer = ToolbarContext.Consumer;
export class ToolbarProvider extends Component {
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
          Animated.timing(this.animatedValue, {
            toValue: 2 * theme.size + 14,
            duration: 200,
            easing: Easing.sin,
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
          Animated.timing(this.animatedValue, {
            toValue: theme.size + 10,
            duration: 200,
            easing: Easing.linear,
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
    this.animatedValue = new Animated.Value(0);
  }

  componentDidMount() {
    const {
      theme
    } = this.props;
    this.animatedValue = new Animated.Value(theme.size + 10);
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
    return /*#__PURE__*/React.createElement(ToolbarContext.Provider, {
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
    }, /*#__PURE__*/React.createElement(Animated.View, {
      style: [rootStyle, {
        height: this.animatedValue
      }]
    }, children));
  }

}

const makeStyles = theme => StyleSheet.create({
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

export const withToolbar = MyComponent => {
  const WrappedComponent = /*#__PURE__*/React.forwardRef((props, ref) => /*#__PURE__*/React.createElement(ToolbarContext.Consumer, null, context => /*#__PURE__*/React.createElement(MyComponent, _extends({}, props, {
    ref: ref,
    apply: context.apply,
    selectedFormats: context.selectedFormats
  }))));
  return WrappedComponent;
};
export const useToolbar = () => useContext(ToolbarContext);
//# sourceMappingURL=toolbar-context.js.map