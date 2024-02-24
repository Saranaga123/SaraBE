import { Schema,model } from "mongoose";
export interface ProductSpec{
    id:string;  
    name:string;
    price:string;
    Processor:string;
    OperatingSystem :string;
    GraphicsCard:string;
    Display:string;
    Memory :string;
    Storage:string;
    Case:string;
    Keyboard:string;
    Camera:string;
    AudioAndSpeakers :string;
    Touchpad:string;
    Wireless :string;
    PrimaryBattery:string;
    BatteryLife :string;
    Power : string;
    Regulatory :string;
    Weight:string;
    image:string;
}
export const ProductSpecSchema = new Schema<ProductSpec>(
    {
        name:{type:String, required:true},
        price:{type:String, required:true},
        Processor:{type:String, required:true},
        OperatingSystem :{type:String, required:true},
        GraphicsCard:{type:String, required:true},
        Display:{type:String, required:true},
        Memory :{type:String, required:true},
        Storage:{type:String, required:true},
        Case:{type:String, required:true},
        Keyboard:{type:String, required:true},
        Camera:{type:String, required:true},
        AudioAndSpeakers :{type:String, required:true},
        Touchpad:{type:String, required:true},
        Wireless :{type:String, required:true},
        PrimaryBattery:{type:String, required:true},
        BatteryLife :{type:String, required:true},
        Power : {type:String, required:true},
        Regulatory :{type:String, required:true},
        Weight:{type:String, required:true},
        image:{type:String, required:true}
         
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
export const ProductSpecModel = model<ProductSpec>('ProductSpec', ProductSpecSchema);
 