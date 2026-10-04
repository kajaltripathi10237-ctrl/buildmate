import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  BarChart3,
  Bell,
  BriefcaseBusiness,
  CalendarCheck2,
  CheckCircle2,
  ChevronRight,
  Home,
  MessageSquareText,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Star,
  UserRoundPlus,
  Users,
  Wallet,
} from 'lucide-react-native';
import { apiRequest, authApi, dashboardApi } from './src/api/client';

const palette = {
  primary: '#0B1F3A',
  secondary: '#0F5BA8',
  accent: '#F59E0B',
  success: '#10B981',
  danger: '#EF4444',
  info: '#38BDF8',
  ink: '#0F172A',
  text: '#1E293B',
  muted: '#64748B',
  border: '#E2E8F0',
  background: '#F4F7FB',
  white: '#FFFFFF',
  card: '#FFFFFF',
  shadow: '#0B1F3A20',
};

const ROLE_CONFIG = {
  ADMIN: { label: 'Admin', color: '#0F172A', accent: '#F59E0B', tagline: 'System oversight and platform health' },
  CONTRACTOR: { label: 'Contractor', color: '#0F5BA8', accent: '#22C55E', tagline: 'Project delivery and crew management' },
  WORKER: { label: 'Worker', color: '#14B8A6', accent: '#F97316', tagline: 'Jobs, attendance and payouts' },
  VENDOR: { label: 'Vendor', color: '#7C3AED', accent: '#0EA5E9', tagline: 'Materials, rentals and supply flow' },
};

const tabs = [
  { key: 'dashboard', label: 'Dashboard', icon: Home },
  { key: 'jobs', label: 'Jobs', icon: BriefcaseBusiness },
  { key: 'workers', label: 'Workers', icon: Users },
  { key: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
  { key: 'attendance', label: 'Attendance', icon: CalendarCheck2 },
  { key: 'payments', label: 'Payments', icon: Wallet },
  { key: 'feedback', label: 'Feedback', icon: MessageSquareText },
  { key: 'settings', label: 'Settings', icon: Settings },
];

const demoUsers = {
  admin: { name: 'Alicia Morgan', email: 'admin@buildmate.com', role: 'ADMIN' },
  contractor: { name: 'Daniel Reed', email: 'contractor@buildmate.com', role: 'CONTRACTOR' },
  worker: { name: 'Priya Nair', email: 'worker@buildmate.com', role: 'WORKER' },
  vendor: { name: 'UrbanBuild Supply', email: 'vendor@buildmate.com', role: 'VENDOR' },
};

const jobFeed = [
  { title: 'North Tower Concrete Works', location: 'Lagos', progress: '78%', budget: '$22,400', status: 'In Progress' },
  { title: 'Commercial HVAC Install', location: 'Abuja', progress: '46%', budget: '$18,750', status: 'Scheduled' },
  { title: 'Site Safety Inspection', location: 'Kano', progress: '92%', budget: '$7,200', status: 'Review' },
];

const workerDirectory = [
  { name: 'Isaac Mensah', role: 'Site Foreman', availability: 'Available', score: '4.9' },
  { name: 'Mina Bello', role: 'Mason', availability: 'Assigned', score: '4.8' },
  { name: 'Tariq Yusuf', role: 'Electrician', availability: 'Available', score: '4.7' },
  { name: 'Nia Parker', role: 'Project Planner', availability: 'Booked', score: '4.9' },
];

const marketplaceItems = [
  { title: 'Cement Mixer 500L', price: '$1,250', type: 'Rent/Lease', image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=900&q=80' },
  { title: 'Steel Rebar Bundle', price: '$860', type: 'Bulk Supply', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80' },
  { title: 'Scaffolding Set', price: '$2,400', type: 'Rental', image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80' },
];

const attendanceLog = [
  { day: 'Mon', checkIn: '07:30', checkOut: '17:10', status: 'Present' },
  { day: 'Tue', checkIn: '07:25', checkOut: '17:40', status: 'Present' },
  { day: 'Wed', checkIn: '07:45', checkOut: '16:55', status: 'Late' },
  { day: 'Thu', checkIn: '07:20', checkOut: '17:20', status: 'Present' },
];

const feedbackItems = [
  { title: 'On-site communication', summary: 'Faster updates improved delivery flow by 18%.', rating: '4.8/5' },
  { title: 'Vendor responsiveness', summary: 'Material delivery times improved after the new dispatch process.', rating: '4.9/5' },
  { title: 'Worker satisfaction', summary: 'Clearer shift and payout visibility boosted morale.', rating: '4.7/5' },
];

const statsByRole = {
  ADMIN: [
    { label: 'Active projects', value: '128' },
    { label: 'Workers online', value: '486' },
    { label: 'Payouts cleared', value: '$184k' },
    { label: 'Compliance', value: '97%' },
  ],
  CONTRACTOR: [
    { label: 'Open jobs', value: '12' },
    { label: 'Crew strength', value: '64' },
    { label: 'Spent this month', value: '$43k' },
    { label: 'Completion', value: '82%' },
  ],
  WORKER: [
    { label: 'Applications', value: '08' },
    { label: 'Accepted jobs', value: '05' },
    { label: 'Earnings', value: '$4.8k' },
    { label: 'Attendance', value: '96%' },
  ],
  VENDOR: [
    { label: 'Listings', value: '23' },
    { label: 'Orders pending', value: '09' },
    { label: 'Revenue', value: '$21.4k' },
    { label: 'Fulfillment', value: '94%' },
  ],
};

const roleActions = {
  ADMIN: [
    { title: 'User approvals', subtitle: 'Review role verification queue', icon: ShieldCheck },
    { title: 'System health', subtitle: 'Monitor services and uptime', icon: BarChart3 },
    { title: 'Compliance review', subtitle: 'Check outstanding audits', icon: CheckCircle2 },
  ],
  CONTRACTOR: [
    { title: 'Post job', subtitle: 'Create a new project request', icon: Plus },
    { title: 'Hire workers', subtitle: 'Shortlist and assign crew', icon: UserRoundPlus },
    { title: 'Track progress', subtitle: 'Monitor delivery milestones', icon: BriefcaseBusiness },
  ],
  WORKER: [
    { title: 'Apply to jobs', subtitle: 'Browse available work', icon: Search },
    { title: 'Attendance', subtitle: 'Record site check-in/out', icon: CalendarCheck2 },
    { title: 'Earnings', subtitle: 'Review payouts and invoices', icon: Wallet },
  ],
  VENDOR: [
    { title: 'List materials', subtitle: 'Publish stock for rent or sale', icon: ShoppingBag },
    { title: 'Orders', subtitle: 'Track buyer and contractor requests', icon: Bell },
    { title: 'Performance', subtitle: 'Review delivery and ratings', icon: Star },
  ],
};

const defaultDashboardData = {
  jobs: jobFeed,
  workers: workerDirectory,
  marketplace: marketplaceItems,
  attendance: attendanceLog,
  feedback: feedbackItems,
  analytics: { totalJobs: 24, totalWorkers: 186, totalPaymentVolume: 54800 },
};

const formatMoney = (value) => {
  const numericValue = Number(value || 0);
  if (!Number.isFinite(numericValue)) return '$0';
  return `$${numericValue.toLocaleString()}`;
};

const normalizeStatus = (value) => {
  const text = String(value || 'OPEN').replace(/_/g, ' ');
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

const normalizeJob = (job) => ({
  title: job.title || 'Untitled Job',
  location: job.location || 'Site location pending',
  progress: job.status === 'COMPLETED' ? '100%' : job.status === 'REVIEW' ? '92%' : job.status === 'DRAFT' ? '28%' : '68%',
  budget: formatMoney(job.budget || job.wage || 0),
  status: normalizeStatus(job.status || 'OPEN'),
});

const normalizeWorker = (worker) => ({
  name: worker.name || worker.user?.name || 'Worker',
  role: worker.trade || worker.role || 'Skilled worker',
  availability: worker.availability || (worker.isActive ? 'Available' : 'Busy'),
  score: worker.rating || '4.8',
});

const normalizeMarketplace = (item) => ({
  title: item.title || 'Marketplace item',
  price: formatMoney(item.price || 0),
  type: item.type || item.category || 'Marketplace',
  image: item.image || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80',
});

function SplashScreen({ onReady }) {
  return (
    <View style={styles.splashContainer}>
      <View style={styles.logoWrap}><Text style={styles.logoText}>BM</Text></View>
      <Text style={styles.brandTitle}>BuildMate</Text>
      <Text style={styles.brandSubtitle}>Build faster. Manage smarter.</Text>
      <TouchableOpacity style={styles.splashButton} onPress={onReady}><Text style={styles.splashButtonText}>Continue</Text></TouchableOpacity>
    </View>
  );
}

function ForgotPasswordScreen({ onBack, onSubmit }) {
  const [email, setEmail] = useState('');

  const handleReset = () => {
    if (!email) {
      Alert.alert('Need email', 'Please enter the account email to reset your password.');
      return;
    }

    Alert.alert('Reset link sent', `A password reset link was sent to ${email}.`);
    if (onSubmit) onSubmit();
    else onBack();
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.authContainer}>
      <ScrollView contentContainerStyle={styles.authScroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={onBack} style={styles.backLink}><Text style={styles.backText}>← Back to login</Text></TouchableOpacity>
        <Text style={styles.authBrand}>BuildMate</Text>
        <Text style={styles.authTitle}>Forgot password</Text>
        <Text style={styles.authSubtitle}>We will send a reset link to your email.</Text>
        <View style={styles.formCard}>
          <Text style={styles.inputLabel}>Email address</Text>
          <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" style={styles.input} placeholder="name@buildmate.com" />
          <TouchableOpacity style={styles.primaryButton} onPress={handleReset}><Text style={styles.primaryButtonText}>Send reset link</Text></TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function LoginScreen({ onLogin, onCreateAccount, onForgotPassword }) {
  const [email, setEmail] = useState('admin@buildmate.com');
  const [password, setPassword] = useState('Password123!');
  const [selectedRole, setSelectedRole] = useState('ADMIN');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const quickLogin = (role) => {
    const user = demoUsers[role.toLowerCase()];
    if (user) onLogin(user);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing credentials', 'Please enter both email and password.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await authApi.login({ email, password });
      onLogin(response.user);
    } catch (error) {
      Alert.alert('Login failed', error.message || 'Could not sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.authContainer}>
      <ScrollView contentContainerStyle={styles.authScroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.authBrand}>BuildMate</Text>
        <Text style={styles.authTitle}>Welcome back</Text>
        <Text style={styles.authSubtitle}>Choose a role and continue to your dashboard.</Text>

        <View style={styles.roleSelectionRow}>
          {Object.keys(ROLE_CONFIG).map((roleKey) => (
            <TouchableOpacity key={roleKey} onPress={() => setSelectedRole(roleKey)} style={[styles.roleChip, selectedRole === roleKey && styles.roleChipActive]}>
              <Text style={[styles.roleChipText, selectedRole === roleKey && styles.roleChipTextActive]}>{ROLE_CONFIG[roleKey].label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.formCard}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" style={styles.input} placeholder="you@buildmate.com" />
          <Text style={styles.inputLabel}>Password</Text>
          <TextInput value={password} onChangeText={setPassword} secureTextEntry style={styles.input} placeholder="••••••••" />
          <TouchableOpacity disabled={isSubmitting} style={styles.primaryButton} onPress={handleLogin}>
            <Text style={styles.primaryButtonText}>{isSubmitting ? 'Signing in...' : 'Sign in'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => onForgotPassword && onForgotPassword()}><Text style={styles.secondaryButtonText}>Forgot password?</Text></TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={onCreateAccount}><Text style={styles.secondaryButtonText}>Create account</Text></TouchableOpacity>
        </View>

        <View style={styles.demoCard}>
          <Text style={styles.demoTitle}>Quick access</Text>
          {Object.entries(demoUsers).map(([key, item]) => (
            <TouchableOpacity key={key} style={styles.demoRow} onPress={() => quickLogin(item.role)}>
              <View><Text style={styles.demoName}>{item.name}</Text><Text style={styles.demoMeta}>{ROLE_CONFIG[item.role].label}</Text></View>
              <ChevronRight size={18} color={palette.muted} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function SignupScreen({ onSignup, onBack }) {
  const [selectedRole, setSelectedRole] = useState('CONTRACTOR');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async () => {
    if (!form.name || !form.email || !form.password) {
      Alert.alert('Missing details', 'Please fill in all required fields.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      Alert.alert('Passwords do not match', 'Please confirm your password correctly.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await authApi.signup({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: selectedRole,
      });
      onSignup(response.user);
    } catch (error) {
      Alert.alert('Account creation failed', error.message || 'Could not create the account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.authContainer}>
      <ScrollView contentContainerStyle={styles.authScroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={onBack} style={styles.backLink}><Text style={styles.backText}>← Back to login</Text></TouchableOpacity>
        <Text style={styles.authBrand}>BuildMate</Text>
        <Text style={styles.authTitle}>Create your account</Text>
        <Text style={styles.authSubtitle}>Sign up as a contractor, worker, admin or vendor.</Text>

        <View style={styles.roleSelectionRow}>
          {Object.keys(ROLE_CONFIG).map((roleKey) => (
            <TouchableOpacity key={roleKey} onPress={() => setSelectedRole(roleKey)} style={[styles.roleChip, selectedRole === roleKey && styles.roleChipActive]}>
              <Text style={[styles.roleChipText, selectedRole === roleKey && styles.roleChipTextActive]}>{ROLE_CONFIG[roleKey].label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.formCard}>
          <TextInput style={styles.input} placeholder="Full name" value={form.name} onChangeText={(value) => setForm((current) => ({ ...current, name: value }))} />
          <TextInput style={styles.input} placeholder="Email address" autoCapitalize="none" keyboardType="email-address" value={form.email} onChangeText={(value) => setForm((current) => ({ ...current, email: value }))} />
          <TextInput style={styles.input} placeholder="Phone number" keyboardType="phone-pad" value={form.phone} onChangeText={(value) => setForm((current) => ({ ...current, phone: value }))} />
          <TextInput style={styles.input} placeholder="Password" secureTextEntry value={form.password} onChangeText={(value) => setForm((current) => ({ ...current, password: value }))} />
          <TextInput style={styles.input} placeholder="Confirm password" secureTextEntry value={form.confirmPassword} onChangeText={(value) => setForm((current) => ({ ...current, confirmPassword: value }))} />
          <TouchableOpacity disabled={isSubmitting} style={styles.primaryButton} onPress={handleCreate}>
            <Text style={styles.primaryButtonText}>{isSubmitting ? 'Creating account...' : 'Create account'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function AppShell({ user, onLogout, dashboardData = defaultDashboardData }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [featureView, setFeatureView] = useState('dashboard');
  const roleConfig = ROLE_CONFIG[user?.role] || ROLE_CONFIG.CONTRACTOR;

  const jobs = dashboardData.jobs?.length ? dashboardData.jobs : jobFeed;
  const workers = dashboardData.workers?.length ? dashboardData.workers : workerDirectory;
  const marketplace = dashboardData.marketplace?.length ? dashboardData.marketplace : marketplaceItems;
  const attendance = dashboardData.attendance?.length ? dashboardData.attendance : attendanceLog;
  const feedback = dashboardData.feedback?.length ? dashboardData.feedback : feedbackItems;

  const headerActions = useMemo(() => [{ label: 'Notifications', value: '14' }, { label: 'Alerts', value: '3' }], []);
  const moduleList = useMemo(() => ({
    ADMIN: [
      { key: 'otp', label: 'OTP Verification', icon: ShieldCheck },
      { key: 'analytics', label: 'Analytics', icon: BarChart3 },
      { key: 'roleManagement', label: 'Roles', icon: Users },
      { key: 'permissionsManagement', label: 'Permissions', icon: Settings },
      { key: 'systemConfiguration', label: 'System Config', icon: Settings },
      { key: 'jobListing', label: 'Job Listings', icon: BriefcaseBusiness },
      { key: 'reviewRating', label: 'Reviews', icon: Star },
    ],
    CONTRACTOR: [
      { key: 'postJob', label: 'Post Job', icon: Plus },
      { key: 'jobApplications', label: 'Applications', icon: BriefcaseBusiness },
      { key: 'jobAssignment', label: 'Assign Workers', icon: UserRoundPlus },
      { key: 'hireWorkers', label: 'Hire Form', icon: UserRoundPlus },
      { key: 'jobListing', label: 'Job Listings', icon: BriefcaseBusiness },
      { key: 'bidNow', label: 'Bid Management', icon: ShoppingBag },
      { key: 'marketplaceAddListing', label: 'Add Listing', icon: ShoppingBag },
      { key: 'feedbackForm', label: 'Feedback', icon: MessageSquareText },
      { key: 'reviewRating', label: 'Ratings', icon: Star },
      { key: 'profileManagement', label: 'Profile', icon: UserRoundPlus },
    ],
    WORKER: [
      { key: 'jobApplications', label: 'Jobs', icon: Search },
      { key: 'jobListing', label: 'Open Jobs', icon: BriefcaseBusiness },
      { key: 'attendanceReports', label: 'Attendance', icon: CalendarCheck2 },
      { key: 'performanceEvaluation', label: 'Performance', icon: Star },
      { key: 'workerPaymentSummary', label: 'Payments', icon: Wallet },
      { key: 'bidNow', label: 'Place Bid', icon: ShoppingBag },
      { key: 'feedbackForm', label: 'Feedback', icon: MessageSquareText },
      { key: 'reviewRating', label: 'Reviews', icon: Star },
      { key: 'profileManagement', label: 'Profile', icon: UserRoundPlus },
    ],
    VENDOR: [
      { key: 'marketplaceAddListing', label: 'Publish Listing', icon: ShoppingBag },
      { key: 'vendorProfile', label: 'Vendor Profile', icon: ShoppingBag },
      { key: 'transactionHistory', label: 'Orders', icon: Wallet },
      { key: 'analytics', label: 'Reports', icon: BarChart3 },
      { key: 'jobListing', label: 'Bidding Jobs', icon: BriefcaseBusiness },
      { key: 'bidNow', label: 'Create Bid', icon: ShoppingBag },
      { key: 'chat', label: 'Chat', icon: MessageSquareText },
      { key: 'reviewRating', label: 'Reviews', icon: Star },
      { key: 'profileManagement', label: 'Profile', icon: UserRoundPlus },
    ],
  }), [user?.role]);

  const renderFeatureScreen = () => {
    switch (featureView) {
      case 'otp':
        return <View style={styles.tabSection}><Text style={styles.sectionHeader}>OTP verification</Text><View style={styles.formCardSimple}><Text style={styles.inputLabel}>Enter 6-digit OTP</Text><TextInput style={styles.input} placeholder="123456" keyboardType="number-pad" /><TouchableOpacity style={styles.primaryButton} onPress={() => Alert.alert('Verified', 'OTP confirmed successfully.')}><Text style={styles.primaryButtonText}>Verify</Text></TouchableOpacity><TouchableOpacity style={styles.secondaryButtonInline} onPress={() => Alert.alert('OTP', 'New code sent.')}><Text style={styles.secondaryButtonText}>Resend OTP</Text></TouchableOpacity></View></View>;
      case 'jobListing':
        return <View style={styles.tabSection}><Text style={styles.sectionHeader}>Job listings</Text>{jobs.map((job) => <View key={`${job.title}-${job.location}`} style={styles.listCard}><View style={styles.listHeadlineRow}><Text style={styles.cardTitle}>{job.title}</Text><Text style={styles.statusPill}>{job.status}</Text></View><Text style={styles.metaText}>{job.location}</Text><Text style={styles.metaText}>Budget: {job.budget}</Text><Text style={styles.metaText}>Progress: {job.progress}</Text><View style={styles.buttonRow}><TouchableOpacity style={styles.primaryButtonSmall} onPress={() => Alert.alert('Job saved', 'The listing was saved to your shortlist.')}><Text style={styles.primaryButtonText}>Save</Text></TouchableOpacity><TouchableOpacity style={styles.secondaryButtonSmall} onPress={() => setFeatureView('bidNow')}><Text style={styles.secondaryButtonText}>Bid</Text></TouchableOpacity></View></View>)}</View>;
      case 'bidNow':
        return <View style={styles.tabSection}><Text style={styles.sectionHeader}>Bid / proposal</Text><View style={styles.formCardSimple}><TextInput style={styles.input} placeholder="Company / builder name" /><TextInput style={styles.input} placeholder="Project name" /><TextInput style={styles.input} placeholder="Bid amount" keyboardType="numeric" /><TextInput style={styles.input} placeholder="Delivery timeline" /><TextInput style={styles.input} placeholder="Notes / terms" multiline numberOfLines={5} /><TouchableOpacity style={styles.primaryButton} onPress={() => Alert.alert('Bid submitted', 'Your proposal was submitted successfully.')}><Text style={styles.primaryButtonText}>Submit bid</Text></TouchableOpacity></View></View>;
      case 'postJob':
        return <View style={styles.tabSection}><Text style={styles.sectionHeader}>Post a job</Text><View style={styles.formCardSimple}><TextInput style={styles.input} placeholder="Job title" /><TextInput style={styles.input} placeholder="Category" /><TextInput style={styles.input} placeholder="Description" multiline numberOfLines={4} /><TextInput style={styles.input} placeholder="Budget" keyboardType="numeric" /><TextInput style={styles.input} placeholder="Duration" /><TextInput style={styles.input} placeholder="Location" /><TextInput style={styles.input} placeholder="Required skills" /><TouchableOpacity style={styles.primaryButton} onPress={() => Alert.alert('Job posted', 'Your job is now live.')}><Text style={styles.primaryButtonText}>Submit job</Text></TouchableOpacity></View></View>;
      case 'hireWorkers':
        return <View style={styles.tabSection}><Text style={styles.sectionHeader}>Hire worker</Text><View style={styles.formCardSimple}><TextInput style={styles.input} placeholder="Worker name" /><TextInput style={styles.input} placeholder="Trade / role" /><TextInput style={styles.input} placeholder="Daily rate" keyboardType="numeric" /><TextInput style={styles.input} placeholder="Project assignment" /><TextInput style={styles.input} placeholder="Hire notes" multiline numberOfLines={4} /><TouchableOpacity style={styles.primaryButton} onPress={() => Alert.alert('Hire request sent', 'The worker hiring request has been sent.')}><Text style={styles.primaryButtonText}>Send hire request</Text></TouchableOpacity></View></View>;
      case 'jobApplications':
        return <View style={styles.tabSection}><Text style={styles.sectionHeader}>Job applications</Text>{[{ name: 'Musa Adebayo', skills: 'Concrete, formwork', experience: '7 yrs', status: 'Shortlisted' }, { name: 'Amina Bello', skills: 'Finishing, safety', experience: '4 yrs', status: 'New' }].map((app) => <View key={app.name} style={styles.listCard}><View style={styles.listHeadlineRow}><Text style={styles.cardTitle}>{app.name}</Text><Text style={styles.statusPill}>{app.status}</Text></View><Text style={styles.metaText}>Skills: {app.skills}</Text><Text style={styles.metaText}>Experience: {app.experience}</Text><View style={styles.buttonRow}><TouchableOpacity style={styles.primaryButtonSmall}><Text style={styles.primaryButtonText}>Hire</Text></TouchableOpacity><TouchableOpacity style={styles.secondaryButtonSmall}><Text style={styles.secondaryButtonText}>Reject</Text></TouchableOpacity></View></View> )}</View>;
      case 'jobAssignment':
        return <View style={styles.tabSection}><Text style={styles.sectionHeader}>Worker assignment</Text><View style={styles.formCardSimple}><TextInput style={styles.input} placeholder="Search worker" />{workerDirectory.slice(0, 3).map((worker) => <TouchableOpacity key={worker.name} style={styles.settingsRow}><Text style={styles.cardTitle}>{worker.name}</Text><Text style={styles.metaText}>{worker.role}</Text></TouchableOpacity>)}<TouchableOpacity style={styles.primaryButton} onPress={() => Alert.alert('Assigned', 'Worker has been assigned to job.')}><Text style={styles.primaryButtonText}>Assign worker</Text></TouchableOpacity></View></View>;
      case 'jobDetails':
        return <View style={styles.tabSection}><Text style={styles.sectionHeader}>Job details</Text><View style={styles.listCard}><Text style={styles.cardTitle}>North Tower Concrete Works</Text><Text style={styles.metaText}>Abuja • Budget: $22,400 • Duration: 12 weeks</Text><Text style={styles.metaText}>Requirements: concrete finishing, site supervision, coordination, safety compliance.</Text><View style={styles.metricRow}><Text style={styles.metaText}>Assigned workers</Text><Text style={styles.metricValue}>12</Text></View><View style={styles.metricRow}><Text style={styles.metaText}>Status</Text><Text style={styles.metricValue}>In progress</Text></View><View style={styles.buttonRow}><TouchableOpacity style={styles.primaryButtonSmall}><Text style={styles.primaryButtonText}>Edit job</Text></TouchableOpacity><TouchableOpacity style={styles.secondaryButtonSmall}><Text style={styles.secondaryButtonText}>Close job</Text></TouchableOpacity></View></View></View>;
      case 'attendanceReports':
        return <View style={styles.tabSection}><Text style={styles.sectionHeader}>Attendance reports</Text>{attendanceLog.map((entry) => <View key={entry.day} style={styles.listCard}><View style={styles.metricRow}><Text style={styles.cardTitle}>{entry.day}</Text><Text style={[styles.statusPill, entry.status === 'Late' && styles.latePill]}>{entry.status}</Text></View><View style={styles.metricRow}><Text style={styles.metaText}>Check-in</Text><Text style={styles.metricValue}>{entry.checkIn}</Text></View><View style={styles.metricRow}><Text style={styles.metaText}>Check-out</Text><Text style={styles.metricValue}>{entry.checkOut}</Text></View></View>)}<TouchableOpacity style={styles.primaryButton} onPress={() => Alert.alert('Exported', 'Attendance report exported.')}><Text style={styles.primaryButtonText}>Download report</Text></TouchableOpacity></View>;
      case 'performanceEvaluation':
        return <View style={styles.tabSection}><Text style={styles.sectionHeader}>Performance evaluation</Text><View style={styles.formCardSimple}><TextInput style={styles.input} placeholder="Rating (1-5)" keyboardType="numeric" /><TextInput style={styles.input} placeholder="Comments" multiline numberOfLines={5} /><TouchableOpacity style={styles.primaryButton}><Text style={styles.primaryButtonText}>Save evaluation</Text></TouchableOpacity></View></View>;
      case 'workerPaymentSummary':
        return <View style={styles.tabSection}><Text style={styles.sectionHeader}>Worker payment summary</Text><View style={styles.balanceBox}><Text style={styles.balanceLabel}>Total earnings</Text><Text style={styles.balanceValue}>$4,800</Text></View><View style={styles.listCard}><View style={styles.metricRow}><Text style={styles.metaText}>Pending payments</Text><Text style={styles.metricValue}>$1,350</Text></View><View style={styles.metricRow}><Text style={styles.metaText}>This month</Text><Text style={styles.metricValue}>$2,260</Text></View></View></View>;
      case 'marketplaceAddListing':
        return <View style={styles.tabSection}><Text style={styles.sectionHeader}>Add listing</Text><View style={styles.formCardSimple}><TextInput style={styles.input} placeholder="Title" /><TextInput style={styles.input} placeholder="Category" /><TextInput style={styles.input} placeholder="Price" keyboardType="numeric" /><TextInput style={styles.input} placeholder="Availability" /><TextInput style={styles.input} placeholder="Description" multiline numberOfLines={4} /><TouchableOpacity style={styles.primaryButton} onPress={() => Alert.alert('Listing published', 'Marketplace listing is now active.')}><Text style={styles.primaryButtonText}>Publish listing</Text></TouchableOpacity></View></View>;
      case 'listingDetails':
        return <View style={styles.tabSection}><Text style={styles.sectionHeader}>Listing details</Text><View style={styles.marketCard}><Image source={{ uri: marketplaceItems[0].image }} style={styles.marketImage} resizeMode="cover" /><View style={styles.marketBody}><Text style={styles.cardTitle}>{marketplaceItems[0].title}</Text><Text style={styles.metaText}>{marketplaceItems[0].type}</Text><Text style={styles.metricValue}>{marketplaceItems[0].price}</Text><View style={styles.buttonRow}><TouchableOpacity style={styles.primaryButtonSmall}><Text style={styles.primaryButtonText}>Buy</Text></TouchableOpacity><TouchableOpacity style={styles.secondaryButtonSmall}><Text style={styles.secondaryButtonText}>Rent</Text></TouchableOpacity></View></View></View></View>;
      case 'purchaseFlow':
        return <View style={styles.tabSection}><Text style={styles.sectionHeader}>Purchase / rent flow</Text><View style={styles.listCard}><Text style={styles.cardTitle}>Confirm order</Text><Text style={styles.metaText}>Item: Cement Mixer 500L</Text><Text style={styles.metaText}>Payment method: Wallet / Card / Escrow</Text><TouchableOpacity style={styles.primaryButton} onPress={() => Alert.alert('Order placed', 'Your purchase has been confirmed.')}><Text style={styles.primaryButtonText}>Confirm order</Text></TouchableOpacity></View></View>;
      case 'transactionHistory':
        return <View style={styles.tabSection}><Text style={styles.sectionHeader}>Transaction history</Text>{[{ date: '04 Oct 2026', amount: '$1,250', status: 'Paid' }, { date: '02 Oct 2026', amount: '$580', status: 'Pending' }].map((item) => <View key={item.date} style={styles.listCard}><View style={styles.metricRow}><Text style={styles.metaText}>{item.date}</Text><Text style={styles.metricValue}>{item.amount}</Text></View><Text style={styles.metaText}>{item.status}</Text></View> )}</View>;
      case 'vendorProfile':
        return <View style={styles.tabSection}><Text style={styles.sectionHeader}>Vendor profile</Text><View style={styles.listCard}><Text style={styles.cardTitle}>UrbanBuild Supply</Text><Text style={styles.metaText}>Materials • equipment • rental support</Text><Text style={styles.metaText}>Rating: 4.9 • 1,240 orders completed</Text><TouchableOpacity style={styles.primaryButton}><Text style={styles.primaryButtonText}>Contact vendor</Text></TouchableOpacity></View></View>;
      case 'analytics':
        return <View style={styles.tabSection}><Text style={styles.sectionHeader}>Analytics & reports</Text><View style={styles.statsGrid}><View style={styles.statCard}><Text style={styles.statValue}>98%</Text><Text style={styles.statLabel}>Efficiency</Text></View><View style={styles.statCard}><Text style={styles.statValue}>184k</Text><Text style={styles.statLabel}>Revenue</Text></View><View style={styles.statCard}><Text style={styles.statValue}>24</Text><Text style={styles.statLabel}>Projects</Text></View><View style={styles.statCard}><Text style={styles.statValue}>12%</Text><Text style={styles.statLabel}>Growth</Text></View></View><TouchableOpacity style={styles.primaryButton}><Text style={styles.primaryButtonText}>Export PDF</Text></TouchableOpacity></View>;
      case 'chat':
        return <View style={styles.tabSection}><Text style={styles.sectionHeader}>Chat</Text><View style={styles.listCard}><Text style={styles.metaText}>Contractor</Text><Text style={styles.cardTitle}>Can you confirm the delivery time for the rebar batch?</Text></View><View style={styles.formCardSimple}><TextInput style={styles.input} placeholder="Type your message" /><TouchableOpacity style={styles.primaryButton}><Text style={styles.primaryButtonText}>Send</Text></TouchableOpacity></View></View>;
      case 'feedbackForm':
        return <View style={styles.tabSection}><Text style={styles.sectionHeader}>Feedback form</Text><View style={styles.formCardSimple}><TextInput style={styles.input} placeholder="Feedback type" /><TextInput style={styles.input} placeholder="Comments" multiline numberOfLines={6} /><TouchableOpacity style={styles.primaryButton} onPress={() => Alert.alert('Feedback sent', 'Thank you for your feedback.')}><Text style={styles.primaryButtonText}>Submit</Text></TouchableOpacity></View></View>;
      case 'reviewRating':
        return <View style={styles.tabSection}><Text style={styles.sectionHeader}>Review & rating</Text><View style={styles.formCardSimple}><Text style={styles.inputLabel}>Rating</Text><Text style={styles.scorePill}>⭐ 4.9/5</Text><TextInput style={styles.input} placeholder="Review title" /><TextInput style={styles.input} placeholder="Your review" multiline numberOfLines={5} /><TouchableOpacity style={styles.primaryButton} onPress={() => Alert.alert('Review submitted', 'Thanks for the feedback.')}><Text style={styles.primaryButtonText}>Submit review</Text></TouchableOpacity></View></View>;
      case 'profileManagement':
        return <View style={styles.tabSection}><Text style={styles.sectionHeader}>Profile management</Text><View style={styles.listCard}><Text style={styles.metaText}>Name: {user?.name || 'BuildMate user'}</Text><Text style={styles.metaText}>Email: {user?.email || 'user@buildmate.com'}</Text><Text style={styles.metaText}>Phone: +234 800 000 0000</Text><TouchableOpacity style={styles.primaryButton}><Text style={styles.primaryButtonText}>Update profile</Text></TouchableOpacity></View></View>;
      case 'permissionsManagement':
        return <View style={styles.tabSection}><Text style={styles.sectionHeader}>Permissions management</Text>{['Create jobs', 'Assign workers', 'Manage payouts', 'Approve vendors'].map((item) => <View key={item} style={styles.settingsRow}><Text style={styles.cardTitle}>{item}</Text><Text style={styles.metaText}>Allowed</Text></View>)}</View>;
      case 'systemConfiguration':
        return <View style={styles.tabSection}><Text style={styles.sectionHeader}>System configuration</Text><View style={styles.formCardSimple}><TextInput style={styles.input} placeholder="App settings" defaultValue="Production" /><TextInput style={styles.input} placeholder="Security settings" defaultValue="Enabled" /><TouchableOpacity style={styles.primaryButton}><Text style={styles.primaryButtonText}>Save configuration</Text></TouchableOpacity></View></View>;
      case 'roleManagement':
        return <View style={styles.tabSection}><Text style={styles.sectionHeader}>Role management</Text>{['Contractor', 'Worker', 'Vendor', 'Admin'].map((role) => <View key={role} style={styles.settingsRow}><Text style={styles.cardTitle}>{role}</Text><Text style={styles.metaText}>Active</Text></View>)}</View>;
      case 'notificationsCenter':
        return <View style={styles.tabSection}><Text style={styles.sectionHeader}>Notifications center</Text>{['New worker application received', 'Payment approved', 'Site inspection scheduled'].map((n) => <View key={n} style={styles.listCard}><Text style={styles.cardTitle}>{n}</Text><Text style={styles.metaText}>Just now</Text></View>)}</View>;
      case 'helpSupport':
        return <View style={styles.tabSection}><Text style={styles.sectionHeader}>Help & support</Text>{['Knowledge base', 'Live support', 'Issue tracker'].map((item) => <TouchableOpacity key={item} style={styles.settingsRow}><Text style={styles.cardTitle}>{item}</Text><ChevronRight size={18} color={palette.muted} /></TouchableOpacity>)}</View>;
      case 'faq':
        return <View style={styles.tabSection}><Text style={styles.sectionHeader}>FAQs</Text>{['How do I post a job?', 'How long does verification take?', 'How are payouts released?'].map((q) => <View key={q} style={styles.listCard}><Text style={styles.cardTitle}>{q}</Text><Text style={styles.metaText}>Answer: This is available in onboarding flow and support documentation.</Text></View>)}</View>;
      case 'contactForm':
        return <View style={styles.tabSection}><Text style={styles.sectionHeader}>Contact form</Text><View style={styles.formCardSimple}><TextInput style={styles.input} placeholder="Name" /><TextInput style={styles.input} placeholder="Email" keyboardType="email-address" /><TextInput style={styles.input} placeholder="Message" multiline numberOfLines={6} /><TouchableOpacity style={styles.primaryButton}><Text style={styles.primaryButtonText}>Send message</Text></TouchableOpacity></View></View>;
      case 'changePassword':
        return <View style={styles.tabSection}><Text style={styles.sectionHeader}>Change password</Text><View style={styles.formCardSimple}><TextInput style={styles.input} placeholder="Current password" secureTextEntry /><TextInput style={styles.input} placeholder="New password" secureTextEntry /><TextInput style={styles.input} placeholder="Confirm password" secureTextEntry /><TouchableOpacity style={styles.primaryButton}><Text style={styles.primaryButtonText}>Update password</Text></TouchableOpacity></View></View>;
      case 'preferences':
        return <View style={styles.tabSection}><Text style={styles.sectionHeader}>Preferences</Text>{['Language', 'Theme', 'Notifications', 'Push alerts'].map((p) => <View key={p} style={styles.settingsRow}><Text style={styles.cardTitle}>{p}</Text><Text style={styles.metaText}>Enabled</Text></View>)}</View>;
      case 'logoutConfirm':
        return <View style={styles.tabSection}><Text style={styles.sectionHeader}>Logout confirmation</Text><View style={styles.listCard}><Text style={styles.cardTitle}>Are you sure you want to logout?</Text><View style={styles.buttonRow}><TouchableOpacity style={styles.primaryButtonSmall} onPress={() => { Alert.alert('Logged out'); onLogout(); }}><Text style={styles.primaryButtonText}>Yes</Text></TouchableOpacity><TouchableOpacity style={styles.secondaryButtonSmall} onPress={() => setFeatureView('dashboard')}><Text style={styles.secondaryButtonText}>Cancel</Text></TouchableOpacity></View></View></View>;
      default:
        return <View style={styles.tabSection}><Text style={styles.sectionHeader}>Overview</Text><View style={styles.statsGrid}>{statsByRole[user?.role || 'CONTRACTOR'].map((stat) => <View key={stat.label} style={styles.statCard}><Text style={styles.statValue}>{stat.value}</Text><Text style={styles.statLabel}>{stat.label}</Text></View>)}</View><View style={styles.heroCard}><Text style={styles.cardTitle}>Priority actions</Text>{roleActions[user?.role || 'CONTRACTOR'].map((action) => { const Icon = action.icon; return <TouchableOpacity key={action.title} style={styles.actionRow} onPress={() => {
              if (action.title === 'Post job') setFeatureView('postJob');
          else if (action.title === 'Hire workers') setFeatureView('hireWorkers');
          else if (action.title === 'Apply to jobs') setFeatureView('jobApplications');
          else if (action.title === 'List materials') setFeatureView('marketplaceAddListing');
          else if (action.title === 'Attendance') setFeatureView('attendanceReports');
          else if (action.title === 'Earnings') setFeatureView('workerPaymentSummary');
          else setFeatureView('dashboard');
        }}><View style={styles.actionIconWrap}><Icon size={16} color={roleConfig.color} /></View><View style={styles.actionTextWrap}><Text style={styles.actionTitle}>{action.title}</Text><Text style={styles.metaText}>{action.subtitle}</Text></View></TouchableOpacity>; })}</View><View style={styles.heroCard}><Text style={styles.cardTitle}>All BuildMate screens</Text><View style={styles.statsGrid}>{(moduleList[user?.role || 'CONTRACTOR'] || []).map((item) => { const Icon = item.icon; return <TouchableOpacity key={item.key} style={styles.moduleTile} onPress={() => setFeatureView(item.key)}><Icon size={18} color={roleConfig.color} /><Text style={styles.moduleTileText}>{item.label}</Text></TouchableOpacity>; })}</View></View></View>;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'jobs':
        return <View style={styles.tabSection}><Text style={styles.sectionHeader}>Job management</Text>{jobs.map((job) => <View key={job.title} style={styles.listCard}><View style={styles.listHeadlineRow}><Text style={styles.cardTitle}>{job.title}</Text><Text style={styles.statusPill}>{job.status}</Text></View><Text style={styles.metaText}>{job.location}</Text><View style={styles.progressRow}><View style={styles.progressBarTrack}><View style={[styles.progressBarFill,{width:job.progress}]} /></View><Text style={styles.progressValue}>{job.progress}</Text></View><View style={styles.metricRow}><Text style={styles.metaText}>Budget</Text><Text style={styles.metricValue}>{job.budget}</Text></View><View style={styles.buttonRow}><TouchableOpacity style={styles.primaryButtonSmall} onPress={() => setFeatureView('jobDetails')}><Text style={styles.primaryButtonText}>View</Text></TouchableOpacity><TouchableOpacity style={styles.secondaryButtonSmall} onPress={() => setFeatureView('jobApplications')}><Text style={styles.secondaryButtonText}>Applicants</Text></TouchableOpacity></View></View> )}</View>;
      case 'workers':
        return <View style={styles.tabSection}><Text style={styles.sectionHeader}>Worker directory</Text>{workers.map((worker) => <TouchableOpacity key={worker.name} style={styles.listCard} onPress={() => setFeatureView('jobAssignment')}><View style={styles.avatarBadge}><Text style={styles.avatarText}>{worker.name.charAt(0)}</Text></View><View style={styles.workerInfo}><Text style={styles.cardTitle}>{worker.name}</Text><Text style={styles.metaText}>{worker.role}</Text></View><View style={styles.workerMetaRight}><Text style={styles.scorePill}>⭐ {worker.score}</Text><Text style={styles.metaText}>{worker.availability}</Text></View></TouchableOpacity>)}</View>;
      case 'marketplace':
        return <View style={styles.tabSection}><Text style={styles.sectionHeader}>Marketplace listings</Text>{marketplace.map((item) => <TouchableOpacity key={item.title} style={styles.marketCard} onPress={() => setFeatureView('listingDetails')}><Image source={{ uri: item.image }} style={styles.marketImage} resizeMode="cover" /><View style={styles.marketBody}><View style={styles.listHeadlineRow}><Text style={styles.cardTitle}>{item.title}</Text><Text style={styles.pricePill}>{item.price}</Text></View><Text style={styles.metaText}>{item.type}</Text><TouchableOpacity style={styles.inlineAction} onPress={() => setFeatureView('purchaseFlow')}><Text style={styles.inlineActionText}>Buy / rent</Text></TouchableOpacity></View></TouchableOpacity>)}</View>;
      case 'attendance':
        return <View style={styles.tabSection}><Text style={styles.sectionHeader}>Attendance tracker</Text>{attendance.map((entry) => <View key={entry.day} style={styles.listCard}><Text style={styles.cardTitle}>{entry.day}</Text><View style={styles.metricRow}><Text style={styles.metaText}>In</Text><Text style={styles.metricValue}>{entry.checkIn}</Text></View><View style={styles.metricRow}><Text style={styles.metaText}>Out</Text><Text style={styles.metricValue}>{entry.checkOut}</Text></View><Text style={[styles.statusPill, entry.status === 'Late' && styles.latePill]}>{entry.status}</Text></View>)}</View>;
      case 'payments':
        return <View style={styles.tabSection}><Text style={styles.sectionHeader}>Finance overview</Text><View style={styles.balanceBox}><Text style={styles.balanceLabel}>Available balance</Text><Text style={styles.balanceValue}>{user?.role === 'WORKER' ? '$4,800' : '$24,500'}</Text></View><View style={styles.listCard}><Text style={styles.cardTitle}>Recent payouts</Text><Text style={styles.metaText}>Payment release approved for the latest completed site run.</Text><View style={styles.metricRow}><Text style={styles.metaText}>Escrow</Text><Text style={styles.metricValue}>$12,200</Text></View><View style={styles.metricRow}><Text style={styles.metaText}>Invoices</Text><Text style={styles.metricValue}>12 pending</Text></View></View></View>;
      case 'feedback':
        return <View style={styles.tabSection}><Text style={styles.sectionHeader}>Feedback & support</Text>{feedback.map((item) => <View key={item.title} style={styles.listCard}><Text style={styles.cardTitle}>{item.title}</Text><Text style={styles.metaText}>{item.summary}</Text><Text style={styles.scorePill}>{item.rating}</Text></View>)}</View>;
      case 'settings':
        return <View style={styles.tabSection}><Text style={styles.sectionHeader}>Profile & settings</Text>{['Profile', 'Notifications', 'Security', 'Permissions', 'Help center', 'Logout'].map((item) => <TouchableOpacity key={item} style={styles.settingsRow} onPress={() => item === 'Logout' ? setFeatureView('logoutConfirm') : item === 'Notifications' ? setFeatureView('notificationsCenter') : item === 'Permissions' ? setFeatureView('permissionsManagement') : setFeatureView('profileManagement')}><Text style={styles.cardTitle}>{item}</Text><ChevronRight size={18} color={palette.muted} /></TouchableOpacity>)}</View>;
      case 'dashboard':
      default:
        return renderFeatureScreen();
    }
  };

  return (
    <SafeAreaView style={styles.appContainer}>
      <View style={styles.topBar}><View><Text style={styles.brandMini}>BuildMate</Text><Text style={styles.userName}>{user?.name || 'Builder'}</Text></View><View style={styles.headerBadgeWrap}><Text style={styles.headerBadge}>{roleConfig.label}</Text></View></View>
      <ScrollView style={styles.appBody} showsVerticalScrollIndicator={false}>
        <View style={[styles.welcomeCard, { borderColor: roleConfig.color + '30', backgroundColor: roleConfig.color + '12' }]}>
          <View style={styles.welcomeContent}><Text style={styles.welcomeTitle}>Welcome back</Text><Text style={styles.welcomeName}>{user?.name || 'Builder'}</Text><Text style={styles.welcomeMeta}>{roleConfig.tagline}</Text></View>
          <View style={styles.iconBubble}><ShieldCheck size={22} color={roleConfig.color} /></View>
        </View>
        <View style={styles.quickStatRow}>{headerActions.map((item) => <View key={item.label} style={styles.topMetaBox}><Text style={styles.metaValue}>{item.value}</Text><Text style={styles.metaText}>{item.label}</Text></View>)}</View>
        {renderTabContent()}
      </ScrollView>
      <View style={styles.tabBar}>{tabs.map((tab) => { const Icon = tab.icon; const isActive = activeTab === tab.key; return <TouchableOpacity key={tab.key} style={[styles.tabButton, isActive && styles.tabButtonActive]} onPress={() => { setActiveTab(tab.key); if (tab.key === 'dashboard') setFeatureView('dashboard'); }}><Icon size={18} color={isActive ? palette.secondary : palette.muted} /><Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{tab.label}</Text></TouchableOpacity>; })}</View>
    </SafeAreaView>
  );
}

export default function App() {
  const [screen, setScreen] = useState('splash');
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(defaultDashboardData);

  const loadDashboardData = async () => {
    try {
      const [analytics, jobs, workers, marketplace, tickets] = await Promise.all([
        dashboardApi.analytics().catch(() => defaultDashboardData.analytics),
        dashboardApi.jobs().catch(() => defaultDashboardData.jobs),
        dashboardApi.workers().catch(() => defaultDashboardData.workers),
        dashboardApi.marketplace().catch(() => defaultDashboardData.marketplace),
        dashboardApi.tickets().catch(() => []),
      ]);

      setDashboardData({
        analytics,
        jobs: Array.isArray(jobs) ? jobs.map(normalizeJob) : defaultDashboardData.jobs,
        workers: Array.isArray(workers) ? workers.map(normalizeWorker) : defaultDashboardData.workers,
        marketplace: Array.isArray(marketplace) ? marketplace.map(normalizeMarketplace) : defaultDashboardData.marketplace,
        attendance: defaultDashboardData.attendance,
        feedback: tickets?.length ? tickets.map((ticket) => ({
          title: ticket.subject || 'Support ticket',
          summary: ticket.description || 'Ticket created successfully.',
          rating: '4.8/5',
        })) : defaultDashboardData.feedback,
      });
    } catch (error) {
      console.warn('Dashboard load failed', error);
      setDashboardData(defaultDashboardData);
    }
  };

  useEffect(() => {
    if (screen === 'app' && user) {
      loadDashboardData();
    }
  }, [screen, user?.id, user?.role]);

  const handleLogin = (sessionUser) => {
    setUser(sessionUser);
    setScreen('app');
  };

  const handleSignup = (sessionUser) => {
    setUser({ ...sessionUser, role: sessionUser.role || 'CONTRACTOR' });
    setScreen('app');
  };

  const handleLogout = () => {
    setUser(null);
    setScreen('login');
  };

  if (screen === 'splash') return <SplashScreen onReady={() => setScreen('login')} />;
  if (screen === 'login') return <LoginScreen onLogin={handleLogin} onCreateAccount={() => setScreen('signup')} onForgotPassword={() => setScreen('forgotPassword')} />;
  if (screen === 'signup') return <SignupScreen onSignup={handleSignup} onBack={() => setScreen('login')} />;
  if (screen === 'forgotPassword') return <ForgotPasswordScreen onBack={() => setScreen('login')} />;

  return <AppShell user={user} onLogout={handleLogout} dashboardData={dashboardData} />;
}

const styles = StyleSheet.create({
  appContainer: { flex: 1, backgroundColor: palette.background },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: palette.primary, paddingHorizontal: 18, paddingTop: 18, paddingBottom: 16 },
  brandMini: { color: palette.white, fontSize: 22, fontWeight: '800' },
  userName: { color: '#DDEAFE', marginTop: 4, fontSize: 12 },
  headerBadgeWrap: { backgroundColor: '#102D5C', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  headerBadge: { color: palette.white, fontWeight: '700', fontSize: 11 },
  appBody: { flex: 1, paddingHorizontal: 18, paddingTop: 18 },
  welcomeCard: { borderWidth: 1, borderRadius: 20, padding: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  welcomeContent: { flex: 1 },
  welcomeTitle: { color: palette.muted, fontSize: 13, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  welcomeName: { fontSize: 26, fontWeight: '800', color: palette.ink, marginTop: 6 },
  welcomeMeta: { color: palette.text, marginTop: 4, fontSize: 14 },
  iconBubble: { width: 52, height: 52, borderRadius: 16, backgroundColor: palette.white, alignItems: 'center', justifyContent: 'center' },
  quickStatRow: { flexDirection: 'row', marginTop: 18, gap: 12 },
  topMetaBox: { flex: 1, backgroundColor: palette.white, borderRadius: 16, padding: 12, shadowColor: palette.shadow, shadowOpacity: 0.08, shadowOffset: { width: 0, height: 4 }, shadowRadius: 10, elevation: 2 },
  metaValue: { fontSize: 20, fontWeight: '800', color: palette.primary },
  metaText: { fontSize: 12, color: palette.muted, marginTop: 6 },
  tabSection: { paddingTop: 18, paddingBottom: 24 },
  sectionHeader: { fontSize: 22, fontWeight: '800', color: palette.ink, marginBottom: 14 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
  statCard: { width: '48%', backgroundColor: palette.white, borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: palette.shadow, shadowOpacity: 0.08, shadowOffset: { width: 0, height: 4 }, shadowRadius: 10, elevation: 2 },
  statValue: { fontSize: 24, fontWeight: '800', color: palette.secondary },
  statLabel: { color: palette.muted, marginTop: 6, fontSize: 12 },
  heroCard: { backgroundColor: palette.white, borderRadius: 18, padding: 18, marginTop: 16, shadowColor: palette.shadow, shadowOpacity: 0.08, shadowOffset: { width: 0, height: 4 }, shadowRadius: 10, elevation: 2 },
  actionRow: { flexDirection: 'row', alignItems: 'center', marginTop: 14 },
  actionIconWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#EAF2FF', alignItems: 'center', justifyContent: 'center' },
  actionTextWrap: { marginLeft: 12, flex: 1 },
  actionTitle: { fontSize: 15, color: palette.ink, fontWeight: '700' },
  listCard: { backgroundColor: palette.white, borderRadius: 18, padding: 16, marginBottom: 12, shadowColor: palette.shadow, shadowOpacity: 0.06, shadowOffset: { width: 0, height: 3 }, shadowRadius: 8, elevation: 2 },
  listHeadlineRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 16, color: palette.ink, fontWeight: '700', flexShrink: 1 },
  statusPill: { backgroundColor: '#DCFCE7', color: '#166534', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, fontSize: 11, fontWeight: '700' },
  pricePill: { backgroundColor: '#E0F2FE', color: '#075985', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, fontSize: 11, fontWeight: '700' },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 },
  progressBarTrack: { flex: 1, height: 8, borderRadius: 999, backgroundColor: '#E2E8F0', overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: palette.secondary, borderRadius: 999 },
  progressValue: { fontSize: 12, color: palette.ink, fontWeight: '700' },
  metricRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  metricValue: { fontSize: 14, color: palette.ink, fontWeight: '700' },
  avatarBadge: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#DBEAFE', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { color: palette.primary, fontWeight: '800' },
  workerInfo: { flex: 1 },
  workerMetaRight: { alignItems: 'flex-end' },
  scorePill: { backgroundColor: '#FEF3C7', color: '#B45309', borderRadius: 999, fontSize: 11, fontWeight: '700', paddingHorizontal: 8, paddingVertical: 4 },
  marketCard: { backgroundColor: palette.white, borderRadius: 18, overflow: 'hidden', marginBottom: 12, shadowColor: palette.shadow, shadowOpacity: 0.06, shadowOffset: { width: 0, height: 3 }, shadowRadius: 8, elevation: 2 },
  marketImage: { width: '100%', height: 180 },
  marketBody: { padding: 16 },
  inlineAction: { marginTop: 12, width: 120, alignItems: 'center', paddingVertical: 10, borderRadius: 12, backgroundColor: palette.primary },
  inlineActionText: { color: palette.white, fontWeight: '700' },
  balanceBox: { backgroundColor: '#DCFCE7', borderRadius: 18, padding: 18, marginBottom: 14 },
  balanceLabel: { color: '#166534', fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  balanceValue: { marginTop: 6, color: '#14532D', fontSize: 28, fontWeight: '800' },
  latePill: { backgroundColor: '#FEE2E2', color: '#B91C1C' },
  settingsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: palette.white, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 10 },
  splashContainer: { flex: 1, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', padding: 28 },
  logoWrap: { width: 110, height: 110, borderRadius: 28, backgroundColor: palette.primary, alignItems: 'center', justifyContent: 'center', shadowColor: palette.shadow, shadowOpacity: 0.15, shadowOffset: { width: 0, height: 10 }, shadowRadius: 18, elevation: 4 },
  logoText: { color: '#FFFFFF', fontSize: 32, fontWeight: '900' },
  brandTitle: { marginTop: 24, fontSize: 34, fontWeight: '800', color: palette.primary },
  brandSubtitle: { marginTop: 10, fontSize: 15, color: palette.muted },
  splashButton: { marginTop: 34, width: '100%', backgroundColor: palette.secondary, borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  splashButtonText: { color: palette.white, fontWeight: '800', fontSize: 15 },
  authContainer: { flex: 1, backgroundColor: palette.background },
  authScroll: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 48, paddingBottom: 40 },
  authBrand: { fontSize: 28, fontWeight: '900', color: palette.secondary, textAlign: 'center' },
  authTitle: { marginTop: 12, fontSize: 30, fontWeight: '800', color: palette.ink, textAlign: 'center' },
  authSubtitle: { marginTop: 8, color: palette.muted, fontSize: 14, textAlign: 'center' },
  roleSelectionRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 20, marginBottom: 18, gap: 8 },
  roleChip: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 999, backgroundColor: palette.white, borderWidth: 1, borderColor: palette.border },
  roleChipActive: { backgroundColor: '#E0F2FE', borderColor: '#7DD3FC' },
  roleChipText: { color: palette.muted, fontSize: 12, fontWeight: '700' },
  roleChipTextActive: { color: palette.secondary },
  formCard: { backgroundColor: palette.white, borderRadius: 20, padding: 18, shadowColor: palette.shadow, shadowOpacity: 0.08, shadowOffset: { width: 0, height: 4 }, shadowRadius: 10, elevation: 2 },
  formCardSimple: { backgroundColor: palette.white, borderRadius: 20, padding: 18, shadowColor: palette.shadow, shadowOpacity: 0.06, shadowOffset: { width: 0, height: 3 }, shadowRadius: 8, elevation: 2 },
  inputLabel: { color: palette.text, fontWeight: '700', fontSize: 13, marginBottom: 8, marginTop: 10 },
  input: { backgroundColor: '#F8FAFC', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1, borderColor: palette.border, color: palette.ink, marginBottom: 8 },
  primaryButton: { backgroundColor: palette.secondary, borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginTop: 16 },
  primaryButtonSmall: { backgroundColor: palette.secondary, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 14, alignItems: 'center', marginRight: 8 },
  primaryButtonText: { color: palette.white, fontWeight: '800', fontSize: 15 },
  secondaryButton: { marginTop: 12, borderRadius: 14, paddingVertical: 12, alignItems: 'center' },
  secondaryButtonInline: { marginTop: 12, borderRadius: 14, paddingVertical: 12, alignItems: 'center', backgroundColor: '#F8FAFC' },
  secondaryButtonSmall: { borderRadius: 12, paddingVertical: 10, paddingHorizontal: 14, alignItems: 'center', backgroundColor: '#F1F5F9' },
  secondaryButtonText: { color: palette.secondary, fontWeight: '700' },
  demoCard: { backgroundColor: palette.white, borderRadius: 18, padding: 18, marginTop: 18, shadowColor: palette.shadow, shadowOpacity: 0.06, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 2 },
  demoTitle: { color: palette.ink, fontWeight: '800', fontSize: 16, marginBottom: 12 },
  demoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: palette.border },
  demoName: { color: palette.ink, fontWeight: '700' },
  demoMeta: { color: palette.muted, marginTop: 4, fontSize: 12 },
  backLink: { marginBottom: 12 },
  backText: { color: palette.secondary, fontWeight: '700' },
  tabBar: { flexDirection: 'row', flexWrap: 'wrap', backgroundColor: palette.white, borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingHorizontal: 8, paddingTop: 10, paddingBottom: 24 },
  tabButton: { flex: 1, minWidth: 80, alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 12, marginHorizontal: 2, marginBottom: 6 },
  tabButtonActive: { backgroundColor: '#EAF2FF' },
  tabLabel: { color: palette.muted, fontSize: 11, fontWeight: '700', marginTop: 4 },
  tabLabelActive: { color: palette.secondary },
  moduleTile: { width: '48%', backgroundColor: '#F8FAFC', borderRadius: 14, padding: 12, marginBottom: 10, alignItems: 'center' },
  moduleTileText: { marginTop: 8, fontSize: 11, fontWeight: '700', color: palette.ink, textAlign: 'center' },
});
