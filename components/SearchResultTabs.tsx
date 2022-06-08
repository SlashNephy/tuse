import {
  Anchor,
  Avatar,
  Divider,
  Group,
  Space,
  Tabs,
  Text,
  Title,
} from '@mantine/core'
import React from 'react'

import { getSearchTypeIcon, getSearchTypeLabel } from './ui'

import type { SearchType } from '../lib/search/models'
import type { SearchResultProps } from './props'

export const SearchResultTabs: React.FC<{ search: SearchResultProps }> = ({
  search,
}) => {
  if (!search.response?.success) {
    return null
  }

  return (
    <Tabs active={1}>
      <Space h="xl" />

      {Object.entries(search.response.results)
        .filter(([_, results]) => results.length > 0)
        .map(([type, results]) => (
          <Tabs.Tab
            key={type}
            label={getSearchTypeLabel(type as SearchType)}
            icon={getSearchTypeIcon(type as SearchType)}
          >
            {results.map((result, index) => (
              <>
                <Group key={`${type}-${index}`}>
                  {result.author?.imageUrl && (
                    <Avatar
                      src={result.author.imageUrl}
                      alt={result.author.name}
                    />
                  )}
                  <Title
                    order={3}
                    style={{
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {result.title}
                  </Title>
                </Group>

                <Anchor href={result.url} target="_blank">
                  <Text
                    style={{
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                    }}
                  >
                    {result.url}
                  </Text>
                </Anchor>

                <Group style={{ gap: 8 }}>
                  {result.timestamp && (
                    <>
                      <Text inline color="gray">
                        {`${new Date(
                          result.timestamp?.createdAt
                        ).toLocaleDateString()}`}
                      </Text>
                      <Text inline>-</Text>
                    </>
                  )}
                  <Text inline>{result.description}</Text>
                </Group>

                <Divider variant="dashed" mb={15} mt={15} />
              </>
            ))}
          </Tabs.Tab>
        ))}
    </Tabs>
  )
}
