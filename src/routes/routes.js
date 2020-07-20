// routes.js

const express = require('express')
const router = new express.Router()
const summaryRoutes = require('./summaryRoutes')

// summary maker document routes
router.use('/summary', summaryRoutes)

module.exports = router
