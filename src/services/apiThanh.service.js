const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
const config = require('../config/config');
require('dotenv').config();

const apiKey = process.env.X_API_KEY;
const API_URL = 'http://192.168.0.123:5000';

// 1. API BÌNH LUẬN
const getCommentData = async (req, res) => {
  try {
    const { timestart, group_name, timeend = 0, limit = 0, page = 1 } = req.query;

    const response = await axios.post(
      `${API_URL}/get_comment_data?timestart=${timestart}&group_name=${group_name}&limit=${limit}&timeend=${timeend}&page=${page}`,
      {},
      {
        headers: {
          'X-API-Key': apiKey,
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//3. API KPI
const updateKpi = async (req, res) => {
  try {
    const { user_id, kpi_type, kpi_value } = req.query;

    const response = await axios.post(
      `${API_URL}/update_kpi?user_id=${user_id}&kpi_type=${kpi_type}&kpi_value=${kpi_value}`,
      {},
      {
        headers: {
          'X-API-Key': apiKey,
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 5. API CÂU HỎI NHÓM KÍN
const answerQuestion = async (req, res) => {
  try {
    const { group_link, question, answer } = req.query;

    const response = await axios.post(
      `${API_URL}/answer_question?group_link=${group_link}&question=${question}&answer=${answer}`,
      {},
      {
        headers: {
          'X-API-Key': apiKey,
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getQuestionData = async (req, res) => {
  try {
    const { status, group_name, limit = 0, page = 1 } = req.query;

    const response = await axios.post(
      `${API_URL}/get_question_data?status=${status}&group_name=${group_name}&limit=${limit}&page=${page}`,
      {},
      {
        headers: {
          'X-API-Key': apiKey,
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//6. API LỆNH TOOL
const sendCommand = async (req, res) => {
  try {
    const { type, params } = req.query;

    const response = await axios.post(
      `${API_URL}/send_command?type=${type}&params=${params}`,
      {},
      {
        headers: {
          'X-API-Key': apiKey,
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//7. API NHÓM

const getGroupsData = async (req, res) => {
  try {
    const { group_name, limit = 0, page = 1 } = req.query;

    const response = await axios.post(
      `${API_URL}/get_groups_data?group_name=${group_name}&limit=${limit}&page=${page}`,
      {},
      {
        headers: {
          'X-API-Key': apiKey,
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Download file

const uploadFile = async (req, res) => {
  try {
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
    console.error(err.message);
    res.status(500).json({ error: 'Upload thất bại' });
  }
};

const getFile = async (req, res) => {
  try {
    const apiUrl = `${API_URL}/upload_file`;

    const response = await axios.post(apiUrl, req.body, {
      responseType: 'stream', // vì API trả về ZIP
      headers: {
        'X-API-Key': apiKey,
      },
    });

    res.setHeader('Content-Disposition', 'attachment; filename=files.zip');
    response.data.pipe(res);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Download thất bại' });
  }
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
};
