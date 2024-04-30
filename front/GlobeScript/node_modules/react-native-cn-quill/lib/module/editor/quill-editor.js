function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import * as React from 'react';
import { WebView } from 'react-native-webview';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { createHtml } from '../utils/editor-utils';
import { Loading } from './loading';
export default class QuillEditor extends React.Component {
  constructor(_props) {
    super(_props);

    _defineProperty(this, "_webview", void 0);

    _defineProperty(this, "_handlers", void 0);

    _defineProperty(this, "_promises", void 0);

    _defineProperty(this, "getInitalHtml", () => {
      var _quill$modules, _quill$modules2, _quill$modules3;

      const {
        initialHtml = '',
        import3rdParties = 'local',
        containerId = 'standalone-container',
        theme = {
          background: 'white',
          color: 'rgb(32, 35, 42)',
          placeholder: 'rgba(0,0,0,0.6)'
        },
        quill = {
          id: 'editor-container',
          placeholder: 'write here!',
          modules: {
            toolbar: false
          },
          theme: 'snow'
        },
        customFonts = [],
        customStyles = [],
        defaultFontFamily = undefined,
        customJS = ''
      } = this.props;
      return createHtml({
        initialHtml,
        autoSize: this.props.autoSize,
        placeholder: quill.placeholder,
        theme: quill.theme ? quill.theme : 'snow',
        toolbar: JSON.stringify((_quill$modules = quill.modules) === null || _quill$modules === void 0 ? void 0 : _quill$modules.toolbar),
        clipboard: (_quill$modules2 = quill.modules) === null || _quill$modules2 === void 0 ? void 0 : _quill$modules2.clipboard,
        keyboard: (_quill$modules3 = quill.modules) === null || _quill$modules3 === void 0 ? void 0 : _quill$modules3.keyboard,
        libraries: import3rdParties,
        editorId: quill.id ? quill.id : 'editor-container',
        defaultFontFamily,
        containerId,
        color: theme.color,
        fonts: customFonts,
        backgroundColor: theme.background,
        placeholderColor: theme.placeholder,
        customStyles,
        customJS
      });
    });

    _defineProperty(this, "post", obj => {
      var _this$_webview$curren;

      const jsonString = JSON.stringify(obj);
      (_this$_webview$curren = this._webview.current) === null || _this$_webview$curren === void 0 ? void 0 : _this$_webview$curren.postMessage(jsonString);
    });

    _defineProperty(this, "toMessage", data => {
      const message = JSON.parse(data);
      return message;
    });

    _defineProperty(this, "onMessage", event => {
      var _this$props$webview;

      const message = this.toMessage(event.nativeEvent.data);
      const {
        autoSize
      } = this.props;
      const response = message.key ? this._promises.find(x => x.key === message.key) : undefined;

      switch (message.type) {
        case 'dimensions-change':
          if (autoSize === true) this.setState({
            height: message.data.height
          });

          this._handlers.filter(x => x.event === message.type).forEach(item => item.handler(message.data));

          break;

        case 'format-change':
        case 'text-change':
        case 'selection-change':
        case 'html-change':
        case 'editor-change':
        case 'blur':
        case 'focus':
          this._handlers.filter(x => x.event === message.type).forEach(item => item.handler(message.data));

          break;

        case 'has-focus':
        case 'get-contents':
        case 'set-contents':
        case 'get-text':
        case 'get-length':
        case 'get-bounds':
        case 'get-selection':
        case 'get-dimensions':
        case 'get-html':
        case 'get-format':
        case 'get-leaf':
        case 'remove-format':
        case 'format-text':
          if (response) {
            response.resolve(message.data);
            this._promises = this._promises.filter(x => x.key !== message.key);
          }

          break;

        default:
          // Allow catching messages using the passed webview props
          if ((_this$props$webview = this.props.webview) !== null && _this$props$webview !== void 0 && _this$props$webview.onMessage) {
            var _this$props$webview2;

            (_this$props$webview2 = this.props.webview) === null || _this$props$webview2 === void 0 ? void 0 : _this$props$webview2.onMessage(event);
          }

      }
    });

    _defineProperty(this, "blur", () => {
      this.post({
        command: 'blur'
      });
    });

    _defineProperty(this, "focus", () => {
      this.post({
        command: 'focus'
      });

      if (Platform.OS === 'android') {
        var _this$_webview$curren2;

        (_this$_webview$curren2 = this._webview.current) === null || _this$_webview$curren2 === void 0 ? void 0 : _this$_webview$curren2.requestFocus();
      }
    });

    _defineProperty(this, "hasFocus", () => {
      return this.postAwait({
        command: 'hasFocus'
      });
    });

    _defineProperty(this, "enable", (enable = true) => {
      this.post({
        command: 'enable',
        value: enable
      });
    });

    _defineProperty(this, "disable", () => {
      this.post({
        command: 'enable',
        value: false
      });
    });

    _defineProperty(this, "update", () => {
      this.post({
        command: 'update'
      });
    });

    _defineProperty(this, "format", (name, value) => {
      this.post({
        command: 'format',
        name,
        value
      });
    });

    _defineProperty(this, "deleteText", (index, length) => {
      this.post({
        command: 'deleteText',
        index,
        length
      });
    });

    _defineProperty(this, "removeFormat", (index, length) => {
      return this.postAwait({
        command: 'removeFormat',
        index,
        length
      });
    });

    _defineProperty(this, "getDimensions", () => {
      return this.postAwait({
        command: 'getDimensions'
      });
    });

    _defineProperty(this, "getContents", (index, length) => {
      return this.postAwait({
        command: 'getContents',
        index,
        length
      });
    });

    _defineProperty(this, "getHtml", () => {
      return this.postAwait({
        command: 'getHtml'
      });
    });

    _defineProperty(this, "getLength", () => {
      return this.postAwait({
        command: 'getLength'
      });
    });

    _defineProperty(this, "getText", (index, length) => {
      return this.postAwait({
        command: 'getText',
        index,
        length
      });
    });

    _defineProperty(this, "getBounds", (index, length) => {
      return this.postAwait({
        command: 'getBounds',
        index,
        length
      });
    });

    _defineProperty(this, "getSelection", (focus = false) => {
      return this.postAwait({
        command: 'getSelection',
        focus
      });
    });

    _defineProperty(this, "setSelection", (index, length, source) => {
      this.post({
        command: 'setSelection',
        index,
        length,
        source
      });
    });

    _defineProperty(this, "insertEmbed", (index, type, value) => {
      this.post({
        command: 'insertEmbed',
        index,
        type,
        value
      });
    });

    _defineProperty(this, "insertText", (index, text, formats) => {
      this.post({
        command: 'insertText',
        index,
        text,
        formats
      });
    });

    _defineProperty(this, "setContents", delta => {
      return this.postAwait({
        command: 'setContents',
        delta
      });
    });

    _defineProperty(this, "setText", text => {
      this.post({
        command: 'setText',
        text
      });
    });

    _defineProperty(this, "setPlaceholder", text => {
      this.post({
        command: 'setPlaceholder',
        text
      });
    });

    _defineProperty(this, "updateContents", delta => {
      this.post({
        command: 'updateContents',
        delta
      });
    });

    _defineProperty(this, "getFormat", (index, length) => {
      return this.postAwait({
        command: 'getFormat',
        index,
        length
      });
    });

    _defineProperty(this, "getLeaf", index => {
      return this.postAwait({
        command: 'getLeaf',
        index
      });
    });

    _defineProperty(this, "formatText", (index, length, formats, source = 'api') => {
      return this.postAwait({
        command: 'formatText',
        index,
        length,
        formats,
        source
      });
    });

    _defineProperty(this, "on", (event, handler) => {
      this._handlers.push({
        event,
        handler
      });
    });

    _defineProperty(this, "off", (event, handler) => {
      const index = this._handlers.findIndex(x => x.event === event && x.handler === handler);

      if (index > -1) {
        this._handlers.splice(index, 1);
      }
    });

    _defineProperty(this, "dangerouslyPasteHTML", (index, html) => {
      this.post({
        command: 'dangerouslyPasteHTML',
        index,
        html
      });
    });

    _defineProperty(this, "renderWebview", (content, style, props = {}) => /*#__PURE__*/React.createElement(WebView, _extends({
      scrollEnabled: false,
      nestedScrollEnabled: true,
      hideKeyboardAccessoryView: true,
      keyboardDisplayRequiresUserAction: false,
      originWhitelist: ['*'],
      style: style,
      onError: syntheticEvent => {
        const {
          nativeEvent
        } = syntheticEvent;
        console.warn('WebView error: ', nativeEvent);
      },
      allowFileAccess: true,
      domStorageEnabled: false,
      automaticallyAdjustContentInsets: true,
      bounces: false,
      dataDetectorTypes: "none"
    }, props, {
      javaScriptEnabled: true,
      source: {
        html: content
      },
      ref: this._webview,
      onMessage: this.onMessage
    })));

    this._webview = /*#__PURE__*/React.createRef();
    this.state = {
      webviewContent: this.getInitalHtml()
    };
    this._handlers = [];
    this._promises = [];
    const {
      onSelectionChange,
      onEditorChange,
      onTextChange,
      onHtmlChange,
      onDimensionsChange,
      onBlur,
      onFocus
    } = this.props;

    if (onSelectionChange) {
      this.on('selection-change', onSelectionChange);
    }

    if (onEditorChange) {
      this.on('editor-change', onEditorChange);
    }

    if (onTextChange) {
      this.on('text-change', onTextChange);
    }

    if (onHtmlChange) {
      this.on('html-change', onHtmlChange);
    }

    if (onDimensionsChange) {
      this.on('dimensions-change', onDimensionsChange);
    }

    if (onBlur) {
      this.on('blur', onBlur);
    }

    if (onFocus) {
      this.on('focus', onFocus);
    }
  }

  getKey() {
    var timestamp = new Date().getUTCMilliseconds();
    return `${timestamp}${Math.random()}`;
  }

  postAwait(data) {
    const key = this.getKey();
    let resolveFn;

    resolveFn = () => {};

    const promise = new Promise(resolve => {
      resolveFn = resolve;
    });
    const resp = {
      key,
      resolve: resolveFn
    };

    this._promises.push(resp);

    this.post({ ...data,
      key
    });
    return promise;
  }

  render() {
    const {
      webviewContent,
      height
    } = this.state;
    const {
      style,
      webview,
      container = false,
      loading = 'Please Wait ...',
      autoSize = false
    } = this.props;

    if (container === false) {
      if (!webviewContent) return /*#__PURE__*/React.createElement(Text, null, "Please wait...");
      return this.renderWebview(webviewContent, style, webview);
    } else {
      const ContainerComponent = container === true ? View : container;
      return /*#__PURE__*/React.createElement(ContainerComponent, {
        style: [style, autoSize && height ? {
          height
        } : {}]
      }, webviewContent ? this.renderWebview(webviewContent, styles.webView, webview) : typeof loading === 'string' ? /*#__PURE__*/React.createElement(Loading, {
        text: loading
      }) : loading);
    }
  }

}
let styles = StyleSheet.create({
  webView: {
    flexGrow: 1,
    borderWidth: 0
  }
});
//# sourceMappingURL=quill-editor.js.map