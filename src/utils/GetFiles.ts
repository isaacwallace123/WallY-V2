import { readdirSync, statSync } from 'fs';
import { join } from 'path';

function GetFiles(dir: string): string[] {
    let results: string[] = [];

    readdirSync(dir).forEach((file: string) => {
        const filePath = join(dir, file);
        const stat = statSync(filePath);

        if (stat.isDirectory()) {
            results = results.concat(GetFiles(filePath));
        } else if (file.endsWith('.ts')) {
            results.push(filePath);
        }
    });

    return results;
}

export default GetFiles;