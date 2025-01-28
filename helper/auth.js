const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Joi = require("joi");
dotenv.config();

const generateAuthToken = async (user) => {
  const payload = { _id: user._id };
  return jwt.sign({ payload }, process.env.TOP_SECRET, { expiresIn: "1h" });
};

const verifyAuthToken = () => {
  return (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) {
      return res.status(403).send({
        status: false,
        message: "Unauthorized request please attach token",
      });
    } else {
      const tokenBody = token.slice(7);
      jwt.verify(tokenBody, process.env.TOP_SECRET, (err, decoded) => {
        console.log("token decodes is :", decoded);
        if (err) {
          return res
            .status(401)
            .send({ status: 401, message: "Expire token, access denied" });
        }
        req.user_id = decoded.payload._id;
        next();
      });
    }
  };
};

const validateSignup = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    phone_no: Joi.string().min(11).required(),
    // password: Joi.string().min(6).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().optional(),
    role: Joi.string().optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  next();
};

const validateCategory = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};

const validateCar = (req, res, next) => {
  const schema = Joi.object({
    category: Joi.string().required(),
    color: Joi.string().required(),
    model: Joi.string().required(),
    make: Joi.string().required(),
    registrationNo: Joi.string().required(),
    yearOfManufacture: Joi.number().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  next();
};

module.exports = {
  generateAuthToken,
  verifyAuthToken,
  validateSignup,
  validateCategory,
  validateCar,
};
