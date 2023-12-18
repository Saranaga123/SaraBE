import { Schema,model } from "mongoose";
export interface Product{
    id:string;
    name:string; 
    userid:string;
    buyerid:string;
    description:string;
    available:string;
    category:string;
    status:string;     
    image:string;
     
}
export const ProductsSchema = new Schema<Product>(
    {
        name:{type:String, required:true},
        userid:{type:String, required:true},
        buyerid:{type:String, required:false},
        description:{type:String, required:true},
        available:{type:String, required:false},
        status:{type:String, required:false}, 
        image:{type:String, required:false},
        category:{type:String, required:false},
         
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
export const ProductModel = model<Product>('users', ProductsSchema);
 