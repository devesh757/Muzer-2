import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth"
import {Provider} from "@/src/prisma/db"
import { db } from "@/src/prisma/db";

console.log("CHECKING ID:", process.env.GOOGLE_CLIENT_ID);

const handler = NextAuth({
   providers:[
            GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
  }),
   ],
   callbacks:{
async signIn(params){

   if(!params.user.email){
          return false;
   }
   try{
      await db.orm.public.User.upsert({
         where:{
            email:params.user.email
         },
         create:{
         email:params.user.email ,
         provider:Provider.Google
         },
         update:{}
      })
   
   }catch(e){
      console.error(e);
      return false;
   }
   return true;
}
   },
   secret:process.env.NEXTAUTH_SECRET,
})

export {handler as GET,handler as POST} 