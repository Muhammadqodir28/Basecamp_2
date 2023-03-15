import { Schema, model } from 'mongoose'

const AttachmentSchema = new Schema({
  attachment: {type: String, required: true},
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  project: {type: Schema.Types.ObjectId, ref: 'Project'}
}, {timestamps: true})

const Attachment = model('Attachment', AttachmentSchema)
export default Attachment

