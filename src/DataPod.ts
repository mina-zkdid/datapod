/* eslint-disable @typescript-eslint/no-empty-function */
/**
 * DataPod Contract
 */

import {
  Field,
  method,
  PublicKey,
  SmartContract,
  State,
  state,
} from 'snarkyjs';

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
  @method createSpace() {}

  @method getSpace() {}

  @method destroySpace() {}

  @method update() {}
}
