import jwt from "jsonwebtoken";

export const generateToken = (userId,res)=>{
 const token = jwt.sign({userId},process.env.JWT_SECRET,{
    expiresIn: '7d' // token expires in 1 hour
 })
 res.cookie("jwt",token,{
    maxAge: 7*24*60*60*1000, //ms
    httpOnly: true, // not accessible via JavaScript
    sameSite:"strict",
    secure: process.env.NODE_ENV !== "development", // only set cookie if in production environment
 });
 return token;
}