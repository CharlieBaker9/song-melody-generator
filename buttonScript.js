import { durationDict } from "./durationDictionary.js";
import { makeMidiFile, playMelody, transpose, sampleModel, playSong } from "./midiHelper.js";

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
  });

  function showInputBox() {
    document.getElementById("inputBox").style.display = "block";
  }

  document.getElementById("process-notes").addEventListener("click", processPitches);
  document.getElementById("midi-listen").addEventListener("click", playMelody);
  document.getElementById("listen-song").addEventListener("click", listenSong);

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
  calcNoteDurations();
}

var noteDurations = [];
function calcNoteDurations() {
  noteDurations.splice(0, noteDurations.length);
  for (let i = 0; i < selectedButtons.length - 1; i++){
    let key = selectedButtons[i+1] - selectedButtons[i];
    noteDurations.push(durationDict[key]);
  }
  let key = 65 - selectedButtons[selectedButtons.length-1];
  noteDurations.push(durationDict[key]);
  console.log(midiNoteSequence);
  console.log(noteDurations);
  makeMidiFile(midiNoteSequence, noteDurations);
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
  if (sectionArrangement.length == 4){
    for (let i=0; i < 4; i++){
      if (sectionArrangement[i].name.toString().endsWith(".1")){
        song[i] = makeMidiFile(midiNoteSequence, noteDurations);
      } else if (sectionArrangement[i].name.toString().endsWith(".2")){
        song[i] = "prime section";
      } else if (sectionArrangement[i].name.toString().endsWith(".3")){
        var text = "Please input the # of semitones to transpose your melody by (... -2,-1,1,2 ...)";
        document.getElementById("transpositionPrompt").innerHTML = text;
        document.getElementById("transpositionEntry").style.display = "block";
        document.getElementById("transpositionEntry").style.margin = "0 auto";
        document.getElementById("transposeButton").style.display = "flex";


        song[i] = transpose(midiNoteSequence, noteDurations);
      } else {
        console.log("do I always go here?");
        song[i] = sampleModel(midiNoteSequence, noteDurations);
      }
    } 
    var noTranspose = true;
    for (let i=0; i < 4; i++){
      if (sectionArrangement[i].name.toString().endsWith(".3")){
        noTranspose = false;
      }
    }
    if (noTranspose){
      document.getElementById("transpositionPrompt").innerHTML = "";
      document.getElementById("transpositionEntry").style.display = "none";
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
