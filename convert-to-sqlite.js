const fs = require('fs');
let schema = fs.readFileSync('prisma/schema.prisma', 'utf8');

// Change provider
schema = schema.replace(/provider = "postgresql"/, 'provider = "sqlite"');
schema = schema.replace(/url\s+=\s+env\("DATABASE_URL"\)/, 'url      = "file:./dev.db"');

// Remove @db.*
schema = schema.replace(/@db\.\w+(\([^)]*\))?/g, '');

// SQLite Prisma doesn't support JSON, convert Json to String
schema = schema.replace(/\bJson\b/g, 'String');

// Convert Enums to Strings
schema = schema.replace(/enum \w+ \{[^}]+\}/g, '');
schema = schema.replace(/UserRole/g, 'String');
schema = schema.replace(/ContentStatus/g, 'String');
schema = schema.replace(/LeadStatus/g, 'String');
schema = schema.replace(/EventSession/g, 'String');

fs.writeFileSync('prisma/schema.prisma', schema);
console.log('Converted to SQLite');
