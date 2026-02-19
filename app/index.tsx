import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { COLORS } from '../shared/const/colors'

export default function Index() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
