<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:fb="https://www.facebook.com/2008/fbml">
    <head>
    	<?php
			$title = isset($_GET['title']) ? $_GET['title'] : 'Open Resto';
			$desc = isset($_GET['desc']) ? $_GET['desc'] : 'Open Restaurant adalah permainan HTML5 di mana Anda harus menjalankan restoran dan membawa keterampilan manajemen Anda ke setiap restoran! Bertahan dari target harian untuk mendapatkan skor tertinggi';
			$thumb = isset($_GET['thumb']) ? $_GET['thumb'] : 'https://anbupw.github.io/open/share.jpg';
			$width = isset($_GET['width']) ? $_GET['width'] : '590';
			$height = isset($_GET['height']) ? $_GET['height'] : '300';
			$url = isset($_GET['url']) ? $_GET['url'] : 'https://anbupw.github.io/open';
		?>
    
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title><?php echo $title;?></title>
        <meta property="og:title" content="<?php echo $title;?>" />
        <meta property="og:description" content="<?php echo $desc;?> "/>
        <meta property="og:image" content="<?php echo $thumb;?>"/>
        <meta property="og:image:width" content="<?php echo $width;?>"/>
		<meta property="og:image:height" content="<?php echo $height;?>"/>
    </head>
    <body>
        <script>
            window.location.href = "<?php echo $url;?>";
        </script>
    </body>

</html>
