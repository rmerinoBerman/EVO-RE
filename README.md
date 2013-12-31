Create data models powered by wordpress that are served as client side json objects

- install wordpress
- activate theme
- change defaults (defaultPage, defaultPageDir, pathPrefix, pathname) in dynamics.js
- create menu, add menu item, and set theme location to header menu
- go to settings->reading and assign a front page with using the template “Home”
- upload htaccess to root directory (see below for sample)
- create models

demo:
http://ezbiznyc.com/

htaccess sample
RewriteEngine On
RewriteBase /~ezbiznyc/
RewriteRule ^index\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . index.php [L]
