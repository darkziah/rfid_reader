// NodeJS includes

const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');


const port = new SerialPort('/dev/ttyS0', { baudRate: 9600 });

// Stores the RFID id as it reconstructs from the stream.
var id = '';
// List of all RFID ids read
var ids = [];

// ARGUMENT 1:
// Stream path, unique to your hardware.
// List your available USB serial streams via terminal and choose one:
//   ls /dev | grep usb
// Had trouble with TTY, so used CU.

// ARGUMENT 2:
// Simplifies restruction of stream if one bit comes at a time.
// However, I don't know if or how this setting affects performance.

port
.on('open', function(fd) {
	console.log('Begin scanning RFID tags.');
})

.on('end', function() {
	console.log('End of data stream.');
})

.on('close', function() {
	console.log('Closing stream.');
})

.on('error', function(error) {
	console.log(error);
})

.on('data', function(chunk) {
	chunk = chunk.toString('ascii').match(/\w*/)[0]; // Only keep hex chars
	if ( chunk.length == 0 ) { // Found non-hex char
		if ( id.length > 0 ) { // The ID isn't blank
			ids.push(id); // Store the completely reconstructed ID
			console.log(`> ${id}`)
		}
		id = ''; // Prepare for the next ID read
		return;
	}
    id += chunk; // Concat hex chars to the forming ID
    
});
