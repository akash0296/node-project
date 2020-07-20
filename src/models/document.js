const { Schema, model } = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const documentSchema = new Schema(
	{
		template: {
			type: Schema.Types.ObjectId,
			ref: 'template',
		},
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: 'user',
		},
		jsonObject: {
			_id: false,
			type: Object,
		},
	},
	{
		timestamps: true,
	}
)

documentSchema.plugin(mongoosePaginate)

module.exports = model('document', documentSchema)
