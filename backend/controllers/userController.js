const {User,validate} = require('../models/twilightUserModel');
const bcrypt = require('bcrypt');

const addUser = async (req,res) => {
    const {error} = validate(req.body);
    if (error) {
        return res.status(400).send({message: error.details[0].message});
    }
    const user = await User.findOne({email: req.body.email});
    if (user) {
        return res.status(403).send({message: "User with given email already exists!"});
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password,salt);
    let newUser = await new User({
        ...req.body,
        password: hashPassword,
    }).save();
    newUser.password=undefined;
    newUser.__v = undefined;
    res.status(200).send({data:newUser,message: "Account created successfully"});
}

const getAllUsers = async (req,res) => {
    const users_data = await User.find().select("-password -__v");
    res.status(200).send({data: users_data});
};

const getUser = async (req,res) => {
    const user = await User.findById(req.params.id);
    res.status(200).send({data: user});
};

const  updateUser = async (req,res) => {
    const user = await User.findOneAndUpdate(
        req.params.id,
        {$set: req.body},
        {new: true}
    );
    res.status(200).send({data: user,message: "Profile updated successfully"});
};

const deleteUser = async (req,res) => {
    await User.findByIdAndDelete(
        req.params.id
    );
    res.status(200).send({message: "Successfully deleted profile"});
};

module.exports = {
    addUser,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser
};