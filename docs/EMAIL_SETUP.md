# 📧 How to Setup Real Email Authentication

Currently, your application uses **Demo Mode** for login because no dedicated email server is configured. This means authentication codes are not actually emailed but simulated.

## 🔑 Immediate Access (Bypass)
Until you set up real emails, use the following Master Code to log in with any authorized email address:

**Master Code:** `888888`

---

## 🚀 Setting Up Real Emails (Gmail SMTP)
To send real authentication codes to your Gmail inbox, you must configure **Supabase** to use your Gmail account as the sender.

### Step 1: Get a Google App Password
Since you have 2-Step Verification enabled on Gmail (likely), you cannot use your regular password. You need an "App Password".
1.  Go to your [Google Account Security Page](https://myaccount.google.com/security).
2.  Under "How you sign in to Google", select **2-Step Verification**.
3.  Scroll to the bottom and select **App passwords**.
4.  Create a new app password:
    *   **App**: Select "Mail".
    *   **Device**: Select "Other" and name it "Fiordland App".
5.  Copy the 16-character password generated (e.g., `abcd efgh ijkl mnop`).

### Step 2: Configure Supabase
1.  Log in to your [Supabase Dashboard](https://supabase.com/dashboard).
2.  Select your Project.
3.  Go to **Authentication** (icon on the left) -> **Providers**.
4.  Click on **Email** (it should be enabled).
5.  Toggle **Enable Custom SMTP** to **ON**.
6.  Fill in the details:
    *   **Sender Email**: `your-email@gmail.com`
    *   **Sender Name**: `Fiordland Pilotage`
    *   **Host**: `smtp.gmail.com`
    *   **Port**: `465` (or `587`)
    *   **User**: `your-email@gmail.com`
    *   **Password**: [The 16-char App Password from Step 1]
    *   **Secure**: Toggle **ON** (if using port 465).
7.  Click **Save**.

### Step 3: Test
1.  Go back to your specific Fiordland App URL.
2.  Try to log in.
3.  Supabase will now send the email via your Gmail account, and it should arrive instantly in your inbox!
