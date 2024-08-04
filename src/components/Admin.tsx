import { FunctionalComponent } from 'preact';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Breadcrumb from './Breadcrumb';
import { useState } from 'preact/hooks';

export const Admin: FunctionalComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();



  const handleLogin = async (event: Event) => {
    event.preventDefault();

    if (!email || !password) {
      addToast('Email and password are required.', 'error');
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
    } catch (error) {
      console.error('Login failed', error);
      addToast('Login failed. Please check your credentials and try again.', 'error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <Breadcrumb path={`/admin`} />
    <main class="max-w-md mx-auto p-8 md:p-12 my-10 rounded-lg shadow-xs ">
      <h1 class="font-semibold text-3xl pb-5 text-center md:text-left animate-zoom-in">Log into Admin</h1>
      <form class="opacity-0 animate-fade-in-delay" onSubmit={handleLogin}>
        <div class="mb-4">
          <label class="block text-md font-light mb-2" for="email">Email</label>
          <input
            class="w-full bg-drabya-gray border-gray-500 appearance-none border p-4 font-light leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            name="email"
            id="email"
            placeholder="Email"
            value={email}
            onInput={(e) => setEmail(e.currentTarget.value)}
          />
        </div>
        <div class="mb-4">
          <label class="block text-md font-light mb-2" for="password">Password</label>
          <input
            class="w-full bg-drabya-gray border-gray-500 appearance-none border p-4 font-light leading-tight focus:outline-none focus:shadow-outline"
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            value={password}
            onInput={(e) => setPassword(e.currentTarget.value)}
          />
        </div>

        <div class="flex items-center justify-end mb-5">
          <button
            type="submit"
            class="relative bg-red-600 flex-initial justify-items-start hover:bg-red-700 text-white font-semibold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
            disabled={isLoading}
          >
            Log In
            {isLoading && (
              <div class="absolute inset-0 flex items-center justify-center">
                <svg
                  class="spinner h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
              </div>
            )}
          </button>
        </div>
      </form>
    </main>
    <p class="text-center bottom-0 text-md font-light mt-8 text-stone-200 select-none animate-fade-in-delay">Powered by Imperfect and Company LLC</p>

    </>
  );
};