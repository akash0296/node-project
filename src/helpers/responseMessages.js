//responseMessages.js

exports.errorMessages = {
	routeNotFound: {
		code: 'Resource Not Found',
		message: 'Resource Not Found.',
	},
	internalServerError: {
		code: 'Internal Server Error',
		message: 'Internal Server Error.',
	},
	noPostDataProvided: {
		code: 'Bad Request',
		message: 'No Data Was Posted.',
	},
	invalidDataProvided: (msg = 'Invalid Data') => {
		return {
			code: 'Bad Request',
			message: msg,
		}
	},
	unauthorizedAccess: {
		code: 'Unauthorized',
		message: 'Permission denied',
	},
}
