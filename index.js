import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import TrackPlayer from 'react-native-track-player';
import { setupPlayer, playbackService } from './musicPlayerServices';

AppRegistry.registerComponent(appName, () => App);


(async () => {
    await setupPlayer();
    TrackPlayer.registerPlaybackService(() => playbackService);
})();
