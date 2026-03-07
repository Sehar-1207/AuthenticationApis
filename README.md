# Authentication Apis

![License](https://img.shields.io/badge/license-ISC-green)

## 📝 Description

AuthenticationApis is a robust backend solution built with Express.js designed to handle secure user authentication for web applications. It implements industry-standard JWT (JSON Web Token) authentication, ensuring stateless and secure communication between the client and server. The system features a comprehensive security workflow, including user registration with mandatory email verification, secure login mechanisms utilizing refresh tokens to maintain persistent sessions without compromising security, and a reliable logout functionality to invalidate tokens. This project serves as a production-ready foundation for any modern web application requiring advanced access control and session management. It also has a feature of a Email Otp verification ensuring seamless working of the whole project.

## ✨ Features

- 🕸️ Web


## 🛠️ Tech Stack

- 🚀 Express.js


## 📦 Key Dependencies

```
bcryptjs: ^3.0.3
body-parser: ^2.2.2
dotenv: ^17.3.1
ejs: ^4.0.1
express: ^5.2.1
express-validator: ^7.3.1
jsonwebtoken: ^9.0.3
libphonenumber-js: ^1.12.37
mongoose: ^9.2.1
multer: ^2.0.2
nodemailer: ^8.0.1
randomstring: ^1.3.1
```

## 🚀 Run Commands

- **test**: `npm run test`
- **start**: `npm run start`


## 📁 Project Structure

```
.
├── config
│   ├── dbConfig.js
│   └── nodeMailer.js
├── controller
│   ├── authController.js
│   ├── mailVerification.js
│   ├── passwordController.js
│   └── userController.js
├── helper
│   ├── deleteProfileImage.js
│   ├── generatingTokens.js
│   ├── otpValidate.js
│   └── sendMail.js
├── middleware
│   ├── authentication.js
│   ├── sharedValidations.js
│   └── validation.js
├── models
│   ├── blackListToken.js
│   ├── otp.js
│   ├── passwordReset.js
│   └── userModel.js
├── package.json
├── routes
│   ├── authRoute.js
│   └── userRouter.js
├── server.js
└── views
    ├── 404.ejs
    ├── mailVerification.ejs
    ├── resetPassword.ejs
    └── resetSuccess.ejs
```

## 👥 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/Sehar-1207/AuthenticationApis.git`
3. **Create** a new branch: `git checkout -b feature/your-feature`
4. **Commit** your changes: `git commit -am 'Add some feature'`
5. **Push** to your branch: `git push origin feature/your-feature`
6. **Open** a pull request

Please ensure your code follows the project's style guidelines and includes tests where applicable.



---
*This README was generated with ❤️ by Sehar Ajmal*
