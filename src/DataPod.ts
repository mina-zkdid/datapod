/* eslint-disable @typescript-eslint/no-empty-function */
/**
 * DataPod Contract
 */

import {
  Encoding,
  Field,
  method,
  Permissions,
  Poseidon,
  PublicKey,
  SmartContract,
  State,
  state,
} from 'snarkyjs';
import { VRWI, readFromIPFS } from './vrwi';

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
  @method async createSpace() {
    this.owner.assertEquals(this.sender);

    // fetch ipfs document
    const document = await readFromIPFS(this.location.get().toString());

    const hash = Poseidon.hash(Encoding.bytesToFields(document));
    VRWI.verify(this.data.get(), hash);
  }

  @method getSpace() {}

  @method destroySpace() {}

  @method update() {}
}
