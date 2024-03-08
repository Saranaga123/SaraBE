import { Schema,model } from "mongoose";
export interface Orders{
    id:string;
    product:string; 
    model:string;
    billingAmount:string;
    mobile:string;
    email:string;
    post:string;
    add1:string;
    add2:string;
    add3:string;
    payMethod:string;
    name:string;  
    status:string; 
     
}
export const OrdersSchema = new Schema<Orders>(
    { 

        product:{type:String, required:true},
        model:{type:String, required:true},
        billingAmount:{type:String, required:true},
        mobile:{type:String, required:true},
        email:{type:String, required:true},
        post:{type:String, required:true},
        add1:{type:String, required:true},
        add2:{type:String, required:true},
        add3:{type:String, required:true},
        payMethod:{type:String, required:true},
        name:{type:String, required:true},
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
export const OrdersModel = model<Orders>('orders', OrdersSchema);
 