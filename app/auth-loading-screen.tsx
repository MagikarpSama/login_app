import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import React, { useEffect } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'

const AuthLoadingScreen = () => {
  const router = useRouter()
  useEffect(() => {
    const checkAuthToken = async () => {
      const token = await AsyncStorage.getItem('authToken')
      if (token) {
        router.replace('/(tabs)')
      } else {
        router.replace('/login-screen')
      }
    }
    checkAuthToken()
  }, [router])

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default AuthLoadingScreen