import { FileType } from '@/types/data.types'

export interface SearchFilterItem {
  title: string
  icon: string
  value: FileType
}

export interface SearchFilterProps {
  className?: string
  selectedFilters: FileType[]
  onToggleFilter: (f: FileType[]) => void
}
