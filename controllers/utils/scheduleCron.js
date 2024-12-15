import axios from "axios";
import cron from "node-cron";
import moment from "moment"

const scheduleCron = (scheduleData) => {
  scheduleData.forEach((schedule) => {
    const { employees, scheduleDatetime, comment, emailBy } = schedule;

    const scheduleTime = new Date(scheduleDatetime);

    // Calculate notification times
    const notifications = [
      { offset: 60, label: "1 hour" }, // 1 hour before
      { offset: 30, label: "30 minutes" }, // 30 minutes before
      { offset: 15, label: "15 minutes" }, // 15 minutes before
    ];

    notifications.forEach(({ offset, label }) => {
      const notificationTime = new Date(scheduleTime);
      notificationTime.setMinutes(notificationTime.getMinutes() - offset);

      // Check if the time is valid for scheduling
      if (notificationTime > new Date()) {
        const cronExpression = getCronExpression(notificationTime);

        cron.schedule(cronExpression, async () => {
          try {
            console.log(`Sending email (${label} before) to employees...`);
            let lambdaUrl = process.env.LAMBDA_URL
            // Send email using the Lambda function URL
            const response = await axios.post(
              lambdaUrl,
              {
                employees,
                comment,
                emailBy,
                notificationLabel: label,
                scheduleDatetime,
              }
            );
            console.log(`Email sent successfully`);
          } catch (error) {
            console.error("Failed to send email:", error.message);
          }
        });

        if( label === "15 minutes"){
          cron.schedule(cronExpression, async () => {
            try {
              console.log(`Sending email (${label} before) to Admin`);
              let lambdaUrl = process.env.LAMBDA_URL
              // Send email using the Lambda function URL
              const response = await axios.post(
                lambdaUrl,
                {
                  employees:[{ email: emailBy }],
                  comment:`All reminder emails have been sent for schedule`,
                  emailBy,
                  notificationLabel: label,
                  scheduleDatetime,
                }
              );
              console.log(`Email sent successfully`);
            } catch (error) {
              console.error("Failed to send email:", error.message);
            }
          });
        }

        console.log(
          `Cron scheduled for ${label} before ${moment(scheduleDatetime)}: ${cronExpression}`
        );
      }
    });
  });
};

// Helper to convert a Date object to a cron expression
const getCronExpression = (date) => {
  const seconds = date.getSeconds();
  const minutes = date.getMinutes();
  const hours = date.getHours();
  const dayOfMonth = date.getDate();
  const month = date.getMonth() + 1; // Months are 0-based
  const dayOfWeek = '*'; // Optional, can be left as '*' for all days

  return `${seconds} ${minutes} ${hours} ${dayOfMonth} ${month} ${dayOfWeek}`;
};

// // Example schedule data
// const scheduleData = [
//   {
//     employees: [
//       { name: "John Doe", email: "john.doe@example.com" },
//       { name: "Jane Smith", email: "jane.smith@example.com" },
//     ],
//     scheduleDatetime: "2024-12-15T10:30:20.124Z",
//     comment: "Reminder for the meeting",
//     addedBy: "67459c6eb7960ada8bc41269",
//     emailBy: "atiurrahman@gmail.com",
//   },
// ];

// Schedule the cron tasks
// scheduleCron(scheduleData);
export default scheduleCron;


// // Lambda function URL
// const lambdaUrl =
//   "https://vualmscd3key3hyfdfw4izhp6u0oxmfo.lambda-url.ap-south-1.on.aws/";

// // Sample data (Replace with your actual logic to get schedule and employees)
// const scheduleData = [
//   {
//     schedule_id: "123",
//     schedule_datetime: new Date(Date.now() + 3600 * 1000).toISOString(), // 1 hour from now
//     employees: [
//       { email: "employee1@example.com" },
//       { email: "employee2@example.com" },
//     ],
//     comment: "This is a reminder for your schedule.",
//   },
// ];

// // Helper to calculate reminders
// const calculateReminders = (scheduleDate) => {
  
//   const scheduleTime = new Date(moment(scheduleDate)).getTime();
//   console.log('...',moment(scheduleDate),scheduleTime)
//   return {
//     oneHourBefore: moment(new Date(scheduleTime - 60 * 60 * 1000)).toString(),
//     thirtyMinutesBefore: moment(new Date(scheduleTime - 30 * 60 * 1000)).toString(),
//     fifteenMinutesBefore: moment(new Date(scheduleTime - 15 * 60 * 1000)).toString(),
//   };
// };

// // Function to send email via Lambda
// const sendEmail = async (data) => {
//   try {
//     const response = await axios.post(lambdaUrl, data);
//     console.log("Email sent successfully:", response.data);
//   } catch (error) {
//     console.error("Error sending email:", error.message);
//   }
// };

// const scheduleCron = (scheduleData) => {
//   console.log('sche',scheduleData)
//   // Schedule Background Tasks
//   scheduleData.forEach((schedule) => {
//     const { schedule_id='122', scheduleDatetime, employees, comment, emailBy } =
//       schedule;

//     const { oneHourBefore, thirtyMinutesBefore, fifteenMinutesBefore } =
//       calculateReminders(scheduleDatetime);
//     console.log('jhy',oneHourBefore,thirtyMinutesBefore,fifteenMinutesBefore)
//     // Schedule email 1 hour before
//     cron.schedule(oneHourBefore, () => {
//       console.log(`Sending 1-hour reminder for schedule ID: ${schedule_id}`);
//       sendEmail({ schedule_id, employees, scheduleDatetime, comment });
//     });

//     // Schedule email 30 minutes before
//     cron.schedule(thirtyMinutesBefore, () => {
//       console.log(`Sending 30-minute reminder for schedule ID: ${schedule_id}`);
//       sendEmail({ schedule_id, employees, scheduleDatetime, comment });
//     });

//     // Schedule email 15 minutes before
//     cron.schedule(fifteenMinutesBefore, () => {
//       console.log(`Sending 15-minute reminder for schedule ID: ${schedule_id}`);
//       sendEmail({ schedule_id, employees, scheduleDatetime, comment });
//     });

//     // Schedule email to Scheduling Admin
//     cron.schedule(fifteenMinutesBefore, () => {
//       console.log(`Notifying Scheduling Admin for schedule ID: ${schedule_id}`);
//       sendEmail({
//         schedule_id,
//         employees: [{ email: emailBy }], // Replace with Scheduling Admin's email
//         scheduleDatetime,
//         comment: `All reminder emails have been sent for schedule ID: ${schedule_id}`,
//       });
//     });
//   });
// };

// export default scheduleCron;
