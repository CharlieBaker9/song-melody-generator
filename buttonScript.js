import { midiDict } from "./midiDictionary.js";

document.addEventListener("DOMContentLoaded", function() {
  const buttons = document.querySelectorAll("#buttons button");
  for (const button of buttons) {
    button.addEventListener("click", changeButtonColor);
  }

  const doneRhythmButton = document.querySelector(".done-rhythm");
  doneRhythmButton.addEventListener("click", changeBackgroundColorToRed);

  const slider = document.getElementById("slider");
  const number = document.getElementById("tempoNum");

  slider.addEventListener("mousemove", () => {
    number.textContent = slider.value;
    bpm = slider.value;
  });

  function showInputBox() {
    document.getElementById("inputBox").style.display = "block";
  }

  document.getElementById("process-notes").addEventListener("click", processPitches);
  document.getElementById("midi-listen").addEventListener("click", playMelody);
  document.getElementById("listen-song").addEventListener("click", listenSong);
  document.getElementById("train-model").addEventListener("click", trainModel)
  document.getElementById("download-song").addEventListener("click", downloadSong);
  document.getElementById("transposeButton1").addEventListener("click", transpose1);
  document.getElementById("transposeButton2").addEventListener("click", transpose2);
  document.getElementById("transposeButton3").addEventListener("click", transpose3);
  document.getElementById("transposeButton4").addEventListener("click", transpose4);

  const sectionButtons = document.querySelectorAll(".sectionTypes button");
  for (const button of sectionButtons) {
    button.addEventListener("click", changeSectionButtonColor);
  }
});

function changeBackgroundColorToRed() {
  if (selectedButtons.length === 0){
    var textbox = document.getElementById("num-notes");
    textbox.innerHTML = "Please select one or more rhythm onsets to continue to pitch";
  } else {
    this.style.backgroundColor = "red";
    var textbox = document.getElementById("num-notes");
    var first = "You have input ";
    var noteNum = selectedButtons.length;
    var second = " onsets of notes. Please input ";
    var third = " note values given as space separated notes (no flats): C4 D#4 E5...";
    var concatSentence = first + noteNum + second + noteNum + third; 
    textbox.innerHTML = concatSentence;
  }
}

var selectedButtons = [];
function changeButtonColor() {
  // If the button is not already clicked, change its color to blue.
  if (selectedButtons.indexOf(this.name) === -1) {
    this.style.backgroundColor = "rgb(60, 60, 145)";
    selectedButtons.push(this.name);
    selectedButtons.sort((a, b) => a - b);
  } else {
    // If the button is already clicked, change its color back to its previous color.
    this.style.backgroundColor = "rgb(214, 211, 211)";
    selectedButtons.splice(selectedButtons.indexOf(this.name), 1);
  }
  //resetting after more rhythm change
  const doneRhythmButton = document.querySelector(".done-rhythm");
  doneRhythmButton.style.backgroundColor = "rgb(60, 60, 145)";
  const processNotesButton = document.querySelector(".make-notes");
  processNotesButton.style.backgroundColor = "rgb(60, 60, 145)";
  var numNotesText = document.getElementById("num-notes");
  numNotesText.innerHTML = "Please select rhythm components in order to assign pitch";
}

var midiNoteSequence = [];
var pitches = [];
function processPitches(){
  midiNoteSequence.splice(0, midiNoteSequence.length);
  var value = document.getElementById("pitch-entry").value;
  var notes = value.split(" ").filter(function(note) {
    return note !== "";
  });
  var numErrorsText = document.getElementById("note-errors");
  if (notes.length != selectedButtons.length){
    if (notes.length < selectedButtons.length){
      const difference = selectedButtons.length - notes.length;
      numErrorsText.innerHTML = "You have "+selectedButtons.length+" note onsets and "+notes.length+" pitches. Please add "+difference+" more pitches.";
    } else {
      const difference = notes.length - selectedButtons.length;
      numErrorsText.innerHTML = "You have "+selectedButtons.length+" note onsets and "+notes.length+" pitches. Please remove "+difference+" pitches.";
    }
  } else {
    for (let i = 0; i < notes.length; i++) {
      if (notes[i].length != 2 && notes[i].length != 3){
        var start = "You inputted "
        var end = ". Which is not the correct length of input."
        numErrorsText.innerHTML = start + notes[i] + end;
      } else {
        if (notes[i].length == 3) {
          var letter = notes[i].charAt(0).toUpperCase()
          var charNumber = notes[i].charAt(2)
          const num = charNumber.charCodeAt() - 0x00;
          if (letter >= 'A' && letter <= 'G'){
            if (notes[i].charAt(1) != "#"){
              var start = "You inputted "
              var end = ". Whose second character is not a # and is 3 characters long"
              numErrorsText.innerHTML = start + notes[i] + end;
            } else {
              if (num >= 1 || num <= 9) {
                midiNoteSequence.push(notes[i].toUpperCase())
                numErrorsText.innerHTML = "";
                const processNotesButton = document.querySelector(".make-notes");
                processNotesButton.style.backgroundColor = "red";
              } else {
                var start = "You inputted "
                var end = ". Whose third character is not between 1-9"
                numErrorsText.innerHTML = start + notes[i] + end;
              }
            }
          } else {
            var start = "You inputted "
            var end = ". Whose first character is not between A-G"
            numErrorsText.innerHTML = start + notes[i] + end;
          }
        } else {
          var letter = notes[i].charAt(0).toUpperCase()
          var charNumber = notes[i].charAt(1)
          const num = charNumber.charCodeAt() - 0x00;
          if (letter >= 'A' && letter <= 'G'){
            if (num >= 1 || num <= 9) {
              midiNoteSequence.push(notes[i].toUpperCase())
              numErrorsText.innerHTML = "";
              const processNotesButton = document.querySelector(".make-notes");
              processNotesButton.style.backgroundColor = "red";
            } else {
              var start = "You inputted "
              var end = ". Whose second character is not between 1-9"
              numErrorsText.innerHTML = start + notes[i] + end;
            }
          } else {
            var start = "You inputted "
            var end = ". Whose first character is not between A-G"
            numErrorsText.innerHTML = start + notes[i] + end;
          }
        }
      }
    }
  }
  for (let i = 0; i < midiNoteSequence.length; i++){
    pitches.push(midiDict[midiNoteSequence[i]]);
  }
  calcNoteDurations();
}

var noteDurations = [];
function calcNoteDurations() {
  noteDurations.splice(0, noteDurations.length);
  for (let i = 0; i < selectedButtons.length - 1; i++){
    let key = selectedButtons[i+1] - selectedButtons[i];
    noteDurations.push(key);
  }
  let key = 65 - selectedButtons[selectedButtons.length-1];
  noteDurations.push(key);

  sequence.notes.splice(0, sequence.notes.length);
  sequence.tempos[0].qpm = bpm;
  let s = 0;
  for(let i = 0; i < pitches.length; i++){
    let d = noteDurations[i] / 16;
    sequence.notes.push({pitch: pitches[i], startTime: s, endTime: s+d});
    s += d;
  }
  sequence.totalTime = s;
}

var sectionArrangement = [];
var song = [];
function changeSectionButtonColor() {
  this.style.backgroundColor = "red";
  for (let i = 0; i < sectionArrangement.length; i++){
    if (Math.round(this.name) == Math.round(sectionArrangement[i].name)){
      sectionArrangement[i].style.backgroundColor = "rgb(60, 60, 145)";
      sectionArrangement.splice(i, 1);
    }
  }
  this.backgroundColor = "red";
  sectionArrangement.push(this);
  sectionArrangement.sort((a, b) => a - b);

  //make midi file for song
  var primeCount = 0;
  if (sectionArrangement.length == 4){
    for (let i=0; i < 4; i++){
      if (sectionArrangement[i].name.toString().endsWith(".1")){
        song[i] = sequence;
      } else if (sectionArrangement[i].name.toString().endsWith(".2")){
        song[i] = primeSection();
        primeCount += 1;
      } else if (sectionArrangement[i].name.toString().endsWith(".3")){
        let num = i+1
        var text = "Please input the # of semitones to transpose your melody by (... -2,-1,1,2 ...) for section "+num;
        document.getElementById("transpositionPrompt"+num).innerHTML = text;
        document.getElementById("transpositionEntry"+num).style.display = "block";
        document.getElementById("transpositionEntry"+num).style.margin = "0 auto";
        document.getElementById("transposeButton"+num).style.display = "flex";
      } else {
        sampleModel(i);
      }
    } 
    for (let i=0; i < 4; i++){
      let num = i+1;
      if (!sectionArrangement[i].name.toString().endsWith(".3")){
        if (document.getElementById("transpositionEntry"+num).style.display != "none"){
          document.getElementById("transpositionPrompt"+num).innerHTML = "";
          document.getElementById("transpositionEntry"+num).style.display = "none";
          document.getElementById("transposeButton"+num).style.display = "none";
        }
      }
    }
  }
}

function listenSong() {
  //here is where I access the song that I processed and play it
  var errorsText = document.getElementById("make-song-errors");
  if (song.length == 4){
    errorsText.innerHTML = "";
    playSong(song);
  } else {
    errorsText.innerHTML = "Please select an arrangement for all 4 sections";
  }
}
const checkpoint = 'https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/'
const model = 'mel_4bar_med_q2'
const music_vae = new mm.MusicVAE(checkpoint + model);
const music_rnn = new mm.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/basic_rnn')
const midime = new mm.MidiMe({epochs: 100})
const player = new mm.Player();
let quantNoteSeq = null;
var timesig = [4,4];
var initialBpm = 80;
let sequence = {
  ticksPerQuarter: 220,
  totalTime: 0.0,
  timeSignatures: [{time: 0, numerator: timesig[0], denominator: timesig[1]}],
  tempos: [{time: 0, qpm: initialBpm}],
  notes: [ ]
} 

let songSequence = {
  ticksPerQuarter: 220,
  totalTime: 0.0,
  timeSignatures: [{time: 0, numerator: timesig[0], denominator: timesig[1]}],
  tempos: [{time: 0, qpm: initialBpm}],
  notes: [ ]
}

let bpm;
function playMelody(){
  mm.Player.tone.context.resume();
  player.start(sequence)
}

const sampleModel = async (num) => {
  var sample = await midime.sample(8)
  const sequences = await music_vae.decode(sample)
  var playableSample = mm.sequences.concatenate([...sequences])
  let sampleSequence = {
    ticksPerQuarter: 220,
    totalTime: 0.0,
    timeSignatures: [{time: 0, numerator: timesig[0], denominator: timesig[1]}],
    tempos: [{time: 0, qpm: initialBpm}],
    notes: [ ]
  }
  let startTime = playableSample.notes[0]["quantizedStartStep"];
  let endTime = Math.floor(Math.random() * 5) + 2;    //need to fix this
  for(let i = 0; i < playableSample.notes.length; i++){
    sampleSequence.notes.push({pitch: playableSample.notes[i]["pitch"], startTime: startTime, endTime: endTime});
    startTime = endTime;
    endTime += Math.floor(Math.random() * 5) + 2;
  }

  song[num] = sampleSequence;
}

function playSong(){
  createSongSequence();

  console.log(songSequence);
  
  mm.Player.tone.context.resume();
  player.start(songSequence)
}


function downloadSong(){
  // Taken from https://stackoverflow.com/q/64179468
  const magentaMidi = mm.sequenceProtoToMidi(songSequence);
  const magentaFile = new Blob([magentaMidi], { type: 'audio/midi' })
  const url = URL.createObjectURL(magentaFile);
  
  // Taken from https://stackoverflow.com/a/9834261
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'Charlie-Output.MID';
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
}

function createSongSequence(){
  songSequence.notes.splice(0, sequence.notes.length);
  songSequence.tempos[0].qpm = bpm;
  let s = 0;
  for(let i = 0; i < song.length; i++){
    for(let j = 0; j < song[i].notes.length; j++){
      songSequence.notes.push({pitch: song[i].notes[j]["pitch"], startTime: s, endTime: song[i].notes[j]["endTime"]});
      s = song[i].notes[j]["endTime"];
    }
  }
  songSequence.totalTime = s
}

const trainModel = async () => {
  // Initialize the RNN for continueSequence and the vae for interpolate
  document.getElementById("train-model").style.backgroundColor = "red";
  await music_rnn.initialize();
  await music_vae.initialize();
  await midime.initialize();
  quantNoteSeq = mm.sequences.quantizeNoteSequence(sequence, 4);
  const data = await music_vae.encode([quantNoteSeq]);
  let epochUpdate = document.getElementById("epoch-update")
  await midime.train(data, async (epoch) => {
    epochUpdate.innerHTML = "Epoch " + (epoch + 1) + " / 100"
  })
}


  // Very Repetitive code
  let transposeSequence1 = {
    ticksPerQuarter: 220,
    totalTime: 0.0,
    timeSignatures: [{time: 0, numerator: timesig[0], denominator: timesig[1]}],
    tempos: [{time: 0, qpm: initialBpm}],
    notes: [ ]
  }
  let transposeSequence2 = {
    ticksPerQuarter: 220,
    totalTime: 0.0,
    timeSignatures: [{time: 0, numerator: timesig[0], denominator: timesig[1]}],
    tempos: [{time: 0, qpm: initialBpm}],
    notes: [ ]
  } 
  let transposeSequence3 = {
    ticksPerQuarter: 220,
    totalTime: 0.0,
    timeSignatures: [{time: 0, numerator: timesig[0], denominator: timesig[1]}],
    tempos: [{time: 0, qpm: initialBpm}],
    notes: [ ]
  } 
  let transposeSequence4 = {
    ticksPerQuarter: 220,
    totalTime: 0.0,
    timeSignatures: [{time: 0, numerator: timesig[0], denominator: timesig[1]}],
    tempos: [{time: 0, qpm: initialBpm}],
    notes: [ ]
  } 
  
  function transpose1(){
    document.getElementById("transposeButton1").style.backgroundColor = "red";
    var value = +document.getElementById("transpositionEntry1").value;
    for(let i = 0; i < sequence.notes.length; i++){
      transposeSequence1.notes.push({pitch: sequence.notes[i]["pitch"] + value, startTime: sequence.notes[i]["startTime"], endTime: sequence.notes[i]["endTime"]});
    }
    song[0] = transposeSequence1;
  }
  function transpose2(){
    document.getElementById("transposeButton2").style.backgroundColor = "red";
    var value = +document.getElementById("transpositionEntry2").value;
    for(let i = 0; i < sequence.notes.length; i++){
      transposeSequence2.notes.push({pitch: sequence.notes[i]["pitch"] + value, startTime: sequence.notes[i]["startTime"], endTime: sequence.notes[i]["endTime"]});
    }
    song[1] = transposeSequence2;
  }
  function transpose3(){
    document.getElementById("transposeButton3").style.backgroundColor = "red";
    var value = +document.getElementById("transpositionEntry3").value;
    for(let i = 0; i < sequence.notes.length; i++){
      transposeSequence3.notes.push({pitch: sequence.notes[i]["pitch"] + value, startTime: sequence.notes[i]["startTime"], endTime: sequence.notes[i]["endTime"]});
    }
    song[2] = transposeSequence3;
  }
  function transpose4(){
    document.getElementById("transposeButton4").style.backgroundColor = "red";
    var value = +document.getElementById("transpositionEntry4").value;
    for(let i = 0; i < sequence.notes.length; i++){
      transposeSequence4.notes.push({pitch: sequence.notes[i]["pitch"] + value, startTime: sequence.notes[i]["startTime"], endTime: sequence.notes[i]["endTime"]});
    }
    song[3] = transposeSequence4;
  }
