import {
  Anchor,
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
  const { data, isLoading } = useQuery<SearchResponse>(
    ['search', query],
    async () =>
      await fetch(`/api/search?q=${encodeURIComponent(query)}`).then(
        async (response) => await response.json()
      )
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
      {data.results.map((result, index) => (
        <Group key={index}>
          <Anchor href={result.url}>
            <Title>{result.title}</Title>
          </Anchor>
          <Text>{result.description}</Text>
          <Text>{new Date(result.updatedAt).toLocaleString()}</Text>
        </Group>
      ))}
    </>
  )
}

export default Home
