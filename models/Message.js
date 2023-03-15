import { Schema, model } from 'mongoose'

const MessageSchema = new Schema({
  title: {type: String, required: true},
  description: {type: String, required: true},
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  project: {type: Schema.Types.ObjectId, ref: 'Project'}
}, {timestamps: true})

const Message = model('Message', MessageSchema)
export default Message
