import React, {useState, useEffect} from 'react';

import type {PropsWithChildren} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image,
} from 'react-native';

import {setupPlayer, addTrack} from '../musicPlayerServices';
import MusicPlayer from './screens/MusicPlayer';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import StackNavigator from './StackNavigator';

import SongDetails from './screens/SongDetails';

export type RootStackParamList = {
  Home: undefined;
  Search: undefined;
  My: undefined;
  Main: undefined;
  SongDetails: undefined;
};
const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): JSX.Element {
  const [isPlayerReady, setIsPaylerReady] = useState(false);

  async function setup() {
    let isSetup = await setupPlayer();

    if (isSetup) {
      await addTrack();
    }

    setIsPaylerReady(isSetup);
  }

  useEffect(() => {
    setup();
  }, []);

  if (!isPlayerReady) {
    return (
      <SafeAreaView>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <View style={{flex: 1, position: 'relative'}}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen
            name="Main"
            component={StackNavigator}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SongDetails"
            component={SongDetails}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
      {/*  <Image
        source={{uri: 'https://q1.qlogo.cn/g?b=qq&nk=2510186180&s=100'}}
        style={{
          height: 120,
          width: 120,
          position: 'absolute',
          left: 20,
          bottom: 10,
        }}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
});

export default App;
