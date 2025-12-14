import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native'

const RegisterScreen = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async () => {
    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres.')
      return
    }
    setLoading(true)
    try {
      const response = await fetch('https://todo-list.dobleb.cl/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
      console.log('RESPONSE:', response);
      let data;
      try {
        data = await response.json();
      } catch {
        data = await response.text();
      }
      console.log('DATA:', data);
      if (!response.ok) {
        let errorMsg = 'No se pudo registrar el usuario';
        if (typeof data === 'string') {
          errorMsg = data;
        } else if (data && typeof data === 'object') {
          if (typeof data.error === 'string') {
            errorMsg = data.error;
          } else if (data.error && typeof data.error === 'object' && 'message' in data.error) {
            errorMsg = data.error.message;
          }
        }
        Alert.alert('Error', errorMsg);
        setLoading(false);
        return;
      }
      Alert.alert('¡Registro exitoso!', 'Ahora puedes iniciar sesión', [
        { text: 'OK', onPress: () => router.replace('/login-screen') },
      ]);
    } catch (e: any) {
      console.log('REGISTER ERROR:', e);
      Alert.alert('Error', 'No se pudo conectar al servidor: ' + (e?.message || e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Registro</Text>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Ingresa tu email"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#888"
        />
        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Contraseña"
          secureTextEntry
          placeholderTextColor="#888"
        />
        <Button title={loading ? 'Registrando...' : 'Registrarse'} onPress={handleRegister} disabled={loading} color="#1976D2" />
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
  card: {
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#222',
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#1976D2',
    fontWeight: 'bold',
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
})

export default RegisterScreen
