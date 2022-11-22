import { describe, it, expect } from 'vitest';
import { s } from 'vitest/dist/index-2f5b6168';
import { createRouter, NODE_TYPES } from '../src';

export function createRoutes(paths) {
    return Object.fromEntries(paths.map((path) => [path, { path }]));
}

function testRouter(paths, tests?) {
    const routes = createRoutes(paths);
    const router = createRouter({ routes });

    if (!tests) {
        tests = routes;
    }

    for (const path in tests) {
        it(`lookup ${path} should be ${JSON.stringify(tests[path])}`, () => {
            expect(router.lookup(path)).to.deep.equal(tests[path]);
        });
    }
}

function testRouterWithFuncs(paths, funcs, tests?) {
    const routes = createRoutes(paths);
    const router = createRouter({ routes, funcs });

    if (!tests) {
        tests = routes;
    }

    for (const path in tests) {
        it(`lookup ${path} should be ${JSON.stringify(tests[path])}`, () => {
            expect(router.lookup(path)).to.deep.equal(tests[path]);
        });
    }
}

describe('Router lookup', function () {
    describe('routes with check function should work', function () {
        testRouterWithFuncs(
            [
                'carbon/:element',
                'carbon/::length2:element/test/:testing',
                'carbon/::lengthMajor:element/test/:testing',
                'this/:route/has/:cool/stuff',
                'this/::length2:route/has/:cool/stuff',
                'this/::length2:route/has/:cool/stuff',
                'hello/::test/good',
                // 'hello2/::test/good',
                // 'hello2/:good',
            ],
            {
                length2: (v: string) => v.length === 2,
                lengthMajor: (v: string) => v.length === 3,
                test: (v: string) => v.endsWith('test'),
            },
            {
                'carbon/test1': {
                    path: 'carbon/:element',
                    params: {
                        element: 'test1',
                    },
                },
                '/carbon': null,
                'carbon/': null,
                'carbon/test2/test/test23': null,
                'carbon/te/test/test23': {
                    path: 'carbon/::length2:element/test/:testing',
                    params: {
                        element: 'te',
                        testing: 'test23',
                    },
                },
                'carbon/tes/test/test23': {
                    path: 'carbon/::lengthMajor:element/test/:testing',
                    params: {
                        element: 'tes',
                        testing: 'test23',
                    },
                },
                'this/test/has/more/stuff': {
                    path: 'this/:route/has/:cool/stuff',
                    params: {
                        route: 'test',
                        cool: 'more',
                    },
                },
                'this/te/has/more/stuff': {
                    path: 'this/::length2:route/has/:cool/stuff',
                    params: {
                        route: 'te',
                        cool: 'more',
                    },
                },
                'hello/test/good': {
                    path: 'hello/::test/good',
                    params: {
                        _0: 'test',
                    },
                },
                'hello/test': null,
                // 'hello2/test/good': {
                //     path: 'hello2/::test/good',
                //     params: {
                //         _0: 'test',
                //     },
                // },
                // 'hello2/test': {
                //     path: 'hello2/:good',
                //     params: {
                //         good: 'test',
                //     },
                // },
            }
        );
    });

    describe('static routes', function () {
        testRouter([
            '/',
            '/route',
            '/another-router',
            '/this/is/yet/another/route',
        ]);
    });

    describe('retrieve placeholders', function () {
        testRouter(
            [
                'carbon/:element',
                'carbon/:element/test/:testing',
                'this/:route/has/:cool/stuff',
                'hello/:routes/has/:cool/stuff',
            ],
            {
                'carbon/test1': {
                    path: 'carbon/:element',
                    params: {
                        element: 'test1',
                    },
                },
                '/carbon': null,
                'carbon/': null,
                'carbon/test2/test/test23': {
                    path: 'carbon/:element/test/:testing',
                    params: {
                        element: 'test2',
                        testing: 'test23',
                    },
                },
                'this/test/has/more/stuff': {
                    path: 'this/:route/has/:cool/stuff',
                    params: {
                        route: 'test',
                        cool: 'more',
                    },
                },
            }
        );
    });

    describe('should be able to perform wildcard lookups', function () {
        testRouter(
            [
                'polymer/**:id',
                'polymer/another/route',
                'route/:p1/something/**:rest',
            ],
            {
                'polymer/another/route': { path: 'polymer/another/route' },
                'polymer/anon': {
                    path: 'polymer/**:id',
                    params: { id: 'anon' },
                },
                'polymer/foo/bar/baz': {
                    path: 'polymer/**:id',
                    params: { id: 'foo/bar/baz' },
                },
                'route/param1/something/c/d': {
                    path: 'route/:p1/something/**:rest',
                    params: { p1: 'param1', rest: 'c/d' },
                },
            }
        );
    });

    describe('unnamed placeholders', function () {
        testRouter(['polymer/**', 'polymer/route/*'], {
            'polymer/foo/bar': { path: 'polymer/**', params: { _: 'foo/bar' } },
            'polymer/route/anon': {
                path: 'polymer/route/*',
                params: { _0: 'anon' },
            },
            'polymer/constructor': {
                path: 'polymer/**',
                params: { _: 'constructor' },
            },
        });
    });

    describe('should be able to match routes with trailing slash', function () {
        testRouter(
            ['route/without/trailing/slash', 'route/with/trailing/slash/'],
            {
                'route/without/trailing/slash': {
                    path: 'route/without/trailing/slash',
                },
                'route/with/trailing/slash/': {
                    path: 'route/with/trailing/slash/',
                },
                'route/without/trailing/slash/': {
                    path: 'route/without/trailing/slash',
                },
                'route/with/trailing/slash': {
                    path: 'route/with/trailing/slash/',
                },
            }
        );
    });

    describe('ignoreParameters Should works', function () {
        const router = createRouter({
            parseParameters: false,
            routes: {
                '::test/some': { type: 'function' },
                ':bla/*': { type: 'var' },
                'hello/**': { type: 'wildcard' },
            },
            funcs: { test: (str) => str.length === 2 },
        });
        it('lookup', () => {
            expect(router.lookup('it/some')).to.deep.equal({
                type: 'function',
            });
            expect(router.lookup('hellos/good')).to.deep.equal({ type: 'var' });
            expect(router.lookup('hello/good/jobs')).to.deep.equal({
                type: 'wildcard',
            });
        });
    });
});

describe('Router insert', function () {
    it('should be able to insert nodes correctly into the tree', function () {
        const router = createRouter();
        router.insert('hello', {});
        router.insert('cool', {});
        router.insert('hi', {});
        router.insert('helium', {});
        router.insert('/choo', {});
        router.insert('//choo', {});

        const rootNode = router.ctx.rootNode;
        const helloNode = rootNode.children.get('hello');
        const coolNode = rootNode.children.get('cool');
        const hiNode = rootNode.children.get('hi');
        const heliumNode = rootNode.children.get('helium');
        const slashNode = rootNode.children.get('');

        expect(helloNode).to.exist;
        expect(coolNode).to.exist;
        expect(hiNode).to.exist;
        expect(heliumNode).to.exist;
        expect(slashNode).to.exist;

        const slashChooNode = slashNode!.children.get('choo');
        const slashSlashChooNode = slashNode!.children
            .get('')!
            .children.get('choo');

        expect(slashChooNode).to.exist;
        expect(slashSlashChooNode).to.exist;
    });

    it('should insert static routes into the static route map', function () {
        const router = createRouter();
        const route = '/api/v2/route';
        router.insert(route, {});

        expect(router.ctx.staticRoutesMap[route]).to.exist;
    });
    it('should not insert variable routes into the static route map', function () {
        const router = createRouter();
        const routeA = '/api/v2/**';
        const routeB = '/api/v3/:placeholder';
        router.insert(routeA, {});
        router.insert(routeB, {});

        expect(router.ctx.staticRoutesMap[routeA]).to.not.exist;
        expect(router.ctx.staticRoutesMap[routeB]).to.not.exist;
    });

    it('should insert placeholder and wildcard nodes correctly into the tree', function () {
        const router = createRouter();
        router.insert('hello/:placeholder/tree', {});
        router.insert('choot/choo/**', {});

        const helloNode = router.ctx.rootNode.children.get('hello');
        const helloPlaceholderNode = helloNode!.children.get(':placeholder');
        expect(helloPlaceholderNode!.type).to.equal(NODE_TYPES.PLACEHOLDER);

        const chootNode = router.ctx.rootNode.children.get('choot');
        const chootChooNode = chootNode!.children.get('choo');
        const chootChooWildcardNode = chootChooNode!.children.get('**');
        expect(chootChooWildcardNode!.type).to.equal(NODE_TYPES.WILDCARD);
    });

    it('should be able to initialize routes via the router contructor', function () {
        const router = createRouter({
            routes: {
                '/api/v1': { value: 1 },
                '/api/v2': { value: 2 },
                '/api/v3': { value: 3 },
            },
        });

        const rootSlashNode = router.ctx.rootNode.children.get('');
        const apiNode = rootSlashNode!.children.get('api');
        const v1Node = apiNode!.children.get('v1');
        const v2Node = apiNode!.children.get('v2');
        const v3Node = apiNode!.children.get('v3');

        expect(v1Node).to.exist;
        expect(v2Node).to.exist;
        expect(v3Node).to.exist;
        expect(v1Node!.data!.value).to.equal(1);
        expect(v2Node!.data!.value).to.equal(2);
        expect(v3Node!.data!.value).to.equal(3);
    });

    it('should allow routes to be overwritten by performing another insert', function () {
        const router = createRouter({
            routes: { '/api/v1': { data: 1 } },
        });

        let apiRouteData = router.lookup('/api/v1');
        expect(apiRouteData!.data).to.equal(1);

        router.insert('/api/v1', {
            path: '/api/v1',
            data: 2,
            anotherField: 3,
        });

        apiRouteData = router.lookup('/api/v1');
        expect(apiRouteData).deep.equal({
            data: 2,
            path: '/api/v1',
            anotherField: 3,
        });
        expect(apiRouteData!.anotherField).to.equal(3);
    });

    it('should throw if function does not exist', function () {
        expect(() =>
            createRouter({
                routes: { '/::notLen/v1': { data: 1 } },
                funcs: {
                    len: (str) => str.length === 2,
                },
            })
        ).toThrowError(
            `the function notLen is not defined in the funcs object.`
        );

        const router = createRouter({
            funcs: {
                len: (str) => str.length === 2,
            },
        });
        expect(() => router.insert('/::notLen/v1', { data: 1 })).toThrowError(
            `the function notLen is not defined in the funcs object.`
        );
    });
});

describe('Router remove', function () {
    it('should be able to remove nodes', function () {
        const router = createRouter({
            routes: createRoutes([
                'hello',
                'cool',
                'hi',
                'helium',
                'coooool',
                'chrome',
                'choot',
                'choot/:choo',
                'ui/**',
                'ui/components/**',
                '::start/hello',
                '::ends/hello',
                'build/::ends/blue',
                'build/::ends/green',
                'remove/::remove',
                'remove/::remove/something',
            ]),
            funcs: {
                remove: (str: string) => str.endsWith('remove'),
                start: (str: string) => str.startsWith('test'),
                ends: (str: string) => str.endsWith('testEnds'),
            },
        });

        router.remove('choot');
        expect(router.lookup('choot')).to.deep.equal(null);

        expect(router.lookup('ui/components/snackbars')).to.deep.equal({
            path: 'ui/components/**',
            params: { _: 'snackbars' },
        });

        router.remove('ui/components/**');
        expect(router.lookup('ui/components/snackbars')).to.deep.equal({
            path: 'ui/**',
            params: { _: 'components/snackbars' },
        });

        expect(router.lookup('test-good/hello')).to.deep.equal({
            path: '::start/hello',
            params: { _0: 'test-good' },
        });
        expect(router.lookup('hello-testEnds/hello')).to.deep.equal({
            path: '::ends/hello',
            params: { _0: 'hello-testEnds' },
        });

        router.remove('::start/hello');
        expect(router.lookup('test-good/hello')).to.deep.equal(null);

        expect(router.lookup('hello-testEnds/hello')).to.deep.equal({
            path: '::ends/hello',
            params: { _0: 'hello-testEnds' },
        });

        router.remove('::ends/hello');
        expect(router.lookup('testEnds/hello')).to.deep.equal(null);

        expect(router.lookup('build/testEnds/blue')).to.deep.equal({
            path: 'build/::ends/blue',
            params: { _0: 'testEnds' },
        });
        router.remove('build/::ends/blue');
        expect(router.lookup('build/testEnds/blue')).to.deep.equal(null);
        expect(router.lookup('build/testEnds/green')).to.deep.equal({
            path: 'build/::ends/green',
            params: { _0: 'testEnds' },
        });

        expect(router.lookup('remove/Hellremove')).to.deep.equal({
            path: 'remove/::remove',
            params: { _0: 'Hellremove' },
        });
        expect(router.lookup('remove/remove/something')).to.deep.equal({
            path: 'remove/::remove/something',
            params: { _0: 'remove' },
        });
        router.remove('remove/::remove');

        expect(router.lookup('remove/Hellremove/something')).to.deep.equal({
            path: 'remove/::remove/something',
            params: { _0: 'Hellremove' },
        });
        expect(router.lookup('remove/Hellremove')).to.deep.equal(null);
    });

    it('should be able to remove placeholder routes', function () {
        const router = createRouter({
            routes: createRoutes([
                'placeholder/:choo',
                'placeholder/:choo/:choo2',
            ]),
        });

        expect(router.lookup('placeholder/route')).to.deep.equal({
            path: 'placeholder/:choo',
            params: {
                choo: 'route',
            },
        });

        // TODO
        // router.remove('placeholder/:choo');
        // expect(router.lookup('placeholder/route')).to.deep.equal(null);

        expect(router.lookup('placeholder/route/route2')).to.deep.equal({
            path: 'placeholder/:choo/:choo2',
            params: {
                choo: 'route',
                choo2: 'route2',
            },
        });
    });

    it('should be able to remove wildcard routes', function () {
        const router = createRouter({
            routes: createRoutes(['ui/**', 'ui/components/**']),
        });

        expect(router.lookup('ui/components/snackbars')).to.deep.equal({
            path: 'ui/components/**',
            params: { _: 'snackbars' },
        });
        router.remove('ui/components/**');
        expect(router.lookup('ui/components/snackbars')).to.deep.equal({
            path: 'ui/**',
            params: { _: 'components/snackbars' },
        });
    });

    it('should return a result signifying that the remove operation was successful or not', function () {
        const router = createRouter({
            routes: createRoutes(['/some/route']),
        });

        let removeResult = router.remove('/some/route');
        expect(removeResult).to.equal(true);

        removeResult = router.remove('/some/route');
        expect(removeResult).to.equal(false);

        removeResult = router.remove('/some/route/that/never/existed');
        expect(removeResult).to.equal(false);
    });
});
