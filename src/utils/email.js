const nodemailer = require("nodemailer");
const logger = require("../utils/logger.js");

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: "jeffquetas@gmail.com",
        pass: "fnig ngix aroy vemp",//contraseña de aplicaciones de Gmail
    }
});

async function sendPurchaseEMail(email, first_name, ticket) {
    try {
        const mailOptions = {
            from: "Test mail <jeffquetas@gmail.com>",
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

module.exports = {sendPurchaseEMail};