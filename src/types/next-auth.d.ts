import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';
import { JWT, DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    username: string;
    role: string;
  }
  interface Session {
    user: User & {
      username: string;
      role: string;
    };
    token: {
      username: string;
      role: string;
    } & DefaultSession['user'];
  }

  //   interface User extends DefaultUser {
  //     role: string;
  //   }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    role: string | any;
  }
}
