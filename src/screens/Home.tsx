import {
  View,
  Text,
  Dimensions,
  StatusBar,
  ScrollView,
  Image,
  Pressable,
  FlatList,
} from 'react-native';
import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';
import {LinearGradient} from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import ImageView from 'react-native-image-viewing';
type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

interface playlist {
  img: string;
  uname: string;
  lossless_mark: string;
  favorcnt: string;
  isnew: string;
  extend: string;
  uid: string;
  total: string;
  commentcnt: string;
  imgscript: string;
  digest: string;
  name: string;
  listencnt: string;
  id: string;
  attribute: string;
  radio_id: string;
  desc: string;
  info: string;
}
interface Artist {
  artistFans: number;
  albumNum: number;
  mvNum: number;
  pic: string;
  musicNum: number;
  pic120: string;
  isStar: number;
  content_type: string;
  aartist: string;
  name: string;
  pic70: string;
  id: number;
  pic300: string;
}
interface Radio {
  artist: string;
  album: string;
  listencnt: string;
  pic: string;
  rid: string;
}

export default function Home() {
  const [recentLyed, setRecentLyed] = React.useState<playlist[]>([]);
  const [recommend, setRecommend] = React.useState<playlist[]>([]);
  const [singer, setSinger] = React.useState<Artist[]>([]);
  const [radio, setRadio] = React.useState<Radio[]>([]);
  const [visible, setIsVisible] = React.useState(false);
  const [imageIndex, setImageIndex] = React.useState(0);
  const [residueRecentLyed, setResidueRecentLyed] = React.useState<playlist[]>(
    [],
  );
  const navigation = useNavigation<NavigationProp<any>>();
  const getCurrentTime = () => {
    const currentTime = new Date().getHours();

    if (currentTime < 12) {
      return '上午好';
    } else if (currentTime < 16) {
      return '下午好';
    } else {
      return '晚上好';
    }
  };
  const message = getCurrentTime();
  const getRadio = async () => {
    const {
      data,
    }: {
      data: {
        data: {albumList: Radio[]};
      };
    } = await axios.get('http://kuwo.bfmzdx.cn/kuwo/radio');

    setRadio(data.data.albumList);
  };
  const getsingerLIst = async () => {
    const {
      data,
    }: {
      data: {
        data: {artistList: Artist[]};
      };
    } = await axios.get(
      'http://kuwo.bfmzdx.cn/kuwo/singer?category=0&rn=100&pn=1',
    );
    setSinger(data.data.artistList);
  };
  const getRecentLyedSongs = async () => {
    const {
      data,
    }: {
      data: {
        data: {
          data: playlist[];
        };
      };
    } = await axios.get(
      'http://kuwo.bfmzdx.cn/kuwo/playList?order=new&rn=100&pn=1',
    );
    const recentLyed: Array<playlist> = [];
    const residueRecentLyed: Array<playlist> = [];
    data.data.data.forEach((_, __) => {
      if (__ < 4) {
        recentLyed.push(_);
      } else {
        residueRecentLyed.push(_);
      }
    });
    setRecentLyed(recentLyed);
    setResidueRecentLyed(residueRecentLyed);
  };
  const getRecommend = async () => {
    const {
      data,
    }: {
      data: {
        data: {
          list: playlist[];
        };
      };
    } = await axios.get('http://kuwo.bfmzdx.cn/kuwo/rec_gedan');
    setRecommend(data.data.list);
  };
  React.useEffect(() => {
    getRecentLyedSongs();
    getRecommend();
    getsingerLIst();
    getRadio();
  }, []);
  const renderItem = ({item, index}: {item: playlist; index: number}) => {
    return (
      <Pressable
        onPress={() =>
          navigation.navigate('SongDetails', {
            id: item.id,
          })
        }
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginHorizontal: 10,
          marginVertical: 8,
          backgroundColor: '#282828',
          borderRadius: 4,
          elevation: 3,
        }}>
        <Image style={{height: 55, width: 55}} source={{uri: item?.img}} />
        <View style={{flex: 1, marginHorizontal: 8, justifyContent: 'center'}}>
          <Text
            numberOfLines={2}
            style={{fontSize: 13, fontWeight: 'bold', color: 'white'}}>
            {item?.name}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <LinearGradient
      colors={['#040306', '#131624']}
      style={{flex: 1, paddingBottom: 50}}>
      <StatusBar
        translucent
        animated
        backgroundColor={'transparent'}
        barStyle={'light-content'}
      />
      <ScrollView style={{marginTop: 50}}>
        <View
          style={{
            padding: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              style={{
                width: 40,
                height: 40,
                resizeMode: 'cover',
                borderRadius: 20,
              }}
              source={{uri: 'https://q1.qlogo.cn/g?b=qq&nk=2510186180&s=100'}}
            />
            <Text
              style={{
                marginLeft: 10,
                fontSize: 20,
                fontWeight: 'bold',
                color: 'white',
              }}>
              {message}
            </Text>
          </View>
          <Icon name="lightning-bolt-outline" size={24} color={'white'} />
        </View>

        <View
          style={{
            marginHorizontal: 12,
            marginVertical: 5,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}>
          <Pressable
            style={{backgroundColor: '#282828', padding: 10, borderRadius: 30}}>
            <Text style={{fontSize: 15, color: 'white'}}>Music</Text>
          </Pressable>
          <Pressable
            style={{backgroundColor: '#282828', padding: 10, borderRadius: 30}}>
            <Text style={{fontSize: 15, color: 'white'}}>Podcast&Shows</Text>
          </Pressable>
        </View>
        <View style={{height: 10}} />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Pressable
            style={{
              marginBottom: 10,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              flex: 1,
              marginHorizontal: 10,
              marginVertical: 8,
              backgroundColor: '#202020',
              borderRadius: 4,
              elevation: 3,
            }}>
            <LinearGradient colors={['#33006f', '#fff']}>
              <Pressable
                style={{
                  width: 55,
                  height: 55,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <AntDesign name="heart" size={24} color={'white'} />
              </Pressable>
            </LinearGradient>
            <Text style={{color: 'white', fontSize: 13, fontWeight: 'bold'}}>
              喜欢的音乐
            </Text>
          </Pressable>

          <Pressable
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              flex: 1,
              marginHorizontal: 10,
              marginVertical: 8,
              backgroundColor: '#202020',
              borderRadius: 4,
              elevation: 3,
            }}>
            <Image
              style={{width: 55, height: 55}}
              source={{uri: 'https://q1.qlogo.cn/g?b=qq&nk=2510186180&s=100'}}
            />
            <View>
              <Text style={{color: 'white', fontSize: 13, fontWeight: 'bold'}}>
                随机专辑
              </Text>
            </View>
          </Pressable>
        </View>

        <FlatList
          data={recentLyed}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={{justifyContent: 'space-between'}}
        />
        <Text
          style={{
            color: 'white',
            fontSize: 19,
            fontWeight: 'bold',
            marginHorizontal: 10,
            marginTop: 10,
          }}>
          为你推荐
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {recommend?.map((_, index) => {
            return (
              <Pressable
                key={_.id}
                style={{margin: 10}}
                onPress={() =>
                  navigation.navigate('SongDetails', {
                    id: _.id,
                  })
                }>
                <Image
                  source={{uri: _.img}}
                  style={{width: 130, height: 130, borderRadius: 5}}
                />

                <Text
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  style={{
                    fontSize: 13,
                    fontWeight: 'bold',
                    color: 'white',
                    width: 130,
                    marginTop: 10,
                  }}>
                  {_?.info}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
        <View style={{height: 20}} />
        <Text
          style={{
            color: 'white',
            fontSize: 19,
            fontWeight: 'bold',
            marginHorizontal: 10,
            marginTop: 10,
          }}>
          热门歌单
        </Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={residueRecentLyed}
          renderItem={({item, index}) => {
            return (
              <Pressable
                key={item.id}
                style={{margin: 10}}
                onPress={() =>
                  navigation.navigate('SongDetails', {
                    id: item.id,
                  })
                }>
                <Image
                  source={{uri: item.img}}
                  style={{width: 130, height: 130, borderRadius: 5}}
                />

                <Text
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  style={{
                    fontSize: 13,
                    fontWeight: 'bold',
                    color: 'white',
                    width: 130,
                    marginTop: 10,
                  }}>
                  {item?.name}
                </Text>
              </Pressable>
            );
          }}
        />
        <View style={{height: 20}} />
        <Text
          style={{
            color: 'white',
            fontSize: 19,
            fontWeight: 'bold',
            marginHorizontal: 10,
            marginTop: 10,
          }}>
          热门歌手
        </Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={singer}
          renderItem={({item, index}) => {
            return (
              <Pressable key={item.id} style={{margin: 10}}>
                <Pressable
                  onLongPress={() => {
                    setImageIndex(index);
                    setIsVisible(true);
                  }}>
                  <Image
                    source={{uri: item.pic120}}
                    style={{width: 80, height: 80, borderRadius: 50}}
                  />
                </Pressable>

                <Text
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  style={{
                    fontSize: 13,
                    fontWeight: 'bold',
                    color: 'white',
                    width: 80,
                    marginTop: 10,
                    textAlign: 'center',
                  }}>
                  {item?.name}
                </Text>
              </Pressable>
            );
          }}
        />
        <View style={{height: 20}} />
        <Text
          style={{
            color: 'white',
            fontSize: 19,
            fontWeight: 'bold',
            marginHorizontal: 10,
            marginTop: 10,
          }}>
          主播电台
        </Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={radio}
          renderItem={({item, index}) => {
            return (
              <Pressable key={item.rid} style={{margin: 10}}>
                <Image
                  source={{uri: item.pic}}
                  style={{width: 130, height: 130, borderRadius: 5}}
                />

                <Text
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  style={{
                    fontSize: 13,
                    fontWeight: 'bold',
                    color: 'white',
                    width: 130,
                    marginTop: 10,
                  }}>
                  {item?.artist}
                </Text>
              </Pressable>
            );
          }}
        />
      </ScrollView>
      <ImageView
        images={singer.map(_ => ({uri: _.pic300}))}
        imageIndex={imageIndex}
        visible={visible}
        delayLongPress={200}
        onRequestClose={() => setIsVisible(false)}
      />
    </LinearGradient>
  );
}
