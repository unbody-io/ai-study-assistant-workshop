import { ChatMessages } from '@/components/ChatMessages'
import { ChatSessionsDialog } from '@/components/ChatSessionsDialog'
import { MessageBar } from '@/components/MessageBar'
import { Search } from '@/components/Search'
import { ChatLayout } from '@/layouts/ChatLayout/Chat.layout'
import { useSaveChatSessions } from '@/queries/useSaveChatSession'
import { useSearch } from '@/queries/useSearch'
import { ApiChatMessage, chatApi } from '@/services/api'
import { ChatSession } from '@/services/local-storage'
import { FileType } from '@/types/data.types'
import { populateDirs } from '@/utils/populateDirs.util'
import React, { useEffect, useMemo, useState, useTransition } from 'react'

export type HomePageProps = React.HTMLProps<HTMLDivElement>

export const HomePage: React.FC<HomePageProps> = ({ className, ...props }) => {
  const [query, setQuery] = useState('')
  const [prompt, setPrompt] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [messages, setMessages] = useState<ApiChatMessage[]>([])
  const [generating, setGenerating] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<FileType[]>([])
  const [_, changeFilterListTransition] = useTransition()
  const saveChatSessions = useSaveChatSessions()

  const search = useSearch(
    { query },
    {
      cacheTime: 0,
      enabled: false,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    },
  )

  const fileList = useMemo(() => {
    const data = search.data?.files || []
    const filteredFileList =
      selectedFilters.length === 0
        ? data
        : data.filter((file) => selectedFilters.includes(file.type))
    return populateDirs(filteredFileList)
  }, [search.data, selectedFilters])

  const onChangeFilters = (newList: FileType[]) => {
    changeFilterListTransition(() => {
      setSelectedFilters(newList)
    })
  }

  const onSearch = async () => {
    search.refetch()
  }

  const onSelectSession = (newSession: ChatSession) => {
    setMessages(newSession.history)
    setSelectedFiles(newSession.files)
  }

  const onPrompt = async (prompt: string) => {
    setGenerating(true)
    setMessages((value) => [
      ...value,
      {
        role: 'user',
        message: prompt,
      },
    ])

    const { message } = await chatApi({
      prompt,
      files: fileList.filter((f) => selectedFiles.includes(f.id)),
      history: messages,
    })

    setGenerating(false)
    setMessages((value) => [...value, message])
    setPrompt('')
  }

  useEffect(() => {
    setSelectedFiles([])
  }, [search.data])

  useEffect(() => {
    onSearch()
  }, [])

  useEffect(() => {
    if (messages.length > 0)
      saveChatSessions({
        sessionName: messages[0].message,
        history: messages,
        files: selectedFiles,
      })
  }, [messages])

  return (
    <ChatLayout
      messageBar={
        <MessageBar
          hide={selectedFiles.length === 0}
          prompt={prompt}
          onPromptChange={setPrompt}
          onSubmit={(prompt) => onPrompt(prompt)}
          loading={generating}
          disabled={generating}
        />
      }
    >
      <ChatSessionsDialog onSelectSession={onSelectSession} />
      <Search
        compact={messages.length > 0}
        searching={search.isFetching}
        query={query}
        onQueryChange={(v) => setQuery(v)}
        onSearch={onSearch}
        results={fileList}
        onSelect={(selected) => setSelectedFiles(selected)}
        selectedFiles={selectedFiles}
        onToggleFilters={onChangeFilters}
        selectedFilters={selectedFilters}
      />

      <ChatMessages
        className="py-[20px]"
        data={messages.map((msg) => ({
          role: msg.role,
          message: msg.message,
        }))}
      />
    </ChatLayout>
  )
}
