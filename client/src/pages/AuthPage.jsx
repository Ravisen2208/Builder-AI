import React from 'react'
import LoginLeft from '../components/LoginLeft';

const AuthPage = ({mode}) => {
const isLogin = mode === 'login';

  return (
    <div className='min-h-screen bg-white flex text-zinc-900 font-sans'>
        {/* Left Side - Branding */}
        <LoginLeft/>
        {/* right Side - From */}

    </div>
  )
}

export default AuthPage