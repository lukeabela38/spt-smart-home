// Personal streaming dock. App names are resolved against the TV at launch.
var LAUNCHER_LOCAL = {
  clock24h: true,
  cinema: true,
  wallpapers: { minutes: 0, files: ['gradient:#101d2d,#213e58,#2b344b', 'gradient:#171d2b,#293349,#343140', 'gradient:#10272a,#234247,#1c2e40'] },
  weather: { latitude: null, longitude: null, units: 'celsius' },
  favorites: [
    { title: 'Netflix', match: ['org.tizen.netflix-app', 'Netflix'], bg: '#141414', accent: '#e50914' },
    { title: 'YouTube', match: ['YouTube'], bg: '#181818', accent: '#ff0033' },
    { title: 'Disney+', match: ['Disney+', 'Disney Plus', 'DisneyPlus'], bg: '#092b48', accent: '#1fb1c9' },
    { title: 'Apple TV', match: ['com.samsung.tv.aria-video', 'Apple TV', 'AppleTV'], bg: '#202020', accent: '#dddddd' },
    { title: 'Apple Music', match: ['org.tizen.apple.apple-music', 'Apple Music', 'AppleMusic'], bg: 'linear-gradient(160deg, #fa4563, #c8123a)', accent: '#fa294d' },
    { title: 'GO', match: ['yclr7ehFWT.gomaltavisualon', 'GO', 'GO TV'], bg: '#4c236c', accent: '#a86be0' }
  ]
};
