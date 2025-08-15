const express = require('express');
const websocketService = require('../../services/websocket.service');
const auth = require('../../middlewares/auth');

const router = express.Router();

// Lấy danh sách users online
router.get('/online-users', auth(), (req, res) => {
  const onlineUsers = websocketService.getOnlineUsers();
  res.json({
    total: onlineUsers.length,
    users: onlineUsers,
  });
});

// Gửi message tới user cụ thể
router.post('/send-message', auth(), (req, res) => {
  const { clientId, message } = req.body;

  if (!clientId || !message) {
    return res.status(400).json({ error: 'clientId and message are required' });
  }

  const sent = websocketService.sendToUser(clientId, {
    type: 'private_message',
    message,
    from: req.user.id,
    timestamp: new Date().toISOString(),
  });

  if (sent) {
    res.json({ success: true, message: 'Message sent successfully' });
  } else {
    res.status(404).json({ error: 'User not found or offline' });
  }
});

module.exports = router;
