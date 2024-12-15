import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import tryCatch from './utils/tryCatch.js';
import {validateUser} from '../middleware/auth.js';
import User from '../models/user.js';

export const login = tryCatch(async (req, res) => {

  const { email, password } = req.body;
  // console.log(email,password,req.body)
  let payload = {...req.body, populate: true };
  let userData = await validateUser(payload);

  if (userData.error) {
    console.log("Errroooooologin....", userData);
    return res.status(401).json({
      success: false,
      message: userData.message,
    });
  }

  let userDetails = userData.userDetails

  // const userDetails = await User.findOne({ email: email.toLowerCase() });

  const correctPassword = await bcrypt.compare(password, userDetails.password);

  if (!correctPassword) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const { _id: id, name, phone, role, isActive, createdAt, userEmail } = userDetails;

  const signOptions = {
    issuer: "Authorization",
    subject: "iam@user.me",
    audience: "cbpro",
    expiresIn: "36h", // 36 hrs validity
    algorithm: "HS256"
  };

  const token = jwt.sign({ id, name, role, email }, process.env.JWT_SECRET, signOptions);

  res.status(200).json({
    success: true,
    result: { id, name, email: email,phone, token, isActive, createdAt },
  });
});

export const signup = tryCatch(async(req,res) =>{
  // User registration logic goes here
  // You can use bcrypt for password hashing and jwt for generating tokens
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
})



// export const blockUser = tryCatch(async (req, res) => {
//   const { role, isActive } = req.body;
//   await User.findByIdAndUpdate(req.params.userId, { isActive });
//   res.status(200).json({ success: true, message: 'user edited successfully' });
// });