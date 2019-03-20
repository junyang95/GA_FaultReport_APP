function filterSelection(ID_listGroup, ID_listGroupItem) {
    $("#" + ID_listGroup + ">li.active").removeClass("active");
    $('#' + ID_listGroupItem).addClass('active');
}