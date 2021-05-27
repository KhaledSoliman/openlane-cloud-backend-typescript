FROM node:12

# working directory
RUN mkdir /app
WORKDIR /app

# update the operting system
USER root
RUN apt-get update \
      && apt-get install -y sudo \
      && rm -rf /var/lib/apt/lists/*
RUN apt install openssh-client
RUN npm install pm2 -g
#copy all the files
COPY . .

# install node dependency and build project
RUN npm install
RUN npm run build

# container port
EXPOSE 3030

RUN useradd -m user
RUN mkdir -p /home/user/.ssh
RUN chown -R user:user /home/user/.ssh
RUN echo "Host *.trabe.io\n\tStrictHostKeyChecking no\n" >> /home/user/.ssh/config
USER user
# run on cointainer start command
CMD ["pm2-runtime", "build/src/server.js"]

