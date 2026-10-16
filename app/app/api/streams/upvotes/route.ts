
import { NextRequest,NextResponse } from "next/server"
import {z} from "zod";
import { db } from "@/src/prisma/db";
import  { getServerSession } from "next-auth";
    
const UpvoteSchema = z.object({
    streamId:z.string(),

})


 export async function POST(req:NextRequest){
    const session  = await getServerSession();


     const  user = await db.orm.public.User.where({
        email:session?.user?.email ?? "",
     }).first();

        if(!user){
            return NextResponse.json({
                message:"Unauthenticated"
            },{
                status:411
            })
        }
    
try{
 const data = UpvoteSchema.parse(await req.json());
 await db.orm.public.Upvote.create({
       userId: user.id,
       streamId:data.streamId
 })
}catch(e){
    console.error(e);
    return NextResponse.json({
        message:"Errro while upvoting"
    },{
        status:500
    })
}
 }


 export async function GET(req:NextRequest){
      const creatorId = req.nextUrl.searchParams.get("creatorId");
      if(!creatorId){
        return NextResponse.json({
            message:"creatorId is required"
        },{
            status:400
        })
      }
      const streams = await db.orm.public.Stream.where({
          userId:creatorId ?? ""
      });

      return NextResponse.json({
           streams
      })
 }