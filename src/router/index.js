import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';

import Home from '../page/home';
import Absence from '../page/absence';
import AbsenceOff from '../page/absence/AbsenceOff';
import Request from '../page/requests';
import message from '../page/message';
import Holiday from '../page/holiday';
import Login from '../page/login/Login';
import Logout from '../page/login/Logout';
import SplashScreen from '../page/SplashScreen';
import Permission from '../page/requests/Permission';
import User from '../page/user';
import CamDect from '../page/absence/CamDect';
import ListAbsence from '../page/absence/ListAbsence';
import ListHistory from '../page/history/ListHistory';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({route}) => ({
      headerShown: false,
      tabBarStyle: {
        backgroundColor: '#DBE000',
        paddingBottom: 10,
        height: 80,
        // borderTopRightRadius: 60,
        // borderTopLeftRadius: 60,
      },
      tabBarLabelStyle: {fontSize: 14, fontWeight: 'bold'},
    })}>
    <Tab.Screen
      name="Home"
      component={Home}
      screenOptions={{headerShown: false}}
      options={{
        tabBarIcon: ({color, size}) => (
          <Icon name="home" size={40} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="User"
      component={User}
      screenOptions={{headerShown: false}}
      options={{
        tabBarIcon: ({color, size}) => (
          <Icon name="user" size={40} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

const Router = () => {
  return (
    <Stack.Navigator initialRouteName="SplashScreen">
      <Stack.Screen
        name="Main"
        component={MainTabs}
        options={{headerShown: false}}
      />

      {/* <Stack.Screen name="CamDect" component={CamDect} /> */}

      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="ListAbsence"
        component={ListAbsence}
        options={{
          headerStyle: {
            backgroundColor: '#4DC2B7',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          title: 'Absen',
        }}
      />

      <Stack.Screen
        name="ListHistory"
        component={ListHistory}
        options={{
          headerStyle: {
            backgroundColor: '#4DC2B7',
          },
          headerTintColor: '#000000',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          title: 'List Absen',
        }}
      />

      <Stack.Screen
        name="Absence"
        component={Absence}
        options={{
          headerStyle: {
            backgroundColor: '#4DC2B7',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          title: 'Absen',
        }}
      />

      <Stack.Screen
        name="message"
        component={message}
        options={{
          headerStyle: {
            backgroundColor: '#16D5FF',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          title: 'Pesan',
        }}
      />

      <Stack.Screen
        name="Holiday"
        component={Holiday}
        options={{
          headerStyle: {
            backgroundColor: '#4DC2B7',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          title: 'Arsip Berkas SPT',
        }}
      />

      <Stack.Screen
        name="AbsenceOff"
        component={AbsenceOff}
        options={{
          headerStyle: {
            backgroundColor: '#4DC2B7',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          title: 'Absen',
        }}
      />

      <Stack.Screen
        name="Request"
        component={Request}
        options={{
          headerStyle: {
            backgroundColor: '#4DC2B7',
          },
          headerTintColor: '#000000',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          title: 'Pengajuan',
        }}
      />

      <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="Permission"
        component={Permission}
        options={{
          headerStyle: {
            backgroundColor: '#16D5FF',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          title: 'History Permohonan',
        }}
      />

      <Stack.Screen
        name="logout"
        component={Logout}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default Router;
