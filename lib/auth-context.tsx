"use client"

import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react'
import Cookies from 'js-cookie'

interface User {
  id: number
  name: string
  email: string
  role: string
  institution?: {
    id: number
    name: string
  }
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing token on app load
    const savedToken = localStorage.getItem('auth_token')
    if (savedToken) {
      setToken(savedToken)
      // Verify token and get user info
      verifyToken(savedToken)
    } else {
      setIsLoading(false)
    }
  }, [])

  // Add event listener for storage changes (for multi-tab sync)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token') {
        if (e.newValue) {
          setToken(e.newValue)
          verifyToken(e.newValue)
        } else {
          setToken(null)
          setUser(null)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const verifyToken = async (authToken: string) => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else if (response.status === 401) {
        // Token invalid, clear it
        localStorage.removeItem('auth_token')
        setToken(null)
        setUser(null)
      } else if (response.status === 500) {
        // Server error, likely database connection issue
        // Clear token to force re-login
        localStorage.removeItem('auth_token')
        setToken(null)
        setUser(null)
      } else {
        // Other errors, keep token but log error
      }
    } catch (error) {
      // Network error or server down, clear token to force re-login
      localStorage.removeItem('auth_token')
      setToken(null)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      if (response.ok) {
        const data = await response.json()
        setToken(data.token)
        setUser(data.user)
        localStorage.setItem('auth_token', data.token)
        Cookies.set('auth_token', data.token) // Set token ke cookies
        return true
      } else {
        const error = await response.json()
        console.error('Login failed:', error.error)
        return false
      }
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('auth_token')
    Cookies.remove('auth_token') // Hapus token dari cookies
  }, [])

  const contextValue = useMemo(() => ({
    user,
    token,
    login,
    logout,
    isLoading,
  }), [user, token, isLoading, login, logout])

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 