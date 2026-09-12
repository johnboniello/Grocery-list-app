import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { App as CapacitorApp } from '@capacitor/app'

const HOME_PATHS = new Set(['/', '/this-week'])

/** No-op on web (no hardware back button there) — only does anything inside the Android app. */
export function useAndroidBackButton() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const listenerPromise = CapacitorApp.addListener('backButton', () => {
      if (HOME_PATHS.has(location.pathname) || window.history.length <= 1) {
        CapacitorApp.exitApp()
      } else {
        navigate(-1)
      }
    })
    return () => {
      listenerPromise.then((listener) => listener.remove())
    }
  }, [navigate, location])
}
