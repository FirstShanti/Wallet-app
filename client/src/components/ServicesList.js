import React from 'react'
import {Link} from 'react-router-dom'
import {MyClickableComponent} from './AddForm'
import {useState, useEffect, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {AuthContext} from '../context/auth.context'
import {Loader} from '../components/Loader'
import SvgIcon from '@material-ui/core/SvgIcon';
import { ReactComponent as Logo } from '../icons8-delete.svg';

export const ServicesList = ({ services }) => {

  const history = useHistory()
  const auth = useContext(AuthContext)
  const message = useMessage()
  const {loading, request, error, clearError} = useHttp()
  const [form, setForm] = useState(
    { 
      name: '',
      price: 0,
      percent: 0,
      count: []
    }
  )
  const [value, setValue] = useState(
    {
      count: ''
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
  
  const changeCountHandler = event => {
    setValue({count: event.target.value})
    setForm( form['count'].push({[event.target.name]: Number(event.target.value)}) )
  }

  const addHandler = async () => {
    try {
      const data = await request('/api/service/add',
        'POST',
        {...form},
        {Authorization: `Bearer ${auth.token}`
      })
      message(data.message)
      history.push('/services')
    } catch (e) {}
  }

  const countAddHandler = async () => {
    try {
      const data = await request('api/service/calculate',
        'POST',
        form['count'],
        {Authorization: `Bearer ${auth.token}`})
      message(data.message)
      history.push('/services')
    } catch (e) {}
  }

  const deleteHandler = async (id) => {
    try {
      const data = await request(`/api/service/delete/${id}`,
        'GET',
        null,
       {Authorization: `Bearer ${auth.token}`}
    )
      console.log(data)
      const reload = await window.location.reload(false);
       
      if (loading) {
        return <Loader/>
      }
      message(data.message)
        
    } catch (e) {}
  }
  
  if (!services.length) {
    return (
      <>
        <p className="center" style={{ paddingTop: '2rem'}}>Услуг пока нет</p>
        <div className="service_btn_add">
          <MyClickableComponent  />
        </div>
      </>
    )

  }

  return (
    <div>
    <table style={{ marginTop: '1rem'}}>
      <thead>
      <tr>
        <th>Название</th>
        <th>Цена</th>
        <th>Процент</th>
        <th>Количество</th>
        <th>Подробнее</th>
        <th></th>
      </tr>
      </thead>

      <tbody>
      { services.map((service, index) => {
        return (
          <tr key={service._id}
            onChange={changeHandler}>
            <td>{service.name}
            </td>
            <td>{service.price}</td>
            <td>{service.percent}
            </td>
            <td>
              <input name={service._id} onChange={changeCountHandler} className='inputCount'></input>
            </td>
            <td>
              <Link to={`/detail/${service._id}`}>Открыть</Link>
            </td>
            <td>
            <Logo className='deleteIcon' onClick={() => deleteHandler(service._id)} title='delete' />
            </td>
          </tr>
        )
      }) }

      </tbody>
    </table>
    <div className="service_btn_add">
        <MyClickableComponent  />
        <button
          className="waves-effect waves-light btn addCalculateBtn"
          disabled={!value.count} 
          onClick={() => countAddHandler()}
        >
          Рассчитать{/*<Logo className='deleteIcon' />*/}
        </button>
        
    </div>

    </div>
  )
}