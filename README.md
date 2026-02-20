# Weather App

A modern mobile weather application built with React Native and Expo. The app provides real-time weather information based on the user's location or city search, utilizing the OpenWeatherMap API.

## Features

- **Location-based Weather** — automatic location detection and current weather display
- **City Search** — search weather for any city worldwide with autocomplete suggestions
- **Detailed Information** — temperature, humidity, wind speed, pressure, sunrise and sunset times
- **Favorite Cities** — save cities to favorites for quick access
- **Offline Mode** — data caching for viewing without internet connection
- **Authentication** — login and registration via Firebase

## Technologies

| Category | Technology |
|----------|------------|
| Framework | React Native 0.81, Expo 54 |
| Navigation | Expo Router 6 |
| Language | TypeScript 5.9 |
| State Management | Zustand |
| Backend/Auth | Firebase |
| Forms | React Hook Form + Yup |
| Data Storage | AsyncStorage, Expo SecureStore (analogue Keychain (react-native-keychain)) |
| Network | @react-native-community/netinfo |
| Linting | ESLint, Prettier |

## Installation and Setup

### Requirements

- Node.js 18+
- npm or yarn
- Expo CLI

### Steps

1. **Clone the repository**

```bash
git clone <repository-url>
cd weather-app
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the project root:

```env
EXPO_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here
```

Get your API key at [OpenWeatherMap](https://openweathermap.org/api).

4. **Configure Firebase**

Create a project in [Firebase Console](https://console.firebase.google.com/) and add the configuration to `firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

5. **Run the application**

```bash
# Start Expo Dev Server
npm start

# Or for a specific platform
npm run ios
npm run android
npm run web
```

## API Integration

The app uses OpenWeatherMap API:

| Endpoint | Description |
|----------|-------------|
| `/weather?q={city}` | Weather by city name |
| `/weather?lat={lat}&lon={lon}` | Weather by coordinates |
| `/weather?id={cityId}` | Weather by city ID |
| `/geo/1.0/direct?q={query}` | Geocoding for autocomplete |

## Data Storage

### AsyncStorage

Used for caching non-sensitive data:
- Home screen weather data
- Favorite cities weather
- Favorite city IDs
- User preferences

### Expo SecureStore

Used for secure storage:
- Firebase authentication tokens

## Error Handling and Offline Mode

- Network status monitoring via `@react-native-community/netinfo`
- Display cached data when offline
- Informative error messages
- Pull-to-refresh for data updates

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo Dev Server |
| `npm run ios` | Run on iOS Simulator |
| `npm run android` | Run on Android Emulator |
| `npm run web` | Run in browser |
