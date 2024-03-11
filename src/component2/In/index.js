import React from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';

const In = props => {
  return (
    <TouchableOpacity style={styles.section} onPress={props.onPress}>
      <Text style={styles.text}>{props.title}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  section: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 10,
    width: '80%',
  },
  text: {
    padding: 5,
    fontSize: 15,
    fontWeight: 'bold',
  },
});
export default In;
