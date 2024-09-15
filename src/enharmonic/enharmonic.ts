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

// export function generateEnharmonicEquivalences2(
//   note: Note,
//   naturalNotes: NaturalNote[] = NATURAL_NOTES,
//   octaveNotes: Note[] = OCTAVE_NOTES,
//   maxAccidentals: number = octaveNotes.length
// ): Note[] {
//   const baseIndex = octaveNotes.indexOf(note);

//   if (baseIndex === -1) {
//     throw new Error(`Note "${note}" is not valid.`);
//   }

//   if (maxAccidentals > octaveNotes.length) {
//     throw new Error(`maxAccidentals cannot be greater than the length of octaveNotes.`);
//   }

//   const enharmonicEquivalences: Set<Note> = new Set();

//   for (let i = 1; i <= maxAccidentals; i++) {
//     const sharpAccidental = SHARP.repeat(i);
//     const flatAccidental = FLAT.repeat(i);

//     for (const naturalNote of naturalNotes) {
//       if (naturalNote === note) continue;

//       const noteIndex = octaveNotes.indexOf(naturalNote);
//       if (noteIndex === -1) continue;

//       // Process sharp accidentals
//       const sharpNewIndex = (noteIndex + i) % octaveNotes.length;
//       const sharpNewNote = octaveNotes[sharpNewIndex];
//       const sharpEquivalentNote = `${naturalNote}${sharpAccidental}` as Note;
//       if (sharpNewNote === note && sharpEquivalentNote !== note) {
//         enharmonicEquivalences.add(sharpEquivalentNote);
//       }

//       // Process flat accidentals
//       const flatNewIndex = (noteIndex - i + octaveNotes.length) % octaveNotes.length;
//       const flatNewNote = octaveNotes[flatNewIndex];
//       const flatEquivalentNote = `${naturalNote}${flatAccidental}` as Note;
//       if (flatNewNote === note && flatEquivalentNote !== note) {
//         enharmonicEquivalences.add(flatEquivalentNote);
//       }
//     }
//   }

//   return Array.from(enharmonicEquivalences);
// }

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
  
function getOneFlatEquivalentNote(
  note: Note,
  naturalNotes: NaturalNote[] = NATURAL_NOTES,
  octaveNotes: Note[] = OCTAVE_NOTES,
  maxAccidentals: number = octaveNotes.length
): Note {
  let flatEquivalentNote: Note;

  if (note.includes(SHARP)) {
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

function getNextNote() {

}

function getEnharmonicEquivalentScale(
  scale: Note[],
  exceptionalShiftIndex: number | null = null,
  accidental: AccidentalSymbol = FLAT,
  naturalNotes: NaturalNote[] = NATURAL_NOTES,
  octaveNotes: Note[] = OCTAVE_NOTES,
  maxAccidentals: number = octaveNotes.length
): Note[] {

  const enharmonicScale = scale.reduce((resultScale, currentNote, currentIndex) => {
    if (currentIndex === 0) {
      const oneFlatEquivalentNote = getOneFlatEquivalentNote(currentNote, naturalNotes, octaveNotes, maxAccidentals);
      resultScale.push(oneFlatEquivalentNote);
    } else if (scale.length === naturalNotes.length - 2) {
      // TODO: extract function
      const equivalentNotes = getEnharmonicEquivalences(currentNote, naturalNotes, octaveNotes, maxAccidentals);
      const currentNaturalNote = getNaturalNote(currentNote, naturalNotes);
      const prevNote = resultScale[resultScale.length - 1];
      const prevNaturalNote = getNaturalNote(prevNote, naturalNotes);

      if (currentNaturalNote === prevNaturalNote) {
        const prevNaturalNoteIndex = naturalNotes.indexOf(prevNaturalNote);
        const shift = (exceptionalShiftIndex === currentIndex) ? (naturalNotes.length - scale.length + 1) : 1;
        const nextNaturalNote = naturalNotes[(prevNaturalNoteIndex + shift) % naturalNotes.length];
        const equivalentNoteIndex = equivalentNotes.findIndex((en) => en.startsWith(nextNaturalNote));

        if (equivalentNoteIndex >= 0) {
          resultScale.push(equivalentNotes[equivalentNoteIndex]);
        } else {
          resultScale.push(currentNote);
        }
      } else {
        const oneFlatEquivalentNote = getOneFlatEquivalentNote(currentNote, naturalNotes, octaveNotes, maxAccidentals);
        resultScale.push(oneFlatEquivalentNote);
      }
    } else {
      const equivalentNotes = getEnharmonicEquivalences(currentNote, naturalNotes, octaveNotes, maxAccidentals);
      if (equivalentNotes.length > 0) {
        const prevNote = resultScale[resultScale.length - 1];
        const prevNaturalNote = getNaturalNote(prevNote, naturalNotes);
        const prevNaturalNoteIndex = naturalNotes.indexOf(prevNaturalNote);
        const shift = (exceptionalShiftIndex === currentIndex) ? (naturalNotes.length - scale.length + 1) : 1;
        const nextNaturalNote = naturalNotes[(prevNaturalNoteIndex + shift) % naturalNotes.length];
        const equivalentNoteIndex = equivalentNotes.findIndex((en) => en.startsWith(nextNaturalNote));

        if (equivalentNoteIndex >= 0) {
          resultScale.push(equivalentNotes[equivalentNoteIndex]);
        } else {
          resultScale.push(currentNote);
        }
      } else {
        resultScale.push(currentNote);
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
