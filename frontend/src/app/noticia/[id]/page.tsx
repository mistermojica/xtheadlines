import { notFound } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ShareButtons } from '@/components/ShareButtons';
import { NoticiasRelacionadas } from '@/components/NoticiasRelacionadas';

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
}

export default async function NoticiaPage({ params }: { params: { id: string } }) {
  console.log('ID de noticia recibido:', params.id);
  
  try {
    const apiUrl = `http://localhost:4000/api/noticias/${params.id}`;
    console.log('Solicitando URL:', apiUrl);
    
    const res = await fetch(apiUrl, {
      next: { revalidate: 60 } // Revalidar cada minuto
    });
    
    console.log('Respuesta del servidor:', {
      status: res.status,
      statusText: res.statusText,
      headers: Object.fromEntries(res.headers.entries())
    });
    
    if (!res.ok) {
      const errorData = await res.text();
      console.error('Error en la respuesta:', errorData);
      
      if (res.status === 404) {
        console.log('Noticia no encontrada');
        return notFound();
      }
      
      throw new Error(`Error al cargar la noticia: ${res.status} ${res.statusText}`);
    }
    
    const noticia: Noticia = await res.json();
    
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
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
              
              {/* Contenido */}
              <div className="prose max-w-none text-gray-700 mb-8">
                {noticia.contenido ? (
                  // Si hay contenido, lo dividimos por párrafos
                  noticia.contenido.split('\n').map((parrafo, i) => {
                    // Si el párrafo está vacío, lo omitimos
                    if (!parrafo.trim()) return null;
                    
                    // Si el párrafo parece un subtítulo (corta longitud y termina en dos puntos)
                    if (parrafo.trim().length < 100 && (parrafo.endsWith(':') || parrafo.endsWith(':'))) {
                      return <h3 key={i} className="text-xl font-bold text-gray-900 mt-6 mb-3">{parrafo}</h3>;
                    }
                    
                    // Párrafo normal
                    return <p key={i} className="mb-4 leading-relaxed text-gray-800">{parrafo}</p>;
                  })
                ) : (
                  // Si no hay contenido, mostramos el resumen
                  <p className="text-gray-600 italic">No hay contenido disponible para esta noticia.</p>
                )}
                
                {/* Si el contenido es muy corto, mostramos también el resumen */}
                {noticia.resumen && noticia.contenido && noticia.contenido.length < 200 && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900 mb-2">Resumen:</p>
                    <p className="text-gray-700">{noticia.resumen}</p>
                  </div>
                )}
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
