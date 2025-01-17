<?php

	class SettingsMod
	{

		//DB settings
		const DB_SERVER_ADDRESS = "db"; //Best left this unless otherwise specified
		const DB_ACCOUNT = "db_user"; //Your SQL Database Login
		const DB_PASSWORD = "password"; //Your SQL Database Password
		const DB_NAME = "infocenter"; //Your SQL database name

		//Userscript Settings
		const EASY_INSTALL = false;
		const EASY_NAME = "Pardus Infocenter"; //the name you want to be displayed in the combo box
		const EASY_URL = "http://localhost"; //the exact url to your Infocenter, no trailing slashes
		const ENCRYPT_USERSCRIPT_PASSWORD = false; // if set to "true" you will only see md5 checksum instead of password in the Userscript
		const FORCE_USERSCRIPT_DOWNLOAD = false; // workaround if you experience problem with .htaccess.
												// You *MUST* activate ENCRYPT_USERSCRIPT_PASSWORD to use this.

		//Session Settings
		const SESSION_NAME = "pardus_infocenter";

		//Page Settings
		const PAGE_TITLE = "Pardus Infocenter"; //change this to what you want to appear in the title of your pages
		const PAGE_FAVICON = "favicon.ico"; // Upload a new favicon  to the main directory
		const PAGE_RECORDS_PER_PAGE = 50;
		const PAGE_STARTING_PAGE = "main"; //possible values: "combats","hacks","missions","main" (case sensitive)

		//Image Settings
		const STATIC_IMAGES = "https://static.pardus.at/img/stdhq"; //Modify this to any online image pack
		const IMAGE_LOGIN_IMAGE = "https://static.pardus.at/images/flight_school.png"; //Modify this to display a custom logo at the login page

		//Feature settings
		const ENABLE_COMBAT_SHARE = true; // set to "false" to disable
		const ENABLE_HACK_SHARE = true; // set to "false" to disable
		const ENABLE_MISSION_SHARE = false; // set to "false" to disable
		const ENABLE_PAYMENT_SHARE = false; // set to "false" to disable

		const ENABLE_COMMENTS = false; // set to "false" to disable
		const ENABLE_PUBLIC = true; // set to "false" to disable
		const PUBLIC_UNIVERSE = 'Artemis'; // set to 'Orion', 'Artemis', or 'Pegasus'

		const ENABLE_MAIN_PAGE = true; // set to "false" to disable
		const MAIN_PAGE_TITLE = "Pardus Infocenter";  //Modify this so you can change the main page title
		const MAIN_PAGE_IMAGE = "https://static.pardus.at/images/dock.jpg"; //Modify this so you can change the main page image
		const MAIN_PAGE_DESCRIPTION = "Welcome to Pardus infocenter.";  //Modify this so you can change the main page title

		//Legacy Support
		const USE_ENCRYPTED_PASSWORDS = true;	//change this to "false" *ONLY* if you want to upgrade an existing 1.5b2 installation
												//without resetting password(s); passwords must be stored in plain text
												//and not in md5 hash if you set this option to "false"
		const DB_TABLE_PREFIX = ""; //leave null on first installation and if you want to use on an existint 1.5b2;
									//if you set something here remember you *MUST* rename the tables in your db;
									//for example if you set DB_TABLE_PREFIX = "infocenter_" you *MUST* rename the tables
									//into "infocenter_account", "infocenter_combat", "infocenter_hack", "infocenter_mission"

		static $MISSION_CLEAR_TIMES = array(
			'1 day' => 1,
			'3 days' => 3,
			'1 week' => 7,
			'2 weeks' => 14,
			'1 month' => 30
		);

	}

?>
