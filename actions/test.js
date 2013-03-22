
module.exports = function(req, res){
    var jsSrc = "js?http://www.mtmawards.com/Scripts/jquery/js/jquery-1.4.2.min.js,http://www.mtmawards.com/Scripts/Application.js";
    res.send("<script src='"+jsSrc+"'></script>");
};
