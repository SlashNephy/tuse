import { readdir, lstat, writeFile, mkdir, readFile } from 'fs/promises'
import { resolve } from 'path'

import type {
  SearchResult,
  SearchSort,
  PluginConfig,
  SearchPluginConstructor,
} from './plugin'

export const search = async (
  q: string,
  sort: SearchSort
): Promise<{
  [type in string]?: SearchResult[]
}> => {
  const pluginsDir =
    process.env.TUSE_PLUGINS_DIR ?? resolve(__dirname, 'plugins')
  if (!(await exists(pluginsDir))) {
    await mkdir(pluginsDir)
  }

  console.debug(`pluginsDir = ${pluginsDir}`)

  const files = await readdir(pluginsDir)
  const pluginFiles = files.filter((file) => file.endsWith('.js'))

  // どれか死んでも返せるように allSettled を使う
  const promises = await Promise.allSettled(
    pluginFiles.map(async (pluginFile) => {
      console.debug(`Loading ${pluginFile}...`)

      const pluginSource = await readFile(
        resolve(pluginsDir, pluginFile),
        'utf8'
      )

      // Hack: dynamic import は Next.js に管理されてしまうのでよくないけど eval する
      const pluginClass = eval(`${pluginSource};module.exports.default`)
      // const { default: pluginClass } = await import(
      //   resolve(pluginsDir, pluginFile)
      // )

      const pluginConfig = await loadPluginConfig(pluginsDir, pluginFile)

      // https://stackoverflow.com/a/56760166
      const plugin = new (pluginClass as SearchPluginConstructor)(pluginConfig)

      return {
        [plugin.Type]: await plugin.search(q, sort),
      }
    })
  )

  return promises.reduce((current, promise) => {
    if (promise.status === 'fulfilled') {
      return {
        ...current,
        ...promise.value,
      }
    } else {
      console.error(promise.reason)
      return current
    }
  }, {})
}

const loadPluginConfig = async (
  pluginsDir: string,
  pluginFile: string
): Promise<PluginConfig> => {
  const path = resolve(pluginsDir, pluginFile.replace(/\.js$/, '.config.json'))

  let config: PluginConfig
  if (await exists(path)) {
    const content = await readFile(path, 'utf8')
    config = JSON.parse(content)
    // config = await import(path)
  } else {
    config = {}
    await writeFile(path, '{}')
  }

  return config
}

const exists = async (path: string) => {
  try {
    return !!(await lstat(path))
  } catch {
    return false
  }
}
