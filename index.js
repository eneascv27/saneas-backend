const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ mensaje: "Backend de Saneas funcionando correctamente" });
});

app.post("/send-email", async (req, res) => {
  const { nombre, email, empresa, mensaje } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      subject: "Nuevo mensaje desde la landing page de Saneas",
      text: `
Nombre: ${nombre}
Correo: ${email}
Empresa: ${empresa || "No especificada"}

Mensaje:
${mensaje || "Sin mensaje"}
      `,
    });

    res.json({ ok: true, mensaje: "Correo enviado correctamente" });
  } catch (error) {
    console.error("ERROR AL ENVIAR CORREO:", error.message);
    res.status(500).json({
      ok: false,
      mensaje: "Error al enviar correo",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto ${PORT}`);
});
