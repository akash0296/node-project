const mongoose = require('mongoose')

const config = require('./config')

const DB_URL = `${config.db.url}${config.db.name}`

mongoose.connect(DB_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	config: {
		autoIndex: false,
	},
})

mongoose.connection.on('connected', function () {
	console.log('databse connected to ' + DB_URL)
})

mongoose.connection.on('error', function (err) {
	console.log('databse connection encountered error: ' + err)
})

mongoose.connection.on('disconnected', function () {
	console.log('database disconnected')
})

process.on('SIGINT', function () {
	db.close(function () {
		console.log('database disconnected by the app')
		process.exit(0)
	})
})

exports.default = mongoose.connection
