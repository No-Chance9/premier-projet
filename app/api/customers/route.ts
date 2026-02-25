import { connectDB } from "@/lib/mongodb";
import Customer from "@/models/Customer";
import { error } from "console";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(){
    await connectDB();
    
    try{
        const values = await Customer.find({});
    
        return NextResponse.json(values);

    }catch(err:any){
        return NextResponse.json({error: err.message});
    }
}
