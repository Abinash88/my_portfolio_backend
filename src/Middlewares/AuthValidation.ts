import { body } from "express-validator";

export const LoginAuthValidatior = [
  body("email")
    .isEmail()
    .withMessage("Please enter valid email!")
    .notEmpty()
    .withMessage("please enter the email")
    .custom((data) => !/[!#$%^&*()+{}\[\]:;<>,?/~\\]/.test(data))
    .withMessage("Invalid Characters!"),
  body("password")
    .notEmpty()
    .withMessage("Please enter your password!")
    .custom((data) => !/[!$%^&*()+{}\[\]:;<>,.?/~\\]/.test(data))
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
    .custom((data) => !/[!$%^&*()+{}\[\]:;<>,.?/~\\]/.test(data))
    .withMessage("Invalid Characters"),
];

export const HomeDataValidator = [
  body("logo_name").notEmpty().withMessage(" Logo Name is required."),
  body("title").notEmpty().withMessage(" Logo Name is required."),
  body("description")
    .notEmpty()
    .withMessage("Description is required.")
    .isLength({ min: 50, max: 250 })
    .withMessage("Description should be less than 50 and more than 250 char"),
  body("copy_email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),
];
