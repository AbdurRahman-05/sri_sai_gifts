# Step-by-Step Guide: Deploying SRI-SAI-BAGS on Hostinger

This guide outlines how to deploy your MERN (React frontend + Node.js backend) application to Hostinger. 

Since the application is structured with a Node.js Express backend (`backend/server.js`) that serves the compiled React frontend (`frontend/dist`), we will deploy it as a single Node.js application.

Using Git for deployment is highly recommended as it enables simple code updates and supports automatic deployments via GitHub Webhooks.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Step 1: Build the Frontend Locally](#step-1-build-the-frontend-locally)
3. [Step 2 (Option A): Deploy via Git Integration (Recommended)](#step-2-option-a-deploy-via-git-integration-recommended)
4. [Step 2 (Option B): Deploy via Manual ZIP Upload](#step-2-option-b-deploy-via-manual-zip-upload)
5. [Step 3: Configure Database & Cloudinary Access](#step-3-configure-database--cloudinary-access)
6. [Step 4: Configure Node.js in Hostinger hPanel](#step-4-configure-nodejs-in-hostinger-hpanel)
7. [Step 5: Alternative Deployment (Hostinger VPS)](#step-5-alternative-deployment-hostinger-vps)
8. [Step 6: Verification & Troubleshooting](#step-6-verification--troubleshooting)

---

## Prerequisites

Before starting, ensure you have:
*   A Hostinger hosting plan that supports Node.js (either **Hostinger Cloud Hosting / Business plans with hPanel Node.js support** or a **Hostinger VPS**).
*   A MongoDB Atlas database cluster.
*   A Cloudinary account for product image storage.

---

## Step 1: Build the Frontend Locally

Vite applications need to be compiled into static HTML, CSS, and JS files before deployment. Running this build on your local machine is highly recommended because compiling large React projects on Hostinger shared servers can exceed memory limits and crash.

1. Open your terminal in the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Run the build command:
   ```bash
   npm run build
   ```
3. Verify that the folder `frontend/dist` has been generated or updated with new index.html and assets.

*Note: In your project, the `frontend/dist` directory is already tracked in Git (it is not ignored in `.gitignore`), meaning any changes built locally will be pushed to Git and pulled by Hostinger.*

---

## Step 2 (Option A): Deploy via Git Integration (Recommended)

This method links your GitHub repository directly to Hostinger hPanel.

### 1. Push Your Local Code to GitHub
Ensure all your local changes (especially the fresh build in `frontend/dist`) are pushed to GitHub:
```bash
git add .
git commit -m "Build frontend and prepare for deployment"
git push origin main
```

### 2. Configure Git in Hostinger hPanel
1. Log in to [Hostinger hPanel](https://hpanel.hostinger.com/).
2. Go to **Websites** and click **Manage** next to your domain.
3. In the sidebar search bar, type **Git** or navigate to **Advanced** -> **Git**.
4. Fill in the **Create a New Repository** form:
   *   **Repository Address**: Paste your SSH or HTTPS GitHub URL (e.g. `https://github.com/your-username/SRI-SAI-BAGS.git`).
   *   **Branch**: Set this to `main` (or whichever branch you are using).
   *   **Install Directory**: Leave empty to install in the root (`public_html`), or specify a subfolder (e.g. `public_html/sri-sai-bags`).
5. Click **Create**.

### 3. Handle Private Repositories (If applicable)
If your GitHub repository is private:
1. Hostinger will generate a **Deploy Key** after you click Create.
2. Copy this SSH key.
3. Open your GitHub Repository -> **Settings** -> **Deploy keys** -> **Add deploy key**.
4. Paste the SSH key, check the box to **Allow write access** (optional, read access is sufficient), and click **Add key**.
5. Back in Hostinger hPanel, click **Create** again to finish cloning the repository.

### 4. Enable Automatic Deployment (Webhook)
To automatically pull code changes whenever you push to GitHub:
1. In Hostinger's Git dashboard, copy the **Webhook URL** provided next to your repository.
2. Go to your GitHub Repository -> **Settings** -> **Webhooks** -> **Add webhook**.
3. Paste the Webhook URL into the **Payload URL** field.
4. Set **Content type** to `application/json`.
5. Click **Add webhook**.

---

## Step 2 (Option B): Deploy via Manual ZIP Upload

Use this option if you do not want to use Git, or prefer manual file uploads.

1. Open your project root folder (`SRI-SAI-BAGS`) in Windows Explorer.
2. Select the `backend`, `frontend`, `package.json`, and `package-lock.json` files.
   *(Make sure to exclude `node_modules` and local `.env` files).*
3. Right-click, select **Compress to ZIP file** (or **Send to** -> **Compressed (zipped) folder**). Name it `sri-sai-bags-deploy.zip`.
4. Log in to **Hostinger hPanel** -> **File Manager** -> Navigate to your deployment folder (e.g. `public_html`).
5. Upload the ZIP file and **Extract** it. You can delete the ZIP archive after extraction.

---

## Step 3: Configure Database & Cloudinary Access

### 1. MongoDB Atlas IP Whitelist
1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/).
2. Click **Network Access** (under the Security section on the left).
3. Click **Add IP Address**.
4. Select **Allow Access from Anywhere** (IP address `0.0.0.0/0`) since Hostinger shared servers use dynamic IPs.
5. Click **Confirm**.

### 2. Gather Environment Variables
Prepare the following variables from your local `backend/.env` file:
*   `MONGODB_URI`
*   `CLOUDINARY_CLOUD_NAME`
*   `CLOUDINARY_API_KEY`
*   `CLOUDINARY_API_SECRET`

---

## Step 4: Configure Node.js in Hostinger hPanel

Once the files are pulled via Git or uploaded manually, configure the Node.js runner:

1. In hPanel, search for **Node.js** in the search bar (or go to **Advanced** -> **Node.js**).
2. Click **Create Application** (or Setup).
3. Configure the following fields:
   *   **Node.js Version**: Select **20.x** (or the latest stable matching `>=20`).
   *   **Application Directory**: Enter the folder containing your code (e.g., `public_html`).
   *   **Application Startup File**: Set this to `backend/server.js`.
   *   **Domain/Subdomain**: Select the domain name pointing to the application.
4. Under **Environment Variables**, add the following key-value pairs:
   *   `MONGODB_URI` = *Your MongoDB Connection String*
   *   `CLOUDINARY_CLOUD_NAME` = *Your Cloudinary Cloud Name*
   *   `CLOUDINARY_API_KEY` = *Your Cloudinary API Key*
   *   `CLOUDINARY_API_SECRET` = *Your Cloudinary API Secret*
   *   `NODE_ENV` = `production`
5. Click **Save** / **Create** to launch the environment.
6. Under the Node.js settings dashboard, click **NPM Install**. This installs all dependencies for both the backend and frontend workspaces.
7. Click **Start** or **Restart** to run the Express backend.

---

## Step 5: Alternative Deployment (Hostinger VPS)

If you are using a Hostinger Virtual Private Server (VPS) instead of shared hosting:

1. **Connect via SSH**: `ssh root@your_vps_ip`
2. **Install Node.js & PM2**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo npm install --global pm2
   ```
3. **Pull from Git**:
   ```bash
   cd /var/www
   git clone https://github.com/your-username/SRI-SAI-BAGS.git
   cd SRI-SAI-BAGS
   npm install
   npm run build --workspace=frontend
   ```
4. **Set up Environment Variables**: Create `backend/.env` containing your database connection string and Cloudinary credentials.
5. **Start Application**:
   ```bash
   pm2 start backend/server.js --name "sri-sai-bags"
   pm2 save
   pm2 startup
   ```
6. **Set up Nginx reverse proxy**: Route port 80/443 traffic to `http://localhost:5000`.

---

## Step 6: Verification & Troubleshooting

### 1. Verify Deployment Health
Go to `https://yourdomain.com/api/health` in your browser.
*   **Expected output**: `{"status":"Server is running","db":"connected"}`

### 2. Common Troubleshooting
*   **503 Service Unavailable**:
    *   **Reason**: Node.js server crashed or stopped.
    *   **Fix**: Go to the Hostinger Node.js panel and click **Restart**. View files like `logs/stderr.log` in File Manager to inspect errors.
*   **Database Timed Out**:
    *   **Reason**: MongoDB Atlas network permissions are blocking Hostinger.
    *   **Fix**: Ensure `0.0.0.0/0` is added in MongoDB Atlas -> Security -> Network Access.
*   **Page displays 404 on refresh**:
    *   **Reason**: React Router needs route fallbacks.
    *   **Fix**: Make sure `backend/server.js` catchall route (`app.get(/.*/, ...)`) is running. If you deployed using Git, confirm you restarted the Node.js application after pulling new changes.
