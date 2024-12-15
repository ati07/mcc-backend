import mongoose from 'mongoose';

const schedulesSchema = mongoose.Schema({
    addedBy:  {type:mongoose.Types.ObjectId} , // Reference to Users collection
    employees: [],
    scheduleDatetime: {type: Date },
    comment: {type:String},
    status: {type:String,default:'pending'}, // e.g., "pending", "completed"
    isDelete:{ type: Boolean, default: false }
},
{ timestamps: true }
)
const Schedules = mongoose.model('schedules', schedulesSchema);
export default Schedules;