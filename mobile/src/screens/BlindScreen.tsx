import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { EyeOff, Sparkles, Lock, CheckCircle, Heart, Moon } from 'lucide-react-native';

export default function BlindScreen() {
  const { user, refreshUser } = useAuth();
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [matchingPool, setMatchingPool] = useState(false);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const data = await api.getBlindMatches();
      if (data.matches) {
        setMatches(data.matches);
      }
    } catch (e) {
      console.log('Blind matches error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [user]);

  const handleFindBlind = async () => {
    setMatchingPool(true);
    try {
      const res = await api.createBlindMatch();
      if (res.success) {
        Alert.alert('Spark Found!', 'A new anonymous soulmate was found in the pool.');
        fetchMatches();
      } else {
        Alert.alert('Pool Status', res.error || 'No candidate ready in pool right now.');
      }
    } catch (e) {
      console.log('Find error:', e);
    } finally {
      setMatchingPool(false);
    }
  };

  const handleConsent = async (matchId: string) => {
    try {
      const res = await api.consentReveal(matchId);
      if (res.success) {
        if (res.isNowRevealed) {
          Alert.alert('🎉 Mutual Reveal Granted!', 'Both have consented. Profiles are now unlocked!');
        } else {
          Alert.alert('Request Sent', 'Waiting for your partner to consent.');
        }
        fetchMatches();
      }
    } catch (e) {
      console.log('Consent error:', e);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Blind Matchmaking</Text>
          <Text style={styles.sub}>Soul-first connection • Zero identity leaks</Text>
        </View>
        <TouchableOpacity
          style={styles.findBtn}
          onPress={handleFindBlind}
          disabled={matchingPool}
        >
          <Sparkles size={12} color="#FFFFFF" />
          <Text style={styles.findText}>{matchingPool ? '...' : 'Find'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Persona Banner */}
        <View style={styles.personaCard}>
          <View style={styles.avatarCircle}>
            <Moon size={22} color="#C084FC" />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.personaLabel}>Your Anonymous Persona:</Text>
            <Text style={styles.personaName}>
              {user?.blindProfile?.pseudonym || 'Celestial Muse'}
            </Text>
            <Text style={styles.personaBio} numberOfLines={1}>
              {user?.blindProfile?.soulmateSummary || 'Searching for deep emotional resonance'}
            </Text>
          </View>
        </View>

        {/* Section Title */}
        <Text style={styles.secTitle}>Active Anonymous Matches ({matches.length})</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#C084FC" style={{ marginTop: 40 }} />
        ) : matches.length > 0 ? (
          matches.map((item) => {
            const p = item.partnerAnonymousProfile;
            const bm = item.blindMatch;
            const isRevealed = p.isRevealed;

            return (
              <View
                key={bm.id}
                style={[styles.matchCard, isRevealed && styles.matchCardRevealed]}
              >
                <View style={styles.matchTop}>
                  {isRevealed && p.realProfile ? (
                    <Image
                      source={{ uri: p.realProfile.photos[0] }}
                      style={styles.partnerPhoto}
                    />
                  ) : (
                    <View style={styles.partnerMask}>
                      <Moon size={24} color="#C084FC" />
                    </View>
                  )}

                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.pName}>
                      {isRevealed && p.realProfile ? p.realProfile.name : p.pseudonym}
                    </Text>
                    <Text style={styles.pMeta}>
                      {p.age} yrs • Region: {p.city}
                    </Text>
                    <Text style={styles.pGoal}>
                      Goal: {p.relationshipGoals.replace(/_/g, ' ')}
                    </Text>
                  </View>

                  <View style={styles.scorePill}>
                    <Text style={styles.scoreVal}>{bm.compatibilityScore}%</Text>
                  </View>
                </View>

                {/* Soul Quote */}
                <View style={styles.quoteBox}>
                  <Text style={styles.quoteText}>
                    &ldquo;{p.soulmateSummary || 'Seeks emotional honesty and true partnership.'}&rdquo;
                  </Text>
                </View>

                {/* Reveal Status & Action */}
                <View style={styles.revealBar}>
                  {isRevealed ? (
                    <View style={styles.row}>
                      <CheckCircle size={14} color="#34D399" />
                      <Text style={styles.revGreen}>Profiles Unlocked & Visible</Text>
                    </View>
                  ) : p.hasPartnerConsented ? (
                    <TouchableOpacity
                      style={styles.consentBtn}
                      onPress={() => handleConsent(bm.id)}
                    >
                      <Sparkles size={14} color="#FFFFFF" />
                      <Text style={styles.consentText}>Partner Wants To Reveal! Accept</Text>
                    </TouchableOpacity>
                  ) : p.hasUserConsented ? (
                    <View style={styles.row}>
                      <Lock size={13} color="#C084FC" />
                      <Text style={styles.waitText}>Waiting for {p.pseudonym} to consent...</Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.requestBtn}
                      onPress={() => handleConsent(bm.id)}
                    >
                      <Lock size={12} color="#C084FC" />
                      <Text style={styles.reqText}>Request Mutual Reveal</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No Blind Matches Yet</Text>
            <Text style={styles.emptySub}>
              Tap the &ldquo;Find&rdquo; button above to match from the anonymous soulmate pool!
            </Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#141E33',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E9D5FF',
  },
  sub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  findBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#9333EA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  findText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  personaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(88, 28, 135, 0.25)',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.4)',
    marginBottom: 20,
  },
  avatarCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(147, 51, 234, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  personaLabel: {
    fontSize: 10,
    color: '#C084FC',
    fontWeight: '600',
  },
  personaName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 1,
  },
  personaBio: {
    fontSize: 11,
    color: '#CBD5E1',
    marginTop: 2,
  },
  secTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  matchCard: {
    backgroundColor: '#0F1626',
    borderRadius: 22,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1F2E4D',
  },
  matchCardRevealed: {
    borderColor: 'rgba(244, 63, 94, 0.5)',
    backgroundColor: 'rgba(244, 63, 94, 0.05)',
  },
  matchTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  partnerPhoto: {
    width: 54,
    height: 54,
    borderRadius: 16,
  },
  partnerMask: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: 'rgba(147, 51, 234, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(147, 51, 234, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  pMeta: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  pGoal: {
    fontSize: 10,
    color: '#C084FC',
    fontWeight: '600',
    marginTop: 2,
  },
  scorePill: {
    backgroundColor: 'rgba(147, 51, 234, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  scoreVal: {
    color: '#C084FC',
    fontWeight: 'bold',
    fontSize: 11,
  },
  quoteBox: {
    backgroundColor: '#080C16',
    borderRadius: 12,
    padding: 10,
    marginTop: 12,
  },
  quoteText: {
    fontSize: 11,
    color: '#E2E8F0',
    fontStyle: 'italic',
  },
  revealBar: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#1F2E4D',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  revGreen: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: 'bold',
  },
  consentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#E11D48',
    borderRadius: 12,
    paddingVertical: 9,
  },
  consentText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  waitText: {
    color: '#C084FC',
    fontSize: 11,
  },
  requestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: '#334155',
  },
  reqText: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '600',
  },
  emptyCard: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#0F1626',
    borderRadius: 20,
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },
});
