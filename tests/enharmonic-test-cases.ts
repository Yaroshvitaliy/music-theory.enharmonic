import { NATURAL_NOTES, SHARP, FLAT, Note, NaturalNote } from '../src/core';

const createAccidentalNotes = (note: NaturalNote, maxAccidentals: number): Note[] => {
    const notesWithAccidentals: Note[] = [];

    for (let i = 1; i <= maxAccidentals; i++) {
        notesWithAccidentals.push((note + SHARP.repeat(i)) as Note);
        notesWithAccidentals.push((note + FLAT.repeat(i)) as Note);
    }

    return notesWithAccidentals;
};

export const getNaturalNoteTestCases = NATURAL_NOTES.flatMap(naturalNote => {
    const accidentalNotes = createAccidentalNotes(naturalNote, 12);
    return [
        { note: naturalNote, expected: naturalNote },
        ...accidentalNotes.map(accidentalNote => ({ note: accidentalNote, expected: naturalNote }))
    ];
});

export const invalidNotes = [
    'H',
    'C@',
];

export const getEnharmonicEquivalencesTestCases = [
    { note: 'C', expected: ['Dbb', 'Ebbbb', 'A###', 'B#'] },
    { note: 'C#', expected: ['Db', 'Ebbb', 'Fbbbb', 'A####', 'B##'] },
    { note: 'D', expected: ['C##', 'Ebb', 'Fbbb', 'B###'] },
    { note: 'D#', expected: ['C###', 'Eb', 'Fbb', 'Gbbbb', 'B####'] },
    { note: 'E', expected: ['C####', 'D##', 'Fb', 'Gbbb'] },
    { note: 'F', expected: ['D###', 'E#', 'Gbb', 'Abbbb'] },
    { note: 'F#', expected: ['D####', 'E##', 'Gb', 'Abbb'] },
    { note: 'G', expected: ['E###', 'F##', 'Abb', 'Bbbbb'] },
    { note: 'G#', expected: ['Cbbbb', 'E####', 'F###', 'Ab', 'Bbbb'] },
    { note: 'A', expected: ['Cbbb', 'F####', 'G##', 'Bbb'] },
    { note: 'A#', expected: ['Cbb', 'Dbbbb', 'G###', 'Bb'] },
    { note: 'B', expected: ['Cb', 'Dbbb', 'G####', 'A##'] },
];

export const getEnharmonicEquivalentScaleTestCases = [
    // should return the same scale when the input scale has less then 5 notes
    {
        description: 'should return an empty array when the input scale is empty',
        scale: [],
        expectedFlatAccidental: [],
        expectedSharpAccidental: [],
    },
    {
        description: 'should return the same single note when the input scale has 1 note',
        scale: ['C#'],
        expectedFlatAccidental: ['C#'],
        expectedSharpAccidental: ['C#'],
    },
    {
        description: 'should return the same scale when the input scale has 2 notes',
        scale: ['C#', 'D#'],
        expectedFlatAccidental: ['C#', 'D#'],
        expectedSharpAccidental: ['C#', 'D#'],
    },
    {
        description: 'should return the same scale when the input scale has 3 notes',
        scale: ['C#', 'D#', 'F#'],
        expectedFlatAccidental: ['C#', 'D#', 'F#'],
        expectedSharpAccidental: ['C#', 'D#', 'F#'],
    },
    {
        description: 'should return the same scale when the input scale has 4 notes',
        scale: ['C#', 'D#', 'F#', 'G#'],
        expectedFlatAccidental: ['C#', 'D#', 'F#', 'G#'],
        expectedSharpAccidental: ['C#', 'D#', 'F#', 'G#'],
    },

    // should handle a Pentatonic scale in key of C
    {
        description: `should handle a Pentatonic C Ionian scale for W-3WW-3 pattern`,
        scale: ['C', 'D', 'F', 'G', 'A'],
        expectedFlatAccidental: ['C', 'D', 'F', 'G', 'A'],
        expectedSharpAccidental: ['C', 'D', 'F', 'G', 'A'],
    },
    {
        description: `should handle a Pentatonic C Dorian scale for -3WW-3W pattern`,
        scale: ['C', 'D#', 'F', 'G', 'A#'],
        expectedFlatAccidental: ['C', 'Eb', 'F', 'G', 'Bb'],
        expectedSharpAccidental: ['C', 'D#', 'F', 'G', 'A#'],
    },
    {
        description: `should handle a Pentatonic C Phrygian scale for WW-3W-3 pattern`,
        scale: ['C', 'D', 'E', 'G', 'A'],
        expectedFlatAccidental: ['C', 'D', 'E', 'G', 'A'],
        expectedSharpAccidental: ['C', 'D', 'E', 'G', 'A'],
    },
    {
        description: `should handle a Pentatonic C Mixolydian scale for W-3W-3W pattern`,
        scale: ['C', 'D', 'F', 'G', 'A#'],
        expectedFlatAccidental: ['C', 'D', 'F', 'G', 'Bb'],
        expectedSharpAccidental: ['C', 'D', 'F', 'G', 'A#'],
    },
    {
        description: `should handle a Pentatonic C Aeolian scale for -3W-3WW pattern`,
        scale: ['C', 'D#', 'F', 'G#', 'A#'],
        expectedFlatAccidental: ['C', 'Eb', 'F', 'Ab', 'Bb'],
        expectedSharpAccidental: ['C', 'D#', 'F', 'G#', 'A#'],
    },

    // should handle a Pentatonic scale in key of C#
    {
        description: `should handle a Pentatonic C# Ionian scale for W-3WW-3 pattern`,
        scale: ['C#', 'D#', 'F#', 'G#', 'A#'],
        expectedFlatAccidental: ['Db', 'Eb', 'Gb', 'Ab', 'Bb'],
        expectedSharpAccidental: ['C#', 'D#', 'F#', 'G#', 'A#'],
    },
    {
        description: `should handle a Pentatonic C# Dorian scale for -3WW-3W pattern`,
        scale: ['C#', 'E', 'F#', 'G#', 'B'],
        expectedFlatAccidental: ['Db', 'E', 'Gb', 'Ab', 'B'],
        expectedSharpAccidental: ['C#', 'E', 'F#', 'G#', 'B'],
    },
    {
        description: `should handle a Pentatonic C# Phrygian scale for WW-3W-3 pattern`,
        scale: ['C#', 'D#', 'F', 'G#', 'A#'],
        expectedFlatAccidental: ['Db', 'Eb', 'F', 'Ab', 'Bb'],
        expectedSharpAccidental: ['C#', 'D#', 'F', 'G#', 'A#'],
    },
    {
        description: `should handle a Pentatonic C# Mixolydian scale for W-3W-3W pattern`,
        scale: ['C#', 'D#', 'F#', 'G#', 'B'],
        expectedFlatAccidental: ['Db', 'Eb', 'Gb', 'Ab', 'B'],
        expectedSharpAccidental: ['C#', 'D#', 'F#', 'G#', 'B'],
    },
    {
        description: `should handle a Pentatonic C# Aeolian scale for -3W-3WW pattern`,
        scale: ['C#', 'E', 'F#', 'A', 'B'],
        expectedFlatAccidental: ['Db', 'E', 'Gb', 'A', 'B'],
        expectedSharpAccidental: ['C#', 'E', 'F#', 'A', 'B'],
    },

    // should handle a Pentatonic Harmonic major scale in key of C
    {
        description: `should handle a Pentatonic C Harmonic major scale for -3H-3W-3 pattern`,
        scale: ['C', 'D#', 'E', 'G', 'A'],
        expectedFlatAccidental: ['C', 'Eb', 'Fb', 'G', 'A'],
        expectedSharpAccidental: ['C', 'D#', 'E', 'G', 'A'],
    },
    {
        description: `should handle a Pentatonic C Harmonic major step II scale for H-3W-3-3 pattern`,
        scale: ['C', 'C#', 'E', 'F#', 'A'],
        expectedFlatAccidental: ['C', 'Db', 'E', 'Gb', 'A'],
        expectedSharpAccidental: ['C', 'C#', 'E', 'F#', 'A'],
    },
    {
        description: `should handle a Pentatonic C Harmonic major step III scale  for -3W-3-3H pattern`,
        scale: ['C', 'D#', 'F', 'G#', 'B'],
        expectedFlatAccidental: ['C', 'Eb', 'F', 'Ab', 'B'],
        expectedSharpAccidental: ['C', 'D#', 'F', 'G#', 'B'],
    },
    {
        description: `should handle a Pentatonic C Harmonic major step IV scale  for W-3-3H-3 pattern`,
        scale: ['C', 'D', 'F', 'G#', 'A'],
        expectedFlatAccidental: ['C', 'D', 'F', 'Ab', 'Bbb'],
        expectedSharpAccidental: ['C', 'D', 'F', 'G#', 'A'],
    },
    {
        description: `should handle a Pentatonic C Harmonic major step V scale  for -3-3H-3W pattern`,
        scale: ['C', 'D#', 'F#', 'G', 'A#'],
        expectedFlatAccidental: ['C', 'Eb', 'Gb', 'Abb', 'Bb'],
        expectedSharpAccidental: ['C', 'D#', 'F#', 'G', 'A#'],
    },

    // should handle a scale with 6 notes in key of C
    {
        description: `should handle a Blues C scale for W-HH-3W-3 pattern`,
        scale: ['C', 'D', 'D#', 'E', 'G', 'A'],
        expectedFlatAccidental: ['C', 'D', 'Eb', 'Fb', 'G', 'A'],
        expectedSharpAccidental: ['C', 'D', 'D#', 'E', 'G', 'A'],
    },
    {
        description: `should handle a Blues C step II scale for HH-3W-3W pattern`,
        scale: ['C', 'C#', 'D', 'F', 'G', 'A#'],
        expectedFlatAccidental: ['C', 'Db', 'Ebb', 'F', 'G', 'Bb'],
        expectedSharpAccidental: ['C', 'C#', 'D', 'F', 'G', 'A#'],
    },
    {
        description: `should handle a Blues C step III scale for H-3W-3WH pattern`,
        scale: ['C', 'C#', 'E', 'F#', 'A', 'B'],
        expectedFlatAccidental: ['C', 'Db', 'E', 'Gb', 'A', 'B'],
        expectedSharpAccidental: ['C', 'C#', 'E', 'F#', 'A', 'B'],
    },
    {
        description: `should handle a Blues C step IV scale for -3W-3WHH pattern`,
        scale: ['C', 'D#', 'F', 'G#', 'A#', 'B'],
        expectedFlatAccidental: ['C', 'D#', 'F', 'G#', 'A#', 'B'],
        expectedSharpAccidental: ['C', 'D#', 'F', 'G#', 'A#', 'B'],
    },
    {
        description: `should handle a Blues C step V scale for W-3WHH-3 pattern`,
        scale: ['C', 'D', 'F', 'G', 'G#', 'A'],
        expectedFlatAccidental: ['C', 'D', 'F', 'G', 'Ab', 'Bbb'],
        expectedSharpAccidental: ['C', 'D', 'F', 'G', 'G#', 'A'],
    },
    {
        description: `should handle a Blues C step VI scale for -3WHH-3W pattern`,
        scale: ['C', 'D#', 'F', 'F#', 'G', 'A#'],
        expectedFlatAccidental: ['C', 'Eb', 'F', 'Gb', 'Abb', 'Bb'],
        expectedSharpAccidental: ['C', 'D#', 'F', 'F#', 'G', 'A#'],
    },

    // should handle a scale with 6 notes in key of C#
    {
        description: `should handle a Blues C# scale for W-HH-3W-3 pattern`,
        scale: ['C#', 'D#', 'E', 'F', 'G#', 'A#'],
        expectedFlatAccidental: ['Db', 'Eb', 'Fb', 'Gbb', 'Ab', 'Bb'],
        expectedSharpAccidental: ['C#', 'D#', 'E', 'F', 'G#', 'A#'],
    },
    {
        description: `should handle a Blues C# step II scale for HH-3W-3W pattern`,
        scale: ['C#', 'D', 'D#', 'F#', 'G#', 'B'],
        expectedFlatAccidental: ['Db', 'Ebb', 'Fbb', 'Gb', 'Ab', 'B'],
        expectedSharpAccidental: ['C#', 'D', 'D#', 'F#', 'G#', 'B'],
    },
    {
        description: `should handle a Blues C# step III scale for H-3W-3WH pattern`,
        scale: ['C#', 'D', 'F', 'G', 'A#', 'C'],
        expectedFlatAccidental: ['Db', 'Ebb', 'F', 'G', 'Bb', 'C'],
        expectedSharpAccidental: ['C#', 'D', 'F', 'G', 'A#', 'C'],
    },
    {
        description: `should handle a Blues C# step IV scale for -3W-3WHH pattern`,
        scale: ['C#', 'E', 'F#', 'A', 'B', 'C'],
        expectedFlatAccidental: ['Db', 'E', 'Gb', 'A', 'B', 'C'],
        expectedSharpAccidental: ['C#', 'E', 'F#', 'A', 'B', 'C'],
    },
    {
        description: `should handle a Blues C# step V scale for W-3WHH-3 pattern`,
        scale: ['C#', 'D#', 'F#', 'G#', 'A', 'A#'],
        expectedFlatAccidental: ['Db', 'Eb', 'Gb', 'Ab', 'Bbb', 'Cbb'],
        expectedSharpAccidental: ['C#', 'D#', 'F#', 'G#', 'A', 'A#'],
    },
    {
        description: `should handle a Blues C# step VI scale for -3WHH-3W pattern`,
        scale: ['C#', 'E', 'F#', 'G', 'G#', 'B'],
        expectedFlatAccidental: ['Db', 'E', 'Gb', 'Abb', 'Bbbb', 'Cb'], 
        expectedSharpAccidental: ['C#', 'E', 'F#', 'G', 'G#', 'B'],
    },

    // should handle a diatonic scale in key of C
    {
        description: `should handle a Diatonic C Ionian scale for WWHWWWH pattern`,
        scale: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
        expectedFlatAccidental: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
        expectedSharpAccidental: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
    },
    {
        description: `should handle a Diatonic C Dorian scale for WHWWWHW pattern`,
        scale: ['C', 'D', 'D#', 'F', 'G', 'A', 'A#'],
        expectedFlatAccidental: ['C', 'D', 'Eb', 'F', 'G', 'A', 'Bb'],
        expectedSharpAccidental: ['B#', 'C##', 'D#', 'E#', 'F##', 'G##', 'A#'],
    },
    {
        description: `should handle a Diatonic C Phrygian scale for HWWWHWW pattern`,
        scale: ['C', 'C#', 'D#', 'F', 'G', 'G#', 'A#'],
        expectedFlatAccidental: ['C', 'Db', 'Eb', 'F', 'G', 'Ab', 'Bb'],
        expectedSharpAccidental: ['C', 'C#', 'D#', 'F', 'G', 'G#', 'A#'],
    },
    {
        description: `should handle a Diatonic C Lydian scale for WWWHWWH pattern`,
        scale: ['C', 'D', 'E', 'F#', 'G', 'A', 'B'],
        expectedFlatAccidental: ['C', 'D', 'E', 'F#', 'G', 'A', 'B'],
        expectedSharpAccidental: ['C', 'D', 'E', 'F#', 'G', 'A', 'B'],
    },
    {
        description: `should handle a Diatonic C Mixolydian scale for WWHWWHW pattern`,
        scale: ['C', 'D', 'E', 'F', 'G', 'A', 'A#'],
        expectedFlatAccidental: ['C', 'D', 'E', 'F', 'G', 'A', 'Bb'],
        expectedSharpAccidental: ['C', 'D', 'E', 'F', 'G', 'A', 'A#'],
    },
    {
        description: `should handle a Diatonic C Aeolian scale for WHWWHWW pattern`,
        scale: ['C', 'D', 'D#', 'F', 'G', 'G#', 'A#'],
        expectedFlatAccidental: ['C', 'D', 'Eb', 'F', 'G', 'Ab', 'Bb'],
        expectedSharpAccidental: ['C', 'D', 'D#', 'F', 'G', 'G#', 'A#'],
    },
    {
        description: `should handle a Diatonic C Locrian scale for HWWHWWW pattern`,
        scale: ['C', 'C#', 'D#', 'F', 'F#', 'G#', 'A#'],
        expectedFlatAccidental: ['C', 'Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb'],
        expectedSharpAccidental: ['C', 'C#', 'D#', 'F', 'F#', 'G#', 'A#'],
    },

    // should handle a diatonic scale in key of C#
    {
        description: `should handle a Diatonic C# Ionian scale for WWHWWWH pattern`,
        scale: ['C#', 'D#', 'F', 'F#', 'G#', 'A#', 'C'],
        expectedFlatAccidental: ['Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C'],
        expectedSharpAccidental: ['C#', 'D#', 'E#', 'F#', 'G#', 'A#', 'B#'],
    },
    {
        description: `should handle a Diatonic C# Dorian scale for WHWWWHW pattern`,
        scale: ['C#', 'D#', 'E', 'F#', 'G#', 'A#', 'B'],
        expectedFlatAccidental: ['Db', 'Eb', 'Fb', 'Gb', 'Ab', 'Bb', 'Cb'],
        expectedSharpAccidental: ['C#', 'D#', 'E', 'F#', 'G#', 'A#', 'B'],
    },
    {
        description: `should handle a Diatonic C# Phrygian scale for HWWWHWW pattern`,
        scale: ['C#', 'D', 'E', 'F#', 'G#', 'A', 'B'],
        expectedFlatAccidental: ['Db', 'Ebb', 'Fb', 'Gb', 'Ab', 'Bbb', 'Cb'],
        expectedSharpAccidental: ['C#', 'D', 'E', 'F#', 'G#', 'A', 'B'],
    },
    {
        description: `should handle a Diatonic C# Lydian scale for WWWHWWH pattern`,
        scale: ['C#', 'D#', 'F', 'G', 'G#', 'A#', 'C'],
        expectedFlatAccidental: ['Db', 'Eb', 'F', 'G', 'Ab', 'Bb', 'C'],
        expectedSharpAccidental: ['C#', 'D#', 'F', 'G', 'G#', 'A#', 'B#'],
    },
    {
        description: `should handle a Diatonic C# Mixolydian scale for WWHWWHW pattern`,
        scale: ['C#', 'D#', 'F', 'F#', 'G#', 'A#', 'B'],
        expectedFlatAccidental: ['Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'Cb'],
        expectedSharpAccidental: ['C#', 'D#', 'F', 'F#', 'G#', 'A#', 'B'],
    },
    {
        description: `should handle a Diatonic C# Aeolian scale for WHWWHWW pattern`,
        scale: ['C#', 'D#', 'E', 'F#', 'G#', 'A', 'B'],
        expectedFlatAccidental: ['Db', 'Eb', 'Fb', 'Gb', 'Ab', 'Bbb', 'Cb'],
        expectedSharpAccidental: ['C#', 'D#', 'E', 'F#', 'G#', 'A', 'B'],
    },
    {
        description: `should handle a Diatonic C# Locrian scale for HWWHWWW pattern`,
        scale: ['C#', 'D', 'E', 'F#', 'G', 'A', 'B'],
        expectedFlatAccidental: ['Db', 'Ebb', 'Fb', 'Gb', 'Abb', 'Bbb', 'Cb'],
        expectedSharpAccidental: ['C#', 'D', 'E', 'F#', 'G', 'A', 'B'],
    },

    // should handle a scale with 8 notes in key of C
    {
        description: `should handle a Diminished C scale for WHWHWHWH pattern`,
        scale: ['C', 'D', 'D#', 'F', 'F#', 'G#', 'A', 'B'],
        expectedFlatAccidental: ['C', 'D', 'Eb', 'F', 'Gb', 'Ab', 'A', 'B'],
        expectedSharpAccidental: ['C', 'D', 'D#', 'F', 'F#', 'G#', 'A', 'B'],
    },
    {
        description: `should handle a Diminished C II scale for HWHWHWHW pattern`,
        scale: ['C', 'C#', 'D#', 'E', 'F#', 'G', 'A', 'A#'],
        //  expectedFlatAccidental: ['C', 'Db', 'Eb', 'E', 'F#', 'G', 'A', 'Bb'],
        expectedFlatAccidental: ['C', 'Db', 'Eb', 'Fb', 'Gb', 'G', 'A', 'Bb'],
        expectedSharpAccidental: ['C', 'C#', 'D#', 'E', 'F#', 'G', 'A', 'A#'],
    },

    // should return the same scale when the input scale has 9 notes
    {
        description: 'should return the same scale when the input scale has 13 notes',
        scale: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'],
        expectedFlatAccidental: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'],
        expectedSharpAccidental: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'],
    },
];
