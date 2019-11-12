import { interfaceType, objectType, makeSchema, queryType } from 'nexus'
import { transformSchemaFederation } from 'graphql-transform-federation'

const data = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Elya',
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Eyre',
  },
  {
    id: '3',
    firstName: 'Robert',
    lastName: 'Frost',
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
    t.string('firstName', o => o.firstName)
    t.string('lastName', o => o.lastName)
    t.string('fullName', o => `${o.firstName} ${o.lastName}`)
  },
})

const Query = queryType({
  definition(t) {
    t.field('me', {
      type: User,
      nullable: true,
      resolve: () => {
        return data[0]
      },
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
    keyFields: ['id'],
    resolveReference(reference: any) {
      return data.find(x => x.id === reference.id)
    },
  },
})

export default federatedSchema
