const fs = require('fs');
let schema = fs.readFileSync('prisma/schema.prisma', 'utf8');

schema = schema.replace(/@default\(STAFF\)/g, '@default("STAFF")');
schema = schema.replace(/@default\(DRAFT\)/g, '@default("DRAFT")');
schema = schema.replace(/@default\(NEW\)/g, '@default("NEW")');

fs.writeFileSync('prisma/schema.prisma', schema);
