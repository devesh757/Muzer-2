import {NextRequest,NextResponse} from "next/server";
import { z} from "zod";
import { db } from "@/src/prisma/db";

var YT_REGEX = ("^https:\/\/www\.youtube\.com\/watch\?v=[\w-]{11}$")
 
const CreateStreamSchema = z.object({
    creatorId: z.string(),
    url:z.string()
})

export async function POST(req:NextRequest){

try{
    const data = CreateStreamSchema.parse(await req.json());
    const isYt = data.url.match(YT_REGEX)
     
    if(!isYt){
        return NextResponse.json({
            message:"Wrong URL format"
        },{
            status:411
        })
    }

    const extractedId = data.url.split("?v=")[1];

  await db.orm.public.Stream.create({
         userId: data.creatorId,
         url:data.url,
         extractedId,
         type:"Youtube"
    })

}catch(e){
    console.error(e);
    return NextResponse.json({
        message:"Error while adding a stream"
    },{
        status:411
    })
}
}