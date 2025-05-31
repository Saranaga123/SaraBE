import { Schema,model } from "mongoose";
export interface Specialization{
    id:string;
    type:string;
    specialization:string;  
     
}
export const SpecializationSchema = new Schema<Specialization>(
    { 
        type:{type:String, required:true},    
        specialization :{type:String, required:true},  
         
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
export const SpecializationModel = model<Specialization>('specialization', SpecializationSchema);
 