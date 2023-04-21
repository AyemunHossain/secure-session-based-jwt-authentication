const tokenGenerator = require("../utils/jwt-token");
const tokenCache = require("../middleware/token-caching");

exports.login = async(req, res, next)=>{
    try{

        const user = {
            "_id": "someId123", "email": "test@mail.com"
        }
        
        const resultAccess = await tokenGenerator.generateToken(user, 1);
        const resultRefresh = await tokenGenerator.generateToken(user, 2);

        const access_token = resultAccess.token;
        const refresh_token = resultRefresh.token;
    
        const tokenCacheResult = await tokenCache.setCache(access_token);
        if(!tokenCacheResult.result){
            const error = new Error();
            error.message = tokenCacheResult.message;
            throw error;
        }

        res.status(200)
            .cookie('access_token', resultAccess.token, resultAccess.cookie)
            .cookie('refresh_token', resultRefresh.token, resultRefresh.cookie)
            .json({
                result: true, token: resultAccess.token
            });

    } catch (e) {
        res.status(500).json({result: false, message: "Something went wrong.", e_message: e.message});
        return;
    }
}


exports.signout = async (req, res) => {
    try {
        res.status(200)
            .clearCookie("access_token")
            .clearCookie("refresh_token")
            .json({
                result: true, message: 'Signed out.'
            });
    } catch (err) {
        res.status(500).json({result: false, message: "Something went wrong."});
        return;
    }
}