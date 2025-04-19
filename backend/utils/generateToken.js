import jwt from 'jsonwebtoken';



const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
    // Set the token in a cookie    
    res.cookie('jwt', token, {
        httpOnly: true,//prevent XSS Attacks
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',//prevent CSRF Attacks
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

};
export default generateTokenAndSetCookie;
// export default generateTokenAndSetCookie;
