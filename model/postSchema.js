import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userid: {
      type: String,
      required: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    location: String,

    description: String,
  
    useravatar:String,
    avatar: String,
    avatarPublicId: String,
    
    likes: {
      //it is an object
      type: Map,
      of: Boolean,
    },
    comments: {
      type: Array,
      default: [], //object,array of comment of that id
    },
  },
  { timestamps: true }
);
const post = mongoose.model("post", postSchema);
export default post;
