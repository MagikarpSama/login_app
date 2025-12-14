import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useEffect, useState } from 'react'
import { Alert, FlatList, Modal, StyleSheet, Text, View } from 'react-native'
import TodoForm from '../../components/todo-form'
import TodoItem from '../../components/todo-item'
import API_BASE_URL from '../../constants/api-config'

type Task = {
  id: string;
  title: string;
  photoUrl: string | null;
  location: { latitude: number; longitude: number } | null;
  completed: boolean;
  photoUri: string | null; // Ensure this is not optional
  user: string; // Ensure this is not optional
};

const TodoScreen: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null)

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    setLoading(true)
    try {
      const token = await AsyncStorage.getItem('authToken')
      console.log('API_BASE_URL:', API_BASE_URL)
      console.log('Token:', token)
      const response = await fetch(`${API_BASE_URL}/todos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        
        if (response.status !== 404 && response.status !== 204) {
          console.log('Error al obtener tareas:', errorText)
          Alert.alert('Error', 'Failed to fetch tasks: ' + errorText)
        }
        setTasks([])
        return
      }

      const data = await response.json();
      setTasks(data.data);
    } catch (e) {
      console.log('Excepción al obtener tareas:', e)
      Alert.alert('Error', 'An error occurred while fetching tasks.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddTask = async ({ title, photoUri, location }: { title: string; photoUri: string | null; location: { latitude: number; longitude: number } | null }) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      let photoUrl = null;
      if (photoUri) {
        // Subir imagen a /images
        const formData = new FormData();
        formData.append('image', {
          uri: photoUri,
          name: 'photo.jpg',
          type: 'image/jpeg',
        } as any);
        const imageRes = await fetch(`${API_BASE_URL}/images`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        if (!imageRes.ok) {
          const errorText = await imageRes.text();
          console.log('Error al subir imagen:', errorText);
          Alert.alert('Error', 'No se pudo subir la imagen: ' + errorText);
          return;
        }
        const imageData = await imageRes.json();
        photoUrl = imageData?.data?.url || null;
      }
      // Crear tarea 
      const jsonBody: any = {
        title,
        completed: false,
        location: location || { latitude: 0, longitude: 0 },
      };
      if (photoUrl) {
        jsonBody.photoUri = photoUrl;
      }
      console.log('JSON enviado al backend:', jsonBody);
      const response = await fetch(`${API_BASE_URL}/todos`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonBody),
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error al crear tarea:', errorText);
        Alert.alert('Error', 'Failed to add task: ' + errorText);
        return;
      }
      const responseJson = await response.json();
      
      const newTask = responseJson.data ? responseJson.data : responseJson;
      setTasks(prevTasks => [newTask, ...prevTasks]);
    } catch (e) {
      console.log('Excepción al crear tarea:', e);
      Alert.alert('Error', 'An error occurred while adding the task. ' + e);
    }
  }

  const handleToggleComplete = async (id: string) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const task = tasks.find(t => t.id === id);
      if (!task) return;
      
      const jsonBody = {
        title: task.title,
        completed: !task.completed,
        location: task.location || { latitude: 0, longitude: 0 },
        photoUri: task.photoUri || '',
      };
      console.log('PUT toggle body:', jsonBody);
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonBody),
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Toggle PUT response error:', errorText);
        Alert.alert('Error', 'Failed to toggle task completion');
        return;
      }
      const responseJson = await response.json();
      console.log('Toggle PUT response ok:', responseJson);
      const updatedTask = responseJson.data ? responseJson.data : responseJson;
      setTasks(prevTasks => prevTasks.map(task => (task.id === id ? updatedTask : task)));
    } catch (e) {
      console.log('Toggle PUT exception:', e);
      Alert.alert('Error', 'An error occurred while toggling task completion.');
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error al borrar tarea:', errorText);
        Alert.alert('Error', 'Failed to delete task: ' + errorText);
        return;
      }

      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    } catch (e) {
      console.log('Excepción al borrar tarea:', e);
      Alert.alert('Error', 'An error occurred while deleting the task. ' + e);
    }
  }

  //edición
  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setEditModalVisible(true);
  };

  const handleSubmitEdit = async ({ title, photoUri, location }: { title: string; photoUri: string | null; location: { latitude: number; longitude: number } | null }) => {
    if (!taskToEdit) return;
    try {
      const token = await AsyncStorage.getItem('authToken');
      let photoUrl = null;
      if (photoUri && photoUri !== taskToEdit.photoUri) {
        // Subir nueva imagen 
        const formData = new FormData();
        formData.append('image', {
          uri: photoUri,
          name: 'photo.jpg',
          type: 'image/jpeg',
        } as any);
        const imageRes = await fetch(`${API_BASE_URL}/images`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        if (!imageRes.ok) {
          const errorText = await imageRes.text();
          Alert.alert('Error', 'No se pudo subir la imagen: ' + errorText);
          return;
        }
        const imageData = await imageRes.json();
        photoUrl = imageData?.data?.url || null;
      }
      // Actualizar tarea
      const jsonBody: any = {
        title,
        location: location || { latitude: 0, longitude: 0 },
      };
      if (photoUrl) {
        jsonBody.photoUri = photoUrl;
      } else if (photoUri) {
        jsonBody.photoUri = photoUri;
      }
      const response = await fetch(`${API_BASE_URL}/todos/${taskToEdit.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonBody),
      });
      if (!response.ok) {
        const errorText = await response.text();
        Alert.alert('Error', 'No se pudo editar la tarea: ' + errorText);
        return;
      }
      const responseJson = await response.json();
      const updatedTask = responseJson.data ? responseJson.data : responseJson;
      setTasks(prevTasks => prevTasks.map(task => (task.id === updatedTask.id ? updatedTask : task)));
      setEditModalVisible(false);
      setTaskToEdit(null);
    } catch (e) {
      Alert.alert('Error', 'Ocurrió un error al editar la tarea. ' + e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TODO List</Text>
      <TodoForm onSubmit={handleAddTask} />
      {loading ? (
        <Text>Loading tasks...</Text>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item, index) => item.id ? String(item.id) : String(index)}
          renderItem={({ item }) => (
            <TodoItem
              task={item}
              onToggleComplete={() => handleToggleComplete(item.id)}
              onDelete={() => handleDeleteTask(item.id)}
              onEdit={() => handleEditTask(item)}
            />
          )}
        />
      )}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        onRequestClose={() => { setEditModalVisible(false); setTaskToEdit(null); }}
      >
        <View style={{ flex: 1, justifyContent: 'center', padding: 16, backgroundColor: '#fff' }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>Editar tarea</Text>
          {taskToEdit && (
            <TodoForm
              onSubmit={handleSubmitEdit}
              initialTitle={taskToEdit.title}
              initialPhotoUri={taskToEdit.photoUri}
              initialLocation={taskToEdit.location}
              submitLabel="Guardar cambios"
            />
          )}
          <Text style={{ color: 'blue', marginTop: 16 }} onPress={() => { setEditModalVisible(false); setTaskToEdit(null); }}>Cancelar</Text>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
})

export default TodoScreen
