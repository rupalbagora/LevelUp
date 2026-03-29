import jwt from "jsonwebtoken"

const protect =  (req,res,next) => {
  // let token ;
  let token = req.cookies.token;

  if (
    req.headers.authorization && req.headers.authorization.startsWith ("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    // console.log(token)
  }
  if(!token) {
    return res.status(401).json({message:"Not authorized, no token"});
  }

  try{
    //  console.log("JWT_SECRET:", process.env.JWT_SECRET);
    //  console.log("TOKEN:", token);
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  }
   catch(error){
    console.error("JWT VERIFY ERROR:", error.message);
    res.status(401).json({message:"Not authorized, invalid token"});
   }
}

export default protect;