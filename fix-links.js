const fs = require('fs');

const fix = (file, replacements) => {
  let content = fs.readFileSync(file, 'utf8');
  for (const [from, to] of Object.entries(replacements)) {
    content = content.split(from).join(to);
  }
  fs.writeFileSync(file, content);
};

fix('src/app/(client)/du-toan-chi-phi/page.js', {
  'href="/venues"': 'href="/du-toan-chi-phi/venues"'
});

fix('src/app/(client)/du-toan-chi-phi/venues/page.js', {
  'href="/"': 'href="/du-toan-chi-phi"',
  'href="/services"': 'href="/du-toan-chi-phi/services"'
});

fix('src/app/(client)/du-toan-chi-phi/services/page.js', {
  'href="/venues"': 'href="/du-toan-chi-phi/venues"',
  'href="/estimate"': 'href="/du-toan-chi-phi/estimate"'
});

fix('src/app/(client)/du-toan-chi-phi/estimate/page.js', {
  'href="/services"': 'href="/du-toan-chi-phi/services"'
});
console.log('Fixed links');
