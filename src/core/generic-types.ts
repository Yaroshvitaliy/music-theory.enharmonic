export type AccidentalSymbol = string;
export type NoteName = string;

// Define the generic type for accidentals
export type GenericAccidentals<S extends AccidentalSymbol> =
    S | // Single accidental (e.g., "#", "b")
    `${S}${S}` | // Double accidentals (e.g., "##", "bb")
    `${S}${S}${S}` | // Triple accidentals (e.g., "###", "bbb")
    `${S}${S}${S}${S}` | // Quadruple accidentals (e.g., "####", "bbbb")
    `${S}${S}${S}${S}${S}` | // 5 accidentals
    `${S}${S}${S}${S}${S}${S}` | // 6 accidentals
    `${S}${S}${S}${S}${S}${S}${S}` | // 7 accidentals
    `${S}${S}${S}${S}${S}${S}${S}${S}` | // 8 accidentals
    `${S}${S}${S}${S}${S}${S}${S}${S}${S}` | // 9 accidentals
    `${S}${S}${S}${S}${S}${S}${S}${S}${S}${S}` | // 10 accidentals
    `${S}${S}${S}${S}${S}${S}${S}${S}${S}${S}${S}` | // 11 accidentals
    `${S}${S}${S}${S}${S}${S}${S}${S}${S}${S}${S}${S}`; // 12 accidentals

// Define the generic BaseGenericNote type
export type BaseGenericNote<NoteNameType extends NoteName> = NoteNameType;

// Define the GenericNote type with more meaningful parameters
export type GenericNote<
  NoteNameType extends NoteName,
  SharpSymbol extends AccidentalSymbol,
  FlatSymbol extends AccidentalSymbol
> =
  | NoteNameType
  | `${NoteNameType}${GenericAccidentals<SharpSymbol>}`
  | `${NoteNameType}${GenericAccidentals<FlatSymbol>}`;

// Define a type for octave numbers
export type OctaveNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

// Define octave notes with optional octave number
export type GenericOctaveNote<
  NoteNameType extends NoteName,
  SharpSymbol extends AccidentalSymbol,
  FlatSymbol extends AccidentalSymbol
> =
  `${GenericNote<NoteNameType, SharpSymbol, FlatSymbol>}${OctaveNumber | ''}`;
