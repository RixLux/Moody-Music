
## Environment Configuration Guide
For Reference
```
GEMINI_API_KEY=
GEMINI_MODEL=
FIREBASE_TYPE=
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
FIREBASE_CLIENT_ID=
EMAIL_USER=
EMAIL_PASS=
```

### 1. Google Gemini API

Required for leveraging AI generative models.

* **`GEMINI_API_KEY`**: Obtain this from the [Google AI Studio](https://aistudio.google.com/). Create a new API key and paste it here.
* **`GEMINI_MODEL`**: The specific model identifier you intend to use.
* *Common options:* `gemini-2.5-flash` (fast/efficient) or `gemini-2.5-pro` (complex tasks).



---

### 2. Firebase Service Account

These credentials allow your server to bypass client-side restrictions and manage Firebase resources directly. To get these:

1. Go to the **Firebase Console** > Project Settings > **Service Accounts**.
2. Click **Generate new private key**. This downloads a `.json` file containing all the values below.

| Variable                      | Source (from JSON file) | Note                                                                 |
|-------------------------------|-------------------------|----------------------------------------------------------------------|
| **`FIREBASE_TYPE`**           | `type`                  | Usually `service_account`.                                           |
| **`FIREBASE_PROJECT_ID`**     | `project_id`            | Your unique Firebase project slug.                                   |
| **`FIREBASE_PRIVATE_KEY_ID`** | `private_key_id`        | A 40-character alphanumeric string.                                  |
| **`FIREBASE_PRIVATE_KEY`**    | `private_key`           | Include the full string (begins with `-----BEGIN PRIVATE KEY-----`). |
| **`FIREBASE_CLIENT_EMAIL`**   | `client_email`          | Format: `service-account-name@project-id.iam.gserviceaccount.com`.   |
| **`FIREBASE_CLIENT_ID`**      | `client_id`             | A unique numeric string.                                             |

> [!IMPORTANT]
> When pasting the **`FIREBASE_PRIVATE_KEY`**, ensure you wrap it in quotes (`" "`) if it contains literal `\n` characters to prevent parsing errors.

---

### 3. Email Configuration (SMTP)

Used for sending automated emails (e.g., via Nodemailer).

* **`EMAIL_USER`**: Your full email address (e.g., `contact@yourdomain.com` or `gmail_user@gmail.com`).
* **`EMAIL_PASS`**:
* **Gmail Users:** Do **not** use your regular login password. You must enable 2FA and generate a 16-character **App Password**.
* **Other Providers:** Use the SMTP password provided by your host.



---

##  Notes(If you are new)

* **Security:** Never commit your `.env` file to version control (add it to `.gitignore`).
> You don't have to do it for this project since it has already been set up already.
* **Formatting:** Avoid spaces around the `=` sign (e.g., use `KEY=VALUE`, not `KEY = VALUE`).
* **Production:** On platforms like Vercel, Railway, or Heroku, add these via the dashboard's "Environment Variables" section instead of a file.

