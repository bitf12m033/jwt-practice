import { jwtVerify } from "jose";
import {getJWTSecretKey} from '@/lib/auth'
import { NextRequest, NextResponse } from "next/server";


export async function middleware(request:NextRequest) {
  
    const {pathname , origin} = request.nextUrl;

    const headersToken = request.cookies.get("token")?.value;
    console.log("Token", headersToken);
    
    try {
        if(pathname == '/login') {
            if(headersToken) 
                return NextResponse.redirect(`${origin}`)

            return NextResponse.next()
        }
        if(!headersToken) {
            return NextResponse.redirect(`http://localhost:3000/login`);
        }

        const verifyToken = await jwtVerify(headersToken , new TextEncoder().encode(getJWTSecretKey()))
        console.log("verifyToekn",verifyToken);
        
        if(verifyToken)
            return NextResponse.next()

        return NextResponse.json({error:"Access Denied"} ,{status:401})

        
    } catch (error) {
        console.log("Error:",error);
        request.cookies.delete("token")
        console.log(request.cookies);
        
        // throw new Error("Your token has expired.");
    }

}

export const config = {
    matcher: ['/','/login','/protect']
}
