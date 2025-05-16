'use client';

import { Facebook, Twitter, Linkedin, Link as LinkIcon } from 'lucide-react';

type ShareButtonsProps = {
  titulo: string;
  url: string;
};

export function ShareButtons({ titulo, url }: ShareButtonsProps) {
  const shareLinks = [
    {
      name: 'Facebook',
      icon: <Facebook size={20} />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: 'hover:bg-blue-100 text-blue-600',
    },
    {
      name: 'Twitter',
      icon: <Twitter size={20} />,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(titulo)}`,
      color: 'hover:bg-blue-50 text-blue-400',
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin size={20} />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      color: 'hover:bg-blue-50 text-blue-700',
    },
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert('¡Enlace copiado al portapapeles!');
    } catch (err) {
      console.error('Error al copiar el enlace:', err);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      <span className="text-sm font-medium text-gray-600">Compartir:</span>
      <div className="flex items-center gap-2">
        {shareLinks.map(({ name, icon, url, color }) => (
          <a
            key={name}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-2 rounded-full transition-colors ${color} hover:opacity-90`}
            aria-label={`Compartir en ${name}`}
          >
            {icon}
          </a>
        ))}
        <button
          onClick={copyToClipboard}
          className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Copiar enlace"
        >
          <LinkIcon size={20} />
        </button>
      </div>
    </div>
  );
}
