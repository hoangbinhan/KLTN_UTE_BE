function generateID (name) { 
    return name+'_' + Math.random().toString(36).substr(2, 9);
}

const genUpdate = (data, arrValue) => {
    const genObject = {}
    arrValue.map(itm => {
      if (data[itm] !== undefined && data[itm] !== null) {
        genObject[itm] = data[itm]
      }
    })
    return genObject
  }
  

module.exports = { 
    generateID,
    genUpdate
}