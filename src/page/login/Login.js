/* eslint-disable react-hooks/exhaustive-deps */
import {logo_dinkes, logo_rsud} from '../../assets';

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import myFunctions from '../../functions';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Dimensions,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import OneSignal from 'react-native-onesignal';
import {useDispatch} from 'react-redux';
import {Header, In, Inpt, Spinner, Txt} from '../../component';
import {
  SET_DATA_PERMISSION,
  SET_DATA_REFRESH_TOKEN,
  SET_DATA_TOKEN,
  SET_DATA_USER,
} from '../../redux/action';
import API from '../../service';
import {useIsFocused} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import DeviceInfo from 'react-native-device-info';
import {SafeAreaView} from 'react-native-safe-area-context';

const Login = ({navigation}) => {
  const [visible, setVisible] = useState(true);
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    email: null,
    password: null,
    _id_onesignal: null,
    device: null,
  });
  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    myFunctions.permissionLocation(),
      signupOnesignal()
        .then(result => {
          // alert(result);
          console.log('update onesignal', result);
          setForm({...form, _id_onesignal: result});
          // setLoading(false)
        })
        .catch(e => {
          console.log(e);
          Alert.alert(
            'Error',
            e,
            [{text: 'OK', onPress: () => console.log('OK Pressed')}],
            {cancelable: false},
          );
          // setLoading(false);
        });
    let deviceId = DeviceInfo.getDeviceId();
    console.log('nama hp 99', deviceId);
    setForm({...form, device: deviceId});

    setTimeout(() => {
      // setSpinner(false);
      signupOnesignal()
        .then(result => {
          // alert(result);
          console.log('update onesignal', result);
          setForm({...form, _id_onesignal: result});
          // setLoading(false)
          console.log(result);
        })
        .catch(e => {
          console.log(e);
          Alert.alert(
            'Error',
            e,
            [{text: 'OK', onPress: () => console.log('OK Pressed')}],
            {cancelable: false},
          );
          // setLoading(false);
        });
      let deviceId = DeviceInfo.getDeviceId();
      console.log('nama hp anda', deviceId);
      setForm({...form, device: deviceId});
      setLoading(false);
    }, 10000);

    return () => {
      setForm({
        password: null,
        // _id_onesignal: null,
        email: null,
        device: null,
      });
      console.log('dddd', form);
    };
  }, []);

  const signupOnesignal = async () => {
    OneSignal.setAppId('236c4d70-fccd-4c78-b35a-9c0a9a1d3758');
    OneSignal.setLogLevel(6, 0);
    OneSignal.setRequiresUserPrivacyConsent(false);
    OneSignal.promptForPushNotificationsWithUserResponse(response => {
      console.log('Prompt response:', response);
    });

    try {
      console.log('THE RESPONSE AS BELOW');
      // dispatch(token_api_one_signal(device['userId']))
      const device = await OneSignal.getDeviceState();
      console.log('test9 ', device);
      console.log('log8', device.userId);
      return device.userId;
    } catch (e) {
      console.log(e);
    }
  };

  const storeDataUser = async value => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('@LocalUser', jsonValue);
    } catch (e) {
      console.log('no save');
    }
  };

  const storeDataToken = async value => {
    try {
      await AsyncStorage.setItem('@LocalToken', value);
    } catch (e) {
      console.log('TOken not Save ');
    }
  };

  const storeDataRefreshToken = async value => {
    try {
      await AsyncStorage.setItem('@LocalRefreshToken', value);
    } catch (e) {
      console.log('TOken not Save ');
    }
  };

  const storeDataPermission = async value => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('@LocalPermission', jsonValue);
    } catch (e) {
      console.log('no save', e);
    }
  };

  const handleAction = () => {
    setLoading(true);
    let deviceId = DeviceInfo.getDeviceId();
    const user = {
      email: form.email,
      password: form.password,
      _id_onesignal: form._id_onesignal,
      device: deviceId,
    };
    console.log('data user dan hp', user);

    console.log('1' + form.email + '2' + form._id_onesignal);

    console.log('data hp', form.device);

    if (!user._id_onesignal) {
      signupOnesignal()
        .then(result => {
          // alert(result);
          console.log('val1');
          console.log('update onesignal', result);
          user._id_onesignal = result;
          if (user._id_onesignal) {
            console.log('val2');
            handleLogin(user);
          } else {
            const user = {
              email: form.email,
              password: form.password,
              _id_onesignal: form._id_onesignal,
              device: form.device,
            };
            handleLogin(user);
          }
        })
        .catch(e => {
          console.log('val3');
          handleLogin(user);
          console.log(e);
        });
    } else {
      console.log('val4');
      handleLogin(user);
    }
    console.log('val5');
  };

  const handleLogin = user => {
    console.log('tesssss1');
    console.log(user);
    if (
      user.email != null &&
      user.password != null &&
      user._id_onesignal != null &&
      user.device != null
    ) {
      console.log('API');
      API.login(user)
        .then(response => {
          console.log('hasil response', response);
          if (response.status == true) {
            Promise.all([
              storeDataPermission(response.permission),
              storeDataUser(response.data),
              storeDataToken(response.akses_token),
              storeDataRefreshToken(response.refreshToken),
            ])
              .then(success => {
                console.log('data user', response.data);
                console.log('decode jwt', response.akses_token);
                dispatch(SET_DATA_USER(response.data));
                dispatch(SET_DATA_TOKEN(response.akses_token));
                dispatch(SET_DATA_REFRESH_TOKEN(response.refreshToken));
                dispatch(SET_DATA_PERMISSION(response.permission));
                navigation.replace('Main');
              })
              .catch(error => {
                console.error('Error during data storage:', error);

                Alert.alert(
                  'Gagal Login',
                  error.message,
                  [{text: 'OK', onPress: () => console.log('OK Pressed')}],
                  {cancelable: false},
                );
              })
              .finally(f => setLoading(false));
          } else {
            Alert.alert(
              'Gagal Login',
              response.message,
              [{text: 'OK', onPress: () => console.log('OK Pressed')}],
              {cancelable: false},
            );
            setLoading(false);
          }
        })
        .catch(error => {
          console.error('Error during API request:', error);

          // Menanggapi kesalahan secara umum
          Alert.alert(
            'Error',
            'Terjadi Kesalahan Pada Server',
            [{text: 'OK', onPress: () => console.log('OK Pressed')}],
            {cancelable: false},
          );
          setLoading(false);
        });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        scrollEnabled={true}
        contentContainerStyle={{flexGrow: 1, alignItems: 'center'}}
        nestedScrollEnabled={true}>
        {/* <View style={[{alignItems: 'center'}, styles.imgBg]}> */}
        <View style={{marginLeft: 'auto', marginRight: 'auto'}}>
          <Image
            source={logo_dinkes}
            style={[
              styles.images,
              {resizeMode: 'contain', width: windowWidht * 0.5},
            ]}
          />
        </View>
        <Text style={[styles.label1]}>ABSENSI</Text>
        <Text style={[styles.label1]}>DINAS KESEHATAN</Text>
        <Text style={[styles.label1]}>DELI SERDANG</Text>
        <View style={styles.floatingScreen}>
          <View
            style={{
              flexDirection: 'row',
              width: windowWidht * 0.8,
              marginHorizontal: windowWidht * 0.04,
              marginBottom: 20,
              marginTop: 50,
            }}>
            <Icon name="user" size={windowHeight * 0.04} color="#000000" />
            <TextInput
              style={styles.formInput}
              placeholder="Masukan Email"
              onChangeText={item => setForm({...form, email: item})}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              width: windowWidht * 0.8,
              marginHorizontal: windowWidht * 0.04,
            }}>
            <Icon name="lock" size={windowHeight * 0.04} color="#000000" />
            <TextInput
              style={styles.formInput}
              placeholder="Masukan Password"
              secureTextEntry={visible}
              onChangeText={item => setForm({...form, password: item})}
            />
            <TouchableOpacity
              onPress={() => {
                !visible ? setVisible(true) : setVisible(false);
              }}>
              {!visible && (
                <Icon
                  name="eye-slash"
                  size={windowHeight * 0.025}
                  color="#000000"
                />
              )}
              {visible && (
                <Icon name="eye" size={windowHeight * 0.025} color="#000000" />
              )}
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleAction()}>
            <Text style={[styles.label2, {color: '#FFFFFF'}]}>
              {' '}
              {loading ? <ActivityIndicator /> : 'Masuk'}{' '}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              marginTop: windowHeight * 0.07,
              marginRight: 'auto',
              marginLeft: windowWidht * 0.09,
              color: '#8b8787',
            }}>
            <Text style={{fontSize: windowWidht * 0.04}}>
              Lupa Password ...
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginTop: windowHeight * 0.1,
            marginBottom: 'auto',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
          <Text
            style={{
              marginTop: 'auto',
              marginLeft: 'auto',
              fontSize: 18,
              alignItems: 'flex-end',
              color: '#FFFFFF',
            }}>
            © IT RSUD HAT{' '}
            <Image source={logo_rsud} style={{width: 20}}></Image>
          </Text>
        </View>
        {/* </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;

const windowWidht = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  formInput: {
    borderBottomWidth: 1,
    width: windowWidht * 0.6,
    marginTop: -windowHeight * 0.02,
    borderBottomColor: 'grey',
    marginLeft: windowWidht * 0.05,
    fontSize: windowWidht * 0.04,
    // marginHorizontal : windowWidht*0.04,
  },
  imgBg: {
    height: windowHeight * 0.4,
  },
  container: {
    flex: 1,
    backgroundColor: '#18B2A2C4',
  },
  loadingImg: {
    alignItems: 'center',
    paddingTop: windowHeight * 0.04,
  },
  loading: {
    alignItems: 'center',
  },
  historyDay: {
    backgroundColor: '#FFFFFF',
    height: windowHeight * 0.18,
    width: windowWidht * 0.9,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.5)',
  },
  floatingScreen: {
    marginTop: windowHeight * 0.02,
    width: windowWidht * 0.9,
    height: windowHeight * 0.42,
    borderRadius: 50,
    alignItems: 'center',
    backgroundColor: '#dadf00',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.5)',
  },
  labelTitle: {
    fontSize: 30,
    color: '#FFFFFF',
    marginBottom: windowHeight * 0.01,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  label1: {
    fontSize: windowWidht * 0.05,
    marginLeft: 'auto',
    marginRight: 'auto',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  label2: {
    margin: 5,
    fontSize: windowWidht * 0.05,
  },
  label2white: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  label2whitecenter: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 20,
  },
  label3: {
    color: '#000000',
    fontSize: 16,
  },
  label3white: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  label2blue: {
    fontSize: 20,
    color: 'rgba(0,0,255,1)',
  },
  center: {
    // marginTop: windowHeight*0.1,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
  },

  iconGroup: {
    flexDirection: 'row',
  },

  square: {
    alignItems: 'center',
    height: windowWidht * 0.22,
    width: windowWidht * 0.22,
    marginTop: windowWidht * 0.05,
    marginHorizontal: windowWidht * 0.1,
    backgroundColor: 'rgba(0,191,255,0.1)',
    borderRadius: 2,
    borderWidth: 0.5,
    borderColor: 'rgba(0,191,255,0.01)',
  },

  iconBack: {
    alignItems: 'center',
    height: windowWidht * 0.3,
    width: windowWidht * 0.3,
    marginTop: windowWidht * 0.05,
    marginHorizontal: windowWidht * 0.1,
    backgroundColor: '#FFFFFF',
  },
  icon: {
    marginVertical: windowHeight * 0.01,
    width: windowWidht * 0.26,
    height: windowWidht * 0.26,
    borderWidth: 5,
    borderColor: 'red',
  },
  images: {
    width: windowWidht * 0.5,
    height: windowHeight * 0.3,
  },
  imagesLoading: {
    width: windowHeight * 0.12,
    height: windowHeight * 0.12,
    marginRight: 10,
    // borderRadius : 150/2,
    marginTop: windowHeight * 0.01,
    overflow: 'hidden',
    // borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
  },

  centerModal: {
    marginTop: windowHeight * 0.19,

    alignItems: 'center',
  },
  marginH: {
    marginHorizontal: windowWidht * 0.04,
    marginTop: windowHeight * 0.02,
  },
  leftButton: {
    width: windowWidht * 0.9,
  },

  marginTop: {
    marginTop: windowHeight * 0.05,
  },
  //dari react native
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    flex: 1,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    marginHorizontal: windowWidht * 0.05,
    marginTop: windowHeight * 0.04,
    width: windowWidht * 0.23,
    borderRadius: 10,
    fontSize: windowWidht * 0.05,
    height: windowHeight * 0.05,
    backgroundColor: '#09aeae',
    alignItems: 'center',
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#FF3131',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 'auto',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
