import { body } from "express-validator";
// Импортируем валидатор body

export const registerValidaton = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 5 символов').isLength({min: 5}),
    // Минимальная длина 5 символов
    body('fullName', 'Укажите имя, минмум 3 символа').isLength({min: 3}),
    body('avatarUrl', 'Неверная ссылка на аватарку').optional().isURL(),
    // Пишем что это свойство не обязательно но если оно придет то провалидируется
];