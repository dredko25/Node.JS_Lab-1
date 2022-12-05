import { readdir } from 'node:fs/promises';
import * as path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseDir = path.join(__dirname, '/entity');



const router = {};
const isRouterFile = (name) => /\.router\.js$/.test(name);

async function loadRoutesDir(dirName, base) {
    const relativePath = path.join(base, dirName);
    const workDir = path.join(baseDir, relativePath);
    const dir = await readdir(workDir, {withFileTypes: true});

    for (const dirent of dir) {
        if (dirent.isDirectory()) {
            await loadRoutesDir(dirent.name, path.join(base, dirName))
        } else if (dirent.isFile() && isRouterFile(dirent.name)) {
            let modulePath = pathToFileURL(path.join(workDir, dirent.name))
            let module = await import(modulePath);
            router[relativePath.replaceAll(path.sep, '/')] = {...module};
        }
    }
}

await loadRoutesDir('', path.sep)

export { router };