import React, { useEffect, useState } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import { useAuth } from '../auth-context'

const ProfileScreen: React.FC = () => {
  const { email, setEmail } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedEmail = window.localStorage.getItem('email')
      if (storedEmail) setEmail(storedEmail)
      setLoading(false)
    }
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
      <Text style={styles.email}>{email || 'No disponible'}</Text>
      <Button
        title="Cerrar sesión"
        color="#d32f2f"
        onPress={() => {
          setEmail('')
          if (typeof window !== 'undefined') {
            window.localStorage.removeItem('email')
          }
          window.location.href = '/login'
        }}
      />
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
