import React, { useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App';
import { toast } from 'react-toastify'
import { useTranslation } from '../context/LanguageContext'

const Login = ({ setIsLoggedIn }) => {
  const { t } = useTranslation();

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            //  الـ cookie كتتخزن أوتوماتيك من الـ backend — ما كنحتاجوش token ف response
            const response = await axios.post(backendUrl + '/api/user/admin', { email, password })
            if (response.data.success) {
                setIsLoggedIn(true)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center w-full'>
            <div className='bg-white shadow-md rounded-lg px-8 py-6 max-w-md'>
                <h1 className='text-2xl font-bold mb-4'>{t('auth.title')}</h1>
                <form onSubmit={onSubmitHandler}>
                    <div className='mb-3 min-w-72'>
                        <p>{t('auth.email')}</p>
                        <input onChange={(e) => setEmail(e.target.value)} value={email} className='rounded-md w-full px-3 py-2 border border-gray-700 mb-2' type="email" placeholder={t('auth.emailPlaceholder')} />
                    </div>
                    <div className='mb-3 min-w-72'>
                        <p>{t('auth.password')}</p>
                        <input onChange={(e) => setPassword(e.target.value)} value={password} className='rounded-md w-full px-3 py-2 border border-gray-700 mb-2' type="password" placeholder={t('auth.passwordPlaceholder')} />
                    </div>
                    <button className='mt-2 w-full px-4 py-2 rounded-md text-white bg-black' type='submit'>{t('auth.login')}</button>
                </form>
            </div>
        </div>
    )
}

export default Login