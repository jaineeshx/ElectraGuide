# Deployment script for ElectraGuide
# Region: asia-south1
$PROJECT_ID = "ballot-oraclee"
$REGION = "asia-south1"

# Load environment variables from backend/.env if it exists
if (Test-Path "./backend/.env") {
    Get-Content "./backend/.env" | Where-Object { $_ -match "=" -and $_ -notmatch "^#" } | ForEach-Object {
        $name, $value = $_.Split('=', 2)
        Set-Content "env:$name" $value
    }
}

echo "Deploying Backend..."
gcloud run deploy electraguide-backend `
  --source ./backend `
  --region $REGION `
  --project $PROJECT_ID `
  --no-allow-unauthenticated `
  --set-env-vars "MONGODB_URI=$env:MONGODB_URI,FIREBASE_PROJECT_ID=$env:FIREBASE_PROJECT_ID,GOOGLE_API_KEY=$env:GOOGLE_API_KEY,JWT_SECRET=$env:JWT_SECRET,ENVIRONMENT=production,CLIENT_URL=https://electraguide-frontend-265235104456.asia-south1.run.app"

echo "Backend deployment triggered."
