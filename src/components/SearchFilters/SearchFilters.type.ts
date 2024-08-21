import { FileType } from '@/types/data.types'
import { ReactElement } from 'react'

export type SearchFilterItem = {
  name: FileType
  icon?: ReactElement
  title: string
  toggled: boolean
}
