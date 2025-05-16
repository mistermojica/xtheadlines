# Documento de Bajo Nivel para el MVP del Portal de Noticias por IA

Este documento desglosa las funcionalidades del MVP en tareas técnicas y consideraciones de implementación, sirviendo como guía para el desarrollo iterativo del proyecto.

---

## 1. Integración de Fuentes de Noticias

### 1.1. Consumo de al menos 2 fuentes RSS
- Seleccionar e investigar 2 fuentes RSS confiables.
  -- https://ensegundos.do/feed
  -- https://www.diariolibre.com/rss/portada.xml

- Implementar un servicio backend en Node.js para consumir y parsear los feeds usando `rss-parser`.
- Programar tareas periódicas (cron jobs) para actualizar las noticias.

### 1.2. Normalización de datos
- Definir un esquema de noticia (foto, título, resumen, enlace, fecha, fuente, categoría, logo_fuente).
- Transformar los datos de cada feed al esquema definido.
- Almacenar las noticias normalizadas en MongoDB.

---

## 2. Onboarding y Personalización Inicial

### 2.1. Pantalla de selección de categorías
- Crear una pantalla de onboarding en Next.js con tarjetas o checkboxes similares a botones de categorías.
- UI responsiva y atractiva (Tailwind CSS).

### 2.2. Almacenamiento de preferencias
- Guardar las categorías seleccionadas en el perfil del usuario en MongoDB.
- Si el usuario no está autenticado, almacenar temporalmente en localStorage y migrar al perfil tras registro.

---

## 3. Feed Personalizado

### 3.1. Generación del feed
- Backend: Endpoint para obtener noticias filtradas por categorías favoritas del usuario.
- Frontend: Página principal que consume este endpoint y muestra el feed.

### 3.2. Algoritmo simple de personalización
- Filtrado directo por categorías seleccionadas.
- Ordenar por fecha de publicación (más recientes primero).

---

## 4. Manejo de Perfil de Usuario

### 4.1. Registro e inicio de sesión
- Implementar autenticación básica con email/password usando NextAuth.js o similar.
- Validación y recuperación de contraseña.

### 4.2. Edición de preferencias
- Página de perfil para editar categorías favoritas.
- Actualización de preferencias en MongoDB.

---

## 5. Detalle de Noticia

### 5.1. Página de detalle
- Ruta dinámica en Next.js para mostrar el contenido completo de la noticia.
- Mostrar foto, título, resumen, contenido, fuente, fecha y logo_fuente.

### 5.2. Resumen generado por IA
- Backend: Endpoint que use OpenAI API para generar un resumen del contenido si el usuario lo solicita.
- Mostrar el resumen en la UI.

### 5.3. Text-to-Speech (TTS)
- Backend: Endpoint que use OpenAI o servicio TTS para convertir el texto en audio.
- Frontend: Botón de play para escuchar la noticia.

---

## 6. Búsqueda

### 6.1. Búsqueda textual
- Input de búsqueda en la UI.
- Endpoint backend para buscar noticias por palabra clave en MongoDB.

### 6.2. Búsqueda por voz
- Frontend: Integrar Web Speech API para capturar voz y transcribir a texto.
- Usar el texto transcrito para realizar la búsqueda textual.

---

## 7. Compartir Noticias

### 7.1. Compartir en redes sociales
- Botón para compartir en Facebook, Twitter, WhatsApp y copiar enlace.
- Uso de la Web Share API si está disponible.

---

## 8. Espacios Publicitarios

### 8.1. Espacios reservados
- Definir componentes de espacio publicitario en el layout (header, sidebar, entre noticias).
- Mostrar placeholders o banners propios (sin necesidad de integración real en el MVP).

---

## 9. Infraestructura y Despliegue

- El despliegue inicial del frontend y backend se realizará en **AWS Lightsail**.
- El entorno de desarrollo principal será una Mac.
- No se utilizará Docker a menos que sea estrictamente necesario.
- No se implementará CI/CD automatizado ni Google Analytics en esta etapa.

---

## 10. Consideraciones Técnicas Generales

- Manejo de errores y validaciones en frontend y backend.
- Seguridad básica: sanitización de inputs, protección de endpoints.
- Cumplimiento básico de privacidad (aviso de cookies, política de privacidad).

---

> **Este documento puede ser ampliado o modificado según las necesidades del desarrollo y las indicaciones que vayas dando.** 