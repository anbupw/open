////////////////////////////////////////////////////////////
// SCORE v1.3
////////////////////////////////////////////////////////////

/*!
 * 
 * SCOREBOARD SETTING CUSTOMIZATION START
 * 
 */
var scoreboardSettings = {
	displayScoreBoard:true, //toggle submit and scoreboard button
	scoreBoardButton:{side:"left", offset:{x:50, y:40}}, //scoreboard button positon (left, right)
	scoreBoardSaveButton:{x:640, y:614, portrait:{x:384, y:820}}, //scoreboard save button positon
	scoreBoardTitle:"TOP 10 Scoreboard", //text for scoreboard title
	scoreRank_arr:["1st","2nd","3rd","4th","5th","6th","7th","8th","9th","10th"], //scoreboard ranking list
	scoreFormat:'[NUMBER]PTS', //score format
	totalScorePage:1, //total score pages, .e.g. 2 for 20 listing
	scoreNextText:"Next", //text for scoreboard next button
	scorePrevText:"Prev", //text for scoreboard prev button
	userIDType:"email", //user ID type 'email' or 'mobile' field
	mobileFormat:{
						matches:"999-99999999", //mobile format
						minLength:10, //mobile min length
						maxLength:12 //mobile max length
					},
	enableLevel:true, //enable to display game stage/level in scoreboard list
	scoreReverse:false, //reverse scoreboard list in descending
	scoreListingFormat:"", //return score in daily, weekly or monthly, empty string for all time (daily, weekly, monthly)
	fixedScreen:false, //enable for to fixed some old games layout issue
	topScore_arr:[{col:"RANK", percentX:17, align:"center"}, //col = table name; percentX = position x;  align = text alignment
				{col:"NAME", percentX:30, align:"left"},
				{col:"SCORE", percentX:82, align:"center"}],
	topLevelScore_arr:[{col:'RANK', percentX:17, align:'center'},
				{col:'NAME', percentX:30, align:'left'},
				{col:'LEVEL', percentX:60, align:'center'},
				{col:'SCORE', percentX:82, align:'center'}],
	dropdown:{
		default:'LEVEL',
		color:'#003D66',
		hoverColor:'#001040',
		stroke:2,
		strokeColor:'#fff',
		height:40,
		margin:20,
		offsetX:0,
		offsetY:-30
	},
	loader:{
		text:'Loading...',
		offsetY:10,
		bg:'#001040',
		bgAlpha:.7,
		bgW:180,
		bgH:50
	}
};

/*!
 * 
 * SCOREBOARD SETTING CUSTOMIZATION END
 * 
 */

var topScore_arr = [];
var scoreBoardContainer, submitScoreContainer;
var scoreTitle, bgScoreboard, bgScoreboardP, saveButton, scoreboardButton, scoreboardCloseButton, scoreNextTxt, scorePrevTxt;
$.scoreList={};
$.scoreData = {score:0, type:'', listType:'', listArray:[], settings:true, user:true};

/*!
 * 
 * SCOREBOARD ASSETS - This is the function that runs to add scoreboard assets
 * 
 */
function addScoreboardAssets(){
	manifest.push({src:'scoreboard/assets/scoreboard/bg_scoreboard.png', id:'bgScoreboard'});
	manifest.push({src:'scoreboard/assets/scoreboard/bg_scoreboard_res.png', id:'bgScoreboardRes'});
	manifest.push({src:'scoreboard/assets/scoreboard/bg_scoreboard_portrait.png', id:'bgScoreboardP'});
	manifest.push({src:'scoreboard/assets/scoreboard/button_scoreboard.png', id:'scoreboardButton'});
	manifest.push({src:'scoreboard/assets/scoreboard/button_scoreboard_close.png', id:'scoreboardCloseButton'});
	manifest.push({src:'scoreboard/assets/scoreboard/button_scoreboard_save.png', id:'scoreboardSaveButton'});
	manifest.push({src:'scoreboard/assets/scoreboard/icon_arrow.png', id:'iconArrow'});
}

/*!
 * 
 * SCOREBOARD CANVAS - This is the function that runs to build scoreboard canvas
 * 
 */
function buildScoreBoardCanvas(){
	if($.scoreData.settings){
		loadScoreSettings();
		return;
	}

	if(!scoreboardSettings.displayScoreBoard){
		return;	
	}

	topScore_arr = scoreboardSettings.topScore_arr;
	if(scoreboardSettings.enableLevel){
		topScore_arr = scoreboardSettings.topLevelScore_arr;
	}
	
	//scoreboard page
	scoreBoardContainer = new createjs.Container();

	bgScoreboard = new createjs.Bitmap(loader.getResult('bgScoreboard'));
	bgScoreboardP = new createjs.Bitmap(loader.getResult('bgScoreboardP'));
	bgScoreboardP.visible = false;

	if(!scoreboardSettings.fixedScreen){
		if(typeof viewport != 'undefined'){
			bgScoreboard = new createjs.Bitmap(loader.getResult('bgScoreboardRes'));
		}else if(forPortrait){
			bgScoreboard = new createjs.Bitmap(loader.getResult('bgScoreboardP'));
		}else{
			bgScoreboard = new createjs.Bitmap(loader.getResult('bgScoreboardRes'));
		}
	}else{
		if(forPortrait){
			bgScoreboard = new createjs.Bitmap(loader.getResult('bgScoreboardP'));
		}
	}
	
	scoreTitle = new createjs.Text();
	scoreTitle.font = "50px bariol_regularregular";
	scoreTitle.color = "#ffffff";
	scoreTitle.text = scoreboardSettings.scoreBoardTitle;
	scoreTitle.textAlign = "center";
	scoreTitle.textBaseline='alphabetic';
	scoreTitle.x = canvasW/2;
	scoreTitle.y = canvasH/100*21;
	
	scorePrevTxt = new createjs.Text();
	scorePrevTxt.font = "30px bariol_regularregular";
	scorePrevTxt.color = "#ffffff";
	scorePrevTxt.text = scoreboardSettings.scorePrevText;
	scorePrevTxt.textAlign = "left";
	scorePrevTxt.textBaseline='alphabetic';
	scorePrevTxt.x = canvasW/100 * 5;
	scorePrevTxt.y = canvasH/100*93;
	scorePrevTxt.hitArea = new createjs.Shape(new createjs.Graphics().beginFill("#000").drawRect(-100, -30, 200, 40));
	
	scoreNextTxt = new createjs.Text();
	scoreNextTxt.font = "30px bariol_regularregular";
	scoreNextTxt.color = "#ffffff";
	scoreNextTxt.text = scoreboardSettings.scoreNextText;
	scoreNextTxt.textAlign = "right";
	scoreNextTxt.textBaseline='alphabetic';
	scoreNextTxt.x = canvasW/100 * 95;
	scoreNextTxt.y = canvasH/100*93;
	scoreNextTxt.hitArea = new createjs.Shape(new createjs.Graphics().beginFill("#000").drawRect(-100, -30, 200, 40));
	
	if(!scoreboardSettings.fixedScreen){
		scorePrevTxt.x = canvasW/100 * 13;
		scorePrevTxt.y = canvasH/100*85;
		scoreNextTxt.x = canvasW/100 * 87;
		scoreNextTxt.y = canvasH/100*85;
	}
	
	scoreBoardContainer.addChild(bgScoreboard, bgScoreboardP, scoreTitle, scorePrevTxt, scoreNextTxt);
	scoreBoardContainer.visible = false;
	
	var scoreStartY = canvasH/100*28;
	var scoreSpanceY = 42.8;
	
	if(!scoreboardSettings.fixedScreen){
		if(typeof viewport != 'undefined'){
		    
		}else if(!forPortrait){
			scoreStartY = canvasH/100*27.5;
			scoreSpanceY = 38.5;
		}
	}
	
	for(scoreNum=0;scoreNum<=10;scoreNum++){
		for(scoreColNum=0;scoreColNum<topScore_arr.length;scoreColNum++){
			$.scoreList[scoreNum+'_'+scoreColNum] = new createjs.Text();
			$.scoreList[scoreNum+'_'+scoreColNum].font = "28px bariol_regularregular";
			$.scoreList[scoreNum+'_'+scoreColNum].color = "#ffffff";
			$.scoreList[scoreNum+'_'+scoreColNum].textAlign = topScore_arr[scoreColNum].align;
			$.scoreList[scoreNum+'_'+scoreColNum].textBaseline='alphabetic';
			$.scoreList[scoreNum+'_'+scoreColNum].x = canvasW/100 * topScore_arr[scoreColNum].percentX;
			$.scoreList[scoreNum+'_'+scoreColNum].y = scoreStartY;
			
			if(scoreColNum == 0){
				//position
				$.scoreList[scoreNum+'_'+scoreColNum].text = scoreboardSettings.scoreRank_arr[scoreNum-1];	
			}
			
			if(scoreNum == 0){
				$.scoreList[scoreNum+'_'+scoreColNum].text = topScore_arr[scoreColNum].col;	
			}
			
			scoreBoardContainer.addChild($.scoreList[scoreNum+'_'+scoreColNum]);
		}
		scoreStartY += scoreSpanceY;
	}
	
	//buttons
	scoreboardButton = new createjs.Bitmap(loader.getResult('scoreboardButton'));
	centerReg(scoreboardButton);
	
	scoreboardCloseButton = new createjs.Bitmap(loader.getResult('scoreboardCloseButton'));
	centerReg(scoreboardCloseButton);
	
	saveButton = new createjs.Bitmap(loader.getResult('scoreboardSaveButton'));
	centerReg(saveButton);
	
	//save button position
	saveButton.x = scoreboardSettings.scoreBoardSaveButton.x;
	saveButton.y = scoreboardSettings.scoreBoardSaveButton.y;
	
	if(typeof resultContainer != 'undefined'){
		resultContainer.addChild(saveButton);
	}

	canvasContainer.addChild(scoreBoardContainer, scoreboardCloseButton, scoreboardButton);

	//loader
	scoreBoardLoaderContainer = new createjs.Container();
	scoreLoaderTxt = new createjs.Text();
	scoreLoaderTxt.font = "25px bariol_regularregular";
	scoreLoaderTxt.color = "#ffffff";
	scoreLoaderTxt.text = scoreboardSettings.loader.text;
	scoreLoaderTxt.textAlign = "center";
	scoreLoaderTxt.textBaseline='alphabetic';
	scoreLoaderTxt.y = scoreboardSettings.loader.offsetY;

	scoreLoaderBg = new createjs.Shape();
	scoreLoaderBg.graphics.beginFill(scoreboardSettings.loader.bg).drawRect(-(scoreboardSettings.loader.bgW/2), -(scoreboardSettings.loader.bgH/2), scoreboardSettings.loader.bgW, scoreboardSettings.loader.bgH);
	scoreLoaderBg.alpha = scoreboardSettings.loader.bgAlpha;
	
	scoreBoardLoaderContainer.addChild(scoreLoaderBg, scoreLoaderTxt);
	scoreBoardLoaderContainer.x = canvasW/2;
	scoreBoardLoaderContainer.y = canvasH/2;
	scoreBoardContainer.addChild(scoreBoardLoaderContainer);

	//dropdown
	dropdownContainer = new createjs.Container();
	dropdownListContainer = new createjs.Container();
	scoreBoardContainer.addChild(dropdownContainer, dropdownListContainer);
	buildScoreboardDropdown();
	
	if(typeof buttonFullscreen != 'undefined'){
		//canvasContainer.addChild(buttonFullscreen, buttonSoundOn, buttonSoundOff);	
	}
	
	if(typeof $.editor != 'undefined'){
		if($.editor.enable){
			toggleScoreboardButton(false);
		}
	}
	
	$.get('scoreboard/submit.html', function(data){
		$('#canvasHolder').append(data);
		
		if(typeof viewport != 'undefined'){
		    
		}else if(forPortrait){
			$('#scoreHolder .title').attr('data-fontsize',50);
			$('#scoreHolder .scoreInnerContent').addClass('portrait');
		}
		
		if(typeof offset == "undefined"){
			$('#scoreHolder .scoreInnerContent').addClass('static');
		}

		if(scoreboardSettings.userIDType == 'email'){
			$('.forEmail').show();
			$('.forMobile').hide();
		}else{
			$('.forEmail').hide();
			$('.forMobile').show();
			$('#uMobile').attr('placeholder', scoreboardSettings.mobileFormat.matches);
			$('#uMobile').attr('maxlength', scoreboardSettings.mobileFormat.maxLength);
		}

		buildScoreboardButtons();
		resizeScore();
		
		if($.scoreData.user){
			loadWPUser();
			return;
		}
	});
}

function buildScoreboardDropdown(){
	if(scoreboardSettings.enableLevel){
		dropdownContainer.removeAllChildren();

		dropdownContainer.dropdownW = (canvasW/100 * scoreboardSettings.topLevelScore_arr[3].percentX) - (canvasW/100 * scoreboardSettings.topLevelScore_arr[2].percentX);
		dropdownContainer.dropdownH = scoreboardSettings.dropdown.height;
		dropdownButton = new createjs.Shape();
		dropdownButton.graphics.setStrokeStyle(scoreboardSettings.dropdown.stroke).beginStroke(scoreboardSettings.dropdown.strokeColor).beginFill(scoreboardSettings.dropdown.color).drawRect(-(dropdownContainer.dropdownW/2), 0, dropdownContainer.dropdownW, dropdownContainer.dropdownH);
		dropdownArrow = new createjs.Bitmap(loader.getResult('iconArrow'));
		centerReg(dropdownArrow);
		dropdownListBg = new createjs.Shape();

		dropdownSelectTxt = new createjs.Text();
		dropdownSelectTxt.font = "28px bariol_regularregular";
		dropdownSelectTxt.color = "#ffffff";
		dropdownSelectTxt.textAlign = 'left';
		dropdownSelectTxt.textBaseline='alphabetic';
		dropdownSelectTxt.text = $.scoreList[0+'_'+2].text;
		dropdownSelectTxt.x = ($.scoreList[0+'_'+2].x - (dropdownContainer.dropdownW/2)) + scoreboardSettings.dropdown.margin;
		dropdownSelectTxt.y = $.scoreList[0+'_'+2].y;

		dropdownButton.x = $.scoreList[0+'_'+2].x + scoreboardSettings.dropdown.offsetX;
		dropdownButton.y = $.scoreList[0+'_'+2].y + scoreboardSettings.dropdown.offsetY;
		dropdownArrow.x = (dropdownButton.x + (dropdownContainer.dropdownW/2)) - scoreboardSettings.dropdown.margin;
		dropdownArrow.y = (dropdownButton.y + (dropdownContainer.dropdownH/2));

		dropdownContainer.visible = false;
		dropdownListContainer.visible = false;
		dropdownContainer.addChild(dropdownButton, dropdownSelectTxt, dropdownArrow);

		dropdownButton.cursor = "pointer";
		dropdownButton.addEventListener("click", function(evt) {
			toggleScoreboardDropdown();
		});
		
		buildScoreboardType();
	}
}

function toggleScoreboardDropdown(con){
	if(!scoreboardSettings.enableLevel){
		return;
	}

	if(con == false){
		dropdownListContainer.visible = true;
	}

	if(dropdownListContainer.visible){
		dropdownArrow.rotation = 0;
		dropdownListContainer.visible = false;
	}else{
		dropdownArrow.rotation = 180
		dropdownListContainer.visible = true;
		dropdownListContainer.x = dropdownButton.x;
		dropdownListContainer.y = dropdownButton.y + scoreboardSettings.dropdown.height;
	}
}

function buildScoreboardType(){
	if(scoreboardSettings.enableLevel){
		if($.scoreData.listArray.length>0){
			dropdownListContainer.removeAllChildren();
			dropdownListContainer.addChild(dropdownListBg);
			dropdownContainer.visible = true;

			dropdownSelectTxt.text = $.scoreData.listType == '' ? scoreboardSettings.dropdown.default.toUpperCase() : $.scoreData.listType.toUpperCase();

			var startY = 0;
			var listH = scoreboardSettings.dropdown.height * ($.scoreData.listArray.length + 1);

			buildScoreboardTypeList(scoreboardSettings.dropdown.default, '', 'default', startY);
			startY += scoreboardSettings.dropdown.height;

			for(var i=0; i<$.scoreData.listArray.length; i++){
				if(typeof $.scoreData.listArray[i] != "undefined"){
					buildScoreboardTypeList($.scoreData.listArray[i].type.toUpperCase(), $.scoreData.listArray[i].type, i, startY);
					startY += scoreboardSettings.dropdown.height;
				}
			}

			dropdownListBg.graphics.setStrokeStyle(scoreboardSettings.dropdown.stroke).beginStroke(scoreboardSettings.dropdown.strokeColor).beginFill(scoreboardSettings.dropdown.color).drawRect(-(dropdownContainer.dropdownW/2), 0, dropdownContainer.dropdownW, listH);
		}
	}
}

function buildScoreboardTypeList(text, type, i, startY){
	$.scoreList['type_bg' + i] = new createjs.Shape();
	$.scoreList['type_bg' + i].fillCommand = $.scoreList['type_bg' + i].graphics.beginFill(scoreboardSettings.dropdown.color).command; 
	$.scoreList['type_bg' + i].graphics.drawRect(-(dropdownContainer.dropdownW/2), 0, dropdownContainer.dropdownW, scoreboardSettings.dropdown.height);
	$.scoreList['type_bg' + i].y = startY;
	$.scoreList['type_bg' + i].scoreType = type;

	$.scoreList['type_bg' + i].cursor = "pointer";
	$.scoreList['type_bg' + i].addEventListener("click", function(evt) {
		scoreListsData.newPage = 1;
		$.scoreData.listType = evt.target.scoreType;
		loadScoreboard(evt.target.scoreType);
	});

	$.scoreList['type_bg' + i].addEventListener("mouseover", function(evt) {
		evt.target.fillCommand.style = scoreboardSettings.dropdown.hoverColor;
	});

	$.scoreList['type_bg' + i].addEventListener("mouseout", function(evt) {
		evt.target.fillCommand.style = scoreboardSettings.dropdown.color;
	});

	$.scoreList['type' + i] = new createjs.Text();
	$.scoreList['type' + i].font = "30px bariol_regularregular";
	$.scoreList['type' + i].color = "#ffffff";
	$.scoreList['type' + i].textAlign = 'left';
	$.scoreList['type' + i].textBaseline='alphabetic';
	$.scoreList['type' + i].text = text;
	$.scoreList['type' + i].x = (-(dropdownContainer.dropdownW/2)) + scoreboardSettings.dropdown.margin;
	$.scoreList['type' + i].y = startY - scoreboardSettings.dropdown.offsetY;

	dropdownListContainer.addChild($.scoreList['type_bg' + i], $.scoreList['type' + i]);
}

/*!
 * 
 * SCOREBOARD BUTTONS - This is the function that runs to build scoreboard buttons
 * 
 */
function buildScoreboardButtons(){
	$('#buttonCancel').click(function(){
		goScorePage('');
	});
	
	$('#buttonSubmit').click(function(){
		submitUserScore($.scoreData.score, $.scoreData.type);
	});
	
	scoreBoardContainer.addEventListener("click", function(evt) {
		
	});
	
	scorePrevTxt.cursor = "pointer";
	scorePrevTxt.addEventListener("click", function(evt) {
		toggleScorePage(false);
	});
	
	scoreNextTxt.cursor = "pointer";
	scoreNextTxt.addEventListener("click", function(evt) {
		toggleScorePage(true);
	});
	
	saveButton.cursor = "pointer";
	saveButton.addEventListener("click", function(evt) {
		goScorePage('submit');
	});
	
	scoreboardButton.cursor = "pointer";
	scoreboardButton.addEventListener("click", function(evt) {
		toggleScoreboardPage();
	});
	
	scoreboardCloseButton.cursor = "pointer";
	scoreboardCloseButton.addEventListener("click", function(evt) {
		toggleScoreboardPage();
	});
}

function toggleScoreboardPage(){
	if(scoreBoardContainer.visible){
		scoreboardButton.visible = true;
		scoreBoardContainer.visible = false;
	}else{
		scoreboardButton.visible = false;
		goScorePage('scoreboard');
	}	
}

function toggleScoreboardButton(con){
	scoreboardButton.visible = scoreboardCloseButton.visible = con;
}

function toggleScoreboardSave(con){
	saveButton.visible = con;
}

/*!
 * 
 * DISPLAY TOP 10 SCOREBOARD - This is the function that runs to display top ten scoreboard
 * 
 */

function goScorePage(page){
	var targetContainer;
	scoreBoardContainer.visible = false;
	$('#scoreHolder').hide();
	
	switch(page){
		case 'submit':
			targetContainer = null;
			$('#scoreHolder').show();
		break;
		
		case 'scoreboard':
			targetContainer = scoreBoardContainer;
			$.scoreData.listType = '';
			loadScoreboard();
		break;
		
		case '':
			targetContainer = null;
		break;
	}
	
	if(targetContainer != null){
		targetContainer.visible = true;
		resizeScore();
	}
}

/*!
 * 
 * SUBMIT - This is the function that runs to submit user score data
 * 
 */
function submitUserScore(score, type){
	var errorCon = false;
	var errorMessage = 'Submission error:';
	var userIDValue = '';
	
	if($('#uName').val().length == 0){
		errorCon = true;
		errorMessage += '\n*Please enter your name';
	}
	
	if(scoreboardSettings.userIDType == 'email'){
		if($('#uEmail').val().length == 0){
			errorCon = true;
			errorMessage += '\n*Please enter your email';
		}
		
		if(!validateEmail($('#uEmail').val())){
			errorCon = true;
			errorMessage += '\n*Please enter a valite email';
		}

		userIDValue = $('#uEmail').val();
	}else{
		if($('#uMobile').val().length == 0){
			errorCon = true;
			errorMessage += '\n*Please enter your mobile';
		}
		
		if(!validateMobile($('#uMobile').val())){
			errorCon = true;
			errorMessage += '\n*Please enter a valite mobile';
		}

		userIDValue = $('#uMobile').val();
	}
	
	if(errorCon){
		alert(errorMessage);	
	}else{
		//proceed	
		$.ajax({
		  type: "POST",
		  url: getWPAjaxURL(),
		  data: { action:'scoreboard_add', table:getWPTable(),  name: $('#uName').val(), email: userIDValue, type:type, score:score, enableLevel:scoreboardSettings.enableLevel, format:scoreboardSettings.scoreListingFormat},
		  success: submitScoreSuccess,
		  dataType  : 'json'
		});
	}
}

function validateEmail($email) {
  var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  return emailReg.test( $email );
}

function validateMobile($mobile) {
	var validMobile = true;

	if($mobile.length < scoreboardSettings.mobileFormat.minLength){
		validMobile = false;
	}

	for(var n=0; n<$mobile.length; n++){
		var curMatch = scoreboardSettings.mobileFormat.matches.substring(n, n+1);
		var curField = $mobile.substring(n, n+1);
		if(curMatch == '9'){
			if(isNaN(curField)){
				validMobile = false;
			}
		}else if(curMatch != '9'){
			if(curMatch != curField){
				validMobile = false;
			}
		}
	}
	return validMobile;
  }

function submitScoreSuccess(data){
	if(data.status == true){
		goScorePage('');
		toggleScoreboardSave(false);
	}else{
		if(data.error == 0){
			alert('Database connection error');	
		}else{
			alert('Submission error, please try again.');	
		}
	}
}

/*!
 * 
 * LOAD DATA - This is the function that runs to load scoreboard data
 * 
 */
var scoreListsData = {page:1, newPage:1};
function toggleScorePage(con){
	if(con){
		scoreListsData.newPage++;
		scoreListsData.newPage = scoreListsData.newPage > scoreboardSettings.totalScorePage ? scoreboardSettings.totalScorePage : scoreListsData.newPage;
	}else{
		scoreListsData.newPage--;
		scoreListsData.newPage = scoreListsData.newPage < 1 ? 1 : scoreListsData.newPage;	
	}
	
	loadScoreboard($.scoreData.listType);
}

function detectScorePage(){
	if(scoreboardSettings.totalScorePage <= 1){
		scorePrevTxt.visible = scoreNextTxt.visible = false;
	}else{
		scorePrevTxt.visible = scoreNextTxt.visible = false;
		if(scoreListsData.page > 1){
			scorePrevTxt.visible = true;
		}
		
		if(scoreListsData.page < scoreboardSettings.totalScorePage){
			scoreNextTxt.visible = true;
		}
	}
}

function loadScoreboard(type){
	toggleScoreboardDropdown(false);
	toggleScoreLoader(true);

	if(scoreListsData.newPage != scoreListsData.page){
		scoreListsData.page = scoreListsData.newPage;	
	}
	
	detectScorePage();
	var pageLimit = String(((scoreListsData.page-1) * 10)+', 10');

	$.ajax({
	  type: "POST",
	  url: getWPAjaxURL(),
	  data: {action:'scoreboard_top', table:getWPTable(), type:type, reverse:scoreboardSettings.scoreReverse, limit:pageLimit, format:scoreboardSettings.scoreListingFormat},
	  success: loadScoreboardSuccess,
	  dataType  : 'json'
	});
}

function loadScoreboardSuccess(data){
	toggleScoreLoader(false);

	var listCount = (scoreListsData.page-1) * 10;
	
	for(var i=0; i<10; i++){
		$.scoreList[(i+1)+'_'+0].text = '';
		
		if(typeof scoreboardSettings.scoreRank_arr[listCount] != "undefined"){
			$.scoreList[(i+1)+'_'+0].text = scoreboardSettings.scoreRank_arr[listCount];	
		}
		
		$.scoreList[(i+1)+'_'+1].text = '';
		$.scoreList[(i+1)+'_'+2].text = '';
		if(scoreboardSettings.enableLevel){
			$.scoreList[(i+1)+'_'+3].text = '';
		}
		listCount++;
	}
	
	if(data.status == true){
		var scoreList = data.datas;
		var categoryList = data.category;
		
		if(scoreList.length>0){
			for(var i=0; i<scoreList.length; i++){
				if(typeof scoreList[i] != "undefined"){
					var scoreNum = scoreList[i].score;
					if(typeof addCommas == 'function' ) { 
						scoreNum = addCommas(scoreList[i].score);
					}
					if(typeof millisecondsToTime == 'function' ) { 
						scoreNum = millisecondsToTime(scoreList[i].score);
					}
					if(scoreboardSettings.enableLevel){
						$.scoreList[(i+1)+'_'+1].text = scoreList[i].name;
						$.scoreList[(i+1)+'_'+2].text = scoreList[i].type;

						$.scoreList[(i+1)+'_'+3].text = scoreboardSettings.scoreFormat.replace('[NUMBER]', scoreNum);
					}else{
						$.scoreList[(i+1)+'_'+1].text = scoreList[i].name;
						$.scoreList[(i+1)+'_'+2].text = scoreboardSettings.scoreFormat.replace('[NUMBER]', scoreNum);
					}
				}
			}
		}

		$.scoreData.listArray = categoryList;
		buildScoreboardType();
	}else{
		if(data.error == 0){
			alert('Database connection error');	
		}
	}
}

/*!
 * 
 * LOAD SETTINGS - This is the function that runs to load settings
 * 
 */
function loadScoreSettings(){
	$.ajax({
	  type: "POST",
	  url: getWPAjaxURL(),
	  data: {action:'scoreboard_settings', table:getWPTable()},
	  success: loadScoreSettingsSuccess,
	  dataType  : 'json'
	});	
}	

function loadScoreSettingsSuccess(data){
	if(data.status == true){
		var settingsList = data.datas;
		
		if(settingsList.length>0){
			for(var i=0; i<settingsList.length; i++){
				if(typeof settingsList[i] != "undefined"){
					scoreboardSettings = settingsList[i].settings;
					$.scoreData.settings = false;
					buildScoreBoardCanvas();
				}
			}
		}
	}else{
		if(data.error == 0){
			alert('Database connection error');	
		}
	}
}

/*!
 * 
 * RESIZE SCORE - This is the function that runs to resize score
 * 
 */
function resizeScore(){
	$('.fontLink').each(function(index, element) {
		$(this).css('font-size', Math.round(Number($(this).attr('data-fontsize'))*scalePercent));
	});
	
	$('#scoreHolder').css('width',stageW*scalePercent);
	$('#scoreHolder').css('height',stageH*scalePercent);
	
	$('#scoreHolder').css('left', (offset.left/2));
	$('#scoreHolder').css('top', (offset.top/2));
	
	$('#scoreHolder .scoreInnerContent').css('width',contentW*scalePercent);
	$('#scoreHolder .scoreInnerContent').css('height',contentH*scalePercent);
	
	var spaceTop = (stageH - contentH)/2;
	var spaceLeft = (stageW - contentW)/2;
	$('#scoreHolder .scoreInnerContent').css('left', spaceLeft*scalePercent);
	$('#scoreHolder .scoreInnerContent').css('top', spaceTop*scalePercent);
	
	if (typeof scoreboardButton != "undefined") {
		if(scoreboardSettings.scoreBoardButton.side == 'left'){
			scoreboardButton.x = scoreboardCloseButton.x = offset.x + scoreboardSettings.scoreBoardButton.offset.x;
			scoreboardButton.y = scoreboardCloseButton.y = offset.y + scoreboardSettings.scoreBoardButton.offset.y;
		}else{
			scoreboardButton.x = scoreboardCloseButton.x = (canvasW - offset.x) - scoreboardSettings.scoreBoardButton.offset.x;
			scoreboardButton.y = scoreboardCloseButton.y = offset.y + scoreboardSettings.scoreBoardButton.offset.y;
		}
	}
	
	if(scoreboardSettings.fixedScreen){
		$('#scoreHolder .scoreInnerContent').addClass('extraGap');	
	}
	
	if(typeof viewport != 'undefined' && typeof scoreBoardContainer != 'undefined'){
		scoreTitle.x = canvasW/2;
		scoreTitle.y = canvasH/100*21;

		scorePrevTxt.x = canvasW/100 * 5;
		scorePrevTxt.y = canvasH/100*93;
		
		scoreNextTxt.x = canvasW/100 * 95;
		scoreNextTxt.y = canvasH/100*93;

		if(!scoreboardSettings.fixedScreen){
			scorePrevTxt.x = canvasW/100 * 13;
			scorePrevTxt.y = canvasH/100*85;
			scoreNextTxt.x = canvasW/100 * 87;
			scoreNextTxt.y = canvasH/100*85;
		}
		
		var scoreStartY = canvasH/100*28;
		var scoreSpanceY = 42.8;
		if(!scoreboardSettings.fixedScreen){
			if(viewport.isLandscape){
				scoreStartY = canvasH/100*27.5;
				scoreSpanceY = 38.5;
			}
		}

		for(scoreNum=0;scoreNum<=10;scoreNum++){
			for(scoreColNum=0;scoreColNum<topScore_arr.length;scoreColNum++){
				$.scoreList[scoreNum+'_'+scoreColNum].x = canvasW/100 * topScore_arr[scoreColNum].percentX;
				$.scoreList[scoreNum+'_'+scoreColNum].y = scoreStartY;
			}
			scoreStartY += scoreSpanceY;
		}
		
		if(viewport.isLandscape){
			//landscape
			bgScoreboard.visible = true;
			bgScoreboardP.visible = false;
			
			$('#scoreHolder .title').attr('data-fontsize',80);
			$('#scoreHolder .scoreInnerContent').removeClass('portrait');
			
			//save button position
			saveButton.x = scoreboardSettings.scoreBoardSaveButton.x;
			saveButton.y = scoreboardSettings.scoreBoardSaveButton.y;
		}else{
			bgScoreboard.visible = false;
			bgScoreboardP.visible = true;
			
			$('#scoreHolder .title').attr('data-fontsize',50);
			$('#scoreHolder .scoreInnerContent').addClass('portrait');
			
			//save button position
			saveButton.x = scoreboardSettings.scoreBoardSaveButton.portrait.x;
			saveButton.y = scoreboardSettings.scoreBoardSaveButton.portrait.y;
		}

		buildScoreboardDropdown();
	}
}

/*!
 * 
 * LOAD USER - This is the function that runs to load user
 * 
 */
function loadWPUser(){
	$.ajax({
	  type: "POST",
	  url: getWPAjaxURL(),
	  data: {action:'scoreboard_user', table:getWPTable()},
	  success: loadWPUserSuccess,
	  dataType  : 'json'
	});	
}

function loadWPUserSuccess(data){
	if(data.status == true){
		var settingsList = data.datas;
		
		$('#uName').val(data.name);
		$('#uEmail').val(data.email);
	}else{

	}
}

/*!
 * 
 * WP Function - This is the function that runs for wordpress function
 * 
 */
function getWPTable(){
	var href = window.location.href;
	return href.match(/([^\/]*)\/*$/)[1];
}

function getWPAjaxURL(){
	var ajaxURL = window.location.origin;
	var pathArray = window.location.pathname.split('/');
	for(var n=0; n<pathArray.length; n++){
		if(pathArray[n] == 'sfhg_games'){
			n = pathArray.length;
		}else{
			ajaxURL += '/' + pathArray[n];
		}
	}
	ajaxURL = ajaxURL + '/wp-admin/admin-ajax.php';
	return ajaxURL;
}

/*!
 * 
 * SCORE LOADER - This is the function that runs to toggle score loader
 * 
 */
function toggleScoreLoader(con){
	scoreBoardLoaderContainer.visible = con;
}