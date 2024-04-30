import React from 'react';
import { ScrollView, Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useToolbar } from './toolbar-context';
import { ToggleTextButton } from './toggle-text-button';
import { ToggleColorButton } from './toggle-color-button';
import { ToggleIconButton } from './toggle-icon-button';
import { formatType } from '../../constants/formats';
export const SelectionBar = ({}) => {
  var _styles$selection, _styles$selection2, _styles$selection3, _styles$selection3$cl, _styles$selection4, _styles$selection4$cl;

  const {
    theme,
    options,
    hide,
    selectionName,
    styles
  } = useToolbar();
  const defaultStyles = useStyles(theme);
  const rootStyle = styles !== null && styles !== void 0 && (_styles$selection = styles.selection) !== null && _styles$selection !== void 0 && _styles$selection.root ? styles.selection.root(defaultStyles.selection) : defaultStyles.selection;
  const scrollStyle = styles !== null && styles !== void 0 && (_styles$selection2 = styles.selection) !== null && _styles$selection2 !== void 0 && _styles$selection2.scroll ? styles.selection.scroll(defaultStyles.scroll) : defaultStyles.scroll;
  const closeViewStyle = styles !== null && styles !== void 0 && (_styles$selection3 = styles.selection) !== null && _styles$selection3 !== void 0 && (_styles$selection3$cl = _styles$selection3.close) !== null && _styles$selection3$cl !== void 0 && _styles$selection3$cl.view ? styles.selection.close.view(defaultStyles.close) : defaultStyles.close;
  const closeTextStyle = styles !== null && styles !== void 0 && (_styles$selection4 = styles.selection) !== null && _styles$selection4 !== void 0 && (_styles$selection4$cl = _styles$selection4.close) !== null && _styles$selection4$cl !== void 0 && _styles$selection4$cl.text ? styles.selection.close.text(defaultStyles.text) : defaultStyles.text;
  return /*#__PURE__*/React.createElement(View, {
    style: rootStyle
  }, /*#__PURE__*/React.createElement(ScrollView, {
    horizontal: true,
    bounces: false,
    showsHorizontalScrollIndicator: false,
    contentContainerStyle: scrollStyle
  }, options && options.map((item, index) => {
    if (item.type === formatType.color && item.valueOn !== true && typeof item.valueOn !== 'number') {
      return /*#__PURE__*/React.createElement(ToggleColorButton, {
        key: index,
        name: selectionName,
        valueOff: false,
        valueOn: item.valueOn
      });
    } else if (item.type === formatType.icon) {
      return /*#__PURE__*/React.createElement(ToggleIconButton, {
        key: index,
        source: item.source,
        name: selectionName,
        valueOff: false,
        valueOn: item.valueOn
      });
    } else return /*#__PURE__*/React.createElement(ToggleTextButton, {
      key: index,
      name: selectionName,
      valueOff: false,
      valueOn: item.valueOn,
      valueName: item.name
    });
  })), /*#__PURE__*/React.createElement(TouchableOpacity, {
    onPress: () => hide()
  }, /*#__PURE__*/React.createElement(View, {
    style: closeViewStyle
  }, /*#__PURE__*/React.createElement(Text, {
    style: closeTextStyle
  }, "\xD7"))));
};

const useStyles = theme => StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.overlay,
    borderRadius: 3
  },
  selection: {
    padding: 2,
    position: 'absolute',
    top: 0,
    backgroundColor: theme.overlay,
    //'=rgba(0,0,0,.1)',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: theme.size + 4
  },
  scroll: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: theme.color,
    fontWeight: 'bold'
  },
  close: {
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.overlay,
    paddingHorizontal: 10,
    marginRight: 2,
    marginLeft: 4,
    height: Math.round(theme.size - 6)
  }
});
//# sourceMappingURL=selection-bar.js.map