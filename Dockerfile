FROM node:16.17.1-alpine3.16 as build
RUN apk add --no-cache curl \
    && curl -sL https://unpkg.com/@pnpm/self-installer | node

WORKDIR /usr/app
COPY . /usr/app
RUN pnpm i
RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "preview"]