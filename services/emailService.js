import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// funzione per inviare una email
export const sendEmail = async (to, subject, htmlContent) => {
  const msg = {
    to: to, // Destinatario
    from: "ivanfucchi@gmail.com", // Cambialo con una tua email verificata su SendGrid
    subject: subject,
    html: htmlContent,
  };

  try {
    await sgMail.send(msg);
    console.log("email inviata con successo a:", to);
  } catch (error) {
    console.error("errore nel l'invio dell'email:", error.message);
  }
};
