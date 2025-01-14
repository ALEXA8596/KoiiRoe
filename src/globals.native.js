import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import 'process/browser'
global.Buffer = global.Buffer || require('buffer').Buffer;
global.process = require('process/browser');
// console.log(global.process)