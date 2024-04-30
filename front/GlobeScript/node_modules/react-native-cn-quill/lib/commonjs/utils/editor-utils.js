"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createHtml = exports.getFontName = void 0;

var _editor = require("../constants/editor");

const getFontName = font => {
  return font.toLowerCase().replace(/\s/g, '-');
};

exports.getFontName = getFontName;
const Inital_Args = {
  initialHtml: '',
  placeholder: 'write here',
  toolbar: 'false',
  clipboard: '',
  keyboard: '',
  libraries: 'local',
  theme: 'snow',
  editorId: 'editor-container',
  autoSize: false,
  containerId: 'standalone-container',
  color: 'black',
  backgroundColor: 'white',
  placeholderColor: 'rgba(0,0,0,0.6)',
  customStyles: [],
  fonts: [],
  customJS: ''
};

const createHtml = (args = Inital_Args) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, user-scalable=1.0,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0">
  ${args.theme === 'bubble' ? (0, _editor.quill_bubble_css)(args.libraries === 'cdn') : (0, _editor.quill_snow_css)(args.libraries === 'cdn')}
  ${(0, _editor.editor_css)(args.editorId, args.containerId, !!args.autoSize, args.color, args.backgroundColor, args.placeholderColor, args.fonts, args.defaultFontFamily)}
  ${args.customStyles && args.customStyles.map(style => {
    return style.toLocaleLowerCase().trim().startsWith('<style>') ? style : `<style>${style}</style>`;
  }).join('\n')}

  </head>
  <body>
  <div id="${args.containerId}">
    <div id="${args.editorId}">
      ${args.initialHtml}
    </div>
  </div>
  ${(0, _editor.quill_js)(args.libraries === 'cdn')}
  ${(0, _editor.create_quill)({
    id: args.editorId,
    toolbar: args.toolbar,
    clipboard: args.clipboard ? args.clipboard : '',
    keyboard: args.keyboard ? args.keyboard : '',
    placeholder: args.placeholder,
    theme: args.theme,
    customFonts: args.fonts.map(f => getFontName(f.name)),
    customJS: args.customJS ? args.customJS : ''
  })}
  ${_editor.editor_js}
  </body>
  </html>
  `;
};

exports.createHtml = createHtml;
//# sourceMappingURL=editor-utils.js.map