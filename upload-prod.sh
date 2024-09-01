cd frontend/
npm run build:prod
cd ../
aws s3 cp . s3://account-bucket-eu-west-2/bedrock-assistant/ --recursive \
--exclude "frontend/node_modules*" \
--exclude "frontend/src*" \
--exclude ".git*" \
--exclude "frontend/public*" \
--exclude "upload.sh*" \
--exclude "frontend/package*" \
--exclude "backend/node_modules*" \
--exclude "*.DS_Store" \
--exclude "*/*.DS_Store"