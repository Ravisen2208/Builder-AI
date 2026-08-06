import React from 'react'
import { Routes ,Route } from 'react-router-dom'
import Layout from './pages/Layout'
import AuthPage from './pages/Authpage'

const App = () => {
  return (
<Routes>
  {/*login routes*/}
  <Route element = {<Layout/>}>
  <Route path='/login/'element= {<AuthPage mode="login"/>}/>

  </Route>
</Routes>
  )
}

export default App