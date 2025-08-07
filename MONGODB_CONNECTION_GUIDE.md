# MongoDB Connection Guide

## Recent Changes to Improve Connection Stability

We have made several improvements to the MongoDB connection handling in this application to prevent connection timeouts and disconnections:

1. **Increased Connection Timeouts**:
   - `connectTimeoutMS`: Increased from 15000ms to 30000ms
   - `serverSelectionTimeoutMS`: Increased from 15000ms to 30000ms
   - Added `socketTimeoutMS`: 45000ms

2. **Connection Keepalive**:
   - Added keepAlive settings to maintain persistent connections
   - Implemented a periodic ping (every 60 seconds) to prevent idle connection timeouts

3. **Mongoose Version**:
   - Downgraded to Mongoose 7.5.0 which has better connection stability

## Troubleshooting MongoDB Connection Issues

If you experience MongoDB connection issues, try the following steps:

### 1. Check IP Whitelist in MongoDB Atlas

Ensure your current IP address is whitelisted in MongoDB Atlas:

1. Log in to MongoDB Atlas
2. Go to Network Access in the Security section
3. Add your current IP address or use 0.0.0.0/0 for development (not recommended for production)

### 2. Verify Connection String

Check that your connection string in the `.env` file is correct:

```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

Make sure there are no special characters in the password that need URL encoding.

### 3. Check for Network Issues

- Ensure your internet connection is stable
- Check if any firewall or VPN is blocking MongoDB connections
- Try connecting from a different network

### 4. Monitor Connection Status

The application includes a built-in connection monitoring system:

- Check the server logs for connection status messages
- Use the `/api/db-status` endpoint to check the current connection status
- If you're an admin, you can use the `/api/db-reconnect` endpoint to manually trigger a reconnection

### 5. Restart the Server

If all else fails, try restarting the server:

```
node server.js
```

## Connection Retry Mechanism

The application includes an automatic retry mechanism that will:

1. Attempt to connect to MongoDB up to 5 times
2. Wait 5 seconds between retry attempts
3. Automatically reconnect if the connection is lost
4. Periodically ping the database to keep the connection alive

If all connection attempts fail, the application will run in frontend-only mode with limited functionality.