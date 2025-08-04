import { User } from "../models/user.model";

export const signUp = async (req, res) => {
    const {name, email, password} = req.body;


    if(!name || !email || !password){
        return res.status(400).json({
            success:false,
            message:"All fields are required",
        })
    }

    const user = await User.create({name, email, password});
    res.status(201).json({
        success:true,
        user,
    })
}