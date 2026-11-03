import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { api } from '../api/client';
import { Search, Sparkles, MapPin, Heart, Check } from 'lucide-react-native';

export default function MatchmakingScreen() {
  const [query, setQuery] = useState(
    'I want to meet someone aged 25 to 32, educated, family-oriented, preferably from Kolkata'
  );
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [connectedIds, setConnectedIds] = useState<Record<string, boolean>>({});

  const sampleChips = [
    'Family-oriented in Kolkata',
    'Educated in New York',
    'Deep conversation lover in London',
  ];

  const handleSearch = async (textToSearch?: string) => {
    const q = textToSearch || query;
    if (!q.trim()) return;
    setLoading(true);
    try {
      const res = await api.searchMatchmaking(q);
      if (res.results) {
        setResults(res.results);
      }
    } catch (e) {
      console.log('Search error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const handleConnect = async (userId: string) => {
    try {
      await api.swipe(userId, 'SUPER_LIKE');
      setConnectedIds((prev) => ({ ...prev, [userId]: true }));
    } catch (e) {
      console.log('Connect error:', e);
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchSection}>
        <Text style={styles.title}>AI Matchmaking</Text>
        <Text style={styles.sub}>Type your preferences in natural English</Text>

        <View style={styles.inputBox}>
          <Search size={16} color="#94A3B8" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => handleSearch()}
            placeholder="e.g. Someone from Kolkata who wants marriage..."
            placeholderTextColor="#64748B"
            style={styles.input}
          />
          <TouchableOpacity style={styles.searchBtn} onPress={() => handleSearch()}>
            <Sparkles size={14} color="#080C16" />
          </TouchableOpacity>
        </View>

        {/* Suggestion Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
          {sampleChips.map((chip, i) => (
            <TouchableOpacity
              key={i}
              style={styles.chip}
              onPress={() => {
                setQuery(chip);
                handleSearch(chip);
              }}
            >
              <Text style={styles.chipText}>{chip}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Results Feed */}
      <ScrollView style={styles.feed} contentContainerStyle={{ paddingBottom: 30 }}>
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#F59E0B" />
            <Text style={styles.loadingText}>Evaluating compatibility dimensions...</Text>
          </View>
        ) : results.length > 0 ? (
          results.map((item, idx) => {
            const p = item.profile;
            const isConnected = connectedIds[p.id];

            return (
              <View key={p.id} style={styles.resultCard}>
                <View style={styles.cardHeader}>
                  <Image source={{ uri: p.photos[0] }} style={styles.avatar} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.name}>
                      {p.name}, {p.age}
                    </Text>
                    <Text style={styles.prof}>{p.profession}</Text>
                    <View style={styles.row}>
                      <MapPin size={11} color="#F43F5E" />
                      <Text style={styles.city}>{p.location.city}</Text>
                    </View>
                  </View>
                  <View style={styles.scoreBadge}>
                    <Text style={styles.scoreText}>{item.matchScore}%</Text>
                  </View>
                </View>

                {/* Compatibility Radar Breakdown */}
                {item.compatibilityBreakdown && (
                  <View style={styles.breakdownRow}>
                    <View style={styles.breakdownItem}>
                      <Text style={styles.bLabel}>Values</Text>
                      <Text style={styles.bVal}>{item.compatibilityBreakdown.values}%</Text>
                    </View>
                    <View style={styles.breakdownItem}>
                      <Text style={styles.bLabel}>Lifestyle</Text>
                      <Text style={styles.bVal}>{item.compatibilityBreakdown.lifestyle}%</Text>
                    </View>
                    <View style={styles.breakdownItem}>
                      <Text style={styles.bLabel}>Interests</Text>
                      <Text style={styles.bVal}>{item.compatibilityBreakdown.interests}%</Text>
                    </View>
                    <View style={styles.breakdownItem}>
                      <Text style={styles.bLabel}>Location</Text>
                      <Text style={styles.bVal}>{item.compatibilityBreakdown.ageLocation}%</Text>
                    </View>
                  </View>
                )}

                {/* Reason */}
                <View style={styles.reasonBox}>
                  <Text style={styles.reasonText}>
                    ✨ {item.matchReasons?.[0] || 'High personality and value synergy'}
                  </Text>
                </View>

                {/* Connect button */}
                <TouchableOpacity
                  style={[styles.connectBtn, isConnected && styles.connectedBtn]}
                  onPress={() => handleConnect(p.id)}
                  disabled={isConnected}
                >
                  {isConnected ? (
                    <View style={styles.row}>
                      <Check size={14} color="#34D399" />
                      <Text style={[styles.connectText, { color: '#34D399' }]}>Connected</Text>
                    </View>
                  ) : (
                    <View style={styles.row}>
                      <Heart size={14} color="#FFFFFF" fill="#FFFFFF" />
                      <Text style={styles.connectText}>Connect & Like</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            );
          })
        ) : (
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>No matching profiles found.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080C16',
    paddingTop: 50,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#141E33',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FDE68A',
  },
  sub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
    marginBottom: 12,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F1626',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#1F2E4D',
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 12,
    marginLeft: 8,
  },
  searchBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipScroll: {
    marginTop: 10,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: '#1E293B',
    marginRight: 8,
  },
  chipText: {
    fontSize: 10,
    color: '#CBD5E1',
  },
  feed: {
    flex: 1,
    padding: 16,
  },
  centerContainer: {
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 10,
  },
  resultCard: {
    backgroundColor: '#0F1626',
    borderRadius: 22,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1F2E4D',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  prof: {
    fontSize: 11,
    color: '#FCD34D',
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  city: {
    fontSize: 11,
    color: '#94A3B8',
  },
  scoreBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scoreText: {
    color: '#F59E0B',
    fontWeight: 'bold',
    fontSize: 13,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#080C16',
    borderRadius: 12,
    padding: 8,
    marginTop: 12,
  },
  breakdownItem: {
    alignItems: 'center',
  },
  bLabel: {
    fontSize: 9,
    color: '#64748B',
  },
  bVal: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FCD34D',
    marginTop: 2,
  },
  reasonBox: {
    backgroundColor: 'rgba(8, 12, 22, 0.6)',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  reasonText: {
    fontSize: 11,
    color: '#CBD5E1',
    lineHeight: 16,
  },
  connectBtn: {
    backgroundColor: '#E11D48',
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  connectedBtn: {
    backgroundColor: 'rgba(52, 211, 153, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.4)',
  },
  connectText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 12,
  },
});
