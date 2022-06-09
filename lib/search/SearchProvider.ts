import type { SearchResult, SearchSort, SearchType } from './models'

export abstract class SearchProvider<T = SearchType | string> {
  public abstract readonly Type: T

  public abstract search(
    q: string,
    sort: SearchSort
  ): Promise<SearchResult<T>[]>
}
