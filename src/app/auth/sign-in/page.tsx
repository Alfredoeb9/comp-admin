'use client';

import { getSession, signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const { data: data, status } = useSession();
  // const dispatch = useAppDispatch()
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  // const user = useAppSelector(state => state.authXReducer.user);
  const [loading, setLoading] = useState<boolean>(false);
  // const { isSuccess, message } = useSelector((state: { user: any; }) => state.user);
  // const [isVerified, setIsVerified] = useState<boolean>(false);
  const [spinnerLoading, setSpinnerLoading] = useState<boolean>(false);
  const [verifyEmail, setVerifyEmail] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | any>('');
  // const { resend, error2, isLoading2 } = useResend();
  const [show, setShow] = useState<any>({ password: false });

  useEffect(() => {
    if (data?.user.role === 'admin') {
      return router.push('/');
    }
  }, [data]);

  // useEffect(() => {
  // 	if (error2) {
  // 		// setVerifyEmail(false)
  // 		setError(error2)
  // 	}
  // }, [resend, error2])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (email === '' || password === '') {
        return setError('Please provide a email and password');
      }
      const signInData = await signIn('credentials', {
        email: email,
        password: password,
        redirect: false,
      })
        .then(async (res) => {
          console.log('false');
          setVerifyEmail(false);
          if (!res) return null;

          if (res?.ok === false) {
            console.log('false');
            if (!res.error) return null;
            setError(res?.error);
            if (res?.error.includes('Email is not verified')) {
              setVerifyEmail(true);
            }
            return null;
          }

          const session = await getSession();

          if (!session) return setError(`Error: cannot find user`);

          setError('');
          setVerifyEmail(false);
          // dispatch(login(session as any));
          return session;
        })
        .catch((error) => {
          console.log('error', error);
          return setError(error);
        });

      return signInData;

      // localStorage.setItem("user", JSON.stringify(user));
    } catch (error: any) {
      console.log('error2', error);
      return setError(error);
    }
  };

  const resendEmail = async (e: any) => {
    e.preventDefault();
    // try {
    // 	console.log("sending")
    //   	await resend(e, email, "resend");
    // } catch (error) {
    // 	setError(error)
    // 	console.log("error signin", error)
    // }
  };

  return (
    <div className='darK:bg-slate-800 m-auto flex min-h-full w-96 flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
      {/* { isLoading2 || spinnerLoading ? (
				<p>this is suppose to be a spinner</p>
			) : ( */}
      <section className='w-full rounded-lg px-2.5 shadow dark:border dark:border-gray-700 sm:max-w-md md:mt-0'>
        <h3 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight'>
          Log In
        </h3>
        <form className='space-y-6' onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium leading-6 '
            >
              Email:
            </label>
            <input
              className='mt-2 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              type='email'
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>

          <div>
            <div className='flex items-center justify-between'>
              <label
                htmlFor='password'
                className='block text-sm font-medium leading-6'
              >
                Password:
              </label>
              <span
                className='text-sm font-semibold text-indigo-600 hover:text-indigo-500'
                onClick={() => setShow({ ...show, password: !show.password })}
              >
                <p className='font-semibold text-indigo-600 hover:text-indigo-500'>
                  Show Password
                </p>
              </span>
            </div>
            <input
              name='password'
              required
              type={`${show.password ? 'text' : 'password'}`}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className='mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
            />
          </div>

          <button
            className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-slate-500'
            disabled={email === '' || password === '' || email.length === 0}
          >
            Log in
          </button>

          {error && <div className='text-red-500'>{error.toString()}</div>}
        </form>

        <p className='mt-10text-sm hover:text-slate-500'>
          <Link href={'/auth/forgot-password'}>Forgot Password?</Link>
        </p>

        {verifyEmail && (
          <div className='mt-10 text-center text-sm'>
            Your email is not verified. Please click on the Verify Email link in
            the email registered with or click resend email to receive a new
            email.
            <br />
            <button
              className='mt-2 rounded-md bg-indigo-600 px-3 py-1.5 font-semibold leading-6 text-white hover:text-indigo-500'
              onClick={resendEmail}
            >
              RESEND EMAIL
            </button>
          </div>
        )}
      </section>
      {/* )} */}
      <p className='mt-10 text-center text-sm'>
        Don't have an account?{' '}
        <Link
          className='font-semibold leading-6 text-indigo-600 hover:text-indigo-500'
          href={'/auth/sign-up'}
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
