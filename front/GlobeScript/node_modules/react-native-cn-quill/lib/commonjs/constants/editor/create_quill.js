"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create_quill = void 0;

const create_quill = ({
  id,
  toolbar,
  clipboard,
  keyboard,
  placeholder,
  theme,
  customFonts = [],
  customJS
}) => {
  let font = '';

  if (customFonts.length > 0) {
    const fontList = "'" + customFonts.join("','") + "'";
    font = `
    // Add fonts to whitelist
    var Font = Quill.import('formats/font');
    Font.whitelist = [${fontList}];
    Quill.register(Font, true);

    `;
  }

  let modules = `toolbar: ${toolbar},`;

  if (clipboard) {
    modules += `clipboard: ${clipboard},`;
  }

  if (keyboard) {
    modules += `keyboard: ${keyboard},`;
  }

  return `
  <script>
  
  ${font}
  ${customJS}
  var quill = new Quill('#${id}', {
    modules: { ${modules} },
    placeholder: '${placeholder}',
    theme: '${theme}'
  });
  </script>
  `;
};

exports.create_quill = create_quill;
//# sourceMappingURL=create_quill.js.map