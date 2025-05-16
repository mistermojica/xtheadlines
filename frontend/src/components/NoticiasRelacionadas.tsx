'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NoticiaRelacionada } from '@/types/noticia';

export function NoticiasRelacionadas({ 
  categoria, 
  noticiaActualId 
}: { 
  categoria: string; 
  noticiaActualId: string 
}) {
  const [noticias, setNoticias] = useState<NoticiaRelacionada[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNoticiasRelacionadas = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const url = new URL('http://localhost:4000/api/noticias/relacionadas');
        url.searchParams.append('categoria', categoria);
        url.searchParams.append('excluir', noticiaActualId);
        url.searchParams.append('limite', '3');
        
        console.log('Solicitando noticias relacionadas a:', url.toString());
        
        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error en la respuesta:', response.status, errorText);
          throw new Error(`Error ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log('Noticias relacionadas recibidas:', data);
        setNoticias(data);
      } catch (err: any) {
        console.error('Error al cargar noticias relacionadas:', err);
        setError(`Error: ${err?.message || 'Error desconocido'}`);
      } finally {
        setLoading(false);
      }
    };

    if (categoria) {
      fetchNoticiasRelacionadas();
    }
  }, [categoria, noticiaActualId]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-100 rounded-lg h-64 animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (noticias.length === 0) {
    return <p className="text-gray-500">No hay noticias relacionadas disponibles</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {noticias.map((noticia) => (
        <Link 
          key={noticia._id} 
          href={`/noticia/${noticia._id}`}
          className="group block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <div className="relative h-40">
            <Image
              src={noticia.foto || '/placeholder-news.jpg'}
              alt={noticia.titulo}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
            />
          </div>
          <div className="p-4">
            <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {noticia.titulo}
            </h3>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>{noticia.fuente}</span>
              <span>{new Date(noticia.fecha).toLocaleDateString()}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
