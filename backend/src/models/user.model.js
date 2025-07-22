import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,

      lowercase: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
      match: /^[a-zA-Z\s]+$/, // Only letters and spaces
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Basic email validation
    },
    profilePicture: {
      type: String,
      default: null, // Optional profile picture
    },
    accessToken: {
      type: String,
      select: false, // Do not return accessToken by default
    },
    refreshToken: {
      type: String,
      select: false, // Do not return refreshToken by default
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
    versionKey: false, // Disable __v field
  }
);

//hash password
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

//pre to set initial profile picure
userSchema.pre("save", function (next) {
  this.setInitialProfilePicture();
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

//method to set initial profile avatar
userSchema.methods.setInitialProfilePicture = function () {
  if (!this.profilePicture) {
    this.profilePicture = `https://api.dicebear.com/9.x/avataaars-neutral/svg?seed=${this.username}`;
  }
};

const User = mongoose.model("User", userSchema);
export default User;
