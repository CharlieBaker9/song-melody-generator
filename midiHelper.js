// Instantiate the model by loading the desired checkpoint.
const music_vae = new mm.MusicVAE(
  'https://storage.googleapis.com/download.magenta.tensorflow.org/' +
  'tfjs_checkpoints/music_vae/trio_4bar_lokl_small_q1');
const music_rnn = new mm.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/basic_rnn')
const midime = new mm.MidiMe({epochs: 100})
const player = new mm.Player();
let quantNoteSeq1 = null;
let sample = null;
let playableSample = null;
var write = null;

export function makeMidiFile(midiNoteSequence, noteDurations){
  const track = new MidiWriter.Track();

  // Define an instrument (optional):
  track.addEvent(new MidiWriter.ProgramChangeEvent({instrument: 1}));

  // Add some notes:
  console.log(midiNoteSequence.length);
  console.log(noteDurations.length);
  for (let i = 0; i < midiNoteSequence.length; i++){
    var note = new MidiWriter.NoteEvent({pitch: midiNoteSequence[i], duration: noteDurations[i]})
    track.addEvent(note);
  }

  // Generate a data URI
  write = new MidiWriter.Writer(track);
  console.log(write.dataUri());
}

export const playMelody = async() => {
  if (write != null){
    //const blob = dataURItoBlob(write.dataUri());
    console.log(write.dataUri);
    // const file = write.files[0];
    // noteSeq = await mm.blobToNoteSequence(file)
    // quantNoteSeq = mm.sequences.quantizeNoteSequence(noteSeq, 4)
    // player.start(quantNoteSeq)






    // mm.Player.tone.context.resume();
    // var noteSeq = mm.blobToNoteSequence(write.dataUri())
        
    //     // Quantize the note sequences in order to use with the different magenta functions
    // var quantNoteSeq = mm.sequences.quantizeNoteSequence(noteSeq, 4)

    // player.start(quantNoteSeq)

    // console.log("Write has a midi file in it");
    // // // Pass the MIDI data URI to the load() method of the MIDI object.
  
    // const midi = MIDI.parse("data:audio/midi;base64," + write.dataUri());
    // // // Call the play() method of the MIDI object.
    // midi.play();
  } else {
    var textbox = document.getElementById("make-melody-errors");
    textbox.innerHTML = "Please click the 'Process Notes' button before continuing"
  }
}

export const transpose = () => {

}

export const playSong = () => {
  
}




export const download = () => {
// Taken from https://stackoverflow.com/q/64179468
const magentaMidi = mm.sequenceProtoToMidi(playableSample);
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

export const train = async () => {
// Turn the train button off
document.getElementById("train").style.display = "none";
document.getElementById("initialization").style.visibility = "visible";
// Initialize the RNN for continueSequence and the vae for interpolate
await music_rnn.initialize()
await music_vae.initialize()
await midime.initialize()

document.getElementById("initialization").style.visibility = "hidden";
const data = await music_vae.encode([quantNoteSeq1])
let epochDisplayText = document.getElementById("epochsText")
await midime.train(data, async (epoch, logs) => {
  epochDisplayText.innerHTML = "Epoch " + (epoch + 1) + " / 100"
})
}

export const sampleModel = async () => {
// get one sample
sample = await midime.sample(8)
const sequences = await music_vae.decode(sample)
playableSample = mm.sequences.concatenate([...sequences])
}

export const playSample = async () => {
// You need to resume this in order to get sound
mm.Player.tone.context.resume();
player.start(playableSample)
}