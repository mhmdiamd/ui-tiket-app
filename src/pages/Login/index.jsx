import React from 'react'
import AuthTemplate from '../../../template/AuthLayout/AuthTemplate'
import InputAuthForm from '../../../components/Forms/AuthForm/InputAuthForm'
import { Link, useLocation } from 'react-router-dom'
import facebook from '../../assets/auth/facebook.png'
import google from '../../assets/auth/google.png'
import style from './Login.module.css'
import { useUserLoginMutation } from '../../features/auth/authApi'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../../app/reducer/authSlice'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import { showLoading } from '../../common/loadingHandler'
import { getGoogleUrl } from '../../../lib/getGoogleUrl'

const Login = () => {
  const location = useLocation();
  let from = location.state?.from?.pathname || '/';
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [userLogin, { isLoading, isSuccess, isError, error }] = useUserLoginMutation()
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const changeHandler = (e) => {
    setData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  const directPath = () => {
    return navigate('/')
  }

  const loginHandler = async (e) => {
    e.preventDefault();
    const res = await userLogin(data);
    const {token, refreshToken, ...user} = res.data
    dispatch(setCredentials({ user: user, token: res?.data?.token }));
  };

  useEffect(() => {
    if (isLoading) {
      showLoading('Please Wait...')
    }

    if (isError) {
      Swal.close();
      setData((prev) => {
        return {
          ...prev,
          password: "",
        };
      });
    }

    if (isSuccess) {
      Swal.close();
      directPath();
    }
  }, [isLoading, isSuccess, isError]);

  const googleRedirect = () => {
    window.open(`https://be-tiket-app.up.railway.app/auth/google`, '_self')
  }

  return (
    <AuthTemplate title={'Login'}>
      {error && (
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          {error?.data?.message}
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
          ></button>
        </div>
      )}
      <form onSubmit={loginHandler}>
        <InputAuthForm title="Email" name={'email'} value={data.email} type={'email'} placeholder='Email' onchange={changeHandler} />
        <InputAuthForm title="Password" name={'password'} value={data.password} type="password" placeholder='Password' onchange={changeHandler} />


        <div className="button d-grid my-2">
          <button style={{ height: '50px' }} type='submit' className='btn btn-blue fw-bolder'>Sign in</button>
        </div>
        <div className="forgot text-center mt-3 mb-5">
          <p className='p-0 mb-0'>Did You forgot your password?</p>
          <Link to='/forgot-password' className='text-blue no-underline'>Tap here for reset</Link>
        </div>
        <hr className='mx-auto' style={{ width: '80%' }} />

        <div className="sign-with text-center">
          <p>or sign with</p>
          <div className="link-other-sign d-flex justify-content-center ">
            <div className={`border-blue ${style.link} d-flex align-items-center justify-content-center me-4 rounded`} alt="" onClick={googleRedirect}>
              <img src={google} alt="" />
            </div>
            <Link to='' className={`border-blue ${style.link} d-flex align-items-center justify-content-center rounded`} alt="" >
              <img src={facebook} alt="" />
            </Link>
          </div>
        </div>
        <div className="direct text-center mt-4">
          <p className='text-secondary'>Dont have account? <Link to={'/register'} className='text-blue no-underline'>Register</Link></p>
        </div>
      </form>

    </AuthTemplate>
  )
}

export default Login