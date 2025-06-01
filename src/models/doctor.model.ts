import { Schema, model } from "mongoose";

export interface Doctor {
  id: string;
  UUID: string;
  name: string;
  gender: string;
  image: string;
  specialization: string;
  license_number: string;
  phone_number: string;
  hospital_id: string;
  available_slots: Array<{ day: string; time: string }>;
}

export const DoctorSchema = new Schema<Doctor>(
  {
    UUID: { type: String, required: true },
    name: { type: String, required: true },
    gender: { type: String, required: false },
    image: { type: String, required: false },
    specialization: { type: String, required: false },
    license_number: { type: String, required: true },
    phone_number: { type: String, required: true },
    hospital_id: { type: String, required: true },
    available_slots: {
        type: [
          {
            day: { type: String, required: true },
            time: { type: String, required: true },
          }
        ],
        required: true
      }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: false },
    timestamps: true,
  }
);

export const DoctorModel = model<Doctor>("doctors", DoctorSchema);
