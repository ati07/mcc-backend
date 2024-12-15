import mongoose from 'mongoose';

const employeesSchema = mongoose.Schema({
    sno:{type: Number},
    addedBy:{type:mongoose.Types.ObjectId} ,
    name: { type: String },
    email: { type: String },
    isDelete: {type: Boolean, default: false},
    isActive: {type: Boolean, default: true},
},
{ timestamps: true }
)
const Employees = mongoose.model('employees', employeesSchema);
export default Employees;