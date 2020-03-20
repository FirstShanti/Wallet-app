const {Router} = require('express')
const Service = require('../../models/Service')
const History = require('../../models/History')
const auth = require('../../middleware/auth.middleware')
const router = Router()
const config = require('config')
const {check, validationResult} = require('express-validator')

router.post('/add', auth,
	[
		check('name', 'Минимальная количество символов: 4').isLength({min: 4}),
		check('price', 'Значение должно быть числовым').isNumeric(),
		check('percent', 'Значение должно быть числовым').isNumeric(),
	],
	async (req, res) => {
	try {
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array(),
				message: 'Некорректные данные при вводе'
			})
		} 
		const {name, price, percent} = req.body
		
		const candidate = await Service.findOne({ name })
		
		if (candidate) {
			return res.status(400).json({ message: 'Такая услуга уже создана'})
		}
		
		const service = new Service({ name, price, percent, owner: req.user.userIf })

		await service.save()
		console.log('service: ', service)
		return res.status(201).json({ message: 'Услуга создана'})

	} catch (e) {
		res.status(500).json({ e, message: 'Что-то пошло не так, попробуйте снова' })
	}
})

router.get('/delete/:id', auth, async (req, res) => {
	try {
		// console.log('req: ', req)
		const service = await Service.findByIdAndDelete(req.params.id)
		console.log('service: ', service)
		return res.status(201).json({ message: 'Услуга удалена'})

	} catch (e) {
		console.log(e)
		res.status(500).json({ e, message: 'Что-то пошло не так, попробуйте снова' })
	}
})


router.get('/', auth, async (req, res) => {
	try {
		//console.log(req.user)
		const services = await Service.find({ owner: req.user.userIf })
		res.json(services)
	} catch (e) {
		res.status(500).json({ e, message: 'Что-то пошло не так, попробуйте снова' })
	}
})

router.get('/:id', auth, async (req, res) => {
	try {
		const service = await Service.findById(req.params.id)
		res.json(service)
	} catch (e) {
		res.status(500).json({ e, message: 'Что-то пошло не так, попробуйте снова' })
	}
})

router.post('/calculate', auth, async (req, res) => {
	try {
		for (let i = 0; i < req.body.length; i++) {
			for (key in req.body[i]) {
				try {

					const date = new Date()
					const year = date.getFullYear()
					const month = date.getMonth()
					const day = date.getDate() + 1
					
					const service = await Service.findById(key)
					const income = req.body[i][key] * service.income
					const history = new History({ date: new Date(year, month, day), service: key, count: req.body[i][key], income: income, owner: req.user.userIf})
					await history.save()
				} catch (e) {
					return res.status(500).json({ message: `Что-то пошло не так история не создана`})
				}
			}  
		}

		const date = new Date()
		const year = date.getFullYear()
		const month = date.getMonth()
		const day = date.getDate() + 1

		const history = await History.find({date: new Date(year, month, day)})
		const income = 0

		for (let i = 0; i < history.length; i++) {
			for (key in history[i]) {
				income += Number(history[i]['income'])
			}
		}

		console.log('total: ', income)

		return res.status(201).json({ message: `Итого: $(history.income)`})

	} catch (e) {
		console.log('e: ', e)
		res.status(500).json({ e, message: 'Что-то пошло не так, попробуйте снова' })		
	}
})


module.exports = router
