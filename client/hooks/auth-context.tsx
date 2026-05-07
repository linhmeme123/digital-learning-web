'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { User } from '@/lib/types'
import { authApi } from '@/lib/api'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (payload: { name: string; email: string; password: string; role?: 'STUDENT' | 'TEACHER' }) => Promise<boolean>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  isLoading: boolean
  isAdmin: boolean
  isTeacher: boolean
  isStudent: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)
const USER_STORAGE_KEY = 'user'
const TOKEN_STORAGE_KEY = 'access_token'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const hydrateUser = async () => {
      const savedUser = localStorage.getItem(USER_STORAGE_KEY)
      const savedToken = localStorage.getItem(TOKEN_STORAGE_KEY)

      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }

      try {
        const response = await authApi.me(savedToken)
        setUser(response.data.user)
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.data.user))
      } catch {
        setUser(null)
        localStorage.removeItem(USER_STORAGE_KEY)
        localStorage.removeItem(TOKEN_STORAGE_KEY)
      } finally {
        setIsLoading(false)
      }
    }

    hydrateUser()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    const response = await authApi.login({ email, password })
    const loggedInUser = response.data.user

    setUser(loggedInUser)
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedInUser))
    localStorage.setItem(TOKEN_STORAGE_KEY, response.data.token)
    return true
  }

  const signup = async (payload: { name: string; email: string; password: string; role?: 'STUDENT' | 'TEACHER' }): Promise<boolean> => {
    const response = await authApi.signup(payload)
    const signedUpUser = response.data.user

    setUser(signedUpUser)
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(signedUpUser))
    localStorage.setItem(TOKEN_STORAGE_KEY, response.data.token)
    return true
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } finally {
      setUser(null)
      localStorage.removeItem(USER_STORAGE_KEY)
      localStorage.removeItem(TOKEN_STORAGE_KEY)
    }
  }

  const refreshUser = async () => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY)
    const response = await authApi.me(token)
    setUser(response.data.user)
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.data.user))
  }

  const isAdmin = user?.role === 'ADMIN'
  const isTeacher = user?.role === 'TEACHER'
  const isStudent = user?.role === 'STUDENT'

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, refreshUser, isLoading, isAdmin, isTeacher, isStudent }}>
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
