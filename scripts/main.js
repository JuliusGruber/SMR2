jQuery.ajaxSettings.traditional = true;


require([
  '$api/models',
  'scripts/apiKey',
  'scripts/generatePlaylistButton',
  'scripts/setupSlider',
  'scripts/echonestDynamic',
  'scripts/setupSwitchViewButton',
  'scripts/setupGenreFilter',
  'scripts/yearPickerSetup',
  'scripts/echonestGenreData', 
  'scripts/customplaylist',
  'scripts/jPagesSetup',
  'scripts/setupNoveltyCheckBoxes',
  'scripts/playlistInformation',
  //'scripts/yearSlider',
  'scripts/setupSimilarityRadioButtons',
  'scripts/setupRandomPlayButton'
  
], function( models, apiKey, generatePlaylistButton,setupSlider, 
		echonestDynamic,setupSwitchViewButton, setupGenreFilter,yearPickerSetup,
		echonestGenreData, customplaylist,jPagesSetup, setupNoveltyCheckBoxes, 
		playlistInformation,/* yearSlider,*/ setupSimilarityRadioButtons, setupRandomPlayButton) {
	'use strict';
 
	/**load a page when the app is started*/
	$(document).ready(loadpage()); 
  	  
	/**detect when app goes offline*/
	models.session.addEventListener('change', loadpage);
	  
	 
	/**
	 * Check if connected to the internet and if a track is currently playing.
	 * Load a page according to the state: 
	 * 	- online : 			pages/main.html
	 * 	- offline: 			pages/offline.html
	 * 	- nothing playing: 	pages/intro.html
	 */
	function loadpage(){
		models.session.load('online').done(function(session){
			var online = models.session.online;
			
			if(online){
				console.log("app is online");
				
				var playing;
				models.player.load('track').done(function(player){
					playing = models.player.track;
					console.log("currently playling: "+playing);
					
					
					$('#main').load('pages/main.html',function(){
						console.log("main loaded");
						init();
					});
					  
					if(!playing){
						  
						$('#overlay-wrapper').load('pages/intro.html',function(){
							console.log("no tracks playing. showing intro.");
							models.player.addEventListener('change', removeoverlay);
							setupRandomPlayButton.setupPlayButton();
						});
					}
					  
				});
				  
			}
			else if(!online){
				console.log("app is offline");
				$('#main').load('pages/offline.html',function(){
					console.log("no internet connection. offline page showing.");
				});
			}
		});
	}
  
	/**
	 * Init the scripts.
	 */
	function init(){
		  
		console.log("init scripts");
		  
		//enter developer name here
		apiKey.setEchonestApiKey('Julius'); 
		  
		
		playlistInformation.setUpPlaylistInformation();

		setupGenreFilter.setupGenreFilter(echonestDynamic);

		yearPickerSetup.setUpYearPicker();
		
		setupNoveltyCheckBoxes.setUpExcludeSeedArtistCheckBox();
		setupNoveltyCheckBoxes.setUpNoSongsFromSpotifyCollectionCheckBox();

		generatePlaylistButton.setUpNextSongsButton();

		setupSimilarityRadioButtons.setupSimilarityButtons();
		setupSlider.setUpPopSlider(echonestDynamic);
		setupSlider.setUpHotSlider(echonestDynamic);
		setupSlider.setUpSongHotSlider(echonestDynamic);
		setupSlider.setUpArtistVarietySlider(echonestDynamic);
		setupSlider.setUpAdventurousnessSlider(echonestDynamic);
		
		setupSwitchViewButton.setupFlipButton();

		jPagesSetup.setupPages();

		echonestDynamic.startNewSession();

		customplaylist.setupSubscribeButton();
		
		//setup tooltip function
		$(document).tooltip({
			content: function() {
				var element = $( this );
				if ( element.is( "[title]" ) ) {
					return element.attr( "title" );
				}
			}
		});
		
		$("#tagcloud-wrapper").tooltip({
			  position: {
			    my: "center bottom",
			    at: "center bottom"
			  }
		});
	}
	  
	function removeoverlay(){
		var playing;
		models.player.load('track').done(function(player){
			playing = models.player.track;
		});
		if(playing){
			$('#intro').remove();
			$('#main').load('pages/main.html',function(){
				console.log("main loaded");
				init();
				models.player.removeEventListener('change', removeoverlay);
			});
		}
		  
	}
	
});
