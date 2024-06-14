import { ChatSession } from '@/services/local-storage'

export interface ChatSessionDialogProps {
  onSelectSession: (history: ChatSession) => void
}
