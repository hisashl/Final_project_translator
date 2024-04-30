function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component } from 'react';
import { View, KeyboardAvoidingView, ScrollView, Dimensions, StyleSheet, Platform } from 'react-native';
import { fullOptions, basicOptions } from '../constants/toolbar-options';
import { lightTheme, darkTheme } from '../constants/themes';
import { getToolbarData } from '../utils/toolbar-utils';
import { ToolbarProvider } from './components/toolbar-context';
import { SelectionBar } from './components/selection-bar';
import { ToolSet } from './components/tool-set';
import { ToolbarSeparator } from './components/toolbar-separator';
const WIDTH = Dimensions.get('window').width;
export class QuillToolbar extends Component {
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
        toolbarOptions = fullOptions;
      } else if (options === 'basic') {
        toolbarOptions = basicOptions;
      } else {
        toolbarOptions = options;
      }

      const toolSets = getToolbarData(toolbarOptions, custom === null || custom === void 0 ? void 0 : custom.icons, this.state.defaultFontFamily);
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
      return /*#__PURE__*/React.createElement(ToolbarProvider, {
        theme: theme,
        format: this.format,
        selectedFormats: formats,
        custom: custom,
        styles: styles
      }, /*#__PURE__*/React.createElement(SelectionBar, null), /*#__PURE__*/React.createElement(View, {
        style: toolbarStyle
      }, /*#__PURE__*/React.createElement(ScrollView, {
        horizontal: true,
        bounces: false,
        showsHorizontalScrollIndicator: false
      }, toolSets.map((object, index) => {
        return object.length > 0 && /*#__PURE__*/React.createElement(React.Fragment, {
          key: index
        }, /*#__PURE__*/React.createElement(ToolSet, {
          tools: object
        }), toolSets.length > index && /*#__PURE__*/React.createElement(ToolbarSeparator, {
          color: theme.color
        }));
      }))));
    });

    this.state = {
      toolSets: [],
      formats: {},
      theme: lightTheme,
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
    let theme = lightTheme;

    if (this.props.theme === 'dark') {
      theme = darkTheme;
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
    if (container === 'avoiding-view') return /*#__PURE__*/React.createElement(KeyboardAvoidingView, {
      onTouchStart: e => e.stopPropagation(),
      behavior: Platform.OS === 'ios' ? 'padding' : 'height'
    }, this.renderToolbar());else if (container === false) return this.renderToolbar();else {
      const ContainerComponent = container;
      return /*#__PURE__*/React.createElement(ContainerComponent, null, this.renderToolbar());
    }
  }

}

_defineProperty(QuillToolbar, "defaultProps", {
  theme: 'dark'
});

const makeStyles = theme => StyleSheet.create({
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