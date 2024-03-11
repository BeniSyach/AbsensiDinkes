import {
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {useEffect} from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import myFunctions from '../../functions';
import {home, logo_rsud, nama, pengajuan, phone, user} from '../../assets';
import {useSelector} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import DocumentPicker from 'react-native-document-picker';
import Config from 'react-native-config';
import axios from 'axios';

const Requests = ({navigation, route}) => {
  const TOKEN = useSelector(state => state.RefreshTokenReducer);
  const [date, setDate] = useState('0000-00-00');
  const [time, setTime] = useState('00:00');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const USER = useSelector(state => state.UserReducer);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  console.log('data user', USER);
  const [form, setForm] = useState({
    judul_acara: null,
    start: null,
    time: null,
    hari: null,
  });

  // menampilkan tanggal
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    // setLoading(true);
    // if(Cdate > date){
    //   alert('tanggal pengajuan harus lebih besar dari tanggal saat ini')

    // }
    // else{
    const dated =
      date.getFullYear() +
      '-' +
      ('0' + (date.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + date.getDate()).slice(-2);
    console.log('ssssssaa', dated);
    setForm({...form, start: dated});
    setDate(dated);
    // }
    hideDatePicker();
  };

  // menampilkan jam
  const showTimePicker = () => {
    setTimePickerVisible(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisible(false);
  };

  const handleTimeConfirm = time => {
    setTime(time.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}));
    setForm({
      ...form,
      time: time.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
    });
    hideTimePicker();
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      console.log(
        'data file',
        result,
        result[0].uri,
        result[0].type, // mime type
        result[0].name,
        result[0].size,
      );

      setSelectedFile(result[0]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
        console.log('User cancelled the picker');
      } else {
        throw err;
      }
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) {
      Alert.alert('File Belum Di Pilih');
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

        // Prepare form data with file and other fields
        const formData = new FormData();
        formData.append('user_id', USER.userId);
        formData.append('tanggal', date);
        formData.append('waktu', time);
        formData.append('judul', form.judul_acara);
        // formData.append('judul', form.judul_acara); mau dibikin lokasi
        formData.append('hari', form.hari);
        formData.append('file', {
          uri: selectedFile.uri,
          type: selectedFile.type,
          name: selectedFile.name,
        });

        // Upload the file with the refreshed token
        const response = await axios.post(
          Config.REACT_APP_BASE_URL + '/pengajuan/Tambah-Pengajuan',
          formData,
          {
            headers: {
              Authorization: `Bearer ${newToken}`,
              'Content-Type': 'multipart/form-data',
            },
          },
        );

        console.log('File uploaded successfully:', response.data);
        Alert.alert(
          'Sukes Mengirim Data SPT',
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
      } catch (error) {
        console.error('Error uploading file:', error.message);
        Alert.alert('Gagal Mengirim Data SPT');
      }
    }
  };

  useEffect(() => {
    // if(isFocused){
    console.log('test');
    myFunctions.permissionCamera();
    //    }
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#4DC2B7'}}>
      <View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: windowHeight * 0.06,
            marginBottom: windowHeight * 0.03,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={pengajuan}
            style={{width: 50, height: 70, marginEnd: 10}}
          />
          <Text
            style={{
              fontSize: 28,
              fontWeight: 'bold',
              color: '#000000',
              marginTop: 10, // Sesuaikan sesuai kebutuhan
            }}>
            Upload Berkas SPT
          </Text>
        </View>
        <View
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            width: windowWidht * 0.9,
            height: windowHeight * 0.65,
            borderRadius: 40,
            alignItems: 'flex-start',
            backgroundColor: '#dadf00',
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.5)',
          }}>
          <View
            style={{
              flexDirection: 'row',
              marginTop: windowHeight * 0.02,
            }}>
            <View
              style={{
                flexDirection: 'column',
                marginStart: windowHeight * 0.02,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  paddingTop: 10,
                  paddingLeft: 10,
                }}>
                Tanggal
              </Text>
              <TouchableOpacity style={styles.input} onPress={showDatePicker}>
                <Text style={styles.text}>{date}</Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />
            </View>

            <View
              style={{
                flexDirection: 'column',
                marginBottom: 20,
                marginStart: windowHeight * 0.01,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  paddingTop: 10,
                  paddingLeft: 10,
                }}>
                Jam/Waktu
              </Text>
              <TouchableOpacity style={styles.input} onPress={showTimePicker}>
                <Text style={styles.text}>{time}</Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isTimePickerVisible}
                mode="time"
                onConfirm={handleTimeConfirm}
                onCancel={hideTimePicker}
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
            <View
              style={{
                flexDirection: 'column',
              }}>
              <Text
                style={{
                  fontSize: 18,
                  paddingTop: 10,
                  paddingLeft: 10,
                }}>
                Judul Acara
              </Text>
              <TextInput
                style={{
                  width: windowWidht * 0.8,
                  height: windowHeight * 0.063,
                  borderWidth: 1,
                  backgroundColor: '#FFFFFF',
                  marginLeft: windowWidht * 0.03,
                  paddingVertical: 5,
                  borderRadius: 20,
                  marginRight: 'auto',
                  marginLeft: 'auto',
                  fontSize: 18,
                }}
                placeholder="Masukkan Judul Acara"
                onChangeText={text => setForm({...form, judul_acara: text})}
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              // marginLeft: 'auto',
              // marginRight: 'auto',
            }}>
            <View
              style={{
                flexDirection: 'column',
                marginStart: windowHeight * 0.02,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  paddingTop: 10,
                  paddingLeft: 10,
                }}>
                Lama Acara
              </Text>
              <TextInput
                style={{
                  width: windowWidht * 0.2,
                  height: windowHeight * 0.063,
                  borderWidth: 1,
                  backgroundColor: '#FFFFFF',
                  marginLeft: windowWidht * 0.03,
                  paddingVertical: 5,
                  borderRadius: 20,
                  marginRight: 'auto',
                  marginLeft: 'auto',
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  fontSize: 18,
                }}
                maxLength={2}
                keyboardType="numeric"
                placeholder="Hari"
                onChangeText={text => setForm({...form, hari: text})}
              />
            </View>
          </View>
          <View
            style={{
              backgroundColor: '#4DC2B7',
              marginVertical: windowHeight * 0.01,
              width: windowWidht * 0.3,
              height: windowHeight * 0.06,
              borderWidth: 1,
              borderRadius: 2,
              borderColor: '#00000030',
              marginStart: 'auto',
              marginStart: 30,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 30,
            }}>
            <TouchableOpacity style={styles.btnText} onPress={pickDocument}>
              <Text style={styles.btnText}>Upload File</Text>
            </TouchableOpacity>
          </View>
          {selectedFile && (
            <View
              style={{
                backgroundColor: '#4DC2B7',
                marginVertical: windowHeight * 0.01,
                width: windowWidht * 0.6,
                height: windowHeight * 0.06,
                borderWidth: 1,
                borderRadius: 2,
                borderColor: '#00000030',
                marginStart: 'auto',
                marginStart: 30,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 30,
              }}>
              <Text style={styles.btnText}>Nama File: {selectedFile.name}</Text>
              {/* <Button title="Upload File" onPress={uploadFile} /> */}
            </View>
          )}
          <TouchableOpacity
            style={{
              backgroundColor: '#4DC2B7',
              marginVertical: windowHeight * 0.01,
              width: windowWidht * 0.3,
              height: windowHeight * 0.06,
              borderWidth: 1,
              borderRadius: 2,
              borderColor: '#00000030',
              marginStart: 'auto',
              marginEnd: 30,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 30,
            }}
            onPress={() => {
              uploadFile();
            }}>
            <Text style={styles.btnText}>Simpan</Text>
          </TouchableOpacity>
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
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Requests;

const windowWidht = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  input: {
    width: windowWidht * 0.4,
    height: windowHeight * 0.06,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    marginRight: 'auto',
    marginLeft: 'auto',
    marginVertical: windowHeight * 0.01,
    borderRadius: 20,
  },
  text: {
    fontSize: 18,
    paddingTop: 10,
    paddingLeft: 10,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  listMenu: {
    marginVertical: windowHeight * 0.01,
    width: windowWidht * 0.4,
    height: windowHeight * 0.06,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#00000030',
    marginStart: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  formInput1: {
    borderBottomWidth: 1,
    width: windowWidht * 0.7,
    marginTop: -windowHeight * 0.02,
    borderBottomColor: 'grey',
    marginLeft: windowWidht * 0.05,
    fontSize: 16,
  },
});
