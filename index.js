const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ mensaje: "Backend de Saneas funcionando correctamente" });
});

app.post("/send-email", async (req, res) => {
  const { nombre, email, empresa, mensaje } = req.body;

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          name: "Saneas",
          email: process.env.EMAIL_TO,
        },
        to: [
          {
            email: process.env.EMAIL_TO,
          },
        ],
        subject: "Nuevo mensaje desde la landing page de Saneas",
        textContent: `
Nombre: ${nombre}
Correo: ${email}
Empresa: ${empresa || "No especificada"}

Mensaje:
${mensaje || "Sin mensaje"}
        `,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }

    res.json({
      ok: true,
      mensaje: "Correo enviado correctamente",
    });
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
