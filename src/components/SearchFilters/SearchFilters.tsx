import { Button } from '@nextui-org/react'
import { SearchFilterItem, SearchFilterProps } from './SearchFilters.type'

export const FILTER_LIST: SearchFilterItem[] = [
  { title: 'Docs', icon: '', value: 'document' },
  { title: 'Pdf', icon: '', value: 'pdf' },
  { title: 'Images', icon: '', value: 'image' },
  { title: 'Mp3/Audios', icon: '', value: 'audio' },
  { title: 'Mp4/Videos', icon: '', value: 'video' },
]

export const SearchFilters = (props: SearchFilterProps) => {
  const { className, selectedFilters, onToggleFilter } = props
  const isSelected = (val: SearchFilterItem) => {
    return selectedFilters.find((s) => s === val.value) !== undefined
  }
  const toggle = (newVal: SearchFilterItem) => {
    if (isSelected(newVal)) {
      return onToggleFilter(selectedFilters.filter((f) => f !== newVal.value))
    }
    return onToggleFilter([...selectedFilters, newVal.value])
  }
  return (
    <section className={className}>
      <div className="flex justify-center items-center space-x-2.5">
        {FILTER_LIST.map((filter) => {
          const _isSelected = isSelected(filter)
          return (
            <Button
              onClick={() => toggle(filter)}
              key={filter.value}
              type="button"
              variant={_isSelected ? 'solid' : 'bordered'}
              color={_isSelected ? 'primary' : 'default'}
              aria-label={filter.title}
            >
              <p>{filter.title}</p>
            </Button>
          )
        })}
      </div>
    </section>
  )
}
