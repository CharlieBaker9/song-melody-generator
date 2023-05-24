 document.addEventListener("DOMContentLoaded", function() {
      const buttons = document.querySelectorAll("#buttons button");
      for (const button of buttons) {
        button.addEventListener("click", changeButtonColor);
      }
      const doneRhythmButton = document.querySelector(".done-rhythm");
      doneRhythmButton.addEventListener("click", changeBackgroundColorToRed);
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
        var third = " note values given as space separated notes: C4 D4 E5...";
        var concatSentence = first + noteNum + second + noteNum + third; 
        textbox.innerHTML = concatSentence;
      }
    }

    selectedButtons = [];
    function changeButtonColor() {
      // If the button is not already clicked, change its color to blue.
      if (selectedButtons.indexOf(this) === -1) {
        this.style.backgroundColor = "rgb(60, 60, 145)";
        selectedButtons.push(this);
      } else {
        // If the button is already clicked, change its color back to its previous color.
        this.style.backgroundColor = "rgb(214, 211, 211)";
        selectedButtons.splice(selectedButtons.indexOf(this), 1);
      }
      //resetting after more rhythm change
      const doneRhythmButton = document.querySelector(".done-rhythm");
      doneRhythmButton.style.backgroundColor = "rgb(60, 60, 145)";
      var numNotesText = document.getElementById("num-notes");
      numNotesText.innerHTML = "Please select rhythm components in order to assign pitch";
    }