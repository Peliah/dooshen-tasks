import { useMutation } from 'convex/react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/context/ThemeContext';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

interface TodoItemProps {
  id: Id<'tasks'>;
  title: string;
  completed: boolean;
  drag?: () => void;
  isActive?: boolean;
}

export function TodoItem({ id, title, completed, drag, isActive }: TodoItemProps) {
  const { isDark } = useTheme();
  const updateTask = useMutation(api.tasks.update);
  const deleteTask = useMutation(api.tasks.deleteTask);

  const handleToggleTodo = async () => {
    await updateTask({
      id,
      title,
      completed: !completed,
    });
  };

  const handleDeleteTodo = async () => {
    await deleteTask({ id });
  };

  return (
    <TouchableOpacity
      style={[styles.container, isActive && styles.containerActive]}
      onLongPress={drag}
      delayLongPress={drag ? 200 : undefined}
      activeOpacity={0.8}
      disabled={!drag || isActive}
    >
      <TouchableOpacity 
        onPress={handleToggleTodo}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        {
          completed ? (
            <Image
              source={ require('@/assets/imgs/tick.svg')}
              style={styles.radioButton}
            />
          ) : (
            <Ionicons 
              name="radio-button-off" 
              size={24} 
              color={isDark ? '#393A4B' : '#E3E4F1'} 
            />
          )
        }
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <ThemedText 
          type="default" 
          style={[
            styles.todoItemText,
            completed && styles.todoItemTextCompleted
          ]}
        >
          {title}
        </ThemedText>
      </View>
      <TouchableOpacity 
        onPress={handleDeleteTodo} 
        style={styles.deleteButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons 
          name="close" 
          size={18} 
          color="#494C6B" 
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E3E4F1',
  },
  containerActive: {
    opacity: 0.8,
  },
  textContainer: {
    flex: 1,
  },
  todoItemText: {
    fontSize: 16,
    lineHeight: 24,
  },
  todoItemTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#4D5067',
  },
  deleteButton: {
    marginLeft: 'auto',
    padding: 4,
  },
  radioButton: {
    width: 24,
    height: 24,
  },
});

