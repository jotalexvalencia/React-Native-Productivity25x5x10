import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FiveMinutesScreen from './components/FiveMinutesScreen';
import TenMinutesScreen from './components/TenMinutesScreen';
import TwentyFiveMinutesScreen from './components/TwentyFiveMinutesScreen';
import { setupPlayer, addTrack } from "../musicPlayerServices";


const Tab = createMaterialTopTabNavigator();

function App(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState('Short Break');
   const [isPlayerReady, setIsPlayerReady] = useState(false);

   

   useEffect(() => {
    const initializePlayer = async () => {
      const isSetup = await setupPlayer();
      if (isSetup) {
        await addTrack();
      }
      setIsPlayerReady(isSetup);
    };

    initializePlayer();
 }, []);
  
  if (!isPlayerReady) {
    return (
      <SafeAreaView>
        <ActivityIndicator />
      </SafeAreaView>
    )
  }
 

  const getTabColor = (tabName: string) => {
    switch (tabName) {
      case 'Short Break':
        return '#F0DF87';
      case 'Pomodoro':
        return '#0ABDE3';
      case 'Long Break':
        return '#EA425C';
      default:
        return 'powderblue';
    }
  };

  return (
    <NavigationContainer>
      <StatusBar hidden />
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold', color: '#2C3335' },
          tabBarStyle: { backgroundColor: 'powderblue' },
        }}
      >
        <Tab.Screen
          name="Short Break"
          component={FiveMinutesScreen}
          listeners={{
            focus: () => setActiveTab('Short Break'),
          }}
          options={{
            title: 'Short Break',
            tabBarIcon: ({ focused }) => (
              <Icon name={focused ? 'numeric-5-circle' : 'numeric-5-circle-outline'} size={25} color="#192A56" />
            ),
            tabBarStyle: { backgroundColor: getTabColor('Short Break') },
          }}
        />
        <Tab.Screen
          name="Pomodoro"
          component={TwentyFiveMinutesScreen}
          listeners={{
            focus: () => setActiveTab('Pomodoro'),
          }}
          options={{
            title: 'Pomodoro',
            tabBarIcon: ({ focused }) => (
              <Icon name={focused ? 'timer' : 'timer-outline'} size={25} color="#192A56" />
            ),
            tabBarStyle: { backgroundColor: getTabColor('Pomodoro') },
          }}
        />
        <Tab.Screen
          name="Long Break"
          component={TenMinutesScreen}
          listeners={{
            focus: () => setActiveTab('Long Break'),
          }}
          options={{
             title: 'Long Break',
            tabBarIcon: ({ focused }) => (
              <Icon name={focused ? 'numeric-10-circle' : 'numeric-10-circle-outline'} size={25} color="#192A56" />
            ),
            tabBarStyle: { backgroundColor: getTabColor('Long Break') },
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  
});

export default App;