import { ApolloServer } from 'apollo-server'
import { ApolloGateway } from '@apollo/gateway'

const gateway = new ApolloGateway({
  serviceList: [
    { name: 'domain', url: 'http://localhost:4001/graphql' },
    { name: 'ratings', url: 'http://localhost:4002/graphql' },
    { name: 'bff', url: 'http://localhost:4003/graphql' },
  ],
})

;(async () => {
  const { schema, executor } = await gateway.load()

  const server = new ApolloServer({ schema, executor })

  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`)
  })
})()
