# Deployment script for ElectraGuide
# Project: ballot-oraclee
# Region: asia-south1

$PROJECT_ID = "ballot-oraclee"
$REGION = "asia-south1"

echo "Deploying Backend..."
gcloud run deploy electraguide-backend `
  --source ./backend `
  --region $REGION `
  --project $PROJECT_ID `
  --allow-unauthenticated `
  --set-env-vars "MONGODB_URI=mongodb+srv://pateljaineesh08:nOIiYv9YeQUCqL7e@kiranawala.3r8ka.mongodb.net/KiranaWala?retryWrites=true&w=majority,FIREBASE_PROJECT_ID=ballot-oracle,GOOGLE_API_KEY=AIzaSyAW94AyijHS5tM5QK7GWiUniMeDGid-9HI,JWT_SECRET=super_secret_election_key_123,ENVIRONMENT=production"

echo "Backend deployment triggered. Note: You will need the backend URL to update the frontend VITE_API_URL before deploying the frontend."
