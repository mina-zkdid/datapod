/* eslint-disable @typescript-eslint/no-empty-function */
import { readFile } from 'fs/promises';
import { Buffer } from 'buffer';
import {
  Circuit,
  Experimental,
  Field,
  Struct,
  CircuitString,
  PublicKey,
} from 'snarkyjs';
import { CID } from 'multiformats';

const buf = Buffer.from('hello');

/**
 * # Verifiable Reading/Writing Interface (VRWI)
 */
export const VRWI = Experimental.ZkProgram({
  publicInput: Struct({
    documentHash: Field,
  }),
  methods: {
    init: {
      privateInputs: [Field],
      method(state) {},
    },
    finish: {
      privateInputs: [],
      method() {},
    },
    readUnchecked: {
      privateInputs: [],
      method() {},
    },
    read: {
      privateInputs: [],
      method() {},
    },
    writeUnchecked: {
      privateInputs: [],
      method() {},
    },
    write: {
      privateInputs: [],
      method() {},
    },
  },
});
