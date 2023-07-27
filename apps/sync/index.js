import { Hocuspocus } from '@hocuspocus/server'
import { Logger } from '@hocuspocus/extension-logger'
import { SQLite } from '@hocuspocus/extension-sqlite'

const server = new Hocuspocus({
  port: 1234,
  extensions: [new Logger(), new SQLite({ database: 'db.sqlite' })],
})

server.listen()
