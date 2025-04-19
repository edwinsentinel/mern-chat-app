import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";


/// @desc    Register a new user
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

export const login = (req, res) => {
 console.log("login user");
}

export const logout = (req, res) => {
 console.log("logout user");
}