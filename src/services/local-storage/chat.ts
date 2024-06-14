import { LOCAL_STORAGE_CHAT_SESSION_KEY } from '@/constants'
import { ApiChatMessage } from '../api'

export interface ChatSession {
  sessionName: string
  history: ApiChatMessage[]
  files: string[]
}

export const getChatSessions = () => {
  return new Promise<ChatSession[]>((resolve) => {
    const strList = localStorage.getItem(LOCAL_STORAGE_CHAT_SESSION_KEY)
    return resolve(strList ? JSON.parse(strList) : [])
  })
}

export const saveChatSessions = (params: ChatSession) => {
  return new Promise<ChatSession[]>((resolve) => {
    const strList = localStorage.getItem(LOCAL_STORAGE_CHAT_SESSION_KEY)
    let prevList = [] as ChatSession[]
    if (strList) {
      prevList = JSON.parse(strList) as ChatSession[]
    }

    //? update the session if exist
    if (prevList.find((f) => f.sessionName === params.sessionName)) {
      const newList = prevList.map((p) => {
        if (p.sessionName === params.sessionName) return params
        return p
      })
      localStorage.setItem(
        LOCAL_STORAGE_CHAT_SESSION_KEY,
        JSON.stringify(newList),
      )
      return resolve(newList)
    }

    //?add new session if not exist in local storage
    const newList = [...prevList, params]
    localStorage.setItem(
      LOCAL_STORAGE_CHAT_SESSION_KEY,
      JSON.stringify(newList),
    )

    return resolve(newList)
  })
}
