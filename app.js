//app.js

const morgan = require('morgan')
const express = require('express')
const bodyParser = require('body-parser')
const compression = require('compression')
const helmet = require('helmet')
const swaggerUi = require('swagger-ui-express')
const logger = require('mongo-morgan-ext')
const responseTime = require('response-time')
const swaggerJsDoc = require('swagger-jsdoc')
const cors = require('cors')

const utils = require('./src/helpers/utils')
const { errorMessages } = require('./src/helpers/responseMessages')
const config = require('./src/config/config')
const routes = require('./src/routes/routes')
require('./src/initializeModels')
require('./src/config/dbConfig')
require('dotenv').config()

const app = express()

//app settings
app.use(helmet())
app.set('port', process.env.PORT || 5000)
app.disable('x-powered-by')
app.use(responseTime())
app.set('title', 'testing-api')
app.set('query parser', `extended`)

// CORS config
const accepatableReqMethods = [
	'POST',
	'GET',
	'OPTIONS',
	'HEAD',
	'PUT',
	'DELETE',
	'PATCH',
]

const corsOption = {
	origin: '*',
	optionsSuccessStatus: 200,
	methods: accepatableReqMethods,
	allowedHeaders: '*',
	preflightContinue: true,
}
app.use(cors(corsOption))
app.options('*', cors())

//config for API documentation powered by swagger ui.
const swaggerDefinition = config.swaggerDefinition
const swaggerOptions = config.swaggerOptions
const options = {
	swaggerDefinition,
	apis: ['./src/routes/*.js'],
}

const swaggerSpec = swaggerJsDoc(options)
app.use(
	'/api-docs',
	swaggerUi.serve,
	swaggerUi.setup(swaggerSpec, swaggerOptions)
)

//server logging
app.use(morgan(':method :url :date :remote-addr :status :response-time'))
app.use(logger(config.db.url + config.db.name, 'logs'))

//Parsing requests with payload limit
const payloadLimit = '50mb'
app.use(bodyParser.json({ limit: payloadLimit }))
app.use(
	bodyParser.urlencoded({
		limit: payloadLimit,
		extended: true,
	})
)

//compression middleware
app.use(compression())

//Registering application routes
app.use('/api', routes)

//handling invalid/not-found routes
app.use('/', function (req, res) {
	res.status(404).send(utils.responseMsg(errorMessages.routeNotFound))
})

//Application level error handling
app.use(function (error, req, res, next) {
	console.log('Logged:: err', error.name)
	if (error.message === 'Permission denied') {
		res.status(403).send({
			success: false,
			error: {
				code: 'Forbidden',
				message: err.message,
			},
		})
	} else if (error.name === 'UnauthorizedError') {
		res.status(401).send({
			success: false,
			error: {
				code: 'Unauthorized',
				message: err.message,
			},
		})
	} else {
		console.log('Error: ', error)
		res
			.status(error.status || 500)
			.send(utils.responseMsg(errorMessages.internalServerError))
	}
})

app.listen(app.get('port'), () => {
	console.log(`Server successfully started at port:${app.get('port')}`)
})

module.exports = app
