import { Center, Container, Title } from '@mantine/core'
import Head from 'next/head'
import React from 'react'
import { useQuery } from 'react-query'

import packageJson from '../package.json'

import type { SearchResponse } from './api/search'
import type { NextPage } from 'next'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>{packageJson.name}</title>
      </Head>

      <Container>
        <Center>
          <Title>{packageJson.name}</Title>
        </Center>

        <SearchResult query="react" />
      </Container>
    </>
  )
}

const SearchResult: React.FC<{ query: string }> = ({ query }) => {
  const { data } = useQuery<SearchResponse>(
    ['search', query],
    async () =>
      await fetch(`/api/search?q=${encodeURIComponent(query)}`).then(
        async (response) => await response.json()
      )
  )

  if (!data || !data.success) {
    return null
  }

  return <></>
}

export default Home
