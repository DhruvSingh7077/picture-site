'use client';
import React from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

// Mimics your logic (username always, fullName conditionally)
const authFormSchema = (formType: 'sign-in' | 'sign-up') =>
  z.object({
    username: z.string().min(2, 'Username must be at least 2 chars').max(30, 'Max 30 chars'),
    email: z.string().email('Invalid email'),
    fullName:
      formType === 'sign-up'
        ? z.string().min(2, 'Full name must be at least 2 chars').max(50, 'Max 50 chars')
        : z.string().optional(),
  });

type AuthFormProps = { type: 'sign-in' | 'sign-up' };

export default function AuthForm({ type }: AuthFormProps) {
  const schema = authFormSchema(type);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: '',
      email: '',
      fullName: '',
    },
  });

  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  async function onSubmit(data: z.infer<typeof schema>) {
    setErrorMessage(null);
    console.log('Form submit:', data);
    // simulate async error
    // setErrorMessage('Simulated API error');
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: 400, margin: 'auto' }}>
      <h1 style={{ fontSize: 28, marginBottom: 24 }}>
        {type === 'sign-in' ? 'Sign In' : 'Sign Up'}
      </h1>
      {type === 'sign-up' && (
        <div style={{ marginBottom: 16 }}>
          <label>
            Full Name
            <br />
            <input
              {...register('fullName')}
              placeholder="Full Name"
              style={{ width: '100%', padding: 8, marginTop: 4 }}
            />
          </label>
          {errors.fullName && (
            <div style={{ color: 'red', marginTop: 4 }}>{errors.fullName.message}</div>
          )}
        </div>
      )}
      <div style={{ marginBottom: 16 }}>
        <label>
          Username
          <br />
          <input
            {...register('username')}
            placeholder="Username"
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </label>
        {errors.username && (
          <div style={{ color: 'red', marginTop: 4 }}>{errors.username.message}</div>
        )}
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>
          Email
          <br />
          <input
            {...register('email')}
            placeholder="Email"
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </label>
        {errors.email && <div style={{ color: 'red', marginTop: 4 }}>{errors.email.message}</div>}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          width: '100%',
          padding: 12,
          background: 'salmon',
          color: '#222',
          fontWeight: 'bold',
          border: 'none',
          borderRadius: 24,
          fontSize: 16,
          marginBottom: 12,
        }}
      >
        {isSubmitting ? 'Processing...' : type === 'sign-in' ? 'Sign In' : 'Sign Up'}
      </button>
      {errorMessage && <div style={{ color: 'red', marginBottom: 8 }}>{errorMessage}</div>}
      <div style={{ textAlign: 'center', color: '#555', marginBottom: 12 }}>
        {type === 'sign-in' ? (
          <>
            Don&apos;t have an account? <a href="/sign-up">Sign Up</a>
          </>
        ) : (
          <>
            Already have an account? <a href="/sign-in">Sign In</a>
          </>
        )}
      </div>
      <div style={{ textAlign: 'center', color: '#AAA' }}>OTP Verification Coming Soon!</div>
    </form>
  );
}
