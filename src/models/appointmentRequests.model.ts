import { Schema,model } from "mongoose";
export interface appointmentRequest{
    id:string;
    aprID:string;
    userID:string;
    docUUID:string;
    hospitalID:string;
    scheduled_time:string
    request_type :string; 
    notes:string; 
    created_at:string;  
     
}
export const appointmentRequestSchema = new Schema<appointmentRequest>(
    {
        aprID:{type:String, required:true},
        userID:{type:String, required:true},
        docUUID:{type:String, required:true}, 
        hospitalID:{type:String, required:true},
        scheduled_time:{type:String, required:true},  
        request_type :{type:String, required:false},
        notes:{type:String, required:false},  
        created_at:{type:String, required:false},  
         
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
export const appointmentRequestModel = model<appointmentRequest>('appointmentRequests', appointmentRequestSchema);
 