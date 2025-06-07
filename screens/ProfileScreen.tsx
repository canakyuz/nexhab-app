import React, { useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Award, Calendar, BarChart2, Settings, LogOut, Info, ChevronRight } from 'lucide-react-native';
import { useStatsStore } from '../lib/store/statsStore';

export default function ProfileScreen() {
  const { stats, weeklyStats, monthlyStats, fetchTodayStats, fetchWeeklyStats, fetchMonthlyStats } = useStatsStore();

  useEffect(() => {
    fetchTodayStats();
    fetchWeeklyStats();
    fetchMonthlyStats();
  }, []);

  // Aylık istatistikleri hesapla
  const monthlyHabits = monthlyStats.reduce((sum, day) => sum + day.completedHabits, 0);
  const monthlyTasks = monthlyStats.reduce((sum, day) => sum + day.completedTasks, 0);
  
  // Haftalık istatistikleri hesapla
  const weeklyHabits = weeklyStats.reduce((sum, day) => sum + day.completedHabits, 0);
  const weeklyTasks = weeklyStats.reduce((sum, day) => sum + day.completedTasks, 0);

  // En uzun seri
  const longestStreak = stats ? stats.streakDays : 0;

  return (
    <ScrollView style={styles.container}>
      {/* Profil Başlığı */}
      <View style={styles.profileHeader}>
        <View style={styles.profileAvatar}>
          <Text style={styles.profileInitials}>AU</Text>
        </View>
        <Text style={styles.profileName}>Atomic User</Text>
        <Text style={styles.profileTagline}>Alışkanlıklarınızı geliştirin</Text>
      </View>

      {/* İstatistikler */}
      <View style={styles.statsCard}>
        <Text style={styles.sectionTitle}>İstatistikler</Text>

        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <BarChart2 size={24} color="#3498db" style={styles.statIcon} />
            <View>
              <Text style={styles.statLabel}>Bugün</Text>
              <Text style={styles.statValue}>
                {stats ? `${stats.completedHabits} alışkanlık, ${stats.completedTasks} görev` : 'Yükleniyor...'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <Calendar size={24} color="#2ecc71" style={styles.statIcon} />
            <View>
              <Text style={styles.statLabel}>Bu Hafta</Text>
              <Text style={styles.statValue}>
                {weeklyStats.length > 0 ? `${weeklyHabits} alışkanlık, ${weeklyTasks} görev` : 'Veri yok'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <Award size={24} color="#e67e22" style={styles.statIcon} />
            <View>
              <Text style={styles.statLabel}>En Uzun Seri</Text>
              <Text style={styles.statValue}>{longestStreak} gün</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Ayarlar ve Diğer Seçenekler */}
      <View style={styles.settingsCard}>
        <Text style={styles.sectionTitle}>Ayarlar</Text>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Settings size={22} color="#555" style={styles.settingIcon} />
            <Text style={styles.settingText}>Uygulama Ayarları</Text>
          </View>
          <ChevronRight size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Info size={22} color="#555" style={styles.settingIcon} />
            <Text style={styles.settingText}>Hakkında</Text>
          </View>
          <ChevronRight size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <LogOut size={22} color="#e74c3c" style={styles.settingIcon} />
            <Text style={[styles.settingText, { color: '#e74c3c' }]}>Çıkış Yap</Text>
          </View>
          <ChevronRight size={20} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Uygulama Bilgisi */}
      <View style={styles.appInfoCard}>
        <Text style={styles.appVersion}>Atomic Habits v1.0.0</Text>
        <Text style={styles.appCopyright}>
          Bu uygulama James Clear'in "Atomic Habits" kitabından ilham alınarak geliştirilmiştir.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileHeader: {
    backgroundColor: '#3498db',
    padding: 30,
    alignItems: 'center',
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileInitials: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3498db',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  profileTagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statsCard: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  settingsCard: {
    backgroundColor: '#fff',
    margin: 15,
    marginTop: 0,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  statRow: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    marginRight: 15,
  },
  statLabel: {
    fontSize: 14,
    color: '#777',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 15,
  },
  settingText: {
    fontSize: 16,
    color: '#333',
  },
  appInfoCard: {
    margin: 15,
    marginTop: 0,
    marginBottom: 30,
    padding: 15,
    alignItems: 'center',
  },
  appVersion: {
    fontSize: 14,
    color: '#777',
    marginBottom: 5,
  },
  appCopyright: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
}); 