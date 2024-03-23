import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
  Platform,
  ActivityIndicator,
  Modal,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Arsip, group, history, logo_dinkes, logo_rsud} from '../../assets';
import {useDispatch, useSelector} from 'react-redux';
import API from '../../service';
import {SafeAreaView} from 'react-native-safe-area-context';
import DeviceInfo from 'react-native-device-info';
import {useIsFocused} from '@react-navigation/native';
import myFunctions from '../../functions';
import reactNativeAndroidLocationServicesDialogBox from 'react-native-android-location-services-dialog-box';
import JailMonkey from 'jail-monkey';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import Modal from 'react-native-modal';

const Home = ({navigation}) => {
  const REFRESHTOKEN = useSelector(state => state.RefreshTokenReducer);
  const USER = useSelector(state => state.UserReducer);
  // const DATAUSER = useSelector(state => state.PermissionReducer);
  // console.log('ini data dari memori hp', DATAUSER);
  const [data, setData] = useState({
    nama: '',
    role: [],
    puskesmas: [],
    messageM: '',
    messageCount: '',
  });
  console.log('ini data di home', data);
  const [message, setMessage] = useState();
  const [refreshing, setRefreshing] = React.useState(false);
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    console.log('di home');
    getData();
    if (Platform.OS === 'android') {
      reactNativeAndroidLocationServicesDialogBox
        .checkLocationServicesIsEnabled({
          message:
            "<h2 style='color: #0af13e'>lokasi !!!</h2>Gps Anda Belum Aktif:<br/>",
          ok: 'YES',
          cancel: 'NO',
        })
        .then(function (success) {
          if (success) {
          }
        })
        .catch(error => {
          console.log(error.message);
        });
    }
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getData();
    setRefreshing(false);
  }, []);

  DeviceInfo.getDeviceName().then(deviceName => {
    console.log('nama hp', deviceName);
  });

  let model = DeviceInfo.getModel();
  console.log('model hp', model);
  DeviceInfo.getFingerprint().then(fingerprint => {
    console.log('nama hp fingerprint', fingerprint);
  });

  const getData = () => {
    setLoading(true);
    console.log('get data id home', USER.userId);
    console.log('token hp depan', REFRESHTOKEN);
    API.menu(USER.userId, REFRESHTOKEN).then(result => {
      if (result) {
        console.log('data2', result);
        if (result.status == 'error') {
          Alert.alert(
            'Sesi Berakhir',
            'Silahkan Login Ulang Kembali',
            [
              {
                text: 'OK',
                onPress: () => {
                  AsyncStorage.clear();
                  navigation.replace('Login');
                },
              },
            ],
            {cancelable: false},
          );
        } else {
          setData(result);
        }
        if (result.versionNow == 'not') {
          Alert.alert(result.version);
        }
        setLoading(false);
      } else {
        Alert.alert(result.message);
      }
    });
    // setLoading(false);
  };

  const fotoUrl = `http://103.114.111.178:3035/uploads/img/profil/${data && data.UsersById && data.UsersById.foto}`;
  console.log('data foto di home', fotoUrl);

  if (JailMonkey.isJailBroken()) {
    Alert.alert(
      'Error',
      'Device Anda di root tolong kembalikan seperti semula',
      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
    );
  } else {
    return (
      <>
        <View>
          <Modal visible={loading} animationType="slide" transparent>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              }}>
              <View
                style={{
                  backgroundColor: 'white',
                  padding: 20,
                  borderRadius: 10,
                }}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading...</Text>
              </View>
            </View>
          </Modal>
        </View>
        <SafeAreaView style={{flex: 1, backgroundColor: '#AFA3A3'}}>
          <ScrollView
            scrollEnabled={true}
            contentContainerStyle={styles.scrollView}
            nestedScrollEnabled={true}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            <View style={{backgroundColor: '#4DC2B7', width: windowWidht * 1}}>
              <View
                style={{
                  flexDirection: 'row',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  width: windowWidht * 0.85,
                  marginBottom: windowHeight * 0.02,
                  marginTop: windowHeight * 0.02,
                }}>
                <View>
                  <Image
                    source={logo_dinkes}
                    style={[
                      styles.iconRadius1,
                      {resizeMode: 'contain'},
                    ]}></Image>
                </View>
                <View
                  style={{
                    marginLeft: windowHeight * 0.01,
                    marginRight: windowHeight * 0.01,
                    marginTop: 10,
                  }}>
                  <Text
                    style={{
                      color: '#FFFFFF',
                      marginLeft: windowWidht * 0.01,
                      marginRight: windowWidht * 0.1,
                      textAlign: 'center',
                      fontSize: windowWidht * 0.035,
                    }}>
                    Selamat Datang di Aplikasi
                  </Text>
                  <Text
                    style={{
                      color: '#FFFFFF',
                      marginLeft: windowWidht * 0.02,
                      marginRight: windowWidht * 0.1,
                      textAlign: 'center',
                      fontSize: windowWidht * 0.035,
                    }}>
                    Absensi Dinas Kesehatan Deli Serdang
                  </Text>
                </View>
                <TouchableOpacity
                  style={{marginLeft: 'auto', marginTop: windowHeight * 0.01}}
                  // onPress={() => {
                  //   navigation.navigate('message', {
                  //     lat:
                  //       data &&
                  //       data.UsersById &&
                  //       data.UsersById.puskesmas &&
                  //       data.UsersById.puskesmas.lat,
                  //     lng:
                  //       data &&
                  //       data.UsersById &&
                  //       data.UsersById.puskesmas &&
                  //       data.UsersById.puskesmas.lng,
                  //     radius:
                  //       data &&
                  //       data.UsersById &&
                  //       data.UsersById.puskesmas &&
                  //       data.UsersById.puskesmas.radius,
                  //   });
                  // }}
                >
                  <Icon
                    name="bell"
                    size={windowHeight * 0.04}
                    color="#000000"
                    solid
                  />
                  {/* {data.messageCount != '' && (
                    <View
                      style={{
                        justifyContent: 'center',
                        marginTop: -40,
                        backgroundColor: 'red',
                        width: windowWidht * 0.05,
                        height: windowWidht * 0.05,
                        borderRadius: (windowWidht * 0.05) / 2,
                      }}>
                      <Text
                        style={{
                          color: '#FFFFFF',
                          textAlign: 'center',
                          fontSize: 10,
                        }}>
                        {data.messageCount}
                      </Text>
                    </View>
                  )} */}
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  // width: windowWidht * 0.85,
                  marginBottom: windowHeight * 0.02,
                  marginTop: windowHeight * 0.01,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 60,
                    width: windowWidht * 5,
                    left: 0,
                  }}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('User', {screen: 'User'})
                    }>
                    {data && data.UsersById && data.UsersById.foto == null ? (
                      <Image
                        style={styles.iconRadius}
                        source={{
                          uri: `https://i.pinimg.com/236x/56/2e/be/562ebed9cd49b9a09baa35eddfe86b00.jpg`,
                          // `http://192.168.68.110:5000/api` +
                          // `${String(data.staff.image).replace('public/', '')}`,
                        }}
                      />
                    ) : (
                      <Image
                        style={styles.iconRadius}
                        source={{uri: fotoUrl}}
                      />
                    )}
                  </TouchableOpacity>

                  <View
                    style={{
                      marginLeft: windowHeight * 0.01,
                      marginRight: windowHeight * 0.1,
                    }}>
                    <Text
                      style={{
                        color: '#000000',
                        fontSize: windowWidht * 0.05,
                        fontWeight: 'bold',
                      }}>
                      {data && data.UsersById && data.UsersById.nama}
                    </Text>
                    <Text
                      style={{
                        color: '#000000',
                        fontSize: windowWidht * 0.04,
                        fontWeight: 'bold',
                      }}>
                      {data &&
                        data.UsersById &&
                        data.UsersById.puskesmas &&
                        data.UsersById.puskesmas.nama}
                    </Text>
                    <Text
                      style={{
                        color: '#000000',
                        fontWeight: 'bold',
                        fontSize: windowWidht * 0.035,
                      }}>
                      {data && data.UsersById && data.UsersById.status}
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  backgroundColor: '#AFA3A3',
                  borderTopLeftRadius: 60,
                  borderTopRightRadius: 30,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    width: windowWidht * 0.8,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    marginTop: windowHeight * 0.03,
                    justifyContent: 'space-between',
                  }}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('ListAbsence', {
                        fingerfrint: data && data.fingerfrint,
                        selfie: data && data.selfie,
                        lat:
                          data &&
                          data.UsersById &&
                          data.UsersById.puskesmas &&
                          data.UsersById.puskesmas.lat,
                        lng:
                          data &&
                          data.UsersById &&
                          data.UsersById.puskesmas &&
                          data.UsersById.puskesmas.lng,
                        radius:
                          data &&
                          data.UsersById &&
                          data.UsersById.puskesmas &&
                          data.UsersById.puskesmas.radius,
                        user_id: USER.userId,
                        jadwal:
                          data &&
                          data.UsersById &&
                          data.UsersById.shift &&
                          data.UsersById.shift.jadwal_kerja,
                        status_absen: data && data.status_absen,
                        absen_masuk_id: data.id_absen_masuk || 0,
                        // id_absen_masuk:
                      })
                    }>
                    <View style={[styles.cardContainer, {borderRadius: 40}]}>
                      <View style={styles.cardContent}>
                        <Icon
                          name="fingerprint"
                          size={windowHeight * 0.1}
                          color="#000000"
                        />

                        <Text style={[styles.cardText, {color: '#000000'}]}>
                          Absensi
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Request')}>
                    <View style={[styles.cardContainer, {borderRadius: 40}]}>
                      <View style={styles.cardContent}>
                        <Image
                          source={group}
                          style={{
                            width: windowWidht * 0.19,
                            height: windowHeight * 0.1,
                            resizeMode: 'contain',
                          }}></Image>

                        <Text style={[styles.cardText, {color: '#000000'}]}>
                          Pengajuan
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
                {/* row 2 */}
                <View
                  style={{
                    flexDirection: 'row',
                    width: windowWidht * 0.8,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    marginTop: windowHeight * 0.03,
                    justifyContent: 'space-between',
                  }}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('ListHistory', {
                        type: data && data.role && data.role.nama,
                      })
                    }>
                    <View style={[styles.cardContainer, {borderRadius: 40}]}>
                      <View style={styles.cardContent}>
                        <Image
                          source={history}
                          style={{
                            width: windowWidht * 0.2,
                            height: windowHeight * 0.1,
                            resizeMode: 'contain',
                          }}></Image>

                        <Text style={[styles.cardText, {color: '#000000'}]}>
                          Histori
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Holiday')}>
                    <View style={[styles.cardContainer, {borderRadius: 40}]}>
                      <View style={styles.cardContent}>
                        <Image
                          source={Arsip}
                          style={{
                            width: windowWidht * 0.2,
                            height: windowHeight * 0.1,
                            resizeMode: 'contain',
                          }}></Image>

                        <Text style={[styles.cardText, {color: '#000000'}]}>
                          Arsip Berkas
                        </Text>
                        <Text style={[styles.cardText, {color: '#000000'}]}>
                          SPT
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View
              style={{
                backgroundColor: '#AFA3A3',
              }}>
              <Text
                style={[styles.cardText, {color: '#000000', marginBottom: 10}]}>
                Statistik Absensi Anda
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{
                  flexDirection: 'row',
                  backgroundColor: '#AFA3A3',
                  marginLeft: 10,
                }}>
                <View
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 30,
                    marginLeft: 10,
                    marginRight: 10,
                    height: windowHeight * 0.1,
                    width: windowWidht * 0.45,
                  }}>
                  <TouchableOpacity>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        marginTop: windowHeight * 0.01,
                      }}>
                      <Text
                        style={{
                          fontSize: windowWidht * 0.08,
                          color: '#000000',
                          fontWeight: 'bold',
                          marginRight: windowWidht * 0.05,
                        }}>
                        {data && data.totalTelatMasuk}
                      </Text>
                      <Icon name="user" size={40} />
                    </View>
                    <View>
                      <Text style={[styles.cardText1, {color: '#000000'}]}>
                        Telat Masuk (Hari Ini)
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 30,
                    marginLeft: 10,
                    marginRight: 10,
                    height: windowHeight * 0.1,
                    width: windowWidht * 0.45,
                  }}>
                  <TouchableOpacity>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        marginTop: windowHeight * 0.01,
                      }}>
                      <Text
                        style={{
                          fontSize: windowWidht * 0.08,
                          color: '#000000',
                          fontWeight: 'bold',
                          marginRight: windowWidht * 0.05,
                        }}>
                        {data && data.totalTepatMasuk}
                      </Text>
                      <Icon name="user" size={40} />
                    </View>
                    <View>
                      <Text style={[styles.cardText1, {color: '#000000'}]}>
                        Tepat Masuk (Hari Ini)
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 30,
                    marginLeft: 10,
                    marginRight: 10,
                    height: windowHeight * 0.1,
                    width: windowWidht * 0.45,
                  }}>
                  <TouchableOpacity>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        marginTop: windowHeight * 0.01,
                      }}>
                      <Text
                        style={{
                          fontSize: windowWidht * 0.08,
                          color: '#000000',
                          fontWeight: 'bold',
                          marginRight: windowWidht * 0.05,
                        }}>
                        {data && data.totalCepatPulang}
                      </Text>
                      <Icon name="user" size={40} />
                    </View>
                    <View>
                      <Text style={[styles.cardText1, {color: '#000000'}]}>
                        Cepat Pulang (Hari Ini)
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 30,
                    marginLeft: 10,
                    marginRight: 10,
                    height: windowHeight * 0.1,
                    width: windowWidht * 0.45,
                  }}>
                  <TouchableOpacity>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        marginTop: windowHeight * 0.01,
                      }}>
                      <Text
                        style={{
                          fontSize: windowWidht * 0.08,
                          color: '#000000',
                          fontWeight: 'bold',
                          marginRight: windowWidht * 0.05,
                        }}>
                        {data && data.totalTepatPulang}
                      </Text>
                      <Icon name="user" size={40} />
                    </View>
                    <View>
                      <Text style={[styles.cardText1, {color: '#000000'}]}>
                        Tepat Pulang (Hari Ini)
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
            <View
              style={{
                marginTop: windowHeight * 0.15,
                marginBottom: 'auto',
                marginStart: 'auto',
                marginEnd: 'auto',
              }}>
              <Text
                style={{
                  marginTop: 'auto',
                  marginLeft: 'auto',
                  fontSize: 18,
                  alignItems: 'flex-end',
                  color: '#000000',
                  fontWeight: 'bold',
                }}>
                © IT RSUD HAT{' '}
                <Image source={logo_rsud} style={{width: 20}}></Image>
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
};

export default Home;

const windowWidht = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  cardContainer: {
    margin: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 3,
    shadowOffset: {width: 1, height: 1},
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  cardContent: {
    alignItems: 'center',
    padding: 20,
  },
  button: {
    // Gaya tombol Anda yang sudah ada
    padding: 10,
    borderRadius: 5,
  },
  cardText: {
    textAlign: 'center',
    marginTop: 5,
    fontSize: windowWidht * 0.04,
    fontWeight: 'bold',
  },
  cardText1: {
    textAlign: 'center',
    marginTop: 5,
    fontSize: windowWidht * 0.035,
    fontWeight: 'bold',
  },
  btnRadius: {
    backgroundColor: '#D9D9D9',
    width: windowWidht * 0.15,
    height: windowWidht * 0.15,
    borderRadius: (windowWidht * 0.15) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconRadius1: {
    width: windowWidht * 0.11,
    height: windowWidht * 0.15,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  iconRadius: {
    width: windowWidht * 0.18,
    height: windowWidht * 0.18,
    borderRadius: (windowWidht * 0.3) / 2,
    resizeMode: 'contain',
  },
  floatingView: {
    // borderWidth: 2,
    // borderColor: '#00000020',
    width: windowWidht * 0.675,
    height: windowHeight * 0.1,
    // backgroundColor: '#FFFFFF',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: -windowHeight * 0.01,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    height: windowHeight * 0.35,
    elevation: 5,
    backgroundColor: '#FFFFFF',
    paddingBottom: windowHeight * 0.02,
  },
  month1: {
    alignItems: 'center',
    marginRight: 'auto',
    marginTop: 'auto',
    marginLeft: windowWidht * 0.05,
  },
  month2: {
    alignItems: 'center',
    marginRight: 'auto',
    marginLeft: 'auto',
    marginTop: 'auto',
  },
  month3: {
    alignItems: 'center',
    marginLeft: 'auto',
    marginTop: 'auto',
    marginRight: windowWidht * 0.05,
  },
  chart: {
    backgroundColor: '#FFE600',
    width: windowWidht * 0.22,
    height: windowHeight * 0.28 * 0.5,
  },
  textMonth: {
    color: '#FFFFFF',
    marginBottom: 'auto',
    marginLeft: 'auto',
    marginTop: 'auto',
    marginRight: 'auto',
  },
});
