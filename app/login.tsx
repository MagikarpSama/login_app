import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useAuth } from '../context/auth-context'

const LoginScreen: React.FC = () => {
  const [emailInput, setEmailInput] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const { setEmail } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async () => {
    if (!emailInput.trim()) {
      setError('Debes ingresar un correo electrónico válido')
      setSuccess(false)
      return
    }
    // Validación básica de formato de email
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
    if (!emailRegex.test(emailInput)) {
      setError('Formato de correo electrónico inválido')
      setSuccess(false)
      return
    }
    if (password !== '1234') {
      setError('Contraseña incorrecta')
      setSuccess(false)
      return
    }
    setError('')
    setSuccess(true)
    setEmail(emailInput)
    await AsyncStorage.setItem('email', emailInput)
    setTimeout(() => {
      router.push('/(tabs)/profile')
    }, 1200)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={emailInput}
          onChangeText={setEmailInput}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.toggle} onPress={() => setShowPassword((v) => !v)}>
          <Text style={styles.toggleText}>{showPassword ? 'Ocultar' : 'Mostrar'} contraseña</Text>
        </TouchableOpacity>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {success ? <Text style={styles.success}>¡Inicio de sesión exitoso!</Text> : null}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>INGRESAR</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f6fa',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    color: '#222',
  },
  form: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  input: {
    width: '100%',
    height: 48,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    color: '#222',
  },
  button: {
    backgroundColor: '#1976d2',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  error: {
    color: '#d32f2f',
    marginBottom: 8,
    textAlign: 'center',
  },
  success: {
    color: '#388e3c',
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  toggle: {
    alignSelf: 'flex-end',
    marginBottom: 8,
    padding: 4,
  },
  toggleText: {
    color: '#1976d2',
    fontSize: 14,
  },
})

export default LoginScreen
