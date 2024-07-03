// src/components/Admin.tsx

import { FunctionalComponent } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { useAuth } from '../contexts/AuthContext';

export const Admin: FunctionalComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth(); // Use useAuth instead of useMockAuth

  const handleLogin = async (event: Event) => {
    event.preventDefault();
    try {
      await login(email, password); // login is now an async function
    } catch (error) {
      console.error('Login failed', error);
      // Handle login failure, e.g., show an error message to the user
    }
  };

  return (
    <main class="max-w-md mx-auto p-8 md:p-12 my-10 rounded-lg shadow-xs">
      <h1 class="font-semibold text-3xl pb-5 text-center md:text-left">Log into Admin</h1>
      <form onSubmit={handleLogin}>
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

        <div class="flex items-center justify-between mb-5">
          <button
            type="submit"
            class="bg-indigo-600 flex-initial justify-items-start hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
          >
            Log In
          </button>
        </div>
        <p class="text-center text-md font-light">Powered by Imperfect and Company LLC</p>
      </form>
    </main>
  );
};
