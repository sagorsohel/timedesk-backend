import { User } from "../models/user.model";
import { sendError, sendSuccess } from "../utils/response";

export const signUp = async (req, res) => {
    const {name, email, password} = req.body;


    if(!name || !email || !password){
        return sendError(res, 400, "All fields are required");
    }

    const user = await User.create({name, email, password});
    sendSuccess(res, 201, "User created successfully", {name,email});
}