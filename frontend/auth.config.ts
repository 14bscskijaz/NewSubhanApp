import { NextAuthConfig, User } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';

const authConfig = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? '',
      clientSecret: process.env.GITHUB_SECRET ?? ''
    }),
    CredentialProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        const hardcodedEmail = process.env.NEXT_PUBLIC_HARDCODED_EMAIL;
        const hardcodedPassword = process.env.NEXT_PUBLIC_HARDCODED_PASSWORD;

        if (
          credentials?.email == hardcodedEmail &&
          credentials?.password == hardcodedPassword
        ) {
          const user: User = { id: '1', name: 'John Doe', email: credentials.email as string };
          return user;
        } else {
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/' 
  }
} satisfies NextAuthConfig;

export default authConfig;