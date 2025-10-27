import { Redirect } from 'expo-router'


// Solo muestra LoginScreen al inicio
export default function Index() {
  return <Redirect href="/login" />
}
