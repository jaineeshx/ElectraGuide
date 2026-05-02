# Deployment script for ElectraGuide
# Region: asia-south1
$PROJECT_ID = "ballot-oraclee"
$REGION = "asia-south1"

echo "Preparing environment variables..."
$ENV_FILE = "./backend/.env"
$YAML_FILE = "./backend/env.yaml"

if (Test-Path $ENV_FILE) {
    # Convert .env to YAML for secure deployment
    $content = Get-Content $ENV_FILE | Where-Object { $_ -match "=" -and $_ -notmatch "^#" }
    $yaml = @()
    foreach ($line in $content) {
        $name, $value = $line.Split('=', 2)
        $yaml += "$($name.Trim()): $($value.Trim())"
    }
    # Add production specific vars
    $yaml += "NODE_ENV: production"
    $yaml += "CLIENT_URL: https://electraguide-frontend-265235104456.asia-south1.run.app"
    
    $yaml | Out-File -FilePath $YAML_FILE -Encoding utf8
}

echo "Deploying Backend..."
gcloud run deploy electraguide-backend `
  --source ./backend `
  --region $REGION `
  --project $PROJECT_ID `
  --no-allow-unauthenticated `
  --env-vars-file $YAML_FILE

# Clean up
if (Test-Path $YAML_FILE) {
    Remove-Item $YAML_FILE
}

echo "Backend deployment completed."
