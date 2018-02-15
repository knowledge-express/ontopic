import * as n3 from 'n3';
import * as isuri from 'isuri';

export type Quad = {
  subject: Quad.IRI,
  predicate: Quad.IRI,
  object: Quad.IRI | string,
  label?: Quad.IRI
};

export module Quad {
  export type NQuads = string;
  export type Literal = string;
  export type IRI = string;

  export function encodeRDF(str: string): string {
    if (isURI(str)) return encodeIRI(str);
    if (isLiteral(str)) return encodeLiteral(str);
    try {
      JSON.parse(str);
      return str;
    } catch(e) {
      return JSON.stringify(str);
    }
  }

  export function isIRI(str: string): str is IRI {
    return isURI(str);
  }

  export function isURI(str: string): boolean {
    return isuri.isValid(str);
  }

  export function isLiteral(str: string): str is Literal {
    return /\^\^/.test(str);
  }

  export function encodeIRI(iri: IRI): string {
    return `<${iri}>`;
  }

  export function encodeLiteral(literal: Literal): string {
    const [ value, type ] = literal.split("^^");
    return `${value}^^${encodeIRI(type)}`;
  }

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

export default Quad;
