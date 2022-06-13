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
import '@slashnephy/typescript-extension'
import React from 'react'

import type { SearchResultProps } from './props'

export const SearchResultTabs: React.FC<{ search: SearchResultProps }> = ({
  search,
}) => {
  const [activeTab, setActiveTab] = React.useState(1)

  if (!search.response?.success) {
    return null
  }

  return (
    <Tabs active={activeTab} onTabChange={(tabIndex) => setActiveTab(tabIndex)}>
      <Space h="xl" />

      {Object.entries(search.response.results)
        .filter(([_, results]) => results.length > 0)
        .map(([type, results]) => (
          <Tabs.Tab
            key={type}
            label={results.first().info.name}
            icon={results.first().info.renderIcon?.()}
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
