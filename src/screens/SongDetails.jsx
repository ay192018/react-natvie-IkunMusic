import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
  ScrollView,
  Animated,
} from 'react-native';
import React, {useState} from 'react';
import {useRoute} from '@react-navigation/native';
import TrackPlayer from 'react-native-track-player';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {BlurView} from '@react-native-community/blur';
const {width, height} = Dimensions.get('window');
const SongDetails = () => {
  const route = useRoute();
  const [data, setData] = React.useState({});
  const navigation = useNavigation();
  const [scrollY] = useState(new Animated.Value(0));

  const coverScale = scrollY.interpolate({
    inputRange: [-200, 0, 200], // 根据实际情况调整
    outputRange: [3, 1, 1], // 封面图片从放大到正常
    extrapolate: 'clamp', // 限制输出范围
  });
  const headerBlur = scrollY.interpolate({
    inputRange: [0, 100], // 根据实际情况调整
    outputRange: [0, 50], // 模糊程度从0到10渐变
    extrapolate: 'clamp',
  });
  React.useEffect(() => {
    if (route.params.id) {
      getSongsDetails(route.params.id);
    }
  }, [route.params.id]);
  const getSongsDetails = async id => {
    const {data} = await axios.get(
      `http://kuwo.bfmzdx.cn/kuwo/musicList?pid=${id}&rn=100`,
    );
    setData(data.data);
  };

  const songItem = ({item}) => {
    const styles = StyleSheet.create({
      Item: {
        width: '100%',
        height: 50,
        marginBottom: 10,
        flexDirection: 'row',
        padding: 5,
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
    const playMusic = item => {
      axios
        .get(
          `http://kuwo.bfmzdx.cn/kuwo/url?mid=${item.rid}&type=music&br=128kmp3`,
        )
        .then(async ({data}) => {
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
      <TouchableOpacity
        onPress={() => {
          playMusic(item);
        }}>
        <View style={styles.Item}>
          <Image source={{uri: item?.pic}} style={styles.itemImage} />
          <View style={styles.desc}>
            <Text style={{color: '#000', fontSize: 16, fontWeight: '600'}}>
              {item?.name}
            </Text>
            <Text>{item?.album}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent
        animated
        backgroundColor={'transparent'}
        barStyle={'light-content'}
      />

      <ScrollView
        style={styles.scrollView}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false},
        )}
        scrollEventThrottle={16}>
        <Animated.View style={{transform: [{scale: coverScale}]}}>
          <ImageBackground
            source={{uri: data.img500}}
            style={[styles.coverImage]}
            resizeMode="cover"
            blurRadius={20}>
            <View
              style={{
                width,
                position: 'absolute',
                top: '50%',
                justifyContent: 'center',
                alignItems: 'center',
                transform: [
                  // 移动图片的一半宽度向左
                  {translateY: -50}, // 移动图片的一半高度向上
                ],
              }}>
              <Animated.Image
                resizeMode="cover"
                style={{width: 100, aspectRatio: '1/1', borderRadius: 10}}
                source={{uri: data.img500}}
              />
              <Text style={{color: '#999'}}>{data.name}</Text>
            </View>
            {/*  <BlurView blurType="xlight" blurAmount={headerBlur} /> */}
          </ImageBackground>
        </Animated.View>

        <FlatList
          data={data.musicList}
          renderItem={songItem}
          onEndReached={() => console.log(1111)}
          onEndReachedThreshold={0.5}
          keyExtractor={item => item.rid}
        />
      </ScrollView>
      <Animated.View style={[styles.titleBar]}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity onPress={() => navigation.pop()}>
            <Ionicons name="chevron-back" size={30} color="#ffd369" />
          </TouchableOpacity>
          <Text
            style={{
              flex: 1,
              textAlign: 'center',
              color: '#ffd369',
              fontSize: 16,
            }}>
            {data.name}
          </Text>
          <TouchableOpacity>
            <MaterialIcons name="more-horiz" size={30} color="#ffd369" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

export default SongDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  coverImage: {
    width: '100%',
    position: 'relative',
    height: 400, // 调整为封面的初始高度
  },
  scrollView: {
    flex: 1,
  },
  titleBar: {
    position: 'absolute',
    top: StatusBar.currentHeight,
    left: 0,
    right: 0,
    height: 50, // 根据实际情况调整标题栏的高度
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // 初始半透明背景
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
