import { FileData, FileType } from '@/types/data.types'
import {
  Accordion,
  AccordionItem,
  Checkbox,
  CheckboxGroup,
  Divider,
} from '@nextui-org/react'
import clsx from 'clsx'
import React, { useMemo, useState } from 'react'
import { ContextPanel } from '../ContextPanel/ContextPanel'
import { FileCard } from '../FileCard'
import { FolderCard } from '../FolderCard'
import {
  AudioFileIcon,
  DraftIcon,
  FolderIcon,
  ImageIcon,
  PdfFileIcon,
  VideoFileIcon,
} from '../icons'

const iconMap = {
  folder: FolderIcon,
  pdf: PdfFileIcon,
  document: DraftIcon,
  video: VideoFileIcon,
  audio: AudioFileIcon,
  image: ImageIcon,
}

// What file categories to expect
const fileCategories: FileType[] = [
  'folder',
  'image',
  'video',
  'audio',
  'document',
  'pdf',
]

export type SearchResultProps = Omit<
  React.HTMLProps<HTMLDivElement>,
  'selected' | 'onSelect' | 'title'
> & {
  title?: React.ReactNode
  description?: React.ReactNode

  files?: FileData[]
  selected?: string[]
  onSelect?: (selected: string[]) => void

  hideList?: boolean
  compactOverview?: boolean
}

export const SearchResult: React.FC<SearchResultProps> = ({
  title,
  description,
  selected = [] as string[],
  onSelect,
  files = [],
  className,
  hideList = false,
  compactOverview = false,
  ...props
}) => {
  const map: Record<string, FileData> = useMemo(
    () => Object.fromEntries(files.map((file) => [file.id, file])),
    [files, selected],
  )

  // derived state to indicate which file categories to show based on user selection
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => [
    ...fileCategories,
  ])

  const [directoriesGroup, filesGroup] = useMemo(
    () => [
      files.filter((f) => f.type === 'folder'),
      files.filter((f) => f.type !== 'folder'),
    ],
    [files, map],
  )

  const onSelectionChange = (newValue: string[]) => {
    if (onSelect) onSelect(newValue)
  }

  const isItemSelected = (id: string) => {
    const { type, children = [] } = map[id]
    const ids = type === 'folder' ? children.map((child) => child.id) : [id]

    return ids.every((id) => selected.includes(id))
  }

  const onCheckboxChange = (id: string) => {
    const item = map[id]
    const isSelected = isItemSelected(id)

    if (item.type === 'folder') {
      const children = item.children || []

      const newSelected = isSelected
        ? selected.filter(
            (item) => !children.map((child) => child.id).includes(item),
          )
        : Array.from(
            new Set([...selected, ...children.map((child) => child.id)]),
          )

      onSelectionChange(newSelected)
    } else {
      const newSelected = selected.includes(id)
        ? selected.filter((item) => item !== id)
        : [...selected, id]

      onSelectionChange(newSelected)
    }
  }

  return (
    <div className={clsx('relative', className)} {...props}>
      <div>
        {title && <h2 className="text-lg font-semibold">{title}</h2>}
        {description && <p className="text-sm text-gray-500">{description}</p>}
        <div className="py-2 pb-8">
          <ContextPanel
            map={map}
            selected={selected}
            compact={compactOverview}
            className={clsx(
              'duration-300',
              'absolute right-0 w-full transition',
              !compactOverview && 'translate-y-0',
              compactOverview && 'translate-y-[-50px]',
            )}
          />
        </div>
      </div>
      <div className="mt-8">
        {/* Checkbox group to select which file types to show */}
        {!hideList && (
          <div className={clsx('bg-gray-100 p-2 rounded-t-lg')}>
            <CheckboxGroup
              label="Select File types to show"
              defaultValue={[...selectedCategories]}
              onValueChange={setSelectedCategories}
            >
              <div className="flex w-full flex-wrap gap-12">
                {fileCategories.map((category) => (
                  <Checkbox value={category}>{category}</Checkbox>
                ))}
              </div>
            </CheckboxGroup>
          </div>
        )}
        <Divider />

        <Accordion
          isCompact
          hideIndicator
          keepContentMounted
          selectedKeys={!hideList ? ['root-tree'] : []}
        >
          <AccordionItem
            title={null}
            key="root-tree"
            HeadingComponent={() => <></>}
          >
            <div className={clsx('max-h-[500px] overflow-y-auto')}>
              {selectedCategories.includes('folder') &&
                directoriesGroup.map((item, index) => (
                  <div key={index}>
                    <div className={clsx('flex flex-row items-center')}>
                      <FolderCard
                        name={item.name}
                        label={[
                          'Folder',
                          `${(item.children || []).length} items`,
                        ]}
                        selectedKeys={[]}
                        itemProps={{
                          onPress: () => onCheckboxChange(item.id),
                          startContent: (
                            <>
                              <Checkbox
                                className="pe-[16px]"
                                isSelected={isItemSelected(item.id)}
                                onValueChange={() => onCheckboxChange(item.id)}
                              />
                            </>
                          ),
                          hideIndicator: true,
                        }}
                      />
                    </div>
                  </div>
                ))}

              <Divider className="my-2" />

              {filesGroup.map((item) => {
                if (!selectedCategories.includes(item.type)) return null
                const IconComponent = iconMap[item.type]

                return (
                  <div key={item.name}>
                    <div className={clsx('flex flex-row items-center')}>
                      <FileCard
                        name={item.name}
                        tags={item.tags}
                        excerpt={item.excerpt}
                        itemProps={{
                          onPress: () => onCheckboxChange(item.id),
                          startContent: (
                            <>
                              <Checkbox
                                className="pe-[16px]"
                                isSelected={isItemSelected(item.id)}
                                onValueChange={() => onCheckboxChange(item.id)}
                              />
                            </>
                          ),
                        }}
                        icon={<IconComponent />}
                        extension={item.extension || ''}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
