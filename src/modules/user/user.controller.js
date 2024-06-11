import { User } from "../../../DB/models/user.model.js"
import bcryptjs from 'bcryptjs'
import Crypto from 'crypto'
import { ResetPassTemp, SignUpTemp } from "../../../utils/generateHtml.js"
import { sendEmail } from "../../../utils/sendEmail.js"
import jwt from 'jsonwebtoken'
import { Token } from "../../../DB/models/token.model.js"
import randomString from 'randomstring'
import CartModel from "../../../DB/models/cart.model.js"
import { CatchError } from "../../../utils/catch_error.js"
export const register=async(req, res, next) =>{
    //data from request
const {Name,Email,Password,RePassword}= req.body
//check user existence
const Isuser=await User.findOne({Email})
if(Isuser){
    return next(new Error("This Email Is Already Exist",{cause:409}))
}
//hash password SALT_ROUND
const hashPassword=bcryptjs.hashSync(Password,Number(process.env.saltround))
// generate activationCode // or generate Email from token
const activationCode= Crypto.randomBytes(64).toString('hex')

//create user
const user=await User.create({Name,Email,Password:hashPassword,RePassword:hashPassword,activationCode})
//create confirmationLink
const link=`https://clean-green-agriculture.vercel.app/auth/confirmEmail/${activationCode}`;

// send email
const IsSent = await sendEmail({ to: Email, subject: "Activate Account", html: SignUpTemp(link) });

//send response
console.log(IsSent);

return IsSent? res.status(201).json({success:true,status:201,Message:"Please Review Your Email To Activate Your Account."}) : next(new Error("Something Went Wrong"))
}
//ActivationAccount
export const activationAccount = async (req, res, next) => {
    // Find user, delete the activationCode, update isConfirmed
   
    const check = await User.findOneAndUpdate({ activationCode: req.params.activationCode }, {
        IsConfirmed: true,
        $unset: { activationCode: 1 }
    });
    if(!check){
      return res.status(400).json({success:false,status:400,Message:"Not Found User or error activationCode or maybe your account activated before"});
    }
    const htmlResponse = `
    <html>
  <head>
    <link href="https://fonts.googleapis.com/css?family=Nunito+Sans:400,400i,700,900&display=swap" rel="stylesheet">
  </head>
    <style>
      body {
        text-align: center;
        padding: 40px 0;
        background: #EBF0F5;
      }
        h1 {
          color: #88B04B;
          font-family: "Nunito Sans", "Helvetica Neue", sans-serif;
          font-weight: 900;
          font-size: 40px;
          margin-bottom: 10px;
        }
        p {
          color: #404F5E;
          font-family: "Nunito Sans", "Helvetica Neue", sans-serif;
          font-size:20px;
          margin: 0;
        }
      i {
        color: #9ABC66;
        font-size: 100px;
        line-height: 200px;
        margin-left:-15px;
      }
      .card {
        background: white;
        padding: 60px;
        border-radius: 4px;
        box-shadow: 0 2px 3px #C8D0D8;
        display: inline-block;
        margin: 0 auto;
      }
    </style>
    <body>
      <div class="card">
      <div style="border-radius:200px; height:200px; width:200px; background: #F8FAF5; margin:0 auto;">
        <i class="checkmark">✓</i>
      </div>
        <h1>Success</h1> 
        <p>Your Account was activated!</p>
        <p>With Best Wishes: <br/>
        Clean And Green Website</p>
      </div>
    </body>
</html>
`;
    // Send HTML respons
    await CartModel.create({user:check._id})

   return res.status(200).header('Content-Type', 'text/html').send(htmlResponse);
    //  res.status(200).header('Content-Type', 'text/html').send(htmlResponse);
};

export const login=async(req,res,next)=>{
    // data from request
    const {Email,Password}=req.body
    // check user existence
    const user = await User.findOne({Email})
    if(!user){
        return next(new Error("Invalid Email",{cause:400}))
    }
    // check is confirmed
    if(!user.IsConfirmed){
        return next(new Error("UnActivated Account",{cause:400}))
  
    }
    // check password
    const match=bcryptjs.compareSync(Password,user.Password)
    if(!match){
        return next(new Error("Invalid Password",{cause:400}))
 
    }
    //genetate token
    const token =jwt.sign({id:user._id,email:user.Email},process.env.tokenkey,{
        expiresIn:'1d'
    })
    //save token in token model
    await Token.create({token,user:user._id,agent:req.headers["user-agent"]})
   
    //change user status to online and save user
    user.Status="online"
    await user.save()
    // send response
    return res.status(200).json({status:200,result:true,token})
}
//sendForgetCode
export const sendForgetCode=async(req,res,next)=>{
    // data from request
    const {Email}=req.body
    // check user existence
    const check = await User.findOne({Email})
    if(!check){
        return next(new Error("Invalid Email",{cause:400}))
    }
   //generate code
   const code=randomString.generate({
    length:5,
    charset:'numeric'
   })
    // save code in DB
    check.ForgetCode = code;
    await check.save()
    // send Email
    const IsSent = await sendEmail({ to: check.Email, subject: "Password Reset code", html: ResetPassTemp(code,check.Name) });
    IsSent? res.status(200).json({status:200,result:true,Message:"Check Your Emaill"}) :new Error("Bad Request When  Reset code",{cause:400})
    
}

//resetPassword

export const resetPassword=async(req, res, next) => {
    const {ForgetCode,Password,RePassword}=req.body;
  
    //check User
    const user=await User.findOne({ForgetCode})
    if(!user){
        return next(new Error("Invalid Code",{cause:400}));
    }
    // deleteing the code after succeeding the process
    const UpdateData= await User.findOneAndUpdate({ForgetCode},{$unset:{ForgetCode:1}})
    UpdateData.Password=bcryptjs.hashSync(Password,Number(process.env.saltround))
    UpdateData.RePassword=UpdateData.Password
    await UpdateData.save()
    // make the token not valid in other devices by making isValid:false to exist the user from app after change password
    const tokens=await Token.find({user:UpdateData._id})
     tokens.forEach(async (token)=>{
        token.isValid=false;
        await token.save()
     })

    // send response
    return res.status(200).json({status:200,result:true,message:"Your password has been successfully changed"})
}

//change Role of user
export const RoleUser=async (req,res,next)=>{
  let {Email}=req.body;
  const checkUser=await User.findOne({Email});
  if(!checkUser){
    return next(new Error("Not Found User",{cause:404}))
  }
  checkUser.Role="admin"
 await checkUser.save()
  return res.status(200).json({result:true,status:200,Message:"User Became Admin"})
}
//  a l  l u  s e  r s
export const allusers=async (req,res,next)=>{
  const users=await User.find({},{Name:1,Email:1,Role:1,Status:1});

  return res.status(200).json({result:true,status:200,users})
}
//logout
export const logout=async (req,res,next)=>{
  
  let token = req.header;
  let user_id=req.user._id
  
  // Delete the Token from Token Model
   await Token.findOneAndDelete({token})
  // make the user offline
  let user=await User.findById(user_id)
  if(!user){
    return next(new Error("User Not Found",{cause:404}))
  }
  user.Status="offline"
  await user.save()
  return res.status(200).json({result:true,status:200,message:"deleted token successfully and user Bacame Offline"})
}

export const deleteaccount =CatchError(async(req,res,next)=>{
  const {id}=req.user
  console.log(id);
  const user= await User.findByIdAndDelete(id);
  if(!user){
    return next(new Error("User Not Found",{cause:404}))
  }
  await CartModel.findOneAndDelete({user:id})
  let tokens = await Token.deleteMany({user:id})
  console.log(tokens);
  return res.json({result:true,status:200,message:"deleted Account Successfully"})
})