const express = require('express')
const router = new express.Router()
const dependencies = require('./routesDependencies').default

//swagger definition for success response.
/**
 * @swagger
 *  definitions:
 *   Success:
 *    type: object
 *    properties:
 *     success:
 *      type: boolean
 *      default: true
 *     error:
 *      type: string
 *      default: 'null'
 *     data:
 *      type: string
 *      description: Either object or Array.
 */

//swagger definition for error response.
/**
 * @swagger
 * definitions:
 *  Error:
 *   type: object
 *   properties:
 *    success:
 *     type: boolean
 *     default: false
 *    error:
 *     type: object
 *     properties:
 *      code:
 *       type: string
 *      message:
 *       type: string
 *    data:
 *      type: string
 *      default: 'null'
 *
 */

/**
 * @swagger
 *  /summary/users/{userId}/documents/{documentId}:
 *  get:
 *    security:
 *     - bearerAuth: []
 *    tags:
 *      - SM - Documents
 *    name: Documents
 *    summary: Fetch a particular document
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: userId
 *        in: path
 *        required:
 *          - userId
 *      - name: documentId
 *        in: path
 *        required:
 *          - documentId
 *    responses:
 *      200:
 *        description: Fetched a document successfully.
 *        $ref: '#/definitions/Success'
 *      404:
 *        description: Specified document doesnt exists.
 *        $ref: '#/definitions/Error'
 *      500:
 *        description: Internal server error.
 *        $ref: '#/definitions/Error'
 */
router.get(
	'/users/:userId/documents/:documentId',
	dependencies.smDocument.fetchDocument
)

/**
 * @swagger
 *  /summary/users/{userId}/documents/:
 *  get:
 *    security:
 *     - bearerAuth: []
 *    tags:
 *      - SM - Documents
 *    name: Documents
 *    summary: Fetch all the documents of a particular user
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: userId
 *        in: path
 *        required:
 *          - userId
 *      - name: paginate
 *        in: query
 *      - name: page
 *        in: query
 *      - name: limit
 *        in: query
 *    responses:
 *      200:
 *        description: Fetched all the documents successfully.
 *        $ref: '#/definitions/Success'
 *      403:
 *        description: Access forbidden.
 *        $ref: '#/definitions/Error'
 *      400:
 *        description: Invalid patch data provided.
 *        $ref: '#/definitions/Error'
 *      500:
 *        description: Internal server error.
 *        $ref: '#/definitions/Error'
 */
router.get(
	'/users/:userId/documents',
	dependencies.smDocument.fetchAllDocumentsByUser
)

/**
 * @swagger
 *  /summary/documents/{documentId}/blocks/{blockId}/content:
 *  get:
 *    security:
 *     - bearerAuth: []
 *    tags:
 *      - SM - Documents
 *    name: Documents
 *    summary: Fetch content elements of a particular document
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: documentId
 *        in: path
 *        required:
 *          - documentId
 *      - name: blockId
 *        in: path
 *        required:
 *          - blockId
 *    responses:
 *      200:
 *        description: Fetched content elements successfully.
 *        $ref: '#/definitions/Success'
 *      404:
 *        description: Specified document doesnt exists.
 *        $ref: '#/definitions/Error'
 *      500:
 *        description: Internal server error.
 *        $ref: '#/definitions/Error'
 */
router.get(
	'/documents/:documentId/blocks/:blockId/content',
	dependencies.smDocument.fetchBlockContent
)

/**
 * @swagger
 * /summary/users/{userId}/documents/{documentId}:
 *  patch:
 *    security:
 *     - bearerAuth: []
 *    tags:
 *      - SM - Documents
 *    name: Documents
 *    summary: Update a document
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: Body Data
 *        in: body
 *        schema:
 *          type: object
 *          properties:
 *            name:
 *              type: string
 *            description:
 *              type: string
 *            variables:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  _id:
 *                    type: string
 *                  value:
 *                    type: object
 *                    properties:
 *                      type:
 *                        type: string
 *                      content:
 *                        type: string
 *        required:
 *          -Body Data
 *      - name: userId
 *        in: path
 *        required:
 *          -userId
 *      - name: documentId
 *        in: path
 *        required:
 *          -documentId
 *    responses:
 *      200:
 *        description: Succesfully updated a document.
 *        $ref: '#/definitions/Success'
 *      400:
 *        description: Invalid patch data provided.
 *        $ref: '#/definitions/Error'
 *      404:
 *        description: Specified document not found.
 *        $ref: '#/definitions/Error'
 *      500:
 *        description: Internal server error.
 *        $ref: '#/definitions/Error'
 */
router.patch(
	'/users/:userId/documents/:documentId',
	dependencies.smDocument.updateDocument
)

module.exports = router
