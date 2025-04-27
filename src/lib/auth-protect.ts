import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from "next/server";

export async function ProtectApi(req:NextRequest) {
    const token = await getToken({req, secret: process.env.AUTH_SECRET});
    if (!token) {
        return NextResponse.json({error:"Unauthorized"}, {status:401});
    }

    return null

}