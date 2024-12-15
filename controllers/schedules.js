import Schedules from "../models/schedules.js";
import Users from "../models/user.js";
import scheduleCron from "./utils/scheduleCron.js";
import tryCatch from "./utils/tryCatch.js";

// create Schedules
export const createSchedules = tryCatch(async (req, res) => {
  //Todo:  error handling

  let SchedulesPayload = req.body;
  // const Schedulescount = await Schedules.count();
  SchedulesPayload.addedBy = req.auth.user._id;
  // SchedulesPayload.sno = Schedulescount;
  
  const newSchedules = new Schedules(SchedulesPayload);

  await newSchedules.save();
  SchedulesPayload.emailBy = req.auth.user.email;
  scheduleCron([SchedulesPayload])
  res.status(200).json({ success: true, message: "Schedules added successfully" });
  
});

// create getSchedules
export const getSchedules = tryCatch(async (req, res) => {
  // console.log("req", req.query.page);

  let findData = {
    isDelete: false,
  };
  if (req.query.page) {
    // Parse page and limit from query parameters, with defaults
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
    const limit = parseInt(req.query.limit) || 8; // Default to 10 items per page

    // Calculate the number of items to skip
    const skip = (page - 1) * limit;

    // Query with pagination
    const Scheduless = await Schedules.find(findData)
      .populate([{ path: "addedBy", model: "users" }])
      .sort({ _id: -1 })
      .skip(skip) // Skip items for the current page
      .limit(limit); // Limit the number of items to fetch

    // Count total documents for pagination metadata
    const totalScheduless = await Schedules.countDocuments(findData);

    res.status(200).json({
      success: true,
      result: Scheduless,
      pagination: {
        totalItems: totalScheduless,
        currentPage: page,
        totalPages: Math.ceil(totalScheduless / limit),
        pageSize: limit,
      },
    });
  } else {
    const Scheduless = await Schedules.find(findData).populate([{ path: 'addedBy', model: 'users' }]).sort({ _id: -1 });
    res.status(200).json({
      success: true,
      result: Scheduless
    });
  }
  
});

//  delete Schedules
export const deleteSchedules = tryCatch(async (req, res) => {
  let updateData = {
    $set: { isDelete: true },
  };
  let findSchedules = {
    _id: req.params.schedulesId,
  };
  const c = await Schedules.updateOne(findSchedules, updateData);

  res
    .status(200)
    .json({
      success: true,
      message: "Schedules and all the related data deleted successfully",
    });
});

export const updateSchedules = tryCatch(async (req, res) => {
  let updateData = {
    $set: req.body,
  };
  let findSchedules = {
    _id: req.params.schedulesId,
  };
  const updatedSchedules = await Schedules.updateOne(findSchedules, updateData);
  let message = "Schedules edited successfully";

  if (req.body.isActive === false || req.body.isActive === true) {
    let findData = {
      schedulesId: req.params.schedulesId,
    };

    message = "Schedules status updated successfully and all its data are updated";
  }
  res.status(200).json({ success: true, message: message });
});
