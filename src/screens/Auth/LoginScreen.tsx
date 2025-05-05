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
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Logo from '../../assets/logo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '../../services/authService';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { StackNavigationProp } from '@react-navigation/stack';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList>;
type LoginScreenRouteProp = RouteProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const route = useRoute<LoginScreenRouteProp>();
  const { returnScreen, returnParams } = route.params || {};

  const handleLogin = async () => {
    
    if (!email || !password) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Hata', 'Lütfen geçerli bir e-posta adresi girin.');
      return;
    }

    setIsLoading(true);
    
    try {
      
      const userData = await login(email, password);
      
      
      if (userData) {
        
        if (returnScreen) {
          navigation.navigate(returnScreen as keyof RootStackParamList, returnParams);
        } else {
          
          navigation.navigate('TabNavigator', { screen: 'RuyaList' });
        }
      }
    } catch (error) {
      
      Alert.alert('Giriş Hatası', 'E-posta veya şifre hatalı.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToRegister = () => {
    
    navigation.navigate('Register');
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
          <View style={styles.contentContainer}>
            <View style={styles.logoContainer}>
              <Logo size={hp('12%')} />
              <Text style={styles.appName}>Rüya Tabirleri</Text>
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.welcomeText}>Hoş Geldiniz</Text>
              <Text style={styles.subtitle}>Hesabınıza giriş yapın</Text>

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

              <TouchableOpacity style={styles.forgotPasswordContainer}>
                <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleLogin}
                disabled={isLoading}
                style={styles.loginButtonContainer}
              >
                <LinearGradient
                  colors={['#2D2D7D', '#4C4CA6', '#6060CF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.loginButton}
                >
                  {isLoading ? (
                    <Text style={styles.loginButtonText}>Giriş Yapılıyor...</Text>
                  ) : (
                    <Text style={styles.loginButtonText}>Giriş Yap</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Hesabınız yok mu? </Text>
                <TouchableOpacity onPress={navigateToRegister}>
                  <Text style={styles.registerLink}>Kayıt Ol</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
  contentContainer: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? hp('2%') : 0,
    paddingBottom: hp('2%'),
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: hp('4%'),
  },
  appName: {
    fontSize: hp('2.8%'),
    fontWeight: '600',
    color: '#2D2D7D',
    marginTop: hp('1%'),
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: wp('6%'),
    marginTop: hp('3%'),
  },
  welcomeText: {
    fontSize: hp('3%'),
    fontWeight: '700',
    color: '#2D2D7D',
    marginBottom: hp('1%'),
  },
  subtitle: {
    fontSize: hp('1.8%'),
    color: '#666',
    marginBottom: hp('3%'),
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
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: hp('2%'),
  },
  forgotPasswordText: {
    color: '#6060CF',
    fontSize: hp('1.8%'),
    fontWeight: '500',
  },
  loginButtonContainer: {
    marginTop: hp('1%'),
    marginBottom: hp('2%'),
  },
  loginButton: {
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
  loginButtonText: {
    color: 'white',
    fontSize: hp('2%'),
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: hp('2%'),
  },
  registerText: {
    color: '#666',
    fontSize: hp('1.8%'),
  },
  registerLink: {
    color: '#6060CF',
    fontSize: hp('1.8%'),
    fontWeight: '600',
  },
});

export default LoginScreen; 