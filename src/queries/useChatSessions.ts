import { LOCAL_STORAGE_CHAT_SESSION_KEY } from '@/constants'
import { getChatSessions } from '@/services/local-storage'
import { useQuery } from '@tanstack/react-query'

export const useChatSessions = () => {
  return useQuery({
    queryKey: [LOCAL_STORAGE_CHAT_SESSION_KEY],
    queryFn: getChatSessions,
  })
}
