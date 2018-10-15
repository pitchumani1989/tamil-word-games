/**
 *   Copyright 2014 Richard Rulach 
 *   Licensed under the Apache License, Version 2.0 (the "License"); 
 *   you may not use this file except in compliance with the License. 
 *
 *   You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0 
 *
 *   Unless required by applicable law or agreed to in writing, 
 *   software distributed under the License is distributed on 
 *   an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
 *   either express or implied. See the License for the specific 
 *   language governing permissions and limitations under the License
**/

// SET UP GLOBAL DISPLAY PARAMETERS
var GRID_SIZE = 25;
var HORIZONTAL_BOXES = 15;
var VERTICAL_BOXES = 15;
var RUN_PROFILER = false;
var REVEAL_LETTERS = 0;

var GRID_WIDTH = GRID_SIZE * HORIZONTAL_BOXES;
var GRID_HEIGHT = GRID_SIZE * VERTICAL_BOXES;

// UPDATE FUNCTIONS FOR THE GLOBAL DISPLAY SETTINGS
function updateBoxSize(numPixels){
    GRID_SIZE = numPixels;
    GRID_WIDTH = GRID_SIZE * HORIZONTAL_BOXES;
    GRID_HEIGHT = GRID_SIZE * VERTICAL_BOXES;
}

function updateGridSize(horizontal,vertical){
    if (horizontal > 0) HORIZONTAL_BOXES = horizontal;
    if (vertical > 0) VERTICAL_BOXES = vertical;
    
    GRID_WIDTH = GRID_SIZE * HORIZONTAL_BOXES;
    GRID_HEIGHT = GRID_SIZE * VERTICAL_BOXES;
}

function btnAddWords_click(){
	if ($('#txtWords').val().length != 0) {
		
		    // textarea is empty or contains only white-space
		    $('.loading').show();
		    //  MAKES SURE THE LOADING ANIMATION RUNS 
		    //  FOR A SECOND TO SHOW ACTIVITY
		    setTimeout(run,100);
    	}
    	else
    	{
    		alert('Please enter the words to generate puzzle')
    	}
}

function btnPrint_click(){
    PrintCrossword();
}


function LoadSampleData(){
    $('#txtWords').val(
        'கரி, விறகை எரித்தால் கிடைப்பது\n' + 
        'கல்லணை, கரிகாலன் கட்டிய அணை\n' +
        'மரம், வீட்டுக்கு ஒரு, "இது" வளர்ப்போம்\n' + 
        'ஆப்பிள், தினம் ஒரு, "இது" சாப்பிட்டால், டாக்டர் கிட்டே வர மாட்டார்\n' +
        'தேன், தேனீக்கள் சேகரிப்பது\n' +
        'பாறை, மலைகளில் இருக்கும் பெரிய பெரிய கற்களை இப்படி குறிப்பிடுவர்\n' +
        'சுற்றுலா, உள்ளத்தை மகிழ்விக்கும் இனிய பயணம்\n' +
        'கன்று, பசு ஈன்ற சிசு.\n' +
        'நிலம், ஐம்பூதங்களில் ஒன்று.\n' +
        'ஊர்வலம், உலக சமாதானம் வேண்டி இளைஞர்கள் அமைதி ------ போனார்கள்\n' +
        'விமானம், ஏரோப்ளேன் - தமிழாக்கம்\n' +
        'சர்க்கரை, கரும்பிலிருந்து தயாரிக்கப்படும் இனிப்பு\n' +
        'உடும்பு, உறுதியான பிடிப்பிற்கு இந்த உயிரினத்தை உதாரணமாக சொல்லலாம்.\n' +
        'புல், கால்நடைகளுக்கு உணவாக பயன்படும் ஒன்று.\n' +
        'தேனீர், டீ - தமிழில். \n' +
       'ரவை, உப்புமா செய்ய பயன்படுவது.\n' +
       'பசி, உணவு உண்ணத் துாண்டும் உணர்வு.' 
        );
}

function run(){

    xWords.Reset();

    canvas.width = GRID_WIDTH;
    canvas.height = GRID_HEIGHT;

    canvasQuestion.width = GRID_WIDTH;
    canvasQuestion.height = GRID_HEIGHT;

    contextQuestion.clearRect(0, 0, GRID_WIDTH, GRID_HEIGHT);
    context.clearRect(0, 0, GRID_WIDTH, GRID_HEIGHT);


    contextQuestion.beginPath();
    contextQuestion.lineWidth = 1;
    contextQuestion.strokeStyle = "grey";

    context.beginPath();
    context.lineWidth = 1;
    context.strokeStyle = "grey";


    DrawGrid();

    // FONT SIZE IS 80% SIZE OF EACH SQUARE
    var fontSize = Math.floor(GRID_SIZE * 0.8);


    var smallFontSize = Math.floor(GRID_SIZE * 0.35);
    if (GRID_SIZE < 34) smallFontSize = 12;


    context.font = fontSize.toString() + "px _sans";
    context.textBaseline = "middle";


    var contextQuestionSmallFont = smallFontSize.toString() + "px _sans";
    var contextQuestionLargeFont = fontSize.toString() + "px _sans";

    // GENERATE ARRAY OF WORDS TO PUT INTO THE CANVAS
    var rawData = $('#txtWords').val();
    var aValues = rawData.split('\n');

    // GET THE CROSSWORD 
    if (RUN_PROFILER) console.clear();
    if (RUN_PROFILER) console.profile('xWords.Create()');

    var crossword = xWords.Create(
        VERTICAL_BOXES,
        HORIZONTAL_BOXES,
        aValues);
    
   
    if (RUN_PROFILER) console.profileEnd();

    // GET THE GRID WITH NUMBERS
    var qGrid = xWords.GetQuestionGrid();
    for (var i = 0; i < crossword.length; i++){
        for (var j = 0; j < crossword[i].length; j++){
            if (crossword[i][j].length == 0){
                contextQuestion.rect(i*GRID_SIZE,j*GRID_SIZE, GRID_SIZE, GRID_SIZE);
                contextQuestion.fill();

                context.rect(i*GRID_SIZE,j*GRID_SIZE, GRID_SIZE, GRID_SIZE);
                context.fill();
            } else {

                if (qGrid[i][j].length > 0){

                    var qAdjustW = GRID_SIZE * 0.05;
                    var qAdjustH = GRID_SIZE * 0.3;

                    if (GRID_SIZE < 34) {
                        qAdjustW = 1.9;
                        qAdjustH = 10.6;
                    } 


                    contextQuestion.font = contextQuestionSmallFont;
                    contextQuestion.textBaseline = "alphabetic";
                    contextQuestion.fillText(qGrid[i][j],
                      i*GRID_SIZE + qAdjustW, 
                      j*GRID_SIZE + qAdjustH);

                    contextQuestion.stroke();
                }


                if (REVEAL_LETTERS > 0){
                    if (Math.floor(Math.random() * 100) < 
                        REVEAL_LETTERS){

                        contextQuestion.font = contextQuestionLargeFont;
                        contextQuestion.textBaseline = "middle";
                        var x1 = Math.round((GRID_SIZE - 
                        contextQuestion.measureText(crossword[i][j]).width) / 2);
                        contextQuestion.fillText(crossword[i][j],
                          i*GRID_SIZE + x1 - 0.5, 
                          j*GRID_SIZE + (GRID_SIZE/2));
                        contextQuestion.stroke();

                    }
                }


                var x = Math.round((GRID_SIZE - 
                context.measureText(crossword[i][j]).width) / 2);
                context.fillText(crossword[i][j],
                  i*GRID_SIZE + x - 0.5, 
                  j*GRID_SIZE + (GRID_SIZE/2));
            }
        }
    }

    contextQuestion.stroke();
    contextQuestion.closePath();

    context.stroke();
    context.closePath();


    // DISPLAY CLUES AND UNUSED WORDS
    DisplayClues();

    DisplayErrors();


    $('#downloadQuestion').prop('href', canvasQuestion.toDataURL('image/png'));
    $('#downloadAnswer').prop('href', canvas.toDataURL('image/png'));

    $('#mainContainer').show();
    $('.loading').hide();

    $('html, body').animate({
        scrollTop: $("#topContainer").offset().top
    }, 400);
}



function DisplayErrors(){
    $('#errors').html("<h4>ERRORS</h4>");
    $('#errors').append(xWords.sErrors);
}

function DisplayClues(){

    $('#across').html("<h4>ACROSS</h4>");
    $('#down').html("<h4>DOWN</h4>");
    $('#unused').html("<h4>UNUSED</h4>");

    var unusedList = xWords.GetUnusedWords();
    for (var x = 0; x < unusedList.length; x++){
        $('#unused').append(
            '<div>' + 
            unusedList[x] + 
            '</div>');
    }

    var qList = xWords.GetQuestionList();

    for (var i = 0; i < qList.length; i++){

        switch (qList[i].d){

            case xWords.HORIZONTAL :
                $('#across').append(
                    '<div>' + 
                    qList[i].num + 
                    '. ' + 
                    qList[i].clue + 
                    '</div>');
                break;
                
            case xWords.VERTICAL :
                $('#down').append(
                    '<div>' + 
                    qList[i].num + 
                    '. ' + 
                    qList[i].clue + 
                    '</div>');
                break;
                
        }

    }
}

function DrawGrid(){
    for (var i = 0; i <= GRID_WIDTH; i+=GRID_SIZE){

        contextQuestion.moveTo(i,0);
        contextQuestion.lineTo(i,GRID_HEIGHT);
        contextQuestion.stroke();

        context.moveTo(i,0);
        context.lineTo(i,GRID_HEIGHT);
        context.stroke();
    }

    for (var i = 0; i <= GRID_HEIGHT; i+=GRID_SIZE){

        contextQuestion.moveTo(0, i);
        contextQuestion.lineTo(GRID_WIDTH, i);
        contextQuestion.stroke();

        context.moveTo(0, i);
        context.lineTo(GRID_WIDTH, i);
        context.stroke();
    }
}

function PrintCrossword()
{
    var html="<!DOCTYPE html><html>";
    html += '<head>';

    html += '<style>';
    html += ' .sectionContainer { text-align:center;margin-top:20px;}';
    html += ' img { border:2px solid black; }';
    html += ' .cluesLeft { float:left; text-align:left; width:190px; }';
    html += ' .cluesRight { float:right;text-align:left; width:190px; margin:left:30px; }';
    html += ' .outerClues { width:100%; text-align:center; }';
    html += ' .innerClues { background-color:blue;width:400px; margin:0px auto; }';
    html += ' header { text-align:center;  }';
    html += ' header, .innerClues, .outerClues {font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; }'
    html += ' br { clear: both; }';
    html += ' @media print{ .noprint { display: none !important;}}';
    html += '</style>';
    html += '</head><body>';
    html += '<input class="noprint" type="button" value="print" onclick="window.print();window.focus();" />';
    html += '<header>';

    if ($('#txtCrosswordTitle').val().trim().length > 0){
        html += '<h1>' + $('#txtCrosswordTitle').val().trim() + '</h1>';
    } else {
        html += '<h1>Tamil crossword puzzle</h1>';
    }

    html += '</header></div>';

    if (($("#rdAll").prop("checked"))||
        ($("#rdQuestion").prop("checked"))){

        html += '<div class="sectionContainer">';
        html += '<img src="' +
            canvasQuestion.toDataURL('image/png') + '" />';
        html += '</div>';


        html += '<div class="outerClues">';
        html += '<div class="innerClues">';

        html += '<div class="cluesLeft">' +    $('#across').html() + 
                '</div>';

        html += '<div class="cluesRight">' +    $('#down').html() + 
                '</div>';

        html += '</div>';
        html += '</div>';
        html += '<br />';
    }


    if (($("#rdAll").prop("checked"))||
        ($("#rdAnswers").prop("checked"))){

        html += '<div class="sectionContainer">';
        html += '<img src="' +
            canvas.toDataURL('image/png') + '" />';
        html += '</div>';
        html+="</body></html>";
    }

    var printWin = window.open('','','scrollbars=1');
    printWin.document.write(html);
    printWin.document.close();
    printWin.focus();
}
