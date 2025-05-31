import { Schema,model } from "mongoose";
export interface Hospital{
    id:string;
    hospitalID:string;
    name:string; 
    location:string;
    image:string; 
    email:string;
    license_number:string;
    phone_number:string; 
     
}
export const HospitalSchema = new Schema<Hospital>(
    {
        hospitalID:{type:String, required:true},
        name:{type:String, required:true},  
        location:{type:String, required:false},
        image:{type:String, required:false}, 
        email :{type:String, required:false}, 
        license_number:{type:String, required:true},
        phone_number:{type:String, required:true}, 
         
    },{
        toJSON:{
            virtuals:true
        },
        toObject:{
            virtuals:false
        },
        timestamps:true
    }
);
export const HospitalModel = model<Hospital>('hospitals', HospitalSchema);
 