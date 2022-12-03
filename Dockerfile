FROM node:16-alpine as builder

# Устанавливаем зависимости
WORKDIR /usr/src/netology-back
COPY package.json yarn.lock /usr/src/netology-back/


# Устанавливаем зависимости
RUN yarn

# Собираем приложение
COPY . /usr/src/netology-back/
RUN yarn build

FROM node:16-alpine

# Копируем собранное приложение
WORKDIR /usr/src/netology-back
COPY --from=builder /usr/src/netology-back/package*.json /usr/src/netology-back/
COPY --from=builder /usr/src/netology-back/node_modules/ /usr/src/netology-back/node_modules/
COPY --from=builder /usr/src/netology-back/dist/ /usr/src/netology-back/dist/


EXPOSE 3000
CMD ["yarn", "start:prod"]
