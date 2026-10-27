import { create } from 'zustand'

import type { Game } from '@/content/games'
import { errorChime } from '@/lib/power'

export type Message = { title: string; text: string[]; retry?: () => void }

export const useDialogs = create<{ message: Message | null }>()(() => ({ message: null }))

export function showMessage(message: Message) {
  errorChime()
  useDialogs.setState({ message })
}

export const dismissMessage = () => useDialogs.setState({ message: null })

export function launchGame(game: Game) {
  showMessage({
    title: game.title,
    text: ['There is no disc in drive D:.', `Please insert the ${game.title} CD-ROM and click Retry.`],
    retry: () => launchGame(game),
  })
}
