import { View, Text, StyleSheet, ScrollView, Image } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useWeatherStore } from '../shared/store'
import { COLORS } from '../shared/const/colors'

const ICON_BASE = 'https://openweathermap.org/img/wn'

function DetailRow({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  )
}

export default function WeatherDetailsScreen() {
  const insets = useSafeAreaInsets()
  const currentWeather = useWeatherStore((s) => s.currentWeather)

  if (!currentWeather) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.noData}>No weather data</Text>
        <Text style={styles.backHint} onPress={() => router.back()}>
          Back
        </Text>
      </View>
    )
  }

  const w = currentWeather.weather[0]
  const m = currentWeather.main
  const formatTime = (unix: number) => {
    const d = new Date(unix * 1000)
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title} onPress={() => router.back()}>
          ← Back
        </Text>
        <Text style={styles.city}>{currentWeather.name}, {currentWeather.sys.country}</Text>
      </View>

      <View style={styles.hero}>
        <Image source={{ uri: `${ICON_BASE}/${w.icon}@2x.png` }} style={styles.bigIcon} />
        <Text style={styles.mainDesc}>{w.description}</Text>
        <Text style={styles.temp}>{Math.round(m.temp)}°</Text>
        <Text style={styles.feels}>Feels like {Math.round(m.feels_like)}°</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Temperature</Text>
        <DetailRow label="Min" value={`${Math.round(m.temp_min)}°`} />
        <DetailRow label="Max" value={`${Math.round(m.temp_max)}°`} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Atmosphere</Text>
        <DetailRow label="Pressure" value={`${m.pressure} hPa`} />
        <DetailRow label="Humidity" value={`${m.humidity}%`} />
        <DetailRow label="Visibility" value={`${(currentWeather.visibility / 1000).toFixed(1)} km`} />
        <DetailRow label="Cloudiness" value={`${currentWeather.clouds.all}%`} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Wind</Text>
        <DetailRow label="Speed" value={`${currentWeather.wind.speed} m/s`} />
        <DetailRow label="Direction" value={`${currentWeather.wind.deg}°`} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Sun</Text>
        <DetailRow label="Sunrise" value={formatTime(currentWeather.sys.sunrise)} />
        <DetailRow label="Sunset" value={formatTime(currentWeather.sys.sunset)} />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.main,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  noData: {
    color: COLORS.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
  backHint: {
    color: COLORS.primary,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 17,
    color: COLORS.primary,
    marginBottom: 8,
  },
  city: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 24,
    backgroundColor: 'rgba(248, 250, 252, 0.04)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(248, 250, 252, 0.06)',
  },
  bigIcon: {
    width: 120,
    height: 120,
    marginBottom: 8,
  },
  mainDesc: {
    fontSize: 18,
    color: COLORS.textSecondary,
    textTransform: 'capitalize',
    marginBottom: 8,
  },
  temp: {
    fontSize: 56,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -2,
  },
  feels: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  card: {
    backgroundColor: 'rgba(248, 250, 252, 0.06)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(248, 250, 252, 0.06)',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(248, 250, 252, 0.06)',
  },
  detailLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
})
