const fs = require('fs');

const StyleDictionaryPackage = require('style-dictionary');

const getStyleDictionaryConfig = ({product, platform, base}) => ({
  include: [
    'properties/base/shared/**/*.json',
    `properties/base/${base}/**/*.json`,
    `properties/platforms/${platform}/**/*.json`,
  ],
  source: [`properties/products/${product}/**/*.json`],
  platforms: {
    tokens: {
      transforms: ['name/cti/pascal'],
      buildPath: `build/tokens/`,
      files: [
        {
          destination: `${platform}-${product}-${base}.json`,
          format: 'json',
        },
      ],
    },
  },
});

console.log('Build started...');

const platforms = ['web', 'android', 'ios'];
const products = fs.readdirSync('./properties/products/');
const bases = ['dark'];

products.forEach(product => {
  platforms.forEach(platform => {
    bases.forEach(base => {
      console.log('\n==============================================');
      console.log(`\nProcessing: [${product} - ${platform} - ${base}]`);

      const StyleDictionary = StyleDictionaryPackage.extend(
        getStyleDictionaryConfig({product, platform, base}),
      );

      StyleDictionary.buildPlatform('tokens');

      console.log('\nEnd processing');
    });
  });
});

console.log('\n==============================================');
console.log('\nBuild completed!');
