import { compare } from 'bcrypt';
import { comparePassword, hashPassword } from '../helper/authHelper.js';
import userModel from '../models/userModel.js'
import JWT from "jsonwebtoken";

export const registerController = async (req,res) => {
    try {
        const {name ,email, password,phone, address} = req.body
        if(!name) return res.send({error : 'name is rerquire'})
        if(!email) return res.send({error : 'email is rerquire'})
        if(!password) return res.send({error : 'password is rerquire'})
        if(!phone) return res.send({error : 'phone is rerquire'})
        if(!address) return res.send({error : 'address is rerquire'})
        
        const existingUser = await userModel.findOne({email})
        if(existingUser){
            return res.send(200).send({
                success : true,
                message : 'already an user ,please login'
            })
        }

        const hashedPassword = await hashPassword(password)

        const user = await new userModel({name,email,phone,address,password:hashedPassword}).save()

        res.status(201).send({
            success : true,
            message : "user register succesfully",
            user
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success : false,
            message : "Error in registeration",
            error
        })
    }
};


export const loginController = async (req,res) => {
    try {
        
        const {email,password} = req.body

        if(!email || !password){
            return res.status(404).send({
                success : false,
                message : 'email or password invalid',

            })
        }
        
        const user =  await userModel.findOne({email})

        if(!user){
            return res.status(404).send({
                success : false,
                message : 'email not registered'
            })
        }

        const match = await comparePassword(password,user.password)

        if(!match){
            res.status(200).send({
                success : false,
                message : 'invalid password'
            })
        }

        const token = await JWT.sign({_id : user._id},process.env.JWT_SECRET,{
            expiresIn : "7d"
        })

        res.status(200).send({
            success : true,
            message : 'login successfully',
            user : {
                name : user.name,
                email : user.email,
                phone : user.phone,
                address : user.address,

            },token
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success : false,
            message : 'error in login',
            error
        })
    }
}

export const testController = (req,res) => {

    res.send("Protected route");

}