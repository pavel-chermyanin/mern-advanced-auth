const bcrypt = require('bcryptjs')
const uuid = require('uuid')


const UserModel = require('../models/user-model')
const mailService = require('./mail-service')
const tokenService = require('./token-service')
const UserDto = require('../dtos/user-dto')

class UserService {
    async registration(email, password) {
        // проверяем есть ли user с таким email
        const candidate = await UserModel.findOne({ email })
        // если есть, выбросить ошибку
        if (candidate) {
            throw new Error(`Пользователь с email ${email} уже существует`)
        }
        // хешируем пароль
        const hashPassword = bcrypt.hashSync(password,3)
        // создаеми id
        const activationLink = uuid.v4()
        // создаем user
        const user = await UserModel.create({
            email,
            password: hashPassword,
            activationLink
        })
        // вызываем функцию по отправке id на email
        await mailService.sendActivationMail(
            email,
            activationLink
        )
        // создаем user без поля пароль
        const userDto = new UserDto(user)
        // создаем токены
        const tokens = tokenService.generateTokens(
            { ...userDto }
        )
        // создаем модель токена в бд или обновляем
        await tokenService.saveToken(
            userDto.id,
            tokens.refreshToken
        )

        return {
            ...tokens,
            user: userDto
        }

    }
}

module.exports = new UserService()