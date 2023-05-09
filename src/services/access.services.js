'use strict'

const bcrypt = require('bcrypt');
const shopModel = require('../models/shop.model')
const crypto = require('node:crypto');
const keyTokenService = require('../services/keyToken.services');
const { creatTokenPair, verifyJWT } = require('../auth/authUtils');
const { getInforData } = require('../utils');
const { BadRequestError, AuthFailureError, ForbiddenError } = require('../core/error.response');
const { findByEmail } = require('./shop.services');
const KeyTokenService = require('../services/keyToken.services');


const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}


class AccessService {



    static handlerRefreshTokenV2 = async ({keyStore, user,refreshToken}) => {
        const {userID , email} = user;
        if (keyStore.refreshTokensUsed.includes(refreshToken)) {
            await KeyTokenService.deleteKeyByID(userID);
            throw new ForbiddenError("Something wrong happend!! Pls relogin");
        }
        if (keyStore.refreshToken !== refreshToken) {
            throw new AuthFailureError("Shop not registered");
        }
        const foundShop = await findByEmail({email});
        if (!foundShop) {
            throw new AuthFailureError("Shop not registered");
        }
        // create 1 cap moi

        const tokens = await creatTokenPair({ userID, email }, keyStore.publicKey, keyStore.privateKey);
        // update
        await keyStore.updateOne({
            $set: {
                refreshToken :  tokens.refreshToken,
            },
            $addToSet : {
                // da duoc su dung de lay token moi
                refreshTokensUsed : refreshToken
            }
        })
        return {
            user,
            tokens
        }
    }
   

    static handlerRefreshToken = async (refreshToken) => {
        // Kiem tra token da duoc su dung chua
        const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken);
        // Neu co
        if (foundToken) {
            // decode xem ai dang truy
            const {userID, email} = await verifyJWT(refreshToken,foundToken.privateKey);
            console.log({userID,email});
            // remove all token in keyStore
            await KeyTokenService.deleteKeyByID(userID);
            throw new ForbiddenError("Something wrong happend!! Pls relogin");
        }

        const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
        if (!holderToken) {
            throw new AuthFailureError("Shop not registered [1]");
        }
        // verify token
        const {userID, email} = await verifyJWT(refreshToken,holderToken.privateKey);
        // check userID
        const foundShop = await findByEmail({email});
        if (!foundShop) {
            throw new AuthFailureError("Shop not registered [2]");
        }
        // create 1 cap moi
        const tokens = await creatTokenPair({ userID, email }, holderToken.publicKey, holderToken.privateKey);
        // update
        await holderToken.updateOne({
            $set: {
                refreshToken :  tokens.refreshToken,
            },
            $addToSet : {
                // da duoc su dung de lay token moi
                refreshTokensUsed : refreshToken
            }
        })
        return {
            user : {userID, email},
            tokens
        }
    }



    static logout = async (keyStore) => {
        console.log("Key store:::", keyStore);
        const delKey = KeyTokenService.removeKeyByID(keyStore._id);
        return delKey;
    }

    /**
     * 1- check email in dbs
     * 2- match password
     * 3- create AT vs RT and save
     * 4- generate tokens
     * 5- get data return login
     */

    static login = async ({ email, password, refreshToken = null }) => {

        // 1
        const foundShop = await findByEmail({ email });
        if (!foundShop) {
            throw new BadRequestError("Shop not registered!");
        }

        // 2
        const match = bcrypt.compare(password, foundShop.password);
        if (!match) {
            throw new AuthFailureError('Authencation error');
        }

        // 3
        // Khi nào dùng đến 2 lần thì dùng utils
        const privateKey = crypto.randomBytes(64).toString('hex');
        const publicKey = crypto.randomBytes(64).toString('hex');

        const { _id: userID } = foundShop;

        const tokens = await creatTokenPair({ userID, email }, publicKey, privateKey);
        await KeyTokenService.createKeyToken({
            refreshToken: tokens.refreshToken,
            privateKey, publicKey, userID
        })

        return {
            shop: getInforData({ fileds: ['_id', 'name', 'email'], object: foundShop }),
            tokens
        }
    }




    static signUp = async ({ name, email, password }) => {
        // step 1 : check email exitsts
        const holderShop = await shopModel.findOne({ email }).lean()
        if (holderShop) {
            throw new BadRequestError('Error:  Shop already registered!');
        }
        // saltOrRounds : tạo độ khó
        const passwordHash = await bcrypt.hash(password, 10);

        const newShop = await shopModel.create({
            name, email, password: passwordHash, roles: [RoleShop.SHOP]
        })
        // console.log(`New shop:: ${newShop}`);
        if (newShop) {
            // create  private key and  public key
            // private key : sign token
            // public key : verify  
            // tạo ra nhờ thuật toán bất đối xứng
            // const {privateKey, publicKey}  = crypto.generateKeyPairSync('rsa',{
            //     modulusLength: 4096,
            //     publicKeyEncoding: {
            //         type: 'pkcs1',
            //         format : 'pem'
            //     },
            //     privateKeyEncoding : {
            //         type: 'pkcs1',
            //         format : 'pem'
            //     }
            // })
            const privateKey = crypto.randomBytes(64).toString('hex');
            const publicKey = crypto.randomBytes(64).toString('hex');
            // Public key cryto standard
            // console.log(`privateKey and publicKey:::${privateKey,publicKey}`); // save collection keyStore    
            const keyStore = await keyTokenService.createKeyToken({
                userID: newShop._id,
                publicKey,
                privateKey
            });
            if (!keyStore) {
                throw new BadRequestError('Error:  keyStore!!')
            }
            // const objectToken = crypto.createPublicKey(publicKeyString)
            // create token pair

            const tokens = await creatTokenPair({ userID: newShop._id, email }, publicKey, privateKey);
            // console.log(`Created:: `,tokens);
            return {
                code: 201,
                metadata: {
                    shop: getInforData({ fileds: ['_id', 'name', 'email'], object: newShop }),
                    tokens
                }
            }
        }
        return {
            code: 200,
            metadata: null
        }
    }
}

module.exports = AccessService;