# Deploment guide

## MongoDB Atlas Setup

### Quick Steps

1. **Create Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
   - Sign up (free, no credit card)

2. **Create Cluster**
   - Click "Build Cluster"
   - Choose **M0 FREE** tier
   - Select region → Create Cluster

3. **Database User**
   - Go to "Database Access"
   - Add user: username + strong password
   - Permissions: "Read and write"

4. **Network Access**
   - Go to "Network Access"  
   - Add IP: `0.0.0.0/0` (Allow from anywhere)

5. **Get Connection String**
   - Click "Connect" on cluster
   - Choose compass
   - Copy  connection string

### Environment Variable

```env
MONGODB_URI=mongodb+srv://<user_name>:<password>@cluster0.abc123.mongodb.net/ecommerce_db?retryWrites=true&w=majority
```

## Backend Deployment - Railway 

### Step 1: Prepare Your Code

- Push your code to GitHub
- Ensure `apps/api/package.json` exists with start script

### Step 2: Deploy to Railway

1. **Go to [Railway](https://railway.app)**
2. **Sign up with GitHub**
3. **Click "New Project"**
4. **Choose "Deploy from GitHub repo"**
5. **Select your repository**
6. **Auto-deploys instantly**

### Step 3: Environment Variables

Go to your project → **Variables** tab → Add:

```env
MONGODB_URI=your_mongodb_connection_string
LLM_ENDPOINT=your_ngrok_url/generate
FRONTEND_URL=your_vercel_app_url
NODE_ENV=production 
```

## Frontend Deployment - Vercel 

### Step 2: Deploy to Vercel

1. **Go to [Vercel](https://vercel.com)**
2. **Sign up with GitHub**
3. **Click "Add New..." → Project**
4. **Import your GitHub repository**
5. **Configure Project:**
   - Framework Preset: `Vite`
   - Root Directory: `apps/storefront`
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. **Click "Deploy"**

### Step 3: Environment Variables

Go to Project → **Settings → Environment Variables** → Add:

```env
VITE_API_BASE_URL=https://railway-app.up.railway.app
```

## LLM Setup

### Important Note: Model Change

**⚠️ For this assignment, we switched from LLaMA to Qwen2.5-1.5B because:**

- LLaMA is too heavy for Colab free tier (memory issues)
- Qwen2.5-1.5B runs smoothly on free Colab
- Better performance and faster responses

## Step 1: Open Colab Notebook

- Go to `/notebooks/llm-deploymnet.ipynb`
- Open in Google Colab

### Step 2: Run Required Cells

Run only:

1. **Install dependencies** (`!pip install flask flask-ngrok...`) 
2. **Download Qwen model**  
3. **Start Flask server**

### Step 3: Set Environment Variable  

```env
LLM_ENDPOINT=https://your-ngrok-url.ngrok-free.app
```

## How to Run Locally

### Prerequisites

- Node.js 16+  
- MongoDB Atlas account
- Git

### Step 1: Clone & Setup

```bash
git clone [your-repo-url]
cd [your-repo-name]
```

### Step 2: Backend Setup

```bash
cd apps/api
npm install
cp .env.example .env
```

**Edit .env:**
MONGODB_URI=your_mongodb_connection_string
LLM_ENDPOINT=your_ngrok_url
PORT=3000
FRONTEND_URL=http://localhost:5173

**Start backend:**

```bash
npm run dev
```

### Step 3: Frontend Setup

```bash
cd ../storefront  # From apps/api go to apps/storefront
npm install
npm run dev
```

### LLM Setup(get url)

1. Open /notebooks/week3-llm-rag.ipynb in Colab
2. Run only the install + model loading cells
3. Get ngrok URL and update LLM_ENDPOINT in backend .env


