const WebSocket = require('ws');

class MessageHandlers {
  constructor(clients, broadcast, broadcastClientCount) {
    this.clients = clients;
    this.broadcast = broadcast;
    this.broadcastClientCount = broadcastClientCount;
  }

  // Generate utility functions
  generateClientId() {
    return `client_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
  }

  generatePostId() {
    return `post_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
  }

  // Send error message helper
  sendError(ws, message) {
    ws.send(
      JSON.stringify({
        type: 'error',
        message,
        timestamp: new Date().toISOString(),
      })
    );
  }

  // Send success confirmation helper
  sendSuccess(ws, type, message, additionalData = {}) {
    ws.send(
      JSON.stringify({
        type: `${type}_sent`,
        message,
        timestamp: new Date().toISOString(),
        ...additionalData,
      })
    );
  }

  // Check if target client exists and is open
  getTargetClient(targetId) {
    const client = this.clients.get(targetId);
    return client && client.readyState === WebSocket.OPEN ? client : null;
  }

  // Handler for 'chat' messages
  handleChat(ws, parsedData) {
    this.broadcast({
      type: 'chat',
      message: parsedData.message,
      sender: parsedData.sender || 'Anonymous',
      timestamp: new Date().toISOString(),
    });
  }

  // Handler for 'register' messages
  handleRegister(ws, parsedData) {
    ws.clientId = parsedData.clientId || this.generateClientId();
    this.clients.set(ws.clientId, ws);
    console.log(`Client đã đăng ký với ID: ${ws.clientId}`);

    ws.send(
      JSON.stringify({
        type: 'registered',
        clientId: ws.clientId,
        message: `Đã đăng ký thành công với clientId: ${ws.clientId}`,
        timestamp: new Date().toISOString(),
      })
    );

    this.broadcastClientCount();

    const registerTargetClient = this.getTargetClient(parsedData.to);
    if (registerTargetClient) {
      const registerData = {
        type: 'online',
        facebookId: parsedData.clientId,
        message: 'Đã online',
        timestamp: new Date().toISOString(),
      };
      console.log('Tin nhắn gửi đi', registerData);
      registerTargetClient.send(JSON.stringify(registerData));
      console.log(`Đã gửi đến client ${parsedData.to}`);
    } else {
      this.sendError(ws, `Client ${parsedData.to} không tồn tại hoặc không online`);
    }
  }

  // Handler for 'new_post' messages
  handleNewPost(ws, parsedData) {
    if (!parsedData.to) {
      this.sendError(ws, 'Vui lòng chỉ định clientId đích trong trường "to"');
      return;
    }

    const postTargetClient = this.getTargetClient(parsedData.to);
    if (postTargetClient) {
      const postData = {
        type: 'new_post',
        postId: parsedData.postId || this.generatePostId(),
        content: parsedData.content,
        attachments: parsedData.attachments || [],
        authorId: parsedData.authorId || ws.clientId,
        authorName: parsedData.authorName || 'Anonymous',
        from: ws.clientId,
        timestamp: new Date().toISOString(),
        metadata: parsedData.metadata || {},
      };

      console.log('Tin nhắn sẽ gửi:', postData);
      postTargetClient.send(JSON.stringify(postData));

      this.sendSuccess(ws, 'post', `Post đã được gửi thành công đến ${parsedData.to}`, {
        postId: postData.postId,
      });

      console.log(`Post từ ${ws.clientId} đã được gửi đến ${parsedData.to}`);
    } else {
      this.sendError(ws, `Client ${parsedData.to} không tồn tại hoặc không online`);
    }
  }

  handleNewPostGroup(ws, parsedData) {
    if (!parsedData.to) {
      this.sendError(ws, 'Vui lòng chỉ định clientId đích trong trường "to"');
      return;
    }

    const postGroupTargetClient = this.getTargetClient(parsedData.to);
    if (postGroupTargetClient) {
      const postGroupData = {
        type: 'post_to_group',
        postId: parsedData.postId || this.generatePostId(),
        content: parsedData.content,
        attachments: parsedData.attachments || [],
        from: ws.clientId,
        timestamp: new Date().toISOString(),
      };

      console.log('Tin nhắn sẽ gửi:', postGroupData);
      postGroupTargetClient.send(JSON.stringify(postGroupData));

      this.sendSuccess(ws, 'post', `Post đã được gửi thành công đến ${parsedData.to}`, {
        postId: postGroupData.postId,
      });

      console.log(`Post từ ${ws.clientId} đã được gửi đến ${parsedData.to}`);
    } else {
      this.sendError(ws, `Client ${parsedData.to} không tồn tại hoặc không online`);
    }
  }

  // Generic handler for comment-like messages
  handleCommentType(ws, parsedData, messageType = 'comment') {
    console.log(`Xử lý ${messageType} từ client: ${ws.clientId}`);

    if (!parsedData.to) {
      this.sendError(ws, 'Vui lòng chỉ định clientId đích trong trường "to"');
      return;
    }

    const targetClient = this.getTargetClient(parsedData.to);
    if (targetClient) {
      const commentData = {
        type: messageType,
        postId: parsedData.postId,
        content: parsedData.content,
        attachments: parsedData.attachments || [],
        authorId: parsedData.authorId || ws.clientId,
        authorName: parsedData.authorName || 'Anonymous',
        URL: parsedData.URL || '',
        from: ws.clientId,
        timestamp: new Date().toISOString(),
        metadata: parsedData.metadata || {},
        // Additional fields for specific message types
        ...(parsedData.linkUserComment && { linkUserComment: parsedData.linkUserComment }),
        ...(parsedData.commentFbId && { commentFbId: parsedData.commentFbId }),
        ...(parsedData.id_facebookComment && { commentFbId: parsedData.id_facebookComment }),
      };

      if (messageType === 'comment_byB') {
        console.log('comment_byB gửi sang A:', commentData);
      }

      targetClient.send(JSON.stringify(commentData));
      console.log(`Đã gửi ${messageType} đến client ${parsedData.to}`);

      this.sendSuccess(ws, 'comment', `${messageType} đã được gửi thành công đến ${parsedData.to}`, {
        postId: commentData.postId,
      });

      console.log(`${messageType} từ ${ws.clientId} đã được gửi đến ${parsedData.to}`);
    } else {
      this.sendError(ws, `Client ${parsedData.to} không tồn tại hoặc không online`);
    }
  }

  // Handler for URL_post messages
  handleUrlPost(ws, parsedData) {
    console.log(`Xử lý URL_post từ client: ${ws.clientId}`);

    if (!parsedData.to) {
      this.sendError(ws, 'Vui lòng chỉ định clientId đích trong trường "to"');
      return;
    }

    const urlTargetClient = this.getTargetClient(parsedData.to);
    if (urlTargetClient) {
      const URLData = {
        type: 'URL_post',
        URL: parsedData.URL || parsedData.linkURL,
        postId: parsedData.postId,
        authorName: parsedData.authorName || 'Anonymous',
        from: ws.clientId,
        timestamp: new Date().toISOString(),
      };
      console.log('Dữ liệu URL sẽ gửi:', URLData);

      urlTargetClient.send(JSON.stringify(URLData));
      console.log(`Đã gửi URL đến client ${parsedData.to}`);

      this.sendSuccess(ws, 'URL_post', `URL đã được gửi thành công đến ${parsedData.to}`, {
        URL: URLData.URL,
      });

      console.log(`URL từ ${ws.clientId} đã được gửi đến ${parsedData.to}`);
    } else {
      this.sendError(ws, `Client ${parsedData.to} không tồn tại hoặc không online`);
    }
  }

  // Generic handler for reply messages
  handleReplyType(ws, parsedData, messageType = 'reply_comment') {
    console.log(`Xử lý ${messageType} từ client: ${ws.clientId}`);

    if (!parsedData.to) {
      this.sendError(ws, 'Vui lòng chỉ định clientId đích trong trường "to"');
      return;
    }

    const targetClient = this.getTargetClient(parsedData.to);
    if (targetClient) {
      const replyData = {
        type: messageType,
        postId: parsedData.postId || this.generatePostId(),
        commentId: parsedData.commentId,
        replyId: parsedData.replyId,
        content: parsedData.content,
        attachments: parsedData.attachments || [],
        authorId: parsedData.authorId || ws.clientId,
        authorName: parsedData.authorName || 'Anonymous',
        URL: parsedData.URL,
        from: ws.clientId,
        timestamp: new Date().toISOString(),
        metadata: parsedData.metadata || {},
        // Additional fields for specific message types
        ...(parsedData.linkUserReply && { linkUserReply: parsedData.linkUserReply }),
        ...(parsedData.replyToAuthor && { replyToAuthor: parsedData.replyToAuthor }),
      };

      if (messageType === 'reply_comment_byB') {
        console.log('reply_comment_byB gửi sang A:', replyData);
      }

      targetClient.send(JSON.stringify(replyData));
      console.log(`Đã gửi ${messageType} đến client ${parsedData.to}`);

      this.sendSuccess(ws, 'reply_comment', `${messageType} đã được gửi thành công đến ${parsedData.to}`, {
        postId: replyData.postId,
        commentId: replyData.commentId,
      });

      console.log(`${messageType} từ ${ws.clientId} đã được gửi đến ${parsedData.to}`);
    } else {
      this.sendError(ws, `Client ${parsedData.to} không tồn tại hoặc không online`);
    }
  }

  // Generic handler for result messages
  handleResultType(ws, parsedData, messageType) {
    console.log(`Xử lý ${messageType} từ client: ${ws.clientId}`);
    console.log(`Dữ liệu ${messageType} nhận được:`, parsedData);

    if (!parsedData.to) {
      this.sendError(ws, 'Vui lòng chỉ định clientId đích trong trường "to"');
      return;
    }

    const targetClient = this.getTargetClient(parsedData.to);
    if (targetClient) {
      const resultData = {
        type: messageType,
        URL: parsedData.URL,
        status: parsedData.status,
        postId: parsedData.postId,
        authorName: parsedData.authorName,
        timestamp: new Date().toISOString(),
        from: ws.clientId,
        // Conditional fields based on message type
        ...(parsedData.content && { content: parsedData.content }),
        ...(parsedData.comment_id && { comment_id: parsedData.comment_id }),
        ...(parsedData.commentId && { commentId: parsedData.commentId }),
        ...(parsedData.replyId && { replyId: parsedData.replyId }),
        ...(parsedData.reply_to_reply_id && { replyId: parsedData.reply_to_reply_id }),
      };

      console.log(`Dữ liệu ${messageType} sẽ gửi:`, resultData);

      targetClient.send(JSON.stringify(resultData));
      console.log(`Đã gửi ${messageType} đến client ${parsedData.to}`);

      this.sendSuccess(ws, messageType, `${messageType} đã được gửi thành công đến ${parsedData.to}`);

      console.log(`${messageType} từ ${ws.clientId} đã được gửi đến ${parsedData.to}`);
    } else {
      this.sendError(ws, `Client ${parsedData.to} không tồn tại hoặc không online`);
    }
  }

  // Handler for crawl_comment messages
  handleCrawlComment(ws, parsedData) {
    console.log(`Xử lý crawl_comment từ client: ${ws.clientId}`);
    console.log('Dữ liệu crawl_comment nhận được:', parsedData);

    if (!parsedData.to) {
      this.sendError(ws, 'Vui lòng chỉ định clientId đích trong trường "to"');
      return;
    }

    const targetClient = this.getTargetClient(parsedData.to);
    if (targetClient) {
      const crawlData = {
        type: 'crawl_comment',
        status: parsedData.status,
        message: parsedData.message,
        postCount: parsedData.postCount,
        currentPost: parsedData.currentPost,
        timestamp: parsedData.timestamp,
        authorId: parsedData.authorId,
        from: ws.clientId,
        facebookId: parsedData.facebookId,
      };
      console.log(`Dữ liệu crawl_comment sẽ gửi:`, crawlData);

      targetClient.send(JSON.stringify(crawlData));
      console.log(`Đã gửi crawl_comment đến client ${parsedData.to}`);

      this.sendSuccess(ws, 'crawl_comment', `crawl_comment đã được gửi thành công đến ${parsedData.to}`);

      console.log(`crawl_comment từ ${ws.clientId} đã được gửi đến ${parsedData.to}`);
    } else {
      this.sendError(ws, `Client ${parsedData.to} không tồn tại hoặc không online`);
    }
  }

  // Handler for crawl_comment_by_CRM messages
  handleCrawlCommentByCRM(ws, parsedData) {
    console.log(`Xử lý crawl_comment_by_CRM từ client: ${ws.clientId}`);
    console.log('Dữ liệu crawl_comment_by_CRM nhận được:', parsedData);

    if (!parsedData.to) {
      this.sendError(ws, 'Vui lòng chỉ định clientId đích trong trường "to"');
      return;
    }

    const targetClient = this.getTargetClient(parsedData.to);
    if (targetClient) {
      const crawlData = {
        type: 'crawl_comment_by_CRM',
        authorId: parsedData.authorId,
        from: ws.clientId,
        facebookId: parsedData.facebookId,
      };
      console.log(`Dữ liệu crawl_comment_by_CRM sẽ gửi:`, crawlData);

      targetClient.send(JSON.stringify(crawlData));
      console.log(`Đã gửi crawl_comment_by_CRM đến client ${parsedData.to}`);

      this.sendSuccess(ws, 'crawl_comment_by_CRM', `crawl_comment_by_CRM đã được gửi thành công đến ${parsedData.to}`);

      console.log(`crawl_comment_by_CRM từ ${ws.clientId} đã được gửi đến ${parsedData.to}`);
    } else {
      this.sendError(ws, `Client ${parsedData.to} không tồn tại hoặc không online`);
    }
  }

  // Handler for unknown message types
  handleDefault(ws, parsedData) {
    ws.send(
      JSON.stringify({
        type: 'echo',
        originalMessage: parsedData,
        timestamp: new Date().toISOString(),
      })
    );
  }

  // Main message handler that routes to appropriate handlers
  handleMessage(ws, parsedData) {
    const handlers = {
      chat: () => this.handleChat(ws, parsedData),
      register: () => this.handleRegister(ws, parsedData),
      new_post: () => this.handleNewPost(ws, parsedData),
      comment: () => this.handleCommentType(ws, parsedData, 'comment'),
      comment_byB: () => this.handleCommentType(ws, parsedData, 'comment_byB'),
      URL_post: () => this.handleUrlPost(ws, parsedData),
      reply_comment: () => this.handleReplyType(ws, parsedData, 'reply_comment'),
      reply_comment_byB: () => this.handleReplyType(ws, parsedData, 'reply_comment_byB'),
      reply_reply_comment: () => this.handleReplyType(ws, parsedData, 'reply_reply_comment'),
      comment_result: () => this.handleResultType(ws, parsedData, 'comment_result'),
      reply_comment_result: () => this.handleResultType(ws, parsedData, 'reply_comment_result'),
      reply_reply_comment_result: () => this.handleResultType(ws, parsedData, 'reply_reply_comment_result'),
      crawl_comment: () => this.handleCrawlComment(ws, parsedData),
      crawl_comment_by_CRM: () => this.handleCrawlCommentByCRM(ws, parsedData),
      post_to_group: () => this.handleNewPostGroup(ws, parsedData),
    };

    const handler = handlers[parsedData.type] || (() => this.handleDefault(ws, parsedData));
    handler();
  }
}

module.exports = MessageHandlers;
