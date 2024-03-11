import {
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {logo_dinkes} from '../../assets';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {SafeAreaView} from 'react-native-safe-area-context';
import Config from 'react-native-config';
import axios from 'axios';
import {useSelector} from 'react-redux';

const ListHistory = ({navigation, route}) => {
  // console.log(route.params);

  const today = new Date();
  // Mendapatkan informasi tanggal, bulan, dan tahun
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Ingat: bulan dimulai dari 0
  const year = today.getFullYear();

  // Menggabungkan informasi untuk membentuk format 'DD-MM-YYYY'
  const formattedDate = `${day}-${month}-${year}`;

  const USER = useSelector(state => state.UserReducer);
  const TOKEN = useSelector(state => state.RefreshTokenReducer);
  const [date, setDate] = useState(formattedDate);
  const [date2, setDate2] = useState(formattedDate);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDatePickerVisible2, setDatePickerVisibility2] = useState(false);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  // menampilkan tanggal
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    const formattedDate = date.toLocaleDateString('en-GB'); // 'DD-MM-YYYY' format
    console.log('formatted date', formattedDate);

    setDate(formattedDate);

    hideDatePicker();
    getData();
  };

  // menampilkan tanggal
  const showDatePicker2 = () => {
    setDatePickerVisibility2(true);
  };

  const hideDatePicker2 = () => {
    setDatePickerVisibility2(false);
  };

  const handleConfirm2 = date => {
    const formattedDate2 = date.toLocaleDateString('en-GB'); // 'DD-MM-YYYY' format
    console.log('formatted date', formattedDate2);

    setDate2(formattedDate2);

    hideDatePicker2();
    getData();
  };

  const getData = async () => {
    setLoading(true);
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
        Config.REACT_APP_BASE_URL + '/laporan/Data-Laporan-By-Tanggal',
        {
          tanggal_awal: date,
          tanggal_akhir: date2,
          id_user: USER.userId,
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
      if (data.status == true) {
        console.log('data history api', data);
        setData(data.message);
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
    }
    setLoading(false);
  };

  useEffect(() => {
    // Mendapatkan tanggal sekarang
    const today = new Date();

    // Mendapatkan informasi tanggal, bulan, dan tahun
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Ingat: bulan dimulai dari 0
    const year = today.getFullYear();

    // Menggabungkan informasi untuk membentuk format 'DD-MM-YYYY'
    const formattedDate = `${day}-${month}-${year}`;

    // Menetapkan tanggal ke state
    setDate(formattedDate);
    setDate2(formattedDate);
    getData();
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#4DC2B7'}}>
      <ScrollView
        scrollEnabled={true}
        contentContainerStyle={styles.scrollView}
        nestedScrollEnabled={true}>
        <Image
          source={logo_dinkes}
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            resizeMode: 'contain',
            width: windowWidht * 0.4,
          }}
        />
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: '#000000',
            marginBottom: windowHeight * 0.01,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
          List Absensi Anda
        </Text>
        <View
          style={{
            flexDirection: 'row',
            marginTop: windowHeight * 0.02,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
          <View
            style={{
              flexDirection: 'column',
              marginBottom: 20,
            }}>
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
            <TouchableOpacity style={styles.input} onPress={showDatePicker2}>
              <Text style={styles.text}>{date2}</Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible2}
              mode="date"
              onConfirm={handleConfirm2}
              onCancel={hideDatePicker2}
            />
          </View>
        </View>
        {data.length > 0 ? (
          <View>
            {data.map((dt, index) => (
              <View key={index}>
                <View
                  style={{
                    backgroundColor: '#1e4d49',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    borderRadius: 15,
                    height: windowHeight * 0.57,
                    width: windowWidht * 0.8,
                    marginBottom: windowHeight * 0.02,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: windowWidht * 0.8,
                      backgroundColor: '#DBE000',
                      marginTop: windowHeight * 0.02,
                      width: windowWidht * 0.7,
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      borderRadius: 10,
                      height: windowHeight * 0.04,
                      justifyContent: 'space-between',
                      paddingHorizontal: 15,
                    }}>
                    <Text
                      style={{
                        marginTop: windowHeight * 0.006,
                        fontSize: 16,
                        fontWeight: 'bold',
                      }}>
                      Tanggal Masuk
                    </Text>
                    <Text
                      style={{
                        marginTop: windowHeight * 0.006,
                        fontSize: 16,
                        fontWeight: 'bold',
                      }}>
                      {dt.waktu_masuk}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: windowWidht * 0.8,
                      backgroundColor: '#DBE000',
                      marginTop: windowHeight * 0.02,
                      width: windowWidht * 0.7,
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      borderRadius: 10,
                      height: windowHeight * 0.04,
                      justifyContent: 'space-between',
                      paddingHorizontal: 15,
                    }}>
                    <Text
                      style={{
                        marginTop: windowHeight * 0.006,
                        fontSize: 16,
                        fontWeight: 'bold',
                      }}>
                      Selisih Masuk
                    </Text>
                    <Text
                      style={{
                        marginTop: windowHeight * 0.006,
                        fontSize: 16,
                        fontWeight: 'bold',
                      }}>
                      {dt.selisih_waktu_masuk}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: windowWidht * 0.7,
                      backgroundColor: '#DBE000',
                      marginTop: windowHeight * 0.02,
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      borderRadius: 10,
                      height: windowHeight * 0.06,
                      justifyContent: 'space-between',
                      paddingHorizontal: 15,
                    }}>
                    <Text
                      style={{
                        marginTop: windowHeight * 0.006,
                        fontSize: 16,
                        fontWeight: 'bold',
                      }}>
                      Lokasi Masuk
                    </Text>
                    <Text
                      style={{
                        marginTop: windowHeight * 0.006,
                        fontSize: 16,
                        fontWeight: 'bold',
                      }}>
                      {dt.longitude_masuk}, {dt.latitude_masuk}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: windowWidht * 0.8,
                      backgroundColor: '#DBE000',
                      marginTop: windowHeight * 0.02,
                      width: windowWidht * 0.7,
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      borderRadius: 10,
                      height: windowHeight * 0.04,
                      justifyContent: 'space-between',
                      paddingHorizontal: 15,
                    }}>
                    <Text
                      style={{
                        marginTop: windowHeight * 0.006,
                        fontSize: 16,
                        fontWeight: 'bold',
                      }}>
                      Keterangan Masuk
                    </Text>
                    <Text
                      style={{
                        marginTop: windowHeight * 0.006,
                        fontSize: 16,
                        fontWeight: 'bold',
                      }}>
                      {dt.keterangan_masuk}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: windowWidht * 0.8,
                      backgroundColor: '#DBE000',
                      marginTop: windowHeight * 0.02,
                      width: windowWidht * 0.7,
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      borderRadius: 10,
                      height: windowHeight * 0.04,
                      justifyContent: 'space-between',
                      paddingHorizontal: 15,
                    }}>
                    <Text
                      style={{
                        marginTop: windowHeight * 0.006,
                        fontSize: 16,
                        fontWeight: 'bold',
                      }}>
                      Waktu Pulang
                    </Text>
                    <Text
                      style={{
                        marginTop: windowHeight * 0.006,
                        fontSize: 16,
                        fontWeight: 'bold',
                      }}>
                      {dt && dt.absenPulang && dt.absenPulang.waktu_pulang}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: windowWidht * 0.8,
                      backgroundColor: '#DBE000',
                      marginTop: windowHeight * 0.02,
                      width: windowWidht * 0.7,
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      borderRadius: 10,
                      height: windowHeight * 0.04,
                      justifyContent: 'space-between',
                      paddingHorizontal: 15,
                    }}>
                    <Text
                      style={{
                        marginTop: windowHeight * 0.006,
                        fontSize: 16,
                        fontWeight: 'bold',
                      }}>
                      Selisih Pulang
                    </Text>
                    <Text
                      style={{
                        marginTop: windowHeight * 0.006,
                        fontSize: 16,
                        fontWeight: 'bold',
                      }}>
                      {dt &&
                        dt.absenPulang &&
                        dt.absenPulang.selisih_waktu_pulang}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: windowWidht * 0.9,
                      backgroundColor: '#DBE000',
                      marginTop: windowHeight * 0.02,
                      width: windowWidht * 0.7,
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      borderRadius: 10,
                      height: windowHeight * 0.06,
                      justifyContent: 'space-between',
                      paddingHorizontal: 15,
                    }}>
                    <Text
                      style={{
                        marginTop: windowHeight * 0.006,
                        fontSize: 16,
                        fontWeight: 'bold',
                      }}>
                      Lokasi Pulang
                    </Text>
                    <Text
                      style={{
                        marginTop: windowHeight * 0.006,
                        fontSize: 16,
                        fontWeight: 'bold',
                      }}>
                      {dt && dt.absenPulang && dt.absenPulang.longitude_pulang},{' '}
                      {dt && dt.absenPulang && dt.absenPulang.latitude_pulang}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: windowWidht * 0.8,
                      backgroundColor: '#DBE000',
                      marginTop: windowHeight * 0.02,
                      width: windowWidht * 0.7,
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      borderRadius: 10,
                      height: windowHeight * 0.04,
                      justifyContent: 'space-between',
                      paddingHorizontal: 15,
                    }}>
                    <Text
                      style={{
                        marginTop: windowHeight * 0.006,
                        fontSize: 16,
                        fontWeight: 'bold',
                      }}>
                      Keterangan Pulang
                    </Text>
                    <Text
                      style={{
                        marginTop: windowHeight * 0.006,
                        fontSize: 16,
                        fontWeight: 'bold',
                      }}>
                      {dt && dt.absenPulang && dt.absenPulang.keterangan_pulang}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View>
            <Text>Tidak ADa Data</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ListHistory;

const windowWidht = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  listMenu: {
    marginVertical: windowHeight * 0.01,
    width: windowWidht * 0.8,
    height: windowHeight * 0.044,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#00000030',
    marginLeft: 'auto',
    marginRight: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  input: {
    width: windowWidht * 0.4,
    height: windowHeight * 0.063,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    marginRight: 'auto',
    marginLeft: 'auto',
    marginVertical: windowHeight * 0.01,
    borderRadius: 20,
  },
  text: {
    fontSize: 14,
    paddingTop: 10,
    paddingLeft: 10,
  },
});
