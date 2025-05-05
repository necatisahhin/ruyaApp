import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Logo from '../../assets/logo';
import { register } from '../../services/authService';

const RegisterScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigation = useNavigation();

  const handleRegister = async () => {
    
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword || !age || !gender || !maritalStatus) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Hata', 'Lütfen geçerli bir e-posta adresi girin.');
      return;
    }

    
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      Alert.alert('Hata', 'Lütfen geçerli bir telefon numarası girin (10 haneli).');
      return;
    }

    
    if (password.length < 6) {
      Alert.alert('Hata', 'Şifre en az 6 karakter olmalıdır.');
      return;
    }

    
    if (password !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor.');
      return;
    }

    
    const ageNumber = parseInt(age, 10);
    if (isNaN(ageNumber) || ageNumber < 18 || ageNumber > 120) {
      Alert.alert('Hata', 'Lütfen geçerli bir yaş girin (18-120 arası).');
      return;
    }

    setIsLoading(true);
    
    try {
      
      const userData = {
        firstName,
        lastName,
        email,
        phone,
        password,
        age: ageNumber,
        gender,
        maritalStatus,
        profileImage: null
      };
      
      await register(userData);
      
      
      Alert.alert(
        'Başarılı',
        'Kaydınız başarıyla tamamlandı!',
        [
          {
            text: 'Tamam',
            onPress: () => {
              
              navigation.reset({
                index: 0,
                routes: [{ name: 'TabNavigator' as never }],
              });
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('Kayıt hatası:', error);
      Alert.alert('Hata', error.message || 'Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToLogin = () => {
    
    navigation.navigate('Login');
  };

  const renderGenderOptions = () => {
    return (
      <View style={styles.optionsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity 
            style={[
              styles.optionButton, 
              gender === 'male' && styles.selectedOption
            ]}
            onPress={() => setGender('male')}
          >
            <Text style={[
              styles.optionText,
              gender === 'male' && styles.selectedOptionText
            ]}>Erkek</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.optionButton, 
              gender === 'female' && styles.selectedOption
            ]}
            onPress={() => setGender('female')}
          >
            <Text style={[
              styles.optionText,
              gender === 'female' && styles.selectedOptionText
            ]}>Kadın</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.optionButton, 
              gender === 'other' && styles.selectedOption
            ]}
            onPress={() => setGender('other')}
          >
            <Text style={[
              styles.optionText,
              gender === 'other' && styles.selectedOptionText
            ]}>Diğer</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  };

  const renderMaritalStatusOptions = () => {
    return (
      <View style={styles.optionsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity 
            style={[
              styles.optionButton, 
              maritalStatus === 'single' && styles.selectedOption
            ]}
            onPress={() => setMaritalStatus('single')}
          >
            <Text style={[
              styles.optionText,
              maritalStatus === 'single' && styles.selectedOptionText
            ]}>Bekar</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.optionButton, 
              maritalStatus === 'married' && styles.selectedOption
            ]}
            onPress={() => setMaritalStatus('married')}
          >
            <Text style={[
              styles.optionText,
              maritalStatus === 'married' && styles.selectedOptionText
            ]}>Evli</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.optionButton, 
              maritalStatus === 'divorced' && styles.selectedOption
            ]}
            onPress={() => setMaritalStatus('divorced')}
          >
            <Text style={[
              styles.optionText,
              maritalStatus === 'divorced' && styles.selectedOptionText
            ]}>Boşanmış</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.optionButton, 
              maritalStatus === 'widowed' && styles.selectedOption
            ]}
            onPress={() => setMaritalStatus('widowed')}
          >
            <Text style={[
              styles.optionText,
              maritalStatus === 'widowed' && styles.selectedOptionText
            ]}>Dul</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContent}
            bounces={false}
          >
            <View style={styles.headerContainer}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={navigateToLogin}
              >
                <Ionicons name="chevron-back" size={24} color="#2D2D7D" />
              </TouchableOpacity>
              <View style={styles.logoSmallContainer}>
                <Logo size={hp('4%')} />
                <Text style={styles.headerTitle}>Hesap Oluştur</Text>
              </View>
              <View style={styles.emptyView} />
            </View>

            <Text style={styles.subtitle}>Kişisel bilgilerinizi girin</Text>

            <View style={styles.formContainer}>
              <View style={styles.nameContainer}>
                <View style={[styles.inputContainer, { flex: 1, marginRight: wp('2%') }]}>
                  <TextInput
                    style={styles.input}
                    placeholder="Ad"
                    value={firstName}
                    onChangeText={setFirstName}
                    autoCapitalize="words"
                  />
                </View>
                <View style={[styles.inputContainer, { flex: 1, marginLeft: wp('2%') }]}>
                  <TextInput
                    style={styles.input}
                    placeholder="Soyad"
                    value={lastName}
                    onChangeText={setLastName}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={22} color="#6060CF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="E-posta"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="call-outline" size={22} color="#6060CF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Telefon (5XXXXXXXXX)"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={22} color="#6060CF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Şifre"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity 
                  style={styles.eyeIcon} 
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons 
                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                    size={22} 
                    color="#6060CF" 
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={22} color="#6060CF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Şifre Tekrar"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity 
                  style={styles.eyeIcon} 
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons 
                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                    size={22} 
                    color="#6060CF" 
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="calendar-outline" size={22} color="#6060CF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Yaş"
                  value={age}
                  onChangeText={setAge}
                  keyboardType="number-pad"
                  maxLength={3}
                />
              </View>

              <Text style={styles.sectionTitle}>Cinsiyet</Text>
              {renderGenderOptions()}

              <Text style={styles.sectionTitle}>Medeni Durum</Text>
              {renderMaritalStatusOptions()}

              <TouchableOpacity
                onPress={handleRegister}
                disabled={isLoading}
                style={styles.registerButtonContainer}
              >
                <LinearGradient
                  colors={['#2D2D7D', '#4C4CA6', '#6060CF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.registerButton}
                >
                  {isLoading ? (
                    <Text style={styles.registerButtonText}>Kaydediliyor...</Text>
                  ) : (
                    <Text style={styles.registerButtonText}>Kayıt Ol</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Zaten hesabınız var mı? </Text>
                <TouchableOpacity onPress={navigateToLogin}>
                  <Text style={styles.loginLink}>Giriş Yap</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: hp('8%'),
    paddingTop: Platform.OS === 'android' ? hp('2%') : 0,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('5%'),
    marginTop: hp('1%'),
    marginBottom: hp('1%'),
  },
  backButton: {
    padding: 5,
  },
  logoSmallContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: hp('2.2%'),
    fontWeight: '600',
    color: '#2D2D7D',
    marginLeft: wp('2%'),
  },
  emptyView: {
    width: 24,
  },
  subtitle: {
    fontSize: hp('1.8%'),
    color: '#666',
    textAlign: 'center',
    marginBottom: hp('2%'),
  },
  formContainer: {
    paddingHorizontal: wp('6%'),
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('2%'),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    marginBottom: hp('2%'),
    paddingHorizontal: wp('4%'),
    height: hp('6%'),
    backgroundColor: '#F8F8F8',
  },
  inputIcon: {
    marginRight: wp('2%'),
  },
  input: {
    flex: 1,
    fontSize: hp('1.8%'),
    color: '#333',
  },
  eyeIcon: {
    padding: 8,
  },
  sectionTitle: {
    fontSize: hp('1.8%'),
    fontWeight: '600',
    color: '#2D2D7D',
    marginBottom: hp('1%'),
  },
  optionsContainer: {
    flexDirection: 'row',
    marginBottom: hp('2%'),
  },
  optionButton: {
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('4%'),
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: wp('2%'),
    backgroundColor: '#F8F8F8',
  },
  selectedOption: {
    backgroundColor: '#E8E8FF',
    borderColor: '#6060CF',
  },
  optionText: {
    fontSize: hp('1.6%'),
    color: '#666',
  },
  selectedOptionText: {
    color: '#6060CF',
    fontWeight: '500',
  },
  registerButtonContainer: {
    marginTop: hp('2%'),
    marginBottom: hp('2%'),
  },
  registerButton: {
    height: hp('6%'),
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2D2D7D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  registerButtonText: {
    color: 'white',
    fontSize: hp('2%'),
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: hp('1%'),
    marginBottom: hp('2%'),
  },
  loginText: {
    color: '#666',
    fontSize: hp('1.8%'),
  },
  loginLink: {
    color: '#6060CF',
    fontSize: hp('1.8%'),
    fontWeight: '600',
  },
});

export default RegisterScreen; 