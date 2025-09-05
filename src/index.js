const mongoose = require('mongoose');
// const http = require('http');
const https = require('https');
const fs = require('fs');
const WebSocket = require('ws');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const MessageHandlers = require('./websocket/messageHandlers');
const { connectDB } = require('./database');

// Import WebSocket logic
let server;

const privateKey = fs.readFileSync('./ssl/privkey.pem', 'utf8');
const certificate = fs.readFileSync('./ssl/fullchain.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Tạo HTTP server từ Express app
// const httpServer = http.createServer(app);
const httpServer = https.createServer(credentials, app);

// === WEBSOCKET SERVER SETUP ===
const wss = new WebSocket.Server({ server: httpServer });

// Danh sách các client kết nối theo clientId
const clients = new Map();

// Initialize message handlers
const messageHandlers = new MessageHandlers(clients, broadcast, broadcastClientCount);

wss.on('connection', function connection(ws, request) {
  console.log('Có client mới kết nối từ:', request.socket.remoteAddress);

  // Chưa có clientId, sẽ được gán khi đăng ký
  ws.clientId = null;

  // Gửi thông báo chào mừng
  ws.send(
    JSON.stringify({
      type: 'welcome',
      message: 'Chào mừng bạn đến với WebSocket Server! Vui lòng gửi tin nhắn register để đăng ký.',
      timestamp: new Date().toISOString(),
    })
  );

  // Xử lý tin nhắn từ client
  ws.on('message', function message(data) {
    try {
      const parsedData = JSON.parse(data);
      console.log('Nhận được tin nhắn:', parsedData);
      console.log(`Client hiện tại - Role: ${ws.role}, ID: ${ws.clientId}, Type: ${parsedData.type}`);

      // Xử lý các loại tin nhắn khác nhau
      console.log(`=== SWITCH CASE: ${parsedData.type} ===`);
      messageHandlers.handleMessage(ws, parsedData);
    } catch (error) {
      console.error('Lỗi khi xử lý tin nhắn:', error);
      ws.send(
        JSON.stringify({
          type: 'error',
          message: 'Định dạng tin nhắn không hợp lệ',
          timestamp: new Date().toISOString(),
        })
      );
    }
  });

  // Xử lý khi client ngắt kết nối
  ws.on('close', function close() {
    console.log('Client đã ngắt kết nối');
    if (ws.clientId) {
      clients.delete(ws.clientId);
      console.log(`Client ${ws.clientId} đã bị xóa khỏi danh sách`);
      // Gửi thông báo đến các client khác về clientId bị xóa
      broadcast({
        type: 'client_disconnected',
        clientId: ws.clientId,
        message: `Client ${ws.clientId} đã ngắt kết nối`,
        timestamp: new Date().toISOString(),
      });
    }
    broadcastClientCount();
  });

  // Xử lý lỗi
  ws.on('error', function error(err) {
    console.error('Lỗi WebSocket:', err);
    if (ws.clientId) {
      clients.delete(ws.clientId);
    }
  });
});

// === WEBSOCKET UTILITY FUNCTIONS ===
function broadcast(message, excludeClientId = null) {
  const messageString = JSON.stringify(message);
  clients.forEach(function each(client, clientId) {
    if (client.readyState === WebSocket.OPEN && clientId !== excludeClientId) {
      client.send(messageString);
    }
  });
}

function broadcastClientCount() {
  const connectedClients = Array.from(clients.keys());

  broadcast({
    type: 'clientCount',
    total: clients.size,
    connectedClients,
    timestamp: new Date().toISOString(),
  });
}

// === EXPRESS + WEBSOCKET SERVER STARTUP ===
mongoose.connect(config.mongoose.url, config.mongoose.options).then(async () => {
  logger.info('Connected to MongoDB');

  // Kết nối đến MongoDB cho native driver
  await connectDB();
  logger.info('Connected to MongoDB (Native Driver)');

  server = httpServer.listen(config.port, () => {
    logger.info(`Server running on port ${config.port}`);
    logger.info(`Express API: https://localhost:${config.port}/api`);
    logger.info(`WebSocket: wss://localhost:${config.port}`);
    logger.info(`Swagger: http://localhost:${config.port}/api-docs`);
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});

// Export WebSocket functions để sử dụng trong controllers
module.exports = {
  broadcast,
  broadcastClientCount,
  clients,
};
