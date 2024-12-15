'use strict';

const authenticateRoles = function(roles){

    return function(req, res,next){
        if(roles.includes(req.auth.user.role)){
            next();
        }else{
            return res.status(403).send({
                message: "Not Allowed.",
                success: false
            });
        }
  
    }
}

export default authenticateRoles;