import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import { useAuth } from '../../context/auth-context'

const ProfileScreen: React.FC = () => {
  const { email, setEmail } = useAuth()
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchEmail = async () => {
      const storedEmail = await AsyncStorage.getItem('email')
      if (storedEmail) setEmail(storedEmail)
      setLoading(false)
    }
    fetchEmail()
  }, [setEmail])

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Perfil</Text>
        <Text>Cargando...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <Text style={styles.label}>Email:</Text>
      <Text style={styles.email}>{email}</Text>
      <Button title="Cerrar sesión" onPress={async () => {
        setEmail('')
        await AsyncStorage.removeItem('email')
        router.replace('/login')
      }} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#222',
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    color: '#555',
  },
  email: {
    fontSize: 16,
    color: '#1976d2',
    marginBottom: 24,
  },
})

export default ProfileScreen
