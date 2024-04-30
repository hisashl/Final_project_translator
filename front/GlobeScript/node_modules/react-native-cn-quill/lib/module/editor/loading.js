import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
export const Loading = ({
  text
}) => {
  return /*#__PURE__*/React.createElement(View, {
    style: styles.container
  }, /*#__PURE__*/React.createElement(Text, null, text));
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
//# sourceMappingURL=loading.js.map