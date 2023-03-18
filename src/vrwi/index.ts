/* eslint-disable @typescript-eslint/no-empty-function */
import { readFile } from 'fs/promises';
import { Buffer } from 'buffer';
import { Circuit, Experimental, Field } from 'snarkyjs';

export const VRWI = Experimental.ZkProgram({
  publicInput: Field,
  methods: {
    read: {
      privateInputs: [],
      method() {
        Circuit.runAndCheck(() => {});
      },
    },
  },
});
