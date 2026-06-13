import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';

export default function HomeScreen() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState<string[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [apiTasks, setApiTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {  loadTasks(); }, []);

  useEffect(() => {
    saveTasks();
  }, [tasks]);

  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.log(error);
    }
  };

  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem('tasks');
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);

    const response = await fetch(
      'https://jsonplaceholder.typicode.com/todos?_limit=5'
    );

    const data = await response.json();

    setApiTasks(data);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
  };

  const addTask = () => {
    if (task.trim() === '') return;

    if (editingIndex !== null) {
      const updatedTasks = [...tasks];
      updatedTasks[editingIndex] = task;

      setTasks(updatedTasks);
      setEditingIndex(null);
    } else {
      setTasks([...tasks, task]);
    }

    setTask('');
  };

  const deleteTask = (index: number) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  const editTask = (index: number) => {
    setTask(tasks[index]);
    setEditingIndex(index);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todo App</Text>

      <TextInput
        style={styles.input}
        placeholder="Nhập công việc..."
        value={task}
        onChangeText={setTask}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={addTask}
      >
        <Text style={styles.buttonText}>
          {editingIndex !== null
            ? 'Cập Nhật Công Việc'
            : 'Thêm Công Việc'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
       style={styles.apiButton}
      onPress={fetchTasks}>
       <Text style={styles.buttonText}>
       Tải Dữ Liệu API
       </Text>
       </TouchableOpacity>

      <FlatList
        data={tasks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.taskItem}>
            <Text>{item}</Text>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                onPress={() => editTask(index)}
              >
                <Text style={styles.edit}>
                  Sửa
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => deleteTask(index)}
              >
                <Text style={styles.delete}>
                  Xóa
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <Text style={styles.apiTitle}>
       Dữ liệu từ API
      </Text>

      {loading ? (
      <Text>Đang tải...</Text>
      ) : (
      apiTasks.map(item => (
      <View
      key={item.id}
      style={styles.apiItem}
       >
      <Text>
       Công việc #{item.id}
     </Text>
       </View>
       ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 50,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },

  addButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },

  apiButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },

  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    borderRadius: 10,
  },

  actionButtons: {
    flexDirection: 'row',
    gap: 15,
  },

  edit: {
    color: 'blue',
    fontWeight: 'bold',
  },

  delete: {
    color: 'red',
    fontWeight: 'bold',
  },

apiTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  marginTop: 20,
  marginBottom: 10,
},

apiItem: {
  backgroundColor: '#f2f2f2',
  padding: 10,
  borderRadius: 10,
  marginBottom: 8,
},
});

