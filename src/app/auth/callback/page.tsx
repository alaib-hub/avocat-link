'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()
  const supabase = createClient()
  const [error, setError] = useState('')

  useEffect(() => {
    const handleCallback = async () => {
      const hashParams = new URLSearchParams(window.location.hash.slice(1))
      const accessToken = hashParams.get('access_token')
      const refreshToken = hashParams.get('refresh_token')
      const type = hashParams.get('type')

      if (!accessToken) {
        setError('No access token found. Please try logging in again.')
        setTimeout(() => router.push('/auth/login'), 3000)
        return
      }

      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken || '',
      })

      if (sessionError) {
        setError(sessionError.message)
        setTimeout(() => router.push('/auth/login'), 3000)
        return
      }

      if (type === 'recovery') {
        router.push('/auth/login')
      } else {
        router.push('/dashboard')
      }
    }

    handleCallback()
  }, [router, supabase.auth])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a0a0a',
      color: '#fff',
      flexDirection: 'column',
      gap: '16px',
    }}>
      {error ? (
        <>
          <p style={{ fontSize: '18px', color: '#ef4444' }}>{error}</p>
          <p style={{ fontSize: '14px', color: '#888' }}>Redirecting to login...</p>
        </>
      ) : (
        <>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #333',
            borderTopColor: '#c9a961',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          <p style={{ fontSize: '16px' }}>Confirming your email...</p>
        </>
      )}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
