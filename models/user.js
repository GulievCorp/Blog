import mongoose from "mongoose";

// Создаем свойства юзера для БД
const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        // Почта должна быть уникальной в бд не может быть двух одинаковых почт
    },
    // Шифрование пароля
    passwordHash: {
        type: String,
        required: true,
    },
    // Просто не обязательная строчка
    avatarUrl: String,
}, {
    // Обьясняем что схема должна прикрутить создание и обновление в БЖ
    timestamps: true,
});

// Создаем и экспортируем нашу схему в модель.
export default mongoose.model('User', UserSchema);