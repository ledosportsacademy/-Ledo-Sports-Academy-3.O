// Database Status Indicator Component

// Create the status indicator element
function createDbStatusIndicator() {
  const statusIndicator = document.createElement('div');
  statusIndicator.id = 'db-status-indicator';
  statusIndicator.className = 'db-status-indicator';
  statusIndicator.innerHTML = `
    <div class="db-status-icon"></div>
    <div class="db-status-text">Checking database...</div>
    <div class="db-status-details hidden"></div>
    <button class="db-status-toggle" title="Toggle details">ⓘ</button>
  `;
  
  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .db-status-indicator {
      position: fixed;
      bottom: 10px;
      right: 10px;
      background-color: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 4px;
      padding: 8px 12px;
      display: flex;
      align-items: center;
      font-size: 12px;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
      flex-wrap: wrap;
      max-width: 300px;
    }
    
    .db-status-icon {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      margin-right: 8px;
      background-color: #6c757d; /* Default gray */
    }
    
    .db-status-icon.connected {
      background-color: #28a745; /* Green */
    }
    
    .db-status-icon.disconnected {
      background-color: #dc3545; /* Red */
    }
    
    .db-status-icon.connecting {
      background-color: #ffc107; /* Yellow */
      animation: pulse 1.5s infinite;
    }
    
    .db-status-text {
      flex-grow: 1;
    }
    
    .db-status-toggle {
      background: none;
      border: none;
      color: #6c757d;
      cursor: pointer;
      font-size: 14px;
      padding: 0;
      margin-left: 5px;
      transition: color 0.2s;
    }
    
    .db-status-toggle:hover {
      color: #0d6efd;
    }
    
    .db-status-details {
      width: 100%;
      margin-top: 8px;
      font-size: 11px;
      color: #6c757d;
      overflow-wrap: break-word;
      word-break: break-all;
    }
    
    .db-status-details.hidden {
      display: none;
    }
    
    .db-status-details table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .db-status-details table td {
      padding: 2px 0;
    }
    
    .db-status-details table td:first-child {
      font-weight: bold;
      width: 40%;
    }
    
    .db-status-details .success {
      color: #28a745;
      font-weight: bold;
      margin: 5px 0;
    }
    
    .db-status-details .error {
      color: #dc3545;
      font-weight: bold;
      margin: 5px 0;
    }
    
    .btn--small {
      padding: 4px 8px;
      font-size: 11px;
      border-radius: 3px;
      cursor: pointer;
      border: 1px solid #dee2e6;
      background-color: #f8f9fa;
      transition: all 0.2s;
    }
    
    .btn--outline {
      background-color: transparent;
      border: 1px solid #6c757d;
      color: #6c757d;
    }
    
    .btn--outline:hover {
      background-color: #6c757d;
      color: white;
    }
    
    .btn--primary {
      background-color: #0d6efd;
      border: 1px solid #0d6efd;
      color: white;
    }
    
    .btn--primary:hover {
      background-color: #0b5ed7;
      border-color: #0a58ca;
    }
    
    @keyframes pulse {
      0% { opacity: 0.6; }
      50% { opacity: 1; }
      100% { opacity: 0.6; }
    }
  `;
  
  document.head.appendChild(style);
  document.body.appendChild(statusIndicator);
  
  // Add toggle functionality
  const toggleButton = statusIndicator.querySelector('.db-status-toggle');
  const detailsElement = statusIndicator.querySelector('.db-status-details');
  
  toggleButton.addEventListener('click', () => {
    detailsElement.classList.toggle('hidden');
  });
  
  return statusIndicator;
}

// Format timestamp to local time
function formatTimestamp(timestamp) {
  if (!timestamp) return 'N/A';
  
  try {
    const date = new Date(timestamp);
    return date.toLocaleString();
  } catch (e) {
    return timestamp;
  }
}

// Update the status indicator based on database status
function updateDbStatusIndicator(status) {
  const indicator = document.getElementById('db-status-indicator') || createDbStatusIndicator();
  const iconElement = indicator.querySelector('.db-status-icon');
  const textElement = indicator.querySelector('.db-status-text');
  const detailsElement = indicator.querySelector('.db-status-details');
  
  // Remove all status classes
  iconElement.classList.remove('connected', 'disconnected', 'connecting');
  
  // Update based on status
  if (status.isConnected) {
    iconElement.classList.add('connected');
    textElement.textContent = 'Database: Connected';
  } else if (status.readyState === 2) {
    iconElement.classList.add('connecting');
    textElement.textContent = 'Database: Connecting...';
  } else {
    iconElement.classList.add('disconnected');
    textElement.textContent = `Database: ${status.status}`;
  }
  
  // Update details section
  let detailsHTML = '<table>';
  detailsHTML += `<tr><td>Status:</td><td>${status.status}</td></tr>`;
  detailsHTML += `<tr><td>Ready State:</td><td>${status.readyState}</td></tr>`;
  detailsHTML += `<tr><td>Last Check:</td><td>${formatTimestamp(status.timestamp)}</td></tr>`;
  
  // Add connection details if available
  if (status.isConnected && status.details) {
    const details = status.details;
    if (details.host) detailsHTML += `<tr><td>Host:</td><td>${details.host}</td></tr>`;
    if (details.name) detailsHTML += `<tr><td>Database:</td><td>${details.name}</td></tr>`;
    if (details.models) detailsHTML += `<tr><td>Models:</td><td>${details.models}</td></tr>`;
  }
  
  detailsHTML += '</table>';
  
  // Add retry button if disconnected
  if (!status.isConnected) {
    detailsHTML += '<button class="btn btn--small btn--outline" onclick="checkDbStatus(true)" style="margin-top: 5px; width: 100%;">Refresh Status</button>';
    
    // Add reconnect button for admins
    if (window.API && window.API.auth && window.API.auth.isAuthenticated()) {
      detailsHTML += '<button class="btn btn--small btn--primary" onclick="reconnectDatabase()" style="margin-top: 5px; width: 100%;">Reconnect Database</button>';
    }
  }
  
  detailsElement.innerHTML = detailsHTML;
}

// Check database status periodically
async function checkDbStatus(forceCheck = false) {
  try {
    // Show connecting state immediately on force check
    if (forceCheck) {
      const indicator = document.getElementById('db-status-indicator');
      if (indicator) {
        const iconElement = indicator.querySelector('.db-status-icon');
        const textElement = indicator.querySelector('.db-status-text');
        
        iconElement.classList.remove('connected', 'disconnected');
        iconElement.classList.add('connecting');
        textElement.textContent = 'Database: Connecting...';
      }
    }
    
    const status = await API.dbStatus.getStatus();
    updateDbStatusIndicator(status);
    
    // Return status for potential use elsewhere
    return status;
  } catch (error) {
    console.error('Error checking DB status:', error);
    updateDbStatusIndicator({ isConnected: false, status: 'Error', readyState: 0 });
    return { isConnected: false, status: 'Error', readyState: 0 };
  }
}

// Function to trigger a manual database reconnection
async function reconnectDatabase() {
  try {
    // Update indicator to show connecting state
    const indicator = document.getElementById('db-status-indicator');
    if (indicator) {
      const iconElement = indicator.querySelector('.db-status-icon');
      const textElement = indicator.querySelector('.db-status-text');
      const detailsElement = indicator.querySelector('.db-status-details');
      
      iconElement.classList.remove('connected', 'disconnected');
      iconElement.classList.add('connecting');
      textElement.textContent = 'Database: Reconnecting...';
      detailsElement.innerHTML = '<p>Attempting to reconnect to the database...</p>';
    }
    
    // Call the API to trigger reconnection
    const result = await API.dbStatus.reconnect();
    
    // Show result message
    if (indicator) {
      const detailsElement = indicator.querySelector('.db-status-details');
      if (result.success) {
        detailsElement.innerHTML = `<p class="success">Reconnection successful!</p>`;
      } else {
        detailsElement.innerHTML = `<p class="error">Reconnection failed: ${result.message}</p>`;
      }
    }
    
    // Refresh status after a short delay
    setTimeout(() => checkDbStatus(), 1000);
    
    return result;
  } catch (error) {
    console.error('Error during database reconnection:', error);
    
    // Update indicator to show error
    const indicator = document.getElementById('db-status-indicator');
    if (indicator) {
      const detailsElement = indicator.querySelector('.db-status-details');
      detailsElement.innerHTML = `<p class="error">Reconnection error: ${error.message || error}</p>`;
    }
    
    return { success: false, message: error.message || 'Unknown error during reconnection' };
  }
}

// Initialize the status indicator when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initial check
  checkDbStatus();
  
  // Check every 30 seconds
  setInterval(() => checkDbStatus(), 30000);
  
  // Make functions available globally
  window.checkDbStatus = checkDbStatus;
  window.reconnectDatabase = reconnectDatabase;
});