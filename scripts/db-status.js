// MongoDB Connection Status Monitor
const mongoose = require('mongoose');

// Function to check MongoDB connection status
function checkMongoDBStatus() {
  const readyState = mongoose.connection.readyState;
  const status = getConnectionStatusText(readyState);
  const isConnected = readyState === 1;
  
  // Get additional connection details if connected
  let details = {};
  if (isConnected) {
    try {
      const db = mongoose.connection.db;
      
      // Get model counts if possible
      let modelCounts = {};
      try {
        // Get a count of documents for each model
        const modelNames = Object.keys(mongoose.models);
        for (const modelName of modelNames) {
          try {
            const count = mongoose.models[modelName].estimatedDocumentCount();
            modelCounts[modelName] = count;
          } catch (e) {
            // Skip if we can't get count for this model
          }
        }
      } catch (e) {
        // Skip model counts if there's an error
      }
      
      details = {
        host: mongoose.connection.host,
        name: mongoose.connection.name,
        port: mongoose.connection.port,
        models: Object.keys(mongoose.models).length,
        modelNames: Object.keys(mongoose.models),
        connectionOptions: mongoose.connection._connectionOptions || {},
        serverStatus: db.serverConfig.isConnected() ? 'Connected' : 'Disconnected',
        modelCounts
      };
    } catch (error) {
      details = { error: 'Could not retrieve connection details', message: error.message };
    }
  } else {
    // Include connection options even when disconnected
    try {
      details = {
        connectionOptions: mongoose.connection._connectionOptions || {}
      };
    } catch (error) {
      details = { error: 'Could not retrieve connection options' };
    }
  }
  
  return {
    isConnected,
    status,
    readyState,
    details,
    timestamp: new Date().toISOString(),
    lastError: mongoose.connection.lastError ? {
      message: mongoose.connection.lastError.message,
      time: mongoose.connection.lastError.time
    } : null
  };
}

// Helper function to get connection status text
function getConnectionStatusText(readyState) {
  switch (readyState) {
    case 0:
      return 'Disconnected';
    case 1:
      return 'Connected';
    case 2:
      return 'Connecting';
    case 3:
      return 'Disconnecting';
    default:
      return 'Unknown';
  }
}

// Function to attempt reconnection to MongoDB
async function reconnectMongoDB() {
  try {
    // Close existing connection if any
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    
    // Get connection URI from environment
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MongoDB URI not found in environment variables');
    }
    
    // Attempt to reconnect
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 15000,
      serverSelectionTimeoutMS: 15000
    });
    
    return {
      success: true,
      message: 'Reconnection successful',
      status: checkMongoDBStatus()
    };
  } catch (error) {
    return {
      success: false,
      message: `Reconnection failed: ${error.message}`,
      error: error.message
    };
  }
}

// Export the functions
module.exports = { checkMongoDBStatus, reconnectMongoDB };