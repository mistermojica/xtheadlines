const Parser = require('rss-parser');
const parser = new Parser();
const cheerio = require('cheerio');
const axios = require('axios');
const { URL } = require('url');

const FEEDS = [
  {
    url: 'https://ensegundos.do/feed',
    fuente: 'EnSegundos.do',
    logo_fuente: 'https://ensegundos.do/wp-content/uploads/2019/09/cropped-logo-ensegundos-32x32.png',
    categoria: 'General',
  },
  {
    url: 'https://www.diariolibre.com/rss/portada.xml',
    fuente: 'Diario Libre',
    logo_fuente: 'https://www.diariolibre.com/etc.clientlibs/diariolibre/clientlibs/clientlib-site/resources/favicon.ico',
    categoria: 'General',
  },
];

async function extractImageFromItem(item) {
  // 1. media:content
  if (item['media:content'] && item['media:content']['$'] && item['media:content']['$'].url) {
    return item['media:content']['$'].url;
  }
  // 2. media:thumbnail
  if (item['media:thumbnail'] && item['media:thumbnail']['$'] && item['media:thumbnail']['$'].url) {
    return item['media:thumbnail']['$'].url;
  }
  // 3. enclosure(s)
  if (item.enclosure && item.enclosure.url) {
    return item.enclosure.url;
  }
  if (item.enclosures && Array.isArray(item.enclosures)) {
    for (const enc of item.enclosures) {
      if (enc.url && (!enc.type || enc.type.startsWith('image/'))) {
        return enc.url;
      }
    }
  }
  // 4. Buscar en el HTML del contenido
  if (item.content) {
    const $ = cheerio.load(item.content);
    const img = $('img').first();
    if (img && img.attr('src')) return img.attr('src');
  }
  // 5. Buscar en el HTML del resumen
  if (item.summary) {
    const $ = cheerio.load(item.summary);
    const img = $('img').first();
    if (img && img.attr('src')) return img.attr('src');
  }
  // 6. Scraping del enlace (opcional, requiere await)
  if (item.link) {
    try {
      const response = await axios.get(item.link, { timeout: 10000 });
      const $ = cheerio.load(response.data);
      // og:image
      const ogImg = $('meta[property="og:image"]').attr('content');
      if (ogImg) return ogImg;
      // Primera imagen significativa
      const imgs = $('img').toArray();
      for (const img of imgs) {
        const src = $(img).attr('src');
        if (
          src &&
          !src.endsWith('.ico') &&
          !src.endsWith('.svg') &&
          !/logo|icon|avatar/i.test(src)
        ) {
          // Convertir a URL absoluta si es necesario
          if (!src.startsWith('http')) {
            const base = new URL(item.link);
            return `${base.origin}${src.startsWith('/') ? src : '/' + src}`;
          }
          return src;
        }
      }
    } catch (e) {
      // Ignorar errores de scraping
    }
  }
  return '';
}

async function fetchAndNormalizeNews() {
  let allNews = [];
  for (const feed of FEEDS) {
    try {
      const data = await parser.parseURL(feed.url);
      const noticias = await Promise.all(data.items.map(async item => ({
        foto: await extractImageFromItem(item),
        titulo: item.title || '',
        resumen: item.contentSnippet || item.summary || '',
        enlace: item.link || '',
        fecha: item.isoDate || item.pubDate || '',
        fuente: feed.fuente,
        categoria: feed.categoria,
        logo_fuente: feed.logo_fuente,
      })));
      allNews = allNews.concat(noticias);
    } catch (error) {
      console.error(`Error al procesar el feed ${feed.url}:`, error.message);
    }
  }
  return allNews;
}

module.exports = { fetchAndNormalizeNews }; 