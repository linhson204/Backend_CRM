// Service để tương tác với WebSocket từ Express controllers
const getWebSocketService = () => {
  try {
    const { broadcast, broadcastClientCount, clients } = require('../index');
    return { broadcast, broadcastClientCount, clients };
  } catch (error) {
    console.warn('WebSocket service not available:', error.message);
    return {
      broadcast: () => console.log('WebSocket not initialized'),
      broadcastClientCount: () => console.log('WebSocket not initialized'),
      clients: new Map()
    };
  }
};

// Gửi thông báo khi có post mới
const notifyNewPost = (postData) => {
  const { broadcast } = getWebSocketService();
  broadcast({
    type: 'new_post_notification',
    data: postData,
    timestamp: new Date().toISOString()
  });
};

// Gửi thông báo khi có comment mới
const notifyNewComment = (commentData) => {
  const { broadcast } = getWebSocketService();
  broadcast({
    type: 'new_comment_notification',
    data: commentData,
    timestamp: new Date().toISOString()
  });
};

// Gửi thông báo tới user cụ thể
const sendToUser = (clientId, message) => {
  const { clients } = getWebSocketService();
  const client = clients.get(clientId);
  
  if (client && client.readyState === 1) { // WebSocket.OPEN = 1
    client.send(JSON.stringify(message));
    return true;
  }
  return false;
};

// Lấy danh sách users online
const getOnlineUsers = () => {
  const { clients } = getWebSocketService();
  return Array.from(clients.keys());
};

module.exports = {
  notifyNewPost,
  notifyNewComment,
  sendToUser,
  getOnlineUsers,
  broadcast: () => getWebSocketService().broadcast,
  clients: () => getWebSocketService().clients
};
