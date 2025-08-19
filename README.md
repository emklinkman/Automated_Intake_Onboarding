# Google Apps Script Project
EK Klinkman, EJ Rouse
Neurobionics Lab, Department of Robotics, University of Michigan, 2024

## Overview

This repository contains the code for a Google Apps Script (GAS) project. The project is designed to automate the onboarding process for new hires (grad students, postdocs, full-time staff, part-time/temp staff, student interns, volunteers/visiting scholars). The Apps Script project is built from a Google Form intake, where lab members fill out new hires' information. If certain criteria are met (e.g. the new hire is NOT UM affiliated, or the new hire will be paid) an email is sent to HR upon submission of the form. Furthermore, submission of the form triggers an email to be sent to the new hire, which contains in=mportant onboarding information. 

The tool is ‘deploy and forget,’ meaning once the infrastructure is in place, it operates automatically in perpetuity. This tool was written for the Neurobionics and Locomotor Control Systems Labs at the University of Michigan Department of Robotics. The purpose of this tool is to establish an automated system for new laboratory personnel intake, onboarding, and tracking. 

* Automatically email HR to initiate hiring process when certain form criteria are met
* Automatically email new laboratory personnel with important onboarding information
* Automatically email laboratory manager and mentor (if applicable) of form completion
* Collect responses in a google sheet for easy tracking and review

To get started, you will need to create and modify some Google documents, which will then set the tool up for your group.  Once it’s created and launched, it will operate in perpetuity. 

To create the tool for your group, you will need to: 1) create a google form, 2) create a google apps script project.  This document will walk through the steps required, which may take an hour. 

Features:

**Integration with Google Services:** Integrates with Google Forms, Google Sheets and Google Drive to manage, store, and read data.

**Google Apps Script (GAS) works with [Clasp](https://github.com/google/clasp) for local development and version control**

## Files

- `Onboarding_GAS_v1`: Contains the initial draft script logic for processing form data and sending emails.
- `Onboarding_GAS_v2`: Contains updated/current script logic for processing form data and sending emails.
- `Neurobionics_Website_Frontend`: Contains frontend html for embedded website form (does not work with GAS - Browser blocks data fetch request due to CORS policy error. Apps Script web apps do not respond with Access-Control-Allow-Origin)
- `Neurobionics_Website_Form`: Contains backend logic for HTML front-end. Dead end, but kept logic as archive.
- NOT INCLUDED: `welcome_email.html`, contains proprietary organization intake and onboarding information.

## Setup

To set up this project on your local machine, follow these steps:

### 1. Install Node.js and npm

Ensure you have Node.js and npm installed. You can download and install them from [nodejs.org](https://nodejs.org/).

### 2. Install Clasp

Clasp is a command-line tool used to manage Google Apps Script projects.

1. Open your Command Prompt, PowerShell, or terminal.
2. Install Clasp globally using npm:
   ```ruby
   npm install -g @google/clasp
   ```

### 3. Log In to Clasp

You will need to log in to Clasp to authorize it to access your Google account

1. Run the following command
   ```ruby
   clasp login
   ```
2. Follow the prompts to authorize Clasp with your google account

### 4. Clone the repository using Git

1. Clone the repository into the local directory of your choice using git
2. Navigate to the directory of your cloned GitHub repository via Command Prompt, PowerShell, or terminal

### 5. Unlink existing '.clasp.json' file

Remove old file
```ruby
del .clasp.json
```

## Google Apps Script setup

### 1. Create a new Google Apps Script project & push Git repository to GAS project

1. Create a new project using CLASP

```ruby
clasp create "New Project Name"
```

2. Choose script type: when prompted, select 'standalone'

NOTE: you may receive the following warning message:
    
     ```
     User has not enabled the Apps Script API. Enable it by visiting https://script.google.com/home/usersettings
     then retry. If you enabled this API recently, wait a few minutes for the action to propagate to our systems and retry.
     ```
     
Enable the API and re-run the previous clasp command.

CLASP may prompt you about overwriting local files. Since you want to push your GitHub repository's content to the new Google Apps Script project, select No to prevent overwriting your local files.
  
3. Push the files now that the repository is linked to the new GAS project

```ruby
clasp push
```

4. Verify the push

```ruby
clasp open
```
Review the files to ensure everything has been uploaded correctly.

### 2. Create a Google Form

Using your desired Google account, create a Google form.  Instructions for creating a google form can be found [here](https://support.google.com/docs/answer/6281888?hl=en&visit_id=638580463955952407-1339523159&rd=1).  Once you have created your form, navigate to the ‘Responses’ tab and click on ‘Link to Sheets’.
![LinkToSheets](https://github.com/user-attachments/assets/c190d44f-1ce7-4ad3-8439-717f857dd33f)

This will create a google sheet to record form responses, from which your Google Apps Script will operate.

NOTE: this sheet needs to be owned by whomever is setting up and deploying the project, in order for GAS to have permissions to pull its content.

### 3. Edit the local repository with your content

The following information within Code.gs will need to be populated with your information. This can either be done locally using a text editor or coding environment, or within the GAS editing page once you push the repository to your GAS project (see step 5 below). 

**Code.gs**

Populate global variables
   * **FORM_ID**: Google form ID
   * **SHEET_ID**: Google Sheet (associated with the form) ID 
   * **SHEET_NAME**: Name of Google Sheet tab with responses
   * **HR_EMAIL**: HR person's email who will be receiving new hire information
   * **CC_EMAILS**: email addresses who will be CC'ed to HR email
   * **STATUS_COLUMN**: numerical column index for where to enter "YES" for the data having been processed and sent
   * **TIMESTAMP_COLUMN**: numerical column index for where to enter the date and time that the email was sent. This is used as a reference for whether or not the script continues to run. If data are present in this column on the last row, no further action takes place
   * **Other numerical column references**: all "const" fields that reference a value (e.g. const shortcode = lastResponse[14]) are specific to the Google Form fields that you want to relay in the email to HR

### 4. Push the updated code to Google Apps Script

If you make changes in the GAS editor page after your initial ```clasp push``` command, you will need to pull the changes to your local repository using the following command:

```ruby
clasp pull
```

If you make changes locally, you can push the changes to your GAS project using ```clasp push```
   
### 5. Deploy the project

1. Test your functions in the GAS environment

After using Clasp to push the project to your GAS environment, it is recommended to test/debug the main function **sendHRNotification** before deploying. Select the function to test from the dropdown menu and click "run".

2. Add triggers within GAS environment

After testing the script locally within GAS, debugging, and customizing settings to your desired specifications, you will need to set up triggers in order to run the project. Click on ‘Triggers’ from the left hand sidebar.

![Trigger](https://github.com/user-attachments/assets/fda03d01-7282-431a-a25e-8c2fd5f7b317)

Click ‘Add Trigger’ - select "sendHRNotification" as the function to run. "Head" runs at deployment. Select event source: "from form". Select event type: "On form submit".

NOTE: It is possible to hard-code your triggers into the script itself. This project does not cover that functionality.

Once you have configured the triggers, you can deploy your project.

3. Deploy project within GAS environment

To deploy your project, click ‘Deploy’ → ‘New Deployment’.

![deploy](https://github.com/user-attachments/assets/67e79154-d131-4d74-83fe-bf7ffb9e6775)

Enter your desired information in the pop-up window. A 'Web app' deployment is recommended.

![deploy_options](https://github.com/user-attachments/assets/398fb388-7ddb-4b57-98e2-5d4313179e45)

It is recommended to test your trigger timing and deployment before sending to your desired audience.


## Troubleshooting

1. You will likely need to authorize the project by providing permission for the script to access your data.

![authorization](https://github.com/user-attachments/assets/db536c78-593d-4427-8ae8-4b80d9e1981a)

Allow the project to access your Google Account: press ‘Allow’.

## Contact
   If you have any questions or need further assistance, feel free to reach out:
   * Name: Emily Klinkman, MS.
   * Email: emilykk@umich.edu
   * GitHub: https://github.com/emklinkman
