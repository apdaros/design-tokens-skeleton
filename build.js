const glob = require('glob');
const fs = require('fs');
const template = require('lodash').template;
const styleDictionary = require('style-dictionary');

styleDictionary.registerFormat({
  name: 'ios-swift/struct.swift',
  formatter: template(fs.readFileSync('templates/struct.swift.template')),
});

styleDictionary.registerFormat({
  name: 'js/styled-system',
  formatter: template(fs.readFileSync('templates/styled-system.js.template')),
});

const defaultOptions = {
  options: {showFileHeader: false},
};

const getStyleDictionaryConfig = ({name, base, output, platform}) => {
  const platformTokens = platform === 'styled-system' ? 'web' : platform;

  return {
    source: [`build/tokens/${platformTokens}-${name}-${base}.json`],
    platforms: {
      web: {
        transforms: ['attribute/cti', 'size/remToPx', 'color/css'],
        buildPath: `build/web/${output}/`,
        files: [
          {
            destination: 'tokens.json',
            format: 'json/nested',
          },
        ],
      },
      'styled-system': {
        transforms: ['attribute/cti', 'size/remToPx', 'color/css'],
        buildPath: `build/styled-system/${output}/`,
        files: [
          {
            destination: 'theme.js',
            format: 'js/styled-system',
            themeName: output,
          },
        ],
      },
      ios: {
        transformGroup: 'ios-swift',
        buildPath: `build/ios/${output}/`,
        files: [
          {
            destination: 'tokens.swift',
            format: 'ios-swift/struct.swift',
            className: 'Tokens',
            ...defaultOptions,
          },
        ],
      },
      android: {
        transformGroup: 'android',
        buildPath: `build/android/${output}/`,
        files: [
          {
            destination: 'colors.xml',
            format: 'android/colors',
            ...defaultOptions,
          },
          {
            destination: 'dimens.xml',
            format: 'android/dimens',
            ...defaultOptions,
          },
          {
            destination: 'fontDimens.xml',
            format: 'android/fontDimens',
            ...defaultOptions,
          },
          {
            destination: 'integers.xml',
            format: 'android/integers',
            ...defaultOptions,
          },
          {
            destination: 'strings.xml',
            format: 'android/strings',
            ...defaultOptions,
          },
        ],
      },
    },
  };
};

console.log('Build started...');

const products = [
  {output: 'brand-1', name: 'brand-1', base: 'dark'},
  {output: 'default-dark', name: 'default', base: 'dark'},
];
const platforms = ['styled-system', 'web', 'android', 'ios'];

products.forEach(product => {
  platforms.forEach(platform => {
    console.log('\n==============================================');
    console.log(
      `\nProcessing: ${product.output} [${platform} ${product.name} ${product.base}]`,
    );

    styleDictionary
      .extend(
        getStyleDictionaryConfig({
          ...product,
          platform,
        }),
      )
      .buildPlatform(platform);

    console.log('\nEnd processing');
  });
});

console.log('\n==============================================');
console.log('\nBuild completed!');
