import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  ScrollView,
  PermissionsAndroid,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import MapView, {Callout, Marker, Circle} from 'react-native-maps';
import {useSelector} from 'react-redux';
import API from '../../service';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import RNFetchBlob from 'rn-fetch-blob';
import {getDistance} from 'geolib';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ScreenLoading from '../loading/ScreenLoading';
import {SafeAreaView} from 'react-native-safe-area-context';
import myFunctions from '../../functions';
import {launchCamera} from 'react-native-image-picker';
import {
  isMockingLocation,
  MockLocationDetectorErrorCode,
} from 'react-native-turbo-mock-location-detector';
import Config from 'react-native-config';
import axios from 'axios';
import {logo_rsud} from '../../assets';

const Absence = ({navigation, route}) => {
  const TOKEN = useSelector(state => state.RefreshTokenReducer);
  // console.log('data dari hp', route.params);
  const STAFF_ID = useSelector(state => state.UserReducer.userId);

  const [refreshing, setRefreshing] = React.useState(false);
  const [j1, setJ1] = useState(0);
  const [fakeGpsV, setfakeGpsV] = useState(0);
  const [jarak, setJarak] = useState('1');
  const [test, setTest] = useState('');
  const [finger, setFinger] = useState('ON');
  const [form, setForm] = useState({
    lat: 0,
    lng: 0,
    customer_id: '',
    memo: '',
    type: '',
    accuracy: '',
    distance: '',
    todo: '',
  });
  const [loading, setLoading] = useState(true);
  const latref = route.params.lat;
  const lngref = route.params.lng;

  const fakeGps = async () => {
    console.log('Fake GPS');
    // return true;
    await isMockingLocation()
      .then(({isLocationMocked}) => {
        if (isLocationMocked === true) {
          setfakeGpsV(2);
          return (
            <View>
              <Text>
                Anda Menggunakan Fake GPS Tolong Matikan Fake GPS dan restart HP
                Anda Kembali
              </Text>
            </View>
          );
          // return true;
        } else {
          setfakeGpsV(3);
          return (
            <View>
              <Text>
                Anda Menggunakan Fake GPS Tolong Matikan Fake GPS dan restart HP
                Anda Kembali
              </Text>
            </View>
          );
          // return true;
        }

        // isLocationMocked: boolean
        // boolean result for Android and iOS >= 15.0
      })
      .catch(error => {
        // error.message - descriptive message
        switch (error.code) {
          case MockLocationDetectorErrorCode.GPSNotEnabled: {
            // user disabled GPS
            console.log('fake 1');
            return true;
          }
          case MockLocationDetectorErrorCode.NoLocationPermissionEnabled: {
            // user has no permission to access location
            console.log('fake 2');
            return true;
          }
          case MockLocationDetectorErrorCode.CantDetermine: {
            console.log('fake 3');
            return true;
            // always for iOS < 15.0
            // for android and iOS if couldn't fetch GPS position
          }
        }
      });
  };

  useEffect(() => {
    console.log('route.params', route.params);
    fakeGps();
    // myFunctions.fakeGps();
    Promise.all([
      myFunctions.checkFingerprint(),
      myFunctions.permissionCamera(),
      myFunctions.permissionLocation(),
      // myFunctions.fakeGps(),
      // ,
    ])
      .then(res => {
        console.log('rpromise all', res);
        //if perrmission loc
        if (res[2]) {
          //check gps
          myFunctions
            .checkGps(false)
            .then(function (gps) {
              if (!gps.status) {
                setLoading(false);
                console.log('checkGps useeffect', 'false');
                Alert.alert(
                  'Peringatan',
                  'Anda berada di luar jangkauan, akurasi GPS: ' +
                    gps.data.accuracy +
                    ', tolong kalibrasi GPS atau pakai Internet yang lebih kuat.',
                );
                navigation.replace('Main');
              } else {
                console.log('position', gps.data);
                //get distance
                const j = getDistance(gps.data, {
                  latitude: parseFloat(latref),
                  longitude: parseFloat(lngref),
                });
                console.log('distance', j);
                setTest(j);
                console.log('akurasi titik lokasi', gps.data.accuracy);
                if (j > parseInt(route.params.radius)) {
                  setJarak('1');
                  setJ1(j);
                  console.log('akurasi titik lokasi', j);
                  // if (gps.data.accuracy > 40) {
                  Alert.alert('Peringatan', 'Anda berada di luar jangkauan');
                  navigation.replace('Main');
                  // }
                } else {
                  setJarak('2');
                }

                // positionNew = position
                console.log(
                  'posisiisii ',
                  gps.data.latitude,
                  gps.data.longitude,
                );
                setForm({
                  ...form,
                  lat: gps.data.latitude,
                  lng: gps.data.longitude,
                  accuracy: gps.data.accuracy,
                  distance: j,
                });
                setLoading(false);
              }
            })
            .catch(error => {
              console.log('err checkGps useeffect', error.message);
              setLoading(false);
              navigation.replace('Main');
            });
        } else {
          Alert.alert(
            'Location Permission',
            'Location Permission tidak diizinkan.',
          );
          navigation.replace('Main');
        }
      })
      .catch(e => {
        console.log('err promise all', e);
        setLoading(false);
        navigation.replace('Main');
      });
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    console.log(route.params);
    setLoading(true);
    setfakeGpsV(0);
    fakeGps();
    Promise.all([
      myFunctions.checkFingerprint(),
      myFunctions.permissionCamera(),
      myFunctions.permissionLocation(),
    ])
      .then(res => {
        setLoading(true);
        //if fingerprint off
        if (!res[0]) {
          setFinger('OFF');
        }
        //if perrmission loc
        if (res[2]) {
          //check gps
          myFunctions
            .checkGps(false)
            .then(function (gps) {
              if (!gps.status) {
                console.log('checkGps useeffect', 'false');
                setLoading(false);
              } else {
                console.log('position', gps.data);
                //get distance
                const j = getDistance(gps.data, {
                  latitude: parseFloat(latref),
                  longitude: parseFloat(lngref),
                });
                console.log('distance j1', j);
                setTest(j);
                if (j > parseInt(route.params.radius)) {
                  setJarak('1');
                  setJ1(j);
                  // if (gps.data.accuracy > 40) {
                  Alert.alert('Peringatan', 'Anda berada di luar jangkauan');
                  navigation.replace('Main');
                  // }
                } else {
                  setJarak('2');
                }

                // positionNew = position
                console.log(
                  'posisiisii ',
                  gps.data.latitude,
                  gps.data.longitude,
                );
                setForm({
                  ...form,
                  lat: gps.data.latitude,
                  lng: gps.data.longitude,
                });
                setLoading(false);
              }
            })
            .catch(error => {
              console.log('err checkGps useeffect', error.message);
              setLoading(false);
            });
        } else {
          Alert.alert(
            'Location Permission',
            'Location Permission tidak diizinkan.',
          );
        }
        setLoading(false);
      })
      .catch(e => {
        console.log('err promise all', e);
        setLoading(false);
      });

    setLoading(false);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  // if(route.params.img == {}){
  const [image, set_image] = useState({
    base64: '',
    fileName: '',
    fileSize: 0,
    height: 0,
    type: '',
    uri: '',
    width: 0,
    from: 'api',
  });

  const sendData = async position => {
    console.log('senddata', '3');

    console.log('data mau dikirim ke server user id', route.params.user_id);
    console.log(
      'data mau dikirim ke server id jadwal kerja',
      route.params.id_jadwalKerja,
    );
    console.log('data mau dikirim ke server latitude_masuk', position.lat);
    console.log('data mau dikirim ke server longitude_masuk', position.lng);

    const refreshResponse = await axios.get(
      `${Config.REACT_APP_BASE_URL}/auth/token`,
      {
        headers: {
          Cookie: `refreshToken=${TOKEN}`,
        },
      },
    );
    const newToken = refreshResponse.data.akses_token;

    try {
      const response = await axios.post(
        Config.REACT_APP_BASE_URL + '/absen/Tambah-AbsenMasuk',
        {
          user_id: route.params.user_id,
          id_jadwalKerja: route.params.id_jadwalKerja,
          // latitude_masuk: position.latitude,
          latitude_masuk: route.params.lat,
          longitude_masuk: route.params.lng,
        },
        {
          headers: {
            Authorization: `Bearer ${newToken}`,
            otherHeader: 'foo',
            Accept: 'application/json',
          },
        },
      );

      let data = response.data;
      if (data.data) {
        console.log(response);
        setLoading(false);
        Alert.alert(
          data.message,
          '',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.replace('Main');
              },
            },
          ],
          {cancelable: false},
        );
      } else {
        setLoading(false);
        Alert.alert(
          data.message,
          '',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.replace('Main');
              },
            },
          ],
          {cancelable: false},
        );
      }
    } catch (error) {
      // Handle errors
      if (axios.isAxiosError(error)) {
        // Axios specific error handling
        // console.error('Axios Error:', error.response?.data);
        Alert.alert(
          error.response?.data.message,
          '',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.replace('Main');
              },
            },
          ],
          {cancelable: false},
        );
      } else {
        Alert.alert(
          error.message,
          '',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.replace('Main');
              },
            },
          ],
          {cancelable: false},
        );
      }

      setLoading(false);
    }
  };

  const authCurrent = () => {
    // setLoading(true);
    FingerprintScanner.authenticate({title: 'Verifikasi Bahwa Ini Benar Anda'})
      .then(() => {
        // setLoading(true);
        handleAction();
        // navigation.replace('Test1')
        FingerprintScanner.release();
      })
      .catch(error => {
        setLoading(false);
        if (error.name == 'DeviceLocked') {
          // if(timeD > 0){
          //   Alert.alert('Tunggu beberapa saat dan klik ulang tombol absen')
          // }
          // else{
          Alert.alert('Tunggu sekitar 30 detik dan klik ulang tombol absen');
          // }

          // setTimeD(30);
          // handleActionErr()
        } else if (error.name == 'DeviceLockedPermanent') {
          Alert.alert('Kunci HP Anda dan masuk dengan sandi anda');
        } else if (error.name == 'DeviceLockedPermanent') {
          Alert.alert('Kunci HP Anda dan masuk dengan sandi anda');
        } else if (error.name == 'FingerprintScannerNotEnrolled') {
          Alert.alert(
            'Aktifkan Fingerprint anda, masuk ke setting/sandi&keamanan pilih sidik jari',
          );
        } else {
          // Alert.alert('Aktifkan Fingerprint anda, masuk ke setting/sandi&keamanan pilih sidik jari')
          // test
          Alert.alert('Err Fingerprint: ', error.name);
        }
        FingerprintScanner.release();
      });
  };

  const handleAction = () => {
    setLoading(true);

    Promise.all([
      myFunctions.permissionCamera(),
      myFunctions.permissionLocation(),
    ])
      .then(res => {
        // setLoading(true);
        if (res[1]) {
          //check gps
          myFunctions
            .checkGps(false)
            .then(function (gps) {
              if (!gps.status) {
                Alert.alert(
                  'Gagal Mengirim Data',
                  'Tolong cek kembali lokasi anda',
                );
                setLoading(false);
                console.log('checkGps useeffect', 'false');
              } else {
                console.log('position', gps.data);
                //get distance
                const j = getDistance(gps.data, {
                  latitude: parseFloat(latref),
                  longitude: parseFloat(lngref),
                });
                console.log('distance j', j);

                setTest(j);
                if (j > parseInt(route.params.radius)) {
                  Alert.alert('Peringatan', 'Anda berada di luar jangkauan');
                  navigation.replace('Main');
                } else {
                  setJarak('2');
                  console.log(form.lat, form.lng);

                  console.log('radius dari gps', j);

                  if (route.params.selfie == 'OFF') {
                    Alert.alert('Hidupkan Camera');
                    setLoading(false);
                  } else if (form.lat != '' && form.lng != '') {
                    sendData(gps.data);
                  } else {
                    console.log('data : ', form);
                    Alert.alert('Lengkapi data terlebih dahulu');
                    setLoading(false);
                    navigation.replace('Main');
                  }
                }

                // positionNew = position
                console.log(
                  'posisiisii ',
                  gps.data.latitude,
                  gps.data.longitude,
                );
                setForm({
                  ...form,
                  lat: gps.data.latitude,
                  lng: gps.data.longitude,
                });
              }
            })
            .catch(error => {
              console.log('err checkGps handleaction', error.message);
              navigation.replace('Main');
              setLoading(false);
            });
        } else {
          Alert.alert(
            'Location Permission',
            'Location Permission tidak diizinkan.',
          );
          navigation.replace('Main');
        }
        // setLoading(false);
      })
      .catch(e => {
        console.log('err promise all', e);
        setLoading(false);
      });
  };

  if (fakeGpsV === 2) {
    return (
      <View>
        <Text>
          Anda Menggunakan Fake GPS Tolong Matikan Fake GPS dan restart HP Anda
          Kembali
        </Text>
      </View>
    );
  } else if (!loading && jarak != '' && fakeGpsV != 0) {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#4DC2B7'}}>
        {/* <Text>{timeD}</Text> */}
        <ScrollView
          scrollEnabled={true}
          contentContainerStyle={styles.scrollView}
          nestedScrollEnabled={true}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View style={{alignItems: 'center'}}>
            <Text
              style={[
                {marginVertical: windowHeight * 0.01},
                jarak == '1' ? {color: '#ff0000'} : '',
              ]}>
              anda berada di{' '}
              {jarak == '1' ? 'luar Jangkauan' : 'Dalam Jangkauan'}
            </Text>

            <Text style={[{marginVertical: windowHeight * 0.05, fontSize: 24}]}>
              Absen
            </Text>
            <View
              style={{
                height: windowHeight * 0.3,
                width: windowWidht * 0.8,
                backgroundColor: '#FFFFFF',
              }}>
              <MapView
                style={{flex: 1}} //window pake Dimensions
                // showsUserLocation={true}
                showsMyLocationButton={true}
                region={{
                  latitude: parseFloat(latref),
                  longitude: parseFloat(lngref),
                  latitudeDelta: 0.00683,
                  longitudeDelta: 0.0035,
                }}>
                <Circle
                  center={{
                    latitude: parseFloat(latref),
                    longitude: parseFloat(lngref),
                  }}
                  radius={parseInt(route.params.radius)}
                  strokeWidth={1}
                  strokeColor="#ff0000"
                  fillColor="#ff000030"
                />

                <Marker
                  coordinate={{
                    latitude: parseFloat(latref),
                    longitude: parseFloat(lngref),
                  }}>
                  <Callout>
                    <View>
                      <Text>Posisi Kantor</Text>
                    </View>
                  </Callout>
                </Marker>

                <Marker
                  pinColor={'blue'}
                  coordinate={{
                    latitude: form.lat,
                    longitude: form.lng,
                  }}>
                  <Callout>
                    <View>
                      <Text>Posisi Anda</Text>
                    </View>
                  </Callout>
                </Marker>
              </MapView>
            </View>
            <Text>Map</Text>
            {/* <View>
              <TouchableOpacity
                onPress={() =>
                  navigation.replace('CamDect', {
                    highAccuracy: false,
                    fingerfrint: route.params.fingerfrint,
                    selfie: route.params.selfie,
                    link: 'Absence',
                    lat: latref,
                    lng: lngref,
                    radius: route.params.radius,
                    user_id: route.params.user_id,
                    image: null,
                    id_jadwalKerja: route.params.id_jadwalKerja,
                  })
                }>
                {route.params.image == null ? (
                  <View style={styles.image}>
                    <Icon
                      name="camera-retro"
                      size={windowHeight * 0.08}
                      color="#000000"
                    />
                  </View>
                ) : (
                  <Image
                    style={styles.image}
                    source={{uri: route.params.image.uri}}
                  />
                )}
              </TouchableOpacity>
              <Text>Image</Text>
            </View> */}
          </View>
        </ScrollView>
        <TouchableOpacity
          style={[styles.btn]}
          onPress={() => {
            authCurrent();
          }}>
          <Text style={{color: '#FFFFFF', fontSize: 24, fontWeight: 'bold'}}>
            Absen
          </Text>
        </TouchableOpacity>

        {jarak != 1 && route.params.fingerfrint == 'OFF' && finger == 'ON' && (
          <TouchableOpacity
            style={[styles.btn]}
            onPress={() => {
              handleAction();
            }}>
            <Text style={{color: '#FFFFFF', fontSize: 24, fontWeight: 'bold'}}>
              Absen
            </Text>
          </TouchableOpacity>
        )}

        {jarak != 1 && route.params.fingerfrint == 'ON' && finger == 'OFF' && (
          <TouchableOpacity
            style={[styles.btn]}
            onPress={() => {
              handleAction();
            }}>
            <Text style={{color: '#FFFFFF', fontSize: 24, fontWeight: 'bold'}}>
              Absen
            </Text>
          </TouchableOpacity>
        )}

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
      </SafeAreaView>
    );
  } else {
    return <ScreenLoading />;
  }
};

export default Absence;

const windowWidht = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  mapS: {
    width: windowWidht * 0.8,
    height: windowHeight * 0.25,
    backgroundColor: '#FFFFFF',
  },
  image: {
    alignItems: 'center',
    justifyContent: 'center',
    width: windowWidht * 0.7,
    height: windowWidht * 1.0,
    backgroundColor: '#00000010',
  },
  btn: {
    width: windowWidht * 0.76,
    height: windowHeight * 0.07,
    backgroundColor: '#00B2FF',
    marginLeft: 'auto',
    marginRight: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
