import { useChatSessions } from '@/queries/useChatSessions'
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react'
import { useState } from 'react'
import { ChatSessionDialogProps } from './ChatSessionsDialog.type'

export const ChatSessionsDialog = ({
  onSelectSession,
}: ChatSessionDialogProps) => {
  const { data: ChatSession = [] } = useChatSessions()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [selectedSessionName, setSelectedSessionName] = useState<string>()

  return (
    <>
      <Button
        onClick={onOpen}
        variant="solid"
        color="primary"
        size="sm"
        className="fixed left-1.5 top-1"
        type="button"
      >
        Sessions
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Chat sessions
              </ModalHeader>
              <ModalBody>
                {ChatSession.map((p) => {
                  const isSelected = selectedSessionName === p.sessionName
                  return (
                    <Button
                      type="button"
                      aria-label={p.sessionName}
                      fullWidth
                      variant={isSelected ? 'solid' : 'bordered'}
                      color={isSelected ? 'primary' : 'default'}
                      onClick={() => {
                        onSelectSession(p)
                        setSelectedSessionName(p.sessionName)
                        onOpenChange()
                      }}
                    >
                      {p.sessionName}
                    </Button>
                  )
                })}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
