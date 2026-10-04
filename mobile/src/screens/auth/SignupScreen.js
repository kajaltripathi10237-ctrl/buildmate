import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { COLORS, FONTS, SIZES } from '../../theme/theme';
import { User, Mail, Lock, Phone, Briefcase } from 'lucide-react-native';

const ROLES = [
  { id: 'CONTRACTOR', label: 'Contractor', icon: 'HardHat' },
  { id: 'WORKER', label: 'Worker', icon: 'User' },
  { id: 'VENDOR', label: 'Vendor/Company', icon: 'Store' },
];

export default function SignupScreen({ navigation }) {
  const { signup } = useAuth();
  const [role, setRole] = useState('WORKER');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleSignup = () => {
    if (!formData.name || !formData.email || !formData.password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    // In a real app, call API
    signup({ ...formData, role });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join the BuildMate ecosystem today</Text>

        <Text style={styles.label}>Select Your Role</Text>
        <View style={styles.roleContainer}>
          {ROLES.map((r) => (
            <TouchableOpacity
              key={r.id}
              style={[
                styles.roleCard,
                role === r.id && styles.roleCardActive,
              ]}
              onPress={() => setRole(r.id)}
            >
              <Text style={[
                styles.roleText,
                role === r.id && styles.roleTextActive
              ]}>{r.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.inputContainer}>
          <User size={20} color={COLORS.textLight} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={formData.name}
            onChangeText={(v) => setFormData({ ...formData, name: v })}
          />
        </View>

        <View style={styles.inputContainer}>
          <Mail size={20} color={COLORS.textLight} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(v) => setFormData({ ...formData, email: v })}
          />
        </View>

        <View style={styles.inputContainer}>
          <Phone size={20} color={COLORS.textLight} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            value={formData.phone}
            onChangeText={(v) => setFormData({ ...formData, phone: v })}
          />
        </View>

        <View style={styles.inputContainer}>
          <Lock size={20} color={COLORS.textLight} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={formData.password}
            onChangeText={(v) => setFormData({ ...formData, password: v })}
          />
        </View>

        <View style={styles.inputContainer}>
          <Lock size={20} color={COLORS.textLight} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry
            value={formData.confirmPassword}
            onChangeText={(v) => setFormData({ ...formData, confirmPassword: v })}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SIZES.padding,
    paddingTop: 60,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.primary,
  },
  subtitle: {
    ...FONTS.body1,
    color: COLORS.textLight,
    marginBottom: 30,
  },
  label: {
    ...FONTS.h4,
    marginBottom: 12,
    color: COLORS.primary,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  roleCard: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    marginHorizontal: 4,
    backgroundColor: COLORS.card,
  },
  roleCardActive: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.accent + '10',
  },
  roleText: {
    ...FONTS.body3,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  roleTextActive: {
    color: COLORS.accent,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    ...FONTS.body2,
    color: COLORS.text,
  },
  button: {
    backgroundColor: COLORS.accent,
    borderRadius: SIZES.radius,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: COLORS.white,
    ...FONTS.h4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
  footerText: {
    ...FONTS.body2,
    color: COLORS.textLight,
  },
  footerLink: {
    ...FONTS.body2,
    color: COLORS.accent,
    fontWeight: '700',
  },
});
