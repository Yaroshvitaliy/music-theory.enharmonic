import { AccidentalSymbol } from '../core/generic-types'
import { Note, NaturalNote, NATURAL_NOTES, OCTAVE_NOTES, SHARP, FLAT } from '../core';

function createAccidentalsArray<S extends AccidentalSymbol>(symbol: S, maxAccidentals: number): S[] {
  const accidentals: S[] = [];
  for (let i = 1; i <= maxAccidentals; i++) {
    accidentals.push(symbol.repeat(i) as S);
  }
  return accidentals;
}

export function getNaturalNote(
  note: Note,
  naturalNotes: NaturalNote[] = NATURAL_NOTES): NaturalNote {
  const naturalNote = note.replaceAll(SHARP, '').replaceAll(FLAT, '');
  if (!naturalNotes.includes(naturalNote as NaturalNote)) {
    throw new Error(`Note "${note}" is not valid.`);
  }
  return naturalNote as NaturalNote;
}

export function getEnharmonicEquivalences(
  note: Note,
  naturalNotes: NaturalNote[] = NATURAL_NOTES,
  octaveNotes: Note[] = OCTAVE_NOTES,
  maxAccidentals: number = octaveNotes.length
): Note[] {
  const baseIndex = octaveNotes.indexOf(note);

  if (baseIndex === -1) {
    throw new Error(`Note "${note}" is not valid.`);
  }

  if (maxAccidentals > octaveNotes.length) {
    throw new Error(`maxAccidentals cannot be greater than the length of octaveNotes.`);
  }

  const enharmonicEquivalences: Set<Note> = new Set();
  const sharpAccidentals = createAccidentalsArray(SHARP, maxAccidentals);
  const flatAccidentals = createAccidentalsArray(FLAT, maxAccidentals);

  naturalNotes.forEach(naturalNote => {
    if (naturalNote === note) {
      return;
    }

    const noteIndex = octaveNotes.indexOf(naturalNote);

    if (noteIndex === -1) {
      throw new Error(`Octave notes must include all natural notes.`);
    };

    sharpAccidentals.forEach(accidental => {
      const shift = accidental.length;
      const newIndex = (noteIndex + shift) % octaveNotes.length;
      const newNote = octaveNotes[newIndex];
      const equivalentNote = `${naturalNote}${accidental}` as Note;
      if (newNote === note && equivalentNote !== note) {
        enharmonicEquivalences.add(equivalentNote);
      }
    });

    flatAccidentals.forEach(accidental => {
      const shift = accidental.length;
      const newIndex = (noteIndex - shift + octaveNotes.length) % octaveNotes.length;
      const newNote = octaveNotes[newIndex];
      const equivalentNote = `${naturalNote}${accidental}` as Note;
      if (newNote === note && equivalentNote !== note) {
        enharmonicEquivalences.add(equivalentNote);
      }
    });
  });

  return Array.from(enharmonicEquivalences);
}

const findEquivalentNoteIndex = (equivalentNotes: Note[], accidentalsNumber: number, accidental: AccidentalSymbol) =>
  equivalentNotes.findIndex((n) => n.split(accidental).length - 1 === accidentalsNumber);

const getNumberOfAccidentalsForNote = (note: Note, accidental: AccidentalSymbol) =>
  (note.match(new RegExp(accidental, 'g')) || []).length;

const getNumberOfAccidentalsForScale = (scale: Note[], accidental: AccidentalSymbol) =>
  scale.reduce((sum, note) => {
    sum += getNumberOfAccidentalsForNote(note, accidental);
    return sum;
  }, 0);

const getNumberOfShifts = (scale: Note[], enharmonicScale: Note[]) =>
  scale.reduce((sum, note, index) => {
    const enharmonicScaleNote = enharmonicScale[index];
    if (note !== enharmonicScaleNote) {
      sum += 1;
    }
    return sum;
  }, 0);
  
function getOneAccidentalEquivalentOrSameNote(
  note: Note,
  accidental: AccidentalSymbol = FLAT,
  naturalNotes: NaturalNote[] = NATURAL_NOTES,
  octaveNotes: Note[] = OCTAVE_NOTES,
  maxAccidentals: number = octaveNotes.length
): Note {
  let flatEquivalentNote: Note;

  if (accidental === FLAT && note.includes(SHARP)) {
    const equivalentNotes = getEnharmonicEquivalences(note, naturalNotes, octaveNotes, maxAccidentals);
    const oneAccidentalNoteIndex = findEquivalentNoteIndex(equivalentNotes, 1, FLAT);
    flatEquivalentNote = oneAccidentalNoteIndex >= 0
      ? equivalentNotes[oneAccidentalNoteIndex]
      : note;
  } else {
    flatEquivalentNote = note;
  }

  return flatEquivalentNote;
}

function getShiftedNote(
  scale: Note[],
  currentNote: Note,
  prevNaturalNote: NaturalNote,
  accidental: AccidentalSymbol,
  isExceptionalShiftIndex: boolean,
  naturalNotes: NaturalNote[] = NATURAL_NOTES,
  octaveNotes: Note[] = OCTAVE_NOTES,
  maxAccidentals: number = octaveNotes.length,
) {
  const equivalentNotes = getEnharmonicEquivalences(currentNote, naturalNotes, octaveNotes, maxAccidentals);
  
  if (equivalentNotes.length === 0) {
    return currentNote;
  }

  const prevNaturalNoteIndex = naturalNotes.indexOf(prevNaturalNote);
  const shift = isExceptionalShiftIndex ? (naturalNotes.length - scale.length + 1) : 1;
  const nextNaturalNote = naturalNotes[(prevNaturalNoteIndex + shift) % naturalNotes.length];
  // const equivalentNoteIndex = equivalentNotes.findIndex((n) => n.startsWith(nextNaturalNote));
  let equivalentNoteIndex = equivalentNotes.findIndex((n) => n.startsWith(nextNaturalNote) && n.includes(accidental));
  if (equivalentNoteIndex < 0) {
    // equivalentNoteIndex = equivalentNotes.findIndex((n) => n.startsWith(nextNaturalNote));
  }
  const nextNote = equivalentNoteIndex >= 0 ? equivalentNotes[equivalentNoteIndex] : currentNote; 
  return nextNote;
}

function getEnharmonicEquivalentScale(
  scale: Note[],
  exceptionalShiftIndex: number | null = null,
  accidental: AccidentalSymbol = FLAT,
  naturalNotes: NaturalNote[] = NATURAL_NOTES,
  octaveNotes: Note[] = OCTAVE_NOTES,
  maxAccidentals: number = octaveNotes.length,
): Note[] {

  const isPentatonic = scale.length === naturalNotes.length - 2;

  const enharmonicScale = scale.reduce((resultScale, currentNote, currentIndex) => {
    if (currentIndex === 0) {
      const oneFlatEquivalentOrSameNote = getOneAccidentalEquivalentOrSameNote(currentNote, accidental, naturalNotes, octaveNotes, maxAccidentals);
      resultScale.push(oneFlatEquivalentOrSameNote);
    } else {
      const currentNaturalNote = getNaturalNote(currentNote, naturalNotes);
      const prevNote = resultScale[resultScale.length - 1];
      const prevNaturalNote = getNaturalNote(prevNote, naturalNotes);

      if (isPentatonic && currentNaturalNote !== prevNaturalNote) {
        const oneFlatEquivalentOrSameNote = getOneAccidentalEquivalentOrSameNote(currentNote, accidental, naturalNotes, octaveNotes, maxAccidentals);
        resultScale.push(oneFlatEquivalentOrSameNote);
      } else {
        const isExceptionalShiftIndex = exceptionalShiftIndex === currentIndex;
        const nextNote = getShiftedNote(scale, currentNote, prevNaturalNote, accidental, isExceptionalShiftIndex, naturalNotes, octaveNotes, maxAccidentals);
        resultScale.push(nextNote);
      }
    }
    return resultScale;
  }, [] as Note[]);

  return enharmonicScale;
}

export function getEnharmonicEquivalentScales(
  scale: Note[],
  accidental: AccidentalSymbol = FLAT,
  naturalNotes: NaturalNote[] = NATURAL_NOTES,
  octaveNotes: Note[] = OCTAVE_NOTES,
  maxAccidentals: number = octaveNotes.length
): Note[][] {
  if (scale.length < naturalNotes.length - 2 || scale.length > naturalNotes.length + 1) {
    return [scale.slice()];
  }

  if (scale.length === naturalNotes.length - 2 || scale.length === naturalNotes.length) {
    return [getEnharmonicEquivalentScale(scale, null, accidental, naturalNotes, octaveNotes, maxAccidentals)];
  }

  const enharmonicsSales: Note[][] = [];
  for (let i = 0; i < scale.length; i++) {
    const enharmonicsSale = getEnharmonicEquivalentScale(scale, i, accidental, naturalNotes, octaveNotes, maxAccidentals);
    enharmonicsSales.push(enharmonicsSale);
  }

  return enharmonicsSales;
}

export function sortEnharmonicEquivalentScales(
  scale: Note[],
  enharmonicsSales: Note[][],
  accidental: AccidentalSymbol = FLAT,
): Note[][] {
  const oppositeAccidental = accidental === FLAT ? SHARP : FLAT;

  const sortedSnharmonicsSales = enharmonicsSales
    .map((enharmonicScale) => {
      const accidentals = getNumberOfAccidentalsForScale(enharmonicScale, accidental);
      const oppositeAccidentals = getNumberOfAccidentalsForScale(enharmonicScale, oppositeAccidental);
      const allAccidentals = accidentals + oppositeAccidentals;
      const containsAccidentals = accidentals > 0 ? 1 : 0;
      const containsOppositAccidentals = oppositeAccidentals > 0 ? 1 : 0;
      const differentAccidentals = containsAccidentals + containsOppositAccidentals;
      const shifts = getNumberOfShifts(scale, enharmonicScale);
      const weight = 
        1000 * differentAccidentals +
        100 * oppositeAccidentals +
        10 * allAccidentals +
        1 * shifts;

      return {
        scale: enharmonicScale,
        weight
      }
    })
    .sort((a, b) => a.weight - b.weight)
    .map(({ scale }) => scale);


  return sortedSnharmonicsSales;
}
