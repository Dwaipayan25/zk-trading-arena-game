import sindri from 'sindri';

const circuitIdentifier = 'profit-verifier:latest';
const proofInput = 'initial_balance=1000\nfinal_balance=1150\nprofit_range=0';

const proof = await sindri.proveCircuit(circuitIdentifier, proofInput);

console.log(JSON.stringify(proof, null, 2));
