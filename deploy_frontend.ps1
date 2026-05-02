# Deployment script for ElectraGuide Frontend
$PROJECT_ID = "ballot-oraclee"
$REGION = "asia-south1"

echo "Deploying Frontend to Cloud Run..."
gcloud run deploy electraguide-frontend `
  --source ./frontend `
  --region $REGION `
  --project $PROJECT_ID `
  --allow-unauthenticated

echo "Frontend deployment triggered."
