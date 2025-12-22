import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Ruta principal
app.get("/", (req, res) => {
  res.send("Backend funcionando correctamente!");
});

// ---------------------------
// 🔵 RUTA /check (AIRDROP)
// ---------------------------
app.post("/check", async (req, res) => {
  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({
        ok: false,
        message: "Falta la dirección de wallet",
      });
    }

    // ⭐ Aquí puedes poner tu lógica real de airdrop ⭐
    // Por ahora responderá que todo está funcional.

    const fakeIsEligible = Math.random() > 0.5; // TRUE o FALSE al azar

    return res.json({
      ok: true,
      address,
      eligible: fakeIsEligible,
      message: fakeIsEligible
        ? "La wallet es elegible para el airdrop"
        : "La wallet NO es elegible",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Error en el servidor",
    });
  }
});

// ---------------------------
// Iniciar servidor
// ---------------------------
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor backend activo en http://localhost:${PORT}`);
});

export default app;
