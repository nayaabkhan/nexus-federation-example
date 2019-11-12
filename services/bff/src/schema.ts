import { interfaceType, objectType, makeSchema } from 'nexus'
import { transformSchemaFederation } from 'graphql-transform-federation'

interface User {
  id: string
  showPremiumBanner: boolean
}

const data: User[] = [
  {
    id: '1',
    showPremiumBanner: true,
  },
  {
    id: '2',
    showPremiumBanner: false,
  },
  {
    id: '3',
    showPremiumBanner: true,
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
    t.boolean('showPremiumBanner', o => {
      const match = data.find(u => u.id === o.id)
      return match!.showPremiumBanner
    })
  },
})

const schema = makeSchema({
  types: [Node, User],
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
