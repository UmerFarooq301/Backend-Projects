import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from '../models/user.models.js';
import { uploadToCloudinary } from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";


const registerUser = asyncHandler( async (req, res) => {

    // get user details from frontend
   // validation - not empty
   // check if user already exists: username or email
   // check for images, check for avatar
   // upload them to cloudinary, avatar
   // create user object - create entry in db
   // remove password and refreshToken fields from response
   // check for user creation 
   // return response

   const {username, email, fullname, password} = req.body;
   console.log("email", email);
   

   if([username, email, fullname, password].some((field) => field.trim() === "")) {
       throw new ApiError("All fields are required", 400);
   }

   const existedUser = User.findOne({
    $or: [{username}, {email}]
   })

   if(existedUser){
    throw new ApiError(409, "User with username or email already exists");
   }

   const avatarLocalPath = req.files?.avatar[0]?.path;
   const coverImageLocalPath = req.files?.cover[0]?.path;

   if(!avatarLocalPath) {
    throw new ApiError("Avatar is required", 400)
   }

   const avatar = await uploadToCloudinary(avatarLocalPath);
   const coverImage = await uploadToCloudinary(coverImageLocalPath);

   if(!avatar){
    throw new ApiError("Avatar is required", 400);
   }

   const user = await User.create({
    fullname,
    email,
    username: username.toLowerCase(),
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
   })

   const createdUser = await User.findOne({_id: user._id}).select("-password -refreshToken");

   if(!createdUser){
    throw new ApiError("Something went wrong while registering the user", 500);
   }

   return res.status(201).json(
    new ApiResponse(200, "User registered successfully", createdUser)
   )

})

export {registerUser};