# Smart Bookmark App

A simple bookmark manager built with Next.js, Supabase, and Tailwind CSS.
This application allows users to log in using Google, manage private bookmarks, and experience real-time updates across multiple tabs.

## Live Demo

**Vercel URL:**  
https://smart-bookmarks-app-neon.vercel.app/

**GitHub Repository:**  
[https://github.com/your-username/smart-bookmarks](https://github.com/Sharanumesta/Smart_Bookmarks_App)


## Tech Stack

- **Next.js (App Router)**
- **Supabase**
  - Authentication (Google OAuth)
  - PostgreSQL Database
  - Realtime subscriptions
- **Tailwind CSS**
- **Vercel** (Deployment)


## Features

- Google OAuth login (no email/password login)
- Add bookmarks (title + URL)
- Delete bookmarks
- Bookmarks are private to each user
- Real-time updates across multiple tabs
- Deployed and production-ready


## Authentication

Authentication is implemented using Supabase Google OAuth.

- Users sign in using their Google account.
- Sessions persist across refresh.
- No email/password authentication is implemented.


## Database Design

Table: `bookmarks`

| Column      | Type        | Description                      |
|------------|------------|----------------------------------|
| id         | uuid       | Primary key                      |
| title      | text       | Bookmark title                   |
| url        | text       | Bookmark URL                     |
| user_id    | uuid       | Linked to authenticated user     |
| created_at | timestamp  | Creation time                    |


## Data Privacy (Row Level Security)

Row Level Security (RLS) ensures:

- Users can only view their own bookmarks
- Users can only insert bookmarks for themselves
- Users can only delete their own bookmarks

Example policy logic:
``` auth.uid() = user_id ```

This guarantees complete user data isolation.

## Realtime Implementation

Realtime updates are implemented using Supabase Postgres change subscriptions.

- The app subscribes to database changes.
- When a bookmark is added or deleted in one tab,
  it updates automatically in other open tabs.
- No manual refresh is required.


## Deployment

The application is deployed on **Vercel**.

Environment variables configured:

``` 
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

OAuth redirect URLs were configured in both:
- Supabase Dashboard
- Google Cloud Console

## Challenges Faced & Solutions

### 1. OAuth Redirecting to Localhost After Deployment
**Issue:** After deployment, login redirected to `localhost`.  
**Cause:** Supabase Site URL was still set to local environment.  
**Solution:** Updated the Site URL and Redirect URLs in Supabase authentication settings.


### 2. Realtime Subscription Errors
**Issue:** Realtime subscription returned `CHANNEL_ERROR`.  
**Cause:** RLS and replication configuration needed adjustment.  
**Solution:** Verified publication settings, replica identity, and RLS policies.


### 3. Login Flash on Page Refresh
**Issue:** Login screen briefly appeared before session loaded.  
**Solution:** Added proper loading state before rendering authenticated UI.


### 4. UI Shifting on Form Errors
**Issue:** Layout shifted when validation errors appeared.  
**Solution:** Adjusted layout structure and spacing to prevent UI jumps.


## How To Run Locally

1. Clone the repository

```bash
git clone https://github.com/Sharanumesta/Smart_Bookmarks_App.git
```
2. Install dependencies

```
npm install
```
3. Create a .env.local file and add:
env
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```
4. Run the development server
```
npm run dev
```

## Conclusion

### This project demonstrates:
- Secure Google OAuth authentication
- Private user data using Row Level Security
- Realtime synchronization across tabs
- Full-stack deployment using modern tools
- The application meets all the requirements specified in the assignment.

### Thank you.
