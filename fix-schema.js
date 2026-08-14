const fs = require('fs');
let schema = fs.readFileSync('prisma/schema.prisma', 'utf8');

schema = schema.replace(/role         Role     @default\(STAFF\)/g, 'role         String     @default("STAFF")');
schema = schema.replace(/status       PublishStatus @default\(DRAFT\)/g, 'status       String @default("DRAFT")');
schema = schema.replace(/type      PostType @default\(NEWS\)/g, 'type      String @default("NEWS")');

fs.writeFileSync('prisma/schema.prisma', schema);
console.log('Fixed schema');
