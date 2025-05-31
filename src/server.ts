import dotenv from "dotenv";
dotenv.config();
import express from "express"; 
import cors from "cors";
import { seedProdSpec, seedCCProduct, seedUser, seedDoctor,seedhospital,seedappointmentRequest, seedspecialization } from "./data";
import { seedOrders } from "./dataset2";
import { dbConnect } from "./configs/database.config";
import asyncHandler from 'express-async-handler';
import { Users, UsersModel } from "./models/User.model";
import bodyParser from "body-parser";
import { Product, ProductModel } from "./models/product.model";
import { Orders, OrdersModel } from "./models/order.model";
import { ProductSpec, ProductSpecModel } from "./models/prodSpec.model";
import { Doctor, DoctorModel } from "./models/doctor.model";
import { Hospital, HospitalModel } from "./models/hospital.model";
import { appointmentRequest, appointmentRequestModel } from "./models/appointmentRequests.model";
import { Specialization,SpecializationModel } from "./models/specialization.model";
dbConnect();
const app = express();
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    // Other CORS headers setup if needed...
    next();
});
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    parameterLimit: 100000,
    extended: true
}));
app.use(cors({
    credentials: true,
    origin: ["*"]
}));
const port = process.env.PORT || 666;
app.listen(port, () => {
    console.log("SaraBE Server is on http://localhost:" + port);
})

//User Related
app.post("/sarabe/login", asyncHandler(
    async (req, res) => {
        res.header('Access-Control-Allow-Origin', '*');
        const { id, pw } = req.body;
        const userEmail = id;
        const userPW = pw;
        const user = await UsersModel.findOne({ email: userEmail, password: pw });

        if (!user) {
            res.status(404).send("User not found");
            return;
        }

        res.send(user);
    }
));
app.get("/sarabe/destro", asyncHandler(
    async (req, res) => {
        await UsersModel.deleteMany();
        res.send(" All Data Erased ! ")
    }
))
app.get("/sarabe/seed", asyncHandler(
    async (req, res) => {
        const userCount = await UsersModel.countDocuments();
        if (userCount > 0) {
            await UsersModel.deleteMany();
            await UsersModel.create(seedUser)
        } else {
            await UsersModel.create(seedUser)
        }
        res.send("Data Seeding Done ! ")
    }
))
app.get("/sarabe/user", asyncHandler(
    async (req, res) => {
        res.header('Access-Control-Allow-Origin', '*');
        const users = await UsersModel.find();
        res.send(users)
    }
))
app.post("/sarabe/user/Create", asyncHandler(
    async (req, res, next) => {

        res.header('Access-Control-Allow-Origin', '*');

        const { name, password, role, email, bod, nic, occupation, gender, image, status } = req.body;
        const newuser: Users = {
            id: '',
            name: name,
            password: password,
            role: role,
            email: email,
            bod: bod,
            nic: nic,
            occupation: occupation,
            gender: gender,
            image: image,
            status: status
        }
        const existingUser = await UsersModel.findOne({ email: email });
        if (existingUser) {
            // Email already exists, return a response indicating the conflict
            res.json("already");
        } else {
            const dbUser = await UsersModel.create(newuser);
            res.json("done");
        }

    }
))
app.post("/sarabe/user/resetPassword", asyncHandler(
    async (req, res) => {
        const { id, password } = req.body;

        try {
            const user = await UsersModel.findOne({ id: id });

            if (!user) {
                res.status(404).send("User not found");
                return;
            }

            user.password = password;
            await user.save();

            res.json("Password reset successfully");
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).send("Server Error: " + error.message);
            } else {
                res.status(500).send("Unknown Server Error");
            }
        }
    }
));
app.post("/sarabe/user/update", asyncHandler(
    async (req, res) => {
        const { id, name, role, email, bod, nic, occupation, gender, image, status } = req.body;

        try {
            const user = await UsersModel.findOne({ email: email });

            if (!user) {
                res.status(404).send("User not found");
                return;
            }

            // Update user details
            user.name = name || user.name;
            user.role = role || user.role;
            user.email = email || user.email;
            user.bod = bod || user.bod;
            user.nic = nic || user.nic;
            user.occupation = occupation || user.occupation;
            user.gender = gender || user.gender;
            user.image = image || user.image;
            user.status = status || user.status;

            await user.save();

            res.json("User details updated successfully");
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).send("Server Error: " + error.message);
            } else {
                res.status(500).send("Unknown Server Error");
            }
        }
    }
));
app.get("/sarabe/user/destro", asyncHandler(
    async (req, res) => {
        const users = await UsersModel.deleteMany();
        res.send(users)
    }
))
app.get("/sarabe/user/seed", asyncHandler(
    async (req, res) => {
        const houserents = await UsersModel.countDocuments();
        if (houserents > 0) {
            res.send("seed is already done");
            return;
        }
        await UsersModel.create(seedUser)
        res.send("user seed is done");
    }
))
app.get("/sarabe/user/destro/:searchTerm", asyncHandler(
    async (req, res) => {
        const email = req.params.searchTerm;
        console.log("Received userid:", email);  // Log the user ID to debug

        try {
            // Fetch the user to ensure it exists before deleting
            const user = await UsersModel.findOne({ email: email });

            if (!user) {
                res.status(404).send("User not found");
                return;
            }

            const prodResult = await UsersModel.deleteOne({ email: email });

            res.json({
                productDeleted: prodResult,
            });
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).send("Server Error: " + error.message);
            } else {
                res.status(500).send("Unknown Server Error");
            }
        }
    }
));
app.get("/sarabe/user/:email", asyncHandler(
    async (req, res) => {
        res.header('Access-Control-Allow-Origin', '*');
        const userEmail = req.params.email;
        const user = await UsersModel.findOne({ email: userEmail });

        if (!user) {
            res.status(404).send("User not found");
            return;
        }

        res.send(user);
    }
));
app.get("/sarabe/doctor", asyncHandler(
    async (req, res) => {
        res.header('Access-Control-Allow-Origin', '*');
        const doctor = await DoctorModel.find();
        res.send(doctor)
    }
))
app.post("/sarabe/doctor/Create", asyncHandler(
    async (req, res, next) => {

        res.header('Access-Control-Allow-Origin', '*');

        const { UUID, name, specialization, license_number, phone_number, hospital_id, gender, image } = req.body;
        const newdoctor: Doctor = {
            id: '',
            UUID: UUID,
            name: name,
            gender: gender,
            image: image,
            specialization: specialization,
            license_number: license_number,
            phone_number: phone_number,
            hospital_id: hospital_id
        }
        const existingDoctor = await DoctorModel.findOne({ UUID: UUID });
        if (existingDoctor) {
            // Email already exists, return a response indicating the conflict
            res.json("already");
        } else {
            const dbUser = await DoctorModel.create(newdoctor);
            res.json("done");
        }

    }
))
app.post("/sarabe/doctor/update", asyncHandler(
    async (req, res) => {
        const { UUID, name, specialization, license_number, phone_number, hospital_id, gender, image } = req.body;

        try {
            const doctor = await DoctorModel.findOne({ UUID: UUID });

            if (!doctor) {
                res.status(404).send("User not found");
                return;
            }

            // Update user details
            doctor.UUID = UUID || doctor.UUID;
            doctor.name = name || doctor.name;
            doctor.gender = gender || doctor.gender;
            doctor.image = image || doctor.image;
            doctor.specialization = specialization || doctor.specialization;
            doctor.license_number = license_number || doctor.license_number;
            doctor.phone_number = phone_number || doctor.phone_number;
            doctor.hospital_id = hospital_id || doctor.hospital_id;
            await doctor.save();

            res.json("User details updated successfully");
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).send("Server Error: " + error.message);
            } else {
                res.status(500).send("Unknown Server Error");
            }
        }
    }
));
app.get("/sarabe/doctor/destro", asyncHandler(
    async (req, res) => {
        const doctor = await DoctorModel.deleteMany();
        res.send(doctor)
    }
))
app.get("/sarabe/doctor/seed", asyncHandler(
    async (req, res) => {
        const houserents = await DoctorModel.countDocuments();
        if (houserents > 0) {
            res.send("seed is already done");
            return;
        }
        await DoctorModel.create(seedDoctor)
        res.send("doctors seed is done");
    }
))
app.get("/sarabe/doctor/:UUID", asyncHandler(async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');

    try {
        const UUID = req.params.UUID;
        const doctor = await DoctorModel.find({ UUID: UUID });

        if (!doctor || doctor.length === 0) {
            res.status(404).send("doctor not found");
            return;
        }

        res.send(doctor);
    } catch (error) {
        console.error("Error retrieving doctor:", error);
        res.status(500).send("Internal Server Error");
    }
}));
app.get("/sarabe/doctor/destro/:searchTerm", asyncHandler(
    async (req, res) => {
        const email = req.params.searchTerm;
        console.log("Received doctorid:", email);  // Log the user ID to debug

        try {
            // Fetch the user to ensure it exists before deleting
            const doctor = await DoctorModel.findOne({ email: email });

            if (!doctor) {
                res.status(404).send("doctorid not found");
                return;
            }

            const prodResult = await DoctorModel.deleteOne({ email: email });

            res.json({
                productDeleted: prodResult,
            });
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).send("Server Error: " + error.message);
            } else {
                res.status(500).send("Unknown Server Error");
            }
        }
    }
));
app.get("/sarabe/doctor/:UUID", asyncHandler(
    async (req, res) => {
        res.header('Access-Control-Allow-Origin', '*');
        const doctorUUID = req.params.UUID;
        const doctor = await DoctorModel.findOne({ UUID: doctorUUID });

        if (!doctor) {
            res.status(404).send("User not found");
            return;
        }

        res.send(doctor);
    }
));
app.get("/sarabe/hospital", asyncHandler(
    async (req, res) => {
        res.header('Access-Control-Allow-Origin', '*');
        const hospital = await HospitalModel.find();
        res.send(hospital)
    }
))
app.post("/sarabe/hospital/Create", asyncHandler(
    async (req, res, next) => {

        res.header('Access-Control-Allow-Origin', '*');

        const { hospitalID, name, location, image, email, license_number, phone_number } = req.body;
        const newhospital: Hospital = {
            id: '',
            hospitalID: hospitalID,
            name: name,
            location: location,
            image: image,
            email: email,
            license_number: license_number,
            phone_number: phone_number
        }
        const existinghospital = await HospitalModel.findOne({ hospitalID: hospitalID });
        if (existinghospital) {
            // Email already exists, return a response indicating the conflict
            res.json("already");
        } else {
            const dbhos = await HospitalModel.create(newhospital);
            res.json("done");
        }

    }
))
app.get("/sarabe/hospital/:hospitalID", asyncHandler(
    async (req, res) => {
        res.header('Access-Control-Allow-Origin', '*');
        const hospitalID = req.params.hospitalID;
        const hospital = await HospitalModel.findOne({ hospitalID: hospitalID });

        if (!hospital) {
            res.status(404).send("User not found");
            return;
        }

        res.send(hospital);
    }
));
app.post("/sarabe/hospital/update", asyncHandler(
    async (req, res) => {
        const { hospitalID, name, location, image, email, license_number, phone_number } = req.body;

        try {
            const hospital = await HospitalModel.findOne({ hospitalID: hospitalID });

            if (!hospital) {
                res.status(404).send("hospitalID not found");
                return;
            }

            // Update user details
            hospital.hospitalID = hospitalID || hospital.hospitalID;
            hospital.name = name || hospital.name;
            hospital.location = location || hospital.location;
            hospital.image = image || hospital.image;
            hospital.email = email || hospital.email;
            hospital.license_number = license_number || hospital.license_number;
            hospital.phone_number = phone_number || hospital.phone_number; 
            await hospital.save();

            res.json("User details updated successfully");
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).send("Server Error: " + error.message);
            } else {
                res.status(500).send("Unknown Server Error");
            }
        }
    }
));
app.get("/sarabe/hospital/destro", asyncHandler(
    async (req, res) => {
        const hospital = await HospitalModel.deleteMany();
        res.send(hospital)
    }
))
app.get("/sarabe/hospital/seed", asyncHandler(
    async (req, res) => {
        const hospital = await HospitalModel.countDocuments();
        if (hospital > 0) {
            res.send("seed is already done");
            return;
        }
        await HospitalModel.create(seedhospital)
        res.send("hospital seed is done");
    }
))
app.get("/sarabe/hospital/destro/:searchTerm", asyncHandler(
    async (req, res) => {
        const hospitalID = req.params.searchTerm;
        console.log("Received hospitalID:", hospitalID);  // Log the user ID to debug

        try {
            // Fetch the user to ensure it exists before deleting
            const hospital = await HospitalModel.findOne({ hospitalID: hospitalID });

            if (!hospital) {
                res.status(404).send("hospitalID not found");
                return;
            }

            const prodResult = await HospitalModel.deleteOne({ hospitalID: hospitalID });

            res.json({
                productDeleted: prodResult,
            });
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).send("Server Error: " + error.message);
            } else {
                res.status(500).send("Unknown Server Error");
            }
        }
    }
));
app.get("/sarabe/hospital/:hospitalID", asyncHandler(
    async (req, res) => {
        res.header('Access-Control-Allow-Origin', '*');
        const hospitalID = req.params.UUID;
        const hospital = await HospitalModel.findOne({ hospitalID: hospitalID });

        if (!hospital) {
            res.status(404).send("User not found");
            return;
        }

        res.send(hospital);
    }
));
app.get("/sarabe/appointmentRequest", asyncHandler(
    async (req, res) => {
        res.header('Access-Control-Allow-Origin', '*');
        const appointmentRequest = await appointmentRequestModel.find();
        res.send(appointmentRequest)
    }
))
app.post("/sarabe/appointmentRequest/Create", asyncHandler(
    async (req, res, next) => {

        res.header('Access-Control-Allow-Origin', '*');

        const { aprID, userID, docUUID, hospitalID, scheduled_time,request_type, notes,created_at } = req.body;
        const appointmentRequest: appointmentRequest = {
            id: '',
            aprID: aprID,
            userID: userID,
            docUUID: docUUID,
            hospitalID: hospitalID,
            scheduled_time: scheduled_time,
            request_type: request_type,
            notes: notes,
            created_at: created_at
        }
        const existingappointmentRequest = await appointmentRequestModel.findOne({ hospitalID: hospitalID });
        if (existingappointmentRequest) {
            // Email already exists, return a response indicating the conflict
            res.json("already");
        } else {
            const dbappointmentRequest = await appointmentRequestModel.create(appointmentRequest);
            res.json("done");
        }

    }
))
app.post("/sarabe/appointmentRequest/update", asyncHandler(
    async (req, res) => {
        const { aprID, userID, docUUID, hospitalID, scheduled_time, request_type, notes,created_at } = req.body;

        try {
            const appointmentRequest = await appointmentRequestModel.findOne({ aprID: aprID });

            if (!appointmentRequest) {
                res.status(404).send("hospitalID not found");
                return;
            }

            // Update user details
            appointmentRequest.aprID = aprID || appointmentRequest.aprID;
            appointmentRequest.userID = userID || appointmentRequest.userID;
            appointmentRequest.docUUID = docUUID || appointmentRequest.docUUID;
            appointmentRequest.hospitalID = hospitalID || appointmentRequest.hospitalID;
            appointmentRequest.scheduled_time = scheduled_time || appointmentRequest.scheduled_time;
            appointmentRequest.request_type = request_type || appointmentRequest.request_type;
            appointmentRequest.notes = notes || appointmentRequest.notes; 
            appointmentRequest.created_at = created_at || appointmentRequest.created_at; 
            await appointmentRequest.save();

            res.json("appointmentRequest details updated successfully");
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).send("Server Error: " + error.message);
            } else {
                res.status(500).send("Unknown Server Error");
            }
        }
    }
));
app.get("/sarabe/appointmentRequest/destro", asyncHandler(
    async (req, res) => {
        const appointmentRequest = await appointmentRequestModel.deleteMany();
        res.send(appointmentRequest)
    }
))
app.get("/sarabe/appointmentRequest/seed", asyncHandler(
    async (req, res) => {
        const appointmentRequest = await appointmentRequestModel.countDocuments();
        if (appointmentRequest > 0) {
            res.send("seed is already done");
            return;
        }
        await appointmentRequestModel.create(seedappointmentRequest)
        res.send("appointmentRequest seed is done");
    }
))
app.get("/sarabe/appointmentRequest/destro/:searchTerm", asyncHandler(
    async (req, res) => {
        const aprID = req.params.searchTerm;
        console.log("Received aprID:", aprID);  // Log the user ID to debug

        try {
            // Fetch the user to ensure it exists before deleting
            const appointmentRequest = await appointmentRequestModel.findOne({ aprID: aprID });

            if (!appointmentRequest) {
                res.status(404).send("appointmentRequest not found");
                return;
            }

            const prodResult = await appointmentRequestModel.deleteOne({ aprID: aprID });

            res.json({
                productDeleted: prodResult,
            });
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).send("Server Error: " + error.message);
            } else {
                res.status(500).send("Unknown Server Error");
            }
        }
    }
));
app.get("/sarabe/appointmentRequest/:aprID", asyncHandler(
    async (req, res) => {
        res.header('Access-Control-Allow-Origin', '*');
        const aprID = req.params.aprID;
        const appointmentRequest = await HospitalModel.findOne({ aprID: aprID });

        if (!appointmentRequest) {
            res.status(404).send("User not found");
            return;
        }

        res.send(appointmentRequest);
    }
));
//Ecom related 
//Ecom Product related 
app.get("/sarabe/prod/destro", asyncHandler(
    async (req, res) => {
        const prod = await ProductModel.deleteMany();
        const prodspec = await ProductSpecModel.deleteMany()
        res.send(prod)
        res.send(prodspec)
    }
))
app.get("/sarabe/prod/seed", asyncHandler(
    async (req, res) => {
        const prod = await ProductModel.countDocuments();
        if (prod > 0) {
            res.send("seed is already done");
            return;
        }
        await ProductModel.create(seedCCProduct)
        await ProductSpecModel.create(seedProdSpec)
        res.send("Product seed is done");
    }
))
app.post("/sarabe/prod/Create", asyncHandler(
    async (req, res, next) => {

        res.header('Access-Control-Allow-Origin', '*');

        const { name, userid, buyerid, description, price, available, status, image, category } = req.body;
        const newproduct: Product = {
            id: '',
            name: name,
            userid: userid,
            buyerid: buyerid,
            description: description,
            price: price,
            available: available,
            status: status,
            image: image,
            category: category
        }
        const existingProd = await ProductModel.findOne({ name: name });
        if (existingProd) {
            // Email already exists, return a response indicating the conflict
            res.json("already");
        } else {
            const dbUser = await ProductModel.create(newproduct);
            res.json("done");
        }

    }
))
app.post("/sarabe/proddata/update/:prodId", asyncHandler(
    async (req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        const prodId = req.params.prodId;
        const { name, userid, buyerid, description, price, available, status, image, category } = req.body;

        const newProduct: Product = {
            id: '',
            name: name,
            userid: userid,
            buyerid: buyerid,
            description: description,
            price: price,
            available: available,
            status: status,
            image: image,
            category: category
        }

        try {
            const existingProd = await ProductModel.findOne({ name: prodId });
            if (existingProd) {
                // Update the existing product details
                await ProductModel.updateOne({ name: prodId }, newProduct);
                res.json("updated");
            } else {
                // Create a new product
                const dbUser = await ProductModel.create(newProduct);
                res.json("created");
            }
        } catch (error) {
            next(error); // Pass the error to the error handling middleware
        }
    }
));
app.post("/sarabe/prodspec/Create", asyncHandler(
    async (req, res, next) => {

        res.header('Access-Control-Allow-Origin', '*');

        const { name, price, Processor, OperatingSystem, GraphicsCard, Display, Memory, Storage, Case, Keyboard, Camera, AudioAndSpeakers, Touchpad, Wireless, PrimaryBattery, Power
            , Regulatory, BatteryLife, Weight, image, image2, image3 } = req.body;
        const newproduct: ProductSpec = {
            id: '',
            name: name,
            price: price,
            Processor: Processor,
            OperatingSystem: OperatingSystem,
            GraphicsCard: GraphicsCard,
            Display: Display,
            Memory: Memory,
            Storage: Storage,
            Case: Case,
            Keyboard: Keyboard,
            Camera: Camera,
            AudioAndSpeakers: AudioAndSpeakers,
            Touchpad: Touchpad,
            Wireless: Wireless,
            PrimaryBattery: PrimaryBattery,
            BatteryLife: BatteryLife,
            Power: Power,
            Regulatory: Regulatory,
            Weight: Weight,
            image: image,
            image2: image2,
            image3: image3,
        }
        const existingProd = await ProductSpecModel.findOne({ name: name });
        if (existingProd) {
            // Email already exists, return a response indicating the conflict
            res.json("already");
        } else {
            const dbUser = await ProductSpecModel.create(newproduct);
            res.json("done");
        }

    }
))
app.post("/sarabe/prodspec/Update/:prodId", asyncHandler(
    async (req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        const prodId = req.params.prodId;
        const {
            name, price, Processor, OperatingSystem, GraphicsCard, Display, Memory, Storage, Case, Keyboard, Camera, AudioAndSpeakers, Touchpad, Wireless, PrimaryBattery, Power, Regulatory, BatteryLife, Weight, image, image2, image3
        } = req.body;

        // Check if the product exists
        const existingProd = await ProductSpecModel.findOne({ name: prodId });

        if (!existingProd) {
            // Product does not exist, return a response indicating the conflict
            res.json("not_found");
        } else {
            // Update the existing product
            existingProd.price = price;
            existingProd.Processor = Processor;
            existingProd.OperatingSystem = OperatingSystem;
            existingProd.GraphicsCard = GraphicsCard;
            existingProd.Display = Display;
            existingProd.Memory = Memory;
            existingProd.Storage = Storage;
            existingProd.Case = Case;
            existingProd.Keyboard = Keyboard;
            existingProd.Camera = Camera;
            existingProd.AudioAndSpeakers = AudioAndSpeakers;
            existingProd.Touchpad = Touchpad;
            existingProd.Wireless = Wireless;
            existingProd.PrimaryBattery = PrimaryBattery;
            existingProd.BatteryLife = BatteryLife;
            existingProd.Power = Power;
            existingProd.Regulatory = Regulatory;
            existingProd.Weight = Weight;
            existingProd.image = image;
            existingProd.image2 = image2;
            existingProd.image3 = image3;

            // Save the updated product
            await existingProd.save();

            res.json("updated");
        }
    }
));
app.get("/sarabe/prod", asyncHandler(
    async (req, res) => {
        res.header('Access-Control-Allow-Origin', '*');
        const prod = await ProductModel.find();
        res.send(prod)
    }
))
app.get("/sarabe/prod/:prod", asyncHandler(
    async (req, res) => {
        res.header('Access-Control-Allow-Origin', '*');
        const prod = req.params.prod;
        const regex = new RegExp(prod, 'i'); // 'i' flag for case-insensitive search

        // Find users where the email partially matches
        const prods = await ProductSpecModel.find({ name: { $regex: regex } });

        if (!prods || prods.length === 0) {
            res.status(404).send("Product not found");
            return;
        }

        res.send(prods); // Send matching users' details as the response
    }
));
app.get("/sarabe/proddata/:prod", asyncHandler(
    async (req, res) => {
        res.header('Access-Control-Allow-Origin', '*');
        const prod = req.params.prod;
        const regex = new RegExp(prod, 'i'); // 'i' flag for case-insensitive search

        // Find users where the email partially matches
        const prods = await ProductModel.find({ name: { $regex: regex } });

        if (!prods || prods.length === 0) {
            res.status(404).send("Product not found");
            return;
        }

        res.send(prods); // Send matching users' details as the response
    }
));
app.get("/sarabe/prod/destro/:prod", asyncHandler(
    async (req, res) => {
        const prodname = req.params.prod;

        try {
            const prodResult = await ProductModel.deleteOne({ name: prodname });
            const prodspecResult = await ProductSpecModel.deleteMany({ name: prodname }); // Assuming there is a field productId in ProductSpecModel

            res.json({
                productDeleted: prodResult,
                productSpecsDeleted: prodspecResult
            });
        } catch (error) {
            res.status(404).send("Product not found:" + error);
            res.status(500).send("Server Error:" + error);
        }
    }
));
app.post("/sarabe/order/Create", asyncHandler(
    async (req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        const { date, product, name, model, billingAmount, units, unitprice, mobile, email, post, add1, add2, add3, payMethod, status } = req.body;
        const newOrder: Orders = {
            date: date,
            product: product,
            name: name,
            model: model,
            billingAmount: billingAmount,
            units: units,
            unitprice: unitprice,
            mobile: mobile,
            email: email,
            post: post,
            add1: add1,
            add2: add2,
            add3: add3,
            payMethod: payMethod,
            status: status,
            id: ""
        }
        const dbOrder = await OrdersModel.create(newOrder);
        res.json(dbOrder); // Send the created order as JSON response
    }
));
app.post("/sarabe/order/Update/:orderId", asyncHandler(
    async (req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');

        const orderId = req.params.orderId;
        const { date, product, name, model, billingAmount, units, unitprice, mobile, email, post, add1, add2, add3, payMethod, status } = req.body;

        // Create an object with the updated order details
        const updatedOrder = {
            date: date,
            product: product,
            name: name,
            model: model,
            billingAmount: billingAmount,
            units: units,
            unitprice: unitprice,
            mobile: mobile,
            email: email,
            post: post,
            add1: add1,
            add2: add2,
            add3: add3,
            payMethod: payMethod,
            status: status
        };

        // Update the order in the database
        const dbOrder = await OrdersModel.findByIdAndUpdate(orderId, updatedOrder, { new: true });

        if (!dbOrder) {
            // If the order with the specified ID is not found, send a 404 response
            res.status(404).json({ error: 'Order not found' });
        } else {
            // Send the updated order as a JSON response
            res.json(dbOrder);
        }

        // Ensure to return a Promise<void>
        return Promise.resolve();
    }
));
app.delete("/sarabe/order/delete/:orderId", asyncHandler(

    async (req, res, next) => {
        console.log("executing delete");
        res.header('Access-Control-Allow-Origin', '*');

        const orderId = req.params.orderId;

        const dbOrder = await OrdersModel.findByIdAndDelete(orderId);

        if (!dbOrder) {
            // If the order with the specified ID is not found, send a 404 response
            res.status(404).json({ error: 'Order not found' });
        } else {
            // Send the updated order as a JSON response
            res.json({ status: 'Success' });
        }

        // Ensure to return a Promise<void>
        return Promise.resolve();
    }
));
app.get("/sarabe/orders", asyncHandler(
    async (req, res) => {
        res.header('Access-Control-Allow-Origin', '*');
        const orders = await OrdersModel.find();
        res.send(orders)
    }
))
app.get("/sarabe/order/:email", asyncHandler(async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');

    try {
        const userEmail = req.params.email;
        const orders = await OrdersModel.find({ email: userEmail });

        if (!orders || orders.length === 0) {
            res.status(404).send("Orders not found");
            return;
        }

        res.send(orders);
    } catch (error) {
        console.error("Error retrieving orders:", error);
        res.status(500).send("Internal Server Error");
    }
}));
app.get("/sarabe/orders/destro", asyncHandler(async (req, res) => {
    try {
        const result = await OrdersModel.deleteMany();
        res.send("All Data Erased!");
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}))
app.get("/sarabe/orders/seed", asyncHandler(
    async (req, res) => {
        const orders = await OrdersModel.countDocuments();
        if (orders > 0) {
            res.send("seed is already done");
            return;
        }
        await OrdersModel.create(seedOrders)
        res.send("order seed is done");
        console.log("order seed is done")
    }
))
//Ecom Medicall related 
app.get("/sarabe/specialization", asyncHandler(
    async (req, res) => {
        res.header('Access-Control-Allow-Origin', '*');
        const specialization = await SpecializationModel.find();
        res.send(specialization)
    }
))
app.post("/sarabe/specialization/Create", asyncHandler(
    async (req, res, next) => {

        res.header('Access-Control-Allow-Origin', '*');

        const { type, specialization } = req.body;
        const newspecialization: Specialization = {
            type: type,
            specialization: specialization,
            id: ""
        }
        const existingspecialization = await HospitalModel.findOne({ type: type });
        if (specialization) {
            // Email already exists, return a response indicating the conflict
            res.json("already");
        } else {
            const dbhos = await HospitalModel.create(newspecialization);
            res.json("done");
        }

    }
))
app.post("/sarabe/specialization/update", asyncHandler(
    async (req, res) => {
        const { type, specialization } = req.body;

        try {
            const dbspecialization = await SpecializationModel.findOne({ type: type });

            if (!dbspecialization) {
                res.status(404).send("specialization not found");
                return;
            }

            // Update user details
            specialization.type = type || specialization.type;
            specialization.specialization = specialization || specialization.specialization; 
            await specialization.save();

            res.json("User details updated successfully");
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).send("Server Error: " + error.message);
            } else {
                res.status(500).send("Unknown Server Error");
            }
        }
    }
));
app.get("/sarabe/specialization/destro", asyncHandler(
    async (req, res) => {
        const specialization = await SpecializationModel.deleteMany();
        res.send(specialization)
    }
))
app.get("/sarabe/specialization/seed", asyncHandler(
    async (req, res) => {
        const specialization = await SpecializationModel.countDocuments();
        if (specialization > 0) {
            res.send("seed is already done");
            return;
        }
        await SpecializationModel.create(seedspecialization)
        res.send("specialization seed is done");
    }
))
app.get("/sarabe/appointmentRequest/user/:userID", asyncHandler(async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');

    try {
        const userID = req.params.userID;
        const appointmentRequest = await appointmentRequestModel.find({ userID: userID });

        if (!appointmentRequest || appointmentRequest.length === 0) {
            res.status(404).send("appointmentRequest not found");
            return;
        }

        res.send(appointmentRequest);
    } catch (error) {
        console.error("Error retrieving orders:", error);
        res.status(500).send("Internal Server Error");
    }
}));