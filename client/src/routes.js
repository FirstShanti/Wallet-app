import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {AuthPage} from './pages/AuthPage'
import {CreateServicePage} from './pages/CreateServicePage'
import {DetailPage} from './pages/DetailPage'
import {ServicesPage} from './pages/ServicesPage'
import {StatisticServicePage} from './pages/StatisticServicePage'

export const useRoutes = isAuthenticated => {
	if (isAuthenticated) {
		return (
			<Switch>
				<Route path='/create' exact>
					<CreateServicePage />
				</Route>
				<Route path='/services' exact>
					<ServicesPage />
				</Route>
				<Route path='/stat' exact>
					<StatisticServicePage />
				</Route>
				<Route path='/detail:id'>
					<DetailPage />
				</Route>
				<Redirect to='/services' />
			</Switch>
		)
	}

	return (
		<Switch>
			<Route path='/' exact>
				<AuthPage />
			</Route>
			<Redirect to='/' />
		</Switch>)
}