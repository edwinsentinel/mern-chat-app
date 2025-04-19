import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";


/// @desc    Register a new user
/// @route   POST /api/auth/signup
export const signup = async (req, res) => {
 try {
    const {fullName,username,password,confirmPassword,gender} =req.body;

    if(password !== confirmPassword){
        return res.status(400).json({message:"Passwords do not match"});
    }
    const user= await User.findOne({username});
    if(user){
        return res.status(400).json({message:"User already exists"});
    }
    //HASH PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);//hash password

    //https://avatar-placeholder.iran.liara.run/avatar/200/200/any

    const boyProfilePic = `https://avatar.iran.liara.run/public/boyId?username=${username}`
    const girlProfilePic = `https://avatar.iran.liara.run/public/girlId?username=${username}`


    const newUser = new User({
        fullName,
        username,
        password: hashedPassword,
        gender,
        profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
    });
    //save user to database
    if(newUser){
        //generate JWT token
    generateTokenAndSetCookie(newUser._id, res);
    await newUser.save();
    res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        profilePic: newUser.profilePic
    });
}
    else{
        res.status(400).json({message:"Invalid user data"});
    }
    //res.status(201).json({message:"User created successfully"});
    //res.status(201).json(newUser);
    //console.log("User created successfully", newUser);


 } catch (error) {
    console.error("Error signup controller:", error.message);
    res.status(500).json({message:"Internal server error"});
 }
}


/// @desc    Login user
/// @route   POST /api/auth/login
export const login = async(req, res) => {
try {
    const {username, password} = req.body;
    const user= await User.findOne({username});
    const isPasswordValid = await bcrypt.compare(password, user?.password || "");
    if(!user || !isPasswordValid){
        return res.status(400).json({message:"Invalid username or password"});
    }
    //generate JWT token
    generateTokenAndSetCookie(user._id, res);
    res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        profilePic: user.profilePic
    });
    
} catch (error) {
    console.error("Error login controller:", error.message);
    res.status(500).json({message:"Internal server error"});
    
}
}


/// @desc    Logout user
/// @route   POST /api/auth/logout
export const logout = async(req, res) => {
 try {
    res.cookie("jwt",{maxAge: 0});
    res.status(200).json({message:"Logged out successfully"});
    //res.clearCookie("jwt");
    
 } catch (error) {
    console.error("Error logout controller:", error.message);
    res.status(500).json({message:"Internal server error"});
 }
}