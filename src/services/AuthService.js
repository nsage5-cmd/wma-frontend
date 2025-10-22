import { API_BASE_URL } from '@/helpers/baseUrl'

class AuthService {
  constructor() {
    this.isAuthenticated = false
    this.user = null
    this.initialized = false
    this.initializationPromise = null
  }

  async initializeAuth() {
    try {
      console.log('Starting auto-login check...')

      const response = await fetch(`${API_BASE_URL}/auth-status.php`, {
        credentials: 'include',
        method: 'GET'
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const responseText = await response.text()
      console.log('Raw auth-status response:', responseText)

      let data
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError)
        console.error('Response was:', responseText)
        throw new Error('Invalid JSON response from server')
      }

      console.log('Parsed auth data:', data)

      if (data.authenticated) {
        this.isAuthenticated = true
        this.user = data.user
        console.log('Auto-login successful:', data.user)
      } else {
        this.isAuthenticated = false
        this.user = null
        console.log('Auto-login failed: User not authenticated')
      }

      this.initialized = true
    } catch (error) {
      console.error('Auto-login check failed:', error)
      this.isAuthenticated = false
      this.user = null
      this.initialized = true
      throw error
    }
  }

  async login(credentials) {
    try {
      console.log('Attempting login with:', credentials.email)

      const response = await fetch(`${API_BASE_URL}/auth.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          user: {
            _value: credentials
          }
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('Login response:', data)

      if (data.status === 'success') {
        this.isAuthenticated = true
        this.user = data.user
        console.log('Login successful:', this.user)
        return { success: true, user: this.user }
      } else {
        this.isAuthenticated = false
        this.user = null
        const errorMessage = data.message || data.error || 'Login failed'
        console.log('Login failed:', errorMessage)
        return { success: false, error: errorMessage }
      }
    } catch (error) {
      console.error('Login network error:', error)
      this.isAuthenticated = false
      this.user = null
      return { success: false, error: 'Network error: ' + error.message }
    }
  }

  async register(credentials) {
    try {
      console.log('Attempting login with:', credentials.email)

      const response = await fetch(`${API_BASE_URL}/register.php`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({
          user: {
            _value: credentials
          }
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('Login response:', data)

      if (data.status === 'success') {
        this.isAuthenticated = false
        this.user = data.user
        console.log('Login successful:', this.user)
        return { success: true, user: this.user }
      } else {
        this.isAuthenticated = false
        this.user = null
        const errorMessage = data.message || data.error || 'Login failed'
        console.log('Login failed:', errorMessage)
        return { success: false, error: errorMessage }
      }
    } catch (error) {
      console.error('Login network error:', error)
      this.isAuthenticated = false
      this.user = null
      return { success: false, error: 'Network error: ' + error.message }
    }
  }

  async logout() {
    try {
      console.log('Attempting logout...')

      const response = await fetch(`${API_BASE_URL}/logout.php`, {
        method: 'POST',
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('Logout response:', data)
      this.isAuthenticated = false
      this.user = null
      console.log('Local auth state cleared')
    } catch (error) {
      console.error('Logout request failed:', error)
    }
  }

  getAuthState() {
    return {
      isAuthenticated: this.isAuthenticated,
      user: this.user
    }
  }

  isInitialized() {
    return this.initialized
  }

  async waitForInit() {
    if (!this.initialized && !this.initializationPromise) {
      this.initializationPromise = this.initializeAuth()
    }

    if (this.initializationPromise) {
      await this.initializationPromise
    }

    return this.getAuthState()
  }
}

const authService = new AuthService()

export default authService
