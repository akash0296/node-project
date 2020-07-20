const chai = require('chai')
const chaiHttp = require('chai-http')

const server = require('../app')
const documentData = require('./__mockData__/summaryMakerDocument.json')
const accessToken = process.env.ACCESS_TOKEN

const { expect } = chai
chai.use(chaiHttp)

describe('Summary Maker - Document', () => {
	let documentId = null
	let resData = null
	const { userId, blockId } = documentData

	describe('/POST - Documents', () => {
		it('Should create a document successfully', done => {
			chai
				.request(server)
				.post(`/api/summary/users/${userId}/documents`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send(documentData.document)
				.end((error, result) => {
					if (error) {
						console.log(error)
						done()
					}
					expect(result.statusCode).to.equal(200)
					resData = result.body.data
					documentId = resData._id
					done()
				})
		})

		it('Should create a document with correct name and description', done => {
			expect(resData.name).to.equal(documentData.document.name)
			expect(resData.description).to.equal(documentData.document.description)
			done()
		})
	})

	describe('/GET - Documents', () => {
		it('Should fetch a document successfully', done => {
			chai
				.request(server)
				.get(`/api/summary/users/${userId}/documents/${documentId}`)
				.set('Authorization', `Bearer ${accessToken}`)
				.end((error, result) => {
					if (error) {
						console.log(error)
						done()
					}
					expect(result.statusCode).to.equal(200)
					resData = result.body.data
					documentId = resData._id
					done()
				})
		})

		it('Should fetch all the documents successfully', done => {
			chai
				.request(server)
				.get(`/api/summary/users/${userId}/documents/`)
				.set('Authorization', `Bearer ${accessToken}`)
				.end((error, result) => {
					if (error) {
						console.log(error)
						done()
					}
					expect(result.statusCode).to.equal(200)
					done()
				})
		})
	})

	describe('/GET - Content Elements', () => {
		it('Should fetch all content elements associated with a content block successfully', done => {
			chai
				.request(server)
				.get(`/api/summary/documents/${documentId}/blocks/${blockId}/content`)
				.set('Authorization', `Bearer ${accessToken}`)
				.end((error, result) => {
					if (error) {
						console.log(error)
						done()
					}
					expect(result.statusCode).to.equal(200)
					done()
				})
		})
	})
})
