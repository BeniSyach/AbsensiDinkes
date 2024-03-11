import React from 'react';
import {Text, StyleSheet, View, Image, Dimensions} from 'react-native';

const header = props => {
  return <View style={styles.Container}></View>;
};
const styles = StyleSheet.create({
  Container: {
    alignItems: 'center',
  },
  Text: {
    fontSize: 17,
    color: '#FFFFFF',
    position: 'absolute',
    fontWeight: 'bold',
    top: 100,
    left: 30,
  },
});
export default header;
