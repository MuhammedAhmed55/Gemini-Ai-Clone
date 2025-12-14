# Conversation History System Setup Guide

## Database Setup

Run these SQL commands in your Supabase database to create the necessary tables:

```sql
-- Conversations table
create table conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  note_id uuid references notes(id) on delete set null,
  title text default 'New Conversation',
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Messages table
create table messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) on delete cascade,
  role text check (role in ('user', 'ai')),
  content text not null,
  created_at timestamp default now()
);

-- Add indexes for better performance
create index conversations_user_id_idx on conversations(user_id);
create index conversations_updated_at_idx on conversations(updated_at desc);
create index messages_conversation_id_idx on messages(conversation_id);
create index messages_created_at_idx on messages(created_at);

-- Enable RLS (Row Level Security)
alter table conversations enable row level security;
alter table messages enable row level security;

-- Create policies for conversations
create policy "Users can view their own conversations"
  on conversations for select
  using (auth.uid() = user_id);

create policy "Users can create conversations"
  on conversations for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own conversations"
  on conversations for update
  using (auth.uid() = user_id);

create policy "Users can delete their own conversations"
  on conversations for delete
  using (auth.uid() = user_id);

-- Create policies for messages
create policy "Users can view messages in their conversations"
  on messages for select
  using (
    exists (
      select 1 from conversations
      where conversations.id = messages.conversation_id
      and conversations.user_id = auth.uid()
    )
  );

create policy "Users can insert messages in their conversations"
  on messages for insert
  with check (
    exists (
      select 1 from conversations
      where conversations.id = conversation_id
      and conversations.user_id = auth.uid()
    )
  );
```

## Files Created/Modified

### New Files:

1. **`src/lib/conversations.ts`** - Database helper functions

   - `createConversation()` - Create new conversation
   - `getConversations()` - Fetch all conversations for user
   - `getConversationWithMessages()` - Get full conversation with messages
   - `addMessage()` - Save message to database
   - `updateConversationTitle()` - Update conversation title
   - `deleteConversation()` - Delete conversation
   - `generateTitleFromMessage()` - Auto-generate title from first message

2. **`src/app/conversations/page.tsx`** - Conversation history page
   - View all past conversations
   - Delete conversations
   - Navigate to specific conversation
   - Professional grid layout

### Modified Files:

1. **`src/app/ask-ai/page.tsx`** - Enhanced with persistence
   - Saves every user and AI message to database
   - Creates conversation automatically on first message
   - Auto-generates title from first message
   - Shows conversation history sidebar
   - Can toggle between conversations
   - Delete conversations from sidebar
   - "New Chat" button to start fresh

## Features Implemented

✅ **Automatic Conversation Creation**

- New conversation created on first message
- Auto-generated title from first user message
- Associated with current user

✅ **Message Persistence**

- Every user message saved to database
- Every AI response saved to database
- Timestamp tracking
- Proper role identification

✅ **Conversation History**

- View all past conversations
- Sort by most recent first
- Shows creation and update dates
- One-click navigation to any conversation

✅ **Conversation Management**

- Delete conversations (with confirmation)
- View conversation list in sidebar
- Active conversation highlighting
- Quick "New Chat" button

✅ **Database Security**

- Row Level Security enabled
- Users can only see their own conversations
- Cascade delete for messages when conversation deleted
- Proper foreign key constraints

✅ **User Experience**

- Sticky navigation bars
- Smooth transitions
- Professional UI/UX
- Responsive design
- Toast notifications for actions

## How It Works

1. **User clicks "Ask AI"** → App loads conversation history
2. **User types first message** → New conversation created automatically
3. **Message sent** → Saved to database before API call
4. **AI responds** → Response saved to database
5. **All messages persist** → Can view anytime
6. **Click "History"** → Toggle sidebar with past conversations
7. **Click "New Chat"** → Start fresh conversation
8. **Navigate between conversations** → Load previous messages

## API Integration

The system works seamlessly with your existing `/api/ask-ai` endpoint:

- Messages are saved before API call (to preserve them even if API fails)
- Both user and AI messages are stored
- Error messages are also saved
- Conversation metadata auto-updates

## Frontend Components

### Ask AI Page (`/ask-ai`)

- Chat interface with persistence
- Conversation history sidebar
- New chat button
- Delete conversation from sidebar
- Auto-save all messages

### Conversations Page (`/conversations`)

- Full conversation list
- Professional card layout
- Delete with confirmation
- Direct navigation to chat
- Empty state messaging

## Notes

- Messages are saved to database, not just in component state
- Conversation titles auto-generated but can be customized later
- Cascade delete ensures no orphaned messages
- Row-level security ensures privacy
- Suitable for production use

## Next Steps (Optional Enhancements)

- [ ] Edit conversation titles
- [ ] Export conversations to PDF
- [ ] Share conversations (with permission)
- [ ] Pin favorite conversations
- [ ] Search conversations by title/content
- [ ] Archive old conversations
- [ ] Bulk delete conversations
- [ ] Conversation analytics/stats
