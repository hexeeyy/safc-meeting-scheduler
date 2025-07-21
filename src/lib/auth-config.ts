import { NextAuthOptions } from 'next-auth';
import { SupabaseAdapter } from '@auth/supabase-adapter';
import { supabaseClient } from './supabase';
import CredentialsProvider from 'next-auth/providers/credentials';
import { loginSchema } from '@/schema/auth/login.schema';

// Extend the Session user type to include 'role' and 'department'
import { Session } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      department?: string;
      avatar_url?: string;
    };
  }
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
    department?: string;
    avatar_url?: string;
  }
}

declare module 'next-auth/adapters' {
  interface AdapterUser {
    role?: string;
    department?: string;
    avatar_url?: string;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Validate credentials format
          const validatedCredentials = loginSchema.parse(credentials);

          // Authenticate with Supabase
          const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: validatedCredentials.email,
            password: validatedCredentials.password,
          });

          if (error || !data.user) {
            return null;
          }

          // Get user profile from our users table
          const { data: userProfile, error: profileError } = await supabaseClient
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (profileError) {
            // If no profile exists, create one
            const { data: newProfile } = await supabaseClient
              .from('users')
              .insert({
                id: data.user.id,
                email: data.user.email!,
                name: data.user.user_metadata?.name || data.user.email!.split('@')[0],
                role: 'member'
              })
              .select()
              .single();

            return {
              id: data.user.id,
              email: data.user.email!,
              name: newProfile?.name || data.user.email!.split('@')[0],
              role: newProfile?.role || 'member',
            };
          }

          return {
            id: data.user.id,
            email: userProfile.email,
            name: userProfile.name,
            role: userProfile.role,
            department: userProfile.department,
            avatar_url: userProfile.avatar_url,
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.department = user.department;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.user.department = token.department as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
