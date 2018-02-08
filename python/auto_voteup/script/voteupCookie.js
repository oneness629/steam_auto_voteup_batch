var wt629_com_setCookie = function(c_name,value,expiredays) {
	var exdate=new Date();
	exdate.setDate(exdate.getDate()+expiredays);
	document.cookie=c_name+ "=" +escape(value)+ ((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
};
wt629_com_setCookie('wt629_com_is_enable','1',365);
wt629_com_setCookie('wt629_com_is_show','1',365);
wt629_com_setCookie('wt629_com_is_timed_refresh','1',365);
wt629_com_setCookie('wt629_com_refresh_timeout',60,365);