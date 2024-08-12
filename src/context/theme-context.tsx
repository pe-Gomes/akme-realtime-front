import {
  createContext,
  useState,
  type Dispatch,
  type SetStateAction,
  type ReactNode,
} from 'react'
import { cn } from '../lib/utils'

type ThemeOptions = 'light' | 'dark'

interface UseThemeContext {
  theme: ThemeOptions
  setTheme: Dispatch<SetStateAction<ThemeOptions>>
  defaultTheme?: ThemeOptions
}

export const ThemeContext = createContext<UseThemeContext | undefined>(
  undefined
)

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
}: {
  children: ReactNode
  defaultTheme?: ThemeOptions
}) {
  const [theme, setTheme] = useState<ThemeOptions>(defaultTheme)
  return (
    <ThemeContext.Provider value={{ theme, setTheme, defaultTheme }}>
      <div
        className={cn(
          'antialiased min-h-screen',
          theme === 'light'
            ? 'bg-zinc-50 text-zinc-950'
            : 'bg-zinc-950 text-zinc-50'
        )}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  )
}
