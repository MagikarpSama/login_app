
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import React, { useState } from 'react';
import { Alert, Button, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

type TodoFormProps = {
  onSubmit: (task: { title: string; photoUri: string | null; location: { latitude: number; longitude: number } | null }) => void;
};

const TodoForm: React.FC<TodoFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const getLocation = async () => {
    setLoading(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'No se pudo obtener la localización.');
      setLoading(false);
      return;
    }
    let loc = await Location.getCurrentPositionAsync({});
    setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
    setLoading(false);
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'El título es obligatorio.');
      return;
    }
    onSubmit({ title, photoUri, location });
    setTitle('');
    setPhotoUri(null);
    setLocation(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Título de la tarea</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Título"
      />
      <Button title={photoUri ? 'Cambiar foto' : 'Agregar foto'} onPress={pickImage} />
      {photoUri && <Image source={{ uri: photoUri }} style={styles.image} />}
      <Button title={location ? 'Localización lista' : loading ? 'Obteniendo localización...' : 'Obtener localización'} onPress={getLocation} disabled={loading} />
      {location && (
        <View style={{ marginVertical: 8 }}>
          <Text style={styles.location}>
            Lat: {location.latitude.toFixed(4)}, Lon: {location.longitude.toFixed(4)}
          </Text>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            region={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            pointerEvents="none"
          >
            <Marker coordinate={location} />
          </MapView>
        </View>
      )}
      <Button title="Crear tarea" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 24 },
  label: { fontWeight: 'bold', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginBottom: 8 },
  image: { width: 100, height: 100, marginVertical: 8, borderRadius: 8 },
  location: { marginVertical: 4, color: '#555' },
  map: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginTop: 8,
  },
});

export default TodoForm;
