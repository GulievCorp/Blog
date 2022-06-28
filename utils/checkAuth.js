// Здесь мы будем создавать middleWare - это функция посредник которая
// будет решать какую то секретную информацию

import jwt from "jsonwebtoken";

export default (req, res, next) => {
    const token = req.headers.authorization;
    // Получаем токен

    res.send(token);
    // Выводим токен
    next();
    // Говорим что идем дальше
//    res.send(token)
};