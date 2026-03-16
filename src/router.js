const _ = require('lodash');
const express = require('express');
const render = require('./http/render-http');
const config = require('./config');
const logger = require('./util/logger')(__filename);
const { renderQuerySchema, renderBodySchema, sharedQuerySchema } = require('./util/validation');

function validate(schema) {
  return (req, res, next) => {
    if (schema.query) {
      const { error } = schema.query.validate(req.query, { allowUnknown: false });
      if (error) {
        const err = new Error(error.details.map(d => d.message).join(', '));
        err.status = 400;
        return next(err);
      }
    }
    if (schema.body) {
      const { error } = schema.body.validate(req.body, { allowUnknown: false });
      if (error) {
        const err = new Error(error.details.map(d => d.message).join(', '));
        err.status = 400;
        return next(err);
      }
    }
    return next();
  };
}

function createRouter() {
  const router = express.Router();

  if (!_.isEmpty(config.API_TOKENS)) {
    logger.info('x-api-key authentication required');

    router.use('/*', (req, res, next) => {
      const userToken = req.headers['x-api-key'];
      if (!_.includes(config.API_TOKENS, userToken)) {
        const err = new Error('Invalid API token in x-api-key header.');
        err.status = 401;
        return next(err);
      }

      return next();
    });
  } else {
    logger.warn('Warning: no authentication required to use the API');
  }

  const getRenderSchema = { query: renderQuerySchema };
  router.get('/api/render', validate(getRenderSchema), render.getRender);

  const postRenderSchema = { body: renderBodySchema, query: sharedQuerySchema };
  router.post('/api/render', validate(postRenderSchema), render.postRender);

  router.get('/healthcheck', (req, res) => res.status(200).send('OK'));

  return router;
}

module.exports = createRouter;
