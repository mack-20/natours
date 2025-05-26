const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

exports.createUser = catchAsync(async (req, res) => {
  const data = req.body

  const user = await User.create(data)

  res.status(201).json({
    status: 'success',
    message: 'User created successfully',
    data: {
      user
    }
  })
})