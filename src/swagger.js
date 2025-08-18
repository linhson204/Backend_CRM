const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Backend CRM API',
      version: '1.0.0',
      description: 'API tài liệu cho hệ thống Backend CRM',
    },
    servers: [
      {
        url: 'http://localhost:4000/api', // URL API backend của bạn
      },
    ],
  },
  apis: ['./src/routes/**/*.js', './src/controllers/**/*.js', './src/routes/*.js', './src/controllers/*.js'], // nơi chứa annotation Swagger
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };
