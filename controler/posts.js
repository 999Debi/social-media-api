import post from "../model/postSchema.js";
import user from "../model/userSchema.js";
import { StatusCodes }  from "http-status-codes";

import cloudinary from "cloudinary";
import { promises as fs } from "fs";

const createpost = async (req, res) => {
  const { userid, description ,useravatar} = req.body;

  const curuser = await user.findById(userid); 

    
          // multer add file propety to request object if client uploaded image i.e req.file exist
          // console.log(picture);
          // console.log(picturepath);
      console.log(req.file);
      const response = await cloudinary.v2.uploader.upload(req.file.path);
      await fs.unlink(req.file.path); //Delete local uploaded image after uploading it to cloud

        

  const newpost = new post({
    userid,
    firstname: curuser.firstname,
    lastname: curuser.lastname,
    location: curuser.location,
    description,
    useravatar: useravatar,
    avatar: response.secure_url,
    avatarPublicId: response.public_id,
    likes: {},
    comments: [],
  });
  await newpost.save();

  const posts = await post.find();

  res.status(StatusCodes.CREATED).json(posts.reverse());
};

const getfeedposts = async (req, res) => {
  const posts = await post.find();
  res.status(StatusCodes.OK).json(posts.reverse());
};

const getuserposts = async (req, res) => {
  const { userid } = req.params;
  const userpost = await post.find({ userid });

  res.status(StatusCodes.OK).json(userpost.reverse());
};

const likepost = async (req, res) => {
  const { id } = req.params;
  const { userid } = req.body;
  const userpost = await post.findById(id); //mongodb id of post
  const isLiked = userpost.likes.get(userid); // In likes array checkking,if user liked it or not

  if (isLiked) {
    userpost.likes.delete(userid);
  } else {
    userpost.likes.set(userid, true);
  }

  const updatedPost = await post.findByIdAndUpdate(
    id, //mongodb id of post
    { likes: userpost.likes },
    { new: true }
  );

  res.status(StatusCodes.OK).json(updatedPost);
};

const commentpost = async (req, res) => {
  const { id } = req.params;
  const { userid, comment } = req.body;
  // const commentId = new mongoose.Types.ObjectId(userid);
  const commenteduser = await user.findById(userid);
  const commentUserpath = commenteduser.avatar;
  const commentUsername = commenteduser.firstname;
  const postuser = await post.findById(id);
  const arr = [];
  arr.push(commentUsername);
  arr.push(comment);
  arr.push(commentUserpath);
  postuser.comments.unshift(arr);
  const userpost = await post.findByIdAndUpdate(
    { _id: id },
    {
      comments: postuser.comments,
    },
    {
      new: true,
    }
  );

  res.status(StatusCodes.OK).json(userpost);
};

export {  createpost,
  getfeedposts,
  getuserposts,
  likepost,
  commentpost};