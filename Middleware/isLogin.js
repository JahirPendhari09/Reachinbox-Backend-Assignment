// middleware check is user is there or not
const isLogin = (req, res, next)=> {
    req.user ? next() : res.sendStatus(401);
}

module.exports = { isLogin}