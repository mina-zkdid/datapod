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
// import {IPFS} from 'ipfs-core-types';
import * as IPFS from 'ipfs-core';
import { concat } from 'uint8arrays';
const buf = Buffer.from('hello');

let ipfs: IPFS.IPFS;

async function setupIPFSInstance() {
  if (!ipfs) {
    ipfs = await IPFS.create();
  }
}

export async function readFromIPFS(location: string) {
  await setupIPFSInstance();

  const doc = ipfs.files.read(location);
  let chunks = [];
  for await (const chunk of doc) {
    chunks.push(chunk);
  }
  return concat(chunks);
}
/**
 * # Verifiable Reading/Writing Interface (VRWI)
 */
export const VRWI = Experimental.ZkProgram({
  publicInput: Field,

  methods: {
    from: {
      privateInputs: [Field],
      method(state) {},
    },
    finish: {
      privateInputs: [],
      method() {},
    },

    /**
     * Verify document
     */
    verify: {
      privateInputs: [Field],
      method(state, fetchedDocumentHash) {
        state.assertEquals(fetchedDocumentHash);
      },
    },

    writeUnchecked: {
      privateInputs: [],
      method() {},
    },
    write: {
      privateInputs: [Field, Field],
      method(state, oldHash, newHash) {
        state.assertEquals(oldHash);
        return newHash;
      },
    },
  },
});
