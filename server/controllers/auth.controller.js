const db = require("../models");
const config = require('../config/env.config.js');
const { user: User, role: Role, refreshToken: RefreshToken } = db;
// const User = db.user;
// const Role = db.role;
const Op = db.Sequelize.Op;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require('../helpers/send-email');

exports.signup = async (req, res) => {
    const user = new User(req.body);
    // first registered user is an admin
    // if ((await User.count()) === 0) initialData(req.get('origin'));

    user.verificationToken = randomTokenString();

    user.acceptTerms = user.acceptTerms ? '1' : '0';
    // hash password

    user.passwordHash = await hash(req.body.password);

    // Save User to Database
    await user.save();
    await sendVerificationEmail(user, req.get('origin'));
    res.send({ message: "Usuario registrado satisfactoriamente!" });
};

exports.signin = async (req, res) => {
    const params = req.body;

    // if ((await User.count()) === 0) await initialData(req.get('origin'));

    const user = await User.scope('withHash').findOne({ where: { username: params.username }, include: Role });

    if (!user) {
        return res.status(401).send({ message: "No se encontro el nombre de usuario." });
    }

    if (!(await bcrypt.compare(params.password, user.passwordHash))) {
        return res.status(401).send({
            accessToken: null,
            message: "Contraseña incorrecta!"
        });
    }

    if (!user.isVerified) {
        return res.status(401).send({ message: "Cuenta deshabilitada, contacte con un administrador." })
    }

    const token = jwt.sign({ sub: user.id, id: user.id }, config.jwt_secret, { expiresIn: config.jwtExpiration });
    const refreshToken = await RefreshToken.createToken(user);

    // req.session.token = token;
    setTokenCookie(res, refreshToken);

    res.status(200).send({
        ...basicDetails(user),
        jwtToken: token,
        refreshToken: refreshToken
    });

    /* User.findOne({ where: { username: req.body.username } }).then(async (user) => {

        const token = jwt.sign({ sub: user.id, id: user.id }, config.jwt_secret, { expiresIn: config.jwtExpiration });
        const refreshToken = await RefreshToken.createToken(user);

        var authorities = [];

        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                authorities.push("ROLE_" + roles[i].name.toUpperCase());
            }

            res.status(200).send({
                id: user.id,
                username: user.username,
                email: user.email,
                roles: authorities,
                jwtToken: token,
                refreshToken: refreshToken
            });
        }).catch(err => {
            console.log(err)
            res.status(500).send({ message: err.message });
        });
    }).catch(err => {
        console.log(err)
        res.status(500).send({ message: err.message });
    }); */
};

exports.signout = async (req, res) => {
    const { token: refreshToken } = req.body;
    if (refreshToken == null) {
        return res.status(403).json({ message: "Se requiere el Token!" });
    }
    try {
        // req.session = null;
        RefreshToken.destroy({ where: { token: refreshToken } });
        return res.status(200).send({
            message: "Se ha cerrado la Session!"
        });
    } catch (err) {
        this.next(err);
    }
};

exports.refreshToken = async (req, res) => {

    const token = req.body.refreshToken;

    const refreshToken = await RefreshToken.findOne({ where: { token } });

    if (!refreshToken) {
        res.status(401).json({ message: 'No se encontro el token' });
        return;
    }

    const user = await refreshToken.getUser({ include: db.role });

    if (refreshToken.isExpired) {
        refreshToken.destroy();
        res.status(401).json({ message: 'Sesion Expirada.' });
        return;
    }

    RefreshToken.destroy({ where: { token: token } });

    const newAccessToken = jwt.sign({ id: user.id }, config.jwt_secret, { expiresIn: config.jwtExpiration });
    const newRefreshToken = await RefreshToken.createToken(user);

    setTokenCookie(res, refreshToken);

    res.status(200).json({
        ...basicDetails(user),
        jwtToken: newAccessToken,
        refreshToken: newRefreshToken,
    });

    /*  // replace old refresh token with a new one and save
     const newRefreshToken = generateRefreshToken(user, req.ip);
     refreshToken.destroy()
     // await refreshToken.save();
     await newRefreshToken.save();
 
     // generate new jwt
     const jwtToken = generateJwtToken(user);
 
     // return basic details and tokens
     return {
         ...basicDetails(account),
         jwtToken,
         refreshToken: newRefreshToken.token
     };
 
     const requestToken = req.body.refreshToken;
     if (requestToken == null) {
         return res.status(403).json({ message: "El token es requerido!" });
     }
     try {
         const refreshToken = await RefreshToken.findOne({ where: { token: requestToken } });
 
         if (!refreshToken) {
             res.status(403).json({ message: "No se encontro el token!" });
             return;
         }
 
         if (RefreshToken.verifyExpiration(refreshToken)) {
             RefreshToken.destroy({ where: { id: refreshToken.id } });
 
             res.status(403).json({
                 message: "Token invalido. Por favor vuelva a iniciar sesion",
             });
         }
 
         const user = await refreshToken.getUser();
 
         RefreshToken.destroy({ where: { id: refreshToken.id } });
 
         const newAccessToken = jwt.sign({ id: user.id }, config.jwt_secret, { expiresIn: config.jwtExpiration });
         const newRefreshToken = await RefreshToken.createToken(user);
 
         setTokenCookie(res, refreshToken);
 
         return res.status(200).json({
             jwtToken: newAccessToken,
             refreshToken: newRefreshToken,
         });
     } catch (err) {
         return res.status(500).send({ message: err });
     } */
};


exports.verifyEmail = async (req, res) => {
    const { token } = req.body;

    if (!token) res.status(404).send({ message: 'Token invalido' });

    User.findOne({ where: { verificationToken: token } }).then(async user => {
        if (!user)
            res.status(404).send({ message: 'Verification token not found' });
        else {
            user.verified = Date.now();
            user.verificationToken = null;
            await user.save();
            // res.status(200).send({message:"Cuenta verificada con exito."})
            res.status(200).json({ message: 'Verification successful, you can now login' })
        }
    }).catch(err => {
        console.log(err)
        res.status(500).send({ message: err.message });
    });

}

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    // always return ok response to prevent email enumeration
    if (!user) res.status(400).send({ message: "No se encotro el correo." });

    // create reset token that expires after 24 hours
    user.resetToken = randomTokenString();
    user.resetTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    // send email
    await sendPasswordResetEmail(user, req.get('origin'));
    res.status(200).json({ message: 'Please check your email for password reset instructions' })
}

exports.validateResetToken = async (req, res) => {
    const { token } = req.body
    const user = await User.findOne({
        where: {
            resetToken: token,
            resetTokenExpires: { [Op.gt]: Date.now() }
        }
    });

    if (!user)
        res.status(400).send({ message: 'Invalid token' });
    else
        res.status(200).json(user);
}

const validateResetToken = async ({ token }) => {
    const user = await User.findOne({
        where: {
            resetToken: token,
            resetTokenExpires: { [Op.gt]: Date.now() }
        }
    });

    return user;
}

exports.resetPassword = async (req, res) => {
    const { token, password } = req.body
    const user = await validateResetToken({ token });

    if (!user)
        res.status(400).json({ message: "Token invalido" });

    else {
        // update password and remove reset token
        user.passwordHash = await hash(password);
        user.passwordReset = Date.now();
        user.resetToken = null;
        await user.save();
        res.status(200).json({ message: "Contraseña Reseteada correctamente" })
    }
}
// helper functions

function randomTokenString() {
    return crypto.randomBytes(40).toString('hex');
}

function basicDetails(user) {
    const { id, personId, firstName, lastName, username, email, role, roleId, created, updated, isVerified } = user;
    return { id, personId, firstName, lastName, username, email, role: role.name, roleId, created, updated, isVerified };
}

async function sendVerificationEmail(user, origin) {
    let message;
    if (origin) {
        const verifyUrl = `${origin}/auth/verify-email?token=${user.verificationToken}`;
        message = `<p>Please click the below link to verify your email address:</p>
                   <p><a href="${verifyUrl}">${verifyUrl}</a></p>`;
    } else {
        message = `<p>Please use the below token to verify your email address with the <code>/user/verify-email</code> api route:</p>
                   <p><code>${user.verificationToken}</code></p>`;
    }

    await sendEmail({
        to: user.email,
        subject: 'Sign-up Verification API - Verify Email',
        html: `<h4>Verify Email</h4>
               <p>Thanks for registering!</p>
               ${message}`
    });
}

async function sendAlreadyRegisteredEmail(email, origin) {
    let message;
    if (origin) {
        message = `<p>If you don't know your password please visit the <a href="${origin}/auth/forgot-password">forgot password</a> page.</p>`;
    } else {
        message = `<p>If you don't know your password you can reset it via the <code>/user/forgot-password</code> api route.</p>`;
    }

    await sendEmail({
        to: email,
        subject: 'Sign-up Verification API - Email Already Registered',
        html: `<h4>Email Already Registered</h4>
               <p>Your email <strong>${email}</strong> is already registered.</p>
               ${message}`
    });
}

async function sendPasswordResetEmail(user, origin) {
    let message;
    if (origin) {
        const resetUrl = `${origin}/auth/reset-password?token=${user.resetToken}`;
        message = `<p>Please click the below link to reset your password, the link will be valid for 1 day:</p>
                   <p><a href="${resetUrl}">${resetUrl}</a></p>`;
    } else {
        message = `<p>Please use the below token to reset your password with the <code>/user/reset-password</code> api route:</p>
                   <p><code>${user.resetToken}</code></p>`;
    }

    await sendEmail({
        to: user.email,
        subject: 'Sign-up Verification API - Reset Password',
        html: `<h4>Reset Password Email</h4>
               ${message}`
    });
}

async function hash(password) {
    // return await bcrypt.hashSync(req.body.password, 10);
    return await bcrypt.hash(password, 10);
}

function generateJwtToken(user) {
    // create a jwt token containing the user id that expires in 15 minutes
    return jwt.sign({ sub: user.id, id: user.id }, config.secret, { expiresIn: '15m' });
}

function generateRefreshToken(user, ipAddress) {
    // create a refresh token that expires in 7 days
    return new RefreshToken({
        userId: user.id,
        token: randomTokenString(),
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
}

function randomTokenString() {
    return crypto.randomBytes(40).toString('hex');
}

function setTokenCookie(res, token) {
    // create http only cookie with refresh token that expires in 7 days
    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    };
    res.cookie('refreshToken', token, cookieOptions);
}