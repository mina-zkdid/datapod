/**
 * DataPod Contract
 */

import { Field, PublicKey, SmartContract, State, state } from 'snarkyjs';

export class DataPod extends SmartContract {
  /**
   * Latest data hash
   */
  @state(Field) data = State<Field>();

  @state(PublicKey) owner = State<PublicKey>();

  /**
   * Of where data is stored, represented as uri
   */
  @state(Field) location = State<Field>();
}
