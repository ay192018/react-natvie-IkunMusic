import {
  View,
  Text,
  StyleSheet,
  TextInput,
  NativeMethods,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import React, {useState} from 'react';
import axios from 'axios';
import {songItem} from '../types';
import TrackPlayer, {
  usePlaybackState,
  State,
  useTrackPlayerEvents,
  Event,
} from 'react-native-track-player';
import {LinearGradient} from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
export default function Search() {
  const playState = usePlaybackState();
  const playBackState = usePlaybackState();
  const [value, setValue] = useState('');
  const [list, setList] = useState<songItem[]>([]);
  const onChange = (e: string) => {
    setValue(e);
  };
  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {});

  const songItem = ({item}: {item: songItem}) => {
    const styles = StyleSheet.create({
      Item: {
        width: '100%',
        height: 50,
        marginBottom: 5,
        flexDirection: 'row',
      },
      itemImage: {
        width: 50,
        height: 50,
        borderRadius: 5,
      },
      desc: {
        flex: 1,
        justifyContent: 'space-between',
        marginLeft: 5,
      },
    });
    const playMusic = (item: songItem) => {
      axios
        .get(
          `http://kuwo.bfmzdx.cn/kuwo/url?mid=${item.rid}&type=music&br=128kmp3`,
        )
        .then(async ({data}: {data: {data: {url: string}}}) => {
          if (data.data.url) {
            await TrackPlayer.pause();
            TrackPlayer.add({
              id: item.rid,
              title: item.name,
              artist: item.artist,
              album: item.album,
              url: data.data.url,
              artwork: item.pic,
            });
            const Queue = await TrackPlayer.getQueue();
            await TrackPlayer.skip(Queue.length - 1);
            await TrackPlayer.play();
          }
        });
    };
    return (
      <TouchableOpacity onPress={() => playMusic(item)}>
        <View style={styles.Item}>
          <Image source={{uri: item?.pic}} style={styles.itemImage} />
          <View style={styles.desc}>
            <Text>{item?.name}</Text>
            <Text>{item?.album}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const getSearchList = () => {
    axios
      .get(
        `http://kuwo.bfmzdx.cn/kuwo/search/searchMusicBykeyWord?key=${value}`,
      )
      .then(
        ({
          data,
        }: {
          data: {
            data: {
              list: songItem[];
            };
          };
        }) => {
          if (data.data.list.length) {
            setList(data.data.list);
          }
        },
      );
  };
  return (
    <LinearGradient colors={['#614385', '#516395']} style={{flex: 1}}>
      <StatusBar backgroundColor={'transparent'} barStyle={'default'} />
      <SafeAreaView style={styles.container}>
        <View style={styles.searchComponents}>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChange}
            placeholderTextColor={'#999'}
            placeholder="请输入"
            cursorColor={'#fff'}
          />
          <TouchableOpacity onPress={getSearchList}>
            <Text style={{fontSize: 14, fontWeight: '500', color: 'white'}}>
              搜索
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList data={list} renderItem={songItem} />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchComponents: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#fff',
    padding: 10,
    borderRadius: 50,
    flex: 1,
    color: '#ff',
  },
});
