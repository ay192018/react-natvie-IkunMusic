import {
  View,
  Text,
  Button,
  StatusBar,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import React, {useState} from 'react';
import Modal from 'react-native-modal';
import MusicPlayer from './MusicPlayer';

export default function My() {
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar
        translucent
        animated
        backgroundColor={'transparent'}
        barStyle={'default'}
      />
      <View style={{marginTop: 30}}>
        <Button title="Show modal" onPress={toggleModal}></Button>
      </View>
      <MusicPlayer
        isModalVisible={isModalVisible}
        toggleModalVisible={toggleModal}
      />
    </SafeAreaView>
  );
}
