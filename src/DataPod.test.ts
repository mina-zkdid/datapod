import { DataPod } from './DataPod';
import {
  isReady,
  shutdown,
  Field,
  Mina,
  PrivateKey,
  PublicKey,
  AccountUpdate,
  MerkleTree,
} from 'snarkyjs';
import { MerkleWitness4 } from './helper/merkle';

/*
 * This file specifies how to test the `Add` example smart contract. It is safe to delete this file and replace
 * with your own tests.
 *
 * See https://docs.minaprotocol.com/zkapps for more info.
 */

let proofsEnabled = false;

describe('DataPod Contract Testing', () => {
  let deployerAccount: PublicKey,
    deployerKey: PrivateKey,
    senderAccount: PublicKey,
    senderKey: PrivateKey,
    zkAppAddress: PublicKey,
    zkAppPrivateKey: PrivateKey,
    zkApp: DataPod;

  beforeAll(async () => {
    await isReady;
    if (proofsEnabled) DataPod.compile();
    console.log('DataPod Already');
  });

  beforeEach(() => {
    const Local = Mina.LocalBlockchain({ proofsEnabled });
    Mina.setActiveInstance(Local);
    ({ privateKey: deployerKey, publicKey: deployerAccount } =
      Local.testAccounts[0]);
    ({ privateKey: senderKey, publicKey: senderAccount } =
      Local.testAccounts[1]);
    zkAppPrivateKey = PrivateKey.random();
    zkAppAddress = zkAppPrivateKey.toPublicKey();
    zkApp = new DataPod(zkAppAddress);
  });

  afterAll(() => {
    // `shutdown()` internally calls `process.exit()` which will exit the running Jest process early.
    // Specifying a timeout of 0 is a workaround to defer `shutdown()` until Jest is done running all tests.
    // This should be fixed with https://github.com/MinaProtocol/mina/issues/10943
    setTimeout(shutdown, 0);
  });

  async function localDeploy() {
    const txn = await Mina.transaction(deployerAccount, () => {
      AccountUpdate.fundNewAccount(deployerAccount);
      zkApp.deploy();
    });
    await txn.prove();
    // this tx needs .sign(), because `deploy()` adds an account update that requires signature authorization
    await txn.sign([deployerKey, zkAppPrivateKey]).send();
  }

  it('generates and deploys the `Add` smart contract', async () => {
    await localDeploy();
    // const num = zkApp.num.get();
    // expect(num).toEqual(Field(1));
  });

  it('calling createSpace()', async () => {
    await localDeploy();

    const emp = new MerkleTree(4);
    const w = emp.getWitness(0n);
    // update transaction
    const txn = await Mina.transaction(senderAccount, () => {
      zkApp.createSpace(new MerkleWitness4(w), Field(0), Field('000023'));
    });
    await txn.prove();
    await txn.sign([senderKey]).send();
    expect(zkApp.data).toEqual(Field(0));
    // const updatedNum = zkApp..get();
    // expect(updatedNum).toEqual(Field(3));
  }, 60);
});
