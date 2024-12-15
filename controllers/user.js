import User from '../models/user.js';
import tryCatch from './utils/tryCatch.js';
import bcrypt from 'bcryptjs';

export const addUser= tryCatch(async (req, res) => {
  let userBook = req.body
  // userBook.addedBy = req.auth.user._id

  const existingEmail = await User.find({ email: req.body.email });
  // console.log('existingMerchant',existingMerchant)
  if (existingEmail.length) {
    return res.status(400).json({ success: true, message: `Email is alrady existed` });
  }

  const hashedPassword = await bcrypt.hash(userBook.password, 12);
  userBook.password = hashedPassword
  const newUser = new User(userBook);
  await newUser.save()
  res.status(200).json({ success: true, message: 'User added successfully' });
});


export const getUsers = tryCatch(async (req, res) => {
  let findUsers = {
    isDelete: false
  }
  

  const users = await User.find(findUsers).sort({ _id: -1 });
  
  res.status(200).json({ success: true, result: users });
});

export const deleteUser= tryCatch(async (req, res) => {
  let updateData = {
    $set: {isDelete:true}
  }
  let findUser={
    _id: req.params.userId
  }
  const { _id } = await User.updateOne(findUser,updateData);
  res.status(200).json({ success: true, message: 'User deleted successfully' });
});

export const editUserDetails = tryCatch(async (req, res) => {
 let findUser= {_id : req.params.userId}
 
 if(req.body.password){
  req.body.password = await bcrypt.hash(req.body.password, 12);
 }
 let updateUser =  { $set : req.body }
  
  await User.updateOne(findUser, updateUser);
   
  let message = 'User edited successfully'
  if(req.body.isActive  || !req.body.isActive){
    message = 'User status update successfully'
  }else if(req.body.isBlock || !req.body.isBlock){
    message = `User ${req.body.isBlock ? 'Block' :'Unblock'} update successfully`
  }
  res.status(200).json({ success: true, message: message  });
});