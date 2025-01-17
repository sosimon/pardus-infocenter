# PARDUS INFOCENTER v1.6

## ABOUT
This tool is designed for sharing combat logs, hacks, bulletin board missions, and payments between large groups of people. It consists of two parts: the website and the Greasemonkey script. The website is written in PHP and is supposed to be installed by an IT-responsible person. The GM script requires Firefox and Greasemonkey to use.

This tool was previously known as the Combat Logger and was written in ASP.

## REQUIREMENTS
In order to install and use the Pardus Infocenter, you must have a web host that has PHP and allows you to access the SQL server.

To use the Greasemonkey script (which is included), Firefox and the Greasemonkey extension are required.

Have tested successfully with:
* PHP 7.4
* MySQL 8.0

## DEVELOPMENT
Assuming docker and docker-compose is installed in your environment:
```
docker-compose up --build
```
Point the user script to http://localhost/infocenter

## PRODUCTION

### Deploy

#### DB
* Install MySQL (set a root password)
* As root, create db_user and database (run `./mysql/init-prod.sql`)
* As db_user, create the tables (run `.mysql/db.sql`)

#### App
* Install PHP, Apache, and php mods
```
sudo apt install -y \
  mysql-server \
  php7.4 \
  apache2 \
  php-mysql \
  php-xml
```
* Configure Apache (example config in `./apache/parduslogger.com.conf`)
* Enable ssl mod - `sudo a2enmod ssl`
* Copy SSL certs to `/etc/apache2/ssl/` (referenced in Apache config)
* Clone repo from Github
* Copy `infocenter/` folder to whereever you configured Apache to serve from
* Override `modules/setting_mod.php` with database connection info and the URL in `pardus_infocenter_share.user.js`
```
sed -i 's/http:\/\/localhost/https:\/\/www.parduslogger.com/g' /var/www/parduslogger.com/infocenter/pardus_infocenter_share.user.js
```

## UPGRADE
0) If you have 1.5b2.005 or any other 1.5x version installed, import "/mysql/upgrade-1.6.sql" in phpMyAdmin
1) Upload the content of the "/infocenter" folder to the appropriate folder on your web host.

## FIRST INSTALLATION
1) Create a new database and import "/mysql/db.sql" in phpMyAdmin
a. Alternatively, if you don't have any other installations of the Pardus Infocenter, you could import "/mysql/db.sql" into an existing database.
2) Rename "/infocenter/modules/sample.settings_mod.php" to "/infocenter/modules/settings_mod.php", open it and specify your "DB Settings."
3) Upload the content of the "/infocenter" folder to the appropriate folder on your web host.
4) Go to "http://www.yourdomain.com/(path)/infocenter" and test your login and password. Default logins are the following (Login/Password, case sensitive):
a. Orion-Admin/Pardus
b. Artemis-Admin/Pardus
c. Pegasus-Admin/Pardus
5) If you log in successfully, proceed to download and test the Greasemonkey Script. If not, go back to step 2 and make sure that your settings are correct.
6) Change the password on the root account, or create an account for yourself and delete the root account.
7) Your setup should be finished. See the next section for options on how to customize your installation.

## CUSTOMIZATION
### MAIN PAGE
In this version of the Pardus Infocenter, you have the option to customize and create your very own main page.
1) Go to "/modules/settings_mod.php" and change the values of MAIN_PAGE_TITLE, MAIN_PAGE_IMAGE and MAIN_PAGE_DESCRIPTION;
2) If you wish a deeper customization, open "/main.php" and edit accordingly.

If you feel that you do not want "main.php" to be your main page, then follow these steps:

1) Go to "/modules/settings_mod.php"
2) Find the following line:
		const PAGE_STARTING_PAGE = "main";
3) Change "main" to one of the other options listed (combats/hacks/mission).
4) Find the following line:
		const ENABLE_MAIN_PAGE = true;
5) Change "true" to "false."

### IMPORTING DATA
If you are updating your Infocenter or migrating from a different source, you can import old data into your new database.
1) Log into phpMyAdmin.
2) Select the Database where you installed the "db.sql."
3) Click "Export."
4) Select the appropriate tables (account/combat/hack/mission).
5) Uncheck Structure if you are moving to a DB that already has Infocenter information, otherwise leave it checked. Check off "IF NOT EXISTS."
6) Change the "Maximal length of created query" to "9999999999."
7) Change "Export type" to "UPDATE" if you are moving to a DB that already has Infocenter information.
8) Check off "Save as file."
9) Click "Go."
10)  Go to your new Database.
11)  Click "Import" and select the file you downloaded.
12)  Import.
13)  Check your Infocenter Website and make sure that the files transferred.

### DELETING
Currently, it is not possible to delete entries without access to the SQL Database. If you feel it is necessary to clear logs, for whatever reason, do the following:
1) Log into phpMyAdmin
2) Select the Database where you installed the "db.sql"
3) Select the appropriate table (combat/hack/mission)
4) Check off the appropriate entries and click to "Delete"
5) Confirm you want to delete.
6) Check the website and make sure the files were deleted.

# DISCLAIMER
This Pardus Infocenter is distributed "as is." No warranty of any kind is expressed or implied. Use at your own risk. The author will not be liable for things such as "your hard drive was reformatted," "your cat died," or any other kind of loss while using or misusing this tool.

# CREDITS
## ORIGINAL MAINTAINER
		Pio 		-Orion-		siur2@yahoo.com
## CURRENT MAINTAINER
		Uncledan		-Orion-		uncledan@uncledan.it
		Larry Legend	-Artemis-	uncledan@uncledan.it
## FROM VERSION 1.5b2.004
		Sobkou	-Orion-		sobkou.pardus@gmail.com
		Taurvi	-Artemis-	sobkou.pardus@gmail.com
## FROM VERSION 1.6
		Aeiri	-Artemis-	brad@bcable.net
		Jetix	-Orion-	brad@bcable.net

# IMAGES
All images are Copyright (c) 2003-2010 Bayer & Szell OG. All Rights Reserved.

# KNOWN BUGS/TO DO LIST
- Missions are shared even if permissions would not allow [Uncledan]
- Users Adminstration Page [Uncledan]
- *SOLVED* Use the defined variable "DB_TABLE_PREFIX" to make customization easier [Uncledan]
- Add a bridge for phpBB3/Use phpBB3 User Table [Sobkou]
- Logs were stored by their own unique ID number (they should probably instead be stored by a concatenation of universe number (O=0, A=1, P=2), and the original combat log ID. This would prevent out-of-sequence logs from showing up (happens fairly often) [Lucky Seven]
- *SOLVED* Logs that have a single quote (') in the name fields are quoted twice before DB insertion. this results in having name fields in the results show up like "Uncledan\'s Robot Factory". I looked for this, but couldn't determine the source. This is probably a result of the user.JS file escaping the sequence, and then the PHP code escaping it again before insertion into the DB [Lucky Seven]
- Improve war missions store [Uncledan]
- Add a button to share only war missions [Uncledan]
- Add a feature to delete stored data without recurring to phpMyAdmin [Uncledan]
- *SOLVED* missions not correctly uploaded [Taurvi]
- Resources images not uploaded (or displayed?) in freak/guru hacks [Uncledan]
- More search criteria. At least in the version I'm looking at, there are only filters on type, outcome, ambush or not, and opponent. I'd like to see the ability to filter on location, ship, guns and/or missiles, number of rounds, etc. The more the merrier! [Killer]
- Sort order by clicking on the heading [Killer]
- Possibility of deleting single/multiple payments [Uncledan]
- Possibly more

# VERSION HISTORY

## 1.6.12 (2022-03-27)
- fix PHP 7.4 compatability issues, including replacing `split()` with `explode()`
- add Dockerfile and docker-compose.yml
- add `setting_mod.php` for development
- update `readme.md`
- add https to includes and matches in user script
- fix `v()` function in `modules/hack_mod.php`

## 1.6.11 (2012-04-24)
- nowrap mod Jivemaster by http://forum.pardus.at/index.php?showtopic=57706&view=findpost&p=1170585
- aligned relase in GM scripts

## 1.6.10 (2012-03-24)
- fix_hack_img.php fix by Jivemaster http://forum.pardus.at/index.php?showtopic=57706&view=findpost&p=1167819
- accounts.php fix by Jivemaster http://forum.pardus.at/index.php?showtopic=57706&view=findpost&p=1167819
- quoted line 35 in security_mod-php (debug line)
- fix to javascript for "raided" outcome by Jivemaster http://forum.pardus.at/index.php?showtopic=57706&st=0&#

## 1.6.9 (2012-03-11)
- Turnover fix by Wes http://forum.pardus.at/index.php?showtopic=35120&view=findpost&p=1165199
- Combats fix for raid and more by Spoilerhead http://code.google.com/p/pardus-infocenter/issues/detail?id=20#c1

## 1.6.8 (2012-02-26)
- Added fixes for damage view by Bsg http://forum.pardus.at/index.php?showtopic=35120&st=285# (Thanks!!)
- Moved version informetions to "modules/version_mod.php" to make upgrade esasier
- Renamed "modules/settings_mod.php" to "modules/sample.settings_mod.php" to make upgrade esasier

## 1.6.7 (2011-05-28)
- Added a fix to make sure the "easy" script is interpreted as javascript for GreaseMonkey to detect.

## 1.6.6 (2011-01-10)
- Added some payments types
- Added the locust NPC family to npc_images.php
- UserScript header cleanup, fix to be more compatible with Google Chrome and added showDebug variable management
- Added support for encrypted password in UserScript (improved security)
- Revised "combat_add.php", "hack_add.php", "missions_add.php", "payment_add.php" to enable enctypted passwords in UserScript
- Revised "easy/pardus_infocenter_share.user.js" to enable enctypted passwords in UserScript
- Added "pardus_infocenter_share.user.php" and FORCE_USERSCRIPT_DOWNLOAD variable to force download UserScript where server fails to recognize .htaccess directive

## 1.6.5 (2010-10-09)
 - Fixed the 'easy' script to be more compatible with different configurations.

## 1.6.4 (2010-09-18)
 - Fixed a bug with hacks showing up wrong when no buildings were owned.
 - Fixed a bug with trade log hacks when a user uses their own image pack.
 - Added support for mission sharing with compact mode enabled on the bulletin board screen.

## 1.6.3 (2010-09-11)
 - Added support for trade log hacks to the userscript and backend.
 - Added support for clearing missions since they overwhelm the system so easily (this is customizable in settings_mod.php). As requested by Evil Knight.
 - Fixed security holes (SQL injection) in the XML fields being received by hack_add.php.

## 1.6.2 (2010-09-08)
 - Added support for Admins to delete hacks and combats.
 - Fixed guru hack bug.
 - Fixed a bug with the levels not being sorted correctly.
 - Added the fix file for <IMG> to <IMG_NAME> XML names. This converts old data to new data.
 - Cosmetic changes to the userscript and other files.

## 1.6.001 (2010-07-19)
 - fixed the DB_TABLE_PREFIX bug

## 1.6 (2010-07-18)
 - Added security levels, ('Open', 'Confidential', 'Admin').
 - Added public access for viewing 'Open' submissions.
 - Added security level selection to userscript.
 - Added commenting system.
 - Added payment logging system.
 - Added account management.
 - Added a new permissions system that is bitwise, allowing full control over permissions to the users.
 - Added an 'easy' mode for installing the GM script, which fills everything out for the user.
 - Fixed bug with squadron vs squadron combat.
 - Fixed bug with hack level when no buildings are owned.
 - Reversed the effects of magic quotes if it is enabled, fixing extra slashes showing up everywhere.  Removed the "brute repairs" that people were doing since they thought it was a javascript bug.

## 1.5b2.005 (2010-04-16)
 - revised "hack_add.php" (thanks Macbeth) *Uncledan*

## 1.5b2.004f (2010-03-07)
 - revised "mission_add.php" *Pio*
 - revised "pardus_infocenter_share.user.js" *Sobkou*

## 1.5b2.004e (2010-03-05)
 - Revised "modules/mission_mod" to fix upload bug when variable DB_TABLE_PREFIX is used *Uncledan*

## 1.5b2.004d (2010-02-27)
 - Revised "modules/combat_mod.php" to avoid "Sombebody\'s Building" bug *Uncledan*
 - Revised "modules/account_mod", "modules/combat_mod.php", "modules/hack_mod.php", "modules/mission_mod" to use the predefined
   variable DB_TABLE_PREFIX *Uncledan*

## 1.5b2.004b = 1.5b2.004c (2010-02-25)
 - Revised "main.php" header tag to copy exact Pardus docking page layout *Uncledan*
 - Revised "index.php", "combats.php", "combat_add.php", "combat_details.php", "hacks.php", "hack_add.php", "hack_details.php",
   "missions.php", "mission_add.php" to reflect new enhanced permissions table *Uncledan*
     0 = banned user
     1 = can share ALL
     2 = can view ALL
     3 = can both share and view ALL
     4 = can share only combats
     5 = can view only combats
     6 = can both share and view only combats
     7 = can share only hacks
     8 = can view only hacks
     9 = can both share and only hacks

## 1.5b2.004a (2010-02-24)
 - Revised "index.php" to add Universe icon near username and to display in red higher permission level user (=3) *Uncledan*
 - Revised "modules/security_mod.php" to enable not encrypted passwords (compatibility with 1.5b2 versions) *Uncledan*
 - Deleted "downloads.php" as useless with the single "GM Script" *Uncledan*
 - Changed "dock.php" to "main.php" and made it default page after logging in
 - Added variables in "/modules/settings_mod.php" for ease of setup *Uncledan*
 - Fixed "missions.php" and "npc_images.php" to reflect new image pack (wormhole
   is a PNG and no more a GIF in HQ pack) *Uncledan*

## 1.5b2.004 (2010-02-15)
 - Incorporated a single "GM Script" that can share all (Courtesy of Uncledan)
 - Deleted "downloads.php" as useless with the single "GM Script" *Uncledan*
 - Changed "dock.php" to "main.php" and made it default page after logging in
 - Added variables in "/modules/settings_mod.php" for ease of setup *Uncledan*
 - Edited "index.php" to reflect above change and to add a logout button.
 - Revised "modules/missions_mod.php"
 - Added code to allow sorting by "Source" of mission and 	"Destination" (sector)
 - Revised "missions.php"
 - Added code to allow sorting by "Source" of mission and 	"Destination" (Sector)
 - Fixed "missions.php" and "npc_images.php" to reflect new image pack (wormhole is a PNG and no more a GIF in HQ pack) *Uncledan*
 - Revised the "/modules/settings_mod.php"
 - Added comments for easier setup
 - Set new "HQ" image pack as default
 - Added default "Artemis Logs"
 - Revised the "readme.txt" and created a formatted PDF/Word document.

## 1.5b2.003 (2009-08-20)
 - code cleanup from my (Pardus) messy updates
 - added variable to choose starting page (and logout type)
 - added variable for future use as table prefix in database

## 1.5b2.002 (2009-08-10)
 - fixed other missing titles in pages
 - added some variables in settings_mod.php for an easier customization
 - added feature to enable/disable combat/hack/mission share (variables in settings_mod.php)

## 1.5b2.001 (2009-05-31)
 - fixed missing title tag in login screen
 - password are now stored in MD5 and not in plaint text (password control changed in the login)
 - added a download page for GMscripts
 - added feature for hackers not to send their position to the db
 - added a permissions feature for the users (0=disabled, 1=can only share logs, 2=can only view logs, 3=can both share and read logs, 4=reserved for future admin features)

## 1.5b2 (2009-04-16)
 - fixed share_hack.user.js to work with new hack page html wich was updated by Pardus developers recently
 - fixed bug (file npc_images.php) occuring on some php hosts causing combat details are not displayed

## 1.5b1 (2008-01-06)
 - removed most if not all php notices in server error log
 - fixed bug: sometimes last page for hack or combat list is empty
 - number of rounds for PvB combat log now shows total amount of rounds player was attacked by building modules
 - improved page navigator
 - ! implemented share missions feature (except TSS and war missions)

