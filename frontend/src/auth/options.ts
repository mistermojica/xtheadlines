import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

declare module 'next-auth' {
  interface User {
    id: string;
    categoriasFavoritas: string[];
  }

  interface Session {
    user: {
      id: string;
      categoriasFavoritas: string[];
    } & {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email y contraseña son requeridos');
        }

        try {
          // Llamar al endpoint de autenticación del backend
          const response = await fetch('http://localhost:4000/api/auth/signin', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error de autenticación');
          }

          const user = await response.json();
          
          if (user) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.image,
              categoriasFavoritas: user.categoriasFavoritas || [],
            };
          }
          
          return null;
        } catch (error) {
          console.error('Error en la autenticación:', error);
          throw new Error('Error al conectar con el servidor');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.categoriasFavoritas = user.categoriasFavoritas || [];
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.categoriasFavoritas = token.categoriasFavoritas as string[];
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
