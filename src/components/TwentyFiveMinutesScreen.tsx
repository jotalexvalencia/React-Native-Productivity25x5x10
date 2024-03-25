
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import TrackPlayer, { State, usePlaybackState, Event, Track, useTrackPlayerEvents } from 'react-native-track-player';
import BackgroundTimer from 'react-native-background-timer';
import { setupPlayer, playbackService } from '../../musicPlayerServices';
import KeepAwake from '@sayem314/react-native-keep-awake';

const TwentyFiveMinutesScreen = () => {
  const [stopped, setStopped] = useState(true);
  const [paused, setPaused] = useState(true);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [temporizadorFinalizado, setTemporizadorFinalizado] = useState(false);
  const [track, setTrack] = useState<Track | null>();

    useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
      switch (event.type) {
        case Event.PlaybackTrackChanged:
          const playingTrack = await TrackPlayer.getTrack(event.nextTrack)
          setTrack(playingTrack)
          break;
      }
    });    

    const playbackState = usePlaybackState();

    const play = async (playback: State) => {
        const currentTrack = await TrackPlayer.getCurrentTrack()

        if (currentTrack !== null) {
          if (playback === State.Stopped || playback === State.Ready) {
            await TrackPlayer.play()
          }
        }
    }

    const stop = async (playback: State) => {
        const currentTrack = await TrackPlayer.getCurrentTrack()

        if (currentTrack !== null) {
            if (playback === State.Playing) {
                await TrackPlayer.pause(); 
                await TrackPlayer.seekTo(0);
            }
        }
    }

    const startTimer = async () => {
        if (temporizadorFinalizado) {
            setMinutes(25);
            setSeconds(0);
        }
        setStopped(false);
        setPaused(false);
        setTemporizadorFinalizado(false);
    };

    const pauseTimer = async () => {
        setPaused(true);
        setTemporizadorFinalizado(false);
    };

    const stopTimer = async () => {
        setStopped(true);
        setPaused(false);
        setMinutes(25);
        setSeconds(0);
        stop(playbackState);
        setTemporizadorFinalizado(true);
    };

    const resetTimer = async () => {
        setStopped(true);
        setPaused(true);
        setMinutes(25);
        setSeconds(0);
    };

  useEffect(() => {
        let interval: number;
        if (!stopped && !paused) {
            interval = BackgroundTimer.setInterval(() => {
                if (seconds > 0) {
                    setSeconds(seconds - 1);
                } else {
                    if (minutes === 0) {
                        BackgroundTimer.clearInterval(interval);
                        setStopped(true);
                        setTemporizadorFinalizado(true);
                        play(playbackState);
                    } else {
                        setMinutes(minutes - 1);
                        setSeconds(59);
                    }
                }
            }, 1000);
        }

        return () =>{
          if(interval){
            BackgroundTimer.clearInterval(interval);
          }
    };
   }, [stopped, paused, minutes, seconds]);

  return (
    <View style={styles.container}>
      <KeepAwake/>
      <Text style={styles.timerText}>
         {minutes<10 ? `0${minutes}`: minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </Text>
      <View style={styles.iconContainer}>
        <Icon name={paused ? 'play-box' : 'pause-octagon'} 
        size={100} 
        color="#192A56" 
        onPress={paused ? startTimer : pauseTimer} 
        />
        <Icon
            name={temporizadorFinalizado ? 'stop' : 'restore'}
            size={100}
            color="#192A56"
            onPress={temporizadorFinalizado ? stopTimer : resetTimer}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0ABDE3'
    },
    timerText: {
    fontSize: 100,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#192A56'
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});

export default TwentyFiveMinutesScreen;