import * as n3 from 'n3';
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
}

export function isLiteral(str: string) {
  return /\^\^/.test(str);
}

export function encodeLiteral(str) {
  const [ value, type ] = str.split("^^");
  return `${value}^^${iriify(type)}`;
}

export type NQuads = string;

export type Quad = {
  subject: string,
  predicate: string,
  object: string,
  label?: string
};

export module Quad {
  export function isQuad(quad: object): quad is Quad {
    return quad != null &&
    typeof quad === 'object' &&
    typeof quad['subject'] === 'string' &&
    typeof quad['predicate'] === 'string' &&
    typeof quad['object'] === 'string';
  }

  export function compare(a: Quad, b: Quad): number {
    const compareSubjects = a.subject.localeCompare(b.subject);
    const comparePredicates = a.predicate.localeCompare(b.predicate);
    const compareObjects = a.object.localeCompare(b.object);
    const compareLabels = a.label.localeCompare(b.label);

    return (
      compareSubjects !== 0 ? compareSubjects :
      comparePredicates !== 0 ? comparePredicates :
      compareObjects !== 0 ? compareObjects :
      compareLabels !== 0 ? compareLabels :
      0);

  }

  export function fromNQuads(nquads: NQuads): Quad[] {
    const parser = n3.Parser();
    const quads = (<n3.Triple[]><any>parser.parse(nquads, null)).map(({ subject, predicate, object, graph }) => {
      return {
        subject,
        predicate,
        object,
        ...(graph != null && graph != "" ? { label: graph } : {})
      }
    });

    return quads;
  }

  export function toNQuads(quads: Quad[]): NQuads {
    return quads.map(quad => {
      const { subject, predicate, object, label } = quad;
      return `<${subject}> <${predicate}> ${encodeRDF(object)} ${label ? `<${label}>` : ''} .\n`;
    }).join('');
  };

}
