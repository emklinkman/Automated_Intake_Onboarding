// Backend for Lab Onboarding HTML Form
// EK Klinkman - Updated July 2025

const HR_EMAIL = "emilykk@umich.edu";
const CC_EMAILS = "emilykk@umich.edu";
const SHEET_ID = "1d5nM5QMJWwudZskRu_OyLfEBrwZsk75yHI5kKpbcN-o";
const SHEET_NAME = "NB Web Submissions";
const TIMESTAMP_COLUMN = 25;  // Make sure this matches the timestamp column in your sheet

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);

    const name = data.newHireNameUm || data.newHireNameNonUm || "";
    const email = data.newHireEmailUm || data.newHireEmailNonUm || "";
    const willBePaid = data.vsPaid || data.itPaid || "No";
    const shortcode = data.vsShortcode || data.vsSponsorShortcode || data.itShortcode || "";
    const payRate = data.hourlyRate || "";
    const maxHours = data.itMaxHours || "";
    const projectDescription = data.projectDescription || data.itProjectDescription || "";

    const row = [
      new Date(),                        // Timestamp
      data.umAffiliated || "",           // UM Affiliated: Yes/No
      name,
      email,
      data.mentorName || "",
      data.mentorEmail || "",
      data.labName || "",
      data.appointment || "",
      projectDescription,
      data.hasUniqname || "",
      data.visitorUniqname || "",
      data.programObjective || "",
      data.umBenefit || "",
      willBePaid,
      shortcode,
      payRate,
      maxHours,
      data.umUniqname || "",
      data.startDate || "",
      data.endDate || "",
      data.vsPaid || "",
      data.itPaid || "",
      data.vsShortcode || "",
      data.itShortcode || "",
      ""  // Placeholder for 'email sent' timestamp
    ];

    sheet.appendRow(row);
    const lastRow = sheet.getLastRow();

    // ==========================
    // EMAIL 1: Paid positions
    // ==========================
    if (willBePaid === "Yes") {
      const subject = "New Personnel Hiring - Neurobionics Lab";
      const body = `Hi Samantha,\n\n`
        + `The Neurobionics Lab is hiring a new personnel: ${name} (${email}).\n`
        + `They will be starting on ${data.startDate || "TBD"}, end date: ${data.endDate || "TBD"}.\n`
        + `Appointment type: ${data.appointment || "N/A"}\n`
        + `Pay rate: $${payRate}/hr, Shortcode: ${shortcode}, Max hours/week: ${maxHours}\n\n`
        + `Mentor: ${data.mentorName || ""} (${data.mentorEmail || ""})\n`
        + `Project: ${projectDescription}\n\n`
        + `Please email emilykk@umich.edu and ejrouse@umich.edu with any questions.\n\nThank you!`;

      MailApp.sendEmail({
        to: HR_EMAIL,
        cc: CC_EMAILS,
        subject: subject,
        body: body
      });

      // Set email sent timestamp
      sheet.getRange(lastRow, TIMESTAMP_COLUMN).setValue("Sent on " + new Date().toLocaleString());
    }

    // ==========================================
    // EMAIL 2: Volunteer/Visiting Scholar notice
    // ==========================================
    if (data.appointment === "Volunteer/Visiting Scholar (non-UM)") {
      const subject = "New Volunteer/Visitor (non-UM) - Neurobionics Lab";
      const body = `Hi Samantha,\n\n`
        + `The Neurobionics Lab is bringing in a new visitor: ${name} (${email}).\n`
        + `They will be starting on ${data.startDate}, end date: ${data.endDate}.\n`
        + `Program objective: ${data.programObjective}\n`
        + `How will it benefit UM?: ${data.umBenefit}\n`
        + `Will the position be paid?: ${data.vsPaid}\n`
        + (data.vsPaid === "Yes" ? `Shortcode: ${data.vsShortcode}\n` : "")
        + `\nPlease email emilykk@umich.edu and ejrouse@umich.edu with any questions.\n\nThank you!`;

      MailApp.sendEmail({
        to: HR_EMAIL,
        cc: CC_EMAILS,
        subject: subject,
        body: body
      });

      // Set email sent timestamp, if not already set
      if (!sheet.getRange(lastRow, TIMESTAMP_COLUMN).getValue()) {
        sheet.getRange(lastRow, TIMESTAMP_COLUMN).setValue("Sent on " + new Date().toLocaleString());
      }
    }

    // ==========================================
    // EMAIL 3: Welcome/Onboarding email to new personnel
    // ==========================================
    if (email) {
      const onboardingMsg = `Hi ${name}, 
      Welcome to the ${data.labName || "lab"} at the University of Michigan!
      Here are your next steps:
      • If you do not already have access, please check with your mentor about MCommunity and Slack instructions.
      • Your mentor is: ${data.mentorName || "N/A"}${data.mentorEmail ? " (" + data.mentorEmail + ")" : ""}
      We are excited to have you join the team. If you have any issues or questions, please reply to this email or reach out to your mentor directly.
      Go Blue!`;

      MailApp.sendEmail({
        to: email,
        cc: data.mentorEmail || "",
        subject: "Welcome to Michigan! Lab Onboarding Steps",
        body: onboardingMsg
      });
    }

    // Return a JSON result
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    Logger.log("Error handling POST: " + err);
    return ContentService.createTextOutput(JSON.stringify({ success: false, message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}