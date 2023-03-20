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
  MerkleWitness,
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
import { MerkleWitness4 } from './helper/merkle';

const height = 4;
/**
 * Presist Merkle Tree to disk
 */
type PresistTree = Map<bigint, string>;

function convertMerkleTreeToMap(tree: MerkleTree): PresistTree {
  let map = new Map<bigint, string>();

  for (let i = 0n; i < tree.leafCount; i++) {
    const value = tree.getNode(0, i).toJSON();
    map.set(i, value);
  }
  return map;
}

function toMerkleTree(map: PresistTree): MerkleTree {
  const tree = new MerkleTree(height);
  for (const i of map.keys()) {
    tree.setLeaf(BigInt(i), Field(map.get(BigInt(i))!));
  }
  return tree;
}
class Storage {
  public init() {
    writeFileSync('test_storage.txt', '');
  }
  public write(mkt: MerkleTree) {
    const f = convertMerkleTreeToMap(mkt);
    console.log(f);
    writeFileSync('test_storage.txt', JSON.stringify(f));
  }
  public read() {
    const file = readFileSync('test_storage.txt');
    console.log(file.byteLength);
    if (!file.byteLength) {
      console.log('create new merkle tree');
      return new MerkleTree(height);
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
  @method async createSpace(
    leafWitness: MerkleWitness4,
    name: Field,
    location: Field
  ) {
    // this.owner.assertEquals(this.sender);
    const currentRoot = this.data.get();
    this.data.assertEquals(currentRoot);

    const storage = new Storage();
    const doc = storage.read();
    doc.setLeaf(name.toBigInt(), location);
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
