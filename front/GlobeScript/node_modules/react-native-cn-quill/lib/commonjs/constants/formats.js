"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formats = exports.formatValueType = exports.formatType = void 0;

var _colors = require("./colors");

let formatType;
exports.formatType = formatType;

(function (formatType) {
  formatType[formatType["toggle"] = 0] = "toggle";
  formatType[formatType["select"] = 1] = "select";
  formatType[formatType["color"] = 2] = "color";
  formatType[formatType["icon"] = 3] = "icon";
})(formatType || (exports.formatType = formatType = {}));

let formatValueType;
exports.formatValueType = formatValueType;

(function (formatValueType) {
  formatValueType[formatValueType["text"] = 0] = "text";
  formatValueType[formatValueType["icon"] = 1] = "icon";
  formatValueType[formatValueType["color"] = 2] = "color";
})(formatValueType || (exports.formatValueType = formatValueType = {}));

const formats = [{
  name: 'background',
  allowCustoms: true,
  type: formatType.color,
  defaults: [{
    name: 'no color',
    value: false,
    type: formatValueType.color
  }, ..._colors.colors.map(c => ({
    name: c,
    value: c,
    type: formatValueType.color
  }))]
}, {
  name: 'color',
  type: formatType.color,
  allowCustoms: true,
  defaults: [{
    name: 'no color',
    value: false,
    type: formatValueType.color
  }, ..._colors.colors.map(c => ({
    name: c,
    value: c,
    type: formatValueType.color
  }))]
}, {
  name: 'bold',
  type: formatType.toggle
}, {
  name: 'italic',
  type: formatType.toggle
}, {
  name: 'underline',
  type: formatType.toggle
}, {
  name: 'header',
  defaults: [{
    name: 'Normal',
    value: false,
    type: formatValueType.text
  }, {
    name: 'H1',
    value: 1,
    type: formatValueType.icon
  }, {
    name: 'H2',
    value: 2,
    type: formatValueType.icon
  }, {
    name: 'H3',
    value: 3,
    type: formatValueType.icon
  }, {
    name: 'H4',
    value: 4,
    type: formatValueType.text
  }, {
    name: 'H5',
    value: 5,
    type: formatValueType.text
  }, {
    name: 'H6',
    value: 6,
    type: formatValueType.text
  }],
  type: formatType.select
}, {
  name: 'align',
  defaults: [{
    name: 'left',
    value: false,
    type: formatValueType.icon
  }, {
    name: 'right',
    value: 'right',
    type: formatValueType.icon
  }, {
    name: 'center',
    value: 'center',
    type: formatValueType.icon
  }, {
    name: 'justify',
    value: 'justify',
    type: formatValueType.icon
  }],
  type: formatType.select
}, {
  name: 'font',
  allowCustoms: true,
  defaults: [{
    name: 'Sans Serif',
    value: false,
    type: formatValueType.text
  }, {
    name: 'Serif',
    value: 'serif',
    type: formatValueType.text
  }, {
    name: 'Monospace',
    value: 'monospace',
    type: formatValueType.text
  }],
  type: formatType.select
}, {
  name: 'code',
  type: formatType.toggle
}, {
  name: 'blockquote',
  type: formatType.toggle
}, {
  name: 'strike',
  type: formatType.toggle
}, {
  name: 'size',
  defaults: [{
    name: 'small',
    value: 'small',
    type: formatValueType.text
  }, {
    name: 'Normal',
    value: false,
    type: formatValueType.text
  }, {
    name: 'large',
    value: 'large',
    type: formatValueType.text
  }, {
    name: 'huge',
    value: 'huge',
    type: formatValueType.text
  }],
  type: formatType.select
}, {
  name: 'script',
  defaults: [{
    name: 'sub',
    value: 'sub',
    type: formatValueType.icon
  }, {
    name: 'super',
    value: 'super',
    type: formatValueType.icon
  }],
  type: formatType.select
}, {
  name: 'list',
  defaults: [{
    name: 'ordered',
    value: 'ordered',
    type: formatValueType.icon
  }, {
    name: 'bullet',
    value: 'bullet',
    type: formatValueType.icon
  }],
  type: formatType.select
}, {
  name: 'indent',
  defaults: [{
    name: '-1',
    value: '-1',
    type: formatValueType.icon
  }, {
    name: '+1',
    value: '+1',
    type: formatValueType.icon
  }],
  type: formatType.select
}, {
  name: 'direction',
  defaults: [// { name: "", value: false },
  {
    name: 'rtl',
    value: 'rtl',
    type: formatValueType.icon
  }],
  type: formatType.toggle
}, {
  name: 'code-block',
  type: formatType.toggle
}, {
  name: 'formula',
  type: formatType.toggle
}, {
  name: 'image',
  type: formatType.toggle
}, {
  name: 'video',
  type: formatType.toggle
}];
exports.formats = formats;
//# sourceMappingURL=formats.js.map