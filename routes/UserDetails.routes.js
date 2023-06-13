// Update and add user details

const express = require("express");
const router = express.Router();

const {
  addUserDetails,
  updateUserDetails,
} = require("../controllers/UserDetails");
const { accessAuth } = require("../middlewares/AccessAuth");

router.post("/add", accessAuth, addUserDetails);

router.put("/update", accessAuth, updateUserDetails);
//   try {
//     const { userId } = req.params;
//     const {
//       brandName,
//       address,
//       pincode,
//       city,
//       state,
//       locality,
//       gstNo,
//       storePersonName,
//       contactNo,
//       gpsLocation,
//     } = req.body;

//     const updatedUserDetails = await UserDetails.findOneAndUpdate(
//       { userId },
//       {
//         brandName,
//         address,
//         pincode,
//         city,
//         state,
//         locality,
//         gstNo,
//         storePersonName,
//         contactNo,
//         gpsLocation,
//       },
//       { new: true }
//     );

//     if (!updatedUserDetails) {
//       return res.status(404).json({ message: "User details not found" });
//     }

//     res.status(200).json({
//       message: "User details updated successfully",
//       userDetails: updatedUserDetails,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "An error occurred" });
//   }
// });

module.exports = router;
