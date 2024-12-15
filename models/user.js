import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    name: {type: String},
    email: {type: String,required: true,unique: true},
    role: {type: String},
    password: {type: String},
    isDelete: {type: Boolean, default: false},
    isActive: {type: Boolean, default: true},
},
{ timestamps: true }
)
const Users = mongoose.model('users', userSchema);
export default Users;