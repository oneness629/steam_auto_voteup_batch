var setTwoLoginCode = function () {
	document.getElementById("twofactorcode_entry").value='#login_code#';
};
var loginFun = function () {
	setTwoLoginCode();
	document.getElementById('login_twofactorauth_buttonset_incorrectcode').getElementsByClassName('auth_button')[0].click();
};
loginFun();
