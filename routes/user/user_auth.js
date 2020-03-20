require('dotenv').config()
const express = require('express');
const router = express.Router();
const User = require('../../models/User')
const bcrypt = require('bcryptjs')
const {check, validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('config')


router.post(
	'/register',
	[
		check('email', 'Некорректный email').isEmail(),
		check('password', 'Минимальная длина пароля: 6').isLength({min: 6}),
	],
	async (req, res) => {
	try {
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array(),
				message: 'Некорректные данные при регистрации'
			})
		}
		const {email, password} = req.body
		
		const candidate = await User.findOne({ email })
		
		if (candidate) {
			return res.status(400).json({ message: 'Такой пользователь уже зарегистрирован'})
		}

		const hashedPassword = await bcrypt.hash(password, 12)
		
		const user = new User({ email, password: hashedPassword })

		await user.save()
		console.log('user: ', user)
		return res.status(201).json({ message: 'Пользователь создан'})

	} catch (e) {
		res.status(500).json({ e, message: 'Что-то пошло не так, попробуйте снова' })
	}
})

router.post(
	'/login',
	[
		check('email', 'Введите корректные email').normalizeEmail().isEmail(),
		check('password', 'Введите пароль').exists()
	],
	async (req, res) => {
	try {

		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array(),
				message: 'Некорректные данные при авторизации'
			})
		}

		const {email, password} = req.body

		const user = await User.findOne({ email })

		if (!user) {
			return res.status(400).json({ message: 'Пользователь не найден' })
		}

		const isMatch = await bcrypt.compare(password, user.password)
		if (!isMatch) {
			return res.status(400).json({ message: 'Неверный пароль, попробуйте снова'})
		}

		const token = jwt.sign(
			{ userIf: user.id },
			process.env.JWT_SECRET,
			{ expiresIn: '1h'}
		)

		res.json({ token, userId: user.id })
		
	} catch (e) {
		res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
	}
})


module.exports = router
