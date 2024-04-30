"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "QuillToolbar", {
  enumerable: true,
  get: function () {
    return _quillToolbar.QuillToolbar;
  }
});
exports.default = void 0;

var _quillEditor = _interopRequireDefault(require("./editor/quill-editor"));

var _quillToolbar = require("./toolbar/quill-toolbar");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = _quillEditor.default;
exports.default = _default;
//# sourceMappingURL=index.js.map