import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";

// import { AuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import db from "./db";
// import { useAppDispatch } from "../src/app/redux/hooks";
import { useState } from "react";
// import { login } from "../src/app/redux/features/AuthContext";
// import { compare } from "bcrypt";
// import { User } from "@prisma/client";
import { NextAuthOptions } from "next-auth";
// import validator from "validator";

export const options: NextAuthOptions = {
    providers: [

		// EmailProvider({
		// 	server: process.env.EMAIL_SERVER,
		// 	from: process.env.EMAIL_FROM
		// })

        CredentialsProvider({
            name: "Credentials",

            credentials: {
              email: { label: "Email", type: "email", placeholder: "jsmith" },
              password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // Add logic here to look up the user from the credentials supplied
                // if (!credentials?.email || !credentials?.password) {
                //     throw new Error("Email and or password is not registered");
                // }

                // if (!validator.isEmail(credentials?.email )) throw new Error("Please provide a proper email");

                // const existingUserByEmail = await db.user.findUnique({
                //     where: {
                //         email: credentials.email,
                //     }
                // });
                
                // if (!existingUserByEmail){
                //     throw new Error("Email and or password is not registered");
                // }

                // const passwordMatch = await compare(credentials.password, existingUserByEmail.password);

                // if (!passwordMatch) {
                //     throw new Error("Email and or password is not registered");
                // }

                // if (existingUserByEmail.isVerified == false) {
                //     throw new Error('Email is not verified, Please verify email!')
                //     // return NextResponse.json({ user: null, message: "Email is not verified, Please verify email!"}, { status: 500 })
                // };

                // // localStorage.setItem("user", JSON.stringify(existingUserByEmail));
                // // dispatch(login(existingUserByEmail));
                // console.log("passing")
                // return {
                //     id: `${existingUserByEmail.id}`,
                //     username: existingUserByEmail.username,
                //     email: existingUserByEmail.email
                // }
                return {
                    id: `123`,
                    username: 'test123',
                    email: 'test123@gmail.com',
                    role: 'user'
                }
            }
        })
	],
    jwt: {
        maxAge: 24 * 60 * 60 * 1000
    },
    secret: process.env.NEXTAUTH_SECRET,
    // adapter: PrismaAdapter(db),
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60* 60
    },
    pages: {
        signIn: "/auth/sign-in"
    },
    callbacks: {
        async jwt({token, account, user}) {   
            
            if (user){
                console.log("user>>>>>", user)
                return {
                    ...token,
                    role: "user"
                    // username: (user as User).username
                }
            }  
            if (account) {
                token.accessToken = account.access_token;
                token.id = token.id;
                token.role = "user"
                // token.username = (user as User).username

            }

            return token
        },
        async session({session, token}) {
            return {
                ...session,
                
                user: {
                    ...session.user,
                    username: token.username,
                    role: "user"
                    
                }
            }
        },
    },
    events: {
        // async signIn({user}) {
        //     console.log("user signed in ", user)
        //     // if (user === null || user === undefined || user.email == "") return null
        //     const dispatch = useAppDispatch();

        //     const existingUserByEmail = await db.user.findUnique({
        //         where: {
        //             email: user.email,
        //             username: "a3aad33c"
        //         }
        //     });

        //     console.log("user", existingUserByEmail)

        //     if (existingUserByEmail) {
        //         localStorage.setItem("user", JSON.stringify(user));
        //         dispatch(login(user));
        //     }
        // }
    }
}