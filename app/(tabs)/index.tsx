import { useMutation, useQuery } from 'convex/react';
import { Image } from 'expo-image';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ThemeToggleButton } from '@/components/ThemeToggleButton';
import { TodoItem } from '@/components/TodoItem';
import { useTheme } from '@/context/ThemeContext';
import { api } from '@/convex/_generated/api';
import { Ionicons } from '@expo/vector-icons';

type Filter = 'All' | 'Active' | 'Completed';

export default function HomeScreen() {
  const { isDark } = useTheme();
  const [todo, setTodo] = useState('');
  const [activeFilter, setActiveFilter] = useState<Filter>('All');
  const [localTodosOrder, setLocalTodosOrder] = useState<any[]>([]);
  const createTask = useMutation(api.tasks.create);
  const clearCompleted = useMutation(api.tasks.clearCompleted);
  const todos = useQuery(api.tasks.get) ?? [];
  
  const incompleteTodos = todos.filter((task) => !task.completed);
  const itemsLeft = incompleteTodos.length;
  
  useEffect(() => {
    if (todos.length === 0) {
      setLocalTodosOrder([]);
      return;
    }
    
    if (localTodosOrder.length === 0) {
      setLocalTodosOrder(todos);
      return;
    }
    
    const convexMap = new Map(todos.map(item => [item._id, item]));
    
    const localIds = new Set(localTodosOrder.map(item => item._id));
    const convexIds = new Set(todos.map(item => item._id));
    
    const hasNewItems = [...convexIds].some(id => !localIds.has(id));
    const hasRemovedItems = [...localIds].some(id => !convexIds.has(id));
    
    if (hasNewItems || hasRemovedItems) {
      const preservedOrder = localTodosOrder
        .filter(item => convexIds.has(item._id))
        .map(item => convexMap.get(item._id)!);
      
      const newItems = todos.filter(item => !localIds.has(item._id));
      
      setLocalTodosOrder([...preservedOrder, ...newItems]);
    } else {
      // Only update existing items with latest data from Convex, preserve order
      const updatedOrder = localTodosOrder.map(item => {
        const updated = convexMap.get(item._id);
        return updated || item;
      });
      setLocalTodosOrder(updatedOrder);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todos.length, todos.map(t => t._id).join(',')]);
  
  // Filter todos based on active filter
  const filteredTodos = localTodosOrder.length > 0 
    ? localTodosOrder.filter((task) => {
        if (activeFilter === 'Active') {
          return !task.completed;
        }
        if (activeFilter === 'Completed') {
          return task.completed;
        }
        return true;
      })
    : todos.filter((task) => {
        if (activeFilter === 'Active') {
          return !task.completed;
        }
        if (activeFilter === 'Completed') {
          return task.completed;
        }
        return true;
      });
  
  const handleCreateTodo = async () => {
    if (todo.trim()) {
      await createTask({
        title: todo.trim(),
        completed: false,
      });
      setTodo('');
    }
  };

  const handleClearCompleted = async () => {
    await clearCompleted();
  };

  const handleFilterChange = (filter: Filter) => {
    setActiveFilter(filter);
  };

  const handleDragEnd = useCallback(({ data }: { data: any[] }) => {

    setLocalTodosOrder(data);
  }, []);

  const renderTodoItem = ({ item, drag, isActive }: RenderItemParams<any>) => {
    const canDrag = true;
    
    return (
      <ScaleDecorator>
        <TodoItem 
          id={item._id}
          title={item.title}
          completed={item.completed}
          drag={canDrag ? drag : undefined}
          isActive={isActive}
        />
      </ScaleDecorator>
    );
  };

  const renderFooter = () => {
    return (
      <View style={styles.footer}>
        <ThemedText style={styles.itemsLeftText}>
          {itemsLeft} {itemsLeft === 1 ? 'item' : 'items'} left
        </ThemedText>
        <TouchableOpacity onPress={handleClearCompleted}>
          <ThemedText style={styles.clearButtonText}>Clear Completed</ThemedText>
        </TouchableOpacity>
      </View>
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
          {/* Drag and drop todo list */}
          {/* This is still buggy on android device */}
          <ThemedView style={styles.todoListContainer}>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <DraggableFlatList
                data={filteredTodos}
                onDragEnd={handleDragEnd}
                keyExtractor={(item) => item._id}
                renderItem={renderTodoItem}
                scrollEnabled={false}
                ListFooterComponent={renderFooter}
                activationDistance={10}
              />
            </GestureHandlerRootView>
          </ThemedView>
          
          <ThemedView style={styles.filtersContainer}>
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => handleFilterChange('All')}
            >
              <ThemedText style={[
                styles.filterButtonText,
                activeFilter === 'All' && styles.filterButtonTextActive
              ]}>
                All
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => handleFilterChange('Active')}
            >
              <ThemedText style={[
                styles.filterButtonText,
                activeFilter === 'Active' && styles.filterButtonTextActive
              ]}>
                Active
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => handleFilterChange('Completed')}
            >
              <ThemedText style={[
                styles.filterButtonText,
                activeFilter === 'Completed' && styles.filterButtonTextActive
              ]}>
                Completed
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
          
          <View style={styles.dragDropTextContainer}>
            <ThemedText style={styles.dragDropText} type="default">
              Drag and drop to reorder list
            </ThemedText>
          </View>
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
    flex: 1,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  itemsLeftText: {
    fontSize: 14,
    color: '#9495A5',
  },
  clearButtonText: {
    fontSize: 14,
    color: '#9495A5',
  },
  filtersContainer: {
    borderRadius: 8,
    marginVertical: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  filterButton: {
    padding: 10,
    borderRadius: 8,
  },
  filterButtonText: {
    fontSize: 16,
    color: '#9495A5',
    fontWeight: '700',
  },
  filterButtonTextActive: {
    color: '#3A7CFD',
  },
  dragDropTextContainer: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  dragDropText: {
    fontSize: 16,
    color: '#9495A5',
    textAlign: 'center',
  },
});
