import {StatusBar, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Circle} from 'react-native-animated-spinkit';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';

const PageLoading = () => {
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <StatusBar backgroundColor={'transparent'} translucent />
        <LinearGradient
          colors={['#0f0c29', '#302b63', '#24243e']}
          style={{flex: 1}}>
          <View style={styles.container}>
            <Circle size={48} color="#FFF" />
          </View>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
};

export default PageLoading;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Ganti warna latar belakang sesuai kebutuhan Anda
  },
  centered: {
    alignItems: 'center',
  },
});
