import { LOCAL_STORAGE_CHAT_SESSION_KEY } from '@/constants'
import { saveChatSessions } from '@/services/local-storage'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useSaveChatSessions = () => {
  const queryClient = useQueryClient()
  const { mutate } = useMutation({
    mutationFn: saveChatSessions,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [LOCAL_STORAGE_CHAT_SESSION_KEY],
      })
    },
  })

  return mutate
}
