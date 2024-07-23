-- Create table for main issue categories
CREATE TABLE IssueCategories (
    id INT(11) NOT NULL AUTO_INCREMENT,
    label VARCHAR(255) NOT NULL,
    VersionID INT(11) DEFAULT NULL,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    DeletedAt TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Create table for subcategories
CREATE TABLE SubCategories (
    id INT(11) NOT NULL AUTO_INCREMENT,
    category_id INT(11) NOT NULL,
    label VARCHAR(255) NOT NULL,
    VersionID INT(11) DEFAULT NULL,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    DeletedAt TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (category_id) REFERENCES IssueCategories(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Create table for sub-issues
CREATE TABLE SubIssues (
    id INT(11) NOT NULL AUTO_INCREMENT,
    sub_category_id INT(11) NOT NULL,
    label VARCHAR(255) NOT NULL,
    VersionID INT(11) DEFAULT NULL,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    DeletedAt TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (sub_category_id) REFERENCES SubCategories(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Create table for sub-issue inputs
CREATE TABLE SubIssueInputs (
    id INT(11) NOT NULL AUTO_INCREMENT,
    sub_issue_id INT(11) NOT NULL,
    label VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    placeholder VARCHAR(255) DEFAULT NULL,
    tooltip TEXT,
    VersionID INT(11) DEFAULT NULL,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    DeletedAt TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (sub_issue_id) REFERENCES SubIssues(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Create table for issue category versions
CREATE TABLE IssueCategoryVersions (
    VersionID INT(11) NOT NULL AUTO_INCREMENT,
    IssueCategoryID INT(11) NOT NULL,
    label VARCHAR(255) NOT NULL,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (VersionID),
    FOREIGN KEY (IssueCategoryID) REFERENCES IssueCategories(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Create table for subcategory versions
CREATE TABLE SubCategoryVersions (
    VersionID INT(11) NOT NULL AUTO_INCREMENT,
    SubCategoryID INT(11) NOT NULL,
    label VARCHAR(255) NOT NULL,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (VersionID),
    FOREIGN KEY (SubCategoryID) REFERENCES SubCategories(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Create table for sub-issue versions
CREATE TABLE SubIssueVersions (
    VersionID INT(11) NOT NULL AUTO_INCREMENT,
    SubIssueID INT(11) NOT NULL,
    label VARCHAR(255) NOT NULL,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (VersionID),
    FOREIGN KEY (SubIssueID) REFERENCES SubIssues(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Create table for sub-issue input versions
CREATE TABLE SubIssueInputVersions (
    VersionID INT(11) NOT NULL AUTO_INCREMENT,
    SubIssueInputID INT(11) NOT NULL,
    label VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    placeholder VARCHAR(255) DEFAULT NULL,
    tooltip TEXT,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (VersionID),
    FOREIGN KEY (SubIssueInputID) REFERENCES SubIssueInputs(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Create table for issue category action logs
CREATE TABLE IssueCategoryActionLog (
    LogID INT(11) NOT NULL AUTO_INCREMENT,
    UserID INT(11) NOT NULL,
    IssueCategoryID INT(11) NOT NULL,
    VersionID INT(11) NOT NULL,
    ActionType VARCHAR(255) NOT NULL,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (LogID),
    FOREIGN KEY (IssueCategoryID) REFERENCES IssueCategories(id),
    FOREIGN KEY (VersionID) REFERENCES IssueCategoryVersions(VersionID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Create table for subcategory action logs
CREATE TABLE SubCategoryActionLog (
    LogID INT(11) NOT NULL AUTO_INCREMENT,
    UserID INT(11) NOT NULL,
    SubCategoryID INT(11) NOT NULL,
    VersionID INT(11) NOT NULL,
    ActionType VARCHAR(255) NOT NULL,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (LogID),
    FOREIGN KEY (SubCategoryID) REFERENCES SubCategories(id),
    FOREIGN KEY (VersionID) REFERENCES SubCategoryVersions(VersionID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Create table for sub-issue action logs
CREATE TABLE SubIssueActionLog (
    LogID INT(11) NOT NULL AUTO_INCREMENT,
    UserID INT(11) NOT NULL,
    SubIssueID INT(11) NOT NULL,
    VersionID INT(11) NOT NULL,
    ActionType VARCHAR(255) NOT NULL,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (LogID),
    FOREIGN KEY (SubIssueID) REFERENCES SubIssues(id),
    FOREIGN KEY (VersionID) REFERENCES SubIssueVersions(VersionID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Create table for sub-issue input action logs
CREATE TABLE SubIssueInputActionLog (
    LogID INT(11) NOT NULL AUTO_INCREMENT,
    UserID INT(11) NOT NULL,
    SubIssueInputID INT(11) NOT NULL,
    VersionID INT(11) NOT NULL,
    ActionType VARCHAR(255) NOT NULL,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (LogID),
    FOREIGN KEY (SubIssueInputID) REFERENCES SubIssueInputs(id),
    FOREIGN KEY (VersionID) REFERENCES SubIssueInputVersions(VersionID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

START TRANSACTION;

-- Insert issue categories
INSERT INTO IssueCategories (label) VALUES ('Website Issue');
SET @website_issue_id = LAST_INSERT_ID();

INSERT INTO IssueCategories (label) VALUES ('Gameplay Issue');
SET @gameplay_issue_id = LAST_INSERT_ID();

INSERT INTO IssueCategories (label) VALUES ('Premium Membership Issue');
SET @premium_membership_issue_id = LAST_INSERT_ID();

INSERT INTO IssueCategories (label) VALUES ('Other Issues');
SET @other_issues_id = LAST_INSERT_ID();

-- Insert into issue category versions
INSERT INTO IssueCategoryVersions (IssueCategoryID, label) VALUES 
(@website_issue_id, 'Website Issue'),
(@gameplay_issue_id, 'Gameplay Issue'),
(@premium_membership_issue_id, 'Premium Membership Issue'),
(@other_issues_id, 'Other Issues');

-- Retrieve version IDs for logs
SET @website_issue_version_id = LAST_INSERT_ID();
SET @gameplay_issue_version_id = @website_issue_version_id + 1;
SET @premium_membership_issue_version_id = @website_issue_version_id + 2;
SET @other_issues_version_id = @website_issue_version_id + 3;

-- Insert into issue category action logs
INSERT INTO IssueCategoryActionLog (UserID, IssueCategoryID, VersionID, ActionType) VALUES 
(1, @website_issue_id, @website_issue_version_id, 'Create'),
(1, @gameplay_issue_id, @gameplay_issue_version_id, 'Create'),
(1, @premium_membership_issue_id, @premium_membership_issue_version_id, 'Create'),
(1, @other_issues_id, @other_issues_version_id, 'Create');

-- Insert subcategories for Website Issue
INSERT INTO SubCategories (category_id, label) VALUES (@website_issue_id, 'Cannot log in');
SET @cannot_log_in_id = LAST_INSERT_ID();

INSERT INTO SubCategories (category_id, label) VALUES (@website_issue_id, 'Unauthorized activity');
SET @unauthorized_activity_id = LAST_INSERT_ID();

INSERT INTO SubCategories (category_id, label) VALUES (@website_issue_id, 'Update personal information');
SET @update_personal_information_id = LAST_INSERT_ID();

INSERT INTO SubCategories (category_id, label) VALUES (@website_issue_id, 'Website not loading');
SET @website_not_loading_id = LAST_INSERT_ID();

INSERT INTO SubCategories (category_id, label) VALUES (@website_issue_id, 'Error messages');
SET @error_messages_id = LAST_INSERT_ID();

-- Insert into subcategory versions
INSERT INTO SubCategoryVersions (SubCategoryID, label) VALUES 
(@cannot_log_in_id, 'Cannot log in'),
(@unauthorized_activity_id, 'Unauthorized activity'),
(@update_personal_information_id, 'Update personal information'),
(@website_not_loading_id, 'Website not loading'),
(@error_messages_id, 'Error messages');

-- Retrieve version IDs for logs
SET @cannot_log_in_version_id = LAST_INSERT_ID();
SET @unauthorized_activity_version_id = @cannot_log_in_version_id + 1;
SET @update_personal_information_version_id = @cannot_log_in_version_id + 2;
SET @website_not_loading_version_id = @cannot_log_in_version_id + 3;
SET @error_messages_version_id = @cannot_log_in_version_id + 4;

-- Insert into subcategory action logs
INSERT INTO SubCategoryActionLog (UserID, SubCategoryID, VersionID, ActionType) VALUES 
(1, @cannot_log_in_id, @cannot_log_in_version_id, 'Create'),
(1, @unauthorized_activity_id, @unauthorized_activity_version_id, 'Create'),
(1, @update_personal_information_id, @update_personal_information_version_id, 'Create'),
(1, @website_not_loading_id, @website_not_loading_version_id, 'Create'),
(1, @error_messages_id, @error_messages_version_id, 'Create');

-- Insert sub-issues
INSERT INTO SubIssues (sub_category_id, label) VALUES (@cannot_log_in_id, 'Cannot log in');
SET @cannot_log_in_issue_id = LAST_INSERT_ID();

INSERT INTO SubIssues (sub_category_id, label) VALUES (@unauthorized_activity_id, 'Unauthorized activity');
SET @unauthorized_activity_issue_id = LAST_INSERT_ID();

INSERT INTO SubIssues (sub_category_id, label) VALUES (@update_personal_information_id, 'Update personal information');
SET @update_personal_information_issue_id = LAST_INSERT_ID();

INSERT INTO SubIssues (sub_category_id, label) VALUES (@website_not_loading_id, 'Website not loading');
SET @website_not_loading_issue_id = LAST_INSERT_ID();

INSERT INTO SubIssues (sub_category_id, label) VALUES (@error_messages_id, 'Error messages');
SET @error_messages_issue_id = LAST_INSERT_ID();

-- Insert into sub-issue versions
INSERT INTO SubIssueVersions (SubIssueID, label) VALUES 
(@cannot_log_in_issue_id, 'Cannot log in'),
(@unauthorized_activity_issue_id, 'Unauthorized activity'),
(@update_personal_information_issue_id, 'Update personal information'),
(@website_not_loading_issue_id, 'Website not loading'),
(@error_messages_issue_id, 'Error messages');

-- Retrieve version IDs for logs
SET @cannot_log_in_issue_version_id = LAST_INSERT_ID();
SET @unauthorized_activity_issue_version_id = @cannot_log_in_issue_version_id + 1;
SET @update_personal_information_issue_version_id = @cannot_log_in_issue_version_id + 2;
SET @website_not_loading_issue_version_id = @cannot_log_in_issue_version_id + 3;
SET @error_messages_issue_version_id = @cannot_log_in_issue_version_id + 4;

-- Insert into sub-issue action logs
INSERT INTO SubIssueActionLog (UserID, SubIssueID, VersionID, ActionType) VALUES 
(1, @cannot_log_in_issue_id, @cannot_log_in_issue_version_id, 'Create'),
(1, @unauthorized_activity_issue_id, @unauthorized_activity_issue_version_id, 'Create'),
(1, @update_personal_information_issue_id, @update_personal_information_issue_version_id, 'Create'),
(1, @website_not_loading_issue_id, @website_not_loading_issue_version_id, 'Create'),
(1, @error_messages_issue_id, @error_messages_issue_version_id, 'Create');

-- Insert sub-issue inputs
INSERT INTO SubIssueInputs (sub_issue_id, label, type, placeholder, tooltip) VALUES 
(@cannot_log_in_issue_id, 'Username or Email', 'text', 'Enter username or email used', 'Use the email or username associated with your account.');
SET @username_or_email_input_id = LAST_INSERT_ID();

INSERT INTO SubIssueInputs (sub_issue_id, label, type, placeholder, tooltip) VALUES 
(@unauthorized_activity_issue_id, 'Description of Activity', 'text', 'Describe the activity', 'Detail any unauthorized activity on your account.');
SET @description_of_activity_input_id = LAST_INSERT_ID();

INSERT INTO SubIssueInputs (sub_issue_id, label, type, placeholder, tooltip) VALUES 
(@unauthorized_activity_issue_id, 'Date of Occurrence', 'date', 'Select the date of occurrence', 'When did you first notice the unauthorized activity?');
SET @date_of_occurrence_input_id = LAST_INSERT_ID();

INSERT INTO SubIssueInputs (sub_issue_id, label, type, placeholder, tooltip) VALUES 
(@update_personal_information_issue_id, 'Information to Update', 'text', 'Specify the information to be updated', 'Specify which part of your personal information needs updating.');
SET @information_to_update_input_id = LAST_INSERT_ID();

INSERT INTO SubIssueInputs (sub_issue_id, label, type, placeholder, tooltip) VALUES 
(@website_not_loading_issue_id, 'Browser and Version', 'text', 'Enter browser and version used', 'Identify the browser and its version where you experienced the issue.');
SET @browser_and_version_input_id = LAST_INSERT_ID();

INSERT INTO SubIssueInputs (sub_issue_id, label, type, placeholder, tooltip) VALUES 
(@error_messages_issue_id, 'Error Messages', 'text', 'Describe the error messages received', 'Provide the exact error messages you saw, if possible.');
SET @error_messages_input_id = LAST_INSERT_ID();

-- Insert into sub-issue input versions
INSERT INTO SubIssueInputVersions (SubIssueInputID, label, type, placeholder, tooltip) VALUES 
(@username_or_email_input_id, 'Username or Email', 'text', 'Enter username or email used', 'Use the email or username associated with your account.'),
(@description_of_activity_input_id, 'Description of Activity', 'text', 'Describe the activity', 'Detail any unauthorized activity on your account.'),
(@date_of_occurrence_input_id, 'Date of Occurrence', 'date', 'Select the date of occurrence', 'When did you first notice the unauthorized activity?'),
(@information_to_update_input_id, 'Information to Update', 'text', 'Specify the information to be updated', 'Specify which part of your personal information needs updating.'),
(@browser_and_version_input_id, 'Browser and Version', 'text', 'Enter browser and version used', 'Identify the browser and its version where you experienced the issue.'),
(@error_messages_input_id, 'Error Messages', 'text', 'Describe the error messages received', 'Provide the exact error messages you saw, if possible.');

-- Retrieve version IDs for logs
SET @username_or_email_input_version_id = LAST_INSERT_ID();
SET @description_of_activity_input_version_id = @username_or_email_input_version_id + 1;
SET @date_of_occurrence_input_version_id = @username_or_email_input_version_id + 2;
SET @information_to_update_input_version_id = @username_or_email_input_version_id + 3;
SET @browser_and_version_input_version_id = @username_or_email_input_version_id + 4;
SET @error_messages_input_version_id = @username_or_email_input_version_id + 5;

-- Insert into sub-issue input action logs
INSERT INTO SubIssueInputActionLog (UserID, SubIssueInputID, VersionID, ActionType) VALUES 
(1, @username_or_email_input_id, @username_or_email_input_version_id, 'Create'),
(1, @description_of_activity_input_id, @description_of_activity_input_version_id, 'Create'),
(1, @date_of_occurrence_input_id, @date_of_occurrence_input_version_id, 'Create'),
(1, @information_to_update_input_id, @information_to_update_input_version_id, 'Create'),
(1, @browser_and_version_input_id, @browser_and_version_input_version_id, 'Create'),
(1, @error_messages_input_id, @error_messages_input_version_id, 'Create');

COMMIT;

CREATE TABLE SupportRequests (
    id INT(11) NOT NULL AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    issueCategory VARCHAR(255) NOT NULL,
    subIssue VARCHAR(255) NOT NULL,
    details JSON NOT NULL,
    issueCategoryVersionID INT(11) NOT NULL,
    subCategoryVersionID INT(11) NOT NULL,
    subIssueVersionID INT(11) NOT NULL,
    subIssueInputVersionID INT(11) NOT NULL,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (issueCategoryVersionID) REFERENCES IssueCategoryVersions(VersionID),
    FOREIGN KEY (subCategoryVersionID) REFERENCES SubCategoryVersions(VersionID),
    FOREIGN KEY (subIssueVersionID) REFERENCES SubIssueVersions(VersionID),
    FOREIGN KEY (subIssueInputVersionID) REFERENCES SubIssueInputVersions(VersionID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
