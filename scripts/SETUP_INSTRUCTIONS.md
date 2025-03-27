# PrimePlus+ Setup Instructions

## Quick Start Guide

1. **Install Dependencies**:
   ```bash
   # Backend
   cd C:\Projects\primePlus-clean\backend
   npm install

   # Frontend
   cd C:\Projects\primePlus-clean\frontend
   npm install
   ```

2. **Start the Application**:
   ```bash
   # Start both backend and frontend
   cd C:\Projects\primePlus-clean
   start-all.bat
   ```

3. **Access the Application**:
   - Open your browser to http://localhost:3000

## Accessing the New UI

The application now features a completely redesigned UI based on OnlyFans:

1. **Landing Page**:
   - Clean, minimal login screen like OnlyFans
   - Use the credentials you've set up previously

2. **User Dashboard**:
   - Infinite scroll feed with content from creators
   - Sidebar navigation (סרגל כלים) for easy access to all features
   - "NEW POST" button for creating content

3. **Creator Dashboard**:
   - For testing, you can use the "Promote to Creator" button on the dashboard
   - This will update your role without needing backend changes
   - Once promoted, you'll have access to creator features

## Testing Different User Roles

To test different user experiences:

1. **Regular User**:
   - Log in with a standard user account
   - You'll see the user dashboard with content feed
   - Option to upgrade to creator

2. **Creator**:
   - Click "Promote to Creator" button on dashboard
   - After page refresh, you'll have creator role
   - Access creator dashboard at /creator
   - Edit profile at /creator/profile
   - Adjust settings at /creator/settings
   - View analytics at /creator/analytics

## Troubleshooting

If you encounter any issues:

- Check the console for errors
- Ensure both backend and frontend servers are running
- Clear browser localStorage if login issues occur
- Use the debug overlay to check your current role
