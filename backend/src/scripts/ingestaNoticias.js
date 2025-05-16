require('dotenv').config();
const mongoose = require('mongoose');
const Noticia = require('../models/Noticia');
const { fetchAndNormalizeNews } = require('../rss/rssService');

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conectado a MongoDB');

    const noticias = await fetchAndNormalizeNews();
    let nuevas = 0;
    for (const noticia of noticias) {
      try {
        // Evitar duplicados por enlace
        let noti = await Noticia.updateOne(
          { enlace: noticia.enlace },
          { $setOnInsert: noticia },
          { upsert: true }
        );
        console.log({ noti });
        nuevas++;
      } catch (err) {
        console.error('Error guardando noticia:', err.message);
      }
    }
    console.log(`Proceso terminado. Noticias procesadas: ${noticias.length}`);
    process.exit(0);
  } catch (error) {
    console.error('Error general:', error.message);
    process.exit(1);
  }
}

main(); 