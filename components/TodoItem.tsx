import { useMutation } from 'convex/react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/context/ThemeContext';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Ionicons } from '@expo/vector-icons';

interface TodoItemProps {
  id: Id<'tasks'>;
  title: string;
  completed: boolean;
}

export function TodoItem({ id, title, completed }: TodoItemProps) {
  const { isDark } = useTheme();
  const updateTask = useMutation(api.tasks.update);

  const handleToggleTodo = async () => {
    await updateTask({
      id,
      title,
      completed: !completed,
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleToggleTodo}>
        <Ionicons 
          name={completed ? "radio-button-on" : "radio-button-off"} 
          size={24} 
          color={isDark ? '#393A4B' : '#E3E4F1'} 
        />
      </TouchableOpacity>
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
  todoItemText: {
    fontSize: 16,
    lineHeight: 24,
  },
  todoItemTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#4D5067',
  },
});

