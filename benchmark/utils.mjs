/* eslint-disable no-console */
import { readFileSync } from 'fs';
import os from 'os';
import { createRouter } from '../dist/index.mjs';

export const logSection = (title) => {
    console.log(`\n--- ${title} ---\n`);
};

const pkgVersion = JSON.parse(
    readFileSync(new URL('../package.json', import.meta.url), 'utf8')
).version;

export function printEnv() {
    logSection('Test environment');
    console.log('Node.js version:', process.versions.node);
    console.log('Radix3 version:', pkgVersion);
    console.log('OS:', os.platform());
    console.log('CPU count:', os.cpus().length);
    console.log('Current load:', os.loadavg());
    console.log('');
}

export function printStats(stats) {
    console.log(
        'Stats:\n' +
            Object.entries(stats)
                .map(([path, hits]) => ` - ${path}: ${hits}`)
                .join('\n')
    );
}

export const router = createRouter({
    parseParameters: true,
    routes: Object.fromEntries(
        [
            '/hello',
            '/cool',
            '/hi',
            '/helium',
            '/coooool',
            '/chrome',
            '/choot',
            '/choot/:choo',
            '/ui/**',
            '/ui/components/**',
            '/::lang/international/**',
        ].map((path) => [path, { path }])
    ),
    funcs: { lang: (str) => str.length === 2 },
});

export const benchSets = [
    {
        title: 'static route',
        requests: [{ path: '/choot' }],
    },
    {
        title: 'dynamic route',
        requests: [{ path: '/choot/123' }],
    },
    {
        title: 'dynamic route with funcs',
        requests: [{ path: '/it/international/some' }],
    },
];
