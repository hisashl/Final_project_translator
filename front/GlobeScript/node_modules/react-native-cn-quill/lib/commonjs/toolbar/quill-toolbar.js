"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.QuillToolbar = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

var _toolbarOptions = require("../constants/toolbar-options");

var _themes = require("../constants/themes");

var _toolbarUtils = require("../utils/toolbar-utils");

var _toolbarContext = require("./components/toolbar-context");

var _selectionBar = require("./components/selection-bar");

var _toolSet = require("./components/tool-set");

var _toolbarSeparator = require("./components/toolbar-separator");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const WIDTH = _reactNative.Dimensions.get('window').width;

class QuillToolbar extends _react.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "editor", void 0);

    _defineProperty(this, "prepareIconset", () => {
      const {
        options,
        custom
      } = this.props;
      let toolbarOptions = [];

      if (options === 'full' || options === []) {
        toolbarOptions = _toolbarOptions.fullOptions;
      } else if (options === 'basic') {
        toolbarOptions = _toolbarOptions.basicOptions;
      } else {
        toolbarOptions = options;
      }

      const toolSets = (0, _toolbarUtils.getToolbarData)(toolbarOptions, custom === null || custom === void 0 ? void 0 : custom.icons, this.state.defaultFontFamily);
      this.setState({
        toolSets
      });
    });

    _defineProperty(this, "listenToEditor", () => {
      setTimeout(() => {
        const {
          editor: {
            current
          }
        } = this.props;

        if (current) {
          var _this$editor;

          this.editor = current;
          current.on('format-change', this.onFormatChange);

          if ((_this$editor = this.editor) !== null && _this$editor !== void 0 && _this$editor.props.defaultFontFamily) {
            var _this$editor2;

            this.setState({
              defaultFontFamily: (_this$editor2 = this.editor) === null || _this$editor2 === void 0 ? void 0 : _this$editor2.props.defaultFontFamily
            });
          }
        }
      }, 200);
    });

    _defineProperty(this, "onFormatChange", data => {
      this.setState({
        formats: data.formats
      });
    });

    _defineProperty(this, "format", (name, value) => {
      var _this$editor3;

      (_this$editor3 = this.editor) === null || _this$editor3 === void 0 ? void 0 : _this$editor3.format(name, value);
    });

    _defineProperty(this, "renderToolbar", () => {
      var _styles$toolbar, _styles$toolbar2;

      const {
        styles,
        custom
      } = this.props;
      const {
        toolSets,
        theme,
        formats
      } = this.state;
      const defaultStyles = makeStyles(theme);
      const toolbarStyle = styles !== null && styles !== void 0 && (_styles$toolbar = styles.toolbar) !== null && _styles$toolbar !== void 0 && _styles$toolbar.root ? styles === null || styles === void 0 ? void 0 : (_styles$toolbar2 = styles.toolbar) === null || _styles$toolbar2 === void 0 ? void 0 : _styles$toolbar2.root(defaultStyles.toolbar) : defaultStyles.toolbar;
      return /*#__PURE__*/_react.default.createElement(_toolbarContext.ToolbarProvider, {
        theme: theme,
        format: this.format,
        selectedFormats: formats,
        custom: custom,
        styles: styles
      }, /*#__PURE__*/_react.default.createElement(_selectionBar.SelectionBar, null), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
        style: toolbarStyle
      }, /*#__PURE__*/_react.default.createElement(_reactNative.ScrollView, {
        horizontal: true,
        bounces: false,
        showsHorizontalScrollIndicator: false
      }, toolSets.map((object, index) => {
        return object.length > 0 && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, {
          key: index
        }, /*#__PURE__*/_react.default.createElement(_toolSet.ToolSet, {
          tools: object
        }), toolSets.length > index && /*#__PURE__*/_react.default.createElement(_toolbarSeparator.ToolbarSeparator, {
          color: theme.color
        }));
      }))));
    });

    this.state = {
      toolSets: [],
      formats: {},
      theme: _themes.lightTheme,
      defaultFontFamily: undefined
    };
  }

  componentDidMount() {
    this.listenToEditor();
    this.prepareIconset();
    this.changeTheme();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.options !== this.props.options || prevState.defaultFontFamily !== this.state.defaultFontFamily) {
      this.prepareIconset();
    }

    if (prevProps.theme !== this.props.theme) {
      this.changeTheme();
    }
  }

  changeTheme() {
    let theme = _themes.lightTheme;

    if (this.props.theme === 'dark') {
      theme = _themes.darkTheme;
    } else if (this.props.theme !== 'light') {
      theme = this.props.theme;
    }

    this.setState({
      theme
    });
  }

  render() {
    const {
      container = 'avoiding-view'
    } = this.props;
    if (container === 'avoiding-view') return /*#__PURE__*/_react.default.createElement(_reactNative.KeyboardAvoidingView, {
      onTouchStart: e => e.stopPropagation(),
      behavior: _reactNative.Platform.OS === 'ios' ? 'padding' : 'height'
    }, this.renderToolbar());else if (container === false) return this.renderToolbar();else {
      const ContainerComponent = container;
      return /*#__PURE__*/_react.default.createElement(ContainerComponent, null, this.renderToolbar());
    }
  }

}

exports.QuillToolbar = QuillToolbar;

_defineProperty(QuillToolbar, "defaultProps", {
  theme: 'dark'
});

const makeStyles = theme => _reactNative.StyleSheet.create({
  toolbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: WIDTH,
    padding: 2,
    backgroundColor: theme.background,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    height: theme.size + 8
  }
});
//# sourceMappingURL=quill-toolbar.js.map