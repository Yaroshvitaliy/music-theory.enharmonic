import { getNaturalNote, getEnharmonicEquivalences, EnharmonicScaleBuilder } from '../src/enharmonic';
import { NATURAL_NOTES, OCTAVE_NOTES, Note, NaturalNote, AccidentalSymbol, FLAT, SHARP } from '../src/core';
import {
  getNaturalNoteTestCases,
  invalidNotes,
  getEnharmonicEquivalencesTestCases,
  getEnharmonicEquivalentScaleTestCases
} from './enharmonic-test-cases';

describe('getNaturalNote', () => {
  getNaturalNoteTestCases.forEach(({ note, expected }) => {
    it(`should return correct natural note for ${note} note`, () => {
      expect(getNaturalNote(note)).toBe(expected);
    });
  });

  invalidNotes.forEach(note => {
    it(`should thorw an error for invalid note ${note} note`, () => {
      expect(() => getNaturalNote(note as Note)).toThrow(`Note "${note}" is not valid.`);
    });
  });
});

describe('getEnharmonicEquivalences', () => {
  getEnharmonicEquivalencesTestCases.forEach(({ note, expected }) => {
    it(`should return correct enharmonic equivalents for ${note} note`, () => {
      const result = getEnharmonicEquivalences(note as NaturalNote, NATURAL_NOTES, OCTAVE_NOTES, 4);
      // expect(result).toEqual(expect.arrayContaining(expected));
      // expect(expected).toEqual(expect.arrayContaining(result));
      expect(result).toEqual(expected);
    });
  });

  it('should throw an error if maxAccidentals exceeds octave notes length', () => {
    const note: Note = 'G';
    expect(() => getEnharmonicEquivalences(note, undefined, undefined, OCTAVE_NOTES.length + 1)).toThrow('maxAccidentals cannot be greater than the length of octaveNotes.');
  });
});

const getEnharmonicEquivalentScaleFilters = [
  {
    description: 'a scale with incorrect number of notes',
    predicate: (({ scale }: { scale: string[] }) => scale.length < NATURAL_NOTES.length - 2 || scale.length > NATURAL_NOTES.length + 1),
  },
  {
    description: `a scale of ${NATURAL_NOTES.length - 2} notes`,
    predicate: (({ scale }: { scale: string[] }) => scale.length === NATURAL_NOTES.length - 2),
  },
  {
    description: `a scale of ${NATURAL_NOTES.length - 1} notes`,
    predicate: (({ scale }: { scale: string[] }) => scale.length === NATURAL_NOTES.length - 1),
  },
  {
    description: `a scale of ${NATURAL_NOTES.length} notes`,
    predicate: (({ scale }: { scale: string[] }) => scale.length === NATURAL_NOTES.length),
  },
  {
    description: `a scale of ${NATURAL_NOTES.length + 1} notes`,
    predicate: (({ scale }: { scale: string[] }) => scale.length === NATURAL_NOTES.length + 1),
  },
];

const getBestEnharmonicEquivalentScale = (scale: Note[], accidental: AccidentalSymbol): Note[] =>
  EnharmonicScaleBuilder.create()
    .withScale(scale as Note[])
    .withAccidental(accidental)
    .withNaturalNotes(NATURAL_NOTES)
    .withOctaveNotes(OCTAVE_NOTES)
    .withAccidentalsNumber(4)
    .withSortOptions(EnharmonicScaleBuilder.DefaultSortOptions)
    .getBestEnharmonicEquivalentScale();


getEnharmonicEquivalentScaleFilters.forEach(({ description: filterDescription, predicate }) => {
  describe(`getEnharmonicEquivalentScale for flat accidental: ${filterDescription}`, () => {
    getEnharmonicEquivalentScaleTestCases
      .filter(predicate)
      .forEach(({ description, scale, expectedFlatAccidental: expected }) => {
        it(`${description}: ${scale}`, () => {
          const enharmonicsSale = getBestEnharmonicEquivalentScale(scale as Note[], FLAT);
          expect(enharmonicsSale).toEqual(expected);
        });
      });
  });

  describe(`getEnharmonicEquivalentScale for sharp accidental: ${filterDescription}`, () => {
    getEnharmonicEquivalentScaleTestCases
      .filter(predicate)
      .forEach(({ description, scale, expectedSharpAccidental: expected }) => {
        it(`${description}: ${scale}`, () => {
          const enharmonicsSale = getBestEnharmonicEquivalentScale(scale as Note[], SHARP);
          expect(enharmonicsSale).toEqual(expected);
        });
      });
  });
});
