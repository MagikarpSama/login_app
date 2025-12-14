
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Task = {
  id: string;
  title: string;
  photoUri: string | null;
  location: { latitude: number; longitude: number } | null;
  completed: boolean;
  user: string;
};

type TodoItemProps = {
  task: Task;
  onToggleComplete: () => void;
  onDelete: () => void;
  onEdit: () => void;
};

const TodoItem: React.FC<TodoItemProps> = ({ task, onToggleComplete, onDelete, onEdit }) => {
  console.log('TodoItem task:', task);
  // Determinar el campo correcto para el título
  const displayTitle = task.title || (task as any).nombre || (task as any).titulo || JSON.stringify(task);
  // Determinar el campo correcto para la imagen
  const imageUri = task.photoUri || (task as any).photoUrl || (task as any).imagen || null;
  return (
    <View style={[styles.container, task.completed && styles.completed]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{displayTitle}</Text>
        {task.location && (
          <Text style={styles.location}>
            📍 {task.location.latitude.toFixed(4)}, {task.location.longitude.toFixed(4)}
          </Text>
        )}
      </View>
      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.image} />
      )}
      <TouchableOpacity
        onPress={() => {
          console.log('Toggle complete pressed for task:', task.id, task.completed);
          onToggleComplete();
        }}
        style={styles.actionBtn}
      >
        <Text style={{ color: task.completed ? 'green' : 'gray' }}>
          {task.completed ? '✔' : '○'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onEdit} style={styles.actionBtn}>
        <Text style={{ color: 'blue' }}>✏️</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onDelete} style={styles.actionBtn}>
        <Text style={{ color: 'red' }}>🗑</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  completed: {
    opacity: 0.5,
    backgroundColor: '#e0ffe0',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  location: {
    fontSize: 12,
    color: '#555',
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 6,
    marginLeft: 8,
  },
  actionBtn: {
    marginLeft: 8,
    padding: 6,
  },
});

export default TodoItem;
