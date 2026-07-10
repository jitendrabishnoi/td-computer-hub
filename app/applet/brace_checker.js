const fs = require('fs');

const code = fs.readFileSync('/app/applet/src/App.tsx', 'utf8');

let stack = [];
let lines = code.split('\n');

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  for (let j = 0; j < line.length; j++) {
    let char = line[j];
    if (char === '(' || char === '{' || char === '[') {
      stack.push({ char, line: i + 1, col: j + 1 });
    } else if (char === ')' || char === '}' || char === ']') {
      if (stack.length === 0) {
        console.log(`Unmatched closing ${char} at line ${i + 1}, col ${j + 1}`);
        continue;
      }
      let top = stack.pop();
      if (
        (char === ')' && top.char !== '(') ||
        (char === '}' && top.char !== '{') ||
        (char === ']' && top.char !== '[')
      ) {
        console.log(`Mismatched brackets: opened ${top.char} at line ${top.line}, col ${top.col} but closed with ${char} at line ${i + 1}, col ${j + 1}`);
      }
    }
  }
}

if (stack.length > 0) {
  console.log('Unclosed brackets remaining at the end of file:');
  stack.forEach(b => {
    console.log(`  ${b.char} opened at line ${b.line}, col ${b.col}`);
  });
} else {
  console.log('All brackets are balanced!');
}
