const Noticia = require('../models/Noticia');

// Función para generar un resumen a partir del contenido
const generarResumen = (contenido, longitud = 200) => {
  if (!contenido) return '';
  // Eliminar etiquetas HTML si las hay
  const textoSinHTML = contenido.replace(/<[^>]*>?/gm, '');
  // Tomar los primeros 'longitud' caracteres y asegurar que termine en una palabra completa
  return textoSinHTML.length > longitud 
    ? textoSinHTML.substring(0, textoSinHTML.lastIndexOf(' ', longitud)) + '...'
    : textoSinHTML;
};

// Obtener noticia por ID
exports.getNoticiaById = async (req, res) => {
  try {
    const noticia = await Noticia.findById(req.params.id);
    
    if (!noticia) {
      return res.status(404).json({ mensaje: 'Noticia no encontrada' });
    }
    
    // Asegurar que siempre haya un resumen
    if (!noticia.resumen && noticia.contenido) {
      noticia.resumen = generarResumen(noticia.contenido);
      // Guardar el resumen generado
      await noticia.save();
    }
    
    res.json(noticia);
  } catch (error) {
    console.error('Error al obtener noticia:', error);
    res.status(500).json({ mensaje: 'Error al obtener la noticia', error: error.message });
  }
};

// Obtener noticias por categoría
exports.getNoticiasPorCategoria = async (req, res) => {
  try {
    const { categoria } = req.query;
    
    if (!categoria) {
      return res.status(400).json({ mensaje: 'Se requiere el parámetro de categoría' });
    }
    
    // Buscar noticias que coincidan con la categoría (insensible a mayúsculas/minúsculas)
    const noticias = await Noticia.find({
      categoria: { $regex: new RegExp(categoria, 'i') }
    }).sort({ fecha: -1 });
    
    res.json(noticias);
  } catch (error) {
    console.error('Error al obtener noticias por categoría:', error);
    res.status(500).json({ 
      mensaje: 'Error al obtener noticias por categoría', 
      error: error.message 
    });
  }
};

// Obtener noticias relacionadas
exports.getNoticiasRelacionadas = async (req, res) => {
  try {
    const { categoria, excluir, limite = 3 } = req.query;
    
    const query = {};
    if (categoria) query.categoria = categoria;
    if (excluir) query._id = { $ne: excluir };
    
    const noticias = await Noticia.find(query)
      .limit(parseInt(limite))
      .sort({ fecha: -1 });
    
    res.json(noticias);
  } catch (error) {
    console.error('Error al obtener noticias relacionadas:', error);
    res.status(500).json({ mensaje: 'Error al obtener noticias relacionadas', error: error.message });
  }
};

// Obtener todas las noticias (con filtros opcionales)
exports.getNoticias = async (req, res) => {
  try {
    const { categoria } = req.query;
    const query = categoria ? { categoria } : {};
    
    let noticias = await Noticia.find(query).sort({ fecha: -1 });
    
    // Asegurar que todas las noticias tengan resumen
    noticias = await Promise.all(noticias.map(async (noticia) => {
      if (!noticia.resumen && noticia.contenido) {
        noticia.resumen = generarResumen(noticia.contenido);
        await noticia.save();
      }
      return noticia;
    }));
    
    res.json(noticias);
  } catch (error) {
    console.error('Error al obtener noticias:', error);
    res.status(500).json({ mensaje: 'Error al obtener las noticias', error: error.message });
  }
};
