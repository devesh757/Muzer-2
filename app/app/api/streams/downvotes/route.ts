import  { NextRequest, NextResponse } from "next/server";
import {z} from "zod"
import { db } from "@/src/prisma/db";
import { getServerSession } from "next-auth";

const DownvotesSchema = z.object({
    streamId:z.string()
})




export  async function POST(req:NextRequest){
     const session = await getServerSession();
  
     const user = await db.orm.public.User.where({
        email:session?.user?.email ?? "",
     }).first();

     if(!user){
        return NextResponse.json({
            message:"unauthorized"
        },{
            status:411
        })
     }

     try{
        const data = DownvotesSchema.parse(await req.json());
        await db.orm.public.Upvote.where({
                userId:user.id,
                streamId:data.streamId
        }).delete();
     }catch(e){
        console.error(e);
        return NextResponse.json({
            message:"Error while Downvotinng"
        },{
            status:403
        })
     }
     
}