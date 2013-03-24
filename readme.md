Heeep.it automatically minifies and bundles your JavaScript, CSS, CoffeeScript, and LESS on demand. For common packages like jQuery or underscore, you can just include the package name.

#For Example

##BEFORE
		...
		<script src='//somecdn.com/jquery.js'></script>
		<script src='//somecdn.com/jquery-ui.js'></script>
		<script src='//yoursite.com/site.coffee'></script>
		<link href='//somecdn.com/jquery-ui.css'/>
		<link href='//yoursite.com/960.css'/>
		<link href='//yoursite.com/site.less'/>
		...
		
##AFTER
    <script src='//go.heeep.it?jquery-ui,960,site.coffee,site.less'></script>

Read more at http://about.heeep.it
