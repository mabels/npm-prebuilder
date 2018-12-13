import * as fs from 'fs';
import * as zlib from 'zlib';
import { PackageJson } from '..';
import { Readable } from 'stream';
const tarstream = require('tar-stream');

interface Header {
    name: string;
}

export function getPackageJsonFromArchive(path: string): Promise<PackageJson> {
    return new Promise<PackageJson>((rs, rj) => {
        const extract = tarstream.extract();
        const f = fs.createReadStream(path);

        f.on('error', (err) => {
            rj(err);
        });

        const data: string[] = [];

        extract.on('entry', (header: Header, stream: Readable, next: () => void) => {
            stream.on('end', next);
            if (header.name == 'package/package.json' || header.name == 'package.json') {
                stream.on('data', (streamData: Buffer) => data.push(streamData.toString()));
            }
            stream.resume();
        });

        extract.on('finish', () => {
            try {
                rs(JSON.parse(data.join('')));
            } catch (e) {
                console.log(data.join(''));
                console.error(`unable to parse package json from ${path}`);
                rj(e);
            }
        });

        f.pipe(zlib.createGunzip()).pipe(extract);
    });
}
