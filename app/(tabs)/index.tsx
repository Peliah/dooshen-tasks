import { useMutation, useQuery } from 'convex/react';
import { Image } from 'expo-image';
import { useState } from 'react';
import { FlatList, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedView } from '@/components/themed-view';
import { ThemeToggleButton } from '@/components/ThemeToggleButton';
import { TodoItem } from '@/components/TodoItem';
import { useTheme } from '@/context/ThemeContext';
import { api } from '@/convex/_generated/api';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const { isDark } = useTheme();
  const [todo, setTodo] = useState('');
  const createTask = useMutation(api.tasks.create);
  const todos = useQuery(api.tasks.get) ?? [];
  
  const handleCreateTodo = async () => {
    if (todo.trim()) {
      await createTask({
        title: todo.trim(),
        completed: false,
      });
      setTodo('');
    }
  };

  const renderTodoItem = ({ item }: { item: any }) => {
    return (
      <TodoItem 
        id={item._id}
        title={item.title}
        completed={item.completed}
      />
    );
  };
  
  return (
    <ParallaxScrollView
      headerImage={
        <Image
          source={isDark 
            ? require('@/assets/imgs/background-dark.png')
            : require('@/assets/imgs/background-light.png')
          }
          style={styles.backgroundImage}
          contentFit="cover"
          transition={150}
        />
      }
      overlayContent={
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Image source={require('@/assets/imgs/TODO.svg')} style={styles.logo} />
            <ThemeToggleButton />
          </View>
          <ThemedView style={styles.inputContainer}>
            <TouchableOpacity
              onPress={handleCreateTodo}
            >
              <Ionicons name="radio-button-off" size={24} color="#E3E4F1" />
            </TouchableOpacity>
            <TextInput
              placeholder="Create a todo..."
              value={todo}
              onChangeText={setTodo}
              style={styles.input}
            />
          </ThemedView>
          {/* Todo List */}
          <ThemedView style={styles.todoListContainer}>
            <FlatList
              data={todos}
              renderItem={renderTodoItem}
              scrollEnabled={false}
              nestedScrollEnabled={true}
              keyExtractor={(item) => item._id}
            />
          </ThemedView>
        </View>
      }>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 110,
    height: 20,
    alignSelf: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'space-between',
    paddingBottom: 24,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  container: {
    backgroundColor: 'transparent',
    paddingTop: 16,
    paddingHorizontal: 24,
  },
  inputContainer: {
    gap: 8,
    marginVertical: 24,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  input: {
    padding: 8,
  },
  todoListContainer: {
    borderRadius: 8,
    // paddingHorizontal: 20,
    // paddingVertical: 14,
  },
});
