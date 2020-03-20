import React, {useState, useEffect, useContext} from 'react'
import {useHistory, Redirect} from 'react-router-dom'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {AuthContext} from '../context/auth.context'

export const CreateServicePage = () => {
	const history = useHistory()
	const auth = useContext(AuthContext)
	const message = useMessage()
	const {loading, request, error, clearError} = useHttp()
	const [form, setForm] = useState(
		{	
			name: '',
			price: 0,
			percent: 0,
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

	const addHandler = async () => {
		try {
			const data = await request('/api/service/add',
				'POST',
				{...form},
				{Authorization: `Bearer ${auth.token}`
			})
			message(data.message)
			window.location.reload(false);
			history.push('/services')
		} catch (e) {}

	}
	

	return (
		<div className= "row">
			<div className="col s6 offset-2" style={{paddingTop: '2rem'}}>
			  	<h1>Create service</h1>
				  	<div className="input-field">
          				<input 
          					className="authInput"
          					id="name"
          					placeholder="Enter name of service"
          					type="text"
          					autoComplete="off"
          					name='name'
          					onChange={changeHandler}
          				/>
          				<label htmlFor="name">Name</label>
        			</div>
        			<div className="input-field">
          				<input 
          					className="authInput"
          					id="price"
          					autoComplete="off"
          					placeholder="Enter price"
          					type="text"
          					name='price'
          					onChange={changeHandler}
          				/>
          				<label htmlFor="price">Price</label>
        			</div>
        			<div className="input-field">
          				<input 
          					className="authInput"
          					id="percent"
          					autoComplete="off"
          					placeholder="Enter percent"
          					type="text"
          					name='percent'
          					onChange={changeHandler}
          				/>
          				<label htmlFor="percent">Percent</label>
          				<button
					  		className="btn black-text btnAuth"
					  		disabled={loading}
					  		onClick={addHandler}
					  		style={{ marginTop: '1rem'}}
					  	>
					  		Create
					  	</button>
        			</div>
			</div>
		</div>
	)
}