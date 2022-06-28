import express from "express";
import jwt  from "jsonwebtoken";
import mongoose from "mongoose";
import { validationResult } from "express-validator";
import { registerValidaton } from './validations/auth.js';
import bcrypt from 'bcrypt';
import UserModel from './models/user.js';

import checkAuth from './utils/checkAuth.js';



mongoose.connect('mongodb+srv://admin:12345@cluster0.ljmo9px.mongodb.net/blog?retryWrites=true&w=majority').then(() => {
    console.log('db ok');
}).catch((err) => {
    console.log(err);
});
// Подключаем БД

const app = express();
// Вся логика express хранится тут

app.get('/', (req, res) => {
    // Req - хранится информация о том что прислал клиент
    // Res - обьясняется то что мы будем передавать клиенту
    res.send('111 1 hello world');
});
// Тут мы указываем что если придет get запрос на главный путь, то 
// выполняется эта callback функция

app.use(express.json());
// Позволяет читать json который мы отправляем

app.post('/auth/register',  registerValidaton, async (req, res) => {
    try {
        const errors = validationResult(req);
        // Тут получаем все наши ошибки
    
        if(!errors.isEmpty()){
            return res.status(400).json(errors.array());
        }
        // Если запрос не проходит
    
        const password = req.body.password;
        // Достаем пароль из реквеста
        const salt = await bcrypt.genSalt(10);
        // Создаем функцию шифрования
        const hash = await bcrypt.hash(password, salt);
        // Кэшируем наш пароль
    
        // Подготавливаем документ для создания пользователя
        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash
        });

    
        // Создаем пользователя, сохраняем в mongoDB
        const user = await doc.save();
    
        // Создаем токен, достаем для него айди из монго ДБ

        const {passwordHash, ...userData} = user._doc;

        // Возвращаем инфу о пользователе
        res.json({
            ...userData._doc,
            success: true,
        });
        // Если запрос проходит валидацию
    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось зарегестрироваться'
        });
        // Если запрос не проходит валидацию.
    }
});
// Вторым аргументом наш валидатор

app.listen(4444, (err) => {
    if(err){
        return console.log(err);
    };

    console.log('Server starting');
});
// Функция которая запускает сервер, первый параметр это порт на котором
// будет запущен localhost, второй параметр это функция которая выполняется
// Аругемнт err используется что бы вывести ошибку если сервер не запуститься

app.post('/auth/login', async (req,res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });
        // ищем пользователя

        if(!user){
            return req.status(404).json({
                message: 'Пользователь не найден',
            });
            // если не найден
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
        // проверяем такой ли пароль


        if(!isValidPass){
            return res.status(404).json({
                message: 'Неверный логит и пароль'
            })
            // если пароль не правильный
        }


        const token = jwt.sign(
            {
                _id: user._id,
            },
                'secret123', 
            // ключ бгагодоря которому мы зашифруем токен
            {
              expiresIn: '30d',  
            }, // сколько токен будет хранится
            );
            // создаем токен

            const {passwordHash, ...userData} = user._doc;

            // Возвращаем инфу о пользователе
            res.json({
                ...userData._doc,
                token,
                success: true,
            });

    } catch(err){
        console.log(err);
        res.status(500).json({
            message: '500',
        });
    };
})

// checkAuth проверка авторизации
app.get('/auth/me',  checkAuth, (req, res) => {
    // Тут мы должны взять токен и расшифровать его
    try{
        res.json({
            success: true
        })
        // Если checkAuth отрабатываем выводим success true
    } catch {

    }
});

// 1.09.53