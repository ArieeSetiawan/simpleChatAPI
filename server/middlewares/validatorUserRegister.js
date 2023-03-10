const {check, validationResult} = require ('express-validator');

const rules = [
    check('name')
    .notEmpty().withMessage('Name cannot be Empty')
    .bail(),
    check('email')
    .notEmpty().withMessage('Email cannot be Empty')
    .isEmail().withMessage('Enter with Correct Email')
    .bail(),
    check('password')
    .notEmpty().withMessage('Password cannot be Empty')
    .isLength({min:6}).withMessage('Password Length is 6 to 12')
    .isLength({max:12}).withMessage('Password Length is 6 to 12')
    .trim()
    .not().isLowercase().withMessage('musthaveUppercase')
    .not().isUppercase().withMessage('musthaveLowercase')
    .not().isNumeric().withMessage('musthaveLetter')
    .not().isAlpha().withMessage('musthaveNumber')
    .bail(),
    check('phone')
    .notEmpty().withMessage('Phone number cannot be Empty')
    .isNumeric().withMessage('Phone number must be a number')
];

const validateUserRegister = [
    rules,
    (req,res,next)=>{
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(422).json({errors: errors.array()})
        }
        next();
    }
];

module.exports = validateUserRegister;