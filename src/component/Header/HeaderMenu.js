import React from 'react';
import {Image, View, Text, StyleSheet} from 'react-native';

const Header = props => {
  return (
    <View style={styles.Container}>
      <Text style={styles.Text}>{props.text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    alignItems: 'center',
  },
  imageStyle: {
    width: '100%',
    height: 170,
    top: 0,
  },
  Text: {
    fontSize: 17,
    color: '#FFFFFF',
    position: 'absolute',
    fontWeight: 'bold',
    top: 90,
    left: 30,
  },
});
export default Header;
