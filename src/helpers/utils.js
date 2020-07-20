//utils.js

/**
 * @description Pass any data, this util will determine if it is empty or not. for fasy values it returns false.
 * @param  {Any} data data to be checked against
 * @return {Boolean}
 */
exports.checkIfDataExists = data => {
	let flagDataExists = false
	if (data === 0 ? '0' : data) {
		switch (data.constructor) {
			case Object:
				flagDataExists = !!Object.keys(data).length
				break
			case Array:
				flagDataExists = !!data.length
				break
			default:
				flagDataExists = true
				break
		}
	}
	return flagDataExists
}

/**
 * @name response
 * @description this function is responsible for grooming the response that is to be returned from the server.
 */
exports.response = ({
	error = null,
	success = false,
	data = null,
	paginated,
}) => {
	const responseData = {
		success: success,
		error,
		data: data,
	}

	if (error) {
		return responseData
	}

	if (typeof paginated === 'boolean' ? paginated : paginated === 'true') {
		responseData.data = data.docs
		responseData.totalDocs = data.totalDocs
		responseData.limit = data.limit
		responseData.page = data.page
		responseData.totalPages = data.totalPages
		responseData.hasPrevPage = data.hasPrevPage
		responseData.hasNextPage = data.hasNextPage
		responseData.prevPage = data.prevPage
		responseData.nextPage = data.nextPage
	} else {
		responseData.data = data.docs || data
	}

	return responseData
}
