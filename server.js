import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/generate", async (req, res) => {
  try {
    const { product, price, description, type } = req.body;

    if (!product || !description) {
      return res.status(400).json({
        error: "Veuillez renseigner le produit et sa description."
      });
    }

    const prompt = `
Tu es un expert en marketing digital.

Crée un contenu de vente professionnel en français.

Produit : ${product}
Prix : ${price || "Non précisé"}
Description : ${description}
Type de contenu : ${type || "Publicité"}

Le contenu doit être :
- simple
- convaincant
- naturel
- adapté aux vendeurs africains
- avec un appel à l'action clair
`;

    const response = await openai.responses.create({
      model: "gpt-5-mini",
      input: prompt
    });

    res.json({
      result: response.output_text
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Une erreur est survenue lors de la génération."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`VendreIA fonctionne sur le port ${PORT}`);
});
