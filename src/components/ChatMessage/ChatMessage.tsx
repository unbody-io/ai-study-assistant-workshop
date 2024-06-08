import { Avatar } from '@nextui-org/react'
import clsx from 'clsx'
import React, { useRef } from 'react'
import { useAnimatedText } from '../AnimatedText'

export type ChatMessageProps = Omit<React.HTMLProps<HTMLDivElement>, 'role'> & {
  message: string
  role: 'user' | 'assistant'
  disableAnimation?: boolean
  onEditPrompt: React.Dispatch<React.SetStateAction<string>>
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  role,
  disableAnimation = false,
  onEditPrompt,
  ...props
}) => {
  const content = useAnimatedText(message, {
    maxTime: 1000,
    disabled: role === 'user' || disableAnimation,
  })

  const userInputRef = useRef<HTMLInputElement>(null)

  const handleEditPrompt = () => {
    onEditPrompt(userInputRef.current?.textContent || '')
  }

  return (
    <div {...props} className={clsx('', props.className)}>
      <div className="flex flex-row gap-4 items-start">
        <Avatar
          className="flex-shrink-0"
          showFallback
          color={role === 'assistant' ? 'primary' : 'default'}
          name={role === 'assistant' ? 'A' : ''}
          classNames={{
            name: 'text-[16px]',
          }}
        />
        <div
          className={`flex-grow border border-gray-200 rounded-lg p-4 text-md bg-white shadow-sm mt-[-4px] flex justify-between items-start ${role === 'assistant' ? 'flex-col' : ''}`}
        >
          <div
            ref={role === 'user' ? userInputRef : null}
            className="whitespace-pre-wrap break-words"
            dangerouslySetInnerHTML={{ __html: content }}
          />
          {role === 'user' && (
            <div
              className="bg-gray-200 ml-2 px-4 py-1 rounded-full cursor-pointer"
              onClick={handleEditPrompt}
            >
              Edit
            </div>
          )}
          {role === 'assistant' && (
            <div className="bg-gray-100 py-2 px-4 mt-6 rounded-lg">
              %ANSWER_INFO%
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
