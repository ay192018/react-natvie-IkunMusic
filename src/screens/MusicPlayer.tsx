import React, {useState, useEffect, useRef} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  Text,
  Animated,
  StatusBar,
} from 'react-native';
import Modal from 'react-native-modal';
import TrackPlayer, {
  Event,
  Track,
  State,
  useTrackPlayerEvents,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';

import {debounce} from 'lodash';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Slider from '@react-native-community/slider';

const {width, height} = Dimensions.get('window');

const MusicPlayer = ({
  isModalVisible,
  toggleModalVisible,
}: {
  isModalVisible: boolean;
  toggleModalVisible: () => void;
}) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const playBackState = usePlaybackState();
  const [songList, setSongList] = useState<Track[]>([]);
  const [track, setTrack] = useState<Track | null>();
  const {position, duration} = useProgress();
  const songSlider = useRef<FlatList>(null);

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    getQueue();
    switch (event.type) {
      case Event.PlaybackTrackChanged:
        const playingTrack = await TrackPlayer.getTrack(event.nextTrack);
        if (playingTrack) {
          setTrack(playingTrack);
        }

        break;
    }
  });
  const changeSlider = async (e: any) => {
    await TrackPlayer.seekTo(e);
  };
  const getQueue = async () => {
    const Queue = await TrackPlayer.getQueue();
    setSongList(Queue);
  };
  useEffect(() => {
    scrollX.addListener(
      debounce(async ({value}) => {
        const index = Math.round(value / width);
        await TrackPlayer.skip(index);
        await TrackPlayer.play();
      }, 500),
    );
    return () => {
      scrollX.removeAllListeners();
    };
  }, []);
  const skipToNext = async () => {
    const index = await TrackPlayer.getCurrentTrack();

    await TrackPlayer.skipToNext();
  };
  const togglePlayback = async (playback: State) => {
    const currentTrack = await TrackPlayer.getCurrentTrack();

    if (currentTrack !== null) {
      if (playback === State.Paused || playback === State.Ready) {
        await TrackPlayer.play();
      } else {
        await TrackPlayer.pause();
      }
    }
  };
  const skipToPrevious = async () => {
    const index = await TrackPlayer.getCurrentTrack();

    await TrackPlayer.skipToPrevious();
  };
  return (
    <>
      <StatusBar
        translucent
        animated
        backgroundColor={'transparent'}
        barStyle={'dark-content'}
      />
      <Modal
        isVisible={isModalVisible}
        animationIn="zoomInDown"
        animationOut="zoomOutUp"
        backdropOpacity={1}
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}>
        <Image
          source={{
            uri: track?.artwork?.toString(),
          }}
          style={{
            width,
            height,
            position: 'absolute',
            zIndex: -1,
            left: -20,
            top: -20,
          }}
          blurRadius={70}
        />
        <SafeAreaView style={styles.container}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity onPress={toggleModalVisible}>
              <Ionicons name="chevron-back" size={30} color="#ffd369" />
            </TouchableOpacity>
            <Text
              style={{
                flex: 1,
                textAlign: 'center',
                color: '#ffd369',
                fontSize: 18,
              }}>
              {track?.title}
            </Text>
            <TouchableOpacity>
              <MaterialIcons name="more-horiz" size={30} color="#ffd369" />
            </TouchableOpacity>
          </View>
          <View style={styles.mainContainer}>
            <View style={styles.artworkWrapper}>
              <Image
                style={styles.artworkImg}
                source={{
                  uri: track?.artwork?.toString(),
                }}
              />
            </View>
            <View>
              <Text style={styles.title}>{track?.title}</Text>
              <Text style={styles.artist}>{track?.artist}</Text>
            </View>
            <View>
              <Slider
                style={styles.progressContainer}
                value={position}
                minimumValue={0}
                maximumValue={duration}
                thumbTintColor="#ffd369"
                minimumTrackTintColor="#ffd369"
                maximumTrackTintColor="#fff"
                onSlidingComplete={changeSlider}
              />
              <View style={styles.progressLabelContainer}>
                <Text style={styles.progressLabelTxt}>
                  {new Date(position * 1000).toISOString().substring(15, 19)}
                </Text>
                <Text style={styles.progressLabelTxt}>
                  {new Date((duration - position) * 1000)
                    .toISOString()
                    .substring(15, 19)}
                </Text>
              </View>
            </View>
            <View style={styles.musicControlls}>
              <TouchableOpacity onPress={skipToPrevious}>
                <Ionicons
                  style={{marginTop: 25}}
                  name="play-skip-back-outline"
                  size={35}
                  color="#ffd369"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => togglePlayback(playBackState)}>
                <Ionicons
                  name={
                    playBackState === State.Playing
                      ? 'ios-pause-circle'
                      : 'ios-play-circle'
                  }
                  size={75}
                  color="#ffd369"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={skipToNext}>
                <Ionicons
                  style={{marginTop: 25}}
                  name="play-skip-forward-outline"
                  size={35}
                  color="#ffd369"
                />
              </TouchableOpacity>
            </View>
          </View>
          {/*       <View style={styles.bottomContainer}>
            <View style={styles.bottomControls}>
              <TouchableOpacity onPress={() => {}}>
                <Ionicons name="heart-outline" size={30} color="#777777" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {}}>
                <Ionicons name="repeat" size={30} color="#777777" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {}}>
                <Ionicons name="share-outline" size={30} color="#777777" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {}}>
                <Ionicons
                  name="ellipsis-horizontal"
                  size={30}
                  color="#777777"
                />
              </TouchableOpacity>
            </View>
          </View> */}
        </SafeAreaView>
      </Modal>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    /*     backgroundColor: '#222831', */
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  artworkWrapper: {
    marginTop: 40,
    marginHorizontal: 'auto',
    width: 250,
    height: 250,
    marginBottom: 25,
    shadowColor: '#ccc',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
  },
  artworkImg: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#eeeeee',
  },
  artist: {
    fontSize: 16,
    fontWeight: '200',
    textAlign: 'center',
    color: '#eeeeee',
  },
  progressContainer: {
    width: 350,
    height: 40,
    marginTop: 25,
    flexDirection: 'row',
  },
  progressLabelContainer: {
    width: 340,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabelTxt: {
    color: '#fff',
  },
  musicControlls: {
    flexDirection: 'row',
    width: '60%',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  bottomContainer: {
    backgroundColor: '#393e46',
    borderTopWidth: 1,
    width,
    alignItems: 'center',
    paddingVertical: 15,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
});
export default MusicPlayer;
{
  /* <View style={{width: width}}>
              { <Animated.FlatList
            ref={songSlider}
            renderItem={renderSongs}
            data={songList}
            keyExtractor={item => item.id}
            horizontal
            pagingEnabled
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: {x: scrollX},
                  },
                },
              ],
              {useNativeDriver: true},
            )}
          />}
            </View> */
}
