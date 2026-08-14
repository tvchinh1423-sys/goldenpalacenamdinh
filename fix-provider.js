const fs = require('fs');
let schema = fs.readFileSync('prisma/schema.prisma', 'utf8');

schema = schema.replace(/provider\s*=\s*"postgresql"/g, 'provider = "sqlite"');
schema = schema.replace(/directUrl\s*=\s*env\("DIRECT_URL"\)/g, '');

fs.writeFileSync('prisma/schema.prisma', schema);
console.log('Fixed provider');
