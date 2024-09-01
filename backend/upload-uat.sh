docker buildx build --platform=linux/amd64 -t bedrock-assistant/backend .
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 565692740138.dkr.ecr.us-east-1.amazonaws.com
docker tag bedrock-assistant/backend:latest 565692740138.dkr.ecr.us-east-1.amazonaws.com/bedrock-assistant/backend:latest
docker push 565692740138.dkr.ecr.us-east-1.amazonaws.com/bedrock-assistant/backend:latest
aws ecs update-service --cluster ecs-us-east-1 --service bedrock-assistant-backend --force-new-deployment --region us-east-1