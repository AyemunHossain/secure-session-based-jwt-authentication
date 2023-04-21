const NodeCache = require("node-cache");
const cache = new NodeCache();
const jwt = require('jsonwebtoken');
const splitArray = require('../utils/split');

const checkCache = async (req, res, next) =>{
    try{
        const cookies = req.get('Cookie').split('; ');
        const cookiesArray = splitArray(cookies);
        const access_token = cookiesArray["access_token"];
        let cacheToken = cache.get("at-"+access_token);
        
        if(cacheToken === undefined){
            return res.status(500).json({result: false, message: "Invalid Token. Sign in again. -- (checkCache)"});
        }
        next();
    }catch{
        return res.status(500).json({result: false, message: e.message});
    }
}

const assignToken = async(token) =>{
    const secretAccessToken = process.env.JWT_SECRET;
    const verifiedAccessToken = await jwt.verify(token, secretAccessToken);
    return verifiedAccessToken;
}


const setCache = async (access_token) =>{
    try{
        const token = assignToken(access_token);
        const exp = token.exp;
        const nowInSecond = Math.floor(Date.now() / 1000);
        const ttlAccess = (exp-nowInSecond);
        cache.set("at-"+access_token, access_token, ttlAccess);
        return {result: true};
    }catch{
        return ({result: false, message: e.message});
    }
}

const removeCacheToken = async(req, res, next)=>{
    try{

        const cookies = req.get('Cookie').split('; ');
        const cookiesArray = splitArray(cookies);
        const access_token = cookiesArray["access_token"];
        
        cache.del("at-"+access_token);
        next();
    }catch{
        return res.status(500).json({result: false, message: e.message});
    }
}


module.exports = {
    setCache, checkCache, removeCache: removeCacheToken,
};
