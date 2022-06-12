import { existsSync, mkdirSync, readdirSync } from 'fs'
import { resolve } from 'path'

import TerserPlugin from 'terser-webpack-plugin'
import webpack from 'webpack'

import type { Configuration } from 'webpack'

const srcDir = resolve(__dirname, 'src')
const projects = readdirSync(srcDir).map(
  (name) => [name, resolve(srcDir, name, 'index.ts')] as [string, string]
)

const outputDir = resolve(__dirname, '..', 'app', 'plugins')
if (!existsSync(outputDir)) {
  mkdirSync(outputDir)
}

const config: Configuration = {
  mode: 'production',
  target: 'node',
  entry: Object.fromEntries(projects),
  output: {
    path: outputDir,
    filename: '[name].js',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },
      {
        test: /\.js$/,
        include: outputDir,
        loader: 'babel-loader',
        options: {
          plugins: ['dynamic-import-webpack', 'remove-webpack'],
        },
      },
    ],
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
}

export default config
