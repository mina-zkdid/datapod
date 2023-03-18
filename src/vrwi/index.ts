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

const buf = Buffer.from('hello');

const createDynamicStruct = (buf: Buffer) => {
  const structLen = buf.byteLength;
  Field.fromBytes(buf.toJSON().data);
  //   const struct = Struct();
  //   return struct;
};
/**
 * # Verifiable Reading/Writing Interface (VRWI)
 */
export const VRWI = Experimental.ZkProgram({
  publicInput: Field,
  methods: {
    read: {
      privateInputs: [],
      method() {},
    },
  },
});
