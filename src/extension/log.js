/* eslint-disable no-console */

export default function log(...messages) {
  messages.forEach(message => console.info(message));
  console.log('');
}
