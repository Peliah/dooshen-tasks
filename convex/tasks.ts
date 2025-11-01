import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// The get query function returns all tasks from the database.
export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").collect();
  },
});

// The create mutation function creates a new task in the database.
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    completed: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tasks", {
      title: args.title,
      description: args.description,
      completed: args.completed ?? false,
    });
  },
});

// The update mutation function updates a task to completed by id in the database.
export const update = mutation({
  args: {
    id: v.id("tasks"),
    completed: v.boolean(),
    title: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    const fieldsToUpdate = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );
    
    if (Object.keys(fieldsToUpdate).length === 0) {
      throw new Error("No fields to update");
    }
    
    await ctx.db.patch(id, fieldsToUpdate);
    return await ctx.db.get(id);
  },
});

// The delete mutation function deletes a specific task by id from the database.
export const deleteTask = mutation({
  args: {
    id: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// The clearCompleted mutation function deletes all completed tasks from the database.
export const clearCompleted = mutation({
  args: {},
  handler: async (ctx) => {
    const completedTasks = await ctx.db
      .query("tasks")
      .filter((q) => q.eq(q.field("completed"), true))
      .collect();
    
    await Promise.all(
      completedTasks.map((task) => ctx.db.delete(task._id))
    );
    
    return completedTasks.length;
  },
});

