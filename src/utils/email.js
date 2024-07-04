const nodemailer = require("nodemailer");
const logger = require("../utils/logger.js");

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS//contraseña de aplicaciones de Gmail
    }
});

async function sendPurchaseEMail(email, first_name, ticket) {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Confirmación de compra",
            html: `
            <h1>Confirmación de compra</h1>
            <p>Gracias por tu compra, ${first_name}</p>
            <p>El número de tu orden es: ${ticket}</p>
            `
        };
        await transporter.sendMail(mailOptions);
    } catch (error) {
        logger.error("Error al enviar el correo electrónico: ", error);
    };
};

async function sendResetMail(email, first_name, token) {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Restablecimiento de contraseña",
            html: `
            <h1>Restablecimiento de contraseña</h1>
            <p>Hola: ${first_name}</p>
            <p>Has solicitado cambiar tú contraseña. Utiliza el siguiente código para restablecerla</p>
            <p><strong>${token}</strong></p>
            <p>Este código expira en una hora</p>
            <a href="http://localhost:8080/password">Restablecer contraseña</a>
            <p>Si no solicitaste cambiar tu contraseña, ignora este correo</p>
            `
        };
        await transporter.sendMail(mailOptions)
    } catch (error) {
        logger.error("Error al enviar el correo electrónico: ", error);
    }
};

async function sendInactiveUser(email, first_name, last_name) {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Cuenta eliminada por inactividad",
            html: `
            <h1>Cuenta eliminada por inactividad</h1>
            <p>Hola: ${first_name, last_name}</p>
            <p>Señor usuario, hemos eliminado la cuenta por inactividad en los últimos dos días </p>
            <p>Esperamos que vuelvas pronto</p>
            `
        };
        await transporter.sendMail(mailOptions)
    } catch (error) {
        logger.error("Error al enviar el correo electrónico: ", error);
    }
};

module.exports = { sendPurchaseEMail, sendResetMail, sendInactiveUser };