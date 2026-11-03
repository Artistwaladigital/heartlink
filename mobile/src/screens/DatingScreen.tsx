import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  Dimensions,
} from 'react-native';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Heart, X, Star, MapPin, Briefcase, Sparkles, CheckCircle2 } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function DatingScreen() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [matchModal, setMatchModal] = useState<any | null>(null);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const data = await api.getDiscover();
      if (data.profiles) {
        setProfiles(data.profiles);
      }
    } catch (e) {
      console.log('Discover error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [user]);

  const handleSwipe = async (type: 'LIKE' | 'PASS' | 'SUPER_LIKE') => {
    if (currentIndex >= profiles.length) return;
    const target = profiles[currentIndex];

    try {
      const res = await api.swipe(target.id, type);
      if (res.matched) {
        setMatchModal(target);
      }
      setCurrentIndex((prev) => prev + 1);
      setCurrentPhotoIdx(0);
    } catch (e) {
      console.log('Swipe error:', e);
    }
  };

  const current = profiles[currentIndex];

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brandTitle}>HEARTLINK</Text>
          <Text style={styles.subtitle}>Modern Dating & Discovery</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{user?.membershipTier || 'FREE'}</Text>
        </View>
      </View>

      {/* Main Content */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#F43F5E" />
          <Text style={styles.loadingText}>Curating compatible profiles...</Text>
        </View>
      ) : current ? (
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            {/* Main Photo */}
            <Image
              source={{ uri: current.photos[currentPhotoIdx] || current.photos[0] }}
              style={styles.cardImage}
            />

            {/* Compatibility Tag */}
            <View style={styles.compBadge}>
              <Sparkles size={12} color="#FDA4AF" />
              <Text style={styles.compText}>{current.compatibilityScore || 92}% Match</Text>
            </View>

            {/* Info Overlay */}
            <View style={styles.cardInfo}>
              <Text style={styles.nameText}>
                {current.name}, {current.age}
              </Text>
              <View style={styles.row}>
                <MapPin size={13} color="#F43F5E" />
                <Text style={styles.locationText}>
                  {current.location.city}, {current.location.country}
                </Text>
              </View>
              <View style={[styles.row, { marginTop: 4 }]}>
                <Briefcase size={13} color="#94A3B8" />
                <Text style={styles.professionText}>{current.profession}</Text>
              </View>

              <Text style={styles.bioText} numberOfLines={2}>
                &ldquo;{current.bio}&rdquo;
              </Text>

              {/* Goal Chip */}
              <View style={styles.goalChip}>
                <Text style={styles.goalText}>
                  Goal: {current.relationshipGoals.replace(/_/g, ' ')}
                </Text>
              </View>
            </View>
          </View>

          {/* Action Bar */}
          <View style={styles.actionBar}>
            {/* PASS */}
            <TouchableOpacity style={styles.passBtn} onPress={() => handleSwipe('PASS')}>
              <X size={26} color="#94A3B8" />
            </TouchableOpacity>

            {/* SUPER LIKE */}
            <TouchableOpacity style={styles.superBtn} onPress={() => handleSwipe('SUPER_LIKE')}>
              <Star size={24} color="#F59E0B" fill="#F59E0B" />
            </TouchableOpacity>

            {/* LIKE */}
            <TouchableOpacity style={styles.likeBtn} onPress={() => handleSwipe('LIKE')}>
              <Heart size={30} color="#FFFFFF" fill="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyTitle}>You&apos;ve Explored Everyone!</Text>
          <Text style={styles.emptySubtitle}>
            New members join daily. Try AI Matchmaking or Blind Match pool!
          </Text>
          <TouchableOpacity
            style={styles.restartBtn}
            onPress={() => {
              setCurrentIndex(0);
              fetchProfiles();
            }}
          >
            <Text style={styles.restartText}>Restart Card Deck</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Match Celebration Modal */}
      {matchModal && (
        <Modal transparent animationType="fade" visible={!!matchModal}>
          <View style={styles.modalBackdrop}>
            <View style={styles.matchBox}>
              <View style={styles.heartCircle}>
                <Heart size={36} color="#FFFFFF" fill="#FFFFFF" />
              </View>
              <Text style={styles.matchTitle}>It&apos;s a Match!</Text>
              <Text style={styles.matchSub}>
                You and {matchModal.name} have mutually liked each other.
              </Text>

              <TouchableOpacity
                style={styles.modalBtn}
                onPress={() => setMatchModal(null)}
              >
                <Text style={styles.modalBtnText}>Keep Swiping</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
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
  brandTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FDA4AF',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#F59E0B',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  loadingText: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 12,
  },
  cardContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#0F1626',
    borderWidth: 1,
    borderColor: '#1F2E4D',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  compBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(15, 22, 38, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.4)',
  },
  compText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  cardInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(8, 12, 22, 0.85)',
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#E2E8F0',
  },
  professionText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  bioText: {
    fontSize: 12,
    color: '#CBD5E1',
    marginTop: 8,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  goalChip: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(244, 63, 94, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.4)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 10,
  },
  goalText: {
    color: '#FDA4AF',
    fontSize: 10,
    fontWeight: '600',
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 14,
  },
  passBtn: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#0F1626',
    borderWidth: 1,
    borderColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },
  superBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  likeBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E11D48',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#F43F5E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 20,
  },
  restartBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
  },
  restartText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  matchBox: {
    width: '100%',
    backgroundColor: '#0F1626',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#E11D48',
    padding: 24,
    alignItems: 'center',
  },
  heartCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#E11D48',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  matchTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  matchSub: {
    fontSize: 12,
    color: '#CBD5E1',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
  },
  modalBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#E11D48',
    alignItems: 'center',
  },
  modalBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
