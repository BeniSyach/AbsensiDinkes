import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  RefreshControl,
  TextInput,
  PermissionsAndroid,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Footer} from '../../component';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import API from '../../service';
import {useState} from 'react';
import {useEffect} from 'react';
import myFunctions from '../../functions';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useIsFocused} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {
  email,
  gender,
  home,
  key,
  location,
  logo_rsud,
  nama,
  phone,
  shift,
  user,
} from '../../assets';
import axios from 'axios';
import Config from 'react-native-config';
import SelectDropdown from 'react-native-select-dropdown';

const User = ({navigation, route}) => {
  const [visible, setVisible] = useState(true);
  const TOKEN = useSelector(state => state.RefreshTokenReducer);
  const USER = useSelector(state => state.UserReducer);
  const [data, setData] = useState({});
  const [refreshing, setRefreshing] = React.useState(false);
  const [dataShift, setDataShift] = useState({});
  const [imageUri, setImageUri] = useState('');
  const [FilteredShiftData, setFilteredShiftData] = useState('');
  const [selectedShift, setSelectedShift] = useState(null);
  const isFocused = useIsFocused();
  const [form, setForm] = useState({
    email: data.email,
    password: data.password,
    password2: data.password,
    hp: data.no_hp,
    alamat: data.alamat,
    nik: data.nik,
    nama: data.nama,
    puskesmas: data.id_puskesmas,
    gender: data.gender,
    shift: selectedShift,
    agama: data.id_agama,
    status: data.status,
  });

  const getData = () => {
    API.menu(USER.userId, TOKEN).then(result => {
      if (result) {
        console.log('data2', result);
        setData(result.UsersById);
        // setLoading(false)
      } else {
        Alert.alert(result.message);
      }
    });
  };

  const getDataShift = () => {
    API.shift(TOKEN).then(result => {
      if (result) {
        console.log('data shift api', result);
        setDataShift(result);
        // setLoading(false)
      } else {
        Alert.alert(result.message);
      }
    });
  };
  console.log('data shift', dataShift);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getData();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    getData();
    getDataShift();
  }, []);

  const editDataUser = async () => {
    if (form.shift == null || form.shift == '') {
      Alert.alert(
        'Silahkan Pilih data Shift',
        '',
        [
          {
            text: 'OK',
          },
        ],
        {cancelable: false},
      );
    } else {
      try {
        // Refresh the token
        const refreshResponse = await axios.get(
          `${Config.REACT_APP_BASE_URL}/auth/token`,
          {
            headers: {
              Cookie: `refreshToken=${TOKEN}`,
            },
          },
        );

        const newToken = refreshResponse.data.akses_token;

        // Prepare form data with file and other field

        // Upload the file with the refreshed token
        const req = await axios.put(
          Config.REACT_APP_BASE_URL + '/users/edit-users',
          {
            id: USER.userId.toString(),
            nama: form.nama,
            email: form.email,
            nik: form.nik,
            no_hp: form.hp,
            alamat: form.alamat,
            gender: form.gender,
            id_puskesmas: form.puskesmas,
            id_agama: form.agama,
            id_shift: form.shift,
            status: form.status,
          },
          {
            headers: {
              Authorization: `Bearer ${newToken}`,
            },
          },
        );

        console.log('File uploaded successfully:', req.data);
        const {status, message} = req.data;
        if (status == false) {
          Alert.alert(
            message,
            '',
            [
              {
                text: 'OK',
              },
            ],
            {cancelable: false},
          );
        } else {
          Alert.alert(
            'Sukses Mengubah Profil Anda',
            '',
            [
              {
                text: 'OK',
              },
            ],
            {cancelable: false},
          );
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        Alert.alert('Gagal Mengubah Profil Anda');
      }
    }
  };

  const editDataPassword = async () => {
    if (
      form.password == null ||
      form.password == '' ||
      form.password2 == null ||
      form.password2 == ''
    ) {
      Alert.alert(
        'Silahkan input password terlebih dahulu',
        '',
        [
          {
            text: 'OK',
          },
        ],
        {cancelable: false},
      );
    } else if (form.password === form.password2) {
      try {
        // Refresh the token
        const refreshResponse = await axios.get(
          `${Config.REACT_APP_BASE_URL}/auth/token`,
          {
            headers: {
              Cookie: `refreshToken=${TOKEN}`,
            },
          },
        );

        const newToken = refreshResponse.data.akses_token;

        // Prepare form data with file and other field

        // Upload the file with the refreshed token
        const req = await axios.put(
          Config.REACT_APP_BASE_URL + '/users/edit-password-users',
          {
            id: USER.userId.toString(),
            password: form.password,
            password2: form.password2,
          },
          {
            headers: {
              Authorization: `Bearer ${newToken}`,
            },
          },
        );

        console.log('File uploaded successfully:', req.data);
        const {status, message} = req.data;
        if (status == false) {
          Alert.alert(
            message,
            '',
            [
              {
                text: 'OK',
              },
            ],
            {cancelable: false},
          );
        } else {
          Alert.alert(
            'Sukses Mengubah Profil Anda',
            '',
            [
              {
                text: 'OK',
              },
            ],
            {cancelable: false},
          );
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        Alert.alert('Gagal Mengubah Profil Anda');
      }
    } else {
      Alert.alert(
        'Ubah Password Gagal',
        '',
        [
          {
            text: 'OK',
          },
        ],
        {cancelable: false},
      );
    }
  };

  const logout = async () => {
    try {
      // Refresh the token
      const refreshResponse = await axios.get(
        `${Config.REACT_APP_BASE_URL}/auth/token`,
        {
          headers: {
            Cookie: `refreshToken=${TOKEN}`,
          },
        },
      );

      const newToken = refreshResponse.data.akses_token;

      // Prepare form data with file and other field

      // Upload the file with the refreshed token
      const req = await axios.delete(
        Config.REACT_APP_BASE_URL + '/auth/logout',
        {
          headers: {
            Authorization: `Bearer ${newToken}`,
            Cookie: `refreshToken=${TOKEN}`,
          },
        },
      );

      const {status, message} = req.data;
      if (status == true) {
        AsyncStorage.clear();
        navigation.navigate('Login');
      } else {
        Alert.alert('Gagal Logout');
      }
    } catch (error) {
      console.error('Error Logout:', error);
      Alert.alert('Gagal Logout');
    }
  };

  const getImageCamera = () => {
    launchCamera(
      {
        mediaType: 'photo',
        includeBase64: true,
        maxHeight: 500,
        maxWidth: 500,
      },
      async response => {
        if (response && response.assets) {
          if (response && response.assets && response.assets[0].uri != '') {
            setImageUri(response.assets[0].uri);
            console.log('data foto', response);
            try {
              // Refresh the token
              const refreshResponse = await axios.get(
                `${Config.REACT_APP_BASE_URL}/auth/token`,
                {
                  headers: {
                    Cookie: `refreshToken=${TOKEN}`,
                  },
                },
              );

              const newToken = refreshResponse.data.akses_token;

              // Prepare form data with file and other fields
              const formData = new FormData();
              formData.append('id', USER.userId);
              formData.append('photo', {
                uri: response && response.assets && response.assets[0].uri,
                type: response && response.assets && response.assets[0].type,
                name:
                  response && response.assets && response.assets[0].fileName,
              });

              // Upload the file with the refreshed token
              const req = await axios.post(
                Config.REACT_APP_BASE_URL + '/users/edit-foto-users',
                formData,
                {
                  headers: {
                    Authorization: `Bearer ${newToken}`,
                    'Content-Type': 'multipart/form-data',
                  },
                },
              );

              console.log('File uploaded successfully:', req.data);
              Alert.alert(
                'Sukses Mengganti Foto Profile',
                '',
                [
                  {
                    text: 'OK',
                  },
                ],
                {cancelable: false},
              );
            } catch (error) {
              console.error('Error uploading file:', error);
              Alert.alert('Gagal Mengganti Foto Profil');
            }

            // // batas
            // RNFetchBlob.fetch(
            //   'POST',
            //   'http://192.168.68.110:5000/api/close/absence/user/update',
            //   {
            //     //  Authorization: `Bearer ${TOKEN}`,
            //     //  otherHeader: 'foo',
            //     Accept: 'application/json',
            //     'Content-Type': 'multipart/form-data',
            //   },
            //   [
            //     {
            //       name: 'image',
            //       filename: response.assets[0].fileName,
            //       data: response.assets[0].base64,
            //     },
            //     {name: 'id', data: USER.staff_id.toString()},
            //   ],
            // )
            //   .then(result => {
            //     //  setLoading(false)
            //     //  let data = JSON.parse(result.data);
            //     // console.log('data post12',data.data.id

            //     // dispatch(SET_DATA_USER({
            //     //     ...USER,
            //     //     image: result.image_name,
            //     // }))

            //     //  console.log('data post',data)
            //     getData();
            //     //  navigation.goBack()
            //   })
            //   .catch(e => {
            //     //    console.log(e);
            //     alert(e);
            //     //  setLoading(false)
            //   });
          } else {
            //  setLoading(false)
            Alert.alert('Mohon Lengkapi data');
          }
        } else {
        }
      },
    );
  };

  useEffect(() => {
    // Set nilai default shift ketika ada data shift dan id shift yang akan dipilih
    if (
      dataShift.length > 0 &&
      data &&
      data.shift &&
      data.shift.nama !== null
    ) {
      const selectedShiftData = dataShift.find(
        item => item.id == data.shift.id,
      );
      console.log('data shift yang sudah di pilih', selectedShiftData);
      // console.log('data shift yang sudah di pilih', data.shift.id);
      if (selectedShiftData) {
        setSelectedShift(selectedShiftData.id);
      }
    }
  }, [dataShift, selectedShift]);

  const fotoUrl = `http://103.114.111.178:3035/uploads/img/profil/${data.foto}`;
  console.log('data foto', fotoUrl);
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#4DC2B7'}}>
      <ScrollView
        scrollEnabled={true}
        contentContainerStyle={styles.scrollView}
        nestedScrollEnabled={true}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
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
            <TouchableOpacity onPress={() => getImageCamera()}>
              {data.foto == '' ||
              data.foto == null ||
              data.foto == undefined ? (
                <View style={styles.image}>
                  <Icon
                    name="camera-retro"
                    size={windowHeight * 0.08}
                    color="#000000"
                  />
                </View>
              ) : (
                <Image style={styles.image} source={{uri: fotoUrl}} />
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.floatingScreen}>
            <View
              style={{
                flexDirection: 'row',
                width: windowWidht * 0.5,
                marginHorizontal: windowWidht * 0.1,
                marginBottom: 20,
                marginTop: windowHeight * 0.03,
              }}>
              <Image
                source={key}
                style={{
                  width: windowWidht * 0.05,
                  height: windowHeight * 0.02,
                  resizeMode: 'contain',
                }}
              />
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
                    size={windowHeight * 0.03}
                    color="#000000"
                  />
                )}
                {visible && (
                  <Icon name="eye" size={windowHeight * 0.03} color="#000000" />
                )}
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'row',
                width: windowWidht * 0.5,
                marginHorizontal: windowWidht * 0.03,
              }}>
              <Image
                source={key}
                style={{
                  width: windowWidht * 0.05,
                  height: windowHeight * 0.02,
                  resizeMode: 'contain',
                }}
              />
              <TextInput
                style={styles.formInput}
                placeholder="Konfirmasi Password"
                secureTextEntry={visible}
                onChangeText={item => setForm({...form, password2: item})}
              />
              <TouchableOpacity
                onPress={() => {
                  !visible ? setVisible(true) : setVisible(false);
                }}>
                {!visible && (
                  <Icon
                    name="eye-slash"
                    size={windowHeight * 0.03}
                    color="#000000"
                  />
                )}
                {visible && (
                  <Icon name="eye" size={windowHeight * 0.03} color="#000000" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            width: windowWidht * 0.9,
            height: windowHeight * 0.29,
            borderRadius: 40,
            alignItems: 'flex-start',
            backgroundColor: '#dadf00',
            borderWidth: 1,
            marginBottom: 20,
            borderColor: 'rgba(0,0,0,0.5)',
          }}>
          <View
            style={{
              flexDirection: 'row',
              width: windowWidht * 0.5,
              marginHorizontal: windowWidht * 0.03,
              marginBottom: 20,
              marginTop: windowHeight * 0.03,
            }}>
            <Image
              source={user}
              style={{
                width: windowWidht * 0.05,
                height: windowHeight * 0.02,
                resizeMode: 'contain',
              }}
            />
            <TextInput
              style={styles.formInput1}
              placeholder="Masukan Nik"
              defaultValue={data.nik}
              onChangeText={item => setForm({...form, nik: item})}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: windowWidht * 0.5,
              marginHorizontal: windowWidht * 0.03,
            }}>
            <Image
              source={nama}
              style={{
                width: windowWidht * 0.05,
                height: windowHeight * 0.02,
                resizeMode: 'contain',
              }}
            />
            <TextInput
              style={styles.formInput1}
              placeholder="Masukkan nama"
              defaultValue={data.nama}
              onChangeText={item => setForm({...form, nama: item})}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: windowWidht * 0.5,
              marginHorizontal: windowWidht * 0.03,
              marginBottom: 20,
              marginTop: windowHeight * 0.03,
            }}>
            <Image
              source={home}
              style={{
                width: windowWidht * 0.05,
                height: windowHeight * 0.02,
                resizeMode: 'contain',
              }}
            />
            <TextInput
              style={styles.formInput1}
              placeholder="Masukkan Alamat"
              defaultValue={data.alamat}
              onChangeText={item => setForm({...form, alamat: item})}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: windowWidht * 0.5,
              marginHorizontal: windowWidht * 0.03,
            }}>
            <Image
              source={phone}
              style={{
                width: windowWidht * 0.05,
                height: windowHeight * 0.02,
                resizeMode: 'contain',
              }}
            />
            <TextInput
              style={styles.formInput1}
              placeholder="Masukkan No Hp"
              defaultValue={data.no_hp}
              onChangeText={item => setForm({...form, hp: item})}
            />
          </View>
        </View>
        <View
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            width: windowWidht * 0.9,
            height: windowHeight * 0.22,
            borderRadius: 40,
            alignItems: 'flex-start',
            backgroundColor: '#dadf00',
            borderWidth: 1,
            marginBottom: 20,
            borderColor: 'rgba(0,0,0,0.5)',
          }}>
          <View
            style={{
              flexDirection: 'row',
              width: windowWidht * 0.5,
              marginHorizontal: windowWidht * 0.03,
              marginBottom: 20,
              marginTop: windowHeight * 0.03,
            }}>
            <Image
              source={email}
              style={{
                width: windowWidht * 0.05,
                height: windowHeight * 0.02,
                resizeMode: 'contain',
              }}
            />
            <TextInput
              style={styles.formInput1}
              placeholder="Masukan Email"
              defaultValue={data.email}
              onChangeText={item => setForm({...form, email: item})}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: windowWidht * 0.5,
              marginHorizontal: windowWidht * 0.03,
            }}>
            <Image
              source={location}
              style={{
                width: windowWidht * 0.05,
                height: windowHeight * 0.02,
                resizeMode: 'contain',
              }}
            />
            <TextInput
              style={styles.formInput1}
              placeholder="masukkan nama puskesmas"
              defaultValue={data && data.puskesmas && data.puskesmas.nama}
              onChangeText={item => setForm({...form, puskesmas: item})}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: windowWidht * 0.5,
              marginHorizontal: windowWidht * 0.03,
              marginBottom: 20,
              marginTop: windowHeight * 0.03,
            }}>
            <Image
              source={gender}
              style={{
                width: windowWidht * 0.05,
                height: windowHeight * 0.02,
                resizeMode: 'contain',
              }}
            />
            <TextInput
              style={styles.formInput1}
              placeholder="Masukkan Jenis Kelamin"
              defaultValue={data.gender}
              onChangeText={item => setForm({...form, gender: item})}
            />
          </View>
        </View>
        <View
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            width: windowWidht * 0.9,
            height: windowHeight * 0.1,
            borderRadius: 40,
            alignItems: 'flex-start',
            backgroundColor: '#dadf00',
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.5)',
          }}>
          <View
            style={{
              flexDirection: 'row',
              width: windowWidht * 0.5,
              marginHorizontal: windowWidht * 0.03,
              marginBottom: 20,
              marginTop: windowHeight * 0.03,
            }}>
            <Image
              source={shift}
              style={{
                width: windowWidht * 0.05,
                height: windowHeight * 0.02,
                resizeMode: 'contain',
              }}
            />
            <SelectDropdown
              style={{
                backgroundColor: '#dadf00',
              }}
              itemStyle={{
                backgroundColor: '#dadf00', // Ganti warna latar belakang pilihan yang dipilih
              }}
              data={dataShift}
              onSelect={(selectedItem, index) => {
                setSelectedShift(selectedItem.id);
                setForm({...form, shift: selectedItem.id});
              }}
              search
              onSearch={text => {
                const filteredData = dataShift.filter(item =>
                  item.nama.toLowerCase().includes(text.toLowerCase()),
                );
                setFilteredShiftData(filteredData);
              }}
              defaultButtonText={'Pilih Jadwal'}
              defaultdefaultValue={selectedShift}
              buttonTextAfterSelection={(selectedItem, index) =>
                selectedItem.nama
              }
              rowTextForSelection={(item, index) => item.nama}
              buttonStyle={{
                borderBottomWidth: 1,
                borderBottomColor: '#dadf00',
                backgroundColor: '#dadf00',
                width: windowWidht * 0.7,
                marginTop: -windowHeight * 0.01,
                marginLeft: windowWidht * 0.2,
              }}
              buttonTextStyle={{
                fontSize: 16,
                backgroundColor: '#dadf00',
                borderBottomWidth: 1,
                borderBottomColor: 'grey',
              }}
              renderDropdownIcon={isOpened => {
                return (
                  <Icon
                    name={isOpened ? 'chevron-up' : 'chevron-down'}
                    color={'#444'}
                    size={18}
                  />
                );
              }}
              selectedItemColor={'#dadf00'}
              dropdownIconPosition={'right'}
              dropdownStyle={{
                width: windowWidht * 0.7,
                marginTop: -windowHeight * 0.02,
                marginLeft: windowWidht * 0.05,
                backgroundColor: '#dadf00',
              }}
              rowStyle={{
                borderBottomWidth: 1,
                borderBottomColor: '#dadf00',
              }}
              rowTextStyle={{
                fontSize: 16,
                paddingVertical: 10,
              }}
              selectedRowStyle={{
                backgroundColor: '#dadf00',
              }}
              searchInputStyle={{
                borderBottomWidth: 1,
                borderBottomColor: '#dadf00',
                fontSize: 16,
              }}
              searchPlaceHolder={'Pilih Shift'}
              searchPlaceHolderColor={'darkgrey'}
              renderSearchInputLeftIcon={() => {
                return <Icon name={'search'} color={'#444'} size={18} />;
              }}
            />

            {/* <TextInput
              style={styles.formInput1}
              placeholder="Shift Kerja"
              defaultValue={data && data.shift && data.shift.nama}
              onChangeText={item => setForm({...form, shift: item})}
            /> */}
          </View>
        </View>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={{
              backgroundColor: '#dadf00',
              marginVertical: windowHeight * 0.01,
              width: windowWidht * 0.3,
              height: windowHeight * 0.06,
              borderWidth: 1,
              borderRadius: 2,
              borderColor: '#00000030',
              marginStart: windowWidht * 0.06,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 30,
            }}
            onPress={() => {
              Alert.alert(
                'Peringatan',
                'Apakah Anda Yakin Mengubah Data Anda ?',
                [
                  {
                    text: 'Batal',
                    style: 'cancel',
                  },
                  {
                    text: 'OK',
                    onPress: () => {
                      editDataUser();
                    },
                  },
                ],
                {cancelable: true},
              );
            }}>
            <Text style={styles.btnText}>Simpan</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: '#dadf00',
              marginVertical: windowHeight * 0.01,
              width: windowWidht * 0.3,
              height: windowHeight * 0.06,
              borderWidth: 1,
              borderRadius: 2,
              borderColor: '#00000030',
              marginStart: windowWidht * 0.01,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 30,
            }}
            onPress={() => {
              editDataPassword();
            }}>
            <Text style={styles.btnText}>Edit Password</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: 'red',
              marginVertical: windowHeight * 0.01,
              width: windowWidht * 0.3,
              height: windowHeight * 0.06,
              borderWidth: 1,
              borderRadius: 2,
              borderColor: '#00000030',
              marginStart: windowWidht * 0.01,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 30,
            }}
            onPress={() => {
              Alert.alert(
                'Peringatan',
                'Apakah Anda Yakin Keluar Dari Aplikasi ?',
                [
                  {
                    text: 'Batal',
                    style: 'cancel',
                  },
                  {
                    text: 'OK',
                    onPress: () => {
                      logout();
                    },
                  },
                ],
                {cancelable: true},
              );
            }}>
            <Text style={styles.btnText}>Logout</Text>
          </TouchableOpacity>
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
  );
};

export default User;

const windowWidht = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  box: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: windowWidht * 0.8,
  },
  formInput: {
    borderBottomWidth: 1,
    width: windowWidht * 0.35,
    marginTop: -windowHeight * 0.02,
    borderBottomColor: 'grey',
    marginLeft: windowWidht * 0.05,
    fontSize: 16,
  },
  formInput1: {
    borderBottomWidth: 1,
    width: windowWidht * 0.7,
    marginTop: -windowHeight * 0.02,
    borderBottomColor: 'grey',
    marginLeft: windowWidht * 0.05,
    fontSize: 16,
  },
  floatingScreen: {
    // marginTop: windowHeight * 0.02,
    width: windowWidht * 0.6,
    height: windowHeight * 0.15,
    borderRadius: 40,
    alignItems: 'center',
    backgroundColor: '#dadf00',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.5)',
  },
  title1: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: windowHeight * 0.04,
    marginBottom: windowHeight * 0.02,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  title: {
    width: windowWidht * 0.2,
    fontWeight: 'bold',
    color: '#000000',
  },
  data: {
    width: windowWidht * 0.6,
    color: '#000000',
  },
  image: {
    alignItems: 'center',
    justifyContent: 'center',
    width: windowWidht * 0.3,
    height: windowHeight * 0.14,
    backgroundColor: '#FFFFFF',
    resizeMode: 'contain',
    borderRadius: 80,
    marginBottom: windowHeight * 0.03,
  },
  label2: {
    margin: 5,
    fontSize: 25,
  },
  btnText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
