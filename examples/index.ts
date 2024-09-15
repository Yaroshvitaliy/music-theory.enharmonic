import { Note, NaturalNote, NATURAL_NOTES, OCTAVE_NOTES } from '../src/core';
import { getEnharmonicEquivalences } from '../src/enharmonic';

// Benchmark function
function generateEnharmonicEquivalencesBenchmark(fn: Function, note: Note, naturalNotes: NaturalNote[], octaveNotes: Note[], maxAccidentals: number): void {
    console.time('Benchmark');
    fn(note, naturalNotes, octaveNotes, maxAccidentals);
    console.timeEnd('Benchmark');
  }


const note = 'C#';
const enharmonicNotes = getEnharmonicEquivalences(note, NATURAL_NOTES, OCTAVE_NOTES, 12);

console.log(`Enharmonic equivalences for ${note}:`);
console.log(enharmonicNotes);

// Run benchmarks

console.log('Testing getEnharmonicEquivalences:');
generateEnharmonicEquivalencesBenchmark(getEnharmonicEquivalences, note, NATURAL_NOTES, OCTAVE_NOTES, 12);
