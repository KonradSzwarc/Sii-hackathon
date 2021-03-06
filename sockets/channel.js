const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');
const Channel = mongoose.model('Channel');

class Participants {
  constructor(socket, io) {
    this.io = io;
    socket.on('addParticipant', this.add.bind(this));
    socket.on('removeParticipant', this.remove.bind(this));
  };

  add(data) {
    if (!(data.fullname && data.name)) console.log('brak parametru fullname');
    else {
      Channel.update({name: data.name}, {$addToSet: {participants: data.fullname}}, (err, newParticipants) => {
        if (err) console.log('blad dodawania participanta');
        this.io.to(data.name).emit(newParticipants);
      });
    }
  };

  remove(data) {
    console.log('remove');
    if (!(data.fullname && data.name)) console.log('brak parametru fullname');
    else {
      Channel.findOne({name: data.name}, (err, result) => {
        if (result) {
          let updatedParticipants = result.participants.filter(element => {
            element !== data.fullname;
          });
          Channel.update({name: date.name}, {$set: {participants: updatedParticipants}}, (err, newParticipants) => {
            if (err) console.log('brak parametru fullname');
            this.io.to(data.name).emit(newParticipants);
          });
        }
      })
    }
  }
}

class Ideas{
  constructor(socket, io){
    this.io = io;
    socket.on('addIdea', this.add.bind(this));
    socket.on('removeIdea', this.remove.bind(this));
    socket.on('changeIdea', this.change.bind(this));
  };

  add(data){
    if(!(data.name && data.idea)) console.log('errror add idea');
    else{
      Channel.update({name: data.name}, {$addToSet: {idea: {content: data.idea, id: uuidv4()}}}, (err)=>{
        Channel.findOne({name: data.name}, (err, newIdeas)=>{
          if(err) this.io.to(data.name).emit(`Błąd dodawania pomysłu.`);
          this._emitIdeas(this.io,data.name, newIdeas.idea);
        });
      });
    }
  };
  remove(data){
    if(!(data.name && data.id)) console.log('errror add idea');
    else{
      Channel.findOne({name: data.name}, (err, result)=>{
        if(result){
          let newIdeas = result.idea.filter(elements => {
            elements.id !== data.id;
          });
          Channel.update({name: data.name}, {$set: {idea: newIdeas}}, (err)=>{
            Channel.findOne({name: data.name}, (err, newIdeas)=>{
              if(err) this.io.to(data.name).emit(`Błąd dodawania pomysłu.`);
              this._emitIdeas(this.io,data.name, newIdeas.idea);
            });
          })
        }
      });
    }
  };

  change(data){
    if(!(data.name && data.id && data.newContent)) console.log('errror add idea');
    else{
      Channel.findOne({name: data.name}, (err, result) => {
        let updatedContent = result.idea.map(element => {
          if(element.id === data.id) return {id: data.id, content: data.newContent};
          else return element;
        });

        Channel.update({name:data.name}, {$set: {idea: updatedContent}}, (err) => {
          if(err) this.io.to(data.name).emit(`Błąd zmiany pomysłu.`);
          this._emitIdeas(this.io,data.name, result.idea);
        });
      });
    }
  };
  _emitIdeas(io, name, ideas){
    io.to(name).emit("changeIdeas",ideas);
  };

}

class TimeController{
  constructor(socket, io){
    this.io = io;
    socket.on('startTime', this.startTime.bind(this));
    socket.on('checkTime', this.checkTime.bind(this));
    socket.on('goThirdPhase', this.changeToThirdPhase.bind(this));
  };

  startTime(data){

    if(!(data.name && data.time)) console.log('errror nie ma nazwy lub czasu')
    else{
      Channel.findOne({name: data.name}, (err, result) => {
        if(err) console.log(err);
        if(result) {
          Channel.update({name: data.name}, {$set: {phase:2, deadline: (new Date().getTime() + result.time)}}, (err)=> {
            Channel.findOne({name:data.name}, (err,result)=>{
              this.io.to(data.name).emit(`phasechange`, 2); // popr opis
              this.io.to(data.name).emit(`deadline`, result.deadline);
            });
          })
        }
        else console.log('brak wyniku');//nie znaleziono
      })
    }
  };

  checkTime(data){
    if(!data) console.log('errror nie ma nazwy lub czasu')
    else{
      Channel.findOne({name: data}, (err, result) => {
        if(err) console.log(err);
        if(result) {
          this.io.to(data).emit(`deadline`, result.deadline);
        }
        else console.log('brak wyniku');//nie znaleziono
      })
    }
  };

  changeToThirdPhase(data){
    if(!data) console.log('errror nie ma nazwy lub czasu')
    else{
      Channel.update({name: data}, {$set: {phase:3}}, (err)=> {
        this.io.to(data).emit(`phasechange`, 3); // popr opis
      })
    }
  };

  addTime(data){};
}

module.exports  = (socket, io) => {
  socket.on('setTime', function (data) {
    if(!(data.name && data.time)) console.log('errror nie ma nazwy lub czasu')
    if(data === "") io.emit('connection_response', 'Nie podano czasu.');
    else {
      Channel.findOne({name: data.name}, (err, result) => {
        if(err) console.log(err);
        if(result) {
          Channel.update({name: data.name}, {$inc : { time: 60000}, $set:{ deadline: new Date().getTime() + data.time + 60000}}, (err)=> {
            Channel.findOne({name: data.name}, (err, result) => {
              io.to(data.name).emit(`deadline`, result.deadline);
            });
          })
        }
        else console.log('brak wyniku');//nie znaleziono
      })
    }
  })

  socket.on('clear', function (data) {
    if(!data) console.log('blad czyszczenia ekranu')
    else {
      Channel.update({name: data}, {$set: {idea: [], time: 600000, phase:1}}, (err)=>{
        if(err) io.to(data).emit(`Błąd czyszczenia pomysłów.`);
        io.to(data).emit(`Wyczyszczono pomysły`);
      });
    }
  })


  new Participants(socket, io);
  new Ideas(socket, io);
  new TimeController(socket, io);
};
