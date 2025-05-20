import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ShareButtons } from '@/components/ShareButtons';
import { NoticiasRelacionadas } from '@/components/NoticiasRelacionadas';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface Noticia {
  _id: string;
  titulo: string;
  contenido: string;
  resumen?: string; // Hacer el campo opcional con ?
  foto: string;
  fuente: string;
  fecha: string;
  categoria: string;
  url: string;
  enlace: string; // URL original de la noticia
}

async function getCategorias(): Promise<string[]> {
  try {
    const res = await fetch('http://localhost:4000/api/noticias');
    if (!res.ok) return [];
    const noticias = await res.json();
    
    if (!Array.isArray(noticias)) return [];
    
    const categoriasUnicas = Array.from(
      new Set(
        noticias
          .map((n: Noticia) => n.categoria)
          .filter((c): c is string => Boolean(c) && typeof c === 'string')
          .map(c => c.trim())
          .filter(c => c.length > 0)
      )
    );
    
    return categoriasUnicas.sort();
  } catch (error) {
    console.error('Error al cargar categorías:', error);
    return [];
  }
}

export default async function NoticiaPage({ params }: { params: { id: string } }) {
  console.log('ID de noticia recibido:', params.id);
  
  try {
    // Cargar la noticia y las categorías en paralelo
    const [noticiaRes, categorias] = await Promise.all([
      fetch(`http://localhost:4000/api/noticias/${params.id}`, {
        next: { revalidate: 60 } // Revalidar cada minuto
      }),
      getCategorias()
    ]);
    
    console.log('Respuesta del servidor:', {
      status: noticiaRes.status,
      statusText: noticiaRes.statusText,
    });
    
    if (!noticiaRes.ok) {
      const errorData = await noticiaRes.text();
      console.error('Error en la respuesta:', errorData);
      
      if (noticiaRes.status === 404) {
        console.log('Noticia no encontrada');
        return notFound();
      }
      
      throw new Error(`Error al cargar la noticia: ${noticiaRes.status} ${noticiaRes.statusText}`);
    }
    
    const noticia: Noticia = await noticiaRes.json();
    
    return (
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Botón de regreso */}
          <Link 
            href="/" 
            className="inline-flex items-center mb-6 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Volver al inicio
          </Link>
          
          {/* Categorías */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              <Link 
                href="/"
                className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-700 text-white shadow-md hover:bg-blue-800 transition-colors"
              >
                Todas
              </Link>
              {categorias.map((cat: string) => (
                <Link
                  key={cat}
                  href={`/?categoria=${encodeURIComponent(cat.toLowerCase())}`}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
          
          <article className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Imagen principal */}
            <div className="relative h-96 w-full">
              <Image
                src={noticia.foto || '/placeholder-news.jpg'}
                alt={noticia.titulo}
                fill
                className="object-cover"
                priority
              />
            </div>
            
            {/* Contenido */}
            <div className="p-6">
              {/* Categoría */}
              <div className="mb-4">
                <span className="inline-block bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full border border-gray-200">
                  {noticia.categoria || 'General'}
                </span>
              </div>
              
              {/* Título */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {noticia.titulo}
              </h1>
              
              {/* Metadatos */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                <span className="font-medium">{noticia.fuente}</span>
                <span>•</span>
                <time dateTime={noticia.fecha}>
                  {format(new Date(noticia.fecha), "d 'de' MMMM 'de' yyyy", { locale: es })}
                </time>
              </div>
              
              {/* Contenido completo */}
              <div className="prose max-w-none text-gray-800 mb-8">
                {noticia.contenido ? (
                  <div 
                    className="space-y-4"
                    dangerouslySetInnerHTML={{ __html: noticia.contenido }}
                  />
                ) : noticia.resumen ? (
                  <div className="space-y-4">
                    {noticia.resumen.split('\n').map((parrafo, i) => (
                      <p key={i} className="mb-4 leading-relaxed">
                        {parrafo}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 italic">
                    No hay contenido disponible para esta noticia.
                  </p>
                )}
              </div>

              {/* Enlace a la noticia original */}
              <div className="mt-8 mb-6 text-center">
                <a 
                  href={noticia.enlace || noticia.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                  </svg>
                  Ver noticia completa en {new URL(noticia.enlace || noticia.url).hostname.replace('www.', '')}
                </a>
              </div>
              
              {/* Botones de compartir */}
              <div className="border-t border-b border-gray-100 py-4 mb-8">
                <ShareButtons 
                  titulo={noticia.titulo}
                  url={`${process.env.NEXT_PUBLIC_SITE_URL}/noticia/${noticia._id}`}
                />
              </div>
            </div>
          </article>
        </div>
        
        {/* Noticias relacionadas */}
        <div className="mt-16 max-w-4xl mx-auto px-4 pb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Noticias relacionadas</h2>
          <NoticiasRelacionadas 
            categoria={noticia.categoria} 
            noticiaActualId={noticia._id} 
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error:', error);
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error al cargar la noticia</h1>
        <p className="text-gray-600">Por favor, inténtalo de nuevo más tarde.</p>
      </div>
    );
  }
}
