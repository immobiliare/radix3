# 1.0.0 (2022-10-27)


### Bug Fixes

* allow type checking to work with native Node16 Typescript ESM ([#10](https://github.com/immobiliare/radix3/issues/10)) ([3df7c15](https://github.com/immobiliare/radix3/commit/3df7c15504b16f768f374995e1fc2f7fb70730f2))
* do not remove single / when removing trailing slash ([2f5d6f0](https://github.com/immobiliare/radix3/commit/2f5d6f0123dbed0a19d4edf3473ffaa422e3a06c))
* docs and release variable ([c49411c](https://github.com/immobiliare/radix3/commit/c49411ce908368174a03c2d6fc1b1d1e159a51ee))
* ignore functional nodes ([#12](https://github.com/immobiliare/radix3/issues/12)) ([39bf05f](https://github.com/immobiliare/radix3/commit/39bf05f5d30fe833b5a5bcbae0f36e1f0a68659f))


* refactor!: remove router.lookup all ([1698876](https://github.com/immobiliare/radix3/commit/1698876ccf73837cb44cdd5c237d9e55c76fe264))
* feat!: make strict trailing slash opt-in (#17) ([961953c](https://github.com/immobiliare/radix3/commit/961953c086a9f2079663717ab79eebef7fcbc894)), closes [#17](https://github.com/immobiliare/radix3/issues/17)
* fix!: use map to access child keys (#15) ([36afa3c](https://github.com/immobiliare/radix3/commit/36afa3c5fe3249f971c1b8d7f5907958162a6e2d)), closes [#15](https://github.com/immobiliare/radix3/issues/15)


### Features

* added immobiliarelabs standards ([6a8951d](https://github.com/immobiliare/radix3/commit/6a8951dff376dad9adc47252521af2e601a756e9))
* added the possibility to add functions to match the route path ([9c683ef](https://github.com/immobiliare/radix3/commit/9c683efd22696504dced92196d1ab5f0fe5507a1))
* match wildcard param ([9498610](https://github.com/immobiliare/radix3/commit/9498610c18e5f10a3780f9653cb1dca8157c0e21))
* named wildcard routes ([2c681b4](https://github.com/immobiliare/radix3/commit/2c681b41ab787f7f33b910d86253761814e39910))
* removed change log ([6f3f21c](https://github.com/immobiliare/radix3/commit/6f3f21c5a0215558aa626bcb883a827fbd9933c3))
* route matcher ([#16](https://github.com/immobiliare/radix3/issues/16)) ([c84c770](https://github.com/immobiliare/radix3/commit/c84c7701c13fc95f4c36dc878a91aea1fcc61f01))
* support unnamed placeholders with single * ([5900b13](https://github.com/immobiliare/radix3/commit/5900b135ef6a255713356c242455d837fd295751))


### BREAKING CHANGES

* `lookupAll` is not available. use new `toMatcher(router).matchAll`
* Ignore trailing slash by default. can be enabled back by passing `strictTrailingSlash: true` to `createRouter` options.
* Internal children type is changed from object to array
