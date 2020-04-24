FROM node

RUN mkdir -p /usr/src/web_site/
WORKDIR /usr/src/web_site/

COPY . /usr/src/web_site/
RUN npm install

EXPOSE 3000

CMD ["node", "app"]