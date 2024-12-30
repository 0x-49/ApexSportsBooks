# AWS S3 and CloudFront Setup Script
# Prerequisites: AWS CLI must be installed and configured

# Variables
$BUCKET_NAME="apex-sportsbooks-content"
$REGION="us-east-1"
$PROFILE="default" # Change this if using a different AWS profile

# Create S3 bucket
aws s3api create-bucket --bucket $BUCKET_NAME --region $REGION

# Enable static website hosting
aws s3 website s3://$BUCKET_NAME/ --index-document index.html --error-document error.html

# Create bucket policy for public read access
$BUCKET_POLICY = @"
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
        }
    ]
}
"@

# Save policy to file and apply it
$BUCKET_POLICY | Out-File -FilePath "bucket-policy.json"
aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://bucket-policy.json

# Enable CORS
$CORS_CONFIGURATION = @"
{
    "CORSRules": [
        {
            "AllowedHeaders": ["*"],
            "AllowedMethods": ["GET", "HEAD"],
            "AllowedOrigins": ["*"],
            "ExposeHeaders": []
        }
    ]
}
"@

$CORS_CONFIGURATION | Out-File -FilePath "cors-policy.json"
aws s3api put-bucket-cors --bucket $BUCKET_NAME --cors-configuration file://cors-policy.json

Write-Host "S3 bucket setup complete. Now setting up CloudFront..."

# Create CloudFront distribution
$DISTRIBUTION_CONFIG = @"
{
    "CallerReference": "$(Get-Date -Format "yyyyMMddHHmmss")",
    "Origins": {
        "Quantity": 1,
        "Items": [
            {
                "Id": "S3-$BUCKET_NAME",
                "DomainName": "$BUCKET_NAME.s3.amazonaws.com",
                "S3OriginConfig": {
                    "OriginAccessIdentity": ""
                }
            }
        ]
    },
    "DefaultCacheBehavior": {
        "TargetOriginId": "S3-$BUCKET_NAME",
        "ViewerProtocolPolicy": "redirect-to-https",
        "AllowedMethods": {
            "Quantity": 2,
            "Items": ["GET", "HEAD"],
            "CachedMethods": {
                "Quantity": 2,
                "Items": ["GET", "HEAD"]
            }
        },
        "ForwardedValues": {
            "QueryString": false,
            "Cookies": {
                "Forward": "none"
            }
        },
        "MinTTL": 0,
        "DefaultTTL": 86400,
        "MaxTTL": 31536000
    },
    "Comment": "Apex Sportsbooks Content Distribution",
    "Enabled": true
}
"@

$DISTRIBUTION_CONFIG | Out-File -FilePath "cloudfront-config.json"
aws cloudfront create-distribution --distribution-config file://cloudfront-config.json

Write-Host "CloudFront distribution creation initiated. Please wait 15-20 minutes for deployment to complete."
