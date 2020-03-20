import React, {useState, useEffect, useContext} from 'react'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {AuthContext} from '../context/auth.context'
import {Loader} from '../components/Loader'

export const AuthPage = () => {
	const auth = useContext(AuthContext)
	const message = useMessage()
	const {loading, request, error, clearError} = useHttp()
	const [form, setForm] = useState(
		{	
			email: '',
			password: ''
		}
	)

	useEffect(() => {
			message(error)
			clearError()
		}, [error, message, clearError]
	)

	useEffect(() => {
		window.M.updateTextFields()
	})
	
	const changeHandler = event => {
		setForm({ ...form, [event.target.name]: event.target.value })
	}

	const registerHandler = async () => {
		try {
			const data = await request('/api/auth/register', 'POST', {...form})
			message(data.message)
		} catch (e) {}
	}

	const loginHandler = async () => {
		try {
			const data = await request('/api/auth/login', 'POST', {...form})
			auth.login(data.token, data.userId)
			message(data.message)
		} catch (e) {}
	}

	if (loading) {
    	return <Loader/>
  	}

	return (
		<div className= "row">
			<div className="col s6">
			  <h1>My Wallet</h1>
				  <div className="card white">
					  <div className="card-content black-text">
					  	<span className="card-title">Authorization</span>
					  	<div>
					  		<div className="input-field">
          						<input 
          							id="email"
          							className='yellow-input'
          							placeholder="Enter email"
          							type="text"
          							name='email'
          							value={form.email}
          							autoComplete="off"
          							onChange={changeHandler}
          						/>
          						<label htmlFor="email">Email</label>
        					</div>

        					<div className="input-field">
          						<input
          							id="password"
          							className="yellow-input"
          							placeholder="Enter password"
          							type="password"
          							name="password"
          							value={form.password}
          							onChange={changeHandler}
          						/>
          						<label htmlFor="password">Password</label>
        					</div>

					  	</div>
					  </div>
					  <div className="card-action">
					  	<button
					  		className="btn pink lighten-2 black-text"
					  		style={{margin: 10}}
					  		disabled={loading}
					  		onClick={loginHandler}
					  	>
					  		Login
					  	</button>
					  	<button
					  		className="btn grey lighten-2 black-text"
					  		disabled={loading}
					  		onClick={registerHandler}
					  	>
					  		SignUp
					  	</button>
			
					  </div>
				  </div>
			</div>
		</div>
	)
}