'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NoticiaBase } from '@/types/noticia';

export default function NoticiasList() {
  const [noticias, setNoticias] = useState<NoticiaBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoria, setCategoria] = useState<string>('todas');

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        setLoading(true);
        const url = categoria === 'todas' 
          ? 'http://localhost:4000/api/noticias'
          : `http://localhost:4000/api/noticias/categoria?categoria=${categoria}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Error al cargar las noticias');
        }
        
        const data = await response.json();
        setNoticias(data);
        setError(null);
      } catch (err) {
        console.error('Error:', err);
        setError('No se pudieron cargar las noticias. Intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchNoticias();
  }, [categoria]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">¡Error! </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-6 text-gray-900">Últimas Noticias</h1>
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setCategoria('todas')}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              categoria === 'todas' 
                ? 'bg-blue-700 text-white shadow-md' 
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Todas
          </button>
          {['Tecnología', 'Deportes', 'Política', 'Entretenimiento', 'Salud', 'Ciencia'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoria(cat.toLowerCase())}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                categoria === cat.toLowerCase()
                  ? 'bg-blue-700 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {noticias.map((noticia) => (
          <div key={noticia._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="relative h-48">
              <Image
                src={noticia.foto || '/placeholder-news.jpg'}
                alt={noticia.titulo}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="p-4">
              <div className="mb-3">
                <span className="inline-block bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full border border-gray-200">
                  {noticia.categoria || 'General'}
                </span>
              </div>
              <h2 className="text-xl font-extrabold mb-3 line-clamp-2 text-gray-900 hover:text-blue-700 transition-colors">
                <Link href={`/noticia/${noticia._id}`}>
                  {noticia.titulo}
                </Link>
              </h2>
              <p className="text-gray-700 mb-4 line-clamp-3">{noticia.resumen}</p>
              <div className="flex justify-between items-center text-sm text-gray-600 border-t border-gray-100 pt-3 mt-auto">
                <span className="font-medium">{noticia.fuente}</span>
                <span className="text-gray-500">{new Date(noticia.fecha).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
