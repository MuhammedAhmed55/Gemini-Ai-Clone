import { createClient } from "@/auth/client";

export interface Conversation {
  id: string;
  user_id: string;
  note_id: string | null;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: "user" | "ai";
  content: string;
  created_at: string;
}

/**
 * Create a new conversation
 */
export async function createConversation(
  noteId?: string,
  title: string = "New Conversation"
): Promise<Conversation | null> {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("conversations")
    .insert({
      user_id: user.id,
      note_id: noteId || null,
      title,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating conversation:", error);
    return null;
  }

  return data;
}

/**
 * Get all conversations for the current user
 */
export async function getConversations(): Promise<Conversation[]> {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching conversations:", error);
    return [];
  }

  return data || [];
}

/**
 * Get a specific conversation with all its messages
 */
export async function getConversationWithMessages(
  conversationId: string
): Promise<{ conversation: Conversation; messages: Message[] } | null> {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  // Fetch conversation
  const { data: conversation, error: convError } = await supabase
    .from("conversations")
    .select("*")
    .eq("id", conversationId)
    .eq("user_id", user.id)
    .single();

  if (convError) {
    console.error("Error fetching conversation:", convError);
    return null;
  }

  // Fetch messages
  const { data: messages, error: msgError } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (msgError) {
    console.error("Error fetching messages:", msgError);
    return null;
  }

  return {
    conversation,
    messages: messages || [],
  };
}

/**
 * Add a message to a conversation
 */
export async function addMessage(
  conversationId: string,
  role: "user" | "ai",
  content: string
): Promise<Message | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      role,
      content,
    })
    .select()
    .single();

  if (error) {
    console.error("Error adding message:", error);
    return null;
  }

  // Update conversation's updated_at timestamp
  await supabase
    .from("conversations")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", conversationId);

  return data;
}

/**
 * Update conversation title
 */
export async function updateConversationTitle(
  conversationId: string,
  title: string
): Promise<boolean> {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase
    .from("conversations")
    .update({ title, updated_at: new Date().toISOString() })
    .eq("id", conversationId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error updating conversation title:", error);
    return false;
  }

  return true;
}

/**
 * Delete a conversation and all its messages
 */
export async function deleteConversation(conversationId: string): Promise<boolean> {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase
    .from("conversations")
    .delete()
    .eq("id", conversationId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting conversation:", error);
    return false;
  }

  return true;
}

/**
 * Auto-generate conversation title from first user message
 */
export function generateTitleFromMessage(message: string): string {
  // Take first 50 characters and clean up
  const title = message.substring(0, 50).trim();
  if (title.length < message.length) {
    return title + "...";
  }
  return title || "New Conversation";
}
