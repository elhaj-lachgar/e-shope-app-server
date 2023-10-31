const { validationResult } = require('express-validator')



const ValiditorMiddlware = ( req, res , next ) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       return res.send({ errors : errors.array() , message : 'from validitor'});
    }
    return next();
}

module.exports = ValiditorMiddlware ;