const axios = require('axios');
const FormData = require('form-data');
const { getCollection } = require('../database');

require('dotenv').config();

const apiKey = process.env.X_API_KEY;
const API_URL = 'http://123.24.206.25:5000';

// 1. API BÌNH LUẬN
const getCommentData = async (req, res) => {
  try {
    const { timestart, group_name, timeend = 0, limit = 0, page = 1 } = req.body;

    const formData = new FormData();
    if (timestart) formData.append('timestart', timestart);
    if (group_name) formData.append('group_name', group_name);
    formData.append('timeend', timeend);
    formData.append('limit', limit);
    formData.append('page', page);

    const response = await axios.post(`${API_URL}/get_comment_data`, formData, {
      headers: {
        ...formData.getHeaders(),
        'X-API-Key': apiKey,
      },
    });

    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(err.response?.status || 500).json({
      error: err.response?.data || 'Internal server error',
    });
  }
};

// 3. API KPI
const updateKpi = async (req, res) => {
  try {
    const { user_id, kpi_type, kpi_value } = req.body;

    const formData = new FormData();
    if (user_id) formData.append('user_id', user_id);
    if (kpi_type) formData.append('kpi_type', kpi_type);
    if (kpi_value) formData.append('kpi_value', kpi_value);

    const response = await axios.post(`${API_URL}/update_kpi`, formData, {
      headers: {
        ...formData.getHeaders(),
        'X-API-Key': apiKey,
      },
    });

    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(err.response?.status || 500).json({
      error: err.response?.data || 'Internal server error',
    });
  }
};

// 5. API CÂU HỎI NHÓM KÍN
const answerQuestion = async (req, res) => {
  try {
    const { group_link, question, answer } = req.body;

    const formData = new FormData();
    if (group_link) formData.append('group_link', group_link);
    if (question) formData.append('question', question);
    if (answer) formData.append('answer', answer);

    const response = await axios.post(`${API_URL}/answer_question`, formData, {
      headers: {
        ...formData.getHeaders(),
        'X-API-Key': apiKey,
      },
    });

    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(err.response?.status || 500).json({
      error: err.response?.data || 'Internal server error',
    });
  }
};

const getQuestionData = async (req, res) => {
  try {
    const { status, group_name, limit = 0, page = 1 } = req.body;

    const formData = new FormData();
    if (status) formData.append('status', status);
    if (group_name) formData.append('group_name', group_name);
    formData.append('limit', limit);
    formData.append('page', page);

    const response = await axios.post(`${API_URL}/get_question_data`, formData, {
      headers: {
        ...formData.getHeaders(),
        'X-API-Key': apiKey,
      },
    });

    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(err.response?.status || 500).json({
      error: err.response?.data || 'Internal server error',
    });
  }
};

// 6. API LỆNH TOOL
const sendCommand = async (req, res) => {
  try {
    const { type, params, user_id, crm_id } = req.body;
    console.log('type:', type);
    console.log('params:', params);
    console.log('user_id:', user_id);
    console.log('crm_id:', crm_id);

    if (params) {
      try {
        JSON.parse(params); // validate JSON string
      } catch (e) {
        return res.status(400).json({ error: "Field 'params' must be a valid JSON string" });
      }
    }

    const formData = new FormData();
    formData.append('type', type);
    if (user_id) formData.append('user_id', user_id);
    if (params) formData.append('params', params);
    if (crm_id) formData.append('crm_id', crm_id);

    const response = await axios.post(`${API_URL}/send_command`, formData, {
      headers: {
        ...formData.getHeaders(),
        'X-API-Key': apiKey,
      },
    });

    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(err.response?.status || 500).json({
      error: err.response?.data || 'Internal server error',
    });
  }
};

// 7. API NHÓM
const getGroupsData = async (req, res) => {
  try {
    const { group_name, limit = 15, page = 1 } = req.body;
    console.log('group_name:', group_name);
    console.log('limit:', limit);
    console.log('page:', page);

    const formData = new FormData();
    if (group_name) formData.append('group_name', group_name);
    formData.append('limit', limit);
    formData.append('page', page);

    const response = await axios.post(`${API_URL}/get_groups_data`, formData, {
      headers: {
        ...formData.getHeaders(),
        'X-API-Key': apiKey,
      },
    });

    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(err.response?.status || 500).json({
      error: err.response?.data || 'Internal server error',
    });
  }
};

// Download file

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Không nhận được file' });
    }

    const apiUrl = `${API_URL}/upload_file`;

    const formData = new FormData();
    formData.append('user_id', req.body.user_id);
    formData.append('file', req.file.buffer, req.file.originalname);

    const response = await axios.post(apiUrl, formData, {
      headers: {
        ...formData.getHeaders(),
        'X-API-Key': apiKey,
      },
    });

    res.json(response.data);
  } catch (err) {
    console.error('Upload error:', err.message);

    if (err.response) {
      // Lỗi từ server bên thứ 3
      return res.status(err.response.status).json({
        error: err.response.data,
      });
    }

    // Lỗi trong code Node.js của bạn
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const getFile = async (req, res) => {
  try {
    const apiUrl = `${API_URL}/get_file`;

    const payload = {
      // user_id: req.body.user_id || '*',
      file_name: req.body.file_name || '*',
      // file_ext: req.body.file_ext || '*',
    };
    const formData = new FormData();
    formData.append('file_name', req.body.file_name);
    console.log(req.body.file_name);

    // gọi sang API thứ 3, nhận về stream
    const response = await axios.post(apiUrl, formData, {
      responseType: 'stream',
      headers: {
        ...formData.getHeaders(),
        'X-API-Key': apiKey,
      },
    });

    // forward header từ API bên kia xuống client
    if (response.headers['content-type']) {
      res.setHeader('Content-Type', response.headers['content-type']);
    }
    if (response.headers['content-disposition']) {
      res.setHeader('Content-Disposition', response.headers['content-disposition']);
    }

    // pipe thẳng file về client
    response.data.pipe(res);
  } catch (err) {
    console.error('Get file error:', err.message);

    if (err.response) {
      console.error('Third-party API error:', err.response.status, err.response.statusText);
      res.status(err.response.status).json({ error: err.response.statusText });
    } else if (err.request) {
      res.status(502).json({ error: 'No response from third-party API' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

// Lấy dữ liệu trong database

const getCommandDataBase = async (req, res) => {
  // const result = getCollection('Commands');
  const result = await getCollection('Commands').find({}).toArray();
  res.json(result);
};

const getBaiDangDataBase = async (req, res) => {
  const result = await getCollection('Bai-dang').find({}).toArray();
  res.json(result);
};

module.exports = {
  getCommentData,
  updateKpi,
  answerQuestion,
  getQuestionData,
  sendCommand,
  getGroupsData,
  uploadFile,
  getFile,
  getCommandDataBase,
  getBaiDangDataBase,
};
