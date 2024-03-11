import {
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import SelectDropdown from 'react-native-select-dropdown';
import {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {absensi, logo_rsud} from '../../assets';

const ListAbsence = ({navigation, route}) => {
  const [selectJadwal, setSelectJadwal] = useState('');
  const [todos, setTodos] = useState([]);

  console.log('status list absen', route.params);
  // if (selectJadwal == '') {
  //   Alert.alert('Pilih Jadwal Terlebih Dahulu yaaa, Agar Bisa Absen');
  // }
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#4DC2B7'}}>
      <ScrollView
        scrollEnabled={true}
        contentContainerStyle={styles.scrollView}
        nestedScrollEnabled={true}>
        <View
          style={{
            flexDirection: 'row',
            marginTop: windowHeight * 0.06,
            marginBottom: windowHeight * 0.01,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={absensi}
            style={{
              width: 80,
              height: 70,
              marginEnd: 10,
              resizeMode: 'contain',
            }}
          />
          <Text
            style={{
              fontSize: 28,
              fontWeight: 'bold',
              color: '#000000',
              marginTop: 10, // Sesuaikan sesuai kebutuhan
            }}>
            Absensi
          </Text>
        </View>
        <View
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            width: windowWidht * 0.9,
            height: windowHeight * 0.6,
            borderRadius: 40,
            alignItems: 'flex-start',
            backgroundColor: '#dadf00',
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.5)',
          }}>
          <View style={styles.inputselect}>
            <SelectDropdown
              data={route.params.jadwal}
              onSelect={(selectedItem, index) => {
                console.log('todos: ', todos);
                console.log('selectedItem', selectedItem.id);
                setSelectJadwal(selectedItem.id);
              }}
              defaultButtonText={'Pilih Jadwal'}
              buttonTextAfterSelection={(selectedItem, index) => {
                //setForm({ ...form, type: selectedItem.id.toString() })
                return selectedItem.nama;
              }}
              rowTextForSelection={(item, index) => {
                //setForm({ ...form, type: item.id.toString() })
                return item.nama;
              }}
              buttonStyle={styles.dropdown1BtnStyle}
              buttonTextStyle={styles.dropdown1BtnTxtStyle}
              renderDropdownIcon={isOpened => {
                return (
                  <Icon
                    name={isOpened ? 'chevron-up' : 'chevron-down'}
                    color={'#444'}
                    size={18}
                  />
                );
              }}
              dropdownIconPosition={'right'}
              dropdownStyle={styles.dropdown1DropdownStyle}
              rowStyle={styles.dropdown1RowStyle}
              rowTextStyle={styles.dropdown1RowTxtStyle}
              selectedRowStyle={styles.dropdown1SelectedRowStyle}
              search
              searchInputStyle={styles.dropdown1searchInputStyleStyle}
              searchPlaceHolder={'Pilih Jadwal'}
              searchPlaceHolderColor={'darkgrey'}
              renderSearchInputLeftIcon={() => {
                return <Icon name={'search'} color={'#444'} size={18} />;
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'column',
              marginTop: windowHeight * 0.01,
              marginBottom: windowHeight * 0.01,
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
            {route.params.status_absen == false ? (
              <TouchableOpacity
                // disabled={selectJadwal == '' ? true : false}
                onPress={() => {
                  {
                    selectJadwal == ''
                      ? Alert.alert(
                          'Pilih Jadwal Terlebih Dahulu yaaa, Agar Bisa Absen',
                        )
                      : navigation.navigate('Absence', {
                          fingerfrint: route.params.fingerfrint,
                          selfie: route.params.selfie,
                          lat: route.params.lat,
                          lng: route.params.lng,
                          radius: route.params.radius,
                          id_jadwalKerja: selectJadwal,
                          user_id: route.params.user_id,
                          image: null,
                        });
                  }
                }}>
                <View style={[styles.cardContainer, {borderRadius: 40}]}>
                  <View style={styles.cardContent}>
                    <Icon
                      name="sign-in-alt"
                      size={windowHeight * 0.12}
                      color="#000000"
                    />

                    <Text
                      style={[
                        styles.cardText,
                        {color: '#000000', fontSize: 25, fontWeight: 'bold'},
                      ]}>
                      Absen Masuk
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity disabled={true}>
                <View style={[styles.cardContainer, {borderRadius: 40}]}>
                  <View style={styles.cardContent}>
                    <Icon
                      name="sign-in-alt"
                      size={windowHeight * 0.12}
                      color="#d3d3d3"
                    />

                    <Text
                      style={[
                        styles.cardText,
                        {color: '#d3d3d3', fontSize: 20, fontWeight: 'bold'},
                      ]}>
                      Anda Sudah Absen Masuk
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            {route.params.status_absen == true ? (
              <TouchableOpacity
                // disabled={selectJadwal == '' ? true : false}
                onPress={() => {
                  {
                    selectJadwal == ''
                      ? Alert.alert(
                          'Pilih Jadwal Terlebih Dahulu yaaa, Agar Bisa Absen',
                        )
                      : navigation.navigate('AbsenceOff', {
                          fingerfrint: route.params.fingerfrint,
                          selfie: route.params.selfie,
                          lat: route.params.lat,
                          lng: route.params.lng,
                          radius: route.params.radius,
                          user_id: route.params.user_id,
                          id_jadwalKerja: selectJadwal,
                          absen_masuk_id: route.params.absen_masuk_id,
                          image: null,
                        });
                  }
                }}>
                <View style={[styles.cardContainer, {borderRadius: 40}]}>
                  <View style={styles.cardContent}>
                    <Icon
                      name="sign-out-alt"
                      size={windowHeight * 0.12}
                      color="#000000"
                    />

                    <Text
                      style={[
                        styles.cardText,
                        {color: '#000000', fontSize: 25, fontWeight: 'bold'},
                      ]}>
                      Absen Pulang
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity disabled={true}>
                <View style={[styles.cardContainer, {borderRadius: 40}]}>
                  <View style={styles.cardContent}>
                    <Icon
                      name="sign-in-alt"
                      size={windowHeight * 0.12}
                      color="#d3d3d3"
                    />

                    <Text
                      style={[
                        styles.cardText,
                        {color: '#d3d3d3', fontSize: 20, fontWeight: 'bold'},
                      ]}>
                      Anda Belum Absen Pulang
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View
          style={{
            marginTop: windowHeight * 0.01,
            // marginBottom: 'auto',
            marginStart: 'auto',
            marginEnd: 'auto',
          }}>
          <Text
            style={{
              // marginTop: 'auto',
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

export default ListAbsence;

const windowWidht = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  listMenu: {
    marginVertical: windowHeight * 0.01,
    width: windowWidht * 0.4,
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
  btnTextSuccess: {
    backgroundColor: 'green',
    color: '#FFFFFF',
    fontSize: 18,
  },
  messageText: {
    color: '#000000',
    textAlign: 'center',
  },
  message: {
    width: windowWidht * 0.85,
    paddingVertical: windowHeight * 0.02,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: windowHeight * 0.03,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  inputselect: {
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 30,
    marginTop: 30,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  dropdown1BtnStyle: {
    width: windowWidht * 0.7,
    height: windowHeight * 0.043,
    backgroundColor: '#FFF',
    borderRadius: 0,
    borderWidth: 1,
    borderColor: '#444',
  },
  dropdown1BtnTxtStyle: {color: '#444', textAlign: 'left'},
  dropdown1DropdownStyle: {backgroundColor: '#EFEFEF'},
  dropdown1RowStyle: {backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5'},
  dropdown1RowTxtStyle: {color: '#444', textAlign: 'left'},
  dropdown1SelectedRowStyle: {backgroundColor: 'rgba(0,0,0,0.1)'},
  dropdown1searchInputStyleStyle: {
    backgroundColor: '#EFEFEF',
    borderRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
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
});
