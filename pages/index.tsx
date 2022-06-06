import { Center, Container, Title } from '@mantine/core'
import Head from 'next/head'

import packageJson from '../package.json'

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
      </Container>
    </>
  )
}

export default Home
