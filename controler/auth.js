import {
  StatusCodes
} from "http-status-codes";

import bcrypt from "bcrypt";
import user from "../model/userSchema.js";
import posts from "../model/postSchema.js"
import jwt from "jsonwebtoken";
import { BadRequestError, UnAuthenticatedError } from "../error/index.js";

import cloudinary from "cloudinary";
import { promises as fs } from "fs";

const Register = async (req, res) => {
  const { firstname, lastname, email, password, Graduationyear, Stream } =
    req.body;

  const userAlreadyExists = await user.findOne({ email });
  if (userAlreadyExists) {
    throw new BadRequestError("Email already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(password, salt);

  const about = {
    Graduationyear: "",
    Specialization: "",
    Skills: "",
    Work: "",
    Clubs: "",
  
  };

  const newuser = new user({
    ...req.body,
    password: hashedpassword,
    About: { ...about, Graduationyear, Stream },
  });
  const saveduser = await newuser.save();
  res.status(StatusCodes.CREATED).json({ saveduser });
};

const Login = async (req, res) => {
  const { email, password } = req.body;
  const loggedinuser = await user.findOne({ email: email });

  if (!loggedinuser) {
    throw new UnAuthenticatedError("Invalid Credentials");
  }
  const isMatch = await bcrypt.compare(
    password.toString(),
    loggedinuser.password
  );

  if (!isMatch) {
    throw new UnAuthenticatedError("Invalid Credentials");
  }

  const token = jwt.sign({ id: loggedinuser._id }, process.env.JWT_SECRET);

  res.status(StatusCodes.OK).json({ token, loggedinuser });
};

const updateUser = async (req, res) => {
  const { id, about  } = req.body;

  const User = await user.findOne({ _id: id });
  const post=await posts.find({userid: id});

console.log(typeof post);


  if (req.file) {
    const response = await cloudinary.v2.uploader.upload(req.file.path); 

    await fs.unlink(req.file.path);

  
  await posts.updateMany({ userid: id }, { useravatar: response.secure_url });
  
      User.avatar = response.secure_url;
      User.avatarPublicId = response.public_id;
  
  }

const updatedAbout = JSON.parse(about);
console.log( updatedAbout);
  User.About = updatedAbout;

  await User.save();

  res
    .status(StatusCodes.OK)
    .json({ avatar:User.avatar ,about});
};

export { Register, Login, updateUser};