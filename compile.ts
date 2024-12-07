import sindri from 'sindri';

// Compile the circuit in the `profit-verifier` directory.
const circuit = await sindri.createCircuit('profit-verifier');
console.log(JSON.stringify(circuit, null, 2));
