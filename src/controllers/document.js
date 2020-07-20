//controllers/document.js

const mongoose = require('mongoose')
const joi = require('@hapi/joi')
const { omit, get } = require('lodash')

const errorMsg = require('../helpers/responseMessages').errorMessages
const { response, checkIfDataExists } = require('../helpers/utils')

/**
 * @name fetchDocument
 * @description Fetch a particular document
 */
exports.fetchDocument = async (req, res) => {
	try {
		const { userId, documentId } = req.params

		const documentDetails = await mongoose
			.model('document')
			.findOne({
				createdBy: userId,
				_id: documentId,
			})
			.populate({
				path: 'template',
			})
			.select('-__v')
			.lean()

		if (!checkIfDataExists(documentDetails)) {
			return res.status(404).send(
				response({
					error: errorMsg.invalidDataProvided(
						'Specified document doesnt exists'
					),
				})
			)
		}

		const templateData = documentDetails.template.jsonObject
		const documentData = documentDetails.jsonObject

		// Map document and template variables
		if (checkIfDataExists(templateData.variables)) {
			documentDetails.variables = templateData.variables.map(variable => {
				return {
					...variable,
					...(documentData.variables
						? documentData.variables.find(val => {
								return val._id.toString() == variable._id.toString()
						  })
						: []),
				}
			})
		}

		documentDetails.name = documentData.name
		documentDetails.description = documentData.description
		documentDetails.blocks = documentData.blocks
		documentDetails.template = {
			_id: documentDetails.template._id,
			name: templateData.name,
		}

		res.status(200).send(
			response({
				success: true,
				data: omit(documentDetails, ['__v', 'jsonObject']),
			})
		)
	} catch (error) {
		console.error('error', error.stack)
		res.status(500).send(
			response({
				error: errorMsg.internalServerError,
			})
		)
	}
}

/**
 * @name fetchAllDocumentsByUser
 * @description Fetch all the documents created by an user
 */
exports.fetchAllDocumentsByUser = async (req, res) => {
	try {
		const { userId } = req.params

		if (userId !== req.user.id) {
			return res.status(403).send(
				response({
					error: errorMsg.unauthorizedAccess,
				})
			)
		}

		const { page, limit, paginate } = req.query

		const schema = joi.object().keys({
			paginate: joi
				.boolean()
				.only('true', 'false')
				.error(new Error('Invalid value provided for field paginate')),
			page: joi.when('paginate', {
				is: 'true',
				then: joi
					.number()
					.required()
					.error(new Error('Invalid value provided for field page')),
				otherwise: joi.number(),
			}),
			limit: joi.when('paginate', {
				is: 'true',
				then: joi
					.number()
					.required()
					.error(new Error('Invalid value provided for field limit')),
				otherwise: joi.number(),
			}),
			userId: joi
				.string()
				.error(new Error('Invalid value provided for field userId')),
		})

		const result = joi.validate(
			{
				page,
				limit,
				paginate,
				userId,
			},
			schema
		)

		if (result.error) {
			return res.status(400).send(
				response({
					error: errorMsg.invalidDataProvided(result.error.message),
				})
			)
		}

		const query = {
			createdBy: userId,
		}

		const options = {
			select: '-__v',
			populate: {
				path: 'template',
				select: 'jsonObject',
			},
			sort: '-updatedAt',
			page: paginate === 'true' ? page : 1,
			limit:
				paginate === 'true'
					? limit
					: await mongoose
							.model('document')
							.find({ createdBy: userId })
							.countDocuments(),
		}

		let documents = await mongoose.model('document').paginate(query, options)

		documents = documents.docs.map(document => {
			const templateDetails = document.template.jsonObject
			const documentDetails = document.jsonObject
			let doc = omit(document.toObject(), 'jsonObject', 'template')

			return {
				...doc,
				name: documentDetails.name,
				description: documentDetails.description,
				template: {
					name: templateDetails.name,
					_id: document.template._id,
				},
			}
		})

		res.status(200).send(
			response({
				paginated: paginate,
				data: documents,
				success: true,
			})
		)
	} catch (error) {
		console.error('error', error.stack)
		res.status(500).send(
			response({
				error: errorMsg.internalServerError,
			})
		)
	}
}

/**
 * @name fetchBlockContent
 * @description Fetch content elements of a specific content block
 */
exports.fetchBlockContent = async (req, res) => {
	try {
		const { documentId, blockId } = req.params

		const documentDetails = await mongoose
			.model('document')
			.findOne({
				_id: documentId,
			})
			.lean()

		if (!checkIfDataExists(documentDetails)) {
			return res.status(404).send(
				response({
					error: errorMsg.invalidDataProvided(
						'Provided documentId doesnt exists'
					),
				})
			)
		}

		let documentData = documentDetails.jsonObject
		const targetBlock = documentData.blocks
			? documentData.blocks[
					Object.keys(documentData.blocks).find(
						block => documentData.blocks[block]._id == blockId
					)
			  ]
			: null

		if (!checkIfDataExists(targetBlock)) {
			return res.status(404).send(
				response({
					error: errorMsg.invalidDataProvided('Provided blockId doesnt exists'),
				})
			)
		}

		const contentElements = targetBlock.contentElements
			? targetBlock.contentElements.map(element => {
					return {
						_id: element._id,
						name: element.name,
						url: get(element, 'thumbnailLocation.url'),
						size: element.size,
						type: element.type,
						layout: element.layout,
					}
			  })
			: []

		res.status(200).send(
			response({
				success: true,
				data: contentElements,
			})
		)
	} catch (error) {
		console.error('error', error.stack)
		res.status(500).send(
			response({
				error: errorMsg.internalServerError,
			})
		)
	}
}

/**
 * @name updateDocument
 * @description Updates a specific document
 */
exports.updateDocument = async (req, res) => {
	try {
		const { userId, documentId } = req.params

		if (!checkIfDataExists(req.body)) {
			return res.status(400).send(
				response({
					error: errorMsg.noPostDataProvided,
				})
			)
		}

		if (userId !== req.user.id) {
			return res.status(403).send(
				response({
					error: errorMsg.unauthorizedAccess,
				})
			)
		}

		const { name, description, variables } = req.body

		const schema = joi.object().keys({
			name: joi
				.string()
				.error(new Error('Invalid value provided for field "name"')),
			description: joi
				.string()
				.error(new Error('Invalid value provided for field "description"')),
			variables: joi
				.array()
				.items(
					joi.object().keys({
						_id: joi
							.string()
							.error(
								new Error('Invalid value provided for field "variables.id"')
							),
						value: joi
							.object()
							.error(
								new Error('Invalid value provided for field "variables.value"')
							),
					})
				)
				.error(new Error('Invalid value provided for field "variables"')),
		})

		const result = joi.validate(
			{
				name,
				description,
				variables,
			},
			schema
		)

		if (result.error) {
			return res.status(400).send(
				response({
					error: errorMsg.invalidDataProvided(result.error.message),
				})
			)
		}

		const documentDetails = await mongoose
			.model('document')
			.findOne({
				_id: documentId,
				createdBy: userId,
			})
			.populate({
				path: 'template',
				select: 'jsonObject',
			})
			.lean()

		if (!checkIfDataExists(documentDetails)) {
			return res.status(404).send(
				response({
					error: errorMsg.invalidDataProvided(
						'Provided documentId doesnt exists'
					),
				})
			)
		}

		const documentData = documentDetails.jsonObject
		const templateData = documentDetails.template.jsonObject

		// Map template and document variables
		let updatedVariables
		if (variables) {
			const updatedIds = variables.map(variable => variable._id.toString())
			const templateVariables = templateData.variables
				? templateData.variables.map(variable => variable._id.toString())
				: []

			if (!updatedIds.every(id => templateVariables.includes(id))) {
				return res.status(400).send(
					response({
						error: errorMsg.invalidDataProvided('Invalid variable id provided'),
					})
				)
			}

			updatedVariables = [
				...documentData.variables.filter(
					({ _id }) => !updatedIds.includes(_id.toString())
				),
				...variables,
			]
		}

		let jsonObject = {
			...documentData,
			name: name || documentData.name,
			description: description || documentData.description,
			variables: updatedVariables || documentData.variables,
		}

		const updatedDocument = await mongoose.model('document').findOneAndUpdate(
			{
				_id: documentId,
			},
			{
				$set: {
					jsonObject,
				},
			},
			{
				fields: { __v: 0 },
				new: true,
			}
		)

		res.status(200).send(
			response({
				success: true,
				data: {
					...omit(updatedDocument.toObject(), 'jsonObject'),
					...jsonObject,
				},
			})
		)
	} catch (error) {
		console.error('error', error.stack)
		res.status(500).send(
			response({
				error: errorMsg.internalServerError,
			})
		)
	}
}
