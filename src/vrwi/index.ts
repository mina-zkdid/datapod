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
  MerkleTree,
} from 'snarkyjs';
import { CID } from 'multiformats';
// import {IPFS} from 'ipfs-core-types';
import * as IPFS from 'ipfs-core';
import { concat } from 'uint8arrays';
import { MerkleWitness4 } from '../helper/merkle';
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

const H7 = Struct([
  [{ field: Field, mkw: MerkleWitness4 }],
  [{ field: Field, mkw: MerkleWitness4 }],
  [{ field: Field, mkw: MerkleWitness4 }],
  [{ field: Field, mkw: MerkleWitness4 }],
  [{ field: Field, mkw: MerkleWitness4 }],
  [{ field: Field, mkw: MerkleWitness4 }],
  [{ field: Field, mkw: MerkleWitness4 }],
]);
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
    verify8: {
      privateInputs: [MerkleWitness4, Field, Field, H7],
      method(oldRootHash, leafWitness, valueToChange, newValue, rest) {
        let oldRoot = leafWitness.calculateRoot(valueToChange);
        oldRootHash.assertEquals(oldRoot);

        const newRoot = leafWitness.calculateRoot(newValue);
        for (const outer of rest) {
          for (const inner of outer) {
            const oldHash = inner.mkw.calculateRoot(inner.field);
            oldRootHash.assertEquals(oldHash);
            // TODO: Get new Merkle Tree and compare new hash
          }
        }
      },
    },
    write: {
      privateInputs: [Field, Field, MerkleWitness4],
      method(state, ...args) {
        state.assertEquals(oldHash);
        return newHash;
      },
    },
  },
});
