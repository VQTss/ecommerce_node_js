const { BadRequestError, ConflictRequestError } = require("../core/error.response");
const { findByID } = require("../services/apiKey.services");

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}



const apiKey = async (req, res, next) => {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
        throw new BadRequestError("Error: Key is not in header");
    }

    // check 
    const objKey = await findByID(key);
    if (!objKey) {
        throw new BadRequestError("Error: key is not found!!!");

    }
    req.objKey = objKey;
    return next();
}

const permission = (permission) => {
    return (req, res, next) => {
        if (!req.objKey.permissions) {
            throw new BadRequestError("Error:  Permission denied!!");
        }

        console.log("Permissions::", req.objKey.permissions);
        const vaidPermisstions = req.objKey.permissions.includes(permission);
        if (!vaidPermisstions) {
            throw new BadRequestError('Error:  Permission!!');
        }
        return next();
    }
}




module.exports = {
    apiKey, permission
}
