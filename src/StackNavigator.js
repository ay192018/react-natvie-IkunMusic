import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from './screens/Home';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Search from './screens/Search';
import My from './screens/My';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
const Tab = createBottomTabNavigator();
function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: 'rgba(0,0,0,0.5)',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          shadowOpacity: 4,
          shadowRadius: 4,
          elevation: 4,
          shadowOffset: {
            width: 0,
            height: -4,
          },
          borderTopWidth: 0,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: '主页',
          headerShown: false,
          tabBarLabelStyle: {
            color: 'white',
          },
          tabBarIcon: ({focused, color, size}) => {
            return (
              <Icon
                size={size}
                name="home"
                color={focused ? 'white' : '#999'}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="search"
        component={Search}
        options={{
          tabBarLabel: '搜索',
          headerShown: false,
          tabBarLabelStyle: {
            color: 'white',
          },
          tabBarIcon: ({focused, color, size}) => {
            return (
              <Icon
                name="search"
                size={size}
                color={focused ? 'white' : '#999'}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="my"
        component={My}
        options={{
          tabBarLabel: '我的',
          headerShown: false,
          tabBarLabelStyle: {
            color: 'white',
          },

          tabBarIcon: ({focused, color, size}) => {
            return (
              <Icon
                name="favorite-border"
                size={size}
                color={focused ? 'white' : '#999'}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
}
export default BottomTabs;
const Stack = createNativeStackNavigator();
function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator></Stack.Navigator>
    </NavigationContainer>
  );
}
