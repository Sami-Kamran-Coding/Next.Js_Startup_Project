import { type SchemaTypeDefinition } from 'sanity'

// 👇 Import your schema files
import { startup } from './startup'
import { author } from './author'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [startup, author], // 👈 Register them here
}
