
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystemLegacy from 'expo-file-system/legacy';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import TodoForm from '../../components/todo-form';
import TodoItem from '../../components/todo-item';
import { useAuth } from '../../context/auth-context';

type Task = {
  id: string;
  title: string;
  photoUri: string | null;
  location: { latitude: number; longitude: number } | null;
  completed: boolean;
  user: string;
};

const TASKS_KEY = 'tasks';

const TodoScreen: React.FC = () => {
  const { email } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, [email]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await AsyncStorage.getItem(TASKS_KEY);
      if (data) {
        const allTasks: Task[] = JSON.parse(data);
        setTasks(allTasks.filter(t => t.user === email));
      } else {
        setTasks([]);
      }
    } catch (e) {
      setTasks([]);
    }
    setLoading(false);
  };

  const saveTasks = async (newTasks: Task[]) => {
    try {
      // Guardar todas las tareas de todos los usuarios
      const data = await AsyncStorage.getItem(TASKS_KEY);
      let allTasks: Task[] = data ? JSON.parse(data) : [];
      // Eliminar las tareas del usuario actual
      allTasks = allTasks.filter(t => t.user !== email);
      // Agregar las nuevas tareas del usuario actual
      allTasks = [...allTasks, ...newTasks];
      await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(allTasks));
      setTasks(newTasks);
    } catch (e) {
      Alert.alert('Error', 'No se pudo guardar la tarea.');
    }
  };

  const handleAddTask = async ({ title, photoUri, location }: { title: string; photoUri: string | null; location: { latitude: number; longitude: number } | null }) => {
    let savedPhotoUri = null;
    if (photoUri) {
      // Guardar la foto en el sistema de archivos local
      const fileName = `${Date.now()}_${Math.floor(Math.random()*10000)}.jpg`;
      const dest = FileSystemLegacy.documentDirectory + fileName;
      await FileSystemLegacy.copyAsync({ from: photoUri, to: dest });
      savedPhotoUri = dest;
    }
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      photoUri: savedPhotoUri,
      location,
      completed: false,
      user: email,
    };
    const updatedTasks = [newTask, ...tasks];
    await saveTasks(updatedTasks);
  };

  const handleToggleComplete = async (id: string) => {
    const updatedTasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    await saveTasks(updatedTasks);
  };

  const handleDeleteTask = async (id: string) => {
    const taskToDelete = tasks.find(t => t.id === id);
    if (taskToDelete?.photoUri) {
      try { await FileSystemLegacy.deleteAsync(taskToDelete.photoUri, { idempotent: true }); } catch {}
    }
    const updatedTasks = tasks.filter(t => t.id !== id);
    await saveTasks(updatedTasks);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TODO List</Text>
      <TodoForm onSubmit={handleAddTask} />
      {loading ? (
        <Text>Cargando tareas...</Text>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TodoItem
              task={item}
              onToggleComplete={() => handleToggleComplete(item.id)}
              onDelete={() => handleDeleteTask(item.id)}
            />
          )}
          ListEmptyComponent={<Text>No hay tareas.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
});

export default TodoScreen;
