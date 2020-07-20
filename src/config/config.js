const mongoosePaginate = require('mongoose-paginate-v2')

mongoosePaginate.paginate.options = {
	limit: 1000,
}

const config = {}

config.db = {}
config.db.url = process.env.DB_URL || 'mongodb://localhost:27017/'
config.db.name = process.env.DB_NAME || 'test01'
config.client = process.env.CLIENT_URL || '*'

/* Swagger Definition */
config.swaggerDefinition = {
	info: {
		title: 'Test API Server',
		version: '1.0.1',
	},
	host: process.env.HOST || 'localhost:5000',
	basePath: '/api',
	securityDefinitions: {
		bearerAuth: {
			in: 'header',
			scheme: 'bearer',
			name: 'Authorization',
			type: 'apiKey',
		},
	},
}

config.swaggerOptions = {
	customSiteTitle: 'Node Test Project',
}

module.exports = config
