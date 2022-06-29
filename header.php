<!DOCTYPE html>
<html <?php language_attributes(); ?> class="no-js no-svg">
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <link rel="profile" href="http://gmpg.org/xfn/11">
    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

<?php
    echo '<title>'.get_bloginfo( 'name' ).'</title>';
    echo '<meta name="description" content="'.get_bloginfo( 'description' ).'">';
    echo '<meta name="keywords" content="zee-plaats-werk-land, delta werken, design, zee, delta, plaats, werk, land, research, map, source, urban, re-cycle, design award, ontwerp, ontwerpen, residual, reflect, strategy, empatic, field, mapping, ontwerppraktijk, resource-platform, platform, material, practice, process, Ester van de Wiel, Joost Adriaanse, info, theory, praktijk, flow, reframe, re-frame, onderzoeksproject, education, Biotopische slibfabriek, papierbeheer, groene intocht, publiek depot, tijdsteen, steentijd, stadshovenier, dutch design award, dutch design, dda, re-duce, re-manufacture, re-order, re-pair, re-purpose, re-shape, re-tell, recycle, ontwerpers, We-Are-Amp, Tim Heijmans, Moniek Ellen, Oddsized, Webdesign Den Haag, Carl Muller, Design Academy Eindhoven, lectoraat Places and Traces, Vrije Universiteit Amsterdam, Design Cultures, Faculty of Humanities, Gemeente Rotterdam, NWO, NWO+SIA smart culture">'."\r\n";

    $stylesheet = get_template_directory_uri().'/style.css';
    echo '<link rel="stylesheet" id="wp-theme-main-style"  href="'.$stylesheet.'" type="text/css" media="all" />';

    $isotopecss = get_template_directory_uri().'/assets/isotope.css';
    echo '<link rel="stylesheet" id="wp-theme-main-style"  href="'.$isotopecss.'" type="text/css" media="all" />';


    $customstyles = get_template_directory_uri().'/assets/grid.css';
    echo '<link rel="stylesheet" id="wp-theme-main-style"  href="'.$customstyles.'" type="text/css" media="all" />';

    wp_head();

    $isotope = get_template_directory_uri().'/lib/js/isotope.js';
    echo '<script src="'.$isotope.'" type="text/javascript" media="all" /></script>';

    $imagesloaded = get_template_directory_uri().'/lib/js/imagesloaded.js';
    echo '<script src="'.$imagesloaded.'" type="text/javascript" media="all"></script>';

    $viewscript = get_template_directory_uri().'/assets/view.js';
    echo '<script src="'.$viewscript.'" type="text/javascript" media="all" /></script>';
?>
</head>
<?php echo '<body '.$headerbgstyle.' '; body_class(); echo '>'; ?>
