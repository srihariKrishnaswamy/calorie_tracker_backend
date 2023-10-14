import jwt from 'jsonwebtoken'
const ACCESS_TOKEN_SECRET = "a37328f9ba40d0bb62ded3272703914a3dde55b8b4435e58f4b48fa4946748e2ac3baa4a69141f302940bff4329349a8c8f86dcc7c338fc262584093f584a93f"
const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({message: 'Unauthorized'})
    }

    const token = authHeader.split(' ')[1]
 
    jwt.verify(
        token,
        ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.status(403).json({message: "Forbidden"})
            req.email = decoded.UserInfo.email;
            next();
        }
    )
}

export default verifyJWT;