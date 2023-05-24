function convertNotesToMidi(notes) {
  // Create a new MIDI track.
  var track = new MIDI.Track();

  // Add a note on event for each note in the list.
  for (var i = 0; i < notes.length; i++) {
    var note = notes[i];
    var noteOn = new MIDI.NoteOnEvent(0, note.pitch, note.velocity);
    track.append(noteOn);
  }

  // Add a note off event for each note in the list.
  for (var i = 0; i < notes.length; i++) {
    var note = notes[i];
    var noteOff = new MIDI.NoteOffEvent(0, note.pitch, note.velocity);
    track.append(noteOff);
  }

  // Save the MIDI file.
  var midiFile = new MIDI.File();
  midiFile.addTrack(track);
  midiFile.write("my_midi_file.mid");
}