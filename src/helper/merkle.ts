import { MerkleWitness } from 'snarkyjs';
/**
 * Storage Availability: 2^(4 - 1) = 8
 */
export class MerkleWitness4 extends MerkleWitness(4) {}
/**
 * Storage Availability: 2^(8 - 1) = 128
 */
export class MerkleWitness8 extends MerkleWitness(8) {}
/**
 * Storage Availability: 2^(16 - 1) = 32768
 */
export class MerkleWitness16 extends MerkleWitness(16) {}
/**
 * Storage Availability: 2^(24 - 1) = 8388608
 */
export class MerkleWitness24 extends MerkleWitness(24) {}
/**
 * Storage Availability: 2^(32 - 1) = 2147483648
 */
export class MerkleWitness32 extends MerkleWitness(32) {}
export class MerkleWitness64 extends MerkleWitness(64) {}
export class MerkleWitness128 extends MerkleWitness(128) {}
export class MerkleWitness256 extends MerkleWitness(256) {}
