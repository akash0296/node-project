const jwtDecode = require('jwt-decode')

exports.getUserId = () => {
	const accessToken = process.env.ACCESS_TOKEN
	decodeToken = jwtDecode(accessToken)
	return decodeToken['sub'].split('|').pop()
}
