import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documents: defineTable({
    title:v.string(),
    userId:v.string(),
    isArchived:v.boolean(),
    parentDocument:v.optional(v.id("documents")),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.boolean(),
    publishedContent:v.optional(v.string())
  })
  .index("by_user", ["userId"])
  .index("by_user_parent",["userId","parentDocument"]),

  users: defineTable({
    userId: v.string(), //  Clerk User ID
    wrappedMek: v.string(), //  encrypted Main Encryption Key
    salt: v.string(), //  salt for password key
  }).index("by_userId", ["userId"]),
});