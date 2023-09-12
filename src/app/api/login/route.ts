import { getJWTSecretKey } from "@/lib/auth";
import { SignJWT } from "jose";
import {cookies} from "next/headers"
import { NextResponse } from "next/server";


export const   POST = async (request:Request) => {
    const body = await request.json();
    const {username , password} = body;

    if(username =='admin' && password =="admin") {
        const jwt = await new SignJWT({
            username:username,
            role:"admin"
        })
        .setProtectedHeader({alg:"HS256"})
        .setIssuedAt()
        .setExpirationTime('2m')
        .sign(new TextEncoder().encode(getJWTSecretKey()))

        cookies().set("token",jwt,{
            httpOnly:true
        })
    
        return NextResponse.json({accessToken:jwt},{status:200})
    }

    return NextResponse.json({Error:"Failed to create Token"},{status:401})
}
