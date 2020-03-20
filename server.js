require('dotenv').config()
const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
// const morgan = require('morgan');

const app = express();
const PORT = config.get('port') || 5000

app.use(express.json({extended: true}))
app.use(bodyParser.urlencoded({extended: true}))

app.use('/api/auth', require('./routes/user/user_auth'))
app.use('/api/service', require('./routes/user/services'))
// morgan.token('id', (req) => req.id.split('-')[0])

// ///midllware
//         // logging
// morgan(':method :url :status :res[content-length] - :response-time ms');
//         //parses incoming requests with JSON payloads
// app.use(express.json());
//         //parses incoming requests with urlencoded payloads
// app.use(bodyParser.urlencoded({extended: true}));

async function start() {
	try {
		await mongoose.connect(process.env.DB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true
		})
		app.listen(PORT, () => console.log(`npm start at port: ${PORT}`))
	} catch (e) {
		console.log('Server Error', e.message)
		process.exit(1)
	}
}

start()

