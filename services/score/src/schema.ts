import { interfaceType, objectType, makeSchema, queryType } from 'nexus'
import { transformSchemaFederation } from 'graphql-transform-federation'

interface Score {
  id: string
  score: number
}

const data: Score[] = [
  {
    id: '1',
    score: 30,
  },
  {
    id: '2',
    score: 10,
  },
  {
    id: '3',
    score: 20,
  },
]

const Node = interfaceType({
  name: 'Node',
  definition(t) {
    t.id('id', o => o.id)
    t.resolveType(() => null)
  },
})

const User = objectType({
  name: 'User',
  definition(t) {
    t.implements(Node)
    t.int('score', o => {
      const match = data.find(u => u.id === o.id)
      return match!.score
    })
  },
})

const Query = queryType({
  definition(t) {
    t.int('highest', o => {
      const highSeen = 0
      const userWithHighest = data.find(u => u.score > highSeen)
      return userWithHighest!.score
    })
  },
})

const schema = makeSchema({
  types: [Node, User, Query],
  outputs: false,
})

const federatedSchema = transformSchemaFederation(schema, {
  Query: {
    extend: true,
  },
  User: {
    extend: true,
    keyFields: ['id'],
    fields: {
      id: {
        external: true,
      },
    },
  },
})

export default federatedSchema
