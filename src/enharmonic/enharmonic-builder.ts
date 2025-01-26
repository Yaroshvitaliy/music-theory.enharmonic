import { Note, NaturalNote, NATURAL_NOTES, OCTAVE_NOTES, AccidentalSymbol, SHARP, FLAT } from '../core';
import { getEnharmonicEquivalentScales, sortEnharmonicEquivalentScales } from '.';

/**
 * Builder class for creating enharmonic equivalent scales.
 */
export class EnharmonicScaleBuilder {
    static readonly DEFAULT_SORT_OPTIONS = {};

    private scale: Note[] = [];
    private accidental: AccidentalSymbol = FLAT;
    private naturalNotes: NaturalNote[] = NATURAL_NOTES;
    private octaveNotes: Note[] = OCTAVE_NOTES;
    private accidentalsNumber: number = OCTAVE_NOTES.length;
    private sortOptions: any = null;
    private enharmonicScales: Note[][] | null = null;

    /**
     * Creates an instance of the EnharmonicScaleBuilder.
     * @returns {EnharmonicScaleBuilder} A new instance of the builder.
     */
    static create(): EnharmonicScaleBuilder {
        return new EnharmonicScaleBuilder();
    }

    /**
     * Provides the default sorting options for the enharmonic scales.
     * @returns {object} An empty object representing default sorting options.
     */
    static get DefaultSortOptions(): object {
        return this.DEFAULT_SORT_OPTIONS;
    }

    /**
     * Validates if the builder is still mutable.
     * @throws {Error} If the result has already been computed.
     */
    private validateMutability(): void {
        if (this.enharmonicScales !== null) {
            throw new Error('Cannot modify builder after result has been computed.');
        }
    }

    /**
     * Sets the scale.
     * @param {Note[]} scale - The scale to be used.
     * @returns {EnharmonicScaleBuilder} The builder instance for chaining.
     * @throws {Error} If the result has already been computed.
     */
    withScale(scale: Note[]): EnharmonicScaleBuilder {
        this.validateMutability();
        this.scale = scale;
        return this;
    }

    /**
     * Sets the accidental symbol.
     * @param {AccidentalSymbol} accidental - The accidental (e.g., sharp, flat).
     * @returns {EnharmonicScaleBuilder} The builder instance for chaining.
     * @throws {Error} If the result has already been computed.
     */
    withAccidental(accidental: AccidentalSymbol): EnharmonicScaleBuilder {
        this.validateMutability();
        this.accidental = accidental;
        return this;
    }

    /**
     * Sets the accidental symbol to flat ('b').
     * @returns {EnharmonicScaleBuilder} The builder instance for chaining.
     * @throws {Error} If the result has already been computed.
     */
    withFlatAccidental(): EnharmonicScaleBuilder {
        this.validateMutability();
        this.accidental = FLAT;
        return this;
    }

    /**
     * Sets the accidental symbol to sharp ('#').
     * @returns {EnharmonicScaleBuilder} The builder instance for chaining.
     * @throws {Error} If the result has already been computed.
     */
    withSharpAccidental(): EnharmonicScaleBuilder {
        this.validateMutability();
        this.accidental = SHARP;
        return this;
    }

    /**
     * Sets the natural notes.
     * @param {NaturalNote[]} naturalNotes - An array of natural notes (e.g., C, D, E, etc.).
     * @returns {EnharmonicScaleBuilder} The builder instance for chaining.
     * @throws {Error} If the result has already been computed.
     */
    withNaturalNotes(naturalNotes: NaturalNote[]): EnharmonicScaleBuilder {
        this.validateMutability();
        this.naturalNotes = naturalNotes;
        return this;
    }

    /**
     * Sets the octave notes.
     * @param {Note[]} octaveNotes - An array of notes representing the octave.
     * @returns {EnharmonicScaleBuilder} The builder instance for chaining.
     * @throws {Error} If the result has already been computed.
     */
    withOctaveNotes(octaveNotes: Note[]): EnharmonicScaleBuilder {
        this.validateMutability();
        this.octaveNotes = octaveNotes;
        return this;
    }

    /**
     * Sets the maximum number of accidentals.
     * @param {number} accidentalsNumber - The number of accidentals allowed in the scale.
     * @returns {EnharmonicScaleBuilder} The builder instance for chaining.
     * @throws {Error} If the result has already been computed.
     */
    withAccidentalsNumber(accidentalsNumber: number): EnharmonicScaleBuilder {
        this.validateMutability();
        this.accidentalsNumber = accidentalsNumber;
        return this;
    }

    /**
     * Sets sorting options for the enharmonic scales.
     * @param {any} sortOptions - An object representing sorting options (to be defined later).
     * @returns {EnharmonicScaleBuilder} The builder instance for chaining.
     * @throws {Error} If the result has already been computed.
     */
    withSortOptions(sortOptions: any): EnharmonicScaleBuilder {
        this.validateMutability();
        this.sortOptions = sortOptions;
        return this;
    }

    /**
     * Checks if the result has already been computed.
     * @returns {boolean} True if the result has been computed, false otherwise.
     */
    isResultComputed(): boolean {
        return this.enharmonicScales !== null;
    }

    /**
     * Gets the enharmonic equivalent scales based on the current settings.
     * This will store the result if it hasn't been computed yet.
     * If sorting options are set, it will apply the sorting.
     * @returns {Note[][]} An array of enharmonic equivalent scales.
     */
    getEnharmonicEquivalentScales(): Note[][] {
        if (this.enharmonicScales === null) {
            this.enharmonicScales = getEnharmonicEquivalentScales(
                this.scale,
                this.accidental,
                this.naturalNotes,
                this.octaveNotes,
                this.accidentalsNumber
            );

            // If sort options are provided, apply sorting
            if (this.sortOptions !== null) {
                this.enharmonicScales = sortEnharmonicEquivalentScales(this.scale, this.enharmonicScales, this.accidental);
            }
        }

        return this.enharmonicScales;
    }

    /**
     * Ensures sorting options are set, and returns the best scale (first one).
     * @returns {Note[]} The first enharmonic equivalent scale after sorting.
     * @throws {Error} If sorting options are not provided.
     */
    getBestEnharmonicEquivalentScale(): Note[] {
        if (this.sortOptions === null) {
            throw new Error('Sorting options must be provided to get the best enharmonic equivalent scale.');
        }

        const scales = this.getEnharmonicEquivalentScales();
        return scales.length > 0 ? scales[0] : [];
    }
}

export default EnharmonicScaleBuilder;
