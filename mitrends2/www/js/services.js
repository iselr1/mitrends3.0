angular.module('starter.services', [])

  //--------------------------------------------------------//
  //---------------Service to store the results of the excersises to a file-----------------------//
  //--------------------------------------------------------//
  .factory('ExcersiseStorageService', function($state, $ionicPopup, $translate, $cordovaFile) {
    var ExcersiseStorageService = {};

    function resultsToString(excersiseName, array) {
      var i;
      var item;
      var resultString = "\r\n" + excersiseName + "\r\n";
      for (i = 0; i < array.length; i++) {
        for (item in array[i]) {
          resultString = resultString + item + ": " + array[i][item] + "\r\n";
        }
      }
      return resultString;
    }

    ExcersiseStorageService.saveResultsToFile = function(excersiseName, array) {
      var resultString;

      resultString = resultsToString(excersiseName, array);

      //save the answers to the file, with the filename, we retrieve from localStorage
      var storedTextFileName = JSON.parse(localStorage.getItem("fileName"));
      console.log(storedTextFileName);
      $cordovaFile.writeExistingFile(cordova.file.externalDataDirectory, storedTextFileName, resultString, true).then(function(result) {
        alert('Success! Results stored!');
      }, function(err) {
        console.log("ERROR");
      })
    }

    return ExcersiseStorageService;
  })

  //--------------------------------------------------------//
  //---------------Service for Questionnaires-----------------------//
  //--------------------------------------------------------//
  .factory('QuestionnaireService', function($state, $ionicPopup, $translate, $cordovaFile) {
    var QuestionnaireService = {};
    // boolean that indicates if all questions were answered
    var allAnswers = false;
    // Array with the answers of the questions
    var answers = [];
    var formattedAnswers;

    /* function to set the boolean allAnswers back to false and clear the answers array */
    QuestionnaireService.reset = function() {
      allAnswers = false;
      answers = [];
    };
    //Function to order the answer array according to his question objects
    function compare(a, b) {
      if (a.question < b.question)
        return -1;
      if (a.question > b.question)
        return 1;
      return 0;
    }
    // function to create the file name, it contains the current date and time
    function createFileName() {
      var currentDate = new Date();
      var day = currentDate.getDate();
      var month = currentDate.getMonth() + 1;
      var year = currentDate.getFullYear();
      var hours = currentDate.getHours();
      var minutes = currentDate.getMinutes();
      var seconds = currentDate.getSeconds();
      var fileName = day + "_" + month + "_" + year + "T" + hours + "_" + minutes + "_" + seconds + ".txt";
      return fileName;
    }

    function answersToString(array) {
      var i;
      var item;
      var answerString = "";
      for (i = 0; i < array.length; i++) {
        for (item in array[i]) {
          answerString = answerString + item + ": " + array[i][item] + "\r\n";
        }
      }
      return answerString;
    }

    /*function to save the answers of the questions,
    value, is the value of the radiobutton,
    questionid, is the id of the question
    numberofQuestions, is the number of questions on this page - to check afterwards the number of answered questions against this number to check if all questions were answered */
    QuestionnaireService.setValue = function(value, questionid, numberofQuestions) {
      console.log(answers.length);
      if (answers.length == 0) {
        var answer = {};
        answer.question = questionid;
        answer.value = value;
        answers.push(answer);
        console.log(answers);
        console.log(allAnswers);
      } else {
        console.log("hier");
        for (var i = 0; i < answers.length; i++) {
          console.log(answers[i].question);
          if (answers[i].question == questionid) {
            answers[i].value = value;
            break;
          } else if (i == (answers.length - 1)) {
            var answer = {};
            answer.question = questionid;
            answer.value = value;
            answers.push(answer);
          }
        }
        if (answers.length == numberofQuestions) {
          allAnswers = true;
          answers.sort(compare);
          formattedAnswers = answersToString(answers);
          console.log(formattedAnswers);
        }
        console.log(answers);
        console.log(allAnswers);
      }
    };

    /* function to check if the allAnswers boolean is true - which means that all answers were answered, then save the answers to the localStorage and navigate to the view defined as goTo.
    goTo, has to be the name of the view we want to navigate to
    modal, is the name of the ng-modal under which we save the answers with localStorage*/
    QuestionnaireService.checkAndStore = function(goTo, modal) {
      var timestring;
      console.log(modal);

      // if allAnswers true navigate to goTo and store the answers, in the end we set allAnswers back to false and clear the answers array
      if (allAnswers) {

        if (modal == "CORE") {
          console.log("kernsymp");

          var fileName = createFileName();
          //Save the answers to localStorage
          localStorage.setItem("fileName", JSON.stringify(fileName));
          $cordovaFile.writeFile(cordova.file.externalDataDirectory, fileName, formattedAnswers, true).then(function(result) {
            alert('Success! Answers stored!');
          }, function(err) {
            console.log("ERROR");
          })
        } else {
          //save the answers to the file, with the filename, we retrieve from localStorage
          var storedTextFileName = JSON.parse(localStorage.getItem("fileName"));
          console.log(storedTextFileName);
          $cordovaFile.writeExistingFile(cordova.file.externalDataDirectory, storedTextFileName, formattedAnswers, true).then(function(result) {
            alert('Success! Answers stored!');
          }, function(err) {
            console.log("ERROR");
          })

        }
        $state.go(goTo);

        //reset the function
        QuestionnaireService.reset();
      }
      // if allAnswers false inform the user that he has to answer all the answers before he can save
      else {
        var popTitle = $translate.instant('Info');
        var popTemplate = $translate.instant('Bitte wählen Sie eine Antwort für jede Aussage');

        var alertPopup = $ionicPopup.alert({
          title: popTitle,
          template: popTemplate,
        });
      }
    };

    return QuestionnaireService;
  })

  //--------------------------------------------------------//
  //---------------Service for JSON language file-----------------------//
  //--------------------------------------------------------//
  .factory('jsonService', function($rootScope, $http, $translate) {
    var jsonService = {};
    // variable with the first part of the path to the language file
    var prefix = 'js/locale-';
    // variable with the file ending of the language file
    var suffix = '.json';

    // Array to store the language variables with their translation
    jsonService.data = {};

    // initialize the json file with the currentLanguage
    var key = ($translate.proposedLanguage() || $translate.use());
    $http.get(prefix + key + suffix)
      .success(function(data) {
        jsonService.data.json = data;
        console.log('Json data is initialized');
      });

    //Gets the new json file if the language is changed
    jsonService.loadJson = function(key) {
      $http.get(prefix + key + suffix)
        .success(function(data) {
          //Array leeren
          jsonService.data.json = {};
          //Array mit neuen Werten befüllen
          jsonService.data.json = data;
          console.log('Json data is loaded');
        });
    };
    jsonService.getJson = function() {
      return jsonService.data.json;
    };

    return jsonService;
  })

  //--------------------------------------------------------//
  //---------------Service for Symbol Digit excercise-----------------------//
  //--------------------------------------------------------//
  .factory('SymDigService', function($rootScope) {
    var SymDigService = {};
    // Array für die Schlüsseltabelle
    var keyTable = [];
    // Array für die Lösungstabelle
    var solveTable = [];
    /* Objekt mit welchem die Schlüsseltabelle gefüllt werden soll
    mit Variablen, id, numSrc -> Pfad zum Bild der Zahl, imgSrc -> Pfad zum Bild des Zeichens*/
    // Array für Lösungsbilder
    var solveImages = [];
    // Anzahl der Objekte der Schlüsseltabelle
    var numberObjectsKeyTable = 9;
    // Anzahl der Objekte in der lösungstabelle
    var numberObjectsSolveTable = '';
    //Anzahl der falschen Zuordnungen bei der Vorbereitung
    var n_incorrectPrep = 0;
    //Anzahl der korrekten Zuordnungen bei der Vorbereitung
    var n_correctPrep = 0;
    //Anzahl der falschen Zuordnungen
    var n_incorrect = 0;
    //Anzahl der korrekten Zuordnungen
    var n_correct = 0;
    //Anzahl der Versuche bei der Vorbereitung
    var n_trys = 0;
    // Zeit für Zahlsymbol Übung in ms - 120 sek
    //var time = 120000:
    // Für Kundenworkshop
    // Zeitdauer, welche für die Übung zur Verfügung steht
    var timeExcersise = 5000;
    //var timeExcersise = 90000;
    // Zeit beim Start der Übung
    //var timeWhenExcersiseStart = 0;
    //Klickfrequenz (Zeit /(Anzahl Korrekte + Inkorrekte Zuordnungen))
    var clickfrequency = 0;
    // Längste Latenz (Zeit ohne Klick)
    var longestLatency = 0;
    var next_symbol = 0;

    SymDigService.data = {};
    /* Funktion um die Schlüsseltabelle mit Objekten zu befüllen*/
    SymDigService.fillKeyTable = function(ranNums) {
      keyTable = [];
      for (var i = 1; i <= numberObjectsKeyTable; i++) {
        var newObject = {};
        newObject.id = i;
        newObject.numSrc = "img/" + i + ".png";
        newObject.imgSrc = "img/SD_" + ranNums[i - 1].toString() + ".png";
        keyTable.push(newObject);
      }
      console.log(keyTable);
      return keyTable;
    }

    /* Funktion um die Schlüsseltabelle mit Objekten zu befüllen*/
    SymDigService.fillSolveTable = function(solveNums) {
      solveTable = [];
      for (var i = 1; i <= numberObjectsSolveTable; i++) {
        var newObject = {};
        if (i == 1) {
          newObject.imgSrc = "img/SD_" + solveNums[i - 1] + ".png";
          newObject.numSrc = "img/empty.png";
          newObject.next = true;
        } else {
          newObject.imgSrc = "img/SD_" + solveNums[i - 1] + ".png";
          newObject.numSrc = "img/empty.png";
          newObject.next = false;

        }
        solveTable.push(newObject);
      }
      console.log(solveTable);
      return solveTable;
    }

    /* Funktion um die Schlüsseltabelle mit Objekten zu befüllen*/
    SymDigService.genSolveImages = function(solveImgs) {
      solveImages = [];
      for (var i = 1; i <= numberObjectsKeyTable; i++) {
        var newObject = {};
        newObject.id = i;
        newObject.imgSrc = "img/b" + solveImgs[i - 1].toString() + ".png";
        solveImages.push(newObject);
      }
      console.log(solveImages);
      return solveImages;
    }
    /**************** Getters *****************/
    // Get number of incorrect assigned symbols
    SymDigService.getIncorrect = function() {
      return n_incorrect;
    }
    // Get number of correct assigned symbols
    SymDigService.getCorrect = function() {
      return n_correct;
    }
    // Get number of incorrect assigned symbols in the preparation
    SymDigService.getIncorrectPrep = function() {
      return n_incorrectPrep;
    }
    // Get number of correct assigned symbols in the preparation
    SymDigService.getCorrectPrep = function() {
      return n_correctPrep;
    }
    // Get number of trys(solved lines)
    SymDigService.getTrys = function() {
      return n_trys;
    }
    // Get the time that is allowed for the excercise
    SymDigService.getTimeExcersise = function() {
      return timeExcersise;
    }
    /*SymDigService.getTimeWhenExcersiseStart = function() {
      return timeWhenExcersiseStart;
    }*/
    // Calculate the clicks ( number of correct and incorrect assignments) divised trough the time for the excercise and return it
    SymDigService.getClickFrequency = function() {
      var temp = (n_incorrect + n_correct) / (timeExcersise / 60000);

      clickfrequency = temp;
      return clickfrequency;
    }
    // Calculate and return the longest latencency - longest time between to clicks
    SymDigService.getLongestLatency = function() {

    }
    /*SymDigService.setTimeWhenExcersiseStart = function(time) {
      timeWhenExcersiseStart = time;
    }*/
    /******************Setters *****************/
    // Set the number of incorrect assigned symbols in the preparation to the *number*
    SymDigService.setIncorrectPrep = function(number) {
      n_incorrectPrep = number;
    }
    // Set the number of correct assigned symbols in the preparation to the *number*
    SymDigService.setCorrectPrep = function(number) {
      n_correctPrep = number;
    }
    // Add one to the number of correct assignments
    SymDigService.addCorrect = function() {
      n_correct++;
      console.log("Correct:" + n_correct);
    }
    // Add one to the number of incorrect assignments
    SymDigService.addIncorrect = function() {
      n_incorrect++;
      console.log("Incorrect:" + n_incorrect);
    }
    // Add one to the number of correct assignments in the preparation
    SymDigService.addCorrectPrep = function() {
      n_correctPrep++;
      console.log("Correct:" + n_correctPrep);
    }
    // Add one to the number of incorrect assignments in the preparation
    SymDigService.addIncorrectPrep = function() {
      n_incorrectPrep++;
      console.log("Incorrect:" + n_incorrectPrep);
    }
    // Add one to the number of trys(solved lines)
    SymDigService.addTry = function() {
      n_trys++;
      console.log("Trys:" + n_trys);
    }
    // Set the number of trys to the defined *number*
    SymDigService.setTry = function(number) {
      n_trys = number;
    }

    /*Function to shuffle an given *array* of numbers and return it*/
    SymDigService.doShuffle = function(array) {
      var i = array.length,
        j = 0,
        temp;

      while (i--) {

        j = Math.floor(Math.random() * (i + 1));

        // swap randomly chosen element with current element
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;

      }
      return array;
    }

    /* Function to random generate numbers according to the specifications for the middle block*/
    SymDigService.genNums = function(array, numberObjects) {
      numberObjectsSolveTable = numberObjects;
      var arrayPosition = (array.length - 1),
        randomPosition = 0,
        minPosition = 0,
        maxPosition = numberObjects,
        temp = [],
        alength = array.length;

      // While the number of elements of the Array
      while (arrayPosition--) {
        randomPosition = Math.floor(Math.random() * (maxPosition - minPosition) + minPosition);

        // swap number at randomly chosen position(randomPosition) with number at current Position (arrayPosition)
        temp = array[arrayPosition];
        array[arrayPosition] = array[randomPosition];
        array[randomPosition] = temp;
      }
      console.log("array vor check" + array);

      // check if two equal numbers are right next to each other
      for (var i = 0; i < alength; i++) {
        // if true, then two numbers are right next to eachother
        if (array[i] == array[i + 1]) {
          console.log(array[i + 1]);
          //if true the two last numbers are equal, then the last number
          // changes the place with the number at index 2
          if (i == (alength - 2)) {
            temp = array[i + 1];
            array[i + 1] = array[2];
            array[2] = temp;
          }
          // If the two equal numbers are not the last ones, then the one at position i+1 changes place with the last number of the array
          else {
            temp = array[i];
            console.log(temp);
            array[i] = array[alength - 1];
            array[alength - 1] = temp;
            i = i - 2;
          }
        }
      }
      console.log(array);
      return array;
    }

    return SymDigService;

  });
