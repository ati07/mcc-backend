import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const validateUser = async (data) => {
  let sendRes = {
    error: true
  }

  try {
    let findUser = {
      email: data.email
    }
    // let populate = data.populate ? { path: 'clientId', model: 'clients' } : ""
    const userDetails = await User.findOne(findUser)

    // if (!userDetails) {
    //   return { ...sendRes, message: 'User not found' }
    // }

    // if (!userDetails.isActive || userDetails.isBlock) {
    //   return { ...sendRes, message: 'User is not allowed to access, contact administrator.' }
    // }
    return { error: false, userDetails };

  } catch (error) {
    console.log("Error in validating user", error)
    return { ...sendRes, message: "Error in validating user..." }
  }
}


const auth = async (req, res, next) => {
  try {
    req.auth = {}

    const token = req?.headers?.authorization.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token found!',
      });
    }

    const verifyOptions = {
      issuer: "Authorization",
      subject: "iam@user.me",
      audience: "cbpro",
      expiresIn: "36h", // 36 hrs validity
      algorithm: "HS256"
    };

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET, verifyOptions);

    const { id, name, role, email } = decodedToken;


    let userData = await validateUser(decodedToken);

    if (userData.error) {
      console.log("Errroooooomid....", userData);
      return res.status(401).json({
        success: false,
        message: "Authentication failed at Lv1!",
      });
    }
    let userDetails = JSON.parse(JSON.stringify(userData.userDetails));
    req.auth.user = userDetails
    delete req.auth.user.password

    console.log("Authentication successful!");
    next();
  } catch (error) {
    console.log("errorauth", error);
    res.status(401).json({
      success: false,
      message: 'Authentication failed at Lv2!',
    });
  }
};

export default auth;
