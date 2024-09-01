FROM --platform=linux/amd64 node:latest
WORKDIR /app/backend
COPY --chown=node:node . .
EXPOSE 9000
RUN npm install --legacy-peer-deps
CMD ["npm","run", "uat"]
