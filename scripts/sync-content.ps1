# Content Sync Script for S3

$BUCKET_NAME="apex-sportsbooks-content"
$CONTENT_DIR="../src/data/SportsBooksArticles"

# Sync markdown files to S3
aws s3 sync $CONTENT_DIR s3://$BUCKET_NAME/articles/ --content-type "text/markdown" --metadata-directive REPLACE

Write-Host "Content sync complete. Files are now available via CloudFront."
