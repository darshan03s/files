import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const registryFilePath = './registry.json'
const registryName = 'files'
const registryHost = 'https://github.com/darshan03s/files'

const registryItems: RegistryItem[] = [
  {
    name: 'build-registry',
    title: 'Build registry script',
    type: 'registry:file',
    description: 'Add build-registry script to project',
    files: [
      {
        path: 'share/build-registry.ts',
        type: 'registry:file',
        target: 'build-registry.ts'
      }
    ]
  },
  {
    name: 'prettierrc',
    title: 'Prettier config',
    type: 'registry:file',
    description: 'Add prettier config to project',
    files: [
      {
        path: 'share/.prettierrc',
        type: 'registry:file',
        target: '.prettierrc'
      }
    ]
  },
  {
    name: 'cn',
    title: 'cn util',
    type: 'registry:file',
    description: 'Add cn util to project',
    files: [
      {
        path: 'share/cn.ts',
        type: 'registry:file',
        target: 'cn.ts'
      }
    ]
  },
  {
    name: 'logger',
    title: 'Logger util',
    type: 'registry:file',
    description: 'Add logger util to project',
    files: [
      {
        path: 'share/logger.ts',
        type: 'registry:file',
        target: 'logger.ts'
      }
    ]
  }
]

const postBuild = true

type RegistryItemType =
  | 'registry:base'
  | 'registry:block'
  | 'registry:component'
  | 'registry:font'
  | 'registry:lib'
  | 'registry:hook'
  | 'registry:ui'
  | 'registry:page'
  | 'registry:file'
  | 'registry:style'
  | 'registry:theme'
  | 'registry:block'

type RegistryItemFile = {
  path: string
  type: RegistryItemType
  target: string
}

type RegistryItem = {
  name: string
  type: RegistryItemType
  title: string
  author?: string
  description?: string
  registryDependencies?: string[]
  dependencies?: string[]
  devDependencies?: string[]
  files?: RegistryItemFile[]
}

type RegistryItemCssVars = {
  [key: string]: string | RegistryItemCssVars
}

type RegistryItemCss = {
  [key: string]: string | RegistryItemCss
}

type RegistryItemEnvVars = {
  [key: string]: string
}

type RegistryItemFont =
  | 'family'
  | 'provider'
  | 'import'
  | 'variable'
  | 'weight'
  | 'subsets'
  | 'selector'
  | 'dependency'

type Registry = {
  $schema: string
  name: string
  homepage: string
  items: RegistryItem[]
  include?: string[]
  cssVars?: RegistryItemCssVars
  css?: RegistryItemCss
  envVars?: RegistryItemEnvVars
  font?: {
    [key in RegistryItemFont]: string
  }
  docs?: string
  categories?: string[]
  meta?: { [key: string]: string }
}

if (!fs.existsSync(registryFilePath)) {
  const defaultRegistry: Registry = {
    $schema: 'https://ui.shadcn.com/schema/registry.json',
    name: registryName,
    homepage: registryHost,
    items: []
  }

  fs.writeFileSync(registryFilePath, JSON.stringify(defaultRegistry, null, 2))
  console.log(`Created registry.json`)
}

const registry = fs.readFileSync(registryFilePath, 'utf-8')

const existingRegistryJson = JSON.parse(registry) as Registry

const existingRegistryItems = existingRegistryJson.items

const existingRegistryItemsNames = existingRegistryItems.map((obj) => obj.name) as string[]

const registryItemsNames = registryItems.map((obj) => obj.name) as string[]

function writeRegistry(updated: Registry) {
  fs.writeFileSync(registryFilePath, JSON.stringify(updated, null, 2))
  if (postBuild) {
    console.log(`Running test build since postBuild is true`)
    try {
      execSync('npx shadcn@latest build --output ./.build-registry', { stdio: 'inherit' })
      fs.rmSync('./.build-registry', {
        recursive: true,
        force: true
      })
    } catch (_) {
      console.dir(updated, { depth: null })
      console.error(`Build failed. Reverting changes`)
      fs.writeFileSync(registryFilePath, JSON.stringify(existingRegistryJson, null, 2))
    }
  } else {
    console.warn(`Skipping test build since postBuild is false`)
  }
}

function getFilePaths(folderPath: string) {
  return fs
    .readdirSync(folderPath, {
      recursive: true,
      withFileTypes: true
    })
    .filter((entry) => entry.isFile())
    .map((entry) => path.join(entry.parentPath, entry.name))
}

function updateRegistry() {
  const items: RegistryItem[] = []

  registryItems.forEach((item) => {
    let i = { ...item }
    if (item.files) {
      const files: RegistryItemFile[] = []
      item.files.forEach((file) => {
        if (file.path.endsWith('/') || file.path.endsWith('/*') || file.path.endsWith('/**')) {
          const folderPath = file.path.replace(/\/(\*\*|\*)?$/, '')
          const type = file.type
          const target = file.target.replace(/\/$/, '')
          const filePaths = getFilePaths(folderPath)
          filePaths.forEach((filePath) => {
            files.push({
              type: type,
              path: filePath,
              target: path.join(target.split('/').slice(1).join('/'), filePath)
            })
          })
        } else {
          files.push(file)
        }
      })
      i = { ...i, files }
      items.push(i)
    }
  })

  const toUpdate = { ...existingRegistryJson, items: items }
  writeRegistry(toUpdate)
  process.exit(0)
}

function main() {
  registryItems.forEach((item) => {
    const name = item.name
    if (!existingRegistryItemsNames.includes(name)) {
      console.log(`Adding registry item: ${name}`)
      updateRegistry()
    }
  })

  existingRegistryItems.forEach((item) => {
    const name = item.name
    if (!registryItemsNames.includes(name)) {
      console.log(`Deleting registry item: ${name}`)
      updateRegistry()
    }
  })
}

main()

console.log(`Nothing to add or remove`)
