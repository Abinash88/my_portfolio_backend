import { body } from "express-validator";

export const LoginAuthValidatior = [
  body("email")
    .isEmail()
    .withMessage("Please enter valid email!")
    .notEmpty()
    .withMessage("please enter the email")
    .custom((data) => !/[!#$%^&*()+{}\[\]:;<>,.?/~\\-]/.test(data))
    .withMessage("Invalid Characters!"),
  body("password")
    .matches(/^[a-zA-Z0-9]+$/, "g")
    .withMessage("Password can only be a to z, 0 to 9 and _underscore ")
    .notEmpty()
    .withMessage("Please enter your password!")
    .custom((data) => !/[!#$%^&*()+{}\[\]:;<>,.?/~\\-]/.test(data))
    .withMessage("Invalid Characters"),
];

export const SignUpAuthValidator = [
  body("name")
    .notEmpty()
    .withMessage("Please enter your name!")
    .custom((data) => !/[!#$%^&*()+{}\[\]:;<>,.?/~\\-]/.test(data))
    .withMessage("Invalid Characters"),
  body("email")
    .isEmail()
    .withMessage("Please enter your email address!")
    .notEmpty()
    .withMessage("Please enter your email address!")
    .custom((data) => !/[!#$%^&*()+{}\[\]:;<>,?/~\\]/.test(data))
    .withMessage("Invalid Characters"),
  body("password")
    .notEmpty()
    .withMessage("Please enter your password")
    .matches(/^[a-zA-Z0-9]+$/, "g")
    .withMessage("Password can only be a to z, 0 to 9 and _underscore")
    .custom((data) => !/[!#$%^&*()+{}\[\]:;<>,.?/~\\-]/.test(data))
    .withMessage("Invalid Characters"),
];
