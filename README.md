# Livingarchive
A Custom Wordpress theme with isotope category and tag weighting and sorting in a 3 fold info design

Info pages (info menu)

Articles (Theory)

Posts (Practice)


Development & Testing

Page load 5 queries; 
main query collecting page data*
collect the pages matching the mainmenu options
* is it an infopage or a post with tags? is it in articles category or not?
assign meta-tag tagweight to posts matching current tagfilter
collect published posts by tagweight in article category
collect published posts not in article category
