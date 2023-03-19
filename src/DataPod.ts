/* eslint-disable @typescript-eslint/no-empty-function */
/**
 * DataPod Contract
 */

import {
  Circuit,
  Encoding,
  Field,
  MerkleMap,
  MerkleMapWitness,
  MerkleTree,
  method,
  Permissions,
  Poseidon,
  PublicKey,
  SmartContract,
  State,
  state,
} from 'snarkyjs';
import { VRWI } from './vrwi';
import { writeFileSync, readFileSync, openSync } from 'fs';
import { OffChainStorage } from 'experimental-zkapp-offchain-storage';

function convertMerkleTreeToMap(tree: MerkleTree): Record<string, string> {
  let map: Record<string, string> = {};

  for (let i = 0n; i < tree.leafCount; i++) {
    const value = tree.getNode(0, i).toString();
    map[i.toString()] = value;
  }
  return map;
}

function toMerkleTree(map: Record<string, string>): MerkleTree {
  const tree = new MerkleTree(32);
  for (const i of Object.keys(map)) {
    tree.setLeaf(BigInt(i), Field(map[i]));
  }
  return tree;
}
class Storage {
  public init() {
    writeFileSync('test_storage.txt', '');
  }
  public write(mkt: MerkleTree) {
    writeFileSync(
      'test_storage.txt',
      JSON.stringify(convertMerkleTreeToMap(mkt))
    );
  }
  public read() {
    const file = readFileSync('test_storage.txt');
    if (file.byteLength) {
      return new MerkleTree(32);
    }
    return toMerkleTree(JSON.parse(file.toString()));
  }
}

export class DataPod extends SmartContract {
  @state(PublicKey) owner = State<PublicKey>();

  /**
   * Of where data is stored, represented as uri
   *
   * @example "ipfs://QmPChd2hVbrJ6bfo3WBcTW4iZnpHm8TEzWkLHmLpXhF68A:"
   */
  @state(Field) location = State<Field>();

  /**
   * Latest data hash root
   */
  @state(Field) data = State<Field>();

  init() {
    super.init();
    new Storage().init();
  }
  @method async createSpace(name: Field, location: Field) {
    this.owner.assertEquals(this.sender);
    const currentRoot = this.data.get();
    this.data.assertEquals(currentRoot);

    const storage = new Storage();
    const doc = storage.read();
    doc.setLeaf(new MerkleMap()._keyToIndex(name), location);

    storage.write(doc);

    Circuit.log('successfully create space');
    // new Storage().write()
    // fetch ipfs document
    // const document = await readFromIPFS(this.location.get().toString());

    // const hash = Poseidon.hash(Encoding.bytesToFields(document));
    // VRWI.verify(currentRoot, hash);
  }

  @method getSpace(name: Field) {}

  @method destroySpace() {}

  @method update() {}
}
