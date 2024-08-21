import { Button } from '@nextui-org/button'
import React from 'react'
import { SearchFilterItem } from './SearchFilters.type'
export type SearchFilterProps = {
  filterItems: SearchFilterItem[]
  onFilterChange: (filter: SearchFilterItem[]) => void
}
export const SearchFilters: React.FC<SearchFilterProps> = ({
  onFilterChange,
  filterItems,
}) => {
  const toggleFitler = (filterName: string) => {
    onFilterChange(
      filterItems.map((item) =>
        item.name === filterName ? { ...item, toggled: !item.toggled } : item,
      ),
    )
  }

  return (
    <section className="flex p-4 justify-center items-center space-x-5">
      {filterItems &&
        filterItems.map((filterItem) => (
          <Button
            color="default"
            variant={filterItem.toggled ? 'solid' : 'light'}
            radius="full"
            startContent={filterItem.icon}
            size="lg"
            className="shadow-md text-gray-500"
            key={filterItem.name}
            onClick={() => toggleFitler(filterItem.name)}
          >
            <p>{filterItem.title}</p>
          </Button>
        ))}
    </section>
  )
}
