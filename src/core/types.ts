import { GenericAccidentals, BaseGenericNote, GenericNote, GenericOctaveNote } from '../core/generic-types';

// Define individual types for each natural note using BaseGenericNote
export type CNote = BaseGenericNote<'C'>;
export type DNote = BaseGenericNote<'D'>;
export type ENote = BaseGenericNote<'E'>;
export type FNote = BaseGenericNote<'F'>;
export type GNote = BaseGenericNote<'G'>;
export type ANote = BaseGenericNote<'A'>;
export type BNote = BaseGenericNote<'B'>;

// Combine them into a single NaturalNote type
export type NaturalNote = CNote | DNote | ENote | FNote | GNote | ANote | BNote;

// Define specific types for sharp and flat symbols
export type Sharp = '#';
export type Flat = 'b';

// Use the GenericAccidentals type to define SharpAccidentals and FlatAccidentals
export type SharpAccidentals = GenericAccidentals<Sharp>;
export type FlatAccidentals = GenericAccidentals<Flat>;
export type Accidentals = SharpAccidentals | FlatAccidentals;

// Define a type that represents any note using specific sharps and flats
export type Note = GenericNote<NaturalNote, Sharp, Flat>; // Represents all possible notes
export type OctaveNote = GenericOctaveNote<NaturalNote, Sharp, Flat>; // Represents all possible octave notes
