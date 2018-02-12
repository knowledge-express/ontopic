// This file should offer some conversion function to make things into quads.

import * as n3 from 'n3';
import * as Helpers from '.';

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
    // console.log('fromNQuads:', nquads);
    const parser = n3.Parser();
    const quads = (<n3.Triple[]><any>parser.parse(nquads, null)).map(({ subject, predicate, object, graph}) => {
      return {
        subject,
        predicate,
        object,
        label: graph
      }
    });

    return quads;
  }

  export const toNQuads = (quads: Quad[]): NQuads => {
    return quads.map(quad => {
      const { subject, predicate, object, label } = quad;
      return `<${subject}> <${predicate}> ${Helpers.encodeRDF(object)} ${label ? `<${label}>` : ''} .\n`;
    }).join('');
  };

}
