import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { Crown, ShieldCheck, Sparkles, User, Users, Check } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, demoAccounts, switchAccount, refreshUser } = useAuth();
  const [upgrading, setUpgrading] = useState(false);

  const handleUpgrade = async (plan: 'GOLD' | 'PLATINUM') => {
    setUpgrading(true);
    try {
      const res = await api.checkout(plan, 'YEARLY');
      if (res.success) {
        Alert.alert('🎉 VIP Upgrade Successful!', `You are now upgraded to ${plan} tier.`);
        refreshUser();
      }
    } catch (e) {
      console.log('Upgrade error:', e);
    } finally {
      setUpgrading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header Profile Card */}
      <View style={styles.headerCard}>
        <Image
          source={{ uri: user?.photos?.[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>
          {user?.name}, {user?.age}
        </Text>
        <Text style={styles.loc}>
          📍 {user?.location?.city}, {user?.location?.country}
        </Text>

        <View style={styles.tierPill}>
          <Crown size={12} color="#F59E0B" />
          <Text style={styles.tierText}>{user?.membershipTier || 'FREE'} MEMBER</Text>
        </View>

        <Text style={styles.bio}>&ldquo;{user?.bio}&rdquo;</Text>
      </View>

      {/* 1-Click Demo Persona Switcher */}
      <View style={styles.section}>
        <Text style={styles.secTitle}>Quick Demo Persona Switcher</Text>
        <Text style={styles.secSub}>Tap to switch identity and test different experiences:</Text>

        <View style={styles.personasGrid}>
          {demoAccounts.map((acc) => {
            const isMe = user?.id === acc.id;
            return (
              <TouchableOpacity
                key={acc.id}
                style={[styles.personaItem, isMe && styles.personaItemActive]}
                onPress={() => switchAccount(acc.id)}
              >
                <Image source={{ uri: acc.avatar }} style={styles.miniAvatar} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.pItemName} numberOfLines={1}>
                    {acc.name} ({acc.age})
                  </Text>
                  <Text style={styles.pItemSub} numberOfLines={1}>
                    {acc.city} • {acc.role === 'ADMIN' ? 'ADMIN' : acc.membershipTier}
                  </Text>
                </View>
                {isMe && <Check size={16} color="#F43F5E" />}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* VIP Membership Plans */}
      <View style={styles.section}>
        <Text style={styles.secTitle}>VIP Membership Upgrades</Text>
        <Text style={styles.secSub}>Unlock unlimited swipes, priority discovery & blind pool</Text>

        <View style={styles.planCard}>
          <View style={styles.planHeader}>
            <Text style={styles.planTitle}>Gold Tier</Text>
            <Text style={styles.planPrice}>$29.99 / mo</Text>
          </View>
          <Text style={styles.planBenefit}>• Unlimited daily likes & 5 Super Likes</Text>
          <Text style={styles.planBenefit}>• Advanced Matchmaking criteria filters</Text>
          <Text style={styles.planBenefit}>• Read receipts in chat</Text>

          <TouchableOpacity
            style={styles.goldBtn}
            onPress={() => handleUpgrade('GOLD')}
            disabled={user?.membershipTier === 'GOLD' || upgrading}
          >
            <Text style={styles.goldBtnText}>
              {user?.membershipTier === 'GOLD' ? 'Current Tier ✓' : 'Upgrade to Gold'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.planCard, styles.planCardPlat]}>
          <View style={styles.planHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Crown size={16} color="#F59E0B" />
              <Text style={styles.platTitle}>Platinum VIP</Text>
            </View>
            <Text style={styles.platPrice}>$59.99 / mo</Text>
          </View>
          <Text style={styles.planBenefit}>• 3x Priority Discovery Deck Visibility</Text>
          <Text style={styles.planBenefit}>• Unlimited Blind Matches in Soulmate Pool</Text>
          <Text style={styles.planBenefit}>• 20 Super Likes daily + VIP Gold badge</Text>

          <TouchableOpacity
            style={styles.platBtn}
            onPress={() => handleUpgrade('PLATINUM')}
            disabled={user?.membershipTier === 'PLATINUM' || upgrading}
          >
            <Text style={styles.platBtnText}>
              {user?.membershipTier === 'PLATINUM' ? 'Current Tier ✓' : 'Upgrade to Platinum VIP'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080C16',
    paddingTop: 50,
  },
  headerCard: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#0F1626',
    borderBottomWidth: 1,
    borderBottomColor: '#1F2E4D',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: '#F43F5E',
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  loc: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  tierPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
    marginTop: 10,
  },
  tierText: {
    color: '#F59E0B',
    fontSize: 11,
    fontWeight: 'bold',
  },
  bio: {
    fontSize: 12,
    color: '#CBD5E1',
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
    paddingHorizontal: 16,
    lineHeight: 18,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#141E33',
  },
  secTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  secSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
    marginBottom: 14,
  },
  personasGrid: {
    gap: 8,
  },
  personaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F1626',
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#1F2E4D',
  },
  personaItemActive: {
    borderColor: '#F43F5E',
    backgroundColor: 'rgba(244, 63, 94, 0.1)',
  },
  miniAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  pItemName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  pItemSub: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 1,
  },
  planCard: {
    backgroundColor: '#0F1626',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    marginBottom: 12,
  },
  planCardPlat: {
    borderColor: 'rgba(244, 63, 94, 0.5)',
    backgroundColor: 'rgba(244, 63, 94, 0.05)',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  planTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FCD34D',
  },
  planPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  platTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FDA4AF',
  },
  platPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  planBenefit: {
    fontSize: 11,
    color: '#CBD5E1',
    lineHeight: 18,
  },
  goldBtn: {
    backgroundColor: '#F59E0B',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 14,
  },
  goldBtnText: {
    color: '#080C16',
    fontSize: 12,
    fontWeight: 'bold',
  },
  platBtn: {
    backgroundColor: '#E11D48',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 14,
  },
  platBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
