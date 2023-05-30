import mongoose, { Model, Schema } from "mongoose";
import { IUser } from "../interfaces/user.interface";

const User: Model<IUser> = mongoose.model('User', new Schema<IUser>({
    pseudo: {
        type: String,
        require: true
    },
    email: {
        type: String, 
        required: true
    },
    password: {
        type: String, 
        required: true
    }
}));

export default User;
