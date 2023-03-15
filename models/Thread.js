import { Schema, model } from 'mongoose'

const ThreadSchema = new Schema({
  title: {type: String, required: true},
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  project: {type: Schema.Types.ObjectId, ref: 'Project'}
}, {timestamps: true})

const Thread = model('Thread', ThreadSchema)
export default Thread
