const fs = require('fs');
let schema = fs.readFileSync('prisma/schema.prisma', 'utf8');

schema = schema.replace(/PublishStatus\s+@default\(DRAFT\)/g, 'String @default("DRAFT")');
schema = schema.replace(/String\s+@default\(NEW\)/g, 'String @default("NEW")');
schema = schema.replace(/String\s+@default\(NEWS\)/g, 'String @default("NEWS")');
schema = schema.replace(/status\s+PublishStatus/g, 'status String');

fs.writeFileSync('prisma/schema.prisma', schema);
console.log('Fixed more schema types');
