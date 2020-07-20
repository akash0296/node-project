const fs = require('fs')
const modelsDir = [`${__dirname}/models`]

modelsDir.forEach(dir => {
	fs.readdirSync(dir).forEach(file => {
		require(`${dir}/${file}`)
	})
})
