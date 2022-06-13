import {
  Anchor,
  Center,
  Container,
  Loader,
  Space,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import { Search } from 'tabler-icons-react'

import { SearchResultTabs } from '../components/SearchResultTabs'
import { SearchSummary } from '../components/SearchSummary'
import { useSearch } from '../lib/useSearch'
import packageJson from '../package.json'

import type { GetServerSideProps, NextPage } from 'next'

const Home: NextPage<{ title: string }> = ({ title }) => {
  const router = useRouter()
  const initialQuery = router.query.q as string | undefined
  const [query, setQuery] = React.useState<string | undefined>(initialQuery)
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
        <title>{title}</title>
      </Head>

      <Container>
        <Center>
          <Anchor
            href="https://github.com/SlashNephy/tuse"
            underline={false}
            target="_blank"
            style={{ color: 'black' }}
          >
            <Title>{title}</Title>
          </Anchor>
        </Center>

        <TextInput
          placeholder={initialQuery}
          icon={<Search />}
          rightSection={isLoading && <Loader size="xs" />}
          onKeyDown={handleKeyDown}
        />

        {query && <SearchResult query={query} setIsLoading={setIsLoading} />}
      </Container>
    </>
  )
}

// サーバー側で環境変数を読み取る
// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      title: process.env.TUSE_APP_NAME ?? packageJson.name,
    },
  }
}

const SearchResult: React.FC<{
  query: string
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}> = ({ query, setIsLoading }) => {
  const search = useSearch(query)

  React.useEffect(() => {
    setIsLoading(search.isLoading)
  }, [search.isLoading, setIsLoading])

  if (!search.response) {
    return null
  }

  if (!search.response.success) {
    return (
      <>
        <Text>取得に失敗しました</Text>
        <Text>{search.response.error}</Text>
      </>
    )
  }

  return (
    <>
      <SearchSummary search={search} />
      <Space h="xl" />
      <SearchResultTabs search={search} />
    </>
  )
}

export default Home
