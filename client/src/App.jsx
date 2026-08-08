import React from 'react'
import { Routes ,Route, Navigate } from 'react-router-dom'
import { AuthLayout, GuestLayout } from './pages/Layout'
import AuthPage from './pages/Authpage'
import HomePage from './pages/Homepage'
import BuilderPage from './pages/BuilderPage'
import PreviewPage from './pages/PreviewPage'

const App = () => {
  return (
<Routes>
  {/*login routes*/}
  <Route element = {<GuestLayout/>}>
  <Route path='/login'element= {<AuthPage mode="login"/>}/>
  <Route path='/register'element= {<AuthPage mode="register"/>}/>
  </Route>

  {/*protected router*/}
  <Route element = {<AuthLayout/>}>
  <Route path='/'element= {<HomePage/>}/>
  <Route path='/builder/:id'element= {<BuilderPage/>}/>
  <Route path='/preview/:id'element= {<PreviewPage/>}/>
  </Route>
    
    {/*Catch-all */}
    <Route path='*' element={<Navigate to="/" replace />} />

</Routes>
  )
}

export default App