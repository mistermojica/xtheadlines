const mongoose = require('mongoose');

const NoticiaSchema = new mongoose.Schema({
  foto: { type: String, default: '' },
  titulo: { type: String, required: true },
  resumen: { type: String, default: '' },
  contenido: { type: String, default: '' },
  enlace: { type: String, required: true, unique: true },
  url: { type: String, required: true, unique: true },
  fecha: { type: Date, default: Date.now },
  fuente: { type: String, required: true },
  categoria: { type: String, default: 'General' },
  logo_fuente: { type: String, default: '' },
  palabrasClave: [{ type: String }],
  autor: { type: String, default: '' },
  etiquetas: [{ type: String }]
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para búsquedas rápidas
NoticiaSchema.index({ titulo: 'text', resumen: 'text', contenido: 'text' });
NoticiaSchema.index({ categoria: 1 });
NoticiaSchema.index({ fecha: -1 });

// Middleware para asegurar que la URL sea única y generarla si es necesario
NoticiaSchema.pre('save', function(next) {
  if (!this.url) {
    // Generar una URL amigable a partir del título
    this.url = this.titulo
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 100);
  }
  
  // Asegurar que el contenido no esté vacío
  if (!this.contenido && this.resumen) {
    this.contenido = this.resumen;
  }
  
  next();
});

module.exports = mongoose.model('Noticia', NoticiaSchema);