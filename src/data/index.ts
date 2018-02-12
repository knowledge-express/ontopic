import * as isuri from 'isuri';

export function iriify(str: string) {
  return `<${str}>`;
}

export function encodeRDF(str: string) {
  if (isURI(str)) return iriify(str);
  if (isLiteral(str)) return encodeLiteral(str);
  try {
    JSON.parse(str);
    return str;
  } catch(e) {  
    return JSON.stringify(str);
  }
}

export function isURI(str: string) {
  return isuri.isValid(str);
  // return /\w+:(\/?\/?)[^\s]+/.test(str);
}

export function isLiteral(str: string) {
  return /\^\^/.test(str);
}

export function encodeLiteral(str) {
  const [ value, type ] = str.split("^^");
  return `${value}^^${iriify(type)}`;
}

// export function isIRI(str: string) {
//   return /<(.*)>/.test(str);
// }
//
//
// export function decodeIRI(str: string) {
//   if (isIRI(str)) return str.slice(1, str.length - 1);
//   return str;
// }

export * from './quad';
