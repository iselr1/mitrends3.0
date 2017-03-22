angular.module('starter.controllersRea', [])
  //--------------------------------------------------------//
  //---------------CONTROLLER Fatigue-----------------------//
  //--------------------------------------------------------//
  .controller('FatigueCtrl', function($scope, $stateParams, $state, $timeout, jsonService, QuestionnaireService) {
    // to initialize the questions
    $timeout(function() {
      $scope.data = jsonService.getJson();
    }, 10);


    /* Checks if all Questions are answered
    if not, a popup informs the user about it
    if it's the case, we navigate to the next view */
    $scope.goImpressum = function() {
      /*first variable has to be the name of the view we want to navigate to
      scond is the name of the ng-modal under which we save the answers with localStorage*/
      QuestionnaireService.checkAndStore('impressum', 'Fatigue Severity Scale');
    };

    $scope.setValue = function(value, questionid) {
      QuestionnaireService.setValue(value, questionid, '9');
    };
  })
  //--------------------------------------------------------//
  //---------------CONTROLLER Msis-----------------------//
  //--------------------------------------------------------//
  .controller('MsisCtrl', function($scope, $stateParams, $state, $timeout, jsonService, $translate, $ionicPopup, QuestionnaireService) {
    // to initialize the buttons
    $timeout(function() {
      $scope.data = jsonService.getJson();
    }, 10);

    //$scope.MSISQS1 = {};
    /* Checks if all Questions are answered
    if not, a popup informs the user about it
    if it's the case, we navigate to the next view */
    $scope.goMsis2 = function() {
      /*first variable has to be the name of the view we want to navigate to
      scond is the name of the ng-modal under which we save the answers with localStorage*/
      QuestionnaireService.checkAndStore('msis2', 'MSIS Seite 1');
    };

    $scope.setValue = function(value, questionid) {
      QuestionnaireService.setValue(value, questionid, '7');
    };
  })
  //--------------------------------------------------------//
  //---------------CONTROLLER Msis2-----------------------//
  //--------------------------------------------------------//
  .controller('Msis2Ctrl', function($scope, $stateParams, $state, jsonService, QuestionnaireService, $timeout) {
    $timeout(function() {
      $scope.data = jsonService.getJson();
    }, 10);

    /* Checks if all Questions are answered
    if not, a popup informs the user about it
    if it's the case, we navigate to the next view */
    $scope.goMsis3 = function() {
      /*first variable has to be the name of the view we want to navigate to
      scond is the name of the ng-modal under which we save the answers with localStorage*/
      QuestionnaireService.checkAndStore('msis3', 'MSIS Seite 2');
    };

    $scope.setValue = function(value, questionid) {
      QuestionnaireService.setValue(value, questionid, '8');
    };
    $scope.goMsis = function() {
      $state.go('msis');
      //******ergänzen mit load function von loaclstorage******/
    };

  })
  //--------------------------------------------------------//
  //---------------CONTROLLER Msis3-----------------------//
  //--------------------------------------------------------//
  .controller('Msis3Ctrl', function($scope, $stateParams, $state, jsonService, QuestionnaireService, $timeout) {
    $timeout(function() {
      $scope.data = jsonService.getJson();
    }, 10);


    /* Checks if all Questions are answered
    if not, a popup informs the user about it
    if it's the case, we navigate to the next view */
    $scope.goMsis4 = function() {
      /*first variable has to be the name of the view we want to navigate to
      scond is the name of the ng-modal under which we save the answers with localStorage*/
      QuestionnaireService.checkAndStore('msis4', 'MSIS Seite 3');
    };

    $scope.setValue = function(value, questionid) {
      QuestionnaireService.setValue(value, questionid, '8');
    };

    $scope.goMsis2 = function() {
      $state.go('msis2');
      //******ergänzen mit load function von loaclstorage******/
    };
  })
  //--------------------------------------------------------//
  //---------------CONTROLLER Msis4-----------------------//
  //--------------------------------------------------------//
  .controller('Msis4Ctrl', function($scope, $stateParams, $state, jsonService, QuestionnaireService, $timeout) {
    $timeout(function() {
      $scope.data = jsonService.getJson();
    }, 10);



    /* Checks if all Questions are answered
    if not, a popup informs the user about it
    if it's the case, we navigate to the next view */
    $scope.goLabVideo = function() {
      /*first variable has to be the name of the view we want to navigate to
      scond is the name of the ng-modal under which we save the answers with localStorage*/
      QuestionnaireService.checkAndStore('labyrinthVideo', 'MSIS Seite 4');
    };

    $scope.setValue = function(value, questionid) {
      QuestionnaireService.setValue(value, questionid, '6');
    };

    $scope.goMsis3 = function() {
      $state.go('msis3');
    };
  })

  //--------------------------------------------------------//
  //---------------CONTROLLER ZahlSymbol Anleitung-----------------------//
  //--------------------------------------------------------//
  .controller('ZahlsymbolAnlCtrl', function($scope, $state, $ionicPopup, $ionicModal, jsonService) {
    var jsonData = jsonService.getJson();
    // Before go to ZahlSymbol Vorbereitung show popup to inform thats just the preparation and not yet the excersise
    $scope.goSD_Preparation = function() {

      var alertPopup = $ionicPopup.alert({
        title: jsonData.TITLEPOPUP_NEXTPREPZS,
        template: jsonData.TEMPLATEPOPUP_NEXTPREPZS,
        okText: jsonData.UNDERSTOOD
      });
      alertPopup.then(function() {
        $state.go('zahlsymbol1');
      })

      setTimeout(function() {
        alertPopup.close();
        $state.go('zahlsymbol1');
      }, 6000);
    };
    // Images with the according instruction text
    $scope.images = [{
      "text": "ZS-INSTRUCTION_TEXT_3",
      "src": "img/Referenztabelle.png",
      "src_glass": "img/ReferenztabelleLupe.png"
    }, {
      "text": "ZS-INSTRUCTION_TEXT_4",
      "src": "img/Lösungstabelle.png",
      "src_glass": "img/LösungstabelleLupe.png"
    }, {
      "text": "ZS-INSTRUCTION_TEXT_5",
      "src": "img/Zahlentabelle.png",
      "src_glass": "img/ZahlentabelleLupe.png"
    }];

    // To show the Modal - a view with the images fullscreen
    $scope.showImages = function(index) {
      $scope.activeSlide = index;
      $scope.showModal('templates/image-popover.html');
    }


    // Show the Modal - a view with the video
    $scope.showModal = function(templateUrl) {
      $ionicModal.fromTemplateUrl(templateUrl, {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
      });
    }
    // Close the modal
    $scope.closeModal = function() {
      $scope.modal.hide();
      $scope.modal.remove()
    };
    // Play the video in other View
    $scope.playVideo = function() {
      $scope.showModal('templates/zahlsymbolVideo.html');
    };
  })

  //--------------------------------------------------------//
  //---------------CONTROLLER Zahlsymbol Instructionvideo-----------------------//
  //--------------------------------------------------------//
  .controller('ZSVideoCtrl', function($scope, $state, $timeout) {
    $scope.hideButton = true;
    $scope.goSD = function() {
      $state.go('zahlsymbol1');
    };
    // to display the next button after 60 seconds
    $timeout(function() {
      $scope.hideButton = false;
    }, 15000);
  })

  //--------------------------------------------------------//
  //---------------CONTROLLER Zahlsymbol-----------------------//
  //--------------------------------------------------------//
  .controller('ZSCtrl', function($scope, $stateParams, $state, $timeout, $interval, $ionicPopup, SymDigService, $translate, ExcersiseStorageService) {
    //Popup zu Beginn, das besagt das die Übungsphase nun zu ende ist
    var popTitle = $translate.instant('INFO');
    var popTemplate = $translate.instant('SDTEMPLATE_POPUP');

    var correct;
    var incorrect;
    var clickFrequency = 0;
    var counter = 0;
    var results = [];
    var lastTime;
    var intervalDuration = 15000;
    var intervalrepetitions = SymDigService.getTimeExcersise() / intervalDuration;
    console.log("intervalrep" + intervalrepetitions);

    var alertPopup = $ionicPopup.alert({
      title: popTitle,
      template: popTemplate,
    });
    alertPopup.then(function() {
      functcorrincorr();
    });

    // Function after alertPopup
    functcorrincorr = function() {

      // End excersise after 120 seconds
      $interval(functioninterval, intervalDuration, intervalrepetitions);

      // Fill the keyTable with the images in a random way and the numbers ordered from 1 to 9
      var ranNums = SymDigService.doShuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      console.log(ranNums);
      $scope.keyTable = SymDigService.fillKeyTable(ranNums);

      // Generate Tables with 18 random ordered images
      $scope.solveTable = SymDigService.fillSolveTable((SymDigService.genNums([1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9], 18)));
      $scope.solveTable2 = SymDigService.fillSolveTable((SymDigService.genNums([1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9], 18)));
      $scope.solveTable2[0].next = false;
      //*****************************************************************************************
      var solveImgs = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      console.log(solveImgs);

      // Generate the Images to add to the solveTable
      $scope.solveImages = SymDigService.genSolveImages(solveImgs);
      // *****************************************************************************************
      // Function excecuted if a digit was selected, to set it to assign it to the next symbol
      // *****************************************************************************************
      // Indicates if the next digit to assign is in the first or second table
      var solveTableOneComplete = false;
      $scope.setValueImage = function(digit) {

        /*Funktion um die Längste Latenz zwischen zwei Klicks zu eruieren*/
        var lastLatency = 0;

        function onClickCheck() {
          var timeNow = (new Date()).getTime();

          if (timeNow > (lastLatency + 5000)) {
            // Execute the link action
          } else {
            alert('Please wait at least 5 seconds between clicks!');
          }
          lastLatency = timeNow;
        }

        if (!solveTableOneComplete) {
          var currentSolveTable = $scope.solveTable;
          console.log("Nächste Variable befindet sich in der oberen Tabelle")
        } else {
          var currentSolveTable = $scope.solveTable2;
          console.log("Nächste Variable befindet sich in der unteren Tabelle")
        }
        var length = currentSolveTable.length;
        // The imageName of the selected image
        console.log(length);
        for (var i = 0; i < length; i++) {
          // true if the symbol image at this position is the green image, to mark that this image is gonna be replaced with the choosen one
          console.log(i);
          if (currentSolveTable[i].next == true) {
            console.log("versuch");

            // Set the Symbol Image at the current position to the selected one
            currentSolveTable[i].numSrc = "img/" + digit.id + ".png";

            // Set the next empty Symbol Image to the green one
            if (i < (length - 1)) {
              console.log("hier2")
              currentSolveTable[i + 1].next = true;
              currentSolveTable[i].next = false;
            }

            // Check if the selected image is the one that corresponds to the number at the current position
            // imageSource of the symbol at the current[i] position
            var imgSrcSolveTable = currentSolveTable[i].imgSrc;
            // imageSource of the symbol assigned to the choosen digit
            var imgSrcKeyTable = $scope.keyTable[digit.id - 1].imgSrc;
            console.log(imgSrcSolveTable);
            console.log(imgSrcKeyTable);

            SymDigService.addResult(angular.equals(imgSrcKeyTable, imgSrcSolveTable));


            //True if the image for the last field was choosen
            if (i == (length - 1)) {
              console.log("letztes feld");
              currentSolveTable[i].next = false;
              solveTableOneComplete = true;
              $scope.solveTable2[0].next = true;
              SymDigService.addTry();
            } else if (SymDigService.getTrys() == 2) {
              //function to reload the lines with new values
              $scope.solveTable = SymDigService.fillSolveTable((SymDigService.genNums([1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9], 18)), false);
              $scope.solveTable2 = SymDigService.fillSolveTable((SymDigService.genNums([1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9], 18)), false);
              $scope.solveTable2[0].next = false;
              solveTableOneComplete = false;
              SymDigService.setTry(0);
            } else {
              break;
            }

          } else {
            //should not happen
          }
        }
      };
    };

    // Alles was im Intervall passiert
    functioninterval = function() {
      counter++;
      var partResult = SymDigService.getPartResults();
      correct = partResult.correct;
      incorrect = partResult.incorrect;
      clickFrequency = ((correct + incorrect) / ((SymDigService.getTimeExcersise() / intervalrepetitions) / 60000));

      var partresult1 = {};
      partresult1.name = "Anzahl korrekte Zuordnungen (während dem " + counter + ".Teil)";
      partresult1.value = correct;
      results.push(partresult1);
      var partresult2 = {};
      partresult2.name = "Anzahl inkorrekte Zuordnungen (während dem " + counter + ".Teil)";
      partresult2.value = incorrect;
      results.push(partresult2);
      var partresult3 = {};
      partresult3.name = "Klickfrequenz pro Minute (während dem " + counter + ".Teil)";
      partresult3.value = clickFrequency;
      results.push(partresult3);
      console.log("Zwischenresultate" + results);
      if (counter == intervalrepetitions) {
        $state.go('geschafftSD');
        // Variables to store in the result file
        var date = new Date();
        correct = SymDigService.getCorrect();
        incorrect = SymDigService.getIncorrect();
        clickFrequency = SymDigService.getClickFrequency();
        var result1 = {};
        result1.name = "Datum, Uhrzeit nach beenden der Übung";
        result1.value = date.toString();
        results.push(result1);
        var result2 = {};
        result2.name = "Anzahl korrekte Zuordnungen(insgesamt)";
        result2.value = correct;
        results.push(result2);
        var result3 = {};
        result3.name = "Anzahl inkorrekte Zuordnungen(insgesamt)";
        result3.value = incorrect;
        results.push(result3);
        var result4 = {};
        result4.name = "Klickfrequenz pro Minute(insgesamt)";
        result4.value = Math.round(clickFrequency);
        results.push(result4);
        var result5 = {};
        result5.name = "Dauer der Übung in Sekunden";
        result5.value = (SymDigService.getTimeExcersise() / 1000);
        results.push(result5);
        console.log("FinalResultate" + results);
        ExcersiseStorageService.saveResultsToFile("Zahl-Symbol Übung", results);
      } else {
        //do nothing
      }
    };
  })

  //--------------------------------------------------------//
  //---------------CONTROLLER Zahlsymbol Vorbereitung-----------------------//
  //--------------------------------------------------------//
  .controller('ZS1Ctrl', function($scope, $stateParams, $ionicPopup, $translate, $state, SymDigService, ExcersiseStorageService) {
    var popTitle = $translate.instant('INFO');
    var popTemplate = $translate.instant('TEMPLATEPOPUP_NEXTPREPZS');

    var alertPopup = $ionicPopup.alert({
      title: popTitle,
      template: popTemplate,
    });
    alertPopup.then(function() {
      var startTime = new Date().getTime();

      // Fill the keyTable with the images in a random way and the numbers ordered from 1 to 9
      var ranNums = SymDigService.doShuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      console.log(ranNums);
      $scope.keyTable = SymDigService.fillKeyTable(ranNums);


      $scope.solveTable = SymDigService.fillSolveTable((SymDigService.genNums([1, 2, 2, 3, 4, 5, 6, 7, 8, 9], 10)));

      //*****************************************************************************************
      var solveImgs = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      console.log(solveImgs);

      // Generate the Images to add to the solveTable
      $scope.solveImages = SymDigService.genSolveImages(solveImgs);
      // *****************************************************************************************
      // Function excecuted if a digit was selected, to set it to assign it to the next symbol
      // *****************************************************************************************

      $scope.setValueImage = function(digit) {

        var currentSolveTable = $scope.solveTable;

        var length = currentSolveTable.length;
        // The imageName of the selected image
        console.log(length);
        for (var i = 0; i < length; i++) {
          // true if the symbol image at this position is the green image, to mark that this image is gonna be replaced with the choosen one
          console.log(i);
          if (currentSolveTable[i].next == true) {
            console.log("versuch");

            // Set the Symbol Image at the current position to the selected one
            currentSolveTable[i].numSrc = "img/" + digit.id + ".png";

            // Set the next empty Symbol Image to the green one
            if (i < (length - 1)) {
              console.log("hier2")
              currentSolveTable[i + 1].numSrc = "img/empty.png";
              currentSolveTable[i + 1].next = true;
              currentSolveTable[i].next = false;
            }

            // Check if the selected image is the one that corresponds to the number at the current position
            // imageSource of the symbol at the current[i] position
            var imgSrcSolveTable = currentSolveTable[i].imgSrc;
            // imageSource of the symbol assigned to the choosen digit
            var imgSrcKeyTable = $scope.keyTable[digit.id - 1].imgSrc;
            console.log(imgSrcSolveTable);
            console.log(imgSrcKeyTable);
            if (angular.equals(imgSrcKeyTable, imgSrcSolveTable)) {
              SymDigService.addCorrectPrep();
            } else {
              SymDigService.addIncorrectPrep();

            }
            //True if the image for the last field was choosen
            if (i == (length - 1)) {
              var endTime = new Date().getTime();
              var results = [];
              console.log("letztes feld");

              currentSolveTable[i].next = false;

              // Reset the number of Tries
              SymDigService.setTry(0);

              $state.go('zahlsymbol');
              // Variables to store in the result file
              var durationExcersisePrep = (endTime - startTime) / 1000;
              correct = SymDigService.getCorrectPrep();
              incorrect = SymDigService.getIncorrectPrep();
              clickFrequency = Math.round((60 / durationExcersisePrep) * (correct + incorrect));
              var result1 = {};
              result1.name = "Datum, Uhrzeit nach beenden der Übung";
              result1.value = new Date().toString();
              results.push(result1);
              var result2 = {};
              result2.name = "Anzahl korrekte Zuordnungen(insgesamt)";
              result2.value = correct;
              results.push(result2);
              var result3 = {};
              result3.name = "Anzahl inkorrekte Zuordnungen(insgesamt)";
              result3.value = incorrect;
              results.push(result3);
              var result4 = {};
              result4.name = "Klickfrequenz(insgesamt)";
              result4.value = clickFrequency;
              results.push(result4);
              var result5 = {};
              result5.name = "Dauer der Übung in Sekunden";
              result5.value = durationExcersisePrep;
              results.push(result5);
              console.log("FinalResultate" + results);
              ExcersiseStorageService.saveResultsToFile("Zahl-Symbol Übung Vorbereitung", results);
            }
            break;
          } else {

          }
        }
      };
    });
  });
