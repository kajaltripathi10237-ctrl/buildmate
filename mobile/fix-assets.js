const fs = require('fs');
const zlib = require('zlib');

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      const isOdd = (crc & 1) === 1;
      crc = (crc >>> 1) ^ (isOdd ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makePng(width, height, rgba) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const chunks = [];

  function addChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
    chunks.push(Buffer.concat([len, typeBuf, data, crcBuf]));
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  addChunk('IHDR', ihdr);

  const row = Buffer.alloc(1 + width * 4);
  row[0] = 0;
  for (let x = 0; x < width; x++) {
    row[1 + x * 4] = rgba[0];
    row[2 + x * 4] = rgba[1];
    row[3 + x * 4] = rgba[2];
    row[4 + x * 4] = rgba[3];
  }

  const rows = Buffer.alloc(height * row.length);
  for (let y = 0; y < height; y++) {
    rows.set(row, y * row.length);
  }

  const idat = zlib.deflateSync(rows);
  addChunk('IDAT', idat);
  addChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ...chunks]);
}

const icon = makePng(1024, 1024, [6, 79, 139, 255]);
const adaptive = makePng(1024, 1024, [6, 79, 139, 255]);

fs.writeFileSync('assets/icon.png', icon);
fs.writeFileSync('assets/adaptive-icon.png', adaptive);

console.log('Wrote valid PNG assets:', fs.statSync('assets/icon.png').size, fs.statSync('assets/adaptive-icon.png').size);
