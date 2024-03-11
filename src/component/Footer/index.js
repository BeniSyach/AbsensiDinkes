import * as React from 'react';
import {
  Dimensions,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const Footer = props => {
  return (
    <View
      style={{
        backgroundColor: '#DBE000',
        height: windowHeight * 0.1,
        marginTop: 'auto',
        borderTopStartRadius: 60,
        borderTopEndRadius: 60,
        borderTopWidth: 1,
        borderColor: '#00000050',
      }}>
      <View
        style={{flexDirection: 'row', marginTop: 'auto', marginBottom: 'auto'}}>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('Home', {screen: 'Home'})}
          style={styles.navMenu}
          disabled={props.focus == 'Home' ? true : false}>
          <Icon
            name="home"
            size={30}
            color={props.focus == 'Home' ? '#FFFFFF' : '#000000'}
          />
          <Text>Absen</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => props.navigation.navigate('User', {screen: 'User'})}
          style={[styles.navMenu, {marginLeft: 'auto'}]}
          disabled={props.focus == 'User' ? true : false}>
          <Icon
            name="user"
            size={30}
            color={props.focus == 'User' ? '#FFFFFF' : '#000000'}
          />
          <Text>User</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const windowWidht = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  navMenu: {
    alignItems: 'center',
    marginHorizontal: windowWidht * 0.1,
  },
});
export default Footer;
