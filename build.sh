docker rm -f $(docker ps -a -q)
docker build -t bedrock-assistant:latest --label bedrock-assistant .
docker rmi $(docker images --filter "dangling=true" -q --no-trunc)
docker image prune --force --filter='label=bedrock-assistant'
export AWS_ACCESS_KEY_ID=$(aws configure get default.aws_access_key_id)
export AWS_SECRET_ACCESS_KEY=$(aws configure get default.aws_secret_access_key)
docker run  -e AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \
            -e AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY \
            -e ENV="dev" \
            --init --name bedrock-assistant -p 8080:8080 bedrock-assistant