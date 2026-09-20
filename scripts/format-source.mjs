import ts from 'typescript';
import fs from 'node:fs/promises';
const printer=ts.createPrinter({newLine:ts.NewLineKind.LineFeed});
for(const name of await fs.readdir('src'))if(/\.tsx?$/.test(name)){const p='src/'+name;const source=ts.createSourceFile(p,await fs.readFile(p,'utf8'),ts.ScriptTarget.Latest,true,name.endsWith('tsx')?ts.ScriptKind.TSX:ts.ScriptKind.TS);await fs.writeFile(p,printer.printFile(source));}
for(const p of ['package.json','tsconfig.json'])await fs.writeFile(p,JSON.stringify(JSON.parse(await fs.readFile(p,'utf8')),null,2)+'\n');
