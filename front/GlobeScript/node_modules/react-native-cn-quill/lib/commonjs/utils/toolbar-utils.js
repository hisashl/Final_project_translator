"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getToolbarData = void 0;

var _formats = require("../constants/formats");

var _icons = require("../constants/icons");

var _editorUtils = require("./editor-utils");

const getToolbarData = (options, customIcons, defaultFontFamily) => {
  let iconSet = [];
  const icons = customIcons ? { ..._icons.icons,
    ...customIcons
  } : _icons.icons;
  const isSingle = !(options.length > 0 && Array.isArray(options[0]));

  if (isSingle) {
    const set = createToolSet(options, icons);
    iconSet.push(set);
  } else {
    for (let i = 0; i < options.length; i++) {
      const opt = options[i];

      if (Array.isArray(opt)) {
        const set = createToolSet(opt, icons, defaultFontFamily);
        iconSet.push(set);
      } else console.log(opt, 'is not an array, you should pass it as an array');
    }
  }

  return iconSet;
};

exports.getToolbarData = getToolbarData;

const createToolSet = (tools, icons, defaultFontFamily) => {
  let ic = [];

  for (let i = 0; i < tools.length; i++) {
    const opt = tools[i];

    if (typeof opt === 'string') {
      const format = _formats.formats.find(f => f.name === opt);

      if (format && format.type === _formats.formatType.toggle || !format) {
        const formatIcon = icons[opt];

        if (formatIcon) {
          ic.push({
            name: opt,
            source: formatIcon,
            valueOff: false,
            valueOn: true,
            type: _formats.formatType.toggle
          });
        } else {
          ic.push({
            name: opt,
            valueOff: false,
            valueOn: true,
            type: _formats.formatType.toggle
          });
        }
      }
    } else if (typeof opt === 'object' && opt !== null) {
      const keys = Object.keys(opt);
      const values = Object.values(opt);

      for (let j = 0; j < keys.length; j++) {
        const key = keys[j];
        const value = values[j];

        const format = _formats.formats.find(f => f.name === key);

        if (typeof value === 'string' || typeof value === 'number') {
          const formatIcon = icons[key][value];

          if (formatIcon) {
            ic.push({
              name: key,
              source: formatIcon,
              valueOff: false,
              valueOn: value,
              type: _formats.formatType.toggle
            });
          } else {
            ic.push({
              name: key,
              valueOff: false,
              valueOn: value,
              type: _formats.formatType.toggle
            });
          }
        } else if (Array.isArray(value)) {
          const formatIcon = icons[key];
          let listItems = [];

          if ((!format || format.allowCustoms === true) && value.length > 0) {
            listItems = value.map(v => {
              var _format$defaults;

              let def = format === null || format === void 0 ? void 0 : (_format$defaults = format.defaults) === null || _format$defaults === void 0 ? void 0 : _format$defaults.find(f => f.value === (v !== '' ? v : false));

              if (key === 'font' && defaultFontFamily && (def === null || def === void 0 ? void 0 : def.value) === false) {
                def.name = defaultFontFamily;
              }

              return def ? def : {
                name: v,
                value: key === 'font' && v !== false && v !== '' ? (0, _editorUtils.getFontName)(v) : v,
                type: _formats.formatValueType.text
              };
            });
          } else if (format !== null && format !== void 0 && format.defaults && value.length === 0) {
            listItems = format.defaults;
          } else if (format !== null && format !== void 0 && format.defaults && value.length > 0) {
            listItems = format.defaults.filter(f => value.indexOf(f.value) !== -1);
          }

          if (listItems.length > 0) {
            if (!format || format.type === _formats.formatType.select) {
              ic.push({
                name: key,
                values: listItems.map(x => {
                  let icon = x.type === _formats.formatValueType.icon ? x.value === false ? icons[key][''] : typeof x.value === 'string' ? icons[key][x.value] : undefined : undefined;
                  return {
                    name: x.name,
                    valueOff: false,
                    valueOn: x.value,
                    source: icon,
                    type: (x.type === _formats.formatValueType.icon && icon ? true : false) ? _formats.formatType.icon : _formats.formatType.toggle
                  };
                }),
                type: _formats.formatType.select
              });
            } else {
              ic.push({
                name: key,
                source: formatIcon,
                values: listItems.map(x => ({
                  name: x.name,
                  valueOff: false,
                  valueOn: x.value,
                  type: _formats.formatType.color
                })),
                type: _formats.formatType.color
              });
            }
          } else {
            const fIcon = icons[key];

            if (fIcon) {
              ic.push({
                name: key,
                source: fIcon,
                valueOff: false,
                valueOn: true,
                type: _formats.formatType.toggle
              });
            }
          }
        }
      }
    }
  }

  return ic;
};
//# sourceMappingURL=toolbar-utils.js.map