import { ApiError, ApiResponse } from "../utils/apiUtil.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateUserAccessToken = async (userid) => {
  try {
    const user = await User.findById(userid);

    const accessToken = user.generateAccessToken();
    user.accessToken = accessToken;

    await user.save({ validateBeforeSave: false });

    return accessToken;
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating access token");
  }
};

const RegisterUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if ([username, password].some((field) => field?.trim() == "")) {
    throw new ApiError(400, "All fields are required.");
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw new ApiError(409, "User with username already exits.");
  }

  const newUser = await User.create({
    username,
    password,
  });

  const createdUser = await User.findById(newUser._id).select("-password -accessToken");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "New User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username && !password) {
    throw new ApiError(400, "username and email is required");
  }

  const user = await User.findOne({ username });

  if (!user) {
    throw new ApiError(404, "user does not exits");
  }

  const isPassowordCorrect = await user.isPasswordCorrect(password);

  if (!isPassowordCorrect) {
    throw new ApiError(401, "invalid user credentails");
  }

  const accessToken = await generateUserAccessToken(user?._id);
  console.log(accessToken);

  const loggedInUser = await User.findById(user._id).select("-password -accessToken");

  const options = {
    httpOnly: true,
    secure: true,
  };

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
        "User Login Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  console.log(req.user._id);
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        accessToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, user, "User Logged Out"));
});

export { RegisterUser, loginUser, logoutUser };
