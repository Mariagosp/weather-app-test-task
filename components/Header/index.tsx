import { StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { COLORS } from '../../shared/const/colors'

type Props = {
  subtitle?: string
}

export default function Header({ subtitle = 'Your weather by location' }: Props) {
  const insets = useSafeAreaInsets()

  return (
    <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Weather</Text>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>
            {new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}
          </Text>
        </View>
      </View>
      <Text style={styles.headerSubtitle}>{subtitle}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(248, 250, 252, 0.08)'
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: COLORS.text,
        letterSpacing: -0.5
    },
    headerBadge: {
        backgroundColor: 'rgba(248, 250, 252, 0.08)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12
    },
    headerBadgeText: {
        fontSize: 13,
        color: COLORS.textSecondary,
        fontWeight: '600'
    },
    headerSubtitle: {
        fontSize: 15,
        color: COLORS.textSecondary
    }
})
