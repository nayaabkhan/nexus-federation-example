import { ApolloServer } from 'apollo-server'
import schema from './schema'

const server = new ApolloServer({
  schema,
})

server.listen(4002).then(({ url }) => console.log(`🚀 Server ready at ${url}`))
