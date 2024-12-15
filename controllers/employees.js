import Employees from "../models/employees.js";
import Users from "../models/user.js";
import tryCatch from "./utils/tryCatch.js";

// create Employees
export const createEmployees = tryCatch(async (req, res) => {
  //Todo:  error handling

  let EmployeesPayload = req.body;
  
  const Employeescount = await Employees.count();
  EmployeesPayload.addedBy = req.auth.user._id;
 

  EmployeesPayload.sno = Employeescount + 1;
//   console.log(EmployeesPayload,Employeescount)

  const newEmployees = new Employees(EmployeesPayload);

  await newEmployees.save();
  res.status(200).json({ success: true, message: "Employees added successfully" });
});

// create getEmployees
export const getEmployees = tryCatch(async (req, res) => {
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
    const Employeess = await Employees.find(findData)
      .populate([{ path: "addedBy", model: "users" }])
      .sort({ _id: -1 })
      .skip(skip) // Skip items for the current page
      .limit(limit); // Limit the number of items to fetch

    // Count total documents for pagination metadata
    const totalEmployeess = await Employees.countDocuments(findData);

    res.status(200).json({
      success: true,
      result: Employeess,
      pagination: {
        totalItems: totalEmployeess,
        currentPage: page,
        totalPages: Math.ceil(totalEmployeess / limit),
        pageSize: limit,
      },
    });
  } else {
    const Employeess = await Employees.find(findData).populate([{ path: 'addedBy', model: 'users' }]).sort({ _id: -1 });
    res.status(200).json({
      success: true,
      result: Employeess
    });
  }
  
});

//  delete Employees
export const deleteEmployees = tryCatch(async (req, res) => {
  let updateData = {
    $set: { isDelete: true },
  };
  let findEmployees = {
    _id: req.params.employeesId,
  };
  const c = await Employees.updateOne(findEmployees, updateData);

  res
    .status(200)
    .json({
      success: true,
      message: "Employees and all the related data deleted successfully",
    });
});

export const updateEmployees = tryCatch(async (req, res) => {
  let updateData = {
    $set: req.body,
  };
  let findEmployees = {
    _id: req.params.employeesId,
  };
  const updatedEmployees = await Employees.updateOne(findEmployees, updateData);
  let message = "Employees edited successfully";

  if (req.body.isActive === false || req.body.isActive === true) {
    let findData = {
      EmployeesId: req.params.employeesId,
    };

    message = "Employees status updated successfully and all its data are updated";
  }
  res.status(200).json({ success: true, message: message });
});
