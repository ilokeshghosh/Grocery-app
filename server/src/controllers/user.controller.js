import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcrypt";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/User.model.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { TransPorter, SendEmail } from "../utils/Transpoter.js";
import { ResetPasswordTemplate } from "../utils/EmailTemplate/ResetPasswordTemplate.js";
import { PasswordUpdateTemplate } from "../utils/EmailTemplate/PasswordUpdateTemplate.js";
import { AccountVerifactionSucessFull } from "../utils/EmailTemplate/AccountVerifactionSucessFull.js";
import { AddMinutesToDate, generateOTP } from "../utils/Otpgenrate.js";
import { log } from "console";

const options = {
  httpOnly: true,
  secure: true,
};

const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, mobile_number, password } = req.body;
  console.log(firstName, lastName, email, mobile_number, password);

  if (!firstName || !lastName || !email || !mobile_number || !password) {
    throw new ApiError(400, "All fields are required");
  }
  let firstNameavtar = firstName[0];
  let LastNameavtar = lastName[0];
  const avtar = `https://cloud.appwrite.io/v1/avatars/initials?name=${firstNameavtar}+${LastNameavtar}&width=80&height=80&project=console`;

  const existedUser = await User.findOne({ email });

  if (existedUser) {
    throw new ApiError(400, "User with email already exists");
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    avatar: {
      public_id: "",
      url: avtar,
    },
    mobile_number,
    password,
  });

  const accessToken = await user.generateAccessToken();

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        { user, accessToken },
        "User registered Successfully"
      )
    );
});

const sendOtp = asyncHandler(async (req, res) => {
  const id = req.user?._id;
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(400, "Somthing went Wrong!");
  }
  const YOUROTP = generateOTP();
  const expiredOtp = AddMinutesToDate();
  console.log(YOUROTP);
  const UserEmail = user.email;
  // await SendEmail(UserEmail, "OTP", `Your OTP is ${YOUROTP}`);
  const SendOtp = await User.findOneAndUpdate(
    { email: UserEmail },
    { verifyCode: YOUROTP, verifyCodeExpiryDate: expiredOtp }
  );

  return res.status(201).json(new ApiResponse(200, "Send Otp"));
});
const accountverify = asyncHandler(async (req, res) => {
  const id = req.user?._id;
  const { otp } = req.body;
  if (!otp) {
    throw new ApiError(200, "OTP are required");
  }

  const user = await User.findById(id).select(
    "email account_email_Verified verifyCode verifyCodeExpiryDate"
  );
  if (!user) {
    throw new ApiError(400, "Somthing went Wrong!");
  }
  console.log(user);
  const UserEmail = user.email;

  if (user.verifyCodeExpiryDate >= new Date().getTime()) {
    if (user.verifyCode == otp) {
      await User.findOneAndUpdate(
        { email: UserEmail },
        { account_email_Verified: true }
      );
    } else {
      throw new ApiError(400, "plese enter valid OTP");
    }
  } else {
    throw new ApiError(400, "Your OTP expired");
  }

  return res.status(201).json(new ApiResponse(200, "Otp Verify"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email && !password) {
    throw new ApiError(400, "Email or Password is requair");
  }
  const user = await User.findOne({
    email,
  });

  if (!user) {
    throw new ApiError(404, "User Does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(404, "Password inCorrect");
  }

  const accessToken = await user.generateAccessToken();

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
        },
        "user loggin Succesfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (oldPassword === newPassword) {
    throw new ApiError(
      400,
      "Plese cheak your password both password are same "
    );
  }

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  // const { fullName, email, bio } = req.body;
  const { firstName, lastName, mobile_number } = req.body;

  if (!firstName && !lastName && !mobile_number) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        firstName,
        lastName,
        mobile_number,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }
  const Get_User_avtar = await User.findById(req.user);

  const deleteCloudanariy = await deleteFromCloudinary(
    Get_User_avtar?.avatar?.public_id
  );

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(400, "Error while uploading on avatar");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: {
          public_id: avatar.public_id,
          url: avatar.url,
        },
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar image updated successfully"));
});

const ForgetPasswordUpdate = asyncHandler(async (req, res) => {
  // const { token } = req.params;
  const { password, token } = req.body;
  // const password = "s123";
  // const token =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Ikt1bWFyaGFyc2h2YXJkaGFuNDI2QGdtYWlsLmNvbSIsImlhdCI6MTcwODY3MTUxNSwiZXhwIjoxNzA4NjcxODE1fQ.qajC4qz2jvkuTdxVbsULOtT7DGEbRl7jgdRfyyeulZc";
  if (!token || !password) {
    throw new ApiError(401, "All Field Are Required");
  }
  const { email } = jwt.verify(token, process.env.RESET_SECRET_TOKEN);
  const hasPassword = await bcrypt.hash(password, 10);
  const user = await User.findOneAndUpdate(
    { email },
    { $set: { password: hasPassword } }
  );
  if (!user) {
    throw new ApiError(401, "Invalid Access Token");
  }
  await SendEmail(email, "Password Update SucessFull", PasswordUpdateTemplate);
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Email Send successfully"));
});
const ForgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  // const email = "Kumarharshvardhan426@gmail.com"

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  // const user = await User.findOne({email}).select("-password");
  const user = await User.findOne({ email }).select("-password");
  if (!user) {
    throw new ApiError(400, `User Does not exist from this ${email} `);
  }

  const Forget_Token = await user.GENERATE_RESET_PASSWORD_TOKEN();
  if (!Forget_Token) {
    throw new ApiError(400, "Somthing Went Worng For Genrating Forget Token");
  }

  const test = SendEmail(
    email,
    "Reset Pasword",

    `

    <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
        <!--100% body table-->
        <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
            style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
            <tr>
                <td>
                    <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                        align="center" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="height:80px;">&nbsp;</td>
                        </tr>
                        <tr>
                            <td style="text-align:center;">
                              <a href="https://rakeshmandal.com" title="logo" target="_blank">
                                <img width="60" src="https://i.ibb.co/hL4XZp2/android-chrome-192x192.png" title="logo" alt="logo">
                              </a>
                            </td>
                        </tr>
                        <tr>
                            <td style="height:20px;">&nbsp;</td>
                        </tr>
                        <tr>
                            <td>
                                <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                    style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                    <tr>
                                        <td style="height:40px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td style="padding:0 35px;">
                                            <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
                                                requested to reset your password</h1>
                                            <span
                                                style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                            <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                We cannot simply send you your old password. A unique link to reset your
                                                password has been generated for you. To reset your password, click the
                                                following link and follow the instructions.
                                            </p>
                                            <a href="${process.env.Cors_Origin}/password-reset-confirm?token=${Forget_Token}"
                                                style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset
                                                Password</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="height:40px;">&nbsp;</td>
                                    </tr>
                                </table>
                            </td>
                        <tr>
                            <td style="height:20px;">&nbsp;</td>
                        </tr>
                        <tr>
                            <td style="text-align:center;">
                                <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>www.Harshji.com</strong></p>
                            </td>
                        </tr>
                        <tr>
                            <td style="height:80px;">&nbsp;</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        <!--/100% body table-->
    </body>

    </html>`
  );

  return res.status(200).json(new ApiResponse(200, "Email Send successfully"));
});

export {
  registerUser,
  accountverify,
  loginUser,
  logoutUser,
  changeCurrentPassword,
  updateAccountDetails,
  updateUserAvatar,
  getCurrentUser,
  ForgetPassword,
  ForgetPasswordUpdate,
  sendOtp,
};

// 1720412432193
// 1719508071243
