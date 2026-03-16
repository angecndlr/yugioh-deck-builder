const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const SYSTEM_PROMPT = `Tu es un expert Yu-Gi-Oh! compétitif. Tu connais parfaitement les archétypes, la méta TCG/OCG/Master Duel, les banlists, les combos et les mécaniques de jeu.
Quand tu génères un deck, structure ta réponse EXACTEMENT ainsi (respecte les titres avec ##) :

## Présentation
[Explique le concept, pourquoi cet archétype, le plan de jeu principal]

## Main Deck (40 cartes)
- Nom de la carte x3
- Nom de la carte x2
[etc. — une carte par ligne, format "Nom x quantité"]

## Extra Deck (15 cartes)
- Nom de la carte x1
[etc.]

## Side Deck (15 cartes)
- Nom de la carte x1
[etc.]

## Combos clés
[2-3 combos principaux expliqués simplement]

## Conseils
[Budget, substituts, options méta]

Utilise les noms officiels français des cartes quand ils existent, sinon anglais. Respecte strictement la banlist du format demandé.`;

app.post('/api/generate', async (req, res) => {
  const { apiKey, prompt } = req.body;
  if (!apiKey || !prompt) {
    return res.status(400).json({ error: 'Clé API et prompt requis.' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2500,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'Erreur API Anthropic' });
    }

    res.json({ result: data.content?.[0]?.text || '' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur : ' + err.message });
  }
});

app.get('/api/card-info', async (req, res) => {
  const { name } = req.query;
  if (!name) return res.status(400).json({ error: 'Nom requis' });
  try {
    const response = await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?name=${encodeURIComponent(name)}&language=fr`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/banlist', async (req, res) => {
  const { format } = req.query;
  const formatMap = { 'TCG': 'tcg', 'OCG': 'ocg', 'Master Duel': 'md' };
  const fmt = formatMap[format] || 'tcg';
  try {
    const response = await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?banlist=${fmt}&language=fr`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Deck Builder running on port ${PORT}`));
