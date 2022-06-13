import { Text } from '@mantine/core'
import React from 'react'

import type { SearchResultProps } from '../lib/useSearch'

export const SearchSummary: React.FC<{ search: SearchResultProps }> = ({
  search: { count, query, seconds },
}) => {
  return (
    <Text>
      「{query}」の検索結果 ({count} 件, {seconds} 秒)
    </Text>
  )
}
