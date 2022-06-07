import {
  Anchor,
  Badge,
  Center,
  Container,
  Group,
  Loader,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import Head from 'next/head'
import React from 'react'
import { useQuery } from 'react-query'
import { Search } from 'tabler-icons-react'

import { Timer } from '../lib/Timer'
import packageJson from '../package.json'

import type { SearchResponse } from './api/search'
import type { NextPage } from 'next'

const Home: NextPage = () => {
  const [query, setQuery] = React.useState<string>()
  const [isLoading, setIsLoading] = React.useState(false)

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      setQuery(event.currentTarget.value)
    }
  }

  return (
    <>
      <Head>
        <title>{packageJson.name}</title>
      </Head>

      <Container>
        <Center>
          <Title>{packageJson.name}</Title>
        </Center>

        <TextInput
          icon={<Search />}
          rightSection={isLoading && <Loader size="xs" />}
          onKeyDown={handleKeyDown}
        />

        {query && <SearchResult query={query} setIsLoading={setIsLoading} />}
      </Container>
    </>
  )
}

const SearchResult: React.FC<{
  query: string
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}> = ({ query, setIsLoading }) => {
  const [elapsed, setElapsed] = React.useState<number>()
  const { data, isLoading } = useQuery<SearchResponse>(
    ['search', query],
    async () => {
      const timer = new Timer()
      const results = await fetch(
        `/api/search?q=${encodeURIComponent(query)}`
      ).then(async (response) => await response.json())
      setElapsed(timer.stop())
      return results
    }
  )

  React.useEffect(() => {
    setIsLoading(isLoading)
  }, [isLoading, setIsLoading])

  if (!data) {
    return null
  }

  if (!data.success) {
    return (
      <>
        <Text>取得に失敗しました</Text>
        <Text>{data.error}</Text>
      </>
    )
  }

  return (
    <>
      <Text>
        「{query}」の検索結果 ({data.results.length} 件, {elapsed} ms)
      </Text>

      {data.results.map((result, index) => (
        <Group key={index}>
          <Badge>{result.type}</Badge>
          <Anchor href={result.url}>
            <Title>{result.title}</Title>
          </Anchor>
          <Text>{result.description}</Text>
          <Text>{new Date(result.createdAt).toLocaleString()}</Text>
        </Group>
      ))}
    </>
  )
}

export default Home
