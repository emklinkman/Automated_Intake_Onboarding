// NeuroLoco Automated Onboarding Email script
// University of Michigan Robotics Department
// EK Klinkman
// Version 1.0 10.15.2024
// Version 1.1 10.16.2024 Moved global variables to beginning
// Version 1.2 04.02.2025 Added functions to send email to HR
// Version 1.3 05.14.2025 Commented out old functionality to send onboarding email to new personnel - replaced w/Slackbot 

///// New stuff
// Global Variables
const FORM_ID = "1k533tLcjujb0P3mJUiPTG5VuWwlKF0ojhaaRrw7pKP0";  // Replace with Form ID
const SHEET_ID = "1d5nM5QMJWwudZskRu_OyLfEBrwZsk75yHI5kKpbcN-o";  // Replace with Google Sheet ID
const SHEET_NAME = "Form Responses 1";  // Replace with sheet name
const HR_EMAIL = "emilykk@umich.edu";  // HR's email address
const CC_EMAILS = "emilykk@umich.edu";  // CC recipients
const TIMESTAMP_COLUMN = 19;  // Column where "Sent on <date>" is logged

// Apps script code
function sendHRNotification() {
  const form = FormApp.openById(FORM_ID);
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  const lastRow = sheet.getLastRow();
  const lastResponse = sheet.getRange(lastRow, 1, 1, sheet.getLastColumn()).getValues()[0];

  // Extract form fields (adjust column indices as needed); Column A = [0]
  const name = lastResponse[2];  // Assuming Name is in Column C
  const uniqname = lastResponse[3]; // uniqname in Column D
  const startDate = lastResponse[9];  // Start date in Column J
  const endDate = lastResponse[10]; // End Date in column K
  const sendToHR = lastResponse[12];  // Column N (Checkbox)
  const shortcode = lastResponse[14];  // Column 0
  const rateOfPay = lastResponse[15];  // Column P
  const maxHours = lastResponse[16]; // Column Q
  const notificationSent = lastResponse[TIMESTAMP_COLUMN - 1];  // Column ??? (Tracking email status)

  // Only send email if checkbox is "Yes" and timestamp is empty
  if (sendToHR === "Yes" && notificationSent === "") {
    const subject = "New Personnel Hiring - Neurobionics Lab";
    const body = `Hi Samantha,\n\n`
               + `The Neurobionics Lab is hiring a new personnel: ${name} (${uniqname}). `
               + `They will be starting on ${startDate}, end date: ${endDate}.\n`
               + `Their pay rate will be ${rateOfPay} per hour and they will be paid from ${shortcode} shortcode. `
               + `The max hours per week is ${maxHours}.\n\n`
               + `Please email emilykk@umich.edu and ejrouse@umich.edu with any questions. Thank you!`;

    // Send the email
    MailApp.sendEmail({
      to: HR_EMAIL,
      cc: CC_EMAILS,
      subject: subject,
      body: body
    });

    // Log timestamp
    sheet.getRange(lastRow, TIMESTAMP_COLUMN).setValue("Sent on " + new Date().toLocaleString());
  }
}

// ///// Old stuff
// Populate global variables
// var spreadsheetId = '1d5nM5QMJWwudZskRu_OyLfEBrwZsk75yHI5kKpbcN-o'; // Replace with spreadsheet ID***
// var sheetName = 'Form Responses 1'; // Specific sheet name***
// var labManagerEmail = "emilykk@umich.edu"; // Person to be notified of new hire***      
// var htmlTemplate = HtmlService.createTemplateFromFile('welcome_email.html'); // insert .html file of email to be sent to new hire***
// var emailBody = "Welcome to the NeuroLoco team! Important onboarding info inside" // fill with desired email text

// Apps script code
// function onFormSubmit(e) {
//   var sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
  
//   var lastRow = sheet.getLastRow(); // Get the last row with data
//   var dataRange = sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()); // Get the data starting from row 2 (assuming row 1 has headers)
//   var data = dataRange.getValues(); // Get all data in the range
  
//   Loop through each row of the sheet
//   data.forEach(function(rowData, rowIndex) {
//     var processed = rowData[11]; // Assuming column L (index 11) is the "Processed" column***
  
//     Check if the row has been processed
//     if (processed !== "Yes") {
//       var newHireName = rowData[2]; // Adjust column as needed (e.g., Name in column B)***
//       var newHireEmail = rowData[9].toString().trim(); // Column J for email, clean up spaces with trim()***
//       var mentorEmail = rowData[10].toString().trim(); // Column K for mentor email, clean up spaces with trim()***
//       var startDate = rowData[6]; // Adjust column for start date (e.g., column G)***

//     Log the email address for debugging
//       Logger.log('New Hire Email: ' + newHireEmail);
//       Logger.log('Mentor Email: ' + mentorEmail);
      
//       Check if the email address is valid
//      if (validateEmail(newHireEmail) && validateEmail(mentorEmail)) {
        
//         Load the HTML content from welcome-email.html and pass the newHireName to the template
//         htmlTemplate.newHireName = newHireName; // Pass the new hire's name into the HTML template
//         var htmlBody = htmlTemplate.evaluate().getContent();
        
//         Send HTML email to the new hire
//         GmailApp.sendEmail(newHireEmail, emailBody, "", {
//           htmlBody: htmlBody,
//           cc: mentorEmail // CC the mentor email
//         });
        
//         Notify lab manager
//         var managerSubject = "New Hire: NeuroLoco: " + newHireName; // change quote text with desired email subject
//         var managerBody = "A new hire has been added to the lab via Google Form. Please add them to: Mcommunity, Slack, NeuroLoco shared calendar, and GitHub.\n\nName: " + newHireName + "\nStart Date: " + startDate + "\nUM Email Address: " + newHireEmail; // change quote text with desired email subject + variables to include in report email

//         Send email to the lab manager
//         GmailApp.sendEmail(labManagerEmail, managerSubject, managerBody);
        
//         Mark the row as processed in the "Processed" column (column L)
//         sheet.getRange(rowIndex + 2, 12).setValue("Yes"); // Write "Yes" in column L (index 11)
//       } else {
//         Logger.log('Invalid email address: ' + newHireEmail); // Log invalid email
//       }
//     }
//   });
// }

// Function to validate email format
// function validateEmail(email) {
//   var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return emailPattern.test(email);
// }