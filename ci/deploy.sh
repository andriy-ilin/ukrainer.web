#!/bin/sh

pip install awscli --upgrade --user
mkdir -p ~/.aws
echo '[profile eb-cli]' > ~/.aws/config
echo "aws_access_key_id = $AWS_ACCESS_KEY_ID" >> ~/.aws/config
echo "aws_secret_access_key = $AWS_SECRET_ACCESS_KEY" >> ~/.aws/config
aws s3 sync build/ "s3://$S3_BUCKET" --acl public-read --delete
