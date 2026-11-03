import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Send, Sparkles, MessageCircle, Moon, Check, CheckCheck } from 'lucide-react-native';

export default function ChatScreen() {
  const { user } = useAuth();
  const [blindMatches, setBlindMatches] = useState<any[]>([]);
  const [activeMatch, setActiveMatch] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  const scrollViewRef = useRef<ScrollView>(null);

  const fetchConversations = async () => {
    try {
      const data = await api.getBlindMatches();
      if (data.matches && data.matches.length > 0) {
        setBlindMatches(data.matches);
        if (!activeMatch) {
          setActiveMatch(data.matches[0]);
        }
      }
    } catch (e) {
      console.log('Chat conversations error:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (matchId: string) => {
    try {
      const res = await api.getMessages(matchId);
      if (res.messages) {
        setMessages(res.messages);
      }
    } catch (e) {
      console.log('Messages error:', e);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [user]);

  useEffect(() => {
    if (activeMatch) {
      fetchMessages(activeMatch.blindMatch.id);
      const interval = setInterval(() => {
        fetchMessages(activeMatch.blindMatch.id);
      }, 3500);
      return () => clearInterval(interval);
    }
  }, [activeMatch]);

  const handleSend = async () => {
    if (!input.trim() || !activeMatch || sending) return;
    setSending(true);
    const text = input.trim();
    setInput('');

    try {
      const res = await api.sendMessage(
        activeMatch.blindMatch.id,
        text,
        'BLIND_MATCH'
      );
      if (res.message) {
        setMessages((prev) => [...prev, res.message]);
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    } catch (e) {
      console.log('Send error:', e);
    } finally {
      setSending(false);
    }
  };

  const partner = activeMatch?.partnerAnonymousProfile;
  const isRevealed = partner?.isRevealed;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerPartner}>
          {isRevealed && partner?.realProfile ? (
            <Image
              source={{ uri: partner.realProfile.photos[0] }}
              style={styles.headerAvatar}
            />
          ) : (
            <View style={styles.headerMask}>
              <Moon size={18} color="#C084FC" />
            </View>
          )}
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.headerName}>
              {isRevealed && partner?.realProfile ? partner.realProfile.name : partner?.pseudonym || 'Soulmate'}
            </Text>
            <Text style={styles.headerStatus}>
              {isRevealed ? 'Revealed • Active now' : 'Anonymous • End-to-end Encrypted'}
            </Text>
          </View>
        </View>
      </View>

      {/* Messages Feed */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messageList}
        contentContainerStyle={{ padding: 16 }}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((m, idx) => (
          <View
            key={m.id || idx}
            style={[styles.msgWrapper, m.isMine ? styles.msgRight : styles.msgLeft]}
          >
            <View
              style={[
                styles.bubble,
                m.isMine ? styles.bubbleMine : styles.bubblePartner,
              ]}
            >
              <Text style={[styles.msgText, m.isMine ? styles.textMine : styles.textPartner]}>
                {m.content}
              </Text>
            </View>
            <Text style={styles.timeText}>
              {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Input Bar */}
      <View style={styles.inputBar}>
        <TextInput
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleSend}
          placeholder="Type an authentic message..."
          placeholderTextColor="#64748B"
          style={styles.textInput}
        />
        <TouchableOpacity
          style={[styles.sendBtn, !input.trim() && { opacity: 0.5 }]}
          onPress={handleSend}
          disabled={!input.trim() || sending}
        >
          <Send size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080C16',
    paddingTop: 50,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#141E33',
    backgroundColor: '#0B0F19',
  },
  headerPartner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerMask: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(147, 51, 234, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(147, 51, 234, 0.4)',
  },
  headerName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerStatus: {
    fontSize: 10,
    color: '#34D399',
    marginTop: 2,
  },
  messageList: {
    flex: 1,
  },
  msgWrapper: {
    marginBottom: 12,
    maxWidth: '80%',
  },
  msgRight: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  msgLeft: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleMine: {
    backgroundColor: '#E11D48',
    borderBottomRightRadius: 4,
  },
  bubblePartner: {
    backgroundColor: '#0F1626',
    borderWidth: 1,
    borderColor: '#1F2E4D',
    borderBottomLeftRadius: 4,
  },
  msgText: {
    fontSize: 13,
    lineHeight: 18,
  },
  textMine: {
    color: '#FFFFFF',
  },
  textPartner: {
    color: '#E2E8F0',
  },
  timeText: {
    fontSize: 9,
    color: '#64748B',
    marginTop: 3,
    marginHorizontal: 4,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#0B0F19',
    borderTopWidth: 1,
    borderTopColor: '#141E33',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#0F1626',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 12,
    borderWidth: 1,
    borderColor: '#1F2E4D',
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E11D48',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});
