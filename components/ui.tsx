import { BrandDiscord, BrandGithub, Notes } from 'tabler-icons-react'

import type { SearchType } from '../lib/search/models'

export const getSearchTypeLabel = (type: SearchType) => {
  switch (type) {
    case 'scrapbox.pages':
      return 'Scrapbox'
    case 'discord.members':
      return 'Discord メンバー'
    case 'discord.messages':
      return 'Discord メッセージ'
    case 'github.commits':
      return 'GitHub コミット'
  }
}

export const getSearchTypeIcon = (type: SearchType) => {
  switch (type) {
    case 'scrapbox.pages':
      return <Notes />
    case 'discord.members':
    case 'discord.messages':
      return <BrandDiscord />
    case 'github.commits':
      return <BrandGithub />
  }
}
