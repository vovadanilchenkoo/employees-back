require('dotenv').config()
require('./globals')()

const Server = require('./core/Server')
const controllers = require('./controllers')
const config = require('./config')
const middlewares = require('./middlewares')
const errorMiddleware = require('./middlewares/errorMiddleware')

new Server({
  port: config.app.port,
  host: config.app.host,
  controllers,
  middlewares,
  errorMiddleware,
  knexConfig: config.knex
}).then(serverParams => {
  __logger.info('Server initialized...', serverParams)
  __logger.info('App config:', config.app)
  __logger.info('DB config:', config.knex)
}).catch(error => __logger.error('Server fails to initialize...', error))
