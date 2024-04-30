import React from 'react';
import { View, StyleSheet } from 'react-native';
const defaultColor = '#737373';
export const ToolbarSeparator = ({
  color
}) => {
  return /*#__PURE__*/React.createElement(View, {
    style: [styles.separator, {
      backgroundColor: color || defaultColor
    }]
  });
};
const styles = StyleSheet.create({
  separator: {
    width: 1,
    marginTop: 4,
    marginBottom: 4
  }
});
//# sourceMappingURL=toolbar-separator.js.map