import { Schema,model } from "mongoose";
export interface Users{
    id:string;
    name:string;
    password:string;
    role:string;
    email:string;
    bod:string;
    nic:string;
    occupation:string;
    gender:string;
    image:string;
    status:string; 
     
}
export const UsersSchema = new Schema<Users>(
    {
        name:{type:String, required:true},
        password:{type:String, required:true},
        role:{type:String, required:false},
        email:{type:String, required:true},
        bod:{type:String, required:false},
        nic:{type:String, required:false},
        occupation:{type:String, required:false},
        gender:{type:String, required:false},
        image:{type:String, required:false},
        status:{type:String, required:true},
         
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
export const UsersModel = model<Users>('users', UsersSchema);
 