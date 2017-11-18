const mongoose = require('mongoose');
const Channel = mongoose.model('Channel');

module.exports  = (socket, io) => {
  socket.on('setTime', function (data) {
    if(!(data.name && data.time)) console.log('errror nie ma nazwy lub czasu')
    if(data === "") io.emit('connection_response', 'Nie podano czasu.');
    else {
      Channel.findOne({name: data.name}, (err, result) => {
        if(err) console.log(err);
        if(result) {
          Channel.update({name: data.name}, {$inc : { time: data.time}}, (err)=> {
            io.to(data.name).emit(`Dodano: ${data.time} min`);
          })
        }
        else console.log('brak wyniku');//nie znaleziono
      })
    }
  })
};