import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

// Get user data based on their Clerk ID
export const getUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not Authenticated");
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .unique();

    return user;
  },
});

// Create the user record with their encrypted key
export const createUser = mutation({
  args: {
    wrappedMek: v.string(),
    salt: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Cannot create user data without authentication.");
    }
    await ctx.db.insert("users", {
      userId: identity.subject,
      wrappedMek: args.wrappedMek,
      salt: args.salt,
    });
  },
});
