const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const crypto = require('crypto-js');
const verifyToken = (token) => {
    return jwt.verify(token, process.env.SECRET_TOKEN, (err) => !err)
}
// const decodeToken = (token) => {
//     const decodeString = jwt.decode(token)
//     return decodeString ? decodeString.id : null
// }
// const lowerCase = (value) => {
//     return value ? value.toLowerCase() : value
// }
// const convertPasswordHMAC256 = (password) => {
//   var hashPassword = crypto.HmacSHA256(password, process.env.SECRET_TOKEN)
//   var hexhash = crypto.enc.Hex.stringify(hashPassword)
//   return hexhash
// }
function generateID (name) { 
    return name +'_' + Math.random().toString(36).substr(2, 9);
}
const fetchAPI = async (apiurl, headers) => {
  try {
    const response = await fetch(apiurl, headers)
    const responJson = await response.json()
    return responJson
  } catch (error) {
    return false
  }
}
// const generateToken = (userSign) => {
//   return jwt.sign({ userID: userSign }, process.env.SECRET_TOKEN)
// }
const genUpdate = (data, arrValue) => {
    const genObject = {}
    arrValue.map(itm => {
      if (data[itm] !== undefined && data[itm] !== null) {
        genObject[itm] = data[itm]
      }
    })
    return genObject
  }
  function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  const createActivationToken = (payload) => {
    return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {expiresIn: '5m'})
  }
  const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})
  }
  const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
  }

module.exports = { 
    generateID,
    genUpdate,
    verifyToken, 
    // decodeToken, 
    // lowerCase,
    // convertPasswordHMAC256,
    fetchAPI,
    // generateToken,
    validateEmail,
    createActivationToken,
    createAccessToken,
    createRefreshToken
}