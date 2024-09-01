npm run build:uat

docker buildx build --platform=linux/amd64 -t bedrock-assistant/frontend .
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 565692740138.dkr.ecr.us-east-1.amazonaws.com
docker tag bedrock-assistant/frontend:latest 565692740138.dkr.ecr.us-east-1.amazonaws.com/bedrock-assistant/frontend:latest
docker push 565692740138.dkr.ecr.us-east-1.amazonaws.com/bedrock-assistant/frontend:latest
aws ecs update-service --cluster ecs-us-east-1 --service bedrock-assistant-frontend --force-new-deployment --region us-east-1