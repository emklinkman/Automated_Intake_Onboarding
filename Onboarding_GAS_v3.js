// NeuroLoco Automated Onboarding Email script
// University of Michigan Robotics Department
// EK Klinkman
// Version 2.0 07.31.2025 Moved front-end to HTML hosted on NB website & kept back-end on GAS. Browser blocks data fetch request due to CORS policy error. Apps Script web apps do not respond with Access-Control-Allow-Origin. Now I have 2 options: (1) Switch BACK to google form and keep back-end the same, or (2) host the HTML front end in a GAS Web App. We're going with option (1) for this version (_v2) & (_v3).
// Version 3.0 07/31/2025 Re-structured everything with UM-GPT and added v1's functionality to send onboarding email

const SHEET_ID = "1n2ezoAtn-rxzA06zkwo6GutUaNtklbrK71MtPHe6SWo";  // Your Sheet ID
const SHEET_NAME = "Form Responses 1";  // Your Sheet Name
const HR_EMAIL = "emilykk@umich.edu";  // HR's email address
const LAB_MANAGER_EMAIL = "emilykk@umich.edu"; // Lab manager recipient
const CC_EMAILS = "emilykk@umich.edu"; // Other CC
const TIMESTAMP_COLUMN = 21;  // e.g. Column U/V for email sent or "Processed" marker

/**
 * Triggered by form submission (install onFormSubmit trigger!)
 */
function onFormSubmit(e) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  const row = e.values;
  const lastRowNum = sheet.getLastRow();

// Adjust indicies based on sheet!

  const name = row[2];
  const email = row[3];
  const affiliate = row[4];
  const mentorName = row[5];
  const mentorEmail = row[6];
  const whichLab = row[7];
  const appointmentType = row[8];
  const tempPaid = row[9];
  const visitorPO = row[10];
  const benefitUM = row[11];
  const sponsorShortcode = row[12];
  const visitorPaid = row[13];
  const payRate = row[14];
  const shortcode = row[15];
  const maxHours = row[16];
  const whichProject = row[17];
  const startDate = row[18];
  const endDate = row[19];
  const sendToHR = row[20]; // Checkbox
  
  // Optional: Processed/status column (not in your sample, but recommended for idempotency)
  // Use column 22 (index 21) for "Processed" or timestamp
  const PROCESSED_COL = 22; // e.g. V (1-based, for getRange/setValue)
  // Check if already marked processed for this row
  const processed = sheet.getRange(lastRowNum, PROCESSED_COL).getValue();
  if (processed && processed !== "") return;  // Already processed

  // 1. HR EMAIL for Paid
  if (tempPaid === "Yes") {
    const subject = "New Personnel Hiring - Neurobionics Lab";
    const body = `Hi Samantha,\n\n`
      + `The ${whichLab} Lab is hiring a new personnel: ${name} (${email}).\n`
      + `They will be starting on ${startDate}, end date: ${endDate}.\n`
      + `Appointment type: ${appointmentType}\n`
      + `Pay rate: $${payRate}/hr, Shortcode: ${shortcode}, Max hours/week: ${maxHours}\n\n`
      + `Mentor: ${mentorName} (${mentorEmail})\n`
      + `Project: ${whichProject}\n\n`
      + `Please email emilykk@umich.edu and ejrouse@umich.edu with any questions.\n\nThank you!`;
    MailApp.sendEmail({
      to: HR_EMAIL,
      cc: CC_EMAILS,
      subject: subject,
      body: body
    });
  }

  // 2. HR EMAIL for Volunteer/Visiting Scholar
  if (appointmentType === "Volunteer/Visiting Scholar (non-UM)") {
    const subject = "New Volunteer/Visitor (non-UM) - Neurobionics Lab";
    const body = `Hi Samantha,\n\n`
      + `The Neurobionics Lab is bringing in a new visitor: ${name} (${email}).\n`
      + `UM Affiliation: ${affiliate}. \n`
      + `Requested start date: ${startDate}, projected end date: ${endDate}.\n`
      + `Shortcode for fees: ${sponsorShortcode}`
      + `Program objective: ${visitorPO}\n`
      + `How will it benefit UM?: ${benefitUM}\n`
      + `Will the position be paid?: ${visitorPaid}\n`
      + (visitorPaid === "Yes" ? `Shortcode: ${shortcode}\n` : "")
      + `\nPlease email emilykk@umich.edu and ejrouse@umich.edu with any questions.\n\nThank you!`;
    MailApp.sendEmail({
      to: HR_EMAIL,
      cc: CC_EMAILS,
      subject: subject,
      body: body
    });
  }

  // 3. WELCOME/ONBOARDING EMAIL WITH HTML (adapt below as needed)
  if (email && validateEmail(email)) {
    var htmlTemplate = HtmlService.createTemplateFromFile('welcome_email'); // file should be called "welcome_email.html"

    // Optional: Pass variables to email template
    htmlTemplate.newHireName = name;
    htmlTemplate.lab = whichLab;
    htmlTemplate.mentorName = mentorName;
    htmlTemplate.mentorEmail = mentorEmail;
    // ... add more as needed to the template

    var htmlBody = htmlTemplate.evaluate().getContent();

    GmailApp.sendEmail(email,
      "Welcome to the NeuroLoco team! Onboarding steps inside",
      "Your email client does not support HTML", // plain text fallback
      {
        htmlBody: htmlBody,
        cc: mentorEmail
      });
  }

  // 4. Notify lab manager (modify as needed)
  var managerSubject = `New Hire: ${name} (${whichLab})`;
  var managerBody =
    `A new hire has been added via Google Form. Please add them to:\n` +
    `Mcommunity, Slack, NeuroLoco shared calendar, and GitHub.\n\n` +
    `Name: ${name}\n Start Date: ${startDate}\n UM Email Address: ${email}\n Lab: ${whichLab}`;
  GmailApp.sendEmail(LAB_MANAGER_EMAIL, managerSubject, managerBody);

  // 5. Mark row as processed (timestamp or "Yes")
  sheet.getRange(lastRowNum, PROCESSED_COL).setValue("Processed " + new Date().toLocaleString());
}

function validateEmail(email) {
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}