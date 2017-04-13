angular.module('starter.services', [])


  //--------------------------------------------------------//
  //---------------Service for JSON language file-----------------------//
  //--------------------------------------------------------//
  .factory('jsonService', function($rootScope, $http, $translate, $q) {
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
      var deferred = $q.defer();

      $http.get(prefix + key + suffix)
        .success(function(data) {
          $translate.use(key);
          //Array leeren
          jsonService.data.json = {};
          //Array mit neuen Werten befüllen
          jsonService.data.json = data;
          console.log('Json data is loaded');
          deferred.resolve();
        })
        .error(function(data) {
          deferred.reject();
        });
      return deferred.promise;
    };
    jsonService.getJson = function() {
      return jsonService.data.json;
      console.log(key);
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
    var solveTableArray = [];
    /* Objekt mit welchem die Schlüsseltabelle gefüllt werden soll
    mit Variablen, id, numSrc -> Pfad zum Bild der Zahl, imgSrc -> Pfad zum Bild des Zeichens*/
    // Array für Lösungsbilder
    var solveNumberImages = [];
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
    // Zeitdauer, welche für die Übung zur Verfügung steht (Wichtig: muss durch 15 Teilbar sein)
    var timeExcersise = 90000;
    //Klickfrequenz (Zeit /(Anzahl Korrekte + Inkorrekte Zuordnungen))
    var clickfrequency = 0;
    // Array mit korrekten und inkorrekten Antworten
    var resultsArray = [];
    // Startposition für die Auswertung der Zwischenresultate
    var startPostionPartResults = 0;

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
      console.log("Schlüsseltabelle:" + keyTable);
      return keyTable;
    }

    /* Funktion um die Lösungstabelle mit Objekten zu befüllen*/
    SymDigService.fillSolveTable = function(solveNums) {
      solveTableArray = [];
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
        solveTableArray.push(newObject);
      }
      console.log("Lösungstabelle:" + solveTableArray);
      return solveTableArray;
    }

    /* Funktion um die Zahlentabelle mit Objekten zu befüllen*/
    SymDigService.genSolveNumbers = function(solveNumberImages) {
      solveNumberImagesArray = [];
      for (var i = 1; i <= numberObjectsKeyTable; i++) {
        var newObject = {};
        newObject.id = i;
        newObject.imgSrc = "img/b" + solveNumberImages[i - 1].toString() + ".png";
        solveNumberImagesArray.push(newObject);
      }
      console.log(solveNumberImagesArray);
      return solveNumberImagesArray;
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
    /******************Setters*****************/
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
    // Reset the number of correct assignments in the preparation to zero
    SymDigService.resetCorrectPrep = function() {
      n_correctPrep = 0;
    }
    // Reset the number of incorrect assignments in the preparation to zero
    SymDigService.resetIncorrectPrep = function() {
      n_incorrectPrep = 0;
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

    SymDigService.addResult = function(result) {
      resultsArray.push(result);
      console.log("addedResult" + result);
      if (result) {
        n_correct++
      } else {
        n_incorrect++
      }
    }

    SymDigService.getPartResults = function() {
      var endPostion = resultsArray.length;
      var correct = 0;
      var incorrect = 0;
      console.log("Start" + startPostionPartResults);
      console.log("End" + endPostion);

      for (var s = startPostionPartResults; s < endPostion; s++) {
        if (resultsArray[s]) {
          correct++;
        } else {
          incorrect++;
        }
      }
      startPostionPartResults = endPostion;
      console.log("correct" + correct);
      console.log("inc" + incorrect);
      return {
        "correct": correct,
        "incorrect": incorrect
      }
    }


    return SymDigService;

  });
