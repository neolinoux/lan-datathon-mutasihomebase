"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from '@/lib/auth-context'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login, user, token, isLoading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && user && token) {
      router.replace('/')
    }
  }, [user, token, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const success = await login(email, password)
      if (success) {
        router.push('/')
      } else {
        setError('Email atau password salah')
      }
    } catch (error) {
      setError('Terjadi kesalahan saat login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 flex-col gap-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Masuk ke sistem AI Compliance Assistant
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@lan-datathon.go.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="admin123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </form>
          <Card className="w-full max-w-md mt-4">
            <CardContent>
              <div className=" text-sm text-gray-500 text-left">
                <strong>Contoh username dan password</strong>
              </div>
              <div className=" text-sm text-gray-500 mt-4 text-left">
                <p>Username: admin@lan-datathon.go.id</p>
                <p>Username: user.bpsprovinsipapuabarat@example.com</p>
                <p>Password: password123</p>
              </div>
              <div className=" text-sm text-gray-500 mt-4 text-left">
                <p >Contoh dokumen: <a className="text-blue-500 underline italic" href="https://drive.google.com/drive/folders/1bHrvxu1kaekYhNsQmN9lvd17fEnoK39v?usp=sharing" target="_blank" rel="noopener noreferrer">https://drive.google.com/drive/folders/1bHrvxu1kaekYhNsQmN9lvd17fEnoK39v?usp=sharing</a></p>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
      <div className="text-center text-sm text-gray-500">
        <p>Copyright © 2025 Lan Datathon</p>
      </div>
    </div>
  )
} 