;( function( window ) {

	'use strict';

	/**
	* Extend obj function
	*
	* This is an object extender function. It allows us to extend an object
	* by passing in additional variables and overwriting the defaults.
	*/
	function extend( a, b ) {
		for( var key in b ) { 
			if( b.hasOwnProperty( key ) ) {
				a[key] = b[key];
			}
		}
		return a;
	}

	function MobilinkProfileAlpaca( options ) {
		this.options = extend( {}, this.options );
		extend( this.options, options );
		this._init();
	}

	MobilinkProfileAlpaca.prototype.options = {
		el: "default",
		saveButton: "default",
		getPreferencesAPI: "default",
		putPreferenceAPI: "default",
		alpacaSchemaJs: "default",
		dataAlpaca: "default",
	}

	MobilinkProfileAlpaca.prototype._init = function() {
		
		var alpacaSchemaJs = this.options.alpacaSchemaJs;
		var saveButton = this.options.saveButton;
		var el = this.options.el;
		var putPreferenceAPI = this.options.putPreferenceAPI;
		// create alpaca data deault
		this.dataAlpaca = this.options.dataAlpaca;

		var functionReady = function(){
			$( saveButton ).click(function(event) {
				event.preventDefault();
				event.stopPropagation();
				event.stopImmediatePropagation();
				var control = $( el ).alpaca("get").getValue();
				
				putPreferenceAPI( JSON.stringify(control, null, "	") );
				return false;
			});
		};
		if ( alpacaSchemaJs === "default" ) {

			alpacaSchemaJs = 
			{
				"schema": {
					"type": "object",
					"required": false,
					"properties": {
						"settingNotification": {
							"type": "object",
							"required": false,
							"items": {
								"type": "object",
								"properties": {
									"settingType": {
										"type": "string",
										"title": ""
									},
									"settingLabel": {
										"type": "string",
										"title": "Loại cấu hình"
									},
									"email": {
										"type": "string",
										"title": "Nhận email"
									},
									"sms": {
										"type": "string",
										"title": "Nhận SMS"
									}
								}
							}
						}
					}
				},
				"options": {
					"type": "object",
					"legendStyle": "",
					"fields": {
						"settingNotification": {
							"id": "settingNotification",
							"name": "settingNotification",
							"type": "table",
							"label": "Cập nhật thông tin",
							"fieldClass": "form-input-80",
							"showActionsColumn": false,
							"items": {
								"fields": {
									"settingType": {
										"type": "hidden"
									},
									"settingLabel": {
										"type": "text"
									},
									"email": {
										"type": "checkbox"
									},
									"sms": {
										"type": "checkbox"
									}
								}			
							},
							"events": {
								"ready": functionReady
							}
						}
					}
				},
				"view": {
					"parent": "bootstrap-edit",
					"layout": {
						"template": "<div class='profile-alpaca'>"+
							"<style>"+
								".profile-alpaca .checkbox {margin:0 !important; padding:4px 0 0 !important; line-height:10px !important;}"+
								".profile-alpaca .checkbox label {padding:0 !important; min-height:inherit !important}"+
								".profile-alpaca .checkbox input {display:block; position:relative !important; margin:0 !important;}"+
							"</style>"+
							"<div id='binding-element'></div></div>",
						"bindings": {
								"settingNotification": "binding-element"
						}
					},
					"fields": {
						"/settingNotification/settingLabel":{
							"templates":{
								"control-text":"<span'>{{{data}}}</span>"
							}
						}
					}
				}
			};

		} else {
			alpacaSchemaJs = eval('(' + alpacaSchemaJs + ')')
		};
		
		// create alpaca object
		this.alpacaSchemaJs = alpacaSchemaJs;

		// run the events
		this._events();
		
	};
	
	MobilinkProfileAlpaca.prototype._events = function() {
		
		var vm = this
		var saveButton = vm.options.saveButton;
		
		$(document).delegate( saveButton, "click", function(event) {
			
			var el = vm.options.el;
			var putPreferenceAPI = vm.options.putPreferenceAPI;
			
			event.preventDefault();
			event.stopPropagation();
			event.stopImmediatePropagation();
			var control = $( el ).alpaca("get").getValue();
			
			putPreferenceAPI( JSON.stringify(control, null, "	") );
			return false;
			
		});
	}

	/**
	* Active MobilinkProfileAlpaca
	*/

	MobilinkProfileAlpaca.prototype.active = function() {

		var alpacaSchemaJs = this.alpacaSchemaJs;
		var dataAlpaca = this.dataAlpaca;
		var saveButton = this.options.saveButton;
		var getPreferencesAPI = this.options.getPreferencesAPI;
		var el = this.options.el;
		/**
		* Private function create alpaca
		*/
		var getDataSuccess = function getDataSuccess( dataValue ) {
		
			if ( dataValue == "" ) {
				getDataDefault();
			} else {

				/**
				
				var dataValueObj = JSON.parse( dataValue );
				var dataAlpacaStr = JSON.stringify(dataAlpaca);
				
				for (var key in dataValueObj.settingNotification) {
					if (dataAlpaca.settingNotification.hasOwnProperty(key)) {
						dataAlpaca.settingNotification[key]["email"] = dataValueObj.settingNotification[key]["email"];
						dataAlpaca.settingNotification[key]["sms"] = dataValueObj.settingNotification[key]["sms"];
					}
				}
				
				 */
				dataAlpaca = eval("(" + dataValue + ")");
				//alpacaSchemaJs.data = dataValueObj;
				alpacaSchemaJs.data = dataAlpaca;
				Alpaca($(el), alpacaSchemaJs);
			}
		
		};

		var getDataDefault = function getDataDefault( dataValue ) {
			
			alpacaSchemaJs.data = dataAlpaca;
			Alpaca( $(el), alpacaSchemaJs);
		
		};

		getPreferencesAPI( {
			success: getDataSuccess,
			error: getDataDefault
		} );

	};

	/**
	* Add to global namespace
	*/
	window.MobilinkProfileAlpaca = MobilinkProfileAlpaca;


})( window );